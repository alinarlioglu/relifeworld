<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $table = 'rlw_comments';
    //Fields that allow the data to be modified
    protected $fillable = ['chapter_id', 'user_id', 'contents'];
    //No created_at & updated_at fields nor do I want them to be updated whenever a record is inserted to the table.
    public $timestamps = false;

    public function chapter(){
        return $this->belongsTo(Chapter::class);
    }
}
