<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    protected $table    = 'user_setting';
    protected $fillable = ['user_id', 'dont_alert_admin'];

    public function user()
    {

        return $this->hasMany('App\User');
    }
}
