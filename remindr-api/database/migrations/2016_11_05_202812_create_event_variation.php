<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventVariation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_variations', function (Blueprint $table) {

            $table->integer('parent_event_id')->unsigned();
            $table->integer('child_event_id')->unsigned();

            $table->foreign('parent_event_id')->references('id')->on('events');
            $table->foreign('child_event_id')->references('id')->on('events');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('event_variations');
    }
}
