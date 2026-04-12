export type Lang = 'en' | 'fr' | 'es' | 'ja' | 'ko' | 'bn';

export interface Translations {
  encrypt: string;
  decrypt: string;
  copy: string;
  save: string;
  password: string;
  iterations: string;
  sourceText: string;
  secureOutput: string;
  successEncrypt: string;
  successDecrypt: string;
  successCopy: string;
  errorEmpty: string;
  errorHmac: string;
  errorGeneric: string;
  clipboardCleared: string;
}

const translations: Record<Lang, Translations> = {
  en: {
    encrypt: "Encrypt", decrypt: "Decrypt", copy: "Copy", save: "Save",
    password: "Password", iterations: "Entropy Scale",
    sourceText: "Source Text", secureOutput: "Secure Output",
    successEncrypt: "Text encrypted successfully!",
    successDecrypt: "Text decrypted successfully!",
    successCopy: "Copied to clipboard!",
    errorEmpty: "Please enter both text and password.",
    errorHmac: "HMAC verification failed. Data may have been tampered with.",
    errorGeneric: "Operation failed. Invalid data or password.",
    clipboardCleared: "Clipboard wiped for security.",
  },
  fr: {
    encrypt: "Chiffrer", decrypt: "Déchiffrer", copy: "Copier", save: "Télécharger",
    password: "Mot de passe", iterations: "Échelle d'entropie",
    sourceText: "Texte Source", secureOutput: "Sortie Sécurisée",
    successEncrypt: "Texte chiffré avec succès !",
    successDecrypt: "Texte déchiffré avec succès !",
    successCopy: "Copié dans le presse-papiers !",
    errorEmpty: "Veuillez entrer le texte et le mot de passe.",
    errorHmac: "Vérification HMAC échouée.",
    errorGeneric: "L'opération a échoué.",
    clipboardCleared: "Presse-papiers effacé.",
  },
  es: {
    encrypt: "Encriptar", decrypt: "Desencriptar", copy: "Copiar", save: "Guardar",
    password: "Contraseña", iterations: "Escala de Entropía",
    sourceText: "Texto Origen", secureOutput: "Salida Segura",
    successEncrypt: "¡Texto encriptado con éxito!",
    successDecrypt: "¡Texto desencriptado con éxito!",
    successCopy: "¡Copiado al portapapeles!",
    errorEmpty: "Por favor, ingrese texto y contraseña.",
    errorHmac: "Verificación HMAC fallida.",
    errorGeneric: "Fallo en la operación.",
    clipboardCleared: "Portapapeles borrado.",
  },
  ja: {
    encrypt: "暗号化", decrypt: "復号化", copy: "コピー", save: "保存",
    password: "パスワード", iterations: "エントロピースケール",
    sourceText: "ソーステキスト", secureOutput: "安全な出力",
    successEncrypt: "暗号化に成功しました！",
    successDecrypt: "復号化に成功しました！",
    successCopy: "クリップボードにコピーしました！",
    errorEmpty: "テキストとパスワードを入力してください。",
    errorHmac: "HMAC検証に失敗しました。",
    errorGeneric: "操作に失敗しました。",
    clipboardCleared: "クリップボードを消去しました。",
  },
  ko: {
    encrypt: "암호화", decrypt: "복호화", copy: "복사", save: "저장",
    password: "비밀번호", iterations: "엔트로피 크기",
    sourceText: "원본 텍스트", secureOutput: "보안 출력",
    successEncrypt: "성공적으로 암호화되었습니다!",
    successDecrypt: "성공적으로 복호화되었습니다!",
    successCopy: "클립보드에 복사되었습니다!",
    errorEmpty: "텍스트와 비밀번호를 입력해 주세요.",
    errorHmac: "HMAC 검증 실패.",
    errorGeneric: "작업 실패.",
    clipboardCleared: "클립보드가 초기화되었습니다.",
  },
  bn: {
    encrypt: "এনক্রিপ্ট", decrypt: "ডিক্রিপ্ট", copy: "কপি", save: "ডাউনলোড",
    password: "পাসওয়ার্ড", iterations: "ইটারেশন স্কেল",
    sourceText: "মূল টেক্সট", secureOutput: "সুরক্ষিত আউটপুট",
    successEncrypt: "এনক্রিপশন সফল হয়েছে!",
    successDecrypt: "ডিক্রিপশন সফল হয়েছে!",
    successCopy: "কপি করা হয়েছে!",
    errorEmpty: "টেক্সট ও পাসওয়ার্ড উভয়ই লিখুন।",
    errorHmac: "HMAC যাচাই ব্যর্থ।",
    errorGeneric: "ব্যর্থ হয়েছে।",
    clipboardCleared: "ক্লিপবোর্ড মুছে ফেলা হয়েছে।",
  },
};

export function getTranslations(lang: Lang): Translations {
  return translations[lang] || translations.en;
}

export const LANGUAGES: { value: Lang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'bn', label: 'বাংলা' },
];
