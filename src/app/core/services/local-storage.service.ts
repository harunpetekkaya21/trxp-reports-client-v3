import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private isAvailable: boolean;

  constructor( ) {
    this.isAvailable = this.checkAvailability();
  }

  private checkAvailability(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  public setItem(key: string, value: string): void {
    if (this.isAvailable) {
      localStorage.setItem(key, value);
    } else {
      this.showFallbackNotification();
    }
  }

  public getItem(key: string): string | null {
    if (this.isAvailable) {
      return localStorage.getItem(key);
    } else {
      this.showFallbackNotification();
      return null;
    }
  }

  public removeItem(key: string): void {
    if (this.isAvailable) {
      localStorage.removeItem(key);
    } else {
      this.showFallbackNotification();
    }
  }

  public clear(): void {
    if (this.isAvailable) {
      localStorage.clear();
    } else {
      this.showFallbackNotification();
    }
  }

  private showFallbackNotification(): void {
    
    alert('Tarayıcınız localStorage desteklemiyor veya kullanımına izin vermiyor.')
  }
}
