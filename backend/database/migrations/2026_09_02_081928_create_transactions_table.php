<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('type', [
                'topup',
                'transfer_in',
                'transfer_out',
            ]);

            $table->decimal('amount', 15, 2);

            $table->foreignId('related_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('description')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
