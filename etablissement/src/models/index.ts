// Export des modèles de communication
export type {
  Contact,
  Notification,
  NotificationLocale,
  ContactEtendu
} from './communication.model';

// Export des modèles de cours
export type {
  Cours,
  Creneau,
  AssignationCoursClasse,
  AssignationCours,
  ProgressionSeance,
  FormDataCours,
  CoursErrors
} from './cours.model';

// Export des modèles d'élève
export type {
  EleveClasse,
  ProfMatiere,
  Etudiant,
  Note,
  TypeEvaluation
} from './eleve.model';

export {
  TYPES_EVALUATION
} from './eleve.model';

// Export des modèles de classe
export type {
  Classe,
  FormDataClasse,
  ClasseErrors,
  MatiereBulletin,
  BulletinSemestre
} from './classe.model';

// Export des modèles d'année scolaire
export type {
  AnneeScolaire,
  PeriodeScolaire,
  StatutAnneeScolaire,
  StatutPeriode
} from './annee-scolaire.model';

export {
  STATUTS_ANNEE_SCOLAIRE,
  STATUTS_PERIODE,
  getAnneeScolaireActuelle,
  getAnneeScolaireParId,
  formaterAnneeScolaire
} from './annee-scolaire.model';

// Export des modèles de bulletin
export type {
  Bulletin,
  BulletinEleve,
  BulletinResponse
} from './bulletin.model';

// Export des modèles d'utilisateur
export type {
  Utilisateur,
  Administrateur,
  Gestionnaire,
  Professeur,
  Eleve,
  Parent,
  FormDataUtilisateur,
  RoleUtilisateur,
  SectionType,
  PrivilegeAdmin,
  TypeParent,
  NoteDetails,
  SemestreNotes,
  AnneeNotes,
  NotesEleve
} from './utilisateur.model';

export {
  SECTIONS,
  MATIERES_LIST,
  CLASSES_LIST,
  PRIVILEGES_ADMIN,
  ROLES_UTILISATEUR,
  TYPES_PARENT,
  getRoleInfo,
  getRoleColorClass,
  getStatutColorClass
} from './utilisateur.model';

// Export des modèles de niveau
export type {
  Niveau,
  FormDataNiveau
} from './niveau.model';

// Export des modèles de matière
export type {
  Matiere,
  MatiereNiveau,
  StatutMatiere,
  CodeMatiere
} from './matiere.model';

export {
  MATIERES_COURANTES,
  STATUTS_MATIERE,
  getStatutInfo,
  getMatiereColorClass,
  getMatiereByCode
} from './matiere.model';

// Export des modèles de salle
export type {
  Salle,
  FormDataSalle,
  SalleErrors
} from './salle.model';

export {
  STATUTS_SALLE,
  TYPES_SALLE,
  getStatutInfo as getSalleStatutInfo,
  getTypeInfo as getSalleTypeInfo,
  getSalleColorClass
} from './salle.model';

// Export des modèles de bâtiment
export type {
  Batiment,
  FormDataBatiment,
  BatimentErrors
} from './batiment.model';

export {
  STATUTS_BATIMENT,
  getStatutInfo as getBatimentStatutInfo,
  getBatimentColorClass
} from './batiment.model';

// Export des modèles de règles de transfert
export type {
  ReglesTransfert
} from './regles-transfert.model';

export {
  getStatutInfo as getRegleStatutInfo,
  getRegleColorClass
} from './regles-transfert.model';

// Export des modèles d'analytics
export type {
  MetriqueKPI,
  DonneesTendance,
  PerformanceClasse,
  ActiviteUtilisateur,
  StatistiqueRole
} from './analytics.model';