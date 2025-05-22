import { encryptText, decryptText } from './crypto.js';

const translations = {
    en: {
        title: "CryptiText",
        textLabel: "Text to Encrypt/Decrypt:",
        textPlaceholder: "Enter text here",
        passwordLabel: "Password:",
        passwordPlaceholder: "Enter password",
        iterationsLabel: "PBKDF2 Iterations:",
        autoClearLabel: "Auto-Clear Output After 5 Minutes:",
        encryptBtn: "Encrypt",
        decryptBtn: "Decrypt",
        copyBtn: "Copy",
        shareBtn: "Copy Link",
        mediaShareBtn: "Share to Media",
        qrBtn: "Show QR Code",
        resultLabel: "Result:",
        shareMessageLabel: "Share Message:",
        shareMessagePlaceholder: "Add a note for sharing",
        includePasswordLabel: "Include Password in Share Link:",
        charCount: "Characters",
        wordCount: "Words",
        errorDecrypt: "Decryption failed: Invalid data or password",
        errorEmpty: "Please enter both text and password",
        copySuccess: "Copied to clipboard!",
        shareSuccess: "Shareable link copied to clipboard!",
        mediaShareSuccess: "Opened sharing options!",
        mediaShareFallback: "Web Share API not supported. Copy the link to share.",
        autoClearMessage: "Output cleared for security",
        qrGenerated: "QR code generated!",
        shortcutHelp: "Shortcuts: Ctrl+Enter (Encrypt), Shift+Enter (Decrypt)"
    },
    fr: {
        title: "CryptiText",
        textLabel: "Texte à chiffrer/déchiffrer :",
        textPlaceholder: "Entrez le texte ici",
        passwordLabel: "Mot de passe :",
        passwordPlaceholder: "Entrez le mot de passe",
        iterationsLabel: "Itérations PBKDF2 :",
        autoClearLabel: "Effacer automatiquement la sortie après 5 minutes :",
        encryptBtn: "Chiffrer",
        decryptBtn: "Déchiffrer",
        copyBtn: "Copier",
        shareBtn: "Copier le lien",
        mediaShareBtn: "Partager sur les médias",
        qrBtn: "Afficher le code QR",
        resultLabel: "Résultat :",
        shareMessageLabel: "Message de partage :",
        shareMessagePlaceholder: "Ajouter une note pour le partage",
        includePasswordLabel: "Inclure le mot de passe dans le lien de partage :",
        charCount: "Caractères",
        wordCount: "Mots",
        errorDecrypt: "Échec du déchiffrement : Données ou mot de passe invalides",
        errorEmpty: "Veuillez entrer le texte et le mot de passe",
        copySuccess: "Copié dans le presse-papiers !",
        shareSuccess: "Lien partageable copié dans le presse-papiers !",
        mediaShareSuccess: "Options de partage ouvertes !",
        mediaShareFallback: "L'API de partage Web n'est pas prise en charge. Copiez le lien pour partager.",
        autoClearMessage: "Sortie effacée pour des raisons de sécurité",
        qrGenerated: "Code QR généré !",
        shortcutHelp: "Raccourcis : Ctrl+Entrée (Chiffrer), Shift+Entrée (Déchiffrer)"
    },
    es: {
        title: "CryptiText",
        textLabel: "Texto para encriptar/desencriptar:",
        textPlaceholder: "Ingrese el texto aquí",
        passwordLabel: "Contraseña:",
        passwordPlaceholder: "Ingrese la contraseña",
        iterationsLabel: "Iteraciones PBKDF2:",
        autoClearLabel: "Borrar salida automáticamente después de 5 minutos:",
        encryptBtn: "Encriptar",
        decryptBtn: "Desencriptar",
        copyBtn: "Copiar",
        shareBtn: "Copiar enlace",
        mediaShareBtn: "Compartir en medios",
        qrBtn: "Mostrar código QR",
        resultLabel: "Resultado:",
        shareMessageLabel: "Mensaje para compartir:",
        shareMessagePlaceholder: "Añade una nota para compartir",
        includePasswordLabel: "Incluir contraseña en el enlace compartido:",
        charCount: "Caracteres",
        wordCount: "Palabras",
        errorDecrypt: "Fallo en la desencriptación: Datos o contraseña inválidos",
        errorEmpty: "Por favor, ingrese tanto el texto como la contraseña",
        copySuccess: "¡Copiado al portapapeles!",
        shareSuccess: "¡Enlace compartible copiado al portapapeles!",
        mediaShareSuccess: "¡Opciones de compartir abiertas!",
        mediaShareFallback: "La API de compartir web no es compatible. Copia el enlace para compartir.",
        autoClearMessage: "Salida borrada por seguridad",
        qrGenerated: "¡Código QR generado!",
        shortcutHelp: "Atajos: Ctrl+Enter (Encriptar), Shift+Enter (Desencriptar)"
    },
    bn: {
        title: "ক্রিপ্টিটেক্সট",
        textLabel: "এনক্রিপ্ট/ডিক্রিপ্ট করার জন্য টেক্সট:",
        textPlaceholder: "এখানে টেক্সট লিখুন",
        passwordLabel: "পাসওয়ার্ড:",
        passwordPlaceholder: "পাসওয়ার্ড লিখুন",
        iterationsLabel: "পিবিকেডিএফ২ ইটারেশন:",
        autoClearLabel: "৫ মিনিট পর আউটপুট স্বয়ংক্রিয়ভাবে মুছে ফেলুন:",
        encryptBtn: "এনক্রিপ্ট",
        decryptBtn: "ডিক্রিপ্ট",
        copyBtn: "কপি",
        shareBtn: "লিঙ্ক কপি",
        mediaShareBtn: "মিডিয়াতে শেয়ার",
        qrBtn: "কিউআর কোড দেখান",
        resultLabel: "ফলাফল:",
        shareMessageLabel: "শেয়ার বার্তা:",
        shareMessagePlaceholder: "শেয়ারের জন্য একটি নোট যোগ করুন",
        includePasswordLabel: "শেয়ার লিঙ্কে পাসওয়ার্ড অন্তর্ভুক্ত করুন:",
        charCount: "অক্ষর",
        wordCount: "শব্দ",
        errorDecrypt: "ডিক্রিপশন ব্যর্থ: অবৈধ ডেটা বা পাসওয়ার্ড",
        errorEmpty: "দয়া করে টেক্সট এবং পাসওয়ার্ড উভয়ই লিখুন",
        copySuccess: "ক্লিপবোর্ডে কপি করা হয়েছে!",
        shareSuccess: "শেয়ারযোগ্য লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে!",
        mediaShareSuccess: "শেয়ারিং বিকল্প খোলা হয়েছে!",
        mediaShareFallback: "ওয়েব শেয়ার এপিআই সমর্থিত নয়। শেয়ার করতে লিঙ্ক কপি করুন।",
        autoClearMessage: "নিরাপত্তার জন্য আউটপুট মুছে ফেলা হয়েছে",
        qrGenerated: "কিউআর কোড তৈরি করা হয়েছে!",
        shortcutHelp: "শর্টকাট: Ctrl+Enter (এনক্রিপ্ট), Shift+Enter (ডিক্রিপ্ট)"
    }
};

function updateLanguage(lang) {
    const t = translations[lang];
    document.getElementById("title").textContent = t.title;
    document.querySelector("label[for='text-input']").textContent = t.textLabel;
    document.getElementById("text-input").placeholder = t.textPlaceholder;
    document.querySelector("label[for='password']").textContent = t.passwordLabel;
    document.getElementById("password").placeholder = t.passwordPlaceholder;
    document.querySelector("label[for='iterations']").textContent = t.iterationsLabel;
    document.querySelector("label[for='auto-clear']").textContent = t.autoClearLabel;
    document.getElementById("encrypt-btn").textContent = t.encryptBtn;
    document.getElementById("decrypt-btn").textContent = t.decryptBtn;
    document.getElementById("copy-btn").textContent = t.copyBtn;
    document.getElementById("share-btn").textContent = t.shareBtn;
    document.getElementById("media-share-btn").textContent = t.mediaShareBtn;
    document.getElementById("qr-btn").textContent = t.qrBtn;
    document.querySelector("label[for='output']").textContent = t.resultLabel;
    document.querySelector("label[for='share-message']").textContent = t.shareMessageLabel;
    document.getElementById("share-message").placeholder = t.shareMessagePlaceholder;
    document.querySelector("label[for='include-password']").textContent = t.includePasswordLabel;
    document.getElementById("theme-toggle").textContent = t.themeToggle || "Toggle Dark Mode";
    document.getElementById("error").textContent = t.shortcutHelp;
    updateCharCount(lang);
}

function updateCharCount(lang) {
    const text = document.getElementById("text-input").value;
    const charCount = text.length;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    document.getElementById("char-count").textContent = `${charCount} ${translations[lang].charCount}, ${wordCount} ${translations[lang].wordCount}`;
}

async function showSpinner(operation) {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";
    try {
        return await operation();
    } finally {
        spinner.style.display = "none";
    }
}

let clearTimeoutId = null;

function scheduleAutoClear(lang) {
    if (document.getElementById("auto-clear").checked) {
        if (clearTimeoutId) clearTimeout(clearTimeoutId);
        clearTimeoutId = setTimeout(() => {
            document.getElementById("output").value = "";
            document.getElementById("error").textContent = translations[lang].autoClearMessage;
        }, 5 * 60 * 1000);
    }
}

document.getElementById("language").addEventListener("change", (e) => {
    const lang = e.target.value;
    localStorage.setItem("language", lang);
    updateLanguage(lang);
});

document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

document.getElementById("text-input").addEventListener("input", (e) => {
    updateCharCount(document.getElementById("language").value);
});

document.getElementById("auto-clear").addEventListener("change", (e) => {
    localStorage.setItem("autoClear", e.target.checked);
    if (!e.target.checked && clearTimeoutId) {
        clearTimeout(clearTimeoutId);
        clearTimeoutId = null;
    }
});

document.getElementById("toggle-password").addEventListener("click", () => {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.querySelector(".eye-icon");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        eyeIcon.textContent = "👁️";
    }
});

document.getElementById("encrypt-btn").addEventListener("click", async () => {
    const text = document.getElementById("text-input").value;
    const password = document.getElementById("password").value;
    const iterations = parseInt(document.getElementById("iterations").value);
    const error = document.getElementById("error");
    const output = document.getElementById("output");
    const lang = document.getElementById("language").value;
    
    if (!text || !password) {
        error.textContent = translations[lang].errorEmpty;
        output.value = "";
        return;
    }
    
    await showSpinner(async () => {
        try {
            const encrypted = await encryptText(text, password, iterations);
            output.value = encrypted;
            error.textContent = "";
            scheduleAutoClear(lang);
        } catch (err) {
            error.textContent = err.message;
            output.value = "";
        }
    });
});

document.getElementById("decrypt-btn").addEventListener("click", async () => {
    const text = document.getElementById("text-input").value;
    const password = document.getElementById("password").value;
    const iterations = parseInt(document.getElementById("iterations").value);
    const error = document.getElementById("error");
    const output = document.getElementById("output");
    const lang = document.getElementById("language").value;
    
    if (!text || !password) {
        error.textContent = translations[lang].errorEmpty;
        output.value = "";
        return;
    }
    
    await showSpinner(async () => {
        try {
            const decrypted = await decryptText(text, password, iterations);
            output.value = decrypted;
            error.textContent = "";
            scheduleAutoClear(lang);
        } catch (err) {
            error.textContent = translations[lang].errorDecrypt;
            output.value = "";
        }
    });
});

document.getElementById("copy-btn").addEventListener("click", () => {
    const output = document.getElementById("output").value;
    const lang = document.getElementById("language").value;
    if (output) {
        navigator.clipboard.writeText(output).then(() => {
            document.getElementById("error").textContent = translations[lang].copySuccess;
        }).catch(() => {
            document.getElementById("error").textContent = "Failed to copy to clipboard";
        });
    }
});

document.getElementById("share-btn").addEventListener("click", () => {
    const output = document.getElementById("output").value;
    const password = document.getElementById("password").value;
    const includePassword = document.getElementById("include-password").checked;
    const lang = document.getElementById("language").value;
    if (output) {
        const url = includePassword
            ? `${window.location.origin}?encrypted=${encodeURIComponent(output)}&password=${encodeURIComponent(password)}`
            : `${window.location.origin}?encrypted=${encodeURIComponent(output)}`;
        navigator.clipboard.writeText(url).then(() => {
            document.getElementById("error").textContent = translations[lang].shareSuccess;
        }).catch(() => {
            document.getElementById("error").textContent = "Failed to copy shareable link";
        });
    }
});

document.getElementById("media-share-btn").addEventListener("click", () => {
    const output = document.getElementById("output").value;
    const password = document.getElementById("password").value;
    const includePassword = document.getElementById("include-password").checked;
    const shareMessage = document.getElementById("share-message").value || translations[lang].resultLabel;
    const lang = document.getElementById("language").value;
    if (output) {
        const url = includePassword
            ? `${window.location.origin}?encrypted=${encodeURIComponent(output)}&password=${encodeURIComponent(password)}`
            : `${window.location.origin}?encrypted=${encodeURIComponent(output)}`;
        if (navigator.share) {
            navigator.share({
                title: translations[lang].title,
                text: shareMessage,
                url: url
            }).then(() => {
                document.getElementById("error").textContent = translations[lang].mediaShareSuccess;
            }).catch(() => {
                document.getElementById("error").textContent = translations[lang].mediaShareFallback;
                navigator.clipboard.writeText(url);
            });
        } else {
            document.getElementById("error").textContent = translations[lang].mediaShareFallback;
            navigator.clipboard.writeText(url);
        }
    }
});

document.getElementById("qr-btn").addEventListener("click", () => {
    const output = document.getElementById("output").value;
    const password = document.getElementById("password").value;
    const includePassword = document.getElementById("include-password").checked;
    const lang = document.getElementById("language").value;
    if (output) {
        const url = includePassword
            ? `${window.location.origin}?encrypted=${encodeURIComponent(output)}&password=${encodeURIComponent(password)}`
            : `${window.location.origin}?encrypted=${encodeURIComponent(output)}`;
        const qrCodeDiv = document.getElementById("qr-code");
        qrCodeDiv.style.display = "block";
        qrCodeDiv.innerHTML = "";
        new QRCode(qrCodeDiv, { text: url, width: 128, height: 128 });
        document.getElementById("error").textContent = translations[lang].qrGenerated;
    }
});

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
        document.getElementById("encrypt-btn").click();
    } else if (e.shiftKey && e.key === "Enter") {
        document.getElementById("decrypt-btn").click();
    }
});

// Initialize language and theme
const savedLang = localStorage.getItem("language") || "en";
document.getElementById("language").value = savedLang;
updateLanguage(savedLang);

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

if (localStorage.getItem("autoClear") === "false") {
    document.getElementById("auto-clear").checked = false;
}

// Load encrypted text and password from URL if present
const params = new URLSearchParams(window.location.search);
if (params.has("encrypted")) {
    document.getElementById("text-input").value = params.get("encrypted");
}
if (params.has("password")) {
    document.getElementById("password").value = params.get("password");
}