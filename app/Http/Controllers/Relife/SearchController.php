<?php

namespace App\Http\Controllers\Relife;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Genre;
use http\Env\Response;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search() {
        $genres = Genre::select('name', 'id')->get();

        return view('search.search', compact('genres'));
    }

    public function getSearchResults(Request $request) {
        $data = $request->all();

        $results = Book::select('rlw_books.title as bookTitle', 'blurb', 'cover', 'rlw_genres.name as bookGenre', 'rlw_books.id as bookId', 'rlw_genres.id as genreId')
            ->leftJoin('rlw_genres', 'rlw_genres.id', '=', 'rlw_books.genre_id')
            ->leftJoin('rlw_chapters', 'rlw_chapters.book_id', '=', 'rlw_books.id')
            ->leftJoin('rlw_users', 'rlw_books.user_id','=','rlw_users.id');

        if(array_key_exists('genre', $data)){
            $temp = [];
            foreach ($data['genre'] as $key => $id) {
                array_push($temp, (int)$id);
            }
            $data['genre'] = $temp;

            $results = $results->whereIn('rlw_genres.id', $data['genre']);
        }
        if(array_key_exists('excludeGenre', $data)) {
            $temp = [];
            foreach ($data['excludeGenre'] as $key => $id) {
                array_push($temp, (int)$id);
            }
            $data['excludeGenre'] = $temp;

            $results = $results->whereNotIn('rlw_genres.id', $data['excludeGenre']);
        }
        if(array_key_exists('keyword', $data) && !empty($data['keyword'])) {
            $results = $results->where(function($query) use ($data) {
                return $query->where('nickname', 'LIKE', ("%".$data['keyword']."%"))
                    ->orWhere('rlw_books.title', 'LIKE', ("%".$data['keyword']."%"));
            });
        }
        if(array_key_exists('number', $data) && !empty($data['number'])) {
            $results = $results->where('rlw_chapters.number', '>=', (int)$data['number']);
        }
        $results = $results->distinct()->get();

        foreach ($results as $search) {
            $temp = str_replace(' ', '-', $search->bookTitle);
            $temp = str_replace(':','', $temp);
            $temp = $temp.$search->bookId;
            $search->setAttribute('expandCollapseButtonId', $temp);
        }

        if($results->isEmpty()){
            return response()->json(['status' => false, 'data' => [], 'message' => 'The search is empty.']);
        }
        return response()->json(['status' => true, 'data' => ['getSearch'=> $results], 'message' => 'N/A']);
    }
}
