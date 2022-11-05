<?php $__env->startSection('content'); ?>
    <div class="book-container">
        <div class="chapter-view-title-container">
            <div class="chapter-cover-container">
                <img src="<?php echo e(!is_null($book->cover) ? $book->cover : 'http://i.imgur.com/sJ3CT4V.gif'); ?>" alt="Cover"/>
            </div>
            <div class="book-title">
                <h5><a id="bookTitle" type="button" href="<?php echo e(route('books.page', ['id' => $chapter->book_id])); ?>"><?php echo e($book->title); ?></a> by <a><?php echo e($author->nickname); ?></a></h5>
            </div>
            <div class="chapter-rating-container">
                <a class="rating" data-different="1"><i class="fa fa-star lightgrey" aria-hidden="true"></i></a>
            </div>
            <div class="chapter-view-title">
                <h3><?php echo e($chapter->title); ?></h3>
            </div>
        </div>
        <div class="chapter-description-container">
            <?php
            $book->title = str_replace(' ', '-', $book->title);
            $book->title = str_replace(':','', $book->title);
            ?>
            <div class="chapter-buttons-container">
                <div class="next-chapter-button">
                    <?php if(isset($previousChapter->id)): ?>
                        <button><a href="<?php echo e(route('books.chapter',[ 'name' => $book->title, 'chapterId' => $previousChapter->id])); ?>">Previous Chapter</a></button>
                    <?php endif; ?>
                </div>
                <div class="previous-chapter-button">
                    <?php if(isset($nextChapter->id)): ?>
                        <button><a href="<?php echo e(route('books.chapter',[ 'name' => $book->title, 'chapterId' => $nextChapter->id])); ?>">Next Chapter</a></button>
                    <?php endif; ?>
                </div>
            </div>
            <div class="read-chapter-container">
                <p><?php echo e($chapter->description); ?></p>
            </div>
        </div>
        <div class="post-comment-container">
            <div class="post-comment-description-container">
                <textarea rows="15" cols="50" name="commentContents" placeholder="Please type your comment here..."></textarea>
            </div>
            <input value="<?php echo e($chapterId); ?>" id="chapterId" hidden></input>
            <input id="commentBtn" type="submit" name="postComment" class="send action-button review-button">
        </div>
    </div>
    <div class="comment-container">
        <div class="individual-comment-container-template" style="display:none;">
            <div class="commenter-details-container">
                <h4 class="nickname-container">UserNameGoesHere</h4>
                <h5 class="date-posted-comment">10 days ago</h5>
            </div>
            <p class="comment-contents-container">Test comment. Testing, testing, and testing.</p>
        </div>
        <div class="pagination" hidden>
            <div class="page-number-container" page-number=1></div>
        </div>
    </div>
    <script src="https://cdn.ckeditor.com/ckeditor5/12.3.1/classic/ckeditor.js"></script>
    <script>
        //Variable to store the review's contents, so it can be sent in an AJAX to the back-end.
        var commentContents = null;
        //Library that allow's text formatting in a textarea.
        ClassicEditor.create(document.querySelector('textarea[name="commentContents"]'))
            .then(editor => {
                commentContents = editor;
            });

        //When everything on the page has loaded into the browser, execute this code.
        $(document).ready(function (){
            $('.post-comment-description-container .ck-editor').css({"width":"60%","margin":"0 auto","margin-top":"10%","margin-bottom":"1.5%"});
            postComment();
            displayComments();
        });

        function timeDifference(current, previous) {
            var msPerMinute = 60 * 1000;
            var msPerHour = msPerMinute * 60;
            var msPerDay = msPerHour * 24;
            var msPerMonth = msPerDay * 30;
            var msPerYear = msPerDay * 365;

            var elapsed = current - previous;

            if (elapsed < msPerMinute) {
                 return Math.round(elapsed/1000) + ' seconds ago';
            }
            else if (elapsed < msPerHour) {
                 return Math.round(elapsed/msPerMinute) + ' minutes ago';
            }
            else if (elapsed < msPerDay ) {
                 return Math.round(elapsed/msPerHour ) + ' hours ago';
            }
            else if (elapsed < msPerMonth) {
                if(Math.round(elapsed/msPerDay) == 1) {
                    return 'approximately ' + Math.round(elapsed/msPerDay) + ' day ago';
                } else if(Math.round(elapsed/msPerDay) > 1) {
                    return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';
                }
            }
            else if (elapsed < msPerYear) {
                return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';
            }
            else {
                return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';
            }
        }

        function postComment(){
            //Need to click 'off' to prevent the ajax causing the page to take forever to load the HTML and JS code.
            $('input[name="postComment"]').off('click')
            $('input[name="postComment"]').on('click', function (){
                //If a 'member' guard isn't logged in, then the registration pop-up will be displayed by triggering the login button.
                <?php if(!(\Illuminate\Support\Facades\Auth::guard('members')->check())): ?>
                    $('#loginButton').trigger('click');
                //Otherwise, the comment will be posted as the member will be assumed to be logged in.
                <?php else: ?>
                    //Imitating a form submission to the back-end without the actual HTML.
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });

                    $.ajax({
                        url: "<?php echo e(route('books.post.comment')); ?>",
                        method: 'POST',
                        data: {
                            'commentContents':commentContents.getData(),
                            'chapterId':$('#chapterId').val()
                        },
                        success: function(resp){
                            if('status' in resp && resp.status == true){
                                //Reload the current page according to what's in the URL.
                                window.location.href = window.location.pathname;
                            } else {
                                console.log("There was a problem with posting your comment.");
                            }
                        }
                    });
                <?php endif; ?>
            })
        }

        function displayComments(nextPageNumberWhenClickOnPagination = null){
            var pageNumber = null;
            if(nextPageNumberWhenClickOnPagination != null){
                pageNumber = parseInt(nextPageNumberWhenClickOnPagination);
            } else {
                pageNumber = $('.page-number-container').attr('page-number');
            }
            $.ajax({
                //Manually writing the URL as I need to pass the page number to the back-end, but the variable is in JS and I don't want to
                //transfer the variable to PHP by creating a JSON object.
                url:"/comments/"+ $('#chapterId').val() +"?page=" + pageNumber,
                method:'GET',
                success: function(resp){
                    if('status' in resp && resp.status == true){
                        if('data' in resp && 'comments' in resp.data) {
                            console.log(resp.data.comments);
                            //Removing all the previous pages comments if they exist.
                            $('.comment-container').find('.individual-comment-container').remove();
                            (resp.data.comments.data).forEach(function (comment) {
                                var displayComment = $(".individual-comment-container-template").clone();
                                displayComment.attr('class', 'individual-comment-container');

                                if('contents' in comment) {
                                    displayComment.find('.comment-contents-container').html(comment.contents);
                                }
                                if('nickname' in comment) {
                                    displayComment.find('.commenter-details-container .nickname-container').html(comment.nickname);
                                }
                                if('created_at' in comment) {
                                    displayComment.find('.commenter-details-container .date-posted-comment').html(timeDifference(new Date(), new Date(comment.created_at)));
                                }
                                displayComment.css({'display':'block'});
                                $('.comment-container').prepend(displayComment);
                            });

                            var currentPage = parseInt($('.page-number-container').attr('page-number'));
                            var lastPage = resp.data.comments.last_page;
                            //Removing all the built up grey background pagination from clicking on the other pages.
                            $('.page-number-container').find('a').removeClass("inactive-link");
                            //Logic for creating the pagination.
                            if(currentPage == 1 && currentPage < lastPage) {
                                //First page's pagination and making it become 'active'.
                                $('.page-number-container').append('<a class="one" onclick="displayComments(1)">' + (1) + '</a>');
                                //If the current page is the first, then we make the grey colour become active.
                                //NOT CURRENTLY WORKING - THERE MAY BE A PROBLEM WITH THE CSS.
                                if(pageNumber == currentPage) {
                                    $('.page-number-container .one').addClass("inactive-link");
                                }
                                //Rest of the page's pagination.
                                for(let i=currentPage; i<lastPage; i++) {
                                    var pageNumberToDisplay = i;
                                    var nextPage = pageNumberToDisplay+1;
                                    $('.page-number-container').append('<a class="'+ nextPage +'" onclick="displayComments(' + (nextPage) +')">' + (nextPage) + '</a>');
                                }
                                //Updating the page number attribute, so if the user clicks on a page from the pagination, then the page number is fetched from the attribute.
                                //Initially, when the user first enters the page, the attribute has a default of '1', so that's used to create the pagination. This is why the attribute is needed.
                                var nextPageFixed = currentPage + 1;
                                $('.page-number-container').attr('page-number', (nextPageFixed));

                            } else if (currentPage > 1 && currentPage < lastPage) {

                                for(let i=currentPage; i<lastPage; i++) {
                                    var pageNumberToDisplay = i;
                                    var nextPage = pageNumberToDisplay+1;
                                    $('.page-number-container').append('<a class="'+ nextPage +'" href="displayComments(' + (nextPage) +')">' + (nextPage) + '</a>');
                                }
                                for(let i=currentPage; i>1; i--) {
                                    var pageNumberToDisplay = i;
                                    var nextPage = pageNumberToDisplay-1;
                                    $('.page-number-container').append('<a class="'+ nextPage +'" href="displayComments(' + (nextPage) +')">' + (nextPage) + '</a>');
                                }
                                var nextPageFixed = currentPage + 1;
                                $('.page-number-container').attr('page-number', (nextPageFixed));

                            } else if(currentPage == lastPage) {

                               /* for(let i=currentPage; i>1; i--) {
                                    var pageNumberToDisplay = i;
                                    var nextPage = pageNumberToDisplay-1;
                                    $('.page-number-container').append('<a href="displayComments(' + (nextPage) +')">' + (nextPage) + '</a>');
                                }*/
                                $('.page-number-container').attr('page-number', (lastPage));
                            }
                            //Making the current selected page turn into a grey background.
                            $('.page-number-container .'+pageNumber).addClass("inactive-link");
                        }
                    } else if ('status' in resp && resp.status == false) {
                        console.log("There aren't any comments for this chapter.");
                    } else {
                        console.log("There was a problem in the process that fetches the comments.");
                    }
                }
            });
        }
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('home.module.template-pages', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\alina\relifeworld\resources\views/chapter/chapter.blade.php ENDPATH**/ ?>