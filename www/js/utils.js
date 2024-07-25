import hash_wasm from "./hash-wasm.js";

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#examples
async function cryptoHash(rawData, algorithm, dataType) {
    if (algorithm.toUpperCase() === 'MD5') {
        return 'Error: MD5 Not supported.';
    }

    let data = rawData;
    if (typeof data === 'string') {
        const encoder = new TextEncoder();
        data = encoder.encode(data);
    } else if (dataType === 'TypedArray') {
        data = new Uint8Array(data);
    } else {
        return `Error: JS Crypto API with ${dataType} is not available.`;
    }
    try {
        const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, '0'))
            .join(''); // convert bytes to hex string
        return hashHex;
    } catch (error) {
        return `${error.name}: ${error.message}`;
    }
}

export async function hash(rawData, algorithm = 'SHA-256', method = 'JS', dataType = 'TypedArray') {
    console.log("method=", method);
    if (method === 'JS') {
        return cryptoHash(rawData, algorithm, dataType);
    } else if (method === 'Hash-WASM') {
        return hash_wasm(rawData, algorithm, dataType);
    }
    return `Error: ${method} with ${dataType} using ${algorithm} is not implemented for now.`;
}

export function hello() {
    return 'Hello World';
}