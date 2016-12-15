<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventsTable extends Migration
{

    public function up()
    {
        Schema::create('events', function (Blueprint $table) {

            $table->increments('id');
            $table->string('title');
            $table->dateTime('datetime');
            $table->string('description')->nullable();
            $table->double('frequency', 15, 2)->nullable();
            $table->boolean('exclude_weekends')->default(false);
            $table->boolean('active')->default(false);
            $table->boolean('private')->default(true);

            $table->integer('class_id')->unsigned()->nullable();
            $table->integer('created_by')->unsigned();

            $table->foreign('class_id')->references('id')->on('classes');
            $table->foreign('created_by')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('events');
    }
}
