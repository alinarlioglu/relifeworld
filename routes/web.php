<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['namespace' => 'Relife'], function () {
    Route::get('/home','HomeController@home')->name('relife.home');
    Route::get('/forum/post/{id}', 'HomeController@getPosts')->name('relife.forum.post.fetch');
    Route::get('/forum/topic/{id}', 'HomeController@announcement')->name('relife.forum.topic');

    Route::post('/member/store', 'HomeController@store')->name('member.store');
    Route::post('/member/login', 'LoginController@login')->name('member.login');
    Route::post('/member/logout', 'LoginController@logout')->name('member.logout');
    Route::get('/members', 'ListController@members')->name('member.page');
    Route::get('/member/list', 'ListController@getMembers')->name('member.list');
    Route::get('/member/{id}', 'ListController@getMemberProfileDetails')->name('member.profile');

    Route::get('/updatedBooks','HomeController@updatedBooks')->name('books.latest');
    Route::get('/trendingBooks', 'HomeController@trendingBooks')->name('books.trending');
    Route::get('/fiction/{id}', 'BookController@book')->name('books.page');
    Route::post('/fiction/rating', 'BookController@rateBook')->name('books.rating');
    Route::get('/fiction/{name}/{chapterId}', 'BookController@chapter')->name('books.chapter');
    Route::post('/review/submit', 'BookController@submitReview')->name('book.review.submit');
    Route::get('/reviews/list', 'BookController@getReviews')->name('book.reviews.list');
    Route::post('/review/edit', 'BookController@editReview')->name('book.review.edit');
    Route::get('/write/options', 'BookController@getExistingNovels')->name('books.write.existing');
    Route::get('/write/new', 'BookController@getNewNovelPage')->name('books.write.new');
    Route::get('/write/{id}', 'BookController@getExistingNovelPage')->name('books.write.existing.page');
    Route::post('/write/post', 'BookController@storeNovel')->name('books.write.novel');
    Route::post('/comment/post','BookController@postComment')->name('books.post.comment');
    Route::get('/comments/{chapterId}', 'BookController@fetchComments')->name('books.comments.fetch');
    Route::get('/search', 'SearchController@search')->name('books.search');
    Route::post('/search/list', 'SearchController@getSearchResults')->name('books.search.list');
    Route::get('/best-rated', 'ListController@bestRatedList')->name('books.bestrated');
});
