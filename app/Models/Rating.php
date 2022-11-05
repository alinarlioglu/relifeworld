<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $table = 'rlw_rating';

    protected $fillable = [
        'five_stars','four_stars','three_stars','two_stars','one_star','book_id'
    ];

    public function book(){
        return $this->belongsTo(Book::class);
    }
}