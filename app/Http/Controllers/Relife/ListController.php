<?php

namespace App\Http\Controllers\Relife;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Member;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ListController extends Controller
{
    public function bestRatedList(){
        $bestRatedBooks = Book::select('rlw_books.title as bookTitle', 'blurb', 'cover', 'rlw_genres.name as bookGenre', 'rlw_books.id as bookId', 'rlw_genres.id as genreId', DB::raw('((rlw_rating.five_stars*5) + (rlw_rating.four_stars*4) + (rlw_rating.three_stars*3) + (rlw_rating.two_stars*2) + (rlw_rating.one_star*1))/(rlw_rating.five_stars + rlw_rating.four_stars + rlw_rating.three_stars + rlw_rating.two_stars + rlw_rating.one_star) as totalRating'))
            ->leftJoin('rlw_genres', 'rlw_genres.id', '=', 'rlw_books.genre_id')
            ->leftJoin('rlw_chapters', 'rlw_chapters.book_id', '=', 'rlw_books.id')
            ->leftJoin('rlw_rating', 'rlw_rating.book_id', '=', 'rlw_books.id')
            ->leftJoin('rlw_rating as rlw2', 'rlw2.book_id', '=', 'rlw_rating.book_id')
            ->where(DB::raw('((rlw_rating.five_stars*5) + (rlw_rating.four_stars*4) + (rlw_rating.three_stars*3) + (rlw_rating.two_stars*2) + (rlw_rating.one_star*1))/(rlw_rating.five_stars + rlw_rating.four_stars + rlw_rating.three_stars + rlw_rating.two_stars + rlw_rating.one_star)'), '>=', DB::raw('((rlw2.five_stars*5) + (rlw2.four_stars*4) + (rlw2.three_stars*3) + (rlw2.two_stars*2) + (rlw2.one_star*1))/(rlw2.five_stars + rlw2.four_stars + rlw2.three_stars + rlw2.two_stars + rlw2.one_star)'))
            ->where('rlw_rating.created_at', '<=', \Carbon\Carbon::now()->subDays(25)->toDateTimeString())
            ->distinct()->get();

        return view('list.best_rated', compact('bestRatedBooks'));
    }

    public function members(){
        return view('member.member');
    }

    public function getMembers(){
        //The inverse relationships on the models' don't work, so I am going to do more queries instead of a single query...
        //More queries = more file opening & closing = more execution time.
        $members = \App\Models\Member::select('nickname', 'rlw_users.created_at as joined', 'id')
                ->get();

        foreach($members as $member) {
            $member->setAttribute('fictions', Book::where('user_id','=',$member->id)->count());
            $member->setAttribute('reviews', Review::where('user_id','=',$member->id)->count());
        }

        return response()->json(['status' => true, 'data' => ['members' => $members], 'message' => 'N/A']);
    }

    public function getMemberProfileDetails($id) {
        $member = Member::select('nickname', 'created_at as joined')
            ->where('id', $id)->first();

        $fictions = Book::select('title','cover','blurb', 'name', 'rlw_books.id as bookId')
            ->leftJoin('rlw_genres', 'rlw_genres.id','=','rlw_books.genre_id')
            ->where('user_id', $id);

        $member->setAttribute('fictions', $fictions->count());

        $fictions = $fictions->get();

        $member->setAttribute('reviews', Review::where('user_id','=',$id)->count());

        return view('member.profile', compact('member', 'fictions'));
    }

    public function imageCloud(){
        return view('image-cloud.image_cloud');
    }

    public function photos(){
        return view('image-cloud.photos');
    }
}
