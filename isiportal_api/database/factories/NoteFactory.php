<?php

namespace Database\Factories;

use App\Models\Note;
use App\Models\User;
use App\Models\Cours;
use App\Models\Matiere;
use App\Models\AnneeScolaire;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Note>
 */
class NoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $typesEvaluation = ['devoir1', 'devoir2', 'composition', 'examen'];
        $appreciations = [
            'Très bien',
            'Bien',
            'Assez bien',
            'Passable',
            'Insuffisant',
            'Excellent travail',
            'Bon travail',
            'Peut mieux faire',
            'Efforts à fournir',
            'Satisfaisant'
        ];

        return [
            'eleve_id' => User::where('role', 'eleve')->inRandomOrder()->first()->id,
            'cours_id' => Cours::inRandomOrder()->first()->id,
            'matiere_id' => Matiere::inRandomOrder()->first()->id,
            'annee_scolaire_id' => AnneeScolaire::inRandomOrder()->first()->id,
            'semestre' => $this->faker->randomElement([1, 2]),
            'type_evaluation' => $this->faker->randomElement($typesEvaluation),
            'note' => $this->faker->randomFloat(2, 8, 20),
            'coefficient' => $this->faker->randomFloat(2, 1, 3),
            'appreciation' => $this->faker->randomElement($appreciations),
            'date_evaluation' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'commentaire' => $this->faker->optional(0.3)->sentence(),
        ];
    }

    /**
     * Indicate that the note is for an exam.
     */
    public function exam(): static
    {
        return $this->state(fn (array $attributes) => [
            'type_evaluation' => 'examen',
            'coefficient' => 2.0,
        ]);
    }

    /**
     * Indicate that the note is for a test.
     */
    public function test(): static
    {
        return $this->state(fn (array $attributes) => [
            'type_evaluation' => $this->faker->randomElement(['devoir1', 'devoir2']),
            'coefficient' => 1.0,
        ]);
    }

    /**
     * Indicate that the note is for a composition.
     */
    public function composition(): static
    {
        return $this->state(fn (array $attributes) => [
            'type_evaluation' => 'composition',
            'coefficient' => 1.5,
        ]);
    }

    /**
     * Indicate that the note is for the first semester.
     */
    public function firstSemester(): static
    {
        return $this->state(fn (array $attributes) => [
            'semestre' => 1,
        ]);
    }

    /**
     * Indicate that the note is for the second semester.
     */
    public function secondSemester(): static
    {
        return $this->state(fn (array $attributes) => [
            'semestre' => 2,
        ]);
    }
} 