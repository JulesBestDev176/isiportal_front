import { safeApiCall, getAuthHeaders, ApiResponse } from '../utils/apiHelpers';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// Cache pour éviter les appels répétés
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 secondes

// Fonction de retry avec backoff exponentiel
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  baseDelay: number = 500
): Promise<T> => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

// Fonction pour vérifier le cache
const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Fonction pour mettre en cache
const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const professeurService = {
  async getDashboardStats(): Promise<ApiResponse<any>> {
    const cacheKey = 'professeur-stats';
    const cached = getCachedData(cacheKey);
    if (cached) {
      return { success: true, data: cached, message: 'Données en cache' };
    }

    return retryWithBackoff(async () => {
      const result = await safeApiCall(
        () => fetch(`${API_BASE_URL}/dashboard/professeur/stats`, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        {},
        'Statistiques du professeur récupérées avec succès'
      );
      
      if (result.success && result.data) {
        setCachedData(cacheKey, result.data);
      }
      
      return result;
    });
  },

  async getClasses(): Promise<ApiResponse<any[]>> {
    const cacheKey = 'professeur-classes';
    const cached = getCachedData(cacheKey);
    if (cached) {
      return { success: true, data: cached, message: 'Données en cache' };
    }

    return retryWithBackoff(async () => {
      const result = await safeApiCall(
        () => fetch(`${API_BASE_URL}/dashboard/professeur/classes`, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        [],
        'Classes du professeur récupérées avec succès'
      );
      
      if (result.success && result.data) {
        setCachedData(cacheKey, result.data);
      }
      
      return result;
    });
  },

  async getCours(): Promise<ApiResponse<any[]>> {
    const cacheKey = 'professeur-cours';
    const cached = getCachedData(cacheKey);
    if (cached) {
      return { success: true, data: cached, message: 'Données en cache' };
    }

    return retryWithBackoff(async () => {
      const result = await safeApiCall(
        () => fetch(`${API_BASE_URL}/professeur/cours`, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        [],
        'Cours du professeur récupérés avec succès'
      );
      
      if (result.success && result.data) {
        setCachedData(cacheKey, result.data);
      }
      
      return result;
    });
  },

  async getNotesRecentes(): Promise<ApiResponse<any[]>> {
    const cacheKey = 'professeur-notes';
    const cached = getCachedData(cacheKey);
    if (cached) {
      return { success: true, data: cached, message: 'Données en cache' };
    }

    return retryWithBackoff(async () => {
      const result = await safeApiCall(
        () => fetch(`${API_BASE_URL}/dashboard/professeur/notes-recentes`, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        [],
        'Notes récentes récupérées avec succès'
      );
      
      if (result.success && result.data) {
        setCachedData(cacheKey, result.data);
      }
      
      return result;
    });
  },

  // Nouvelle méthode pour charger toutes les données en parallèle
  async getAllDashboardData(): Promise<{
    stats: any;
    classes: any[];
    cours: any[];
    notes: any[];
  }> {
    try {
      // Lancer tous les appels en parallèle
      const [statsResult, classesResult, coursResult, notesResult] = await Promise.allSettled([
        this.getDashboardStats(),
        this.getClasses(),
        this.getCours(),
        this.getNotesRecentes()
      ]);

      // Traiter les résultats avec fallback
      const stats = statsResult.status === 'fulfilled' && statsResult.value.success 
        ? statsResult.value.data 
        : {};
      
      const classes = classesResult.status === 'fulfilled' && classesResult.value.success 
        ? classesResult.value.data 
        : [];
      
      const cours = coursResult.status === 'fulfilled' && coursResult.value.success 
        ? coursResult.value.data 
        : [];
      
      const notes = notesResult.status === 'fulfilled' && notesResult.value.success 
        ? notesResult.value.data 
        : [];

      // Retry pour les données qui ont échoué
      const failedRequests: string[] = [];
      if (statsResult.status === 'rejected') failedRequests.push('stats');
      if (classesResult.status === 'rejected') failedRequests.push('classes');
      if (coursResult.status === 'rejected') failedRequests.push('cours');
      if (notesResult.status === 'rejected') failedRequests.push('notes');

      // Retry en arrière-plan pour les données échouées
      if (failedRequests.length > 0) {
        setTimeout(async () => {
          for (const failed of failedRequests) {
            try {
              switch (failed) {
                case 'stats':
                  await this.getDashboardStats();
                  break;
                case 'classes':
                  await this.getClasses();
                  break;
                case 'cours':
                  await this.getCours();
                  break;
                case 'notes':
                  await this.getNotesRecentes();
                  break;
              }
            } catch (error) {
              console.warn(`Retry failed for ${failed}:`, error);
            }
          }
        }, 2000);
      }

      return { stats, classes, cours, notes };
    } catch (error) {
      console.error('Erreur lors du chargement des données professeur:', error);
      return { stats: {}, classes: [], cours: [], notes: [] };
    }
  },

  // Méthode pour vider le cache
  clearCache(): void {
    cache.clear();
  }
};