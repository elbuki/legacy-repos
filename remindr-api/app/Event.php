<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table    = 'events';
    protected $fillable = ['title', 'datetime', 'description', 'frequency', 'exclude_weekends', 'class_id', 'created_by', 'active', 'private'];
    public $timestamps  = false;

    public function user()
    {

        return $this->belongto('App\User', 'id', 'created_by');
    }
    public function classes()
    {

        return $this->belongto('App\Classes', 'id', 'class_id');
    }

}
