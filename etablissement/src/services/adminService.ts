import { Utilisateur, Classe, AnneeScolaire, Niveau, Matiere, Cours, Salle, Batiment, ReglesTransfert } from '../models';
import { safeApiCall, getAuthHeaders, ApiResponse } from '../utils/apiHelpers';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export const adminService = {
  async getUsers(params: any = {}): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.role) queryParams.append('role', params.role);

    return safeApiCall(
      () => fetch(`${API_BASE_URL}/admin/users?${queryParams.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      [],
      'Utilisateurs récupérés avec succès'
    );
  },

  async getAllUsers(): Promise<ApiResponse<any[]>> {
    return safeApiCall(
      () => fetch(`${API_BASE_URL}/admin/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      [],
      'Utilisateurs récupérés avec succès'
    );
  },

  async createUser(userData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  },

  async updateUser(userId: number, userData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },

  async deleteUser(userId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  },

  async getClasses(): Promise<ApiResponse<any[]>> {
    return safeApiCall(
      () => fetch(`${API_BASE_URL}/admin/classes`, {
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      [],
      'Classes récupérées avec succès'
    );
  },

  async createClasse(classeData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(classeData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la classe:', error);
      throw error;
    }
  },

  async updateClasse(classeId: number, classeData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/classes/${classeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(classeData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la classe:', error);
      throw error;
    }
  },

  async deleteClasse(classeId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/classes/${classeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de la classe:', error);
      throw error;
    }
  },

  async transfererEleve(eleveId: number, classeDestination: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/eleves/${eleveId}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ classe_destination: classeDestination })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors du transfert de l\'élève:', error);
      throw error;
    }
  },

  async transfererElevesAutomatiquement(classeId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/classes/${classeId}/transfer-eleves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors du transfert automatique des élèves:', error);
      throw error;
    }
  },

  async confirmerTransfertAutomatique() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/transfer-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la confirmation du transfert automatique:', error);
      throw error;
    }
  },

  async saveReglesTransfert(regles: ReglesTransfert) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/regles-transfert`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(regles)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des règles de transfert:', error);
      throw error;
    }
  },

  async evolutionAnneeScolaire() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/evolution-annee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'évolution d\'année scolaire:', error);
      throw error;
    }
  },

  async updateAnneeScolaire(anneeId: number, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/annees-scolaires/${anneeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'année scolaire:', error);
      throw error;
    }
  },

  async getAnneesScolaires(): Promise<ApiResponse<any[]>> {
    return safeApiCall(
      () => fetch(`${API_BASE_URL}/admin/annees-scolaires`, {
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      [],
      'Années scolaires récupérées avec succès'
    );
  },

  async getNiveaux(): Promise<ApiResponse<any[]>> {
    return safeApiCall(
      () => fetch(`${API_BASE_URL}/admin/niveaux`, {
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      [],
      'Niveaux récupérés avec succès'
    );
  },

  async getReglesTransfert() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/regles-transfert`, {
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
      return {
        success: true,
        data: data?.data || data || {},
        message: data?.message || 'Règles de transfert récupérées avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des règles de transfert:', error);
      return {
        success: false,
        data: {},
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Méthodes manquantes ajoutées
  async getCours(params: any = {}): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.matiere_id) queryParams.append('matiere_id', params.matiere_id.toString());
    if (params.niveau_id) queryParams.append('niveau_id', params.niveau_id.toString());
    if (params.statut) queryParams.append('statut', params.statut);

    const url = queryParams.toString() ? 
      `${API_BASE_URL}/admin/cours?${queryParams.toString()}` : 
      `${API_BASE_URL}/admin/cours`;

    return safeApiCall(
      () => fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      [],
      'Cours récupérés avec succès'
    );
  },

  async getMatieres(): Promise<ApiResponse<any[]>> {
    return safeApiCall(
      () => fetch(`${API_BASE_URL}/admin/matieres`, {
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      [],
      'Matières récupérées avec succès'
    );
  },

  async getSalles(): Promise<ApiResponse<any[]>> {
    return safeApiCall(
      () => fetch(`${API_BASE_URL}/admin/salles`, {
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      [],
      'Salles récupérées avec succès'
    );
  },

  async createSalle(salleData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/salles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(salleData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la salle:', error);
      throw error;
    }
  },

  async updateSalle(salleId: number, salleData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/salles/${salleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(salleData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la salle:', error);
      throw error;
    }
  },

  async deleteSalle(salleId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/salles/${salleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de la salle:', error);
      throw error;
    }
  },

  async createBatiment(batimentData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/batiments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(batimentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du bâtiment:', error);
      throw error;
    }
  },

  async updateBatiment(batimentId: number, batimentData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/batiments/${batimentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(batimentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du bâtiment:', error);
      throw error;
    }
  },

  async deleteBatiment(batimentId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/batiments/${batimentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression du bâtiment:', error);
      throw error;
    }
  },

  async createNiveau(niveauData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/niveaux`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(niveauData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du niveau:', error);
      throw error;
    }
  },

  async updateNiveau(niveauId: number, niveauData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/niveaux/${niveauId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(niveauData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du niveau:', error);
      throw error;
    }
  },

  async deleteNiveau(niveauId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/niveaux/${niveauId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression du niveau:', error);
      throw error;
    }
  },

  // Cours methods
  async createCours(coursData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/cours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(coursData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du cours:', error);
      throw error;
    }
  },

  async updateCours(coursId: number, coursData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/cours/${coursId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(coursData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du cours:', error);
      throw error;
    }
  },

  async deleteCours(coursId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/cours/${coursId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression du cours:', error);
      throw error;
    }
  },

  // Batiment methods
  async getBatiments(): Promise<ApiResponse<any[]>> {
    return safeApiCall(
      () => fetch(`${API_BASE_URL}/admin/batiments`, {
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      [],
      'Bâtiments récupérés avec succès'
    );
  },

  // Méthode optimisée pour récupérer toutes les données initiales
  async getInitialData(): Promise<ApiResponse<any>> {
    return safeApiCall(
      () => fetch(`${API_BASE_URL}/admin/initial-data`, {
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      {},
      'Données initiales récupérées avec succès'
    );
  },

  // Méthode de test pour vérifier les cours-professeurs
  async testCoursProfesseurs(): Promise<ApiResponse<any>> {
    return safeApiCall(
      () => fetch(`${API_BASE_URL}/test/cours-professeurs-public`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      }),
      {},
      'Test cours-professeurs effectué'
    );
  }
};

// Fonction utilitaire pour tester les données
export const testCoursProfesseurs = async () => {
  try {
    const result = await adminService.testCoursProfesseurs();
    console.log('=== TEST COURS-PROFESSEURS ===');
    console.log('Résultat:', result);
    return result;
  } catch (error) {
    console.error('Erreur test cours-professeurs:', error);
    return null;
  }
};