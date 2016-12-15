<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{

    public function up()
    {
        Schema::create('users', function (Blueprint $table) {

            $table->increments('id');
            $table->string('id_number')->nullable();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');

			$table->string('activation_code', 20)->unique()->nullable();

            $table->string('token', 10)->unique()->nullable();
            $table->dateTime('token_expires_at')->nullable();

            // 1. ADMIN 2. TEACHER 3. STUDENT
            $table->tinyInteger('user_type');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}
