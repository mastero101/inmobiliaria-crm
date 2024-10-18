import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    if (email === 'admin@admin.com' && password === 'admin') {
      const token = 'dummy-token'; // Simula un token de autenticación
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.tokenKey, token); // Almacena el token en localStorage
      }
      this.router.navigate(['/dashboard']); 
      return true; // Inicio de sesión exitoso
    }
    return false; // Credenciales incorrectas
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey); // Elimina el token de localStorage
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem(this.tokenKey);
  }
}
