<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EventUser extends Model
{
    protected $table    = 'event_user';
    protected $fillable = ['user_id', 'event_id', 'alert_before', 'dont_alert'];
    public $timestamps  = false;

    public function event()
    {

        return $this->belongto('App\Event');
    }
}
