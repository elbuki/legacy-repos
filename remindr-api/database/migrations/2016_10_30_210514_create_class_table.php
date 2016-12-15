<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassTable extends Migration
{

    public function up()
    {
        Schema::create('classes', function (Blueprint $table) {

            $table->increments('id');
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('classroom');
            $table->integer('teacher_id')->unsigned();
            $table->json('grade_table');

            $table->foreign('teacher_id')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('classes');
    }
}
