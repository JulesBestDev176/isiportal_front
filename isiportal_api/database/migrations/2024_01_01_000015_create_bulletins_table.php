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
        Schema::create('bulletins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('users')->onDelete('cascade');
            $table->string('annee_scolaire');
            $table->integer('semestre');
            $table->decimal('moyenne', 4, 2)->default(0);
            $table->json('matieres')->nullable();
            $table->text('appreciation')->nullable();
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_modification')->nullable();
            $table->timestamps();

            // Index
            $table->index(['eleve_id', 'annee_scolaire', 'semestre']);
            $table->index('moyenne');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulletins');
    }
}; 