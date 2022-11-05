<?php

namespace App\Http\Controllers\Relife;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Chapter;
use App\Models\Genre;
use App\Models\Member;
use App\Models\Rating;
use App\Models\Review;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;
use Carbon\Carbon;

class BookController extends Controller
{
    public function book(Request $request, $id){
        //I can't access the book's inverse relationship.
        $chapters = Chapter::select('id','title','book_id','created_at')
            ->where('book_id',$id)
            ->orderBy('number','ASC')
            ->paginate(15);

        //Nor can I access the book's chapters through the inverse relationship.
        $book = Book::select('id','title','user_id','cover','blurb','genre_id')
            ->where('id',$id)
            ->first();

        $ratings = Rating::select('five_stars','four_stars','three_stars','two_stars','one_star')
            ->where('book_id',$id);
        //Nor can I access the genre of the book via the inverse relationship.
        $genre = Genre::select('name')->where('id', $book->genre_id)->first();
        //I can't access the author through the 'Book' model either.
        $user = Member::select('nickname')->where('id',$book->user_id)->first();

        return view('book.book', compact('chapters','book','ratings','genre', 'user'));
    }

    public function rateBook (Request $request) {
        $data = $request->all();

        if((int)$data['bookId'] != null) {
            $previousRating = Rating::select('one_star','two_stars','three_stars','four_stars','five_stars')->where('book_id', '=',(int)$data['bookId'])->first();

            if((int)$data['clickedStarName'] == 1) {
                $newRating = Rating::updateOrInsert(['book_id' => (int)$data['bookId']], ['one_star' => (!is_null($previousRating) ? $previousRating->one_star+1 : 1)]);
            }  elseif ((int)$data['clickedStarName'] == 2) {
                $newRating = Rating::updateOrCreate(['book_id' => (int)$data['bookId']], ['two_stars' => (!is_null($previousRating) ? ($previousRating->two_stars+1) : 1)]);
            } elseif ((int)$data['clickedStarName'] == 3) {
                $newRating = Rating::updateOrCreate(['book_id' => (int)$data['bookId']], ['three_stars' => (!is_null($previousRating) ? ($previousRating->three_stars+1) : 1)]);
            } elseif ((int)$data['clickedStarName'] == 4) {
                $newRating = Rating::updateOrCreate(['book_id' => (int)$data['bookId']], ['four_stars' => (!is_null($previousRating) ? ($previousRating->four_stars+1) : 1)]);
            } elseif ((int)$data['clickedStarName'] == 5) {
                $newRating = Rating::updateOrCreate(['book_id' => (int)$data['bookId']], ['five_stars' => (!is_null($previousRating) ? ($previousRating->five_stars+1) : 1)]);
            }
        }
    }

    public function chapter(Request $request, $name, $chapterId) {
        $chapter = Chapter::select( 'title', 'book_id', 'description', 'number')
            ->where('id',$chapterId)->first();

        //Checking if the previous or next chapter exists and retrieving it.
        $previousChapter = Chapter::select('id')->where('book_id',$chapter->book_id)
            ->where('number', ($chapter->number - 1));
        if($previousChapter->exists()) {
            $previousChapter = $previousChapter->first();
        }

        $nextChapter = Chapter::select('id')->where('book_id',$chapter->book_id)
            ->where('number', ($chapter->number + 1));
        if($nextChapter->exists()) {
            $nextChapter = $nextChapter->first();
        }

        //Since the inverse relationship on 'Chapter' model doesn't work, I am retriving the book by doing another query...
        //Higher execution time since we're opening and closing the database files TWICE instead of once...

        $book = Book::select('title','user_id','cover')
            ->where('id', $chapter->book_id)->first();
        //Likewise, I can't access the inverse relationship on 'Book' to access the book's author AKA 'User'...
        //Higher execution time since I'm doing three queries instead of a single query...

        $author = Member::select('nickname')
            ->where('id', $book->user_id)->first();

        return view('chapter.chapter', compact('chapter','book','author','previousChapter','nextChapter','chapterId'));
    }

    public function fetchComments(Request $request, $chapterId){
        //Fetching the comments.
        $comments = Comment::select('contents','nickname','rlw_comments.created_at')
            ->leftJoin('rlw_users','rlw_users.id','=','rlw_comments.user_id')
            ->where('rlw_comments.chapter_id','=',$chapterId);

        //Checking the page number that needs to be fetched.
        $data = $request->all();

        //Checking if the chapter contains any comments.
        //Fetches the comments if they exist. Otherwise, it returns a false status to indicate that there aren't any comments for the chapter.
        if($comments->exists()){
            if($data['page'] == 1) {
                $comments = $comments->paginate(1);
            } else if ($data['page'] > 1) {
                $comments = $comments->paginate(1, ['*'], 'page', $data['page']);
            }
            return response()->json(['status' => true, 'data' => ['comments' => $comments, 'chapterId' => $chapterId], 'message' => 'Comments are successfully fetched.']);
        } else {
            $comments = null;
            return response()->json(['status' => false, 'data'=> [], 'message' => '']);
        }
    }

    public function postComment(Request $request) {
        //Initialising variable/s
        $userId = null;
        //Fetching the comment data from the front-end to the back-end through the sent request.
        $data = $request->all();
        //Creating a new record in the 'rlw_comments' table.
        $comment = new Comment();
        //Checking if a session holding the logged in member's data existed.
        //The 'memberData' session can only exist if the user is logged in.
        if(Session::has('memberData')){
            $userData = Session::get('memberData');
            $userId = $userData->id;
        }
        //Saving the comment data to the record.
        $comment->user_id = $userId;
        $comment->chapter_id = $data['chapterId'];
        $comment->contents = $data['commentContents'];
        $comment->created_at = Carbon::now()->toDateTimeString();
        //Storing the comment in the database.
        $comment->save();

        return response()->json(['status' => true, 'data' => [], 'message' => 'No comment']);
    }

    public function submitReview(Request $request) {
        $data = $request->all();

        $review = new Review();
        $review->title = $data['reviewTitle'];
        $review->description = $data['reviewDescription'];
        if(Session::has('memberData')) {
            $user = Session::get('memberData');
            $review->user_id = $user->id;
        }
        $review->book_id = $data['bookId'];
        $review->save();
    }

    public function getReviews(Request $request){
        $data = $request->all();

        $reviewList = Review::select('rlw_reviews.id','title','description','user_id','rlw_reviews.created_at', 'nickname')
            ->leftJoin('rlw_users','rlw_users.id','=','rlw_reviews.user_id')
            ->where('book_id',$data["bookId"])
            ->orderBy('created_at', 'ASC');

        if($reviewList->exists()) {
            $reviewList = $reviewList->get();

            return response()->json(['status' => true, 'data' => ['reviewList' => $reviewList], 'message' => 'N/A']);
        }

        return response()->json(['status' => false, 'data' => [], 'message' => "There aren't any reviews for this book."]);
    }

    public function editReview(Request $request) {
        //Obtaining the data from the request.
        $data = $request->all();
        //Updating the relevant record.
        $editReview = Review::where('id','=',$data['id'])
            ->update(['description' => $data['reviewDescription']]);

        return response()->json(['status' => true, 'data' => [], 'message' => 'Successfully updated the record.']);
    }

    public function storeNovel(Request $request) {
        $data = $request->all();

        $userId = null;
        $newBook = null;

        if(Session::has('memberData')) {
            $userId = Session::get('memberData')->id;
        }

        if(array_key_exists('writingType', $data) && $data['writingType'] == 'new') {
            $newBook = new Book();
        }

        if(array_key_exists('novelTitle', $data)) {
            $newBook->title = $data['novelTitle'];
        }
        if(array_key_exists('novelBlurb',$data)) {
            $newBook->blurb = $data['novelBlurb'];
        }
        if(!empty($userId) && $data['writingType'] == 'new') {
            $newBook->user_id = $userId;
        }
        if(array_key_exists('genre', $data)) {
            $newBook->genre_id = $data['genre'];
        }
        if(array_key_exists('cover', $data)) {
            //Needs modification as the image contains a bunch of data which I'm not sure if I really need it.
            $fileName = ($data['cover'])->getClientOriginalName();
            $destination = public_path('/relife/img/');
            ($data['cover'])->move($destination, $fileName);

            $newBook->cover = (asset('relife/img/'.$fileName));
            $newBook->save();
        } elseif(!array_key_exists('cover', $data) && array_key_exists('writingType', $data) && $data['writingType'] == 'new') {
            $newBook->cover = (asset('relife/img/default-cover.jpg'));
            $newBook->save();
        }

        $newChapter = new Chapter();
        if(array_key_exists('chapterTitle', $data)) {
            $newChapter->title = $data['chapterTitle'];
        }
        if(array_key_exists('novelDescription', $data)) {
            $newChapter->description = $data['novelDescription'];

            if(array_key_exists('writingType', $data) && $data['writingType'] != 'existingNovel') {
                $newChapter->book_id = $newBook->id;
                $newChapter->number = 1;
            } elseif (array_key_exists('writingType', $data) && $data['writingType'] == 'existingNovel') {
                if(array_key_exists('number', $data)) {
                    $newChapter->number = (int)$data['number'];
                }
                if(array_key_exists('bookId', $data)) {
                    $newChapter->book_id = $data['bookId'];
                }
            }
        }

        $newChapter->save();

        return response()->json(['status' => true, 'data' => [], 'messages' => '']);
    }

    public function getExistingNovels() {
        $userId = null;
        $newChapter = null;
        if(Session::has('memberData')) {
            $userId = Session::get('memberData')->id;
        }
        $doesUserHaveNovels = Book::select('rlw_books.title as bookTitle','rlw_books.id as book_id', 'cover')
            ->where('user_id', $userId);
        if($doesUserHaveNovels->exists()) {
            $doesUserHaveNovels = $doesUserHaveNovels->get();

        } else {
            $doesUserHaveNovels = null;
        }

        return view('write.write_options', compact('doesUserHaveNovels'));
    }

    public function getNewNovelPage() {
        $genres = Genre::select('name', 'id')->get();

        return view('write.write', compact('genres'));
    }

    public function getExistingNovelPage($id) {
        $previousChapterNumber = Chapter::select('number')
            ->where('book_id',$id)
            ->orderBy('number', 'DESC')
            ->first();

        return view('write.write_existing_novel', compact('previousChapterNumber', 'id'));
    }

    public function audio($questionNumber){
        return view('audio.audio', compact('questionNumber'));
    }
}
