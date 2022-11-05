
<?php $__env->startSection('content'); ?>
    <div>
        <div class="novel-container">
            <div class="chapter-title-container-writing">
                <span>Chapter Title</span>
            </div>
            <div class="chapter-title-container-writing-page">
                <input name="chapterTitle" type="text" required>
            </div>
            <div class="novel-description-container-writing">
                <span>Description</span>
            </div>
            <div class="novel-description-container">
                <textarea id="novelDescriptionArea" name="novelDescription" rows="15" cols="80" required></textarea>
            </div>
            <div class="writing-submit-button">
                <input name="send" class="send action-button" type="submit" value="Post chapter">
            </div>
        </div>
        <!--LIBRARY FOR RICH TEXT EDITING!-->
        <script src="https://cdn.ckeditor.com/ckeditor5/12.3.1/classic/ckeditor.js"></script>
        <script>
            $(document).ready(function () {
                var novelDescription = null;
                //Library that allow's text formatting in a textarea.
                ClassicEditor.create(document.querySelector('#novelDescriptionArea'))
                    .then(editor => {
                        novelDescription = editor;
                    });

                $('.writing-submit-button input').off('click');
                $('.writing-submit-button input').on('click', function () {
                    var formData = new FormData();
                    formData.append('novelDescription', novelDescription.getData());
                    formData.append('chapterTitle', $('[name="chapterTitle"]').val());
                    formData.append('number', '<?php echo e(($previousChapterNumber->number+1)); ?>');
                    formData.append('bookId', '<?php echo e($id); ?>');
                    formData.append('writingType', 'existingNovel');

                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $.ajax({
                        url: '<?php echo e(route('books.write.novel')); ?>',
                        method: 'POST',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (resp) {
                            if(resp.hasOwnProperty('status') && resp.status == true) {
                                console.log("Successful");
                            } else {
                                console.log("Failed");
                            }
                            window.location.href = '/home';
                        }
                    });
                });
            });
        </script>
    </div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('home.module.template-pages', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\alina\relifeworld\resources\views/write/write_existing_novel.blade.php ENDPATH**/ ?>