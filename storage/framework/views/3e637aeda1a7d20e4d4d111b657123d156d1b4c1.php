<!doctype html>
<html lang="<?php echo e(config('app.locale')); ?>">
<head>
    <?php echo $__env->make('home.module.head', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <?php echo $__env->yieldContent('head'); ?>

    <?php echo $__env->make('home.module.js', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    <?php echo $__env->make('home.module.css', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    <?php echo $__env->yieldContent('css'); ?>
</head>
<body>
    <div class="outer-template-div">
    <?php //\Illuminate\Support\Facades\App::setLocale(\Illuminate\Support\Facades\Session::get('applocale')); ?>
    <?php echo $__env->make('home.module.nav-header', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    <script>
        <?php if((\Illuminate\Support\Facades\Auth::guard('members')->check())): ?>
            $("#loginButton").html("Hello " + '<?php echo e(\Illuminate\Support\Facades\Session::get('memberData')->nickname); ?>' + ", Logout");
            $("#loginButton").attr('onClick', 'logout()');

            function logout() {
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });

                $.ajax({
                    url: '<?php echo e(route('member.logout')); ?>',
                    method: 'POST',
                    success: function (resp) {
                        window.location.href = window.location.pathname;
                    }
                });
            }
        <?php endif; ?>

        function setCookie(name,value,days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        }

        function getCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }

        $(document).ready(function () {
            redirectToSearchWithData();
        });

        function redirectToSearchWithData()  {
            $('.navigation-menu-search i').off('click');
            $('.navigation-menu-search i').on('click', function() {
                setCookie('keyword', $('.navigation-menu-search input[name="keyword"]').val(), 1);
                location.href = '/search';
            });
        }
    </script>

    <?php echo $__env->yieldContent('content'); ?>
    <?php echo $__env->yieldContent('js'); ?>


    </div>
</body>
</html>
<?php /**PATH C:\Users\alina\relifeworld\resources\views/home/module/template-pages.blade.php ENDPATH**/ ?>