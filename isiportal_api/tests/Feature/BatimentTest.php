<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Batiment;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BatimentTest extends TestCase
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

    public function test_admin_can_get_batiments_list()
    {
        Batiment::factory()->count(3)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/batiments');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'nom',
                                'description',
                                'statut'
                            ]
                        ]
                    ]
                ]);
    }

    public function test_admin_can_create_batiment()
    {
        $batimentData = [
            'nom' => 'Nouveau Bâtiment',
            'description' => 'Description du nouveau bâtiment',
            'adresse' => '123 Rue Test, 75001 Paris',
            'statut' => 'actif'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/batiments', $batimentData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'message' => 'Bâtiment créé avec succès'
                ]);

        $this->assertDatabaseHas('batiments', [
            'nom' => 'Nouveau Bâtiment',
            'statut' => 'actif'
        ]);
    }

    public function test_admin_can_update_batiment()
    {
        $batiment = Batiment::factory()->create();

        $updateData = [
            'nom' => 'Bâtiment Modifié',
            'description' => 'Description modifiée'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/batiments/{$batiment->id}", $updateData);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Bâtiment mis à jour avec succès'
                ]);

        $this->assertDatabaseHas('batiments', [
            'id' => $batiment->id,
            'nom' => 'Bâtiment Modifié',
            'description' => 'Description modifiée'
        ]);
    }

    public function test_admin_can_delete_batiment()
    {
        $batiment = Batiment::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/batiments/{$batiment->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Bâtiment supprimé avec succès'
                ]);

        $this->assertDatabaseMissing('batiments', [
            'id' => $batiment->id
        ]);
    }

    public function test_cannot_delete_batiment_with_salles()
    {
        $batiment = Batiment::factory()->create();
        
        // Créer une salle associée à ce bâtiment
        \App\Models\Salle::factory()->create([
            'batiment_id' => $batiment->id
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/batiments/{$batiment->id}");

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'message' => 'Impossible de supprimer ce bâtiment car il contient des salles'
                ]);
    }

    public function test_get_batiment_statistiques()
    {
        $batiment = Batiment::factory()->create();
        
        // Créer quelques salles pour ce bâtiment
        \App\Models\Salle::factory()->count(3)->create([
            'batiment_id' => $batiment->id
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/batiments/{$batiment->id}/statistiques");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Statistiques du bâtiment'
                ])
                ->assertJsonStructure([
                    'data' => [
                        'total_salles',
                        'salles_disponibles',
                        'salles_occupees',
                        'salles_reservees',
                        'salles_maintenance',
                        'capacite_totale'
                    ]
                ]);
    }

    public function test_filter_batiments_by_statut()
    {
        Batiment::factory()->create(['statut' => 'actif']);
        Batiment::factory()->create(['statut' => 'maintenance']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/batiments?statut=actif');

        $response->assertStatus(200);
        
        $data = $response->json('data.data');
        foreach ($data as $batiment) {
            $this->assertEquals('actif', $batiment['statut']);
        }
    }
} 