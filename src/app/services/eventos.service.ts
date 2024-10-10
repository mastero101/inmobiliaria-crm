import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = `${environment.apiUrl}/eventos`;

  constructor() { }

  async getEventos() {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  }

  async getEventoById(id: number) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener evento:', error);
      throw error;
    }
  }

  async createEvento(evento: any) {
    try {
      console.log('Enviando evento al backend:', evento);
      const response = await axios.post(this.apiUrl, evento);
      console.log('Respuesta del backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  }

  async updateEvento(id: number, evento: any) {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}`, evento);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      throw error;
    }
  }

  async deleteEvento(id: number) {
    try {
      await axios.delete(`${this.apiUrl}/${id}`);
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw error;
    }
  }
}
