<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NiveauController;
use App\Http\Controllers\Api\MatiereController;
use App\Http\Controllers\Api\AnneeScolaireController;
use App\Http\Controllers\Api\ClasseController;
use App\Http\Controllers\Api\CoursController;
use App\Http\Controllers\Api\SalleController;
use App\Http\Controllers\Api\BatimentController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\BulletinController;
use App\Http\Controllers\Api\HistoriqueEleveController;
use App\Http\Controllers\Api\ReglesTransfertController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\AbsenceController;
use App\Http\Controllers\Api\EmploiDuTempsController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\CreneauController;
use App\Http\Controllers\Api\AssignationCoursClasseController;
use App\Http\Controllers\Api\RessourceController;
use App\Http\Controllers\Api\HistoriqueConnexionController;
use App\Http\Controllers\Api\EleveController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EleveClasseController;
use App\Http\Controllers\Api\TestController;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes publiques
Route::post('/auth/login', [AuthController::class, 'login']);

// Route publique pour récupérer le niveau d'un élève
Route::get('/public/eleves/{eleveId}/niveau', [EleveController::class, 'getNiveauEleve']);

// Route de test simple
Route::get('/ping', function() {
    return response()->json([
        'success' => true,
        'message' => 'API Laravel fonctionne',
        'timestamp' => now(),
        'server' => 'ISIPortal API'
    ]);
});

// Routes de test publiques avec CORS
Route::group(['middleware' => 'cors'], function () {
    Route::get('/test/cors-check', function() {
        return response()->json([
            'success' => true,
            'message' => 'CORS fonctionne',
            'timestamp' => now()
        ])->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    });
    
    Route::get('/test/notes-simple/{eleveId}', function($eleveId) {
        $notes = \App\Models\Note::where('eleve_id', $eleveId)
            ->with(['matiere', 'anneeScolaire', 'cours'])
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $notes,
            'count' => $notes->count(),
            'eleve_id' => $eleveId
        ])->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    });
});

// Routes de test
Route::get('/test', [TestController::class, 'test'])->middleware('cors');
Route::options('/{any}', function() {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
})->where('any', '.*');
Route::get('/test/notes', function() {
    return response()->json([
        'success' => true,
        'message' => 'Test notes API',
        'data' => [
            [
                'id' => 1,
                'matiere' => ['id' => 1, 'nom' => 'Mathématiques'],
                'note' => 15.5
            ]
        ]
    ])->header('Access-Control-Allow-Origin', '*')
      ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});
Route::get('/test/seed-notes', function() {
    try {
        Artisan::call('db:seed', ['--class' => 'Database\\Seeders\\NoteTestSeeder']);
        return response()->json([
            'success' => true,
            'message' => 'Notes de test créées avec succès'
        ])->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur: ' . $e->getMessage()
        ])->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
});
Route::get('/test/create-sample-data', function() {
    try {
        // Créer un élève de test s'il n'existe pas
        $eleve = \App\Models\User::firstOrCreate(
            ['email' => 'eleve.test@isiportal.com'],
            [
                'nom' => 'Test',
                'prenom' => 'Eleve',
                'role' => 'eleve',
                'password' => bcrypt('password123'),
                'classe_id' => 1,
                'actif' => true
            ]
        );
        
        // Créer quelques notes de test
        $cours = \App\Models\Cours::first();
        $annee = \App\Models\AnneeScolaire::first();
        
        if ($cours && $annee) {
            \App\Models\Note::create([
                'eleve_id' => $eleve->id,
                'cours_id' => $cours->id,
                'matiere_id' => $cours->matiere_id,
                'annee_scolaire_id' => $annee->id,
                'semestre' => 1,
                'type_evaluation' => 'devoir1',
                'note' => 15.5,
                'coefficient' => 1.0,
                'appreciation' => 'Bon travail',
                'date_evaluation' => now()
            ]);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Données de test créées',
            'eleve_id' => $eleve->id
        ])->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur: ' . $e->getMessage()
        ])->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
});
Route::get('/test/check-data/{eleveId}', function($eleveId) {
    $eleve = \App\Models\User::with('classe.niveau')->find($eleveId);
    $notes = \App\Models\Note::where('eleve_id', $eleveId)->with(['matiere', 'anneeScolaire'])->get();
    $matieres = [];
    
    if ($eleve && $eleve->classe && $eleve->classe->niveau) {
        $matieres = \App\Models\Matiere::whereHas('niveaux', function($q) use ($eleve) {
            $q->where('niveau_id', $eleve->classe->niveau_id);
        })->get();
    }
    
    return response()->json([
        'success' => true,
        'data' => [
            'eleve' => $eleve,
            'notes_count' => $notes->count(),
            'notes' => $notes->take(5),
            'matieres_count' => $matieres->count(),
            'matieres' => $matieres
        ]
    ])->header('Access-Control-Allow-Origin', '*')
      ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});
// Routes d'analyse de la base de données
Route::get('/test/annees-scolaires', function() {
    $annees = \App\Models\AnneeScolaire::all();
    return response()->json([
        'success' => true,
        'data' => $annees,
        'count' => $annees->count()
    ])->header('Access-Control-Allow-Origin', '*');
});

Route::get('/test/classes-niveaux', function() {
    $classes = \App\Models\Classe::with('niveau')->get();
    return response()->json([
        'success' => true,
        'data' => $classes,
        'count' => $classes->count()
    ])->header('Access-Control-Allow-Origin', '*');
});

Route::get('/test/eleves-classes', function() {
    $eleves = \App\Models\User::where('role', 'eleve')
        ->with(['classe.niveau'])
        ->get()
        ->map(function($eleve) {
            return [
                'id' => $eleve->id,
                'nom' => $eleve->nom,
                'prenom' => $eleve->prenom,
                'classe_id' => $eleve->classe_id,
                'classe_nom' => $eleve->classe->nom ?? null,
                'niveau_id' => $eleve->classe->niveau_id ?? null,
                'niveau_nom' => $eleve->classe->niveau->nom ?? null
            ];
        });
    return response()->json([
        'success' => true,
        'data' => $eleves,
        'count' => $eleves->count()
    ])->header('Access-Control-Allow-Origin', '*');
});

Route::get('/test/eleves-list', function() {
    $eleves = \App\Models\User::where('role', 'eleve')
        ->with('classe.niveau')
        ->select('id', 'nom', 'prenom', 'classe_id')
        ->get();
    
    return response()->json([
        'success' => true,
        'data' => $eleves,
        'count' => $eleves->count()
    ])->header('Access-Control-Allow-Origin', '*')
      ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/test/auth', [TestController::class, 'testAuth']);
    Route::get('/test/users/all', [TestController::class, 'getAllUsers']);
});

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    
    // Routes d'authentification
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all-devices', [AuthController::class, 'logoutFromAllDevices']);
        Route::get('/check-auth', [AuthController::class, 'checkAuth']);
        Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/send-connection-info', [AuthController::class, 'sendConnectionInfo']);
        Route::get('/active-sessions', [AuthController::class, 'getActiveSessions']);
        Route::post('/terminate-session', [AuthController::class, 'terminateSession']);
    });

    // Routes du tableau de bord
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats/{role}', [DashboardController::class, 'getStats']);
        Route::get('/activites/{role}', [DashboardController::class, 'getActivites']);
        Route::get('/admin/details', [DashboardController::class, 'getAdminDetails']);
    });

    // Routes des notifications
    Route::get('/notifications', [NotificationController::class, 'index']);

    // Routes des utilisateurs
    Route::apiResource('users', UserController::class);
    Route::get('/users/all', [UserController::class, 'getAllUsers']);
    Route::get('/users/classe/{classeId}/eleves', [UserController::class, 'getElevesByClasse']);

    // Routes de profil
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('/change-password', [ProfileController::class, 'changePassword']);
        Route::get('/preferences', [ProfileController::class, 'getPreferences']);
        Route::put('/preferences', [ProfileController::class, 'updatePreferences']);
        Route::delete('/account', [ProfileController::class, 'deleteAccount']);
        Route::post('/upload-photo', [ProfileController::class, 'uploadProfilePhoto']);
        Route::delete('/photo', [ProfileController::class, 'deleteProfilePhoto']);
        Route::get('/connection-history', [ProfileController::class, 'getConnectionHistory']);
        Route::post('/logout-all-devices', [ProfileController::class, 'logoutFromAllDevices']);
        Route::get('/active-sessions', [ProfileController::class, 'getActiveSessions']);
        Route::post('/terminate-session', [ProfileController::class, 'terminateSession']);
    });

    // Routes des matières (publiques)
    Route::get('/matieres', [MatiereController::class, 'index']);
    Route::get('/matieres/{matiere}', [MatiereController::class, 'show']);
});

// Route publique pour les matières par niveau
Route::get('/matieres/niveau/{niveauId}', [MatiereController::class, 'getMatieresByNiveau']);

Route::middleware('auth:sanctum')->group(function () {

    // Routes d'administration (rôles: administrateur, gestionnaire)
    Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
        
        // Dashboard
        Route::get('/dashboard/kpis', [UserController::class, 'getDashboardKPIs']);
        Route::get('/dashboard/trends', [UserController::class, 'getDashboardTrends']);
        Route::get('/dashboard/class-performances', [UserController::class, 'getClassPerformances']);
        Route::get('/dashboard/user-activity', [UserController::class, 'getUserActivity']);
        Route::get('/dashboard/role-statistics', [UserController::class, 'getRoleStatistics']);

        // Gestion des utilisateurs
        Route::apiResource('users', UserController::class);
        Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
        Route::post('/users/{user}/send-connection-info', [UserController::class, 'sendConnectionInfo']);

        // Gestion des niveaux
        Route::apiResource('niveaux', NiveauController::class);

        // Gestion des matières
        Route::apiResource('matieres', MatiereController::class);
        Route::post('/matieres/assign-to-niveau', [MatiereController::class, 'assignMatiereToNiveau']);
        Route::delete('/matieres/remove-from-niveau', [MatiereController::class, 'removeMatiereFromNiveau']);
        Route::put('/matieres/update-niveau', [MatiereController::class, 'updateMatiereNiveau']);
        Route::get('/matieres/statistiques', [MatiereController::class, 'getStatistiques']);

        // Gestion des classes
        Route::apiResource('classes', ClasseController::class);
        Route::post('/classes/{classe}/transfer-eleves', [ClasseController::class, 'transfererEleves']);

        // Gestion des salles
        Route::apiResource('salles', SalleController::class);

        // Gestion des bâtiments
        Route::apiResource('batiments', BatimentController::class);

        // Gestion des cours
        Route::apiResource('cours', CoursController::class);

        // Gestion des années scolaires
        Route::apiResource('annees-scolaires', AnneeScolaireController::class);

        // Gestion des règles de transfert
        Route::get('/regles-transfert', [ReglesTransfertController::class, 'index']);
        Route::get('/regles-transfert/all', [ReglesTransfertController::class, 'getAll']);
        Route::get('/regles-transfert/{niveauSource}', [ReglesTransfertController::class, 'show']);
        Route::put('/regles-transfert', [ReglesTransfertController::class, 'update']);
        
        // Évolution d'année scolaire
        Route::post('/evolution-annee', [UserController::class, 'evolutionAnneeScolaire']);
    });

    // Routes pour les élèves (rôles: administrateur, gestionnaire, professeur)
    Route::middleware(['auth:sanctum'])->prefix('eleves')->group(function () {
        Route::get('/', [EleveController::class, 'index']);
        Route::get('/{eleve}', [EleveController::class, 'show']);
        Route::post('/', [EleveController::class, 'store']);
        Route::put('/{eleve}', [EleveController::class, 'update']);
        Route::delete('/{eleve}', [EleveController::class, 'destroy']);
        Route::get('/classe/{classeId}', [EleveController::class, 'getElevesByClasse']);
        Route::get('/{eleve}/historique', [EleveController::class, 'getEleveHistorique']);
        Route::get('/{eleve}/details', [EleveController::class, 'getEleveDetails']);
        Route::get('/{eleve}/notes', [EleveController::class, 'getEleveNotes']);
        Route::get('/{eleve}/absences', [EleveController::class, 'getEleveAbsences']);
        Route::post('/{eleve}/transfer', [EleveController::class, 'transfererEleve']);
        Route::get('/eligibles-transfert/{classeId}', [EleveController::class, 'getElevesEligiblesTransfert']);
        Route::get('/statistiques', [EleveController::class, 'getStatistiques']);
    });

    // Routes pour les associations élève-classe (rôles: administrateur, gestionnaire)
    Route::prefix('eleve-classe')->group(function () {
        Route::get('/', [EleveClasseController::class, 'index']);
        Route::get('/classe/{classeId}', [EleveClasseController::class, 'getElevesByClasse']);
    });

    // Routes pour les élèves (rôles: administrateur, gestionnaire)
    Route::prefix('eleves')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\EleveController::class, 'index']);
        Route::get('/classe/{classeId}', [\App\Http\Controllers\Api\EleveController::class, 'getElevesByClasse']);
    });

    // Route simple pour tester
    Route::get('/simple-eleves/classe/{classeId}', [\App\Http\Controllers\Api\SimpleEleveController::class, 'getElevesByClasse']);

    // Route de test
    Route::get('/test-eleves', [TestController::class, 'test']);

    // Routes pour les notes (rôles: administrateur, gestionnaire, professeur)
    Route::middleware(['auth:sanctum'])->prefix('notes')->group(function () {
        Route::get('/', [NoteController::class, 'index']);
        Route::get('/{note}', [NoteController::class, 'show']);
        Route::post('/', [NoteController::class, 'store']);
        Route::put('/{note}', [NoteController::class, 'update']);
        Route::delete('/{note}', [NoteController::class, 'destroy']);
        Route::get('/eleve/{eleveId}', [NoteController::class, 'getNotesEleve']);
        Route::get('/cours/{coursId}', [NoteController::class, 'getNotesCours']);
        Route::get('/eleve/{eleveId}/moyenne', [NoteController::class, 'calculerMoyenneEleve']);
        Route::get('/statistiques', [NoteController::class, 'getStatistiques']);
    });

    // Routes pour les absences (rôles: administrateur, gestionnaire, professeur)
    Route::middleware(['auth:sanctum'])->prefix('absences')->group(function () {
        Route::get('/', [AbsenceController::class, 'index']);
        Route::get('/{absence}', [AbsenceController::class, 'show']);
        Route::post('/', [AbsenceController::class, 'store']);
        Route::put('/{absence}', [AbsenceController::class, 'update']);
        Route::delete('/{absence}', [AbsenceController::class, 'destroy']);
        Route::get('/eleve/{eleveId}', [AbsenceController::class, 'getAbsencesEleve']);
        Route::get('/cours/{coursId}', [AbsenceController::class, 'getAbsencesCours']);
        Route::get('/by-date', [AbsenceController::class, 'getAbsencesByDate']);
        Route::patch('/{absence}/justifier', [AbsenceController::class, 'justifierAbsence']);
        Route::post('/{absence}/notifier-parent', [AbsenceController::class, 'notifierParent']);
        Route::get('/statistiques', [AbsenceController::class, 'getStatistiques']);
    });

    // Routes pour les bulletins (rôles: administrateur, gestionnaire, professeur)
    Route::prefix('bulletins')->group(function () {
        Route::get('/', [BulletinController::class, 'index']);
        Route::post('/', [BulletinController::class, 'store']);
        Route::get('/eleve/{eleveId}', [BulletinController::class, 'getBulletinsEleve']);
        Route::get('/eleve/{eleveId}/alternative', [BulletinController::class, 'getBulletinsEleveAlternative']);
        Route::get('/eleve/{eleveId}/notes', [BulletinController::class, 'getNotesEleve']);
        Route::get('/classe/{classeId}', [BulletinController::class, 'getBulletinsClasse']);
        Route::get('/eleve/{eleveId}/moyenne', [BulletinController::class, 'calculerMoyenneEleve']);
        Route::get('/statistiques', [BulletinController::class, 'getStatistiques']);
        Route::get('/{bulletin}', [BulletinController::class, 'show']);
        Route::put('/{bulletin}', [BulletinController::class, 'update']);
        Route::delete('/{bulletin}', [BulletinController::class, 'destroy']);
    });

    // Routes pour l'historique des élèves (rôles: administrateur, gestionnaire)
    Route::middleware(['check.role:administrateur,gestionnaire'])->prefix('historique-eleves')->group(function () {
        Route::get('/', [HistoriqueEleveController::class, 'index']);
        Route::get('/{historique}', [HistoriqueEleveController::class, 'show']);
        Route::post('/', [HistoriqueEleveController::class, 'store']);
        Route::put('/{historique}', [HistoriqueEleveController::class, 'update']);
        Route::delete('/{historique}', [HistoriqueEleveController::class, 'destroy']);
        Route::get('/eleve/{eleveId}', [HistoriqueEleveController::class, 'getHistoriqueEleve']);
        Route::get('/classe/{classeId}', [HistoriqueEleveController::class, 'getHistoriqueClasse']);
        Route::post('/transfer', [HistoriqueEleveController::class, 'transfererEleve']);
        Route::get('/statistiques-transfert/{classeId}', [HistoriqueEleveController::class, 'getStatistiquesTransfert']);
    });

    // Routes pour les notifications (tous les rôles)
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/sent', [NotificationController::class, 'sent']);
        Route::get('/{notification}', [NotificationController::class, 'show']);
        Route::post('/', [NotificationController::class, 'store']);
        Route::put('/{notification}', [NotificationController::class, 'update']);
        Route::delete('/{notification}', [NotificationController::class, 'destroy']);
        Route::patch('/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/read', [NotificationController::class, 'deleteReadNotifications']);
        Route::get('/unread-count', [NotificationController::class, 'getUnreadCount']);
        Route::get('/statistiques', [NotificationController::class, 'getStatistiques']);
    });

    // Routes pour l'emploi du temps (rôles: administrateur, gestionnaire, professeur)
    Route::middleware(['check.role:administrateur,gestionnaire,professeur'])->prefix('emploi-du-temps')->group(function () {
        Route::get('/', [EmploiDuTempsController::class, 'index']);
        Route::get('/{emploi}', [EmploiDuTempsController::class, 'show']);
        Route::post('/', [EmploiDuTempsController::class, 'store']);
        Route::put('/{emploi}', [EmploiDuTempsController::class, 'update']);
        Route::delete('/{emploi}', [EmploiDuTempsController::class, 'destroy']);
        Route::get('/classe/{classeId}', [EmploiDuTempsController::class, 'getEmploiByClasse']);
        Route::get('/professeur/{professeurId}', [EmploiDuTempsController::class, 'getEmploiByProfesseur']);
        Route::get('/salle/{salleId}', [EmploiDuTempsController::class, 'getEmploiBySalle']);
    });

    // Routes pour les sections (rôles: administrateur, gestionnaire)
    Route::middleware(['check.role:administrateur,gestionnaire'])->prefix('sections')->group(function () {
        Route::get('/', [SectionController::class, 'index']);
        Route::get('/{section}', [SectionController::class, 'show']);
        Route::post('/', [SectionController::class, 'store']);
        Route::put('/{section}', [SectionController::class, 'update']);
        Route::delete('/{section}', [SectionController::class, 'destroy']);
    });

    // Routes pour les créneaux (rôles: administrateur, gestionnaire)
    Route::middleware(['check.role:administrateur,gestionnaire'])->prefix('creneaux')->group(function () {
        Route::get('/', [CreneauController::class, 'index']);
        Route::get('/{creneau}', [CreneauController::class, 'show']);
        Route::post('/', [CreneauController::class, 'store']);
        Route::put('/{creneau}', [CreneauController::class, 'update']);
        Route::delete('/{creneau}', [CreneauController::class, 'destroy']);
    });

    // Routes pour les assignations cours-classe (rôles: administrateur, gestionnaire)
    Route::middleware(['check.role:administrateur,gestionnaire'])->prefix('assignations-cours-classe')->group(function () {
        Route::get('/', [AssignationCoursClasseController::class, 'index']);
        Route::get('/{assignation}', [AssignationCoursClasseController::class, 'show']);
        Route::post('/', [AssignationCoursClasseController::class, 'store']);
        Route::put('/{assignation}', [AssignationCoursClasseController::class, 'update']);
        Route::delete('/{assignation}', [AssignationCoursClasseController::class, 'destroy']);
    });

    // Routes pour les ressources (rôles: administrateur, gestionnaire, professeur)
    Route::middleware(['check.role:administrateur,gestionnaire,professeur'])->prefix('ressources')->group(function () {
        Route::get('/', [RessourceController::class, 'index']);
        Route::get('/{ressource}', [RessourceController::class, 'show']);
        Route::post('/', [RessourceController::class, 'store']);
        Route::put('/{ressource}', [RessourceController::class, 'update']);
        Route::delete('/{ressource}', [RessourceController::class, 'destroy']);
    });

    // Routes pour l'historique des connexions (rôles: administrateur)
    Route::middleware(['check.role:administrateur'])->prefix('historique-connexions')->group(function () {
        Route::get('/', [HistoriqueConnexionController::class, 'index']);
        Route::get('/{historique}', [HistoriqueConnexionController::class, 'show']);
        Route::delete('/{historique}', [HistoriqueConnexionController::class, 'destroy']);
        Route::get('/user/{userId}', [HistoriqueConnexionController::class, 'getHistoriqueByUser']);
        Route::get('/statistiques', [HistoriqueConnexionController::class, 'getStatistiques']);
    });
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); 