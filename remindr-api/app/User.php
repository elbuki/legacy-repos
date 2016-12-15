<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{

    protected $table    = 'users';
    protected $fillable = ['id_number', 'name', 'email', 'password', 'user_type'];
	protected $hidden = ['activation_code', 'token', 'token_expires_at',
						'password'];
    public $timestamps  = false;

	public function setting() {

		return $this->hasOne('App\UserSetting');
	}

    public function classes()
    {
        return $this->hasMany('App\ClassUser');
    }
}
