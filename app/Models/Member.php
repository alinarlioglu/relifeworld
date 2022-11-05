<?php

namespace App\Models;

use App\Models\Post;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Member extends Authenticatable
{
    use Notifiable;
    use SoftDeletes;

    protected $table = 'rlw_users';

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $fillable = [
        'nickname', 'email', 'password','updated_at','created_at','deleted_at','remember_token'
    ];

    public function books(){
        return $this->hasMany(Book::class, 'user_id', 'id');
    }

    public function reviews(){
        return $this->hasMany(Review::class, 'user_id', 'id');
    }

    public function post(){
        return $this->hasMany(Post::class, 'user_id', 'id');
    }
}
