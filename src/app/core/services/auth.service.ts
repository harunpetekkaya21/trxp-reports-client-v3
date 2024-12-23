import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

interface JwtPayload {
  exp: number;
  role?: string[];
  // Diğer gerekli alanlar
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl + '/login';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  // Observable olarak dışa aktarılıyor
  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, {
      userName: username,
      password: password
    }).pipe(
      tap(res => {
        this.setToken(res.token);
        this.loggedIn.next(true);
      })
    );
  }

  setToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken<JwtPayload>(token);
      const currentTime = Date.now().valueOf() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Token decode error:', error);
      return true;
    }
  }

  logout() {
    localStorage.removeItem('access_token');
  }
  private hasToken(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }
  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = this.decodeToken<JwtPayload>(token);
      return decoded.role?.includes(role) ?? false;
    } catch (error) {
      return false;
    }
  }

  private decodeToken<T>(token: string): T {
    const payload = token.split('.')[1];
    const decodedPayload = atob(this.base64UrlDecode(payload));
    return JSON.parse(decodedPayload);
  }

  private base64UrlDecode(str: string): string {
    // Base64URL çözümlemesi için gerekli dönüşümleri yap
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    // Base64 string'inin uzunluğunu 4 ile bölünebilir hale getir
    switch (str.length % 4) {
      case 0:
        break;
      case 2:
        str += '==';
        break;
      case 3:
        str += '=';
        break;
      default:
        throw new Error('Invalid base64 string');
    }
    return str;
  }
}
