<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $table = 'rlw_books';

    protected $fillable = [
        'title','user_id','cover','blurb','genre_id','created_at','updated_at'
    ];

    public function chapter(){
        return $this->hasMany(Chapter::class, 'book_id', 'id');
    }

    public function genre(){
        return $this->hasOne(Genre::class,'genre_id','id');
    }

    public function user(){
        return $this->belongsTo(Member::class, 'id', 'user_id');
    }

    public function ratings(){
        return $this->hasMany(Rating::class,'book_id','id');
    }

    public function reviews(){
        return $this->hasMany(Review::class,'book_id','id');
    }
}
