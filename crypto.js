export async function deriveKey(password, salt, iterations = 100000) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: iterations,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

export async function encryptText(text, password, iterations) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt, iterations);
    
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
    );
    
    const encryptedArray = new Uint8Array(encrypted);
    const result = new Uint8Array(salt.length + iv.length + encryptedArray.length);
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(encryptedArray, salt.length + iv.length);
    
    return btoa(String.fromCharCode(...result));
}

export async function decryptText(encryptedBase64, password, iterations) {
    try {
        const encryptedData = new Uint8Array(
            atob(encryptedBase64)
                .split("")
                .map(char => char.charCodeAt(0))
        );
        const salt = encryptedData.slice(0, 16);
        const iv = encryptedData.slice(16, 28);
        const data = encryptedData.slice(28);
        
        const key = await deriveKey(password, salt, iterations);
        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            data
        );
        
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (error) {
        throw new Error("Decryption failed: Invalid data or password");
    }
}