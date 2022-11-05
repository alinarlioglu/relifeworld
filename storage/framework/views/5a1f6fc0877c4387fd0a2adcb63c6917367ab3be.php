<?php $__env->startSection('content'); ?>
    <div class="profile-container">
        <div class="profile-photo-container">
            <img src="<?php echo e(asset('relife/img/defaut-profile.jpeg')); ?>" alt="Profile">
        </div>
        <div class="nickname-container">
            <h3><?php echo e($member->nickname); ?></h3>
        </div>
        <div class="profile-detail-container">
            <div class="join-container">
                <p><strong>Joined:</strong> &nbsp <?php echo e($member->joined); ?></p>
            </div>
            <div class="fictions-detail-container">
                <p><strong>Fictions:</strong> &nbsp <?php echo e($member->fictions); ?></p>
            </div>
            <div class="reviews-detail-container">
                <p><strong>Reviews:</strong> &nbsp <?php echo e($member->reviews); ?></p>
            </div>
        </div>
<?php if($member->fictions != 0): ?>
        <div class="author-fictions-container">
            <div class="author-fictions-title-container">
                <h3><?php echo e($member->nickname); ?>'s Fictions</h3>
            </div>
    <?php $__currentLoopData = $fictions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $fiction): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="best-rated-container">
                    <div class="book-cover-container">
                        <img src="<?php echo e(isset($fiction->cover) ? $fiction->cover : asset('relife/img/default-cover.jpg')); ?>" alt="Cover">
                    </div>
                    <div class="book-detail-container">
                        <a class="book-page-btn" href="<?php echo e(route('books.page', ['id' => $fiction->bookId])); ?>">
                            <div class="book-title-result-container">
                                <h3><?php echo e($fiction->title); ?></h3>
                            </div>
                        </a>
                        <div class="book-genre-container">
                            <a class="genre" genre-id="<?php echo e($fiction->genre_id); ?>"><?php echo e($fiction->name); ?></a>
                        </div>
                        <div class="size-buttons">
                            <div class="expand-button">
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="collapse-button">
                                <i class="fas fa-chevron-up"></i>
                            </div>
                            <div class="book-blurb-container">
                                <p><?php echo e($fiction->blurb); ?></p>
                            </div>
                        </div>
                    </div>
                </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php else: ?>
                <h4 style="width: 95%; margin-left: 2.5%;"><?php echo e($member->nickname); ?> doesn't have any written fictions!</h4>
<?php endif; ?>
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
<?php $__env->stopSection(); ?>

<?php echo $__env->make('home.module.template-pages', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\alina\relifeworld\resources\views/member/profile.blade.php ENDPATH**/ ?>