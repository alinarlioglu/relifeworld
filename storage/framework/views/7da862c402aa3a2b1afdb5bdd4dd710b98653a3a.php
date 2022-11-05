<?php $__env->startSection('content'); ?>
<div class="forum-post">
    <div class="forum-post-title">
        <h2>Example forum title</h2>
    </div>
    <div class="forum-post-comment"><!--forum-post-comment-template-->
        <div class="forum-post-author">
            <div class="forum-post-author-profile">
                <a class="profile-photo"><img src="<?php echo e(asset('relife/img/default-profile-image.jpg')); ?>"></img></a>
                <a class="forum-post-author-name">TestUser</a>
                <div class="profile-details">
                    <div class="profile-information">
                        <dt>Posts:</dt><dd>5</dd>
                        <dt>Joined:</dt><dd>17 May 2020</dd>
                    </div>
                    <div class="profile-contact">
                        <span>Contact:</span>
                        <ul>
                            <li>
                                <i class="fa-solid fa-envelope"></i>
                                <a href="#">Send private message</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <article class="forum-post-body">
            <div class="forum-post-contents">
<p>blah blah</p>
            </div>
        </article>
    </div>
</div>
<script>
    $(document).ready(function (){

    });

    function fetchAnnouncement(){
        $.ajax({
            url:''
        });
    }

    function fetchPosts(){
        $.ajax({
            url:'<?php echo e(route('relife.forum.post.fetch')); ?>',
            method:'GET',
            success: function(resp){
                if('data' in resp) {

                }
            },
        });
    }

</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('home.module.template-pages', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\alina\relifeworld\resources\views/forum/announcement/announcement.blade.php ENDPATH**/ ?>