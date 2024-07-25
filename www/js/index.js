import { hash, hello } from './utils.js';

const methods = {
    'JS': {
        name: 'Js Web Crypto API',
        algorithms: [
            { text: "SHA-1", value: "sha-1" },
            { text: "SHA-256", value: "sha-256" },
            { text: "SHA-384", value: "sha-384" },
            { text: "SHA-512", value: "sha-512" },
            { text: "MD5", value: "md5" },
        ],
        data: [
            { text: "TypedArray", value: "TypedArray" },
        ],
        description: 'Javascript Web Crypto API is the buildin interface allowing a script to use cryptographic primitives in order to build systems using cryptography. MD5 is not supported. Also streaming is not supported, so reading large files file will failed.',
        link: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API',
    },
    'WASM-Bindgen': {
        algorithms: [
            { text: "SHA-1", value: "sha-1" },
            { text: "SHA-256", value: "sha-256" },
            { text: "SHA-384", value: "sha-384" },
            { text: "SHA-512", value: "sha-512" },
            { text: "MD5", value: "md5" },
        ],
        data: [
            { text: "Bytes", value: "Bytes" },
            { text: "TypedArray", value: "TypedArray" },
            { text: "Stream", value: "Stream" },
        ],
        description: 'TODO: Implementing crypto using WASM Bindgen and Rust crypto functions.',
        link: 'https://mikbry.com/',
    },
    'WASM': {
        algorithms: [
            { text: "SHA-1", value: "sha-1" },
            { text: "SHA-256", value: "sha-256" },
            { text: "SHA-384", value: "sha-384" },
            { text: "SHA-512", value: "sha-512" },
            { text: "MD5", value: "md5" },
        ],
        data: [
            { text: "Bytes", value: "Bytes" },
            { text: "ArrayBuffer", value: "ArrayBuffer" },
            { text: "Stream", value: "Stream" },
        ],
        description: 'TODO: WASM without Bindgen, bare to the metal. See if size and speed are betters.',
        link: 'https://mikbry.com/',
    },
    'Hash-WASM': {
        algorithms: [
            { text: "SHA-1", value: "sha-1" },
            { text: "SHA-256", value: "sha-256" },
            { text: "SHA-384", value: "sha-384" },
            { text: "SHA-512", value: "sha-512" },
            { text: "MD5", value: "md5" },
        ],
        data: [
            { text: "TypedArray", value: "TypedArray" },
            { text: "Stream", value: "Stream" },
        ],
        description: 'Hash done using Hash-WASM, Lightning fast hash functions using hand-tuned WebAssembly C.',
        link: 'https://mikbry.com/',
    },
};

const text = hello();
const digest = await hash(text);
console.log(text, digest);

function getUiElements() {
    const fileInput = document.getElementById('fileInput');
    const textInput = document.getElementById('textInput');
    const methodSelect = document.getElementById('methodSelect');
    const algorithmSelect = document.getElementById('algorithmSelect');
    const dataSelect = document.getElementById('dataSelect');
    const output = document.getElementById('output');
    const outputInfo = document.getElementById('outputInfo');
    const generateButton = document.getElementById('generateButton');
    const settingsDescription = document.getElementById('settingsDescription');
    const settingsLink = document.getElementById('settingsLink');
    return { fileInput, textInput, algorithmSelect, dataSelect, methodSelect, output, outputInfo, generateButton, settingsDescription, settingsLink };
}

function displayError(error, { output, outputInfo, generateButton }) {
    output.textContent = '';
    outputInfo.textContent = error;
    outputInfo.classList.add("error");
    generateButton.disabled = false;
}

function displayOutput(digest, inputName, dataType, duration, ui) {
    const { generateButton, methodSelect, algorithmSelect, output, outputInfo } = ui;
    // Update the output
    if (digest.indexOf('Error') !== -1) {
        displayError(digest, ui);
        return;
    }
    output.textContent = digest;

    outputInfo.classList.remove("error");
    outputInfo.textContent = `${algorithmSelect.selectedOptions[0].text} Hash generated from ${inputName} with ${dataType} using ${methodSelect.selectedOptions[0].text} in ${duration} ms`;

    generateButton.disabled = false;
}

async function generateHash(event) {
    event.preventDefault();
    const ui = getUiElements();
    const { fileInput, textInput, dataSelect, methodSelect, algorithmSelect, output, outputInfo, generateButton } = ui;

    const algorithm = algorithmSelect.value;
    const method = methodSelect.value;
    const dataType = dataSelect.value;
    const file = fileInput.files?.[0];
    const start = performance.now();
    if (!file) {
        if (textInput.value) {
            const digest = await hash(textInput.value, algorithm, method, 'String');
            const end = performance.now();
            displayOutput(digest, 'input text', 'String', end - start, ui);
            return;
        }
        output.textContent = 'No Input available...';
        outputInfo.textContent = '';
        return;
    }
    generateButton.disabled = true;
    const filename = fileInput.files[0].name;
    output.textContent = 'Processing...';
    const reader = new FileReader();
    reader.addEventListener('load', async (event) => {
        // let data = new Uint8Array(event.target.result);
        let data = event.target.result;
        fileInput.value = null;
        fileInput.dispatchEvent(new Event('change'));
        const digest = await hash(data, algorithm, method, dataType);
        const end = performance.now();
        displayOutput(digest, filename, dataType, end - start, ui);
    });
    reader.addEventListener('progress', (event) => {
        if (event.loaded && event.total) {
            const percent = (event.loaded / event.total) * 100;
            output.textContent = `Processing: ${Math.round(percent)}%`;
        }
    });
    reader.addEventListener('error', () => {
        const error = reader.error;
        displayError(`${error.name}: ${error.message}`, ui);
    });
    reader.addEventListener('abort', () => {
        outputInfo.textContent = `Cancelled`;
    });
    try {
        reader.readAsArrayBuffer(file);
    } catch (error) {
        displayError(`${error.name}: ${error.message}`, ui);
    }

}

function buildSelect(select, items) {
    select.options.length = 0;
    items.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.value;
        option.text = item.text;
        select.add(option);
    });
}

function resetSettings(method, ui) {
    const { settingsDescription, settingsLink, algorithmSelect, dataSelect } = ui;
    buildSelect(algorithmSelect, methods[method].algorithms);
    buildSelect(dataSelect, methods[method].data);
    settingsDescription.textContent = methods[method].description;
    settingsLink.href = methods[method].link;
}

function initUI() {
    const ui = getUiElements();
    const { generateButton, methodSelect, algorithmSelect, dataSelect } = ui;
    generateButton.addEventListener('click', generateHash);
    const methodOptions = Object.keys(methods).map((key) => ({ text: methods[key].name || key, value: key }));
    buildSelect(methodSelect, methodOptions);
    resetSettings('JS', ui);
    methodSelect.addEventListener('change', () => {
        resetSettings(methodSelect.value, ui);
    });
}

initUI();
