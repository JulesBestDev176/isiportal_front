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
        Schema::create('matieres', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->decimal('coefficient', 3, 2)->default(1.00);
            $table->integer('heures_par_semaine')->default(0);
            $table->enum('statut', ['active', 'inactive', 'maintenance'])->default('active');
            $table->json('niveaux_ids')->nullable();
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamps();

            // Index
            $table->index('statut');
            $table->index('code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matieres');
    }
}; 