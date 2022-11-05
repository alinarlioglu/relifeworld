<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Post;

class Topic extends Model
{
    //Protected before an access function, a getter function, a normal function, or an attribute allows these things to be accessed by the
    //child classes of the parent class. Therefore, the child class can also use those functions or attributes.
    //I'm overriding the attributes values in this child class, so it accesses a different table and fills in different columns of the table when accessed.
    protected $table = 'rlw_topic';
    protected $fillable = ['title','poster_user_id'];

    //A topic can have many posts - one-to-many relationship. Enables access to the posts of a specific topic when accessing this function.
    public function post(){
        //hasMany(class referring a foreign key, foreign key name, local name)
        return $this->hasMany(Post::class, 'topic_id', 'id');
    }
}
