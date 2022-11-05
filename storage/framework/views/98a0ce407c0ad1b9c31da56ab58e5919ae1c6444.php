<?php $__env->startSection('content'); ?>
<div class="search-container">
    <?php $__currentLoopData = $bestRatedBooks; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $highlyRatedBook): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="best-rated-container">
            <div class="book-cover-container">

                <img src="<?php echo e(isset($highlyRatedBook->cover) ? $highlyRatedBook->cover : asset('relife/img/default-cover.jpg')); ?>" alt="Cover">
            </div>
            <div class="book-detail-container">
                <a href="<?php echo e(route('books.page', ['id' => $highlyRatedBook->bookId])); ?>" class="book-page-btn">
                    <div class="book-title-result-container">
                        <h3><?php echo e($highlyRatedBook->bookTitle); ?></h3>
                    </div>
                </a>
                <div class="book-genre-container">
                    <a class="genre"><?php echo e($highlyRatedBook->bookGenre); ?></a>
                </div>
                <div class="total-rating-container">
                <?php for($i = 0; $i <= 5; $i++): ?>
                    <?php if((floor($highlyRatedBook->totalRating) - $i) >= 1): ?>
                        <i class="fas fa-star text-warning"> </i>
                    <?php elseif(($highlyRatedBook->totalRating - $i) > 0): ?>
                        <i class="fas fa-star-half-alt text-warning"> </i>
                    <?php else: ?>
                        <i class="far fa-star text-warning"> </i>
                    <?php endif; ?>
                <?php endfor; ?>
                </div>
                <div class="size-buttons">
                    <div class="expand-button">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="collapse-button">
                        <i class="fas fa-chevron-up"></i>
                    </div>
                    <div class="book-blurb-container">
                        <p><?php echo e($highlyRatedBook->blurb); ?></p>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>
<script>
    $(document).ready(function () {
        $('.size-buttons').each(function (index, object) {
            //Skip the hidden template for the search containers.

            //When clicked on the down arrow button, the description container is shown, the down arrow is hidden, and a new
            //up arrow is shown to hide the description. The search container's height also changes according to the description length.
            //The other search containers move down to accommodate for the increase in height of the current search container.
            $(object).find('.collapse-button').off('click');
            $(object).find('.collapse-button').on('click', function (event) {
                $(object).find('.expand-button').css( 'display', "block");
                $(object).find('.collapse-button').css('display', "none");
                $(object).find('.book-blurb-container').css( 'display', "none");
                $(object).closest('.height').css({"height":""});
                $(object).closest('.best-rated-container').removeClass('height');
            });

            $(object).find('.expand-button').off('click');
            $(object).find('.expand-button').on('click', function (event) {
                $(object).find('.expand-button').css( "display", "none");
                $(object).find('.collapse-button').css("display", "block");
                $(object).find('.book-blurb-container').css("display", "block");
                if(($(object).find('.book-blurb-container').actual('height') + $(object).siblings('.book-page-btn').find('.book-title-result-container').actual('height') + $(object).prevUntil('.book-genre-container').actual('height') + 125) > $(object).closest('.best-rated-container').actual('height')) {
                    $(object).closest('.best-rated-container').addClass('height');
                    $(object).closest('.height').css({'height':($(object).find('.book-blurb-container').actual('height') + $(object).siblings('.book-page-btn').find('.book-title-result-container').actual('height') + $(object).prevUntil('.book-genre-container').actual('height') + 125) });
                }
            });
        });
    });
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('home.module.template-pages', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\alina\relifeworld\resources\views/list/best_rated.blade.php ENDPATH**/ ?>