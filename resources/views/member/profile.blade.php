@extends('home.module.template-pages')
@section('content')
    <div class="profile-container">
        <div class="profile-photo-container">
            <img src="{{ asset('relife/img/defaut-profile.jpeg') }}" alt="Profile">
        </div>
        <div class="nickname-container">
            <h3>{{ $member->nickname }}</h3>
        </div>
        <div class="profile-detail-container">
            <div class="join-container">
                <p><strong>Joined:</strong> &nbsp {{ $member->joined }}</p>
            </div>
            <div class="fictions-detail-container">
                <p><strong>Fictions:</strong> &nbsp {{ $member->fictions }}</p>
            </div>
            <div class="reviews-detail-container">
                <p><strong>Reviews:</strong> &nbsp {{ $member->reviews }}</p>
            </div>
        </div>
@if($member->fictions != 0)
        <div class="author-fictions-container">
            <div class="author-fictions-title-container">
                <h3>{{ $member->nickname }}'s Fictions</h3>
            </div>
    @foreach($fictions as $fiction)
                <div class="best-rated-container">
                    <div class="book-cover-container">
                        <img src="{{ isset($fiction->cover) ? $fiction->cover : asset('relife/img/default-cover.jpg') }}" alt="Cover">
                    </div>
                    <div class="book-detail-container">
                        <a class="book-page-btn" href="{{ route('books.page', ['id' => $fiction->bookId]) }}">
                            <div class="book-title-result-container">
                                <h3>{{ $fiction->title }}</h3>
                            </div>
                        </a>
                        <div class="book-genre-container">
                            <a class="genre" genre-id="{{ $fiction->genre_id }}">{{ $fiction->name }}</a>
                        </div>
                        <div class="size-buttons">
                            <div class="expand-button">
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="collapse-button">
                                <i class="fas fa-chevron-up"></i>
                            </div>
                            <div class="book-blurb-container">
                                <p>{{ $fiction->blurb }}</p>
                            </div>
                        </div>
                    </div>
                </div>
    @endforeach
@else
                <h4 style="width: 95%; margin-left: 2.5%;">{{ $member->nickname }} doesn't have any written fictions!</h4>
@endif
        </div>
    </div>
    <script>
        $('.book-genre-container a').off('click');
        $('.book-genre-container a').on('click', function (){
            setCookie('genre', $('.book-genre-container a').attr('genre-id'), 1);
            location.href = '/search';
        });

        $('.size-buttons').each(function (index, object) {
            //When clicked on the down arrow button, the description container is shown, the down arrow is hidden, and a new
            //up arrow is shown to hide the description. The search container's height also changes according to the description length.
            //The other search containers move down to accommodate for the increase in height of the current search container.
            $(object).find('.collapse-button').off('click');
            $(object).find('.collapse-button').on('click', function (event) {
                event.stopPropagation();
                event.preventDefault();
                $(object).find('.expand-button').css( 'display', "block");
                $(object).find('.collapse-button').css('display', "none");
                $(object).find('.book-blurb-container').css( 'display', "none");
                $(object).closest('.height').css({"height":""});
                $(object).closest('.best-rated-container').removeClass('height');
            });

            $(object).find('.expand-button').off('click');
            $(object).find('.expand-button').on('click', function (event) {
                event.stopPropagation();
                event.preventDefault();
                $(object).find('.expand-button').css( "display", "none");
                $(object).find('.collapse-button').css("display", "block");
                $(object).find('.book-blurb-container').css("display", "block");
                if(($(object).find('.book-blurb-container').actual('height') + $(object).siblings('.book-page-btn').find('.book-title-result-container').actual('height') + $(object).prev('.book-genre-container').actual('height') + 125) > $(object).closest('.best-rated-container').actual('height')) {
                    $(object).closest('.best-rated-container').addClass('height');
                    $(object).closest('.height').css('height',($(object).find('.book-blurb-container').actual('height') + $(object).siblings('.book-page-btn').find('.book-title-result-container').actual('height') + $(object).prev('.book-genre-container').actual('height') + 125));
                }
            });
        });
    </script>
@endsection
