<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClassEventTable extends Migration
{

    public function up()
    {
        Schema::create('class_event', function (Blueprint $table) {

            $table->integer('class_id')->unsigned();
            $table->integer('event_id')->unsigned();

            $table->foreign('class_id')->references('id')->on('classes');
            $table->foreign('event_id')->references('id')->on('events');
        });
    }

    public function down()
    {
        Schema::dropIfExists('class_event');
    }
}
