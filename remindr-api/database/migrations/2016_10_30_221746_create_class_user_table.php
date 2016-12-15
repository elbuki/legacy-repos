<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClassUserTable extends Migration
{

    public function up()
    {
        Schema::create('class_user', function (Blueprint $table) {

            $table->integer('class_id')->unsigned();
            $table->integer('user_id')->unsigned();

            $table->json('table')->nullable();

            $table->foreign('class_id')->references('id')->on('classes');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('class_user');
    }
}
