import { encryptText, decryptText } from './crypto.js';

// Helper functions for HMAC and SHA-256
async function computeHmacSha256(data, key) {
    try {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(key);
        const dataData = encoder.encode(data);
        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );
        const signature = await crypto.subtle.sign("HMAC", cryptoKey, dataData);
        return Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    } catch (err) {
        console.error("HMAC computation failed:", err);
        throw new Error("Failed to compute HMAC-SHA256");
    }
}

async function computeSha256Fingerprint(data) {
    try {
        const encoder = new TextEncoder();
        const dataData = encoder.encode(data);
        const hash = await crypto.subtle.digest("SHA-256", dataData);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .slice(0, 16);
    } catch (err) {
        console.error("SHA-256 fingerprint computation failed:", err);
        throw new Error("Failed to compute password fingerprint");
    }
}

function sanitizeInput(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/\bon\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, "");
}
// Translations
const translations = {
    en: {
        title: "StarryCrypt",
        textLabel: "Text to Encrypt/Decrypt:",
        textPlaceholder: "Enter text here or drag-and-drop .txt/.enc.txt",
        passwordLabel: "Password:",
        passwordPlaceholder: "Enter password",
        iterationsLabel: "PBKDF2 Iterations:",
        iterationsRecommendation: "Recommended: 100,000+",
        autoClearLabel: "Auto-Clear Output After:",
        autoClearClipboardLabel: "Auto-Clear Clipboard After:",
        autoClearInactivityLabel: "Auto-Clear Storage & Clipboard After Inactivity:",
        messageExpirationLabel: "Auto-Wipe Decrypted Output After:",
        messageExpirationMinutes: "minutes",
        autoClearSeconds: "seconds",
        encryptBtn: "Encrypt",
        decryptBtn: "Decrypt",
        copyBtn: "Copy",
        shareBtn: "Copy Link",
        mediaShareBtn: "Share to Media",
        qrBtn: "Show QR Code",
        downloadBtn: "Download .enc.txt",
        importBtn: "Import .enc.txt",
        starIdLabel: "Star ID (Password Fingerprint):",
        hmacLabel: "Enable HMAC-SHA256 Integrity Check:",
        resultLabel: "Result:",
        shareMessageLabel: "Share Message:",
        shareMessagePlaceholder: "Add a note for sharing",
        defaultShareMessage: "Encrypted message from StarryCrypt",
        includePasswordLabel: "Include Password in Share Link:",
        charCount: "Characters",
        wordCount: "Words",
        charCountWarning: "Warning: Text exceeds 100 characters. Shorten for QR code compatibility.",
        errorDecrypt: "Decryption failed: Invalid data or password",
        errorEmpty: "Please enter both text and password",
        errorQrTooLong: "QR code generation failed: URL too long (over ~300 characters). Try shorter text, uncheck 'Include Password', or copy the link instead.",
        errorQrNoData: "Cannot generate QR code: No shareable link available. Please encrypt or decrypt text first.",
        errorQrLibrary: "QR code generation failed: QRCode library not loaded.",
        errorHmac: "HMAC verification failed: Data may have been tampered with",
        errorFileType: "Invalid file: Only .txt or .enc.txt files are supported",
        errorFileRead: "Failed to read file",
        errorFileSize: "File too large (max 1MB)",
        errorIterations: "PBKDF2 iterations must be between 100,000 and 10,000,000",
        copySuccess: "Copied to clipboard!",
        shareSuccess: "Shareable link copied to clipboard!",
        mediaShareSuccess: "Opened sharing options!",
        mediaShareFallback: "Web Share API not supported. Copy the link to share.",
        autoClearMessage: "Output cleared for security",
        autoClearClipboardMessage: "Clipboard cleared for security",
        autoClearInactivityMessage: "Storage and clipboard cleared due to inactivity",
        messageExpirationMessage: "Decrypted output wiped for security",
        qrGenerated: "QR code generated!",
        copyStarIdSuccess: "Star ID copied to clipboard!",
        downloadSuccess: "Downloaded encrypted output as .enc.txt",
        importSuccess: "Imported file content",
        shortcutHelp: "Shortcuts: Ctrl+Enter (Encrypt), Ctrl+Shift+Enter (Decrypt), Ctrl+S (Share), Ctrl+Q (QR Code)"
    },
    fr: {
        title: "StarryCrypt",
        textLabel: "Texte à chiffrer/déchiffrer :",
        textPlaceholder: "Entrez le texte ici ou glissez-déposez .txt/.enc.txt",
        passwordLabel: "Mot de passe :",
        passwordPlaceholder: "Entrez le mot de passe",
        iterationsLabel: "Itérations PBKDF2 :",
        iterationsRecommendation: "Recommandé : 100 000+",
        autoClearLabel: "Effacer automatiquement la sortie après :",
        autoClearClipboardLabel: "Effacer le presse-papiers après :",
        autoClearInactivityLabel: "Effacer stockage et presse-papiers après inactivité :",
        messageExpirationLabel: "Effacer automatiquement la sortie déchiffrée après :",
        messageExpirationMinutes: "minutes",
        autoClearSeconds: "secondes",
        encryptBtn: "Chiffrer",
        decryptBtn: "Déchiffrer",
        copyBtn: "Copier",
        shareBtn: "Copier le lien",
        mediaShareBtn: "Partager sur les médias",
        qrBtn: "Afficher le code QR",
        downloadBtn: "Télécharger .enc.txt",
        importBtn: "Importer .enc.txt",
        starIdLabel: "ID Étoile (Empreinte du mot de passe) :",
        hmacLabel: "Activer la vérification d'intégrité HMAC-SHA256 :",
        resultLabel: "Résultat :",
        shareMessageLabel: "Message de partage :",
        shareMessagePlaceholder: "Ajouter une note pour le partage",
        defaultShareMessage: "Message chiffré de StarryCrypt",
        includePasswordLabel: "Inclure le mot de passe dans le lien de partage :",
        charCount: "Caractères",
        wordCount: "Mots",
        charCountWarning: "Avertissement : Le texte dépasse 100 caractères. Raccourcissez pour la compatibilité avec le code QR.",
        errorDecrypt: "Échec du déchiffrement : Données ou mot de passe invalides",
        errorEmpty: "Veuillez entrer le texte et le mot de passe",
        errorQrTooLong: "Échec de la génération du code QR : URL trop longue (plus de ~300 caractères). Essayez un texte plus court, décochez 'Inclure le mot de passe', ou copiez le lien à la place.",
        errorQrNoData: "Impossible de générer le code QR : Aucun lien partageable disponible. Veuillez d'abord chiffrer ou déchiffrer le texte.",
        errorQrLibrary: "Échec de la génération du code QR : Bibliothèque QRCode non chargée.",
        errorHmac: "Vérification HMAC échouée : Les données peuvent avoir été altérées",
        errorFileType: "Fichier invalide : Seuls les fichiers .txt ou .enc.txt sont pris en charge",
        errorFileRead: "Échec de la lecture du fichier",
        errorFileSize: "Fichier trop grand (max 1 Mo)",
        errorIterations: "Les itérations PBKDF2 doivent être comprises entre 100 000 et 10 000 000",
        copySuccess: "Copié dans le presse-papiers ! Effacé dans 30 secondes.",
        shareSuccess: "Lien partageable copié dans le presse-papiers ! Effacé dans 30 secondes.",
        mediaShareSuccess: "Options de partage ouvertes !",
        mediaShareFallback: "L'API de partage Web n'est pas prise en charge. Copiez le lien pour partager.",
        autoClearMessage: "Sortie effacée pour des raisons de sécurité",
        autoClearClipboardMessage: "Presse-papiers effacé pour des raisons de sécurité",
        autoClearInactivityMessage: "Stockage et presse-papiers effacés en raison de l'inactivité",
        messageExpirationMessage: "Sortie déchiffrée effacée pour des raisons de sécurité",
        qrGenerated: "Code QR généré !",
        copyStarIdSuccess: "ID Étoile copié dans le presse-papiers !",
        downloadSuccess: "Sortie chiffrée téléchargée en tant que .enc.txt",
        importSuccess: "Contenu du fichier importé",
        shortcutHelp: "Raccourcis : Ctrl+Entrée (Chiffrer), Ctrl+Shift+Entrée (Déchiffrer), Ctrl+S (Partager), Ctrl+Q (Code QR)"
    },
    es: {
        title: "StarryCrypt",
        textLabel: "Texto para encriptar/desencriptar:",
        textPlaceholder: "Ingrese el texto aquí o arrastre y suelte .txt/.enc.txt",
        passwordLabel: "Contraseña:",
        passwordPlaceholder: "Ingrese la contraseña",
        iterationsLabel: "Iteraciones PBKDF2:",
        iterationsRecommendation: "Recomendado: 100,000+",
        autoClearLabel: "Borrar salida automáticamente después de:",
        autoClearClipboardLabel: "Borrar portapapeles después de:",
        autoClearInactivityLabel: "Borrar almacenamiento y portapapeles después de inactividad:",
        messageExpirationLabel: "Borrar automáticamente la salida desencriptada después de:",
        messageExpirationMinutes: "minutos",
        autoClearSeconds: "segundos",
        encryptBtn: "Encriptar",
        decryptBtn: "Desencriptar",
        copyBtn: "Copiar",
        shareBtn: "Copiar enlace",
        mediaShareBtn: "Compartir en medios",
        qrBtn: "Mostrar código QR",
        downloadBtn: "Descargar .enc.txt",
        importBtn: "Importar .enc.txt",
        starIdLabel: "ID Estrella (Huella de la contraseña):",
        hmacLabel: "Habilitar verificación de integridad HMAC-SHA256:",
        resultLabel: "Resultado:",
        shareMessageLabel: "Mensaje para compartir:",
        shareMessagePlaceholder: "Añade una nota para compartir",
        defaultShareMessage: "Mensaje encriptado de StarryCrypt",
        includePasswordLabel: "Inclure contraseña en el enlace compartido:",
        charCount: "Caracteres",
        wordCount: "Palabras",
        charCountWarning: "Advertencia: El texto excede 100 caracteres. Acorta para compatibilidad con el código QR.",
        errorDecrypt: "Fallo en la desencriptación: Datos o contraseña inválidos",
        errorEmpty: "Por favor, ingrese tanto el texto como la contraseña",
        errorQrTooLong: "Fallo en la generación del código QR: URL demasiado larga (más de ~300 caracteres). Prueba con un texto más corto, desmarca 'Incluir contraseña', o copia el enlace en su lugar.",
        errorQrNoData: "No se puede generar el código QR: No hay enlace compartible disponible. Por favor, encripta o desencripta el texto primero.",
        errorQrLibrary: "Fallo en la generación del código QR: Biblioteca QRCode no cargada.",
        errorHmac: "Verificación HMAC fallida: Los datos pueden haber sido manipulados",
        errorFileType: "Archivo inválido: Solo se admiten archivos .txt o .enc.txt",
        errorFileRead: "Error al leer el archivo",
        errorFileSize: "Archivo demasiado grande (máx. 1MB)",
        errorIterations: "Las iteraciones PBKDF2 deben estar entre 100,000 y 10,000,000",
        copySuccess: "¡Copiado al portapapeles!",
        shareSuccess: "¡Enlace compartible copiado al portapapeles!",
        mediaShareSuccess: "¡Opciones de compartir abiertas!",
        mediaShareFallback: "La API de compartir web no es compatible. Copia el enlace para compartir.",
        autoClearMessage: "Salida borrada por seguridad",
        autoClearClipboardMessage: "Portapapeles borrado por seguridad",
        autoClearInactivityMessage: "Almacenamiento y port Send feedbackapapeles borrados por inactividad",
        messageExpirationMessage: "Salida desencriptada borrada por seguridad",
        qrGenerated: "¡Código QR generado!",
        copyStarIdSuccess: "¡ID Estrella copiado al portapapeles!",
        downloadSuccess: "Salida encriptada descargada como .enc.txt",
        importSuccess: "Contenido del archivo importado",
        shortcutHelp: "Atajos: Ctrl+Enter (Encriptar), Ctrl+Shift+Enter (Desencriptar), Ctrl+S (Compartir), Ctrl+Q (Código QR)"
    },
    bn: {
        title: "ক্রিপ্টিটেক্সট",
        textLabel: "এনক্রিপ্ট/ডিক্রিপ্ট করার জন্য টেক্সট:",
        textPlaceholder: "এখানে টেক্সট লিখুন বা .txt/.enc.txt ড্র্যাগ-ড্রপ করুন",
        passwordLabel: "পাসওয়ার্ড:",
        passwordPlaceholder: "পাসওয়ার্ড লিখুন",
        iterationsLabel: "পিবিকেডিএফ২ ইটারেশন:",
        iterationsRecommendation: "প্রস্তাবিত: ১০০,০০০+",
        autoClearLabel: "আউটপুট স্বয়ংক্রিয়ভাবে মুছে ফেলুন:",
        autoClearClipboardLabel: "ক্লিপবোর্ড স্বয়ংক্রিয়ভাবে মুছে ফেলুন:",
        autoClearInactivityLabel: "নিষ্ক্রিয়তার পর স্টোরেজ এবং ক্লিপবোর্ড মুছে ফেলুন:",
        messageExpirationLabel: "ডিক্রিপ্টেড আউটপুট স্বয়ংক্রিয়ভাবে মুছে ফেলুন:",
        messageExpirationMinutes: "মিনিট",
        autoClearSeconds: "সেকেন্ড",
        encryptBtn: "এনক্রিপ্ট",
        decryptBtn: "ডিক্রিপ্ট",
        copyBtn: "কপি",
        shareBtn: "লিঙ্ক কপি",
        mediaShareBtn: "মিডিয়াতে শেয়ার",
        qrBtn: "কিউআর কোড দেখান",
        downloadBtn: "ডাউনলোড .enc.txt",
        importBtn: "ইমপোর্ট .enc.txt",
        starIdLabel: "স্টার আইডি (পাসওয়ার্ড ফিঙ্গারপ্রিন্ট):",
        hmacLabel: "HMAC-SHA256 অখণ্ডতা যাচাই সক্ষম করুন:",
        resultLabel: "ফলাফল:",
        shareMessageLabel: "শেয়ার বার্তা:",
        shareMessagePlaceholder: "শেয়ারের জন্য একটি নোট যোগ করুন",
        defaultShareMessage: "ক্রিপ্টিটেক্সট থেকে এনক্রিপ্টেড বার্তা",
        includePasswordLabel: "শেয়ার লিঙ্কে পাসওয়ার্ড অন্তর্ভুক্ত করুন:",
        charCount: "অক্ষর",
        wordCount: "শব্দ",
        charCountWarning: "সতর্কতা: টেক্সট ১০০ অক্ষরের বেশি। কিউআর কোড সামঞ্জস্যের জন্য ছোট করুন।",
        errorDecrypt: "ডিক্রিপশন ব্যর্থ: অবৈধ ডেটা বা পাসওয়ার্ড",
        errorEmpty: "দয়া করে টেক্সট এবং পাসওয়ার্ড উভয়ই লিখুন",
        errorQrTooLong: "কিউআর কোড তৈরি ব্যর্থ: URL খুব দীর্ঘ (~৩০০ অক্ষরের বেশি)। ছোট টেক্সট ব্যবহার করুন, 'পাসওয়ার্ড অন্তর্ভুক্ত করুন' বন্ধ করুন, বা লিঙ্ক কপি করুন।",
        errorQrNoData: "কিউআর কোড তৈরি করা যায়নি: কোনো শেয়ারযোগ্য লিঙ্ক উপলব্ধ নেই। প্রথমে টেক্সট এনক্রিপ্ট বা ডিক্রিপ্ট করুন।",
        errorQrLibrary: "কিউআর কোড তৈরি ব্যর্থ: QRCode লাইব্রেরি লোড হয়নি।",
        errorHmac: "HMAC যাচাই ব্যর্থ: ডেটা পরিবর্তিত হতে পারে",
        errorFileType: "অবৈধ ফাইল: শুধুমাত্র .txt বা .enc.txt ফাইল সমর্থিত",
        errorFileRead: "ফাইল পড়তে ব্যর্থ",
        errorFileSize: "ফাইল খুব বড় (সর্বোচ্চ ১ এমবি)",
        errorIterations: "পিবিকেডিএফ২ ইটারেশন ১০০,০০০ থেকে ১০,০০০,০০০ এর মধ্যে হতে হবে",
        copySuccess: "ক্লিপবোর্ডে কপি করা হয়েছে!",
        shareSuccess: "শেয়ারযোগ্য লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে!",
        mediaShareSuccess: "শেয়ারিং বিকল্প খোলা হয়েছে!",
        mediaShareFallback: "ওয়েব শেয়ার এপিআই সমর্থিত নয়। শেয়ার করতে লিঙ্ক কপি করুন।",
        autoClearMessage: "নিরাপত্তার জন্য আউটপুট মুছে ফেলা হয়েছে",
        autoClearClipboardMessage: "নিরাপত্তার জন্য ক্লিপবোর্ড মুছে ফেলা হয়েছে",
        autoClearInactivityMessage: "নিষ্ক্রিয়তার কারণে স্টোরেজ এবং ক্লিপবোর্ড মুছে ফেলা হয়েছে",
        messageExpirationMessage: "নিরাপত্তার জন্য ডিক্রিপ্টেড আউটপুট মুছে ফেলা হয়েছে",
        qrGenerated: "কিউআর কোড তৈরি করা হয়েছে!",
        copyStarIdSuccess: "স্টার আইডি ক্লিপবোর্ডে কপি করা হয়েছে!",
        downloadSuccess: "এনক্রিপ্টেড আউটপুট .enc.txt হিসেবে ডাউনলোড করা হয়েছে",
        importSuccess: "ফাইলের বিষয়বস্তু ইমপোর্ট করা হয়েছে",
        shortcutHelp: "শর্টকাট: Ctrl+Enter (এনক্রিপ্ট), Ctrl+Shift+Enter (ডিক্রিপ্ট), Ctrl+S (শেয়ার), Ctrl+Q (কিউআর কোড)"
    },
    ja: {
        title: "StarryCrypt",
        textLabel: "暗号化/復号化するテキスト：",
        textPlaceholder: "ここにテキストを入力するか、.txt/.enc.txtをドラッグ＆ドロップ",
        passwordLabel: "パスワード：",
        passwordPlaceholder: "パスワードを入力",
        iterationsLabel: "PBKDF2イテレーション：",
        iterationsRecommendation: "推奨：100,000以上",
        autoClearLabel: "出力の自動消去：",
        autoClearClipboardLabel: "クリップボードの自動消去：",
        autoClearInactivityLabel: "非アクティブ時のストレージとクリップボードの自動消去：",
        messageExpirationLabel: "復号化された出力の自動消去：",
        messageExpirationMinutes: "分",
        autoClearSeconds: "秒",
        encryptBtn: "暗号化",
        decryptBtn: "復号化",
        copyBtn: "コピー",
        shareBtn: "リンクをコピー",
        mediaShareBtn: "メディアに共有",
        qrBtn: "QRコードを表示",
        downloadBtn: "ダウンロード .enc.txt",
        importBtn: "インポート .enc.txt",
        starIdLabel: "スターID（パスワードのフィンガープリント）：",
        hmacLabel: "HMAC-SHA256整合性チェックを有効にする：",
        resultLabel: "結果：",
        shareMessageLabel: "共有メッセージ：",
        shareMessagePlaceholder: "共有用のノートを追加",
        defaultShareMessage: "StarryCryptからの暗号化メッセージ",
        includePasswordLabel: "共有リンクにパスワードを含める：",
        charCount: "文字数",
        wordCount: "単語数",
        charCountWarning: "警告：テキストが100文字を超えています。QRコードの互換性のため短くしてください。",
        errorDecrypt: "復号化に失敗しました：データまたはパスワードが無効です",
        errorEmpty: "テキストとパスワードの両方を入力してください",
        errorQrTooLong: "QRコードの生成に失敗しました：URLが長すぎます（約300文字以上）。テキストを短くするか、「パスワードを含める」をオフにするか、リンクをコピーしてください。",
        errorQrNoData: "QRコードを生成できません：共有可能なリンクがありません。まずテキストを暗号化または復号化してください。",
        errorQrLibrary: "QRコードの生成に失敗しました：QRCodeライブラリがロードされていません。",
        errorHmac: "HMAC検証に失敗しました：データが改ざんされている可能性があります",
        errorFileType: "無効なファイル：.txtまたは.enc.txtファイルのみがサポートされています",
        errorFileRead: "ファイルの読み込みに失敗しました",
        errorFileSize: "ファイルが大きすぎます（最大1MB）",
        errorIterations: "PBKDF2イテレーションは100,000から10,000,000の間である必要があります",
        copySuccess: "クリップボードにコピーしました！",
        shareSuccess: "共有可能なリンクをクリップボードにコピーしました！",
        mediaShareSuccess: "共有オプションを開きました！",
        mediaShareFallback: "Web共有APIがサポートされていません。リンクをコピーして共有してください。",
        autoClearMessage: "セキュリティのため出力が消去されました",
        autoClearClipboardMessage: "セキュリティのためクリップボードが消去されました",
        autoClearInactivityMessage: "非アクティブのためストレージとクリップボードが消去されました",
        messageExpirationMessage: "セキュリティのため復号化された出力が消去されました",
        qrGenerated: "QRコードが生成されました！",
        copyStarIdSuccess: "スターIDがクリップボードにコピーされました！",
        downloadSuccess: "暗号化された出力を.enc.txtとしてダウンロードしました",
        importSuccess: "ファイルの内容をインポートしました",
        shortcutHelp: "ショートカット：Ctrl+Enter（暗号化）、Ctrl+Shift+Enter（復号化）、Ctrl+S（共有）、Ctrl+Q（QRコード）"
    },
    ko: {
        title: "StarryCrypt",
        textLabel: "암호화/복호화할 텍스트:",
        textPlaceholder: "여기에 텍스트를 입력하거나 .txt/.enc.txt 파일을 드래그 앤 드롭",
        passwordLabel: "비밀번호:",
        passwordPlaceholder: "비밀번호 입력",
        iterationsLabel: "PBKDF2 반복 횟수:",
        iterationsRecommendation: "권장: 100,000 이상",
        autoClearLabel: "출력 자동 삭제:",
        autoClearClipboardLabel: "클립보드 자동 삭제:",
        autoClearInactivityLabel: "비활성 상태에서 스토리지 및 클립보드 자동 삭제:",
        messageExpirationLabel: "복호화된 출력 자동 삭제:",
        messageExpirationMinutes: "분",
        autoClearSeconds: "초",
        encryptBtn: "암호화",
        decryptBtn: "복호화",
        copyBtn: "복사",
        shareBtn: "링크 복사",
        mediaShareBtn: "미디어에 공유",
        qrBtn: "QR 코드 표시",
        downloadBtn: "다운로드 .enc.txt",
        importBtn: "가져오기 .enc.txt",
        starIdLabel: "스타 ID (비밀번호 지문):",
        hmacLabel: "HMAC-SHA256 무결성 검사 활성화:",
        resultLabel: "결과:",
        shareMessageLabel: "공유 메시지:",
        shareMessagePlaceholder: "공유를 위한 노트 추가",
        defaultShareMessage: "StarryCrypt에서 암호화된 메시지",
        includePasswordLabel: "공유 링크에 비밀번호 포함:",
        charCount: "문자",
        wordCount: "단어",
        charCountWarning: "경고: 텍스트가 100자를 초과합니다. QR 코드 호환성을 위해 짧게 만들어 주세요.",
        errorDecrypt: "복호화 실패: 데이터 또는 비밀번호가 유효하지 않습니다",
        errorEmpty: "텍스트와 비밀번호를 모두 입력해 주세요",
        errorQrTooLong: "QR 코드 생성 실패: URL이 너무 깁니다 (~300자 초과). 텍스트를 짧게 하거나 '비밀번호 포함'을 체크 해제하거나 링크를 복사해 주세요.",
        errorQrNoData: "QR 코드를 생성할 수 없습니다: 공유 가능한 링크가 없습니다. 먼저 텍스트를 암호화하거나 복호화해 주세요.",
        errorQrLibrary: "QR 코드 생성 실패: QRCode 라이브러리가 로드되지 않았습니다.",
        errorHmac: "HMAC 검증 실패: 데이터가 변조되었을 수 있습니다",
        errorFileType: "유효하지 않은 파일: .txt 또는 .enc.txt 파일만 지원됩니다",
        errorFileRead: "파일 읽기 실패",
        errorFileSize: "파일이 너무 큽니다 (최대 1MB)",
        errorIterations: "PBKDF2 반복 횟수는 100,000에서 10,000,000 사이여야 합니다",
        copySuccess: "클립보드에 복사되었습니다! 30초 후 삭제됩니다.",
        shareSuccess: "공유 가능한 링크가 클립보드에 복사되었습니다! 30초 후 삭제됩니다.",
        mediaShareSuccess: "공유 옵션이 열렸습니다!",
        mediaShareFallback: "웹 공유 API가 지원되지 않습니다. 링크를 복사하여 공유해 주세요.",
        autoClearMessage: "보안을 위해 출력이 삭제되었습니다",
        autoClearClipboardMessage: "보안을 위해 클립보드가 삭제되었습니다",
        autoClearInactivityMessage: "비활성 상태로 인해 스토리지와 클립보드가 삭제되었습니다",
        messageExpirationMessage: "보안을 위해 복호화된 출력이 삭제되었습니다",
        qrGenerated: "QR 코드가 생성되었습니다!",
        copyStarIdSuccess: "스타 ID가 클립보드에 복사되었습니다!",
        downloadSuccess: "암호화된 출력이 .enc.txt로 다운로드되었습니다",
        importSuccess: "파일 내용이 가져와졌습니다",
        shortcutHelp: "단축키: Ctrl+Enter (암호화), Ctrl+Shift+Enter (복호화), Ctrl+S (공유), Ctrl+Q (QR 코드)"
    }
};

function getBaseUrl() {
    const isGitHubPages = window.location.hostname.includes("github.io");
    return isGitHubPages
        ? `${window.location.origin}/StarryCrypt`
        : window.location.origin;
}

function getValidLanguage(lang) {
    return translations[lang] ? lang : 'en';
}

function updateLanguage(lang) {
    lang = getValidLanguage(lang);
    const t = translations[lang];
    const elements = {
        "title": t.title,
        "text-input": { textContent: t.textLabel, placeholder: t.textPlaceholder },
        "password": { textContent: t.passwordLabel, placeholder: t.passwordPlaceholder },
        "iterations": { textContent: t.iterationsLabel },
        "iterations-recommendation": t.iterationsRecommendation,
        "auto-clear": t.autoClearLabel,
        "auto-clear-clipboard": t.autoClearClipboardLabel,
        "auto-clear-inactivity": t.autoClearInactivityLabel,
        "message-expiration": t.messageExpirationLabel,
        "message-expiration-minutes": t.messageExpirationMinutes
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with ID ${id} not found`);
            return;
        }

        if (typeof value === 'object') {
            const label = document.querySelector(`label[for='${id}']`);
            if (label) label.textContent = value.textContent;
            if ('placeholder' in value) element.placeholder = value.placeholder;
        } else {
            element.textContent = value;
        }
    });

    // Update button text
    const buttons = {
        "encrypt-btn": t.encryptBtn,
        "decrypt-btn": t.decryptBtn,
        "copy-btn": t.copyBtn,
        "share-btn": t.shareBtn,
        "media-share-btn": t.mediaShareBtn,
        "qr-btn": t.qrBtn,
        "download-btn": t.downloadBtn,
        "import-btn": t.importBtn
    };

    Object.entries(buttons).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    });

    // Update labels
    const labels = {
        "star-id": t.starIdLabel,
        "hmac-check": t.hmacLabel,
        "output": t.resultLabel,
        "share-message": t.shareMessageLabel,
        "include-password": t.includePasswordLabel
    };

    Object.entries(labels).forEach(([id, text]) => {
        const label = document.querySelector(`label[for='${id}']`);
        if (label) label.textContent = text;
    });

    const shareMessage = document.getElementById("share-message");
    if (shareMessage) shareMessage.placeholder = t.shareMessagePlaceholder;

    updateCharCount(lang);
}

function updateCharCount(lang) {
    lang = getValidLanguage(lang);
    const textInput = document.getElementById("text-input");
    if (!textInput) return;
    const text = textInput.value;
    const charCount = text.length;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const charCountElement = document.getElementById("char-count");
    if (charCountElement) {
        const warning = charCount > 100 ? ` ${translations[lang].charCountWarning}` : "";
        charCountElement.textContent = `${charCount} ${translations[lang].charCount}, ${wordCount} ${translations[lang].wordCount}${warning}`;
    }
    updateQrSize(charCount);
}

function updateQrSize(charCount) {
    const qrSizeSpan = document.querySelector("#qr-size span");
    if (!qrSizeSpan) return;
    let complexity = "Low Complexity";
    if (charCount > 300) complexity = "High Complexity (May not scan reliably)";
    else if (charCount > 100) complexity = "Medium Complexity";
    qrSizeSpan.textContent = complexity;
}

async function updateStarId() {
    const passwordInput = document.getElementById("password");
    const starIdInput = document.getElementById("star-id");
    if (!passwordInput || !starIdInput) return;
    const password = passwordInput.value;
    starIdInput.value = password ? await computeSha256Fingerprint(password) : "";
}

async function updatePreviewUrl() {
    const output = document.getElementById("output");
    const previewUrlSpan = document.querySelector("#preview-url span");
    if (!output || !previewUrlSpan) return;
    const shareableUrl = output.dataset.shareableUrl || "";
    previewUrlSpan.textContent = shareableUrl.slice(0, 100) + (shareableUrl.length > 100 ? "..." : "");
}

function showSuccess(message) {
    const successDiv = document.getElementById("success");
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.remove("hidden");
        setTimeout(() => successDiv.classList.add("hidden"), 3000);
    }
}

function showError(message) {
    const errorDiv = document.getElementById("error");
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove("hidden");
        setTimeout(() => errorDiv.classList.add("hidden"), 5000);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        console.log(`Closing modal: ${modalId}`);
        modal.classList.add("hidden");
    } else {
        console.warn(`Modal with ID ${modalId} not found`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let lang = localStorage.getItem("language") || navigator.language.split('-')[0];
    lang = getValidLanguage(lang);
    updateLanguage(lang);

    // Initialize theme from localStorage or default to dark mode
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.classList.toggle("dark-mode", savedTheme === "dark");
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.textContent = savedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
    }

    const languageSelect = document.getElementById("language");
    if (languageSelect) {
        languageSelect.value = lang;
        languageSelect.addEventListener("change", () => {
            lang = languageSelect.value;
            localStorage.setItem("language", lang);
            updateLanguage(lang);
        });
    }

    const textInput = document.getElementById("text-input");
    const passwordInput = document.getElementById("password");
    const iterationsSelect = document.getElementById("iterations");
    const hmacCheck = document.getElementById("hmac-check");
    const output = document.getElementById("output");
    const qrCode = document.getElementById("qr-code");
    const shareMessage = document.getElementById("share-message");
    const includePassword = document.getElementById("include-password");

    if (textInput) {
        textInput.addEventListener("input", () => updateCharCount(lang));
        textInput.addEventListener("dragover", e => e.preventDefault());
        textInput.addEventListener("drop", async e => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && (file.name.endsWith(".txt") || file.name.endsWith(".enc.txt"))) {
                if (file.size > 1024 * 1024) {
                    showError(translations[lang].errorFileSize);
                    return;
                }
                try {
                    textInput.value = await file.text();
                    updateCharCount(lang);
                    showSuccess(translations[lang].importSuccess);
                } catch {
                    showError(translations[lang].errorFileRead);
                }
            } else {
                showError(translations[lang].errorFileType);
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", updateStarId);
    }

    const togglePassword = document.getElementById("toggle-password");
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
            togglePassword.querySelector(".eye-icon").textContent = type === "password" ? "👁️" : "👁️‍🗨️";
        });
    }
    const copyStarId = document.getElementById("copy-star-id");
    const starIdInput = document.getElementById("star-id");
    if (copyStarId && starIdInput) {
        copyStarId.addEventListener("click", async () => {
            if (!starIdInput.value) {
                showError("No Star ID to copy");
                return;
            }
            try {
                await navigator.clipboard.writeText(starIdInput.value);
                showSuccess(translations[lang].copyStarIdSuccess);
                setTimeout(() => navigator.clipboard.writeText(""), 30000);
            } catch {
                showError("Failed to copy Star ID");
            }
        });
    }

    async function generateShareableUrl(text, password) {
        const baseUrl = getBaseUrl();
        let compressed = LZString.compressToEncodedURIComponent(text);
        let url = `${baseUrl}?text=${compressed}`;
        if (includePassword.checked && password) {
            url += `&password=${encodeURIComponent(password)}`;
        }
        if (shareMessage.value) {
            url += `¬e=${encodeURIComponent(shareMessage.value)}`;
        }
        return url;
    }

    const encryptBtn = document.getElementById("encrypt-btn");
    if (encryptBtn) {
        encryptBtn.addEventListener("click", async () => {
            const text = sanitizeInput(textInput.value);
            if (!text || !passwordInput.value) {
                showError(translations[lang].errorEmpty);
                return;
            }
            const iterations = parseInt(iterationsSelect.value);
            if (iterations < 100000 || iterations > 10000000) {
                showError(translations[lang].errorIterations);
                return;
            }
            try {
                const spinner = document.getElementById("spinner");
                if (spinner) spinner.classList.remove("hidden");
                let result = await encryptText(text, passwordInput.value, iterations);
                if (hmacCheck.checked) {
                    const hmac = await computeHmacSha256(result, passwordInput.value);
                    result = `${result}|${hmac}`;
                }
                output.value = result;
                output.dataset.plaintext = result;
                output.dataset.base64 = btoa(result);
                output.dataset.shareableUrl = await generateShareableUrl(result, passwordInput.value);
                updatePreviewUrl();
                showSuccess("Encrypted successfully!");
            } catch (err) {
                showError(translations[lang].errorDecrypt);
            } finally {
                if (spinner) spinner.classList.add("hidden");
            }
        });
    }

    const decryptBtn = document.getElementById("decrypt-btn");
    if (decryptBtn) {
        decryptBtn.addEventListener("click", async () => {
            const text = sanitizeInput(textInput.value);
            if (!text || !passwordInput.value) {
                showError(translations[lang].errorEmpty);
                return;
            }
            try {
                const spinner = document.getElementById("spinner");
                if (spinner) spinner.classList.remove("hidden");
                let hmacText = text;
                let hmac;
                if (hmacCheck.checked) {
                    const [data, providedHmac] = text.split("|");
                    if (!providedHmac) {
                        showError(translations[lang].errorHmac);
                        return;
                    }
                    const computedHmac = await computeHmacSha256(data, passwordInput.value);
                    if (computedHmac !== providedHmac) {
                        showError(translations[lang].errorHmac);
                        return;
                    }
                    text = data;
                }
                const result = await decryptText(text, passwordInput.value);
                output.value = result;
                output.dataset.plaintext = result;
                output.dataset.base64 = btoa(result);
                output.dataset.shareableUrl = await generateShareableUrl(result, passwordInput.value);
                updatePreviewUrl();
                showSuccess("Decrypted successfully!");
            } catch (err) {
                showError(translations[lang].errorDecrypt);
            } finally {
                if (spinner) spinner.classList.add("hidden");
            }
        });
    }

    const copyBtn = document.getElementById("copy-btn");
    if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(output.value);
                showSuccess(translations[lang].copySuccess);
                setTimeout(() => navigator.clipboard.writeText(""), 30000);
            } catch {
                showError("Failed to copy to clipboard");
            }
        });
    }

    const shareBtn = document.getElementById("share-btn");
    if (shareBtn) {
        shareBtn.addEventListener("click", async () => {
            const shareableUrl = output.dataset.shareableUrl || "";
            if (shareableUrl) {
                try {
                    await navigator.clipboard.writeText(shareableUrl);
                    showSuccess(translations[lang].shareSuccess);
                    setTimeout(() => navigator.clipboard.writeText(""), 30000);
                } catch {
                    showError("Failed to copy share link");
                }
            } else {
                showError(translations[lang].errorQrNoData);
            }
        });
    }

    const mediaShareBtn = document.getElementById("media-share-btn");
    if (mediaShareBtn) {
        mediaShareBtn.addEventListener("click", async () => {
            const shareableUrl = output.dataset.shareableUrl || "";
            if (shareableUrl) {
                try {
                    await navigator.share({
                        title: translations[lang].defaultShareMessage,
                        text: shareMessage.value || translations[lang].defaultShareMessage,
                        url: shareableUrl
                    });
                    showSuccess(translations[lang].mediaShareSuccess);
                } catch {
                    showError(translations[lang].mediaShareFallback);
                }
            } else {
                showError(translations[lang].errorQrNoData);
            }
        });
    }

    function generateQRCode(shareableUrl) {
        console.log("Generating QR code for URL:", shareableUrl);
        if (!window.QRCode) {
            console.error("QRCode library not loaded");
            showError(translations[lang].errorQrLibrary);
            return false;
        }
        if (!shareableUrl) {
            console.error("No shareable URL provided for QR code");
            showError(translations[lang].errorQrNoData);
            return false;
        }
        try {
            qrCode.innerHTML = "";
            new QRCode(qrCode, {
                text: shareableUrl,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
            console.log("QR code generated successfully");
            showSuccess(translations[lang].qrGenerated);
            return true;
        } catch (err) {
            console.error("QR code generation failed:", err);
            showError(translations[lang].errorQrTooLong);
            return false;
        }
    }

    const tabs = document.querySelectorAll(".tab");
    if (tabs) {
        tabs.forEach(tab => {
            tab.addEventListener("click", async () => {
                console.log("Tab clicked:", tab.dataset.tab);
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                const tabType = tab.dataset.tab;
                output.classList.toggle("hidden", tabType === "qr");
                qrCode.classList.toggle("hidden", tabType !== "qr");
                if (tabType === "qr") {
                    const shareableUrl = output.dataset.shareableUrl || "";
                    console.log("Attempting QR code for shareableUrl:", shareableUrl);
                    if (shareableUrl) {
                        generateQRCode(shareableUrl);
                    } else {
                        showError(translations[lang].errorQrNoData);
                    }
                } else if (tabType === "base64") {
                    output.value = output.dataset.base64 || output.value;
                } else {
                    output.value = output.dataset.plaintext || output.value;
                }
            });
        });
    }

    const qrBtn = document.getElementById("qr-btn");
    if (qrBtn) {
        qrBtn.addEventListener("click", async () => {
            console.log("QR button clicked");
            const shareableUrl = output.dataset.shareableUrl || "";
            qrCode.classList.remove("hidden");
            output.classList.add("hidden");
            tabs.forEach(t => t.classList.remove("active"));
            document.querySelector(".tab[data-tab='qr']").classList.add("active");
            generateQRCode(shareableUrl);
        });
    }

    const downloadBtn = document.getElementById("download-btn");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            const blob = new Blob([output.value], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "encrypted.enc.txt";
            a.click();
            URL.revokeObjectURL(url);
            showSuccess(translations[lang].downloadSuccess);
        });
    }

    const importBtn = document.getElementById("import-btn");
    const fileInput = document.getElementById("file-input");
    if (importBtn && fileInput) {
        importBtn.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", async () => {
            const file = fileInput.files[0];
            if (file && (file.name.endsWith(".txt") || file.name.endsWith(".enc.txt"))) {
                if (file.size > 1024 * 1024) {
                    showError(translations[lang].errorFileSize);
                    return;
                }
                try {
                    textInput.value = await file.text();
                    updateCharCount(lang);
                    showSuccess(translations[lang].importSuccess);
                } catch {
                    showError(translations[lang].errorFileRead);
                }
            } else {
                showError(translations[lang].errorFileType);
            }
            fileInput.value = "";
        });
    }

    const autoClear = document.getElementById("auto-clear");
    const autoClearTime = document.getElementById("auto-clear-time");
    let autoClearTimeout;
    if (autoClear && autoClearTime) {
        autoClear.addEventListener("change", () => {
            if (!autoClear.checked) clearTimeout(autoClearTimeout);
        });
        autoClearTime.addEventListener("input", () => {
            if (autoClear.checked) {
                clearTimeout(autoClearTimeout);
                autoClearTimeout = setTimeout(() => {
                    output.value = "";
                    showSuccess(translations[lang].autoClearMessage);
                }, parseInt(autoClearTime.value) * 60 * 1000);
            }
        });
    }

    const autoClearClipboard = document.getElementById("auto-clear-clipboard");
    const autoClearClipboardTime = document.getElementById("auto-clear-clipboard-time");
    if (autoClearClipboard && autoClearClipboardTime) {
        autoClearClipboard.addEventListener("change", () => {
            if (!autoClearClipboard.checked) navigator.clipboard.writeText("");
        });
    }

    const autoClearInactivity = document.getElementById("auto-clear-inactivity");
    const autoClearInactivityTime = document.getElementById("auto-clear-inactivity-time");
    let inactivityTimeout;
    function resetInactivityTimer() {
        clearTimeout(inactivityTimeout);
        if (autoClearInactivity.checked) {
            inactivityTimeout = setTimeout(() => {
                output.value = "";
                navigator.clipboard.writeText("");
                showSuccess(translations[lang].autoClearInactivityMessage);
            }, parseInt(autoClearInactivityTime.value) * 60 * 1000);
        }
    }
    if (autoClearInactivity && autoClearInactivityTime) {
        document.addEventListener("mousemove", resetInactivityTimer);
        document.addEventListener("keydown", resetInactivityTimer);
        autoClearInactivity.addEventListener("change", resetInactivityTimer);
        autoClearInactivityTime.addEventListener("input", resetInactivityTimer);
    }

    const messageExpiration = document.getElementById("message-expiration");
    const messageExpirationTime = document.getElementById("message-expiration-time");
    let expirationTimeout;
    if (messageExpiration && messageExpirationTime) {
        function setExpirationTimer() {
            clearTimeout(expirationTimeout);
            if (messageExpiration.checked) {
                expirationTimeout = setTimeout(() => {
                    output.value = "";
                    showSuccess(translations[lang].messageExpirationMessage);
                }, parseInt(messageExpirationTime.value) * 60 * 1000);
            }
        }
        messageExpiration.addEventListener("change", setExpirationTimer);
        messageExpirationTime.addEventListener("input", setExpirationTimer);
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            console.log("Theme toggle clicked");
            document.body.classList.toggle("dark-mode");
            const isDarkMode = document.body.classList.contains("dark-mode");
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");
            themeToggle.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
            console.log(`Theme set to: ${isDarkMode ? "dark" : "light"}`);
        });
    }

    const helpBtn = document.getElementById("help-btn");
    const helpModal = document.getElementById("help-modal");
    const closeHelp = document.getElementById("close-help");
    if (helpBtn && helpModal && closeHelp && helpPanel) {
        helpBtn.addEventListener("click", () => {
            helpModal.classList.toggle("hidden");
            helpPanel.classList.toggle("hidden");
        });
        closeHelp.addEventListener("click", () => closeModal("help-modal"));
    }

    const changelogBtn = document.getElementById("changelog-btn");
    const changelogModal = document.getElementById("changelog-modal");
    const closeChangelog = document.getElementById("close-changelog");
    if (changelogBtn && changelogModal && closeChangelog) {
        changelogBtn.addEventListener("click", () => {
            changelogModal.classList.toggle("hidden");
        });
        closeChangelog.addEventListener("click", () => closeModal("changelog-modal"));
    }

    const helpPanel = document.getElementById("help-panel");
    const closeHelpPanel = document.getElementById("close-help-panel");
    if (helpPanel && closeHelpPanel) {
        helpPanel.querySelector("p").textContent = translations[lang].shortcutHelp;
        closeHelpPanel.addEventListener("click", () => {
            helpPanel.classList.add("hidden");
        });
    }

    document.addEventListener("keydown", e => {
        if (e.ctrlKey && e.key === "Enter") {
            encryptBtn.click();
        } else if (e.ctrlKey && e.shiftKey && e.key === "Enter") {
            decryptBtn.click();
        } else if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            shareBtn.click();
        } else if (e.ctrlKey && e.key === "q") {
            e.preventDefault();
            qrBtn.click();
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const compressedText = urlParams.get("text");
    const password = urlParams.get("password");
    const note = urlParams.get("note");
    if (compressedText) {
        textInput.value = LZString.decompressFromEncodedURIComponent(compressedText);
        updateCharCount(lang);
    }
    if (password) passwordInput.value = password;
    if (note) shareMessage.value = note;
});
