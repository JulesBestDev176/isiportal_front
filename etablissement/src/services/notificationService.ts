import { apiClient } from './config';

export interface NotificationData {
  id: string;
  titre: string;
  contenu: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'system';
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  destinataire_id?: number;
  destinataire_roles?: string[];
  expediteur_id?: number;
  lue: boolean;
  date_lecture?: string;
  date_envoi: string;
  date_creation: string;
  est_envoyee?: boolean;
  expediteur?: {
    nom: string;
    prenom: string;
  };
}

export interface CreateNotificationData {
  titre: string;
  contenu: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'system';
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  destinataire_roles: string[];
}

class NotificationService {
  async getNotifications(): Promise<NotificationData[]> {
    try {
      const response = await apiClient.get('/notifications');
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return [];
    }
  }

  async createNotification(data: CreateNotificationData): Promise<any> {
    try {
      const response = await apiClient.post('/notifications', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      return { success: false, error };
    }
  }

  async markAsRead(id: string): Promise<boolean> {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      return true;
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      return false;
    }
  }

  async deleteNotification(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/notifications/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
  }

  async getSentNotifications(): Promise<NotificationData[]> {
    try {
      const response = await apiClient.get('/notifications/sent');
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications envoyées:', error);
      return [];
    }
  }
}

export const notificationService = new NotificationService();