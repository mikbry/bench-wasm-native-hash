
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#examples
export async function hash(data, algorithm = 'SHA-256', method, dataType) {
    if (algorithm.toUpperCase() === 'MD5') {
        return 'Error: MD5 Not supported.';
    }
    if (!(method === 'JS' && dataType === 'ArrayBuffer')) {
        return `Error: ${method} using ${dataType} is not implemented for now.`;
    }
    const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(''); // convert bytes to hex string
    return hashHex;
}

export async function hashText(text, algorithm = 'SHA-256', method, dataType) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    return hash(data, algorithm, method, dataType);
}

export function hello() {
    return 'Hello World';
}