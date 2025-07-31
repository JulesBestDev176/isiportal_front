import { ApiResponse } from '../models/common.types';
import { Cours } from '../models/cours.model';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class GestionnaireService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Une erreur est survenue',
          errors: data.errors
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error('Erreur API:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur'
      };
    }
  }

  // Gestion des cours
  async getCours(): Promise<ApiResponse<Cours[]>> {
    return this.makeRequest<Cours[]>('/gestionnaire/cours');
  }

  async createCours(coursData: Partial<Cours>): Promise<ApiResponse<Cours>> {
    return this.makeRequest<Cours>('/gestionnaire/cours', {
      method: 'POST',
      body: JSON.stringify(coursData)
    });
  }

  async updateCours(id: number, coursData: Partial<Cours>): Promise<ApiResponse<Cours>> {
    return this.makeRequest<Cours>(`/gestionnaire/cours/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coursData)
    });
  }

  async deleteCours(id: number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/gestionnaire/cours/${id}`, {
      method: 'DELETE'
    });
  }

  // Gestion des assignations
  async getAssignations(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/gestionnaire/assignations');
  }

  async createAssignation(assignationData: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/gestionnaire/assignations', {
      method: 'POST',
      body: JSON.stringify(assignationData)
    });
  }

  async updateAssignation(id: number, assignationData: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/gestionnaire/assignations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignationData)
    });
  }

  async deleteAssignation(id: number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/gestionnaire/assignations/${id}`, {
      method: 'DELETE'
    });
  }
}

export const gestionnaireService = new GestionnaireService();