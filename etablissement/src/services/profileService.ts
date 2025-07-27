// Service pour la gestion du profil utilisateur
import { Utilisateur } from '../models/utilisateur.model';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ProfileUpdateData {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  dateNaissance?: string;
  photo?: File;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfilePreferences {
  theme?: 'light' | 'dark' | 'auto';
  language?: 'fr' | 'en';
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  privacy?: {
    showEmail?: boolean;
    showPhone?: boolean;
    showAddress?: boolean;
  };
}

export class ProfileService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/profile') {
    this.baseUrl = baseUrl;
  }

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  async getProfile(): Promise<ApiResponse<Utilisateur>> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération du profil'
      };
    }
  }

  /**
   * Met à jour le profil de l'utilisateur
   */
  async updateProfile(profileData: ProfileUpdateData): Promise<ApiResponse<Utilisateur>> {
    try {
      const formData = new FormData();
      
      // Ajouter les champs texte
      Object.entries(profileData).forEach(([key, value]) => {
        if (value && key !== 'photo') {
          formData.append(key, value);
        }
      });

      // Ajouter la photo si elle existe
      if (profileData.photo) {
        formData.append('photo', profileData.photo);
      }

      const response = await fetch(`${this.baseUrl}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du profil'
      };
    }
  }

  /**
   * Change le mot de passe de l'utilisateur
   */
  async changePassword(passwordData: PasswordChangeData): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors du changement de mot de passe'
      };
    }
  }

  /**
   * Récupère les préférences de l'utilisateur
   */
  async getPreferences(): Promise<ApiResponse<ProfilePreferences>> {
    try {
      const response = await fetch(`${this.baseUrl}/preferences`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération des préférences'
      };
    }
  }

  /**
   * Met à jour les préférences de l'utilisateur
   */
  async updatePreferences(preferences: ProfilePreferences): Promise<ApiResponse<ProfilePreferences>> {
    try {
      const response = await fetch(`${this.baseUrl}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour des préférences'
      };
    }
  }

  /**
   * Supprime le compte de l'utilisateur
   */
  async deleteAccount(password: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression du compte'
      };
    }
  }

  /**
   * Télécharge la photo de profil
   */
  async uploadProfilePhoto(photo: File): Promise<ApiResponse<{ photoUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('photo', photo);

      const response = await fetch(`${this.baseUrl}/upload-photo`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors du téléchargement de la photo'
      };
    }
  }

  /**
   * Supprime la photo de profil
   */
  async deleteProfilePhoto(): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/delete-photo`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la suppression de la photo'
      };
    }
  }

  /**
   * Récupère l'historique de connexion
   */
  async getConnectionHistory(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/connection-history`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération de l\'historique'
      };
    }
  }

  /**
   * Déconnecte l'utilisateur de tous les appareils
   */
  async logoutFromAllDevices(): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/logout-all-devices`, {
        method: 'POST',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la déconnexion de tous les appareils'
      };
    }
  }
}

export const profileService = new ProfileService(); 