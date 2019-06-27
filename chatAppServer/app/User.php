<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'name','phone', 'email', 'password',
    ];

    protected $hidden = [
        'password', 'remember_token','created_at',
        'updated_at',
        'pivot',
        'email_verified_at',  
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getJWTIdentifier(){
        return $this->getKey();
    }

    public function getJWTCustomClaims(){
        return [];
    }
    public function setPasswordAttribute($password){
        if ( !empty($password) ) {
            $this->attributes['password'] = bcrypt($password);
        }
    }
    // public function messages(){
    //     return $this->belongsToMany(Message::class);
    // }
    // public function groups(){
    //     return $this->belongsToMany(Group::class);
    // }
    // public function blockUsers(){

    //     return $this->belongsToMany(User::class, 'block_user', 'user_id', 'block_id');
    // }

    public function chats(){

        return $this->belongsToMany(Chat::class, 'chat_user', 'user_id','chat_id');
    }

}
