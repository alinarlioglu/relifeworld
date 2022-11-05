<header id="header">
    <?php echo $__env->make('home.components.login', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <div class="container">
        <div class="top-navigation-menu">
            <ul class="navigation-menu-right">
                <li>
                    <a href="<?php echo e(route('relife.home')); ?>" class="logo"><img src="<?php echo e(asset('relife/img/relife-logo.png')); ?>" alt="Logo"></a>
                </li>
                <li>
                    <div id="login-btn">
                        <?php if(!(\Illuminate\Support\Facades\Auth::guard('members')->check())): ?>
                            <a id="loginButton" href="#" data-toggle="modal" data-target="#loginPopUp" data-dismiss="modal"><strong>Login</strong></a>
                        <?php else: ?>
                            <a id="loginButton" href="#">Hello</a>
                        <?php endif; ?>
                    </div>
                </li>
            </ul>
        </div>
        <div class="container">
            <ul class="main-menu navigation-menu-right">
                <li>
                    <a href="<?php echo e(route('books.search')); ?>">Read</a>
                </li>
                <li>
                    <?php if(!(\Illuminate\Support\Facades\Auth::guard('members')->check())): ?>
                        <a id="writeButton" href="<?php echo e(route('books.write.new')); ?>">Write</a>
                        <script>
                            $(document).ready(function() {
                                $('#writeButton').removeAttr('href');
                                $('#writeButton').off('click');
                                $('#writeButton').on('click', function () {
                                    $('#loginButton').trigger('click');
                                });
                            });
                        </script>
                    <?php else: ?>
                        <div class="dropdown">
                            <a>Write</a>
                            <div class="dropdown-content">
                                <a href="<?php echo e(route('books.write.existing')); ?>">Existing novels</a>
                                <a href="<?php echo e(route('books.write.new')); ?>">New novel</a>
                            </div>
                        </div>
                    <?php endif; ?>
                </li>
                <li>
                    <a href="<?php echo e(route('member.page')); ?>">Member List</a>
                </li>
                <li>
                    <a href="<?php echo e(route('books.bestrated')); ?>">Best Rated</a>
                </li>
                <li class="search navigation-menu-search">
                    <input type="text" class="keyword" name="keyword" placeholder="Search">
                    <i class="fas fa-search keyword_search_icon"></i>
                </li>
            </ul>
        </div>
        <div class="clear"></div>
    </div>
</header>
<?php /**PATH C:\Users\alina\relifeworld\resources\views/home/module/nav-header.blade.php ENDPATH**/ ?>