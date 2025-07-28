<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
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

    public function test_admin_can_get_users_list()
    {
        User::factory()->count(5)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/users');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'nom',
                                'prenom',
                                'email',
                                'role',
                                'actif'
                            ]
                        ]
                    ]
                ]);
    }

    public function test_admin_can_create_user()
    {
        $userData = [
            'nom' => 'Doe',
            'prenom' => 'John',
            'email' => 'john.doe@example.com',
            'password' => 'password123',
            'role' => 'professeur',
            'sections' => ['college', 'lycee'],
            'matieres' => [1, 2]
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/users', $userData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'message' => 'Utilisateur créé avec succès'
                ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john.doe@example.com',
            'role' => 'professeur'
        ]);
    }

    public function test_admin_can_update_user()
    {
        $user = User::factory()->create();

        $updateData = [
            'nom' => 'Updated',
            'prenom' => 'Name'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/users/{$user->id}", $updateData);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Utilisateur mis à jour avec succès'
                ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'nom' => 'Updated',
            'prenom' => 'Name'
        ]);
    }

    public function test_admin_can_delete_user()
    {
        $user = User::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Utilisateur supprimé avec succès'
                ]);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id
        ]);
    }

    public function test_admin_can_toggle_user_status()
    {
        $user = User::factory()->create(['actif' => true]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson("/api/users/{$user->id}/toggle-status");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Utilisateur désactivé'
                ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'actif' => false
        ]);
    }

    public function test_non_admin_cannot_access_users()
    {
        $gestionnaire = User::factory()->gestionnaire()->create([
            'email' => 'gestionnaire@test.com',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'gestionnaire@test.com',
            'password' => 'password123'
        ]);

        $token = $response->json('data.token');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/users');

        $response->assertStatus(403);
    }
} 