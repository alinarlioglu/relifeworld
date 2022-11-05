
<?php $__env->startSection('content'); ?>
    <div class="author-books-container">
        <?php if($doesUserHaveNovels != null): ?>
            <?php $__currentLoopData = $doesUserHaveNovels; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $novel): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="book-container">
                    <a href="<?php echo e(route('books.write.existing.page', ['id' => $novel->book_id])); ?>">
                        <div class="cover-container-novels">
                            <img src="<?php echo e($novel->cover); ?>" class="cover-image">
                            <div class="overlay-image">
                                <span><?php echo e($novel->bookTitle); ?></span>
                        </div>
                        </div>
                        <div class="book-title-container-novels">
                            <h3><?php echo e($novel->bookTitle); ?></h3>
                        </div>
                    </a>
                </div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        <?php else: ?>
            You don't have any written existing novels. Redirecting...
            <script>
                window.location.href = '/write/new';
            </script>
        <?php endif; ?>
    </div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('home.module.template-pages', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\alina\relifeworld\resources\views/write/write_options.blade.php ENDPATH**/ ?>