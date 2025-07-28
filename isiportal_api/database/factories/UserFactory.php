<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = \App\Models\User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roles = ['administrateur', 'gestionnaire', 'professeur'];
        $role = $this->faker->randomElement($roles);

        return [
            'nom' => $this->faker->lastName(),
            'prenom' => $this->faker->firstName(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password123'),
            'role' => $role,
            'actif' => true,
            'doit_changer_mot_de_passe' => false,
            'derniere_connexion' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'telephone' => $this->faker->phoneNumber(),
            'adresse' => $this->faker->address(),
            'sections' => $role === 'gestionnaire' || $role === 'professeur' ? ['college', 'lycee'] : null,
            'matieres' => $role === 'professeur' ? [1, 2, 3] : null,
            'cours' => $role === 'professeur' ? [] : null,
            'privileges' => $role === 'administrateur' ? ['gestion_utilisateurs', 'gestion_classes'] : null,
            'historique_connexions' => $role === 'administrateur' ? [] : null,
            'dernier_acces' => $role === 'administrateur' ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
            'tentatives_connexion_echouees' => $role === 'administrateur' ? 0 : null,
            'compte_verrouille' => $role === 'administrateur' ? false : null,
            'date_verrouillage' => null,
            'classe_id' => null,
            'date_naissance' => null,
            'lieu_naissance' => null,
            'numero_etudiant' => null,
            'parents_ids' => null,
            'enfants_ids' => null,
            'profession' => null,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Créer un administrateur
     */
    public function administrateur(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'administrateur',
            'privileges' => ['gestion_utilisateurs', 'gestion_classes', 'gestion_cours', 'gestion_bulletins'],
            'sections' => ['college', 'lycee'],
        ]);
    }

    /**
     * Créer un gestionnaire
     */
    public function gestionnaire(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'gestionnaire',
            'sections' => ['college', 'lycee'],
        ]);
    }

    /**
     * Créer un professeur
     */
    public function professeur(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'professeur',
            'sections' => ['college', 'lycee'],
            'matieres' => [1, 2, 3],
            'cours' => [],
        ]);
    }

    /**
     * Créer un élève
     */
    public function eleve(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'eleve',
            'date_naissance' => $this->faker->dateTimeBetween('-18 years', '-11 years'),
            'lieu_naissance' => $this->faker->city(),
            'numero_etudiant' => 'E' . $this->faker->unique()->numberBetween(1000, 9999),
            'parents_ids' => [],
        ]);
    }

    /**
     * Créer un parent
     */
    public function parent(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'parent',
            'profession' => $this->faker->jobTitle(),
            'enfants_ids' => [],
        ]);
    }
}
