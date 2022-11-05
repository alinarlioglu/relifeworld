<?php $__env->startSection('content'); ?>
    <?php echo $__env->make('search.components.filter', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <div class="search-container">
        <div id="resultContainer" class="result-container">
            <div class="book-cover-container">
                <img src="<?php echo e(asset('relife/img/default-cover.jpg')); ?>" alt="Cover">
            </div>
            <div class="book-detail-container">
                <a class="book-page-btn">
                    <div class="book-title-result-container">
                        <h3>Book title</h3>
                    </div>
                </a>
                <div class="book-genre-container">
                    <a class="genre">Fantasy</a>
                </div>
                <div class="size-buttons">
                    <div class="expand-button">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="collapse-button">
                        <i class="fas fa-chevron-up"></i>
                    </div>
                    <div class="book-blurb-container">
                        <p>span spam span spam</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <span id="noSearchMessage" class="hide">There isn't any books available with your search criteria!</span>
    <script>
        function openNav() {
            document.getElementById("filter").style.width = "33%";
            document.getElementById("filter").style.display = "block";
            document.getElementById("closeFilterBtn").style.display = "block";
            document.getElementById("openFilterBtn").style.display = "none";
        }

        function closeNav() {
            document.getElementById("filter").style.width = "0px";
            document.getElementById("filter").style.display = "none";
            document.getElementById("closeFilterBtn").style.display = "none";
            document.getElementById("openFilterBtn").style.display = "block";

        }

        function searchAjax(data){
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            $.ajax({
                url: '<?php echo e(route('books.search.list')); ?>',
                method: 'POST',
                // async: false,
                data: data,
                success: function(resp) {
                    //bookTitle, blurb, cover, bookGenre, etc.
                    if('data' in resp && ('status' in resp) && (resp.status == true)) {
                        if('getSearch' in resp.data) {
                            if(resp.data.getSearch.length > 0) {
                                $('.search-container').children().not("#resultContainer").remove();
                                if(!($('#noSearchMessage').hasClass('hide'))) {
                                    $('#noSearchMessage').addClass('hide')
                                }
                                $.each(resp.data.getSearch, function (key, value) {
                                    var searchContainerTemplate = $('#resultContainer');
                                    var latestSearchContainer = searchContainerTemplate.clone();
                                    latestSearchContainer.css({ 'display' : 'block'});
                                    latestSearchContainer.removeAttr('id');

                                    if('bookTitle' in value) {
                                        latestSearchContainer.find('.book-title-result-container h3').html(value.bookTitle);
                                    }
                                    if('blurb' in value) {
                                        latestSearchContainer.find('.book-blurb-container p').html(value.blurb);
                                    }
                                    if('cover' in value) {
                                        latestSearchContainer.find('.book-cover-container img').attr('src', value.cover);
                                    }
                                    if('bookGenre' in value) {
                                        latestSearchContainer.find('.book-genre-container a.genre').html(value.bookGenre);
                                        latestSearchContainer.find('.book-genre-container a.genre').attr('value', value.genreId);
                                    }
                                    latestSearchContainer.find('.book-page-btn').attr('href', ('/fiction/' + value.bookId));

                                    latestSearchContainer.find('.expand-button').attr('id', (value.expandCollapseButtonId + "1"));
                                    latestSearchContainer.find('.collapse-button').attr('id', (value.expandCollapseButtonId + "2"))

                                    latestSearchContainer.appendTo('.search-container');
                                    latestSearchContainer.show();
                                });
                            }
                        }
                    } else {
                        $('.search-container').children().not("#resultContainer").remove();
                        $('#noSearchMessage').removeClass('hide');
                    }
                }
            });
        }

        $(document).ready(function () {
            //Option 1
            //Check if there is any 'keyword' stored in the cookies, so I know that the user was redirected to this page from the navigation menu's search.
            if(getCookie('keyword') != null && getCookie('keyword') != '') {
                search('redirected-search-box');
            } else if (getCookie('genre') != null && getCookie('genre') != '') {
                //Option 2
                //Redirecting the user to the search page with the clicked on genre.
                search('redirected-genre-click');
            } else {
                //Option 2
                //Execute the data collection and trigger the search when the 'Search' button is clicked upon.
                search();
            }
            $('.search-button input[type="submit"][name="send"]').trigger('click');
        });

        function search(option = null) {
            //Obtain the key search parameter stored in the cookie.
            if(option == 'redirected-search-box'){
                var data = {};
                data['keyword'] = getCookie('keyword');

                searchAjax(data);
                //Deleting the cookie to prevent this search result from constantly appearing as soon as the user enters the search page.
                eraseCookie('keyword');
            } else if(option == 'redirected-genre-click'){
                var data = {};
                var genreArray = [];
                genreArray.push(getCookie('genre'));

                if(genreArray.length != 0) {
                    data['genre'] = genreArray;
                }

                searchAjax(data);
                //Deleting the cookie to prevent this search result from constantly appearing as soon as the user enters the search page.
                eraseCookie('genre');
            } else {
                $('.search-button input[type="submit"][name="send"]').off('click');
                $('.search-button input[type="submit"][name="send"]').on('click', function (event) {
                    event.stopPropagation();

                    var data = {};
                    var genreArray = [];
                    var excludeGenreArray = [];

                    if($('input[name="genre"]:checked').length > 0) {
                        $('input[name="genre"]:checked').each(function () {
                            genreArray.push($(this).val());
                        });
                    }
                    if($('input[name="excludeGenre"]:checked').length > 0) {
                        $('input[name="excludeGenre"]:checked').each(function () {
                            excludeGenreArray.push($(this).val());
                        });
                    }
                    if(genreArray.length != 0 && excludeGenreArray.length != 0) {
                        data['genre'] = genreArray;
                        data['excludeGenre'] = excludeGenreArray;
                    } else if (genreArray.length != 0) {
                        data['genre'] = genreArray;
                    } else if(excludeGenreArray.length != 0) {
                        data['excludeGenre'] = excludeGenreArray;
                    }
                    data['keyword'] = $('.keyword-container input[name="keyword"]').val();
                    data['number'] = $('.total-chapters-container input[type="radio"][name="chapterCount"]:checked').val();

                    searchAjax(data);
                });
            }
        }

        //Execute when the ajaxes finish. Modifies the container box to allow the expand and collapse arrows to uniquely work on their specific container.
        $(document).ajaxStop(function () {
            $('.size-buttons').each(function (index, object) {
                //Skip the hidden template for the search containers.
                if(index != 0){
                    //When clicked on the down arrow button, the description container is shown, the down arrow is hidden, and a new
                    //up arrow is shown to hide the description. The search container's height also changes according to the description length.
                    //The other search containers move down to accommodate for the increase in height of the current search container.
                    $(object).find('.collapse-button').off('click');
                    $(object).find('.collapse-button').on('click', function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        $("#"+$(object).find('.expand-button').attr('id')).css( 'display', "block");
                        $("#"+$(object).find('.collapse-button').attr('id')).css('display', "none");
                        $(object).find('.book-blurb-container').css( 'display', "none");
                        $(object).closest('.height').css({"height":""});
                        $(object).closest('.result-container').removeClass('height');
                    });

                    $(object).find('.expand-button').off('click');
                    $(object).find('.expand-button').on('click', function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        $("#"+$(object).find('.expand-button').attr('id')).css( "display", "none");
                        $("#"+$(object).find('.collapse-button').attr('id')).css("display", "block");
                        $(object).find('.book-blurb-container').css("display", "block");
                        if(($(object).find('.book-blurb-container').actual('height') + $(object).siblings('.book-page-btn').find('.book-title-result-container').actual('height') + $(object).prev('.book-genre-container').actual('height') + 125) > $(object).closest('.result-container').actual('height')) {
                            $(object).closest('.result-container').addClass('height');
                            $(object).closest('.height').css('height',($(object).find('.book-blurb-container').actual('height') + $(object).siblings('.book-page-btn').find('.book-title-result-container').actual('height') + $(object).prev('.book-genre-container').actual('height') + 125));
                        }
                    });
                }
            });

            $('.book-genre-container a.genre').off('click');
            $('.book-genre-container a.genre').on('click', function () {
                var data = {};
                var genreArray = [];

                genreArray.push($(this).attr('value'));

                if(genreArray.length != 0) {
                    data['genre'] = genreArray;
                }

                searchAjax(data);
            });
        });

        function eraseCookie(name) {
            document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('home.module.template-pages', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\alina\relifeworld\resources\views/search/search.blade.php ENDPATH**/ ?>