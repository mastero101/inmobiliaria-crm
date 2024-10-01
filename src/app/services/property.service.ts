import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:3000/propiedades';  // URL de la API de propiedades

  constructor() { }

  // Método para obtener todas las propiedades
  async getAllProperties(): Promise<any> {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error al obtener propiedades:', error);
      throw error;
    }
  }

  // Método para obtener una propiedad por ID
  async getPropertyById(id: number): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener propiedad con ID ${id}:`, error);
      throw error;
    }
  }

  // Método para crear una nueva propiedad
  async createProperty(property: any): Promise<any> {
    try {
      const response = await axios.post(this.apiUrl, property, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear propiedad:', error);
      throw error;
    }
  }

  // Método para actualizar una propiedad existente
  async updateProperty(id: number, property: any): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}`, property, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar propiedad con ID ${id}:`, error);
      throw error;
    }
  }

  // Método para eliminar una propiedad
  async deleteProperty(id: number): Promise<any> {
    try {
      await axios.delete(`${this.apiUrl}/${id}`);
      return { success: true };
    } catch (error) {
      console.error(`Error al eliminar propiedad con ID ${id}:`, error);
      throw error;
    }
  }
}
