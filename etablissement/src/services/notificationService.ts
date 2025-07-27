// Service pour la gestion des notifications
import { Notification } from '../models/communication.model';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface NotificationFilters {
  userId?: number;
  type?: string;
  read?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export class NotificationService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/notifications') {
    this.baseUrl = baseUrl;
  }

  /**
   * Récupère toutes les notifications d'un utilisateur
   */
  async getNotifications(userId: number, filters?: NotificationFilters): Promise<ApiResponse<Notification[]>> {
    try {
      const queryParams = new URLSearchParams({
        userId: userId.toString(),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.read !== undefined && { read: filters.read.toString() }),
        ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters?.dateTo && { dateTo: filters.dateTo })
      });

      const response = await fetch(`${this.baseUrl}?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des notifications'
      };
    }
  }

  /**
   * Marque une notification comme lue
   */
  async markAsRead(notificationId: number): Promise<ApiResponse<Notification>> {
    try {
      const response = await fetch(`${this.baseUrl}/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors du marquage de la notification'
      };
    }
  }

  /**
   * Marque toutes les notifications d'un utilisateur comme lues
   */
  async markAllAsRead(userId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/mark-all-read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors du marquage de toutes les notifications'
      };
    }
  }

  /**
   * Supprime une notification
   */
  async deleteNotification(notificationId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${notificationId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression de la notification'
      };
    }
  }

  /**
   * Supprime toutes les notifications lues d'un utilisateur
   */
  async deleteReadNotifications(userId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/delete-read`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression des notifications lues'
      };
    }
  }

  /**
   * Crée une nouvelle notification
   */
  async createNotification(notification: Omit<Notification, 'id' | 'dateCreation'>): Promise<ApiResponse<Notification>> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la création de la notification'
      };
    }
  }

  /**
   * Récupère le nombre de notifications non lues
   */
  async getUnreadCount(userId: number): Promise<ApiResponse<number>> {
    try {
      const response = await fetch(`${this.baseUrl}/unread-count/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération du nombre de notifications'
      };
    }
  }
}

export const notificationService = new NotificationService(); 