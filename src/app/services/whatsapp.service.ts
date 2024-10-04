import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WhatsAppService {
  private apiUrl = 'http://localhost:3000/send-whatsapp'; // Cambia esto a tu URL de API

  constructor(private http: HttpClient) {}

  sendMessage(to: string, message: string): Observable<any> {
    return this.http.post(this.apiUrl, { to, message });
  }
}
