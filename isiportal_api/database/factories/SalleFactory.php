<?php

namespace Database\Factories;

use App\Models\Batiment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Salle>
 */
class SalleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => 'Salle ' . $this->faker->numberBetween(1, 50),
            'numero' => $this->faker->unique()->regexify('[A-Z][0-9]{3}'),
            'capacite' => $this->faker->numberBetween(20, 40),
            'type' => $this->faker->randomElement([
                'salle_cours', 'laboratoire', 'salle_info', 'salle_arts', 
                'salle_musique', 'salle_sport', 'amphitheatre', 'salle_reunion'
            ]),
            'equipements' => ['tableau', 'projecteur'],
            'statut' => $this->faker->randomElement(['disponible', 'occupee', 'reservee', 'maintenance']),
            'batiment_id' => Batiment::factory(),
            'date_creation' => now(),
        ];
    }

    /**
     * Créer une salle de cours
     */
    public function salleCours(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'salle_cours',
            'capacite' => $this->faker->numberBetween(25, 35),
            'equipements' => ['tableau', 'projecteur', 'ordinateur'],
        ]);
    }

    /**
     * Créer un laboratoire
     */
    public function laboratoire(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'laboratoire',
            'capacite' => $this->faker->numberBetween(15, 25),
            'equipements' => ['paillasses', 'sorbonne', 'microscopes', 'projecteur'],
        ]);
    }

    /**
     * Créer une salle informatique
     */
    public function salleInfo(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'salle_info',
            'capacite' => $this->faker->numberBetween(15, 25),
            'equipements' => ['ordinateurs', 'projecteur', 'imprimante'],
        ]);
    }

    /**
     * Créer un amphithéâtre
     */
    public function amphitheatre(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'amphitheatre',
            'capacite' => $this->faker->numberBetween(100, 200),
            'equipements' => ['projecteur', 'sonorisation', 'micros', 'écran géant'],
        ]);
    }

    /**
     * Créer une salle disponible
     */
    public function disponible(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'disponible',
        ]);
    }

    /**
     * Créer une salle occupée
     */
    public function occupee(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'occupee',
        ]);
    }

    /**
     * Créer une salle en maintenance
     */
    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'maintenance',
        ]);
    }
} 