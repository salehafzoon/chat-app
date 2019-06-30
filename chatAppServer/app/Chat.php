<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{

    protected $hidden = [
        'created_at','updated_at',
    ];

    public function members(){
        return $this->belongsToMany(User::class);
    }

    public function messeges(){
        return $this->hasMany(Message::class);
    }
}
