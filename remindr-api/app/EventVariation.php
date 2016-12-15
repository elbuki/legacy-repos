<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EventVariation extends Model
{
    protected $table    = 'event_variations';
    protected $fillable = ['parent_event_id', 'child_event_id'];
    public $timestamps  = false;
    public $incrementing = false;

    public function event()
    {
        return $this->belongsTo('App\Event');
    }
}
