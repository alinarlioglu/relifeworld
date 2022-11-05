<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    protected $table = 'rlw_genres';

    protected $fillable = [
        'name','created_at','updated_at'
    ];

    public function book(){
        return $this->belongsTo(Book::class);
    }
}
