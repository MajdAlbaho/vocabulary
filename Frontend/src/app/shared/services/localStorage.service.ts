import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  private secretKey = "vniu)*24((2948)_28datavna";

  constructor() { }

  private encrypt(value: string): string {
    let encryptedValue: string = "";
    try {
      encryptedValue = CryptoJS.AES.encrypt(value?.toString(), this.secretKey).toString();
    } catch (error: any) {
      console.error("Error encoding UTF-8 data:", error);
    }
    return encryptedValue;
  }

  private decrypt(encryptedValue: string): string {
    let decryptedValue: string = "";
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
      decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
    } catch (error: any) {
      console.error("Error decoding UTF-8 data:", error);
    }
    return decryptedValue;
  }

  setItem(key: string, value: string): void {
    const encryptedValue = this.encrypt(value);
    localStorage.setItem(key, encryptedValue);
  }

  getItem(key: string): string {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
      const decryptedValue = this.decrypt(encryptedValue);
      return decryptedValue;
    }
    return "";
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
