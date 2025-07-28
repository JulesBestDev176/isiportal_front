<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Classe;
use App\Models\HistoriqueEleve;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use PHPUnit\Framework\Attributes\Test;

class EleveTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $gestionnaire;
    protected $professeur;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Créer les utilisateurs de test
        $this->admin = User::factory()->create([
            'role' => 'administrateur',
            'email' => 'admin@test.com',
        ]);
        
        $this->gestionnaire = User::factory()->create([
            'role' => 'gestionnaire',
            'email' => 'gestionnaire@test.com',
        ]);
        
        $this->professeur = User::factory()->create([
            'role' => 'professeur',
            'email' => 'professeur@test.com',
        ]);
    }

    #[Test]
    public function it_can_list_eleves()
    {
        // Créer quelques élèves
        User::factory()->count(5)->create(['role' => 'eleve']);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/eleves');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => [
                            'id',
                            'nom',
                            'prenom',
                            'email',
                            'role',
                            'classe_id',
                        ]
                    ]
                ]
            ]);
    }

    #[Test]
    public function it_can_show_eleve()
    {
        $eleve = User::factory()->create(['role' => 'eleve']);

        $response = $this->actingAs($this->admin)
            ->getJson("/api/eleves/{$eleve->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $eleve->id,
                    'nom' => $eleve->nom,
                    'prenom' => $eleve->prenom,
                ]
            ]);
    }

    #[Test]
    public function it_can_create_eleve()
    {
        $classe = Classe::factory()->create();
        
        $eleveData = [
            'nom' => 'Doe',
            'prenom' => 'John',
            'email' => 'john.doe@test.com',
            'dateNaissance' => '2005-05-15',
            'classe_id' => $classe->id,
            'adresse' => '123 Test Street',
            'telephone' => '0123456789',
            'sexe' => 'homme',
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/eleves', $eleveData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Élève créé avec succès'
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john.doe@test.com',
            'role' => 'eleve'
        ]);
    }

    #[Test]
    public function it_can_update_eleve()
    {
        $eleve = User::factory()->create(['role' => 'eleve']);
        
        $updateData = [
            'nom' => 'Updated',
            'prenom' => 'Name',
            'adresse' => '456 Updated Street',
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/eleves/{$eleve->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Élève mis à jour avec succès'
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $eleve->id,
            'nom' => 'Updated',
            'prenom' => 'Name',
        ]);
    }

    #[Test]
    public function it_can_delete_eleve()
    {
        $eleve = User::factory()->create(['role' => 'eleve']);

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/eleves/{$eleve->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Élève supprimé avec succès'
            ]);

        $this->assertDatabaseMissing('users', ['id' => $eleve->id]);
    }

    #[Test]
    public function it_can_get_eleves_by_classe()
    {
        $classe = Classe::factory()->create();
        User::factory()->count(3)->create([
            'role' => 'eleve',
            'classe_id' => $classe->id
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson("/api/eleves/classe/{$classe->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => [
                            'id',
                            'nom',
                            'prenom',
                            'email',
                            'role',
                            'classe_id',
                        ]
                    ]
                ]
            ]);
    }

    #[Test]
    public function it_can_get_eleve_historique()
    {
        $eleve = User::factory()->create(['role' => 'eleve']);
        HistoriqueEleve::factory()->create(['eleve_id' => $eleve->id]);

        $response = $this->actingAs($this->admin)
            ->getJson("/api/eleves/{$eleve->id}/historique");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => [
                            'id',
                            'eleve_id',
                            'annee_scolaire',
                            'classe',
                            'statut',
                        ]
                    ]
                ]
            ]);
    }

    #[Test]
    public function it_can_get_eleve_statistiques()
    {
        $eleve = User::factory()->create(['role' => 'eleve']);

        $response = $this->actingAs($this->admin)
            ->getJson("/api/eleves/{$eleve->id}/statistiques");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_absences',
                    'moyenne_generale',
                    'progression',
                    'notes_recentes',
                ]
            ]);
    }

    #[Test]
    public function it_denies_access_to_parent_role()
    {
        $parent = User::factory()->create(['role' => 'parent']);

        $response = $this->actingAs($parent)
            ->getJson('/api/eleves');

        $response->assertStatus(403);
    }

    #[Test]
    public function it_denies_access_to_eleve_role()
    {
        $eleve = User::factory()->create(['role' => 'eleve']);

        $response = $this->actingAs($eleve)
            ->getJson('/api/eleves');

        $response->assertStatus(403);
    }
} 