<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventUserSettingTable extends Migration
{

    public function up()
    {
        Schema::create('event_user', function (Blueprint $table) {

            $table->integer('event_id')->unsigned();
            $table->integer('user_id')->unsigned();

            $table->double('alert_before', 15, 2);
            $table->boolean('dont_alert')->default(false);

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('event_id')->references('id')->on('events');
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_user_setting');
    }
}
