<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Member;
use App\Models\Topic;

class Post extends Model
{
    protected $table = 'rlw_posts';

    protected $fillable = ['user_id','contents','topic_id','is_announcement'];

    public function member(){
        return $this->belongsTo(Member::class);
    }

    //Inverse relationship. Accessing this function allows to retrieve the topic details of the post e.g. title, poster, etc.
    public function topic() {
        return $this->belongsTo(Topic::class);
    }
}
