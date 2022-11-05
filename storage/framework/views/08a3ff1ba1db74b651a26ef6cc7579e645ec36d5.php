
<?php $__env->startSection('content'); ?>
    <div>
        <?php if(isset($doesUserHaveNovels)): ?>
            You don't have any written existing novels. Redirecting...
            <script>
                window.location.href = '/write/new';
            </script>
        <?php else: ?>
            <div class="novel-container">
                <div class="novel-title-container-writing">
                    <span>Book Title</span>
                </div>
                <div class="novel-title-container">
                    <input name="novelTitle" type="text" required>
                </div>
                <div class="genre-container-writing">
                    <span>Genre</span>
                </div>
                <div class="genre-container-writing-answer">
                    <select required>
                        <option disabled selected>Please select a genre</option>
                        <?php $__currentLoopData = $genres; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $genre): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <option value="<?php echo e($genre->id); ?>"><?php echo e($genre->name); ?></option>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </select>
                </div>
                <div class="novel-blurb-container-writing">
                    <span>Blurb</span>
                </div>
                <div class="novel-blurb-container">
                    <textarea name="novelBlurb" rows="10" cols="80" required></textarea>
                </div>
                <div class="chapter-title-container-writing">
                    <span>Chapter Title</span>
                </div>
                <div class="chapter-title-container-writing-page">
                    <input name="chapterTitle" type="text" required>
                </div>
                <div class="novel-cover-container-writing">
                    <span>Cover Photo (Optional)</span>
                </div>
                <div class="novel-cover-container">
                   <input name="coverPhotoFile" type="file" accept="image/x-png,image/gif,image/jpeg">
                </div>
                <div class="novel-description-container-writing">
                    <span>Description</span>
                </div>
                <div class="novel-description-container">
                    <textarea id="novelDescriptionArea" name="novelDescription" rows="15" cols="80" required></textarea>
                </div>
                <div class="writing-submit-button">
                    <input name="send" class="send action-button" type="submit" value="Post">
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
                        formData.append('novelTitle', $('[name="novelTitle"]').val());
                        formData.append('novelBlurb', $('[name="novelBlurb"]').val());
                        formData.append('genre', $('.genre-container-writing-answer select option').filter(':selected').val());
                        formData.append('chapterTitle', $('[name="chapterTitle"]').val());
                        if ($('[name="coverPhotoFile"]').get(0).files.length != 0) {
                            formData.append('cover', $('[name="coverPhotoFile"]').prop('files')[0]);
                        }
                        formData.append('writingType', 'new');

                        /*
                        {
                                'novelDescription': novelDescription.getData(),
                                'novelTitle':$('[name="novelTitle"]').val(),
                                'novelBlurb':$('[name="novelBlurb"]').val(),
                                'genre':$('.genre-container-writing-answer').val(),
                                'chapterTitle':$('[name="chapterTitle"]').val(),
                                'cover':$('[name="coverPhotoFile"]').prop('files'),
                            }
                         */

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
                        console.log(novelDescription.getData());
                    });
                });
            </script>
        <?php endif; ?>
    </div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('home.module.template-pages', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\alina\relifeworld\resources\views/write/write.blade.php ENDPATH**/ ?>