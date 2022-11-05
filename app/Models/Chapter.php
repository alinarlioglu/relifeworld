<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    protected $table = 'rlw_chapters';

    protected $fillable = [
        'title', 'description','number','book_id','created_at','updated_at'
    ];

    public function book(){
        return $this->belongsTo(Book::class);
    }

    public function comment(){
        return $this->hasMany(Comment::class, 'chapter_id', 'id');
    }
}
