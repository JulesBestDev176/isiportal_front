<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Niveau;
use Illuminate\Foundation\Testing\RefreshDatabase;

class NiveauTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->administrateur()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'password123'
        ]);

        $this->token = $response->json('data.token');
    }

    public function test_admin_can_get_niveaux_list()
    {
        Niveau::factory()->count(3)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/niveaux');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'nom',
                                'code',
                                'cycle',
                                'ordre',
                                'statut'
                            ]
                        ]
                    ]
                ]);
    }

    public function test_admin_can_create_niveau()
    {
        $niveauData = [
            'nom' => '6ème',
            'code' => '6EME',
            'description' => 'Sixième année du collège',
            'cycle' => 'college',
            'ordre' => 1,
            'statut' => 'active',
            'matieres_ids' => [1, 2, 3]
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/niveaux', $niveauData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'message' => 'Niveau créé avec succès'
                ]);

        $this->assertDatabaseHas('niveaux', [
            'nom' => '6ème',
            'code' => '6EME',
            'cycle' => 'college'
        ]);
    }

    public function test_admin_can_update_niveau()
    {
        $niveau = Niveau::factory()->create();

        $updateData = [
            'nom' => '6ème Modifiée',
            'description' => 'Description modifiée'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/niveaux/{$niveau->id}", $updateData);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Niveau mis à jour avec succès'
                ]);

        $this->assertDatabaseHas('niveaux', [
            'id' => $niveau->id,
            'nom' => '6ème Modifiée',
            'description' => 'Description modifiée'
        ]);
    }

    public function test_admin_can_delete_niveau()
    {
        $niveau = Niveau::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/niveaux/{$niveau->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Niveau supprimé avec succès'
                ]);

        $this->assertDatabaseMissing('niveaux', [
            'id' => $niveau->id
        ]);
    }

    public function test_cannot_delete_niveau_with_classes()
    {
        $niveau = Niveau::factory()->create();
        
        // Créer une classe associée à ce niveau
        \App\Models\Classe::factory()->create([
            'niveau_id' => $niveau->id
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/niveaux/{$niveau->id}");

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'message' => 'Impossible de supprimer ce niveau car il a des classes associées'
                ]);
    }

    public function test_filter_niveaux_by_cycle()
    {
        Niveau::factory()->create(['cycle' => 'college']);
        Niveau::factory()->create(['cycle' => 'lycee']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/niveaux?cycle=college');

        $response->assertStatus(200);
        
        $data = $response->json('data.data');
        foreach ($data as $niveau) {
            $this->assertEquals('college', $niveau['cycle']);
        }
    }
} 