@extends('home.module.template-pages')
@section('content')
    <div class="book-container">
        <div class="book-title">
            <h4>{{ $book->title }}</h4>
        </div>
        <div class="author-container">
            <p>By <a>{{ $user->nickname }}</a></p>
        </div>
        <div class="large-cover-container">
            <img src="{{ !is_null($book->cover) ? $book->cover : 'http://i.imgur.com/sJ3CT4V.gif' }}" alt="Cover"/>
        </div>
        <div class="genre-container">
            <a class="genre" genre-id="{{ $book->genre_id }}" href="#search">{{ $genre->name }}</a>
        </div>
        <div class="rating-container">
            <span><strong>Overall score: </strong></span>
            <a class="rating" data-different="1" name="1"><i class="fa fa-star lightgrey" aria-hidden="true"></i></a>
            <a class="rating" data-different="2" name="2"><i class="fa fa-star lightgrey" aria-hidden="true"></i></a>
            <a class="rating" data-different="3" name="3"><i class="fa fa-star lightgrey" aria-hidden="true"></i></a>
            <a class="rating" data-different="4" name="4"><i class="fa fa-star lightgrey" aria-hidden="true"></i></a>
            <a class="rating" data-different="5" name="5" style="margin-right: 10px;"><i class="fa fa-star lightgrey" aria-hidden="true"></i></a>
        </div>
        <div class="blurb-container">
            <p>{{ $book->blurb }}</p>
        </div>
    </div>
    <div class="book-page-chapter-container">
        @foreach($chapters as $chapter)
            <div class="single-chapter-container" style="width: 100%;">
            <div class="chapter-title-container">
                <?php
                $book->title = str_replace(' ', '-', $book->title);
                $book->title = str_replace(':','', $book->title);
                ?>
                <span><a href="{{ route('books.chapter', ['name' => $book->title, 'chapterId' => $chapter->id]) }}" >{{ $chapter->title }}</a></span>
            </div>
            <div class="chapter-date-container">
                <span>{{ date('d-m-Y', strtotime($chapter->created_at)) }}</span>
            </div>
            </div>
        @endforeach
        {!! $chapters->links() !!}
    </div>
    <div class="outer-review-container">
        <div class="inner-review-container">
            <h3>Review</h3>
            <div class="review-title">
                <span>Title</span>
            </div>
            <div class="review-title-answer">
                <input type="text" name="reviewTitle" size="80">
            </div>
            <div class="review-description">
                <span>Description</span>
            </div>
            <div class="review-description-answer">
                <textarea name="reviewDescription" rows="15" cols="80" placeholder="For a review, please provide an overview of your opinion about the story and justify your rating for the story."></textarea>
            </div>
            <input id="reviewButton" type="submit" name="sendReview" class="send action-button review-button" value="Post Review">
        </div>
    </div>
    <div class="outer-book-reviews-container">
        <div class="inner-book-reviews-container-template" hidden>
            <div class="review-title-container">
                <div class="avatar">
                    <i class="fas fa-user-circle fa-3x"></i>
                </div>
                <h3>Review Title</h3>
            </div>
            <div class="author-review-container">
                <span>By Author</span>
                <div class="review-date-container">
                    <p>fcff</p>
                </div>
            </div><br>
            <div class="review-description-container">
                <p>gggg</p>
            </div>
        </div>
    </div>
    <script src="https://cdn.ckeditor.com/ckeditor5/12.3.1/classic/ckeditor.js"></script>
    <script>
        //Variable to store the review's contents, so it can be sent in an AJAX to the back-end.
        var reviewDescription = null;
        //Library that allow's text formatting in a textarea.
        ClassicEditor.create(document.querySelector('textarea[name="reviewDescription"]'))
            .then(editor => {
                reviewDescription = editor;
            });

        var currentStarStatus = [];

        starElements = $('.fa-star').parent();

        starElements.find(".fa-star").each(function(i, elem) {
            currentStarStatus.push($(elem).hasClass('yellow'));
        });

        starElements.find(".fa-star").mouseenter(changeRatingStars);
        starElements.find(".fa-star").mouseleave(resetRatingStars);

        /**
         * Changes the rating star colors when hovering over it.
         */
        function changeRatingStars() {
            // Current star hovered
            var star = $(this);

            // Removes all colors first from all stars
            $('.fa-star').removeClass('lightgrey').removeClass('yellow');

            // Makes the current hovered star yellow
            star.addClass('yellow');

            // Makes the previous stars yellow and the next stars lightgrey
            star.parent().prevAll().children('.fa-star').addClass('yellow');
            star.parent().nextAll().children('.fa-star').addClass('lightgrey');
        }

        /**
         * Resets the rating star colors when not hovered anymore.
         */
        function resetRatingStars() {
            starElements.each(function(i, elem) {
                $(elem).removeClass('yellow').removeClass('lightgrey').addClass(currentStarStatus[i] ? 'yellow' : 'lightgrey');
            });
        }

        $('.rating').off('click');
        $('.rating').on('click', function () {
            @if(!(\Illuminate\Support\Facades\Auth::guard('members')->check()))
            $('#loginButton').trigger('click');
            @else
                var ratedBookCookie = getCookie('ratedBook');

                if (ratedBookCookie == null) {
                    var clickedStarName = $(this).attr('name');
                    var clickedStar = $(this).find('.fa-star');

                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });

                    $.ajax({
                        url: '{{ route('books.rating') }}',
                        method: 'POST',
                        data: {
                            clickedStarName,
                            'bookId': '{{ $book->id }}'
                        },
                        success: function (resp) {
                            $('.fa-star').removeClass('lightgrey').removeClass('yellow');
                            //Making the current star turn to yellow.
                            clickedStar.addClass('yellow');
                            //Making the previous stars to change their colour to yellow and the next stars to change their colour to light grey.
                            clickedStar.parent().prevAll().children('.fa-star').addClass('yellow');
                            clickedStar.parent().nextAll().children('.fa-star').addClass('lightgrey');

                            starElements.find(".fa-star").unbind("mouseenter");
                            starElements.find(".fa-star").unbind("mouseleave");

                            var ratedBookArray = {'{{ $book->id }}':clickedStarName};
                            setCookie('ratedBook', JSON.stringify(ratedBookArray), 1);
                        }
                    });
                }
            @endif
        });

        var ratedBookCookie2 = JSON.parse(getCookie('ratedBook'));
        if(ratedBookCookie2 != null) {
            if ('{{ $book->id }}' in ratedBookCookie2) {
                var keyArray = $('[name=' + "{{ $book->id }}" + ']').attr('data-different');
                for(let i = 1; i <= ratedBookCookie2[keyArray]; ++i) {
                    console.log(i);
                    $('[data-different="' + i + '"] .fa-star').removeClass('lightgrey');
                    $('[data-different="' + i + '"] .fa-star').addClass('yellow');
                }

                starElements.find(".fa-star").unbind("mouseenter");
                starElements.find(".fa-star").unbind("mouseleave");
            }
        }

        function review(){
            $('#reviewButton').off('click');
            $('#reviewButton').on('click', function () {
                @if(!(\Illuminate\Support\Facades\Auth::guard('members')->check()))
                    $('#loginButton').trigger('click');
                @else
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });

                    $.ajax({
                        url: '{{ route('book.review.submit') }}',
                        method: 'POST',
                        data: {
                            'reviewTitle': $('[name="reviewTitle"]').val(),
                            'reviewDescription': reviewDescription.getData(),
                            'bookId': '{{ $book->id }}'
                        },
                        success: function(resp) {
                            //location.reload();
                            window.location.href = window.location.pathname;
                        }
                    });
                @endif
            });
        }

        function loadReviews() {
            $.ajax({
                url: '{{ route('book.reviews.list') }}',
                method: 'GET',
                data: {
                    'bookId': '{{ $book->id }}'
                },
                success: function(resp) {
                    console.log(resp);
                    if('status' in resp && resp.status == true) {
                        if('reviewList' in resp.data && resp.data.reviewList != undefined || (resp.data.reviewList).length != 0) {
                            (resp.data.reviewList).forEach(function (review) {
                                var reviewContainerTemplate = $('.inner-book-reviews-container-template');
                                var latestReviewContainerRow = reviewContainerTemplate.clone();

                                latestReviewContainerRow.attr('class','inner-book-reviews-container');

                                if('title' in review) {
                                    latestReviewContainerRow.find('.review-title-container h3').html(review.title);
                                }
                                if('description' in review) {
                                    latestReviewContainerRow.find('.review-description-container p').html(review.description);
                                }
                                //User can edit their own review if they're logged in.
                                @if(\Illuminate\Support\Facades\Auth::guard('members')->check() && \Illuminate\Support\Facades\Auth::guard('members')->id() == $book->user_id)
                                    //Adding the editing and submission buttons to modify the review.
                                    latestReviewContainerRow.find('.review-title-container h3').append('<button class="edit-btn">Edit</button>');
                                    latestReviewContainerRow.find('.review-title-container .edit-btn').addClass('edit-btn-' + review.id)

                                    latestReviewContainerRow.find('.review-title-container h3').append('<input type="submit" name="submitReviewBtn" class="submit-review-btn" value="Submit">');
                                    if('description' in review) {
                                        //Variable to store the review's contents, so it can be sent in an AJAX to the back-end.
                                        var editedReviewDescription = null;
                                        //Adding a click event to hide the original description paragraph and putting the description contents in the editable textarea using the imported library.
                                        latestReviewContainerRow.find('.review-title-container .edit-btn').off('click');
                                        latestReviewContainerRow.find('.review-title-container .edit-btn').on('click', function() {
                                            latestReviewContainerRow.find('.review-description-container').children().hide();
                                            latestReviewContainerRow.find('.review-description-container').html('<textarea name="editReviewDescription" rows="15" cols="80">' + review.description + '</textarea>');

                                            //Library that allow's text formatting in a textarea.
                                            ClassicEditor.create(document.querySelector('textarea[name="editReviewDescription"]'))
                                                .then(editor => {
                                                    editedReviewDescription = editor;
                                                });
                                        });

                                        latestReviewContainerRow.find('.review-title-container .submit-review-btn').off('click');
                                        latestReviewContainerRow.find('.review-title-container .submit-review-btn').on('click', function() {
                                            if(('title' in review) && ('id' in review)) {
                                                //Pretending that this is a form submission, so I can send data to the back-end to save to the database.
                                                $.ajaxSetup({
                                                    headers: {
                                                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                                    }
                                                });

                                                $.ajax({
                                                    url:"{{ route('book.review.edit') }}",
                                                    method:'POST',
                                                    data: {
                                                        'userId':'{{ \Illuminate\Support\Facades\Auth::guard("members")->id() }}',
                                                        'id':review.id,
                                                        'reviewDescription':editedReviewDescription.getData()
                                                    },
                                                    success: function(resp){
                                                        if('status' in resp) {
                                                            window.location.href = window.location.pathname;
                                                        } else {
                                                            console.log('There was a error in the process of updating the edited review.')
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                @endif
                                if('nickname' in review) {
                                    latestReviewContainerRow.find('.author-review-container span').html('By ' + review.nickname);
                                }
                                if('created_at' in review) {
                                    newDateFormat = review.created_at.split("T");
                                    latestReviewContainerRow.find('.review-date-container p').html(newDateFormat[0]);
                                }
                                latestReviewContainerRow.show();
                                $('.outer-book-reviews-container').prepend(latestReviewContainerRow);
                            });
                        }
                    }
                }
            });
        }

        function saveGenreAndRedirect(){
            $('.genre-container .genre').off('click');
            $('.genre-container .genre').on('click', function() {
                setCookie('genre', $('.genre-container .genre').attr('genre-id'), 1);
                location.href = "/search";
            });
        }

        $(document).ready(function () {
            //Submit a reviews
            review();
            //Load the reviews
            loadReviews();
            //Saving the genre ID in the cookies and redirecting the user to the search page.
            saveGenreAndRedirect();
        });
    </script>
@endsection
