<?php

namespace Database\Factories;

use App\Models\Absence;
use App\Models\User;
use App\Models\Cours;
use App\Models\AnneeScolaire;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Absence>
 */
class AbsenceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $periodes = ['matin', 'apres_midi', 'journee'];
        $motifs = [
            'Maladie',
            'Rendez-vous médical',
            'Rendez-vous administratif',
            'Voyage familial',
            'Problème de transport',
            'Événement familial',
            'Formation',
            'Compétition sportive',
            'Autre'
        ];

        $justifiee = $this->faker->boolean(70); // 70% de chance d'être justifiée

        return [
            'eleve_id' => User::where('role', 'eleve')->inRandomOrder()->first()->id,
            'cours_id' => Cours::inRandomOrder()->first()->id,
            'annee_scolaire_id' => AnneeScolaire::inRandomOrder()->first()->id,
            'date_absence' => $this->faker->dateTimeBetween('-2 months', 'now'),
            'periode' => $this->faker->randomElement($periodes),
            'justifiee' => $justifiee,
            'motif' => $justifiee ? $this->faker->randomElement($motifs) : null,
            'justificatif' => $justifiee && $this->faker->boolean(50) ? 'justificatif.pdf' : null,
            'commentaire' => $this->faker->optional(0.3)->sentence(),
            'notifiee_parent' => $this->faker->boolean(80), // 80% de chance d'être notifiée
        ];
    }

    /**
     * Indicate that the absence is justified.
     */
    public function justified(): static
    {
        return $this->state(fn (array $attributes) => [
            'justifiee' => true,
            'motif' => $this->faker->randomElement([
                'Maladie',
                'Rendez-vous médical',
                'Rendez-vous administratif',
                'Voyage familial',
                'Formation',
                'Compétition sportive'
            ]),
            'justificatif' => $this->faker->optional(0.7)->filePath(),
        ]);
    }

    /**
     * Indicate that the absence is not justified.
     */
    public function unjustified(): static
    {
        return $this->state(fn (array $attributes) => [
            'justifiee' => false,
            'motif' => null,
            'justificatif' => null,
        ]);
    }

    /**
     * Indicate that the absence is in the morning.
     */
    public function morning(): static
    {
        return $this->state(fn (array $attributes) => [
            'periode' => 'matin',
        ]);
    }

    /**
     * Indicate that the absence is in the afternoon.
     */
    public function afternoon(): static
    {
        return $this->state(fn (array $attributes) => [
            'periode' => 'apres_midi',
        ]);
    }

    /**
     * Indicate that the absence is for the full day.
     */
    public function fullDay(): static
    {
        return $this->state(fn (array $attributes) => [
            'periode' => 'journee',
        ]);
    }

    /**
     * Indicate that the parent has been notified.
     */
    public function parentNotified(): static
    {
        return $this->state(fn (array $attributes) => [
            'notifiee_parent' => true,
        ]);
    }
} 