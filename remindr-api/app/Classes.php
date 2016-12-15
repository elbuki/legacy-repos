<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class classes extends Model
{
    protected $table    = 'classes';
    protected $fillable = ['name', 'description', 'classroom', 'teacher_id', 'grade_table'];
    public $timestamps  = false;

    public function classuser()
    {

        return $this->belongsTo('App\ClassUser');
    }
    public function classevent()
    {

        return $this->belongsTo('App\ClassEvent');
    }
}

