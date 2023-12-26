import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";

//加密解密参数，和后端约定好
const aesvikey = "YIXZJHCYIRJSYZ==";
const aeskey = CryptoJS.enc.Utf8.parse(aesvikey);
const aesiv = CryptoJS.enc.Utf8.parse(aesvikey);

//解密
export function decrypt(word:string) {
    word = Base64.decode(word);
    const decryptStr = CryptoJS.AES.decrypt(word, aeskey, {
        iv: aesiv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return decryptStr.toString(CryptoJS.enc.Utf8);
}

//加密
export function encrypt(word:string) {
    const encryptStr = CryptoJS.AES.encrypt(word, aeskey, {
        iv: aesiv,
        mode: CryptoJS.mode.CBC
    });
    return encryptStr;
}