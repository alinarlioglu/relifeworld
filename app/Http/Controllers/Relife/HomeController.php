<?php

namespace App\Http\Controllers\Relife;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Chapter;
use App\Models\Member;
use App\Models\Topic;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class HomeController extends Controller
{
    public function home(Request $request){
        //Hard coding the administrator's email to fetch the announcements saved under the administrator's account.
        $checkAdmin = Member::select('id')->where('email','=','test@test.com');
        $topic = null;
        if($checkAdmin->exists()){
            $checkAdmin = $checkAdmin->first();
            //Query to fetch announcements posted by the administrator that are displayed on the slideshow.
            $topic = Topic::select('id')->where('poster_user_id', '=', $checkAdmin->id);
            //Checking if any announcements exist.
            if($topic->exists()) {
                //Fetching the latest three announcements made by the administrator.
                $topic = $topic->latest()->take(3)->get()->toArray();
            }
        }

        return view('home.home', ['topic' => $topic]);
    }

    public function store(Request $request){
        $newMember = null;
        $memberDetails = $request->all()['memberDetails'];

        $member = Member::where('email', '=', $memberDetails['email'])->first();
        if (is_null($member)) {
            $newMember = new Member();
        } else {
            return response()->json(['status' => false, 'data' => [], 'message' => 'Member profile already exists!']);
        }

        if(isset($memberDetails['email'])) {
            $newMember->email = $memberDetails['email'];
        }
        if(isset($memberDetails['nickname'])){
            $newMember->nickname = $memberDetails['nickname'];
        }
        if(isset($memberDetails['confirmPassword'])) {
            $newMember->password = bcrypt($memberDetails['confirmPassword']);
        }
        $newMember->save();

       /* if(auth()->guard('members')->check()){
            dd('members');
        } elseif (auth()->guard('guest')->) {
            dd('guest');
        } else {
            dd('nothing');
        }*/

        //Logging in the member.
        if(auth()->guard('members')->attempt(['email' => $newMember['email'], 'password' => $newMember['confirmPassword']])){
            Session::put('memberData', $newMember);
            dd("session", Session::get('memberData'));
        }

        return response()->json(['status' => true, 'data' => [], 'message' => 'Successfully created a new member profit']);
    }

    public function updatedBooks() {
        //Initiating the 'totalUpdatedChapters' variable.
        $totalUpdatedChapters = 0;
        //
       $updatedBookChapters = Chapter::select('rlw_chapters.id as chapterId','rlw_chapters.title as chapterTitle','rlw_chapters.book_id')
            ->join(\DB::raw('(SELECT rlw_chapters.book_id,MAX(rlw_chapters.number) as max_number FROM rlw_chapters GROUP BY rlw_chapters.book_id) as latest_chapter'), function($chapter){
                $chapter->on('rlw_chapters.book_id', '=', 'latest_chapter.book_id');
        })->where('rlw_chapters.number','=',\DB::raw('latest_chapter.max_number'));

       $totalUpdatedChapters = $updatedBookChapters->count();

        if($totalUpdatedChapters > 10) {
            $updatedBookChapters = $updatedBookChapters->take(10)->distinct()->get();
        }
        elseif ($totalUpdatedChapters > 0 && ($totalUpdatedChapters < 10 || $totalUpdatedChapters == 10)) {
            $updatedBookChapters = $updatedBookChapters->take($totalUpdatedChapters)->distinct()->get();
        }

        //Since the eloquent relationship doesn't work e.g. 'book', I'm going to use another query for now.
        foreach ($updatedBookChapters as $chapter) {
            $updatedBook = Book::select('rlw_books.title as bookTitle','user_id','cover','genre_id')
                ->where('id',$chapter->book_id)->first();

            $chapter->setAttribute('book', $updatedBook);
            $chapter->setAttribute('author', Member::select('nickname')->where('id',$updatedBook->user_id)->first());
        }

        return response()->json(['status' => true, 'data' => ['updatedBookChapters' => $updatedBookChapters], 'message' => 'Updated books']);
    }

    public function trendingBooks(){
        $trendingBooks = Book::select('rlw_books.title as bookTitle', 'rlw_books.user_id as userId', 'cover', 'genre_id', 'rlw_books.id as bookId', 'rlw_chapters.id as chapterId', 'rlw_chapters.title as chapterTitle', 'nickname',
            DB::raw('((rlw_rating.five_stars*5) + (rlw_rating.four_stars*4) + (rlw_rating.three_stars*3) + (rlw_rating.two_stars*2) + (rlw_rating.one_star*1))/(rlw_rating.five_stars + rlw_rating.four_stars + rlw_rating.three_stars + rlw_rating.two_stars + rlw_rating.one_star) as totalRating'))
                ->leftJoin('rlw_chapters', 'rlw_chapters.book_id', '=', 'rlw_books.id')
                ->leftJoin('rlw_users', 'rlw_users.id', '=', 'rlw_books.user_id')
                ->leftJoin('rlw_rating', 'rlw_rating.book_id', '=', 'rlw_books.id')
                ->leftJoin('rlw_rating as rlw2', 'rlw2.book_id', '=', 'rlw_rating.book_id')
                ->leftJoin('rlw_chapters as ch','ch.book_id','=','rlw_chapters.book_id')
                ->where('rlw_chapters.book_id','!=','ch.book_id')
                ->where(DB::raw('((rlw_rating.five_stars*5) + (rlw_rating.four_stars*4) + (rlw_rating.three_stars*3) + (rlw_rating.two_stars*2) + (rlw_rating.one_star*1))/(rlw_rating.five_stars + rlw_rating.four_stars + rlw_rating.three_stars + rlw_rating.two_stars + rlw_rating.one_star)'), '>=', DB::raw('((rlw2.five_stars*5) + (rlw2.four_stars*4) + (rlw2.three_stars*3) + (rlw2.two_stars*2) + (rlw2.one_star*1))/(rlw2.five_stars + rlw2.four_stars + rlw2.three_stars + rlw2.two_stars + rlw2.one_star)'))
                ->where('rlw_rating.created_at', '<=', \Carbon\Carbon::now()->subDays(14)->toDateTimeString())
                ->where('rlw_chapters.book_id','!=','ch.book_id')
                ->groupBy('rlw_chapters.book_id')
                ->orderBy('rlw_chapters.created_at','DESC');

        $trendingBooksCount = $trendingBooks->count();

        if($trendingBooksCount > 10) {
            $trendingBooks = $trendingBooks->take(10)->get();
        }
        elseif ($trendingBooksCount > 0 && ($trendingBooksCount < 10 || $trendingBooksCount == 10)) {
            $trendingBooks = $trendingBooks->take($trendingBooksCount)->get();
        }

        return response()->json(['status' => true, 'data' => ['trendingBooks' => $trendingBooks]]);
    }

    //Fetching the topic title and topic ID to send to the frontend. Not fetching posts here, so there are fewer queries = faster loading time for frontend page.
    public function announcement($topicId, Request $request) {
        $topic = null;
        if($topicId != null) {
            $topic = Topic::select('title')->where('id','=',$topicId);
            //Checking for errors to prevent the program from crashing and giving a 404 error page on the frontend.
            if($topic->exists()){
                $topic = $topic->first();
            }
        }
        return view('forum.announcement.post', compact('topic', 'topicId'));
    }

    //Function to fetch the posts for a particular topic along with a specific page if required.
    //AJAX function, so the frontend loads faster without the clutter caused by doing more queries and opening, closing, and fetching data from the database.
    public function getPosts(Request $request, $topicId) {
        $posts = null;
       // $topic = null;

        $data = $request->all();

        if($topicId != null) {
          //  $topic = Topic::select('poster_user_id')->where('id',$topicId)->first();
            $posts = Post::select('contents','user_id','created_at')
                ->where('topic_id','=',$topicId)
                ->orderBy('is_announcement','DESC');

            //If the 'page' parameter that comes from the URL exists and if it's greater than 1, then we do this.
            if($data['page'] > 1){
                //paginate(number of records per page, which columns [star means we want all columns], page, current page);
                $posts->paginate(1, ['*'], 'page', $data['page']);

            //If current page is '1', then simply go here.
            } else {
                //Number of records per page limited to '1'.
                $posts = $posts->paginate(1);
            }
            foreach($posts as $p) {
                dd($p);
            }
            dd($posts->toSql(), $posts->getBindings(), intval($data['page']), $posts->count());
            foreach($posts as $post) {
                $post->setAttribute('poster', Member::select('is_admin','nickname','rlw_users.created_at',DB::raw('COUNT(rlw_posts.user_id) as number_of_posts'))
                    ->leftJoin('rlw_posts', 'rlw_posts.user_id', '=', 'rlw_users.id')
                    ->where('rlw_users.id',$post->user_id)->first());
            }

            return response()->json(['status' => true, 'data' => ['posts' => $posts], 'message' => 'N/A']);
        }
        return response()->json(['status' => false, 'data' => [], 'message' => 'Topic ID is invalid.']);
    }
}
