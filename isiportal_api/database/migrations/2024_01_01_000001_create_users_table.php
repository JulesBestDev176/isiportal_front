<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['administrateur', 'gestionnaire', 'professeur', 'eleve', 'parent']);
            $table->boolean('actif')->default(true);
            $table->boolean('doit_changer_mot_de_passe')->default(true);
            $table->timestamp('derniere_connexion')->nullable();
            $table->string('telephone')->nullable();
            $table->text('adresse')->nullable();
            $table->json('sections')->nullable(); // Pour gestionnaire et professeur
            $table->json('matieres')->nullable(); // Pour professeur
            $table->json('cours')->nullable(); // Pour professeur
            $table->json('privileges')->nullable(); // Pour administrateur
            $table->json('historique_connexions')->nullable(); // Pour administrateur
            $table->timestamp('dernier_acces')->nullable(); // Pour administrateur
            $table->integer('tentatives_connexion_echouees')->default(0); // Pour administrateur
            $table->boolean('compte_verrouille')->default(false); // Pour administrateur
            $table->timestamp('date_verrouillage')->nullable(); // Pour administrateur
            $table->unsignedBigInteger('classe_id')->nullable(); // Pour élève - sera contraint plus tard
            $table->date('date_naissance')->nullable(); // Pour élève
            $table->string('lieu_naissance')->nullable(); // Pour élève
            $table->string('numero_etudiant')->nullable()->unique(); // Pour élève
            $table->json('parents_ids')->nullable(); // Pour élève
            $table->json('enfants_ids')->nullable(); // Pour parent
            $table->string('profession')->nullable(); // Pour parent
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();

            // Index
            $table->index(['role', 'actif']);
            $table->index('email');
            $table->index('numero_etudiant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
}; 