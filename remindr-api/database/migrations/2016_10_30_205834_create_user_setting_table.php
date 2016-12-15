<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserSettingTable extends Migration
{

    public function up()
    {
        Schema::create('user_setting', function (Blueprint $table) {

            $table->integer('user_id')->unsigned();
            $table->boolean('dont_alert_admin');

            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_setting');
    }
}
