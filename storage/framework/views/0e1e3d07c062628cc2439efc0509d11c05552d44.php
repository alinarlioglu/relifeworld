<?php $__env->startSection('content'); ?>
<div class="forum-post">
    <div class="forum-post-title">
        <?php if($topic != null): ?>
            <h2><?php echo e($topic->title); ?></h2>
        <?php else: ?>
            <h2>Default RelifeWorld title</h2>
        <?php endif; ?>
    </div>
    <div class="forum-post-container">
        <div style="display:none;" class="forum-post-comment-template">
            <div class="forum-post-author">
                <div class="forum-post-author-profile">
                    <a class="profile-photo"><img src="<?php echo e(asset('relife/img/default-profile-image.jpg')); ?>"></img></a>
                    <a class="forum-post-author-name">TestUser</a>
                    <i style="display:none;" class="fa-solid fa-star"></i>
                    <div class="profile-details">
                        <div class="profile-information">
                            <dt>Posts:</dt><dd>5</dd>
                            <dt class="joined-date">Joined:</dt><dd>17 May 2020</dd>
                        </div>
                        <div class="profile-contact">
                            <span>Contact:</span>
                            <ul>
                                <i class="fa-solid fa-envelope"></i>
                                <a href="#">Send private message</a>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <article class="forum-post-body">
                <div class="forum-post-contents">
                    <p>blah blah</p>
                </div>
                <div class="post_date">

                </div>
            </article>
        </div>
    </div>
    <div class="pagination" hidden>
        <div class="page-number-container" page-number=1></div>
    </div>
</div>
<script>
    $(document).ready(function (){
        //Retrieving the posts from the database.
        fetchPosts();
    });

    function fetchPosts(nextPageNumberWhenClickOnPagination = null){
        //Initialising the variable to obtain the page number.
        pageNumber = null;
        //If a page number has been sent as a variable, then we obtain the page number from there. Otherwise, if a page number wasn't sent, then
        //we use the default page number, 1, obtained from the fixed value that I declared in the HTML.
        if(nextPageNumberWhenClickOnPagination != null) {
            //nextPageNumberWhenClickOnPagination is a string, so page number data can be sent as a new page is loaded. I believe sending an int doesn't work.
            pageNumber = parseInt(nextPageNumberWhenClickOnPagination);
        } else {
            //Obtaining the current page.
            pageNumber = parseInt($('.pagination .page-number-container').attr('page-number'));
        }
        //Sending an ajax to the backend to obtain the specified page of posts.
        $.ajax({
            //Passing the page number variable manually through the URL as the variable is in JS, so using Laravel's 'route' function
            //requires the variable to be in PHP, therefore I'd have to transfer the variable from JS to PHP via a JSON object which means more memory consumed and a slower loading time.
            url:"/forum/post/" + <?php echo e((($topicId != null) ? $topicId : '1')); ?> + '?page=' + pageNumber,
            method:'GET',
            success: function(resp){
                if('data' in resp) {
                    //Populating the fields for each post.
                    //AJAX guide
                    if('posts' in resp.data) {console.log(resp.data.posts);
                        (resp.data.posts.data).forEach(function(post) {console.log(post);
                            //1. Clone the template and then, change the template class to a different class.
                            var displayPost = $('.forum-post-comment-template').clone();
                            displayPost.attr('class', 'forum-post-comment');

                            if('nickname' in post.poster) {
                                //The function 'find' under 'displayPost' checks all the elements within the cloned DIV with class 'forum-post-comment-template'.
                                //Checks for an element within the DIV with the class 'forum-post-author-name'.
                                displayPost.find('.forum-post-author-name').html(post.poster.nickname);
                                if('user_id' in post) {
                                    displayPost.find('.forum-post-author-name').attr('href', '/member/'+post.user_id);
                                }
                            }

                            if('created_at' in post.poster) {
                                var userJoinedAt = new Date(post.poster.created_at);
                                displayPost.find('.profile-information .joined-date').html('Joined:' + userJoinedAt.toLocaleString('en-uk',{day: 'numeric', month: 'short', year: 'numeric'}));
                            }

                            if('contents' in post) {
                                displayPost.find('.forum-post-contents').html('<p>' + post.contents + '</p>');
                            }

                            if('created_at' in post) {
                                var postCreatedAt = new Date(post.created_at);
                                displayPost.find('.post_date').html('<p>'+ postCreatedAt.toLocaleString('en-uk',{day: 'numeric', month: 'short', year: 'numeric'}) +'</p>');
                            }

                            if('is_admin' in post.poster && post.poster.is_admin == 1) {
                                displayPost.find('.forum-post-author-profile i').css({"display":"inline-block"});
                            }
                            displayPost.css({"display":"block"});
                            $('.forum-post-container').append(displayPost);
                        });
                    }

                    //Creating the logic for the pagination.
                    var lastPage = resp.data.posts.last_page;
                    //Removing the grey background from the previous page the user was on.
                    $('.page-number-container a').removeClass("inactive-link");
                    if(pageNumber == 1 && pageNumber < lastPage) {
                        //Create the pagination for the first page.
                        //Making it have a 'one' class, so it can be accessed. Also added an onclick event to allow pagination for rest of the pages
                        //generated, so the user can access to other pages full of posts for the topic.
                        $('.page-number-container').append('<a class="1" onclick="fetchPosts(1)">' + (1) + '</a>');
                        //Generating the pagination for the rest of the pages, which are page numbers over 1.
                        for(let i=pageNumber; i<lastPage;i++){
                            //Declaring separate variables to get the page number to display and the next page instead of doing 'nextPage = i + 1'
                            //or just using variable 'i' in the JS since the variable 'i' is the condition of the loop which allows the loop to go forward via 'i++'
                            //and by doing calculations with 'i', the separate variables will become messed up everytime the loop moves forward because of 'i++'.
                            //Therefore, the calculations for the page numbers will become messed up and not in chronological order.
                            //Consequently, it's best to use separate variables for the calculations like 'pageNumberToDisplay', so the calculations don't
                            //become messed up.
                            var pageNumberToDisplay = i;
                            var nextPage = pageNumberToDisplay + 1;
                            $('.page-number-container').append('<a class="' + nextPage + '" onclick="fetchPosts(' + nextPage + ')">' + nextPage + '</a>');
                        }
                        //Updating the page number attribute, so if the user clicks on a page from the pagination, then the page number is fetched from the attribute.
                        //Initially, when the user first enters the page, the attribute has a default of '1', so that's used to create the pagination. This is why the attribute is needed.
                        $('.page-number-container a').on("click", function() {
                            var nextPageFixed = $(this).attr('class');
                            $('.page-number-container').attr('page-number', (nextPageFixed));
                        });

                    } else if(pageNumber > 1 && pageNumber < lastPage) {
                        //Two loops needed - pagination for pages over the current page until the last page & pages less than current page until the first page.
                        for(let i=pageNumber; i<lastPage; i++) {
                            var pageNumberToDisplay = i;
                            var nextPage = pageNumberToDisplay+1;
                            $('.page-number-container').append('<a class="'+ nextPage +'" href="fetchPosts(' + (nextPage) +')">' + (nextPage) + '</a>');
                        }
                        for(let i=currentPage; i>1; i--) {
                            var pageNumberToDisplay = i;
                            var nextPage = pageNumberToDisplay-1;
                            $('.page-number-container').append('<a class="'+ nextPage +'" href="fetchPosts(' + (nextPage) +')">' + (nextPage) + '</a>');
                        }
                        $('.page-number-container a').on("click", function() {
                            var nextPageFixed = $(this).attr('class');
                            $('.page-number-container').attr('page-number', (nextPageFixed));
                        });

                    } else if(pageNumber == lastPage) {
                        $('.page-number-container').attr('page-number', (lastPage));
                    }
                    //Making the current page 'active' with a grey background, so user knows which page they're at.
                    $('.page-number-container .' + pageNumber).addClass("inactive-link");
                }
            },
        });
    }

</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('home.module.template-pages', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\alina\relifeworld\resources\views/forum/announcement/post.blade.php ENDPATH**/ ?>