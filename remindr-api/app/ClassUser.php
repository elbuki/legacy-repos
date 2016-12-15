<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassUser extends Model
{
    protected $table    = 'class_user';
    protected $fillable = ['class_id', 'user_id', 'table'];
    public $incrementing = false;
    public function user()
    {
        return $this->hasMany('App\User');
    }
    public function classes()
    {
        return $this->hasMany('App\Classes');
    }

}
