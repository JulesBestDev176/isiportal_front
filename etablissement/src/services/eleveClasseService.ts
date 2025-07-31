import { EleveClasse } from '../models';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export const eleveClasseService = {
  async getElevesByClasse(classeId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/classe/${classeId}/eleves`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves de la classe:', error);
      throw error;
    }
  }
}; 