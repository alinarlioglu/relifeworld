<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'rlw_reviews';

    protected $fillable = [
        'title','description','user_id','book_id','created_at','updated_at'
    ];

    public function user(){
        return $this->belongsTo(Member::class, 'id', 'user_id');
    }

    public function book(){
        return $this->belongsTo(Book::class);
    }
}
