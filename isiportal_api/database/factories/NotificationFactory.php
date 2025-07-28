<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titre' => $this->faker->sentence(),
            'contenu' => $this->faker->paragraph(),
            'type' => $this->faker->randomElement(['info', 'warning', 'error', 'success', 'system']),
            'priorite' => $this->faker->randomElement(['basse', 'normale', 'haute', 'urgente']),
            'destinataire_id' => User::factory(),
            'expediteur_id' => User::factory()->administrateur(),
            'lue' => $this->faker->boolean(20), // 20% de chance d'être lue
            'date_lecture' => null,
            'date_envoi' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'date_creation' => now(),
        ];
    }

    /**
     * Créer une notification d'information
     */
    public function info(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'info',
            'priorite' => 'normale',
        ]);
    }

    /**
     * Créer une notification d'avertissement
     */
    public function warning(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'warning',
            'priorite' => 'haute',
        ]);
    }

    /**
     * Créer une notification d'erreur
     */
    public function error(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'error',
            'priorite' => 'urgente',
        ]);
    }

    /**
     * Créer une notification de succès
     */
    public function success(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'success',
            'priorite' => 'normale',
        ]);
    }

    /**
     * Créer une notification système
     */
    public function system(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'system',
            'priorite' => 'basse',
        ]);
    }

    /**
     * Créer une notification lue
     */
    public function lue(): static
    {
        return $this->state(fn (array $attributes) => [
            'lue' => true,
            'date_lecture' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ]);
    }

    /**
     * Créer une notification non lue
     */
    public function nonLue(): static
    {
        return $this->state(fn (array $attributes) => [
            'lue' => false,
            'date_lecture' => null,
        ]);
    }

    /**
     * Créer une notification urgente
     */
    public function urgente(): static
    {
        return $this->state(fn (array $attributes) => [
            'priorite' => 'urgente',
            'type' => 'error',
        ]);
    }
} 