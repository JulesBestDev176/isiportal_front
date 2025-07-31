import { Bulletin } from '../models';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export const bulletinService = {
  async getBulletinsEleve(eleveId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/bulletins/eleve/${eleveId}`, {
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
      
      if (data.success && data.data) {
        const bulletins = data.data.map((bulletin: any) => ({
          id: bulletin.id,
          eleve_id: bulletin.eleve_id,
          annee_scolaire_id: bulletin.annee_scolaire_id,
          semestre: bulletin.semestre,
          moyenne_generale: bulletin.moyenne_generale,
          appreciation: bulletin.appreciation,
          notes: bulletin.notes || [],
          moyenne_calculee: bulletin.moyenne_calculee || 0
        }));
        
        return bulletins;
      }
      
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des bulletins:', error);
      return [];
    }
  },

  organiserBulletinsParAnnee(bulletins: Bulletin[], anneesScolaires: any[]) {
    const bulletinsParAnnee: any[] = [];

    if (bulletins.length === 0) {
      return bulletinsParAnnee;
    }

    // Grouper les bulletins par année scolaire
    const groupes = bulletins.reduce((acc, bulletin) => {
      const anneeId = bulletin.anneeScolaireId || (bulletin as any).annee_scolaire_id;
      if (!acc[anneeId]) {
        acc[anneeId] = [];
      }
      acc[anneeId].push(bulletin);
      return acc;
    }, {} as Record<number, Bulletin[]>);

    // Créer les objets pour chaque année scolaire
    Object.keys(groupes).forEach(anneeId => {
      const anneeIdNum = parseInt(anneeId);
      const bulletinsAnnee = groupes[anneeIdNum];
      
      // Trouver l'année scolaire correspondante
      const anneeScolaire = anneesScolaires.find(a => a.id === anneeIdNum);
      const anneeScolaireNom = anneeScolaire ? anneeScolaire.nom : `Année ${anneeIdNum}`;
      const statut = anneeScolaire ? anneeScolaire.statut : 'terminee';

      // Organiser par semestre
      const bulletinsParSemestre = bulletinsAnnee.reduce((acc, bulletin) => {
        const semestre = bulletin.semestre;
        if (!acc[semestre]) {
          acc[semestre] = [];
        }
        acc[semestre].push(bulletin);
        return acc;
      }, {} as Record<number, Bulletin[]>);

      // Créer les objets pour chaque semestre
      Object.keys(bulletinsParSemestre).forEach(semestreStr => {
        const semestre = parseInt(semestreStr);
        const bulletinsSemestre = bulletinsParSemestre[semestre];

        bulletinsParAnnee.push({
          anneeId: anneeIdNum,
          anneeScolaireNom,
          statut,
          semestre,
          bulletins: bulletinsSemestre
        });
      });
    });

    return bulletinsParAnnee;
  }
}; 