import { Note, ApiNote } from '../models/note.model';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface NoteResponse {
  success: boolean;
  message: string;
  data: ApiNote[];
}

export const noteService = {
  /**
   * Récupérer directement les notes d'un élève
   */
  async getNotesEleve(eleveId: number): Promise<ApiNote[]> {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/notes/eleve/${eleveId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: NoteResponse = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  },

  async getMatieresByNiveau(niveauId: number): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/matieres/niveau/${niveauId}`);
      
      if (!response.ok) {
        return [];
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  },

  async getNiveauEleve(eleveId: number): Promise<any> {
    try {
      let response = await fetch(`${API_BASE_URL}/public/eleves/${eleveId}/niveau`);
      
      if (!response.ok) {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        response = await fetch(`${API_BASE_URL}/eleves/${eleveId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      }
      
      if (!response.ok) {
        return { success: false, data: null };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, data: null };
    }
  },

  /**
   * Organiser les notes par année scolaire et semestre
   */
  organiserNotesParAnnee(notes: ApiNote[], anneesScolaires: any[], matieresNiveau: any[] = []): any[] {
    const notesParAnnee: any[] = [];

    // Si pas de notes mais qu'on a des matières, créer des structures vides
    if (notes.length === 0 && matieresNiveau.length > 0) {
      // Créer des données par défaut pour l'année courante
      const anneeCourante = anneesScolaires.find(a => a.statut === 'active') || 
                           { id: 1, nom: '2024-2025', statut: 'active' };
      
      [1, 2].forEach(semestre => {
        const notesParMatiere = matieresNiveau.map(matiere => ({
          id: matiere.id,
          nom: matiere.nom,
          notes: [
            { type_evaluation: 'devoir1', note: 0, coefficient: matiere.coefficient || 1, appreciation: '-' },
            { type_evaluation: 'devoir2', note: 0, coefficient: matiere.coefficient || 1, appreciation: '-' },
            { type_evaluation: 'examen', note: 0, coefficient: matiere.coefficient || 1, appreciation: '-' }
          ],
          moyenne: 0,
          coefficient: matiere.coefficient || 1
        }));
        
        notesParAnnee.push({
          anneeId: anneeCourante.id,
          anneeScolaireNom: anneeCourante.nom,
          statut: anneeCourante.statut,
          semestre,
          notesParMatiere
        });
      });
      
      return notesParAnnee;
    }

    if (notes.length === 0) {
      return notesParAnnee;
    }

    // Utiliser les matières du niveau si disponibles, sinon utiliser celles des notes
    const toutesMatieres = new Set<number>();
    
    if (matieresNiveau.length > 0) {
      // Utiliser toutes les matières du niveau
      matieresNiveau.forEach(matiere => {
        toutesMatieres.add(matiere.id);
      });
    } else {
      // Fallback : utiliser les matières des notes
      notes.forEach(note => {
        toutesMatieres.add(note.matiere_id);
      });
    }

    // Grouper les notes par année scolaire et semestre
    const groupes = notes.reduce((acc, note) => {
      const anneeId = note.annee_scolaire_id;
      const semestre = note.semestre;
      
      if (!acc[anneeId]) {
        acc[anneeId] = {};
      }
      if (!acc[anneeId][semestre]) {
        acc[anneeId][semestre] = [];
      }
      acc[anneeId][semestre].push(note);
      return acc;
    }, {} as Record<number, Record<number, ApiNote[]>>);

    // Si pas de notes mais qu'on a des années scolaires, créer des groupes par défaut
    if (Object.keys(groupes).length === 0 && anneesScolaires.length > 0) {
      const anneeCourante = anneesScolaires.find(a => a.statut === 'active') || anneesScolaires[0];
      if (anneeCourante) {
        groupes[anneeCourante.id] = { 1: [], 2: [] };
      }
    }

    // Créer les objets pour chaque année scolaire
    Object.keys(groupes).forEach(anneeId => {
      const anneeIdNum = parseInt(anneeId);
      
      // Si anneesScolaires est vide, créer des données de fallback
      let anneeScolaireNom = `Année ${anneeIdNum}`;
      let statut = 'terminee';
      
      if (anneesScolaires && anneesScolaires.length > 0) {
        const anneeScolaire = anneesScolaires.find(a => a.id === anneeIdNum);
        if (anneeScolaire) {
          anneeScolaireNom = anneeScolaire.nom;
          // Déterminer le statut basé sur l'année scolaire
          statut = anneeScolaire.statut || 'terminee';
        }
      }

      // Traiter chaque semestre
      Object.keys(groupes[anneeIdNum]).forEach(semestreStr => {
        const semestre = parseInt(semestreStr);
        const notesSemestre = groupes[anneeIdNum][semestre];

        // Initialiser toutes les matières du niveau avec des notes par défaut
        const notesParMatiere: any = {};
        matieresNiveau.forEach(matiereNiveau => {
          notesParMatiere[matiereNiveau.id] = {
            id: matiereNiveau.id,
            nom: matiereNiveau.nom,
            notes: [],
            moyenne: 0,
            coefficient: matiereNiveau.coefficient || 0
          };
        });

        // Ajouter les vraies notes pour chaque matière
        notesSemestre.forEach(note => {
          const matiereId = note.matiere_id;
          if (notesParMatiere[matiereId]) {
            notesParMatiere[matiereId].notes.push(note);
            // Assurer que le coefficient est pris de la note réelle si disponible
            notesParMatiere[matiereId].coefficient = note.coefficient;
          }
        });

        // Ajouter des notes par défaut (0) pour les types manquants
        Object.values(notesParMatiere).forEach((matiere: any) => {
          const typesEvaluation = ['devoir1', 'devoir2', 'examen'];
          const notesExistant = matiere.notes.map((n: any) => n.type_evaluation);
          typesEvaluation.forEach(type => {
            if (!notesExistant.includes(type)) {
              matiere.notes.push({
                id: 0, eleve_id: 0, cours_id: 0, matiere_id: matiere.id,
                annee_scolaire_id: anneeIdNum, semestre: semestre, type_evaluation: type,
                note: 0, coefficient: matiere.coefficient, appreciation: '-',
                date_evaluation: null, commentaire: null,
                matiere: { id: matiere.id, nom: matiere.nom, code: '' },
                cours: { id: 0, titre: '', matiere_id: matiere.id },
                annee_scolaire: { id: anneeIdNum, nom: anneeScolaireNom, statut }
              });
            }
          });
        });

        // Calculer les moyennes par matière avec coefficients (excluant les 0)
        Object.values(notesParMatiere).forEach((matiere: any) => {
          if (matiere.notes.length > 0) {
            const notesValides = matiere.notes.filter((note: any) => note.note > 0);
            if (notesValides.length > 0) {
              // Coefficients par type d'évaluation
              const coeffsEvaluation = {
                'devoir1': 1,
                'devoir2': 1, 
                'examen': 2
              };
              
              const totalPondere = notesValides.reduce((sum: number, note: any) => {
                const coeff = coeffsEvaluation[note.type_evaluation as keyof typeof coeffsEvaluation] || 1;
                return sum + (note.note * coeff);
              }, 0);
              
              const totalCoefficients = notesValides.reduce((sum: number, note: any) => {
                const coeff = coeffsEvaluation[note.type_evaluation as keyof typeof coeffsEvaluation] || 1;
                return sum + coeff;
              }, 0);
              
              matiere.moyenne = totalCoefficients > 0 ? Math.round((totalPondere / totalCoefficients) * 100) / 100 : 0;
            }
          }
        });

        // Calculer la moyenne générale du semestre
        const matieresAvecNotes = Object.values(notesParMatiere).filter((m: any) => m.moyenne > 0);
        let moyenneSemestre = 0;
        if (matieresAvecNotes.length > 0) {
          const totalPondereSemestre = matieresAvecNotes.reduce((sum: number, matiere: any) => {
            const coeff = parseFloat(matiere.coefficient) || 1;
            return sum + (matiere.moyenne * coeff);
          }, 0);
          const totalCoefficientsSemestre = matieresAvecNotes.reduce((sum: number, matiere: any) => {
            const coeff = parseFloat(matiere.coefficient) || 1;
            return sum + coeff;
          }, 0);
          moyenneSemestre = totalCoefficientsSemestre > 0 ? Math.round((totalPondereSemestre / totalCoefficientsSemestre) * 100) / 100 : 0;
        }

        notesParAnnee.push({
          anneeId: anneeIdNum,
          anneeScolaireNom,
          statut,
          semestre,
          notesParMatiere: Object.values(notesParMatiere),
          moyenneSemestre
        });
      });
    });

    // Calculer les moyennes annuelles
    const anneesAvecMoyennes = notesParAnnee.reduce((acc: any, semestre: any) => {
      const anneeId = semestre.anneeId;
      if (!acc[anneeId]) {
        acc[anneeId] = {
          anneeId,
          anneeScolaireNom: semestre.anneeScolaireNom,
          statut: semestre.statut,
          semestres: [],
          moyenneAnnuelle: 0
        };
      }
      acc[anneeId].semestres.push(semestre);
      return acc;
    }, {});

    // Calculer la moyenne annuelle pour chaque année
    Object.values(anneesAvecMoyennes).forEach((annee: any) => {
      const moyennesSemestres = annee.semestres.map((s: any) => s.moyenneSemestre).filter((m: number) => m > 0);
      if (moyennesSemestres.length > 0) {
        annee.moyenneAnnuelle = Math.round((moyennesSemestres.reduce((sum: number, moy: number) => sum + moy, 0) / moyennesSemestres.length) * 100) / 100;
      }
    });

    // Ajouter les moyennes annuelles aux semestres
    notesParAnnee.forEach(semestre => {
      const anneeData = anneesAvecMoyennes[semestre.anneeId];
      if (anneeData) {
        semestre.moyenneAnnuelle = anneeData.moyenneAnnuelle;
      }
    });

    return notesParAnnee;
  }
}; 