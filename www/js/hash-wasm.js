export default async function hash_wasm(rawData, algorithm, dataType) {
    const { sha1, sha256, sha384, sha512, md5 } = await import("https://unpkg.com/hash-wasm@4.11.0/dist/index.esm.js");
    let data;
    if (dataType === 'String') {
        data = rawData;
    } else if (dataType === 'TypedArray') {
        // TypedArray
        data = new Uint8Array(data);
    } else {
        return `Error: Hash-WASM using ${dataType} is not implemented for now.`;
    }
    console.log('data=', data, rawData);
    try {
        switch (algorithm) {
            case "sha-1":
                return await sha1(data);
            case "sha-256":
                return await sha256(data);
            case "sha-384":
                return await sha384(data);
            case "sha-512":
                return await sha512(data);
            case "md5":
                return await md5(data);
            default:
                break;
        }
    } catch (error) {
        console.error(error);
        return `${error.name}: ${error.message}`;
    }
    return `Error: Hash-WASM using ${algorithm} is not implemented for now.`;
}