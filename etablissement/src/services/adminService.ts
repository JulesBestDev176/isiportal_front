import { buildApiUrl, getAuthHeaders } from './config';

// Service pour les fonctionnalités d'administration
export const adminService = {
  // ===== GESTION DES UTILISATEURS =====
  
  // Récupérer tous les utilisateurs
  async getUsers(params?: any): Promise<any> {
    console.log('=== DÉBUT getUsers ===');
    console.log('Params reçus:', params);
    
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) queryParams.append(key, value.toString());
      });
    }
    
    // Par défaut, charger tous les utilisateurs pour éviter les problèmes de pagination
    // Sauf si une limite spécifique est demandée
    if (!params || !params.limit) {
      queryParams.append('per_page', '1000');
      queryParams.append('page', '1');
    }

    const url = buildApiUrl(`/users?${queryParams}`);
    console.log('URL appelée:', url);
    
    const headers = getAuthHeaders();
    console.log('Headers:', headers);

    try {
      const response = await fetch(url, {
        headers: headers
      });
      
      console.log('Status de la réponse:', response.status);
      console.log('Headers de la réponse:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur HTTP:', response.status, errorText);
        throw new Error(`Erreur lors de la récupération des utilisateurs: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Données reçues:', data);
      console.log('=== FIN getUsers ===');
      return data;
    } catch (error) {
      console.error('Exception dans getUsers:', error);
      console.log('=== FIN getUsers avec erreur ===');
      throw error;
    }
  },

  // Récupérer TOUS les utilisateurs sans aucune limite (pour les cas spéciaux)
  async getAllUsers(): Promise<any> {
    console.log('=== DÉBUT getAllUsers ===');
    
    const url = buildApiUrl('/users?per_page=1000&page=1');
    console.log('URL appelée:', url);
    
    const headers = getAuthHeaders();
    console.log('Headers:', headers);

    try {
      const response = await fetch(url, {
        headers: headers
      });
      
      console.log('Status de la réponse:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur HTTP:', response.status, errorText);
        throw new Error(`Erreur lors de la récupération de tous les utilisateurs: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Nombre total d\'utilisateurs reçus:', data.data?.data?.length || 0);
      console.log('=== FIN getAllUsers ===');
      return data;
    } catch (error) {
      console.error('Exception dans getAllUsers:', error);
      console.log('=== FIN getAllUsers avec erreur ===');
      throw error;
    }
  },

  // Alias pour getUsers (pour compatibilité)
  async getUtilisateurs(params?: any): Promise<any> {
    return this.getUsers(params);
  },

  // Créer un utilisateur
  async createUser(userData: any): Promise<any> {
    const response = await fetch(buildApiUrl('/users'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de l\'utilisateur');
    return response.json();
  },

  // Mettre à jour un utilisateur
  async updateUser(id: number, userData: any): Promise<any> {
    const response = await fetch(buildApiUrl(`/users/${id}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
    return response.json();
  },

  // Supprimer un utilisateur
  async deleteUser(id: number): Promise<any> {
    const response = await fetch(buildApiUrl(`/users/${id}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de l\'utilisateur');
    return response.json();
  },



  // ===== GESTION DES NIVEAUX =====
  
  // Récupérer tous les niveaux
  async getNiveaux(): Promise<any> {
    const response = await fetch(buildApiUrl('/admin/niveaux?per_page=100'), {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur HTTP:', response.status, errorText);
      throw new Error(`Erreur lors de la récupération des niveaux: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    // Si la réponse contient une pagination, extraire les données
    if (data.success && data.data && data.data.data) {
      return {
        success: true,
        data: data.data.data, // Extraire les données de la pagination
        message: data.message
      };
    }
    
    // Si pas de pagination, retourner directement
    if (data.success && data.data && Array.isArray(data.data)) {
      return data;
    }
    
    return data;
  },

  // Récupérer toutes les matières
  async getMatieres(): Promise<any> {
    const response = await fetch(buildApiUrl('/admin/matieres?per_page=100'), {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur HTTP:', response.status, errorText);
      throw new Error(`Erreur lors de la récupération des matières: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    // Si la réponse contient une pagination, extraire les données
    if (data.success && data.data && data.data.data) {
      return {
        success: true,
        data: data.data.data,
        message: data.message
      };
    }
    
    // Si pas de pagination, retourner directement
    if (data.success && data.data && Array.isArray(data.data)) {
      return data;
    }
    
    return data;
  },

  // Créer un niveau
  async createNiveau(niveauData: any): Promise<any> {
    const response = await fetch(buildApiUrl('/admin/niveaux'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(niveauData)
    });
    if (!response.ok) throw new Error('Erreur lors de la création du niveau');
    return response.json();
  },

  // Mettre à jour un niveau
  async updateNiveau(id: number, niveauData: any): Promise<any> {
    const response = await fetch(buildApiUrl(`/admin/niveaux/${id}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(niveauData)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du niveau');
    return response.json();
  },

  // Supprimer un niveau
  async deleteNiveau(id: number): Promise<any> {
    const response = await fetch(buildApiUrl(`/admin/niveaux/${id}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression du niveau');
    return response.json();
  },

  // ===== GESTION DES CLASSES =====
  
  // Récupérer toutes les classes
  async getClasses(params?: any): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(buildApiUrl(`/admin/classes?${queryParams}`), {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des classes');
    return response.json();
  },

  // Créer une classe
  async createClasse(classeData: any): Promise<any> {
    const response = await fetch(buildApiUrl('/admin/classes'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(classeData)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la classe');
    return response.json();
  },

  // Mettre à jour une classe
  async updateClasse(id: number, classeData: any): Promise<any> {
    const response = await fetch(buildApiUrl(`/admin/classes/${id}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(classeData)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la classe');
    return response.json();
  },

  // Supprimer une classe
  async deleteClasse(id: number): Promise<any> {
    const response = await fetch(buildApiUrl(`/admin/classes/${id}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la classe');
    return response.json();
  },

  // ===== GESTION DES COURS =====
  
  // Récupérer tous les cours
  async getCours(params?: any): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(buildApiUrl(`/admin/cours?${queryParams}`), {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des cours');
    return response.json();
  },

  // Créer un cours
  async createCours(coursData: any): Promise<any> {
    const response = await fetch(buildApiUrl('/admin/cours'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(coursData)
    });
    if (!response.ok) throw new Error('Erreur lors de la création du cours');
    return response.json();
  },

  // Mettre à jour un cours
  async updateCours(id: number, coursData: any): Promise<any> {
    const response = await fetch(buildApiUrl(`/admin/cours/${id}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(coursData)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du cours');
    return response.json();
  },

  // Supprimer un cours
  async deleteCours(id: number): Promise<any> {
    const response = await fetch(buildApiUrl(`/admin/cours/${id}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression du cours');
    return response.json();
  },

  // ===== GESTION DES SALLES =====
  
  // Récupérer toutes les salles
  async getSalles(params?: any): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(buildApiUrl(`/admin/salles?${queryParams}`), {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des salles');
    return response.json();
  },

  // Créer une salle
  async createSalle(salleData: any): Promise<any> {
    const response = await fetch(buildApiUrl('/admin/salles'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(salleData)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la salle');
    return response.json();
  },

  // Mettre à jour une salle
  async updateSalle(id: number, salleData: any): Promise<any> {
    const response = await fetch(buildApiUrl(`/admin/salles/${id}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(salleData)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la salle');
    return response.json();
  },

  // Supprimer une salle
  async deleteSalle(id: number): Promise<any> {
    const response = await fetch(buildApiUrl(`/admin/salles/${id}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la salle');
    return response.json();
  },

  // ===== GESTION DES BÂTIMENTS =====
  
  // Récupérer tous les bâtiments
  async getBatiments(params?: any): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(buildApiUrl(`/admin/batiments?${queryParams}`), {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des bâtiments');
    return response.json();
  },

  // Créer un bâtiment
  async createBatiment(batimentData: any): Promise<any> {
    const response = await fetch(buildApiUrl('/admin/batiments'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(batimentData)
    });
    if (!response.ok) throw new Error('Erreur lors de la création du bâtiment');
    return response.json();
  },

  // Mettre à jour un bâtiment
  async updateBatiment(id: number, batimentData: any): Promise<any> {
    const response = await fetch(buildApiUrl(`/admin/batiments/${id}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(batimentData)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du bâtiment');
    return response.json();
  },

  // Supprimer un bâtiment
  async deleteBatiment(id: number): Promise<any> {
    const response = await fetch(buildApiUrl(`/admin/batiments/${id}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression du bâtiment');
    return response.json();
  },

  // ===== GESTION DES ANNÉES SCOLAIRES =====
  
  // Récupérer toutes les années scolaires
  async getAnneesScolaires(): Promise<any> {
    const response = await fetch(buildApiUrl('/admin/annees-scolaires'), {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des années scolaires');
    return response.json();
  },

  // ===== TRANSFERT D'ÉLÈVES =====
  
  // Transférer des élèves entre classes
  async transfererEleves(classeId: number, reglesTransfert: any): Promise<any> {
    const response = await fetch(buildApiUrl(`/admin/classes/${classeId}/transferer-eleves`), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reglesTransfert)
    });
    if (!response.ok) throw new Error('Erreur lors du transfert des élèves');
    return response.json();
  },

  // ===== DASHBOARD ET ANALYTICS =====
  
  // Récupérer les statistiques du dashboard
  async getDashboardStats(): Promise<any> {
    const response = await fetch(buildApiUrl('/admin/dashboard'), {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des statistiques');
    return response.json();
  },

  // Récupérer les analytics
  async getAnalytics(params?: any): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(buildApiUrl(`/admin/analytics?${queryParams}`), {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des analytics');
    return response.json();
  },

  // ===== GESTION DES RÈGLES DE TRANSFERT =====
  
  // Récupérer les règles de transfert globales
  async getReglesTransfert(): Promise<any> {
    try {
      const response = await fetch(buildApiUrl('/admin/regles-transfert'), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des règles de transfert: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur dans getReglesTransfert:', error);
      throw error;
    }
  },

  // Récupérer toutes les règles de transfert (pour l'admin)
  async getAllReglesTransfert(): Promise<any> {
    try {
      const response = await fetch(buildApiUrl('/admin/regles-transfert/all'), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de toutes les règles de transfert: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur dans getAllReglesTransfert:', error);
      throw error;
    }
  },

  // Mettre à jour les règles de transfert
  async updateReglesTransfert(reglesData: any): Promise<any> {
    try {
      const response = await fetch(buildApiUrl('/admin/regles-transfert'), {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reglesData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur lors de la mise à jour des règles de transfert: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur dans updateReglesTransfert:', error);
      throw error;
    }
  },

  // Récupérer les règles pour un niveau spécifique
  async getReglesTransfertByNiveau(niveauSource: string): Promise<any> {
    try {
      const response = await fetch(buildApiUrl(`/admin/regles-transfert/${encodeURIComponent(niveauSource)}`), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des règles pour le niveau ${niveauSource}: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur dans getReglesTransfertByNiveau:', error);
      throw error;
    }
  },

  // ===== GESTION DES ANALYTICS =====
}; 