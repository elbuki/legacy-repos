<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassEvent extends Model
{
    protected $table = 'class_event';
    protected $fillable = ['class_id', 'event_id'];

    public $incrementing = false;

    public function classes()
    {
        return $this->hasMany('App\Classes');
    }

    public function events()
    {
        return $this->hasMany('App\Event');
    }
}
