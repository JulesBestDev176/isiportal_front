<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'role' => 'administrateur',
            'actif' => true
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'user',
                        'token'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'message' => 'Connexion réussie'
                ]);
    }

    public function test_user_cannot_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'role' => 'administrateur'
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'message' => 'Identifiants incorrects'
                ]);
    }

    public function test_inactive_user_cannot_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'role' => 'administrateur',
            'actif' => false
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(403)
                ->assertJson([
                    'success' => false,
                    'message' => 'Compte désactivé'
                ]);
    }

    public function test_eleve_role_cannot_login()
    {
        $user = User::factory()->create([
            'email' => 'eleve@example.com',
            'password' => bcrypt('password123'),
            'role' => 'eleve',
            'actif' => true
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'eleve@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(403)
                ->assertJson([
                    'success' => false,
                    'message' => 'Accès non autorisé pour ce rôle'
                ]);
    }

    public function test_parent_role_cannot_login()
    {
        $user = User::factory()->create([
            'email' => 'parent@example.com',
            'password' => bcrypt('password123'),
            'role' => 'parent',
            'actif' => true
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'parent@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(403)
                ->assertJson([
                    'success' => false,
                    'message' => 'Accès non autorisé pour ce rôle'
                ]);
    }
} 