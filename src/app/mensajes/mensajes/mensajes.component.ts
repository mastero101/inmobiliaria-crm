import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Mensaje {
  id: number;
  remitente: string;
  contenido: string;
  fecha: Date;
}

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.scss'
})
export class MensajesComponent {
  to: string = '';
  message: string = '';
  response: string | null = null;
  mensajes: Mensaje[] = [];
  chats: { [key: string]: Mensaje[] } = {};
  currentChat: string | null = null;
  pageSize: number = 5;
  currentPage: number = 1;

  constructor() {
    // Generar más mensajes para la demostración
    for (let i = 1; i <= 30; i++) {
      this.mensajes.push({
        id: i,
        remitente: `Cliente ${i}`,
        contenido: `Mensaje de prueba ${i}`,
        fecha: new Date()
      });
    }
  }

  openChat(remitente: string) {
    this.currentChat = remitente;
    if (!this.chats[remitente]) {
      this.chats[remitente] = this.mensajes.filter(m => m.remitente === remitente);
    }
  }

  sendMessage() {
    if (this.currentChat) {
      const nuevoMensaje: Mensaje = {
        id: this.chats[this.currentChat].length + 1,
        remitente: 'Tú',
        contenido: this.message,
        fecha: new Date()
      };
      this.chats[this.currentChat].push(nuevoMensaje);
      this.response = 'Mensaje simulado enviado con éxito!';
      this.message = ''; // Limpiar el campo de entrada
    }
  }

  get paginatedMessages(): Mensaje[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.mensajes.slice(start, end);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.mensajes.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
