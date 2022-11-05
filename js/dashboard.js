$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $( document ).ajaxComplete(function( event, xhr, settings ) {
        if (xhr.status === 401 ||xhr.status === 403) {
            $.alert({
                title: 'Error',
                content: xhr.responseJSON.error,
                buttons: {
                    ok: function(){
                        if(xhr.status === 401){
                            location.href = "/ukeas";
                        }
                    }
                }
            });
        }
    });
    $.pjax.defaults.timeout = 30000;
    $.pjax.defaults.maxCacheLength = 0;
    $(document).pjax('a:not(a[target="_blank"])', {
        container: '#pjax-container'
    });

    $(document).on('submit', 'form[pjax-container]', function (event) {
        $.pjax.submit(event, '#pjax-container')
    });

    $(document).on("pjax:popstate", function () {

        $(document).one("pjax:end", function (event) {
            $(event.target).find("script[data-exec-on-popstate]").each(function () {
                $.globalEval(this.text || this.textContent || this.innerHTML || '');
            });
        });
    });

    $(document).on('pjax:send', function (xhr) {
        NProgress.start();
        if (xhr.relatedTarget && xhr.relatedTarget.tagName && xhr.relatedTarget.tagName.toLowerCase() === 'form') {
            $submit_btn = $('form[pjax-container] :submit');
            if ($submit_btn) {
                $submit_btn.button('loading')
            }
        }
    });

    $(document).on('pjax:complete', function (xhr) {
        NProgress.done();
        if (xhr.relatedTarget && xhr.relatedTarget.tagName && xhr.relatedTarget.tagName.toLowerCase() === 'form') {
            $submit_btn = $('form[pjax-container] :submit');
            if ($submit_btn) {
                $submit_btn.button('reset')
            }
        }
        if (window.location.pathname.replace(/[^a-zA-Z ]/g, "").toLowerCase() == 'search') {
            var nav = $('body nav.navbar-primary');
            var span = $('body nav.navbar-primary #accordion.panel-group a.btn-expand-collapse span');
            if (span.hasClass('glyphicon-menu-left')) {
                span.removeClass('glyphicon-menu-left');
            }
            if (!span.hasClass('glyphicon-menu-right')) {
                span.addClass('glyphicon-menu-right');
            }
            if (!nav.hasClass('collapsed')) {
                $('body nav.navbar-primary').addClass('collapsed');
            }
        }
        $('.counsel_img_2').on('click', function(){
            $('.btn-expand-collapse').trigger('click');
            $('#accordion a[data-parent="#accordion"]').addClass('collapsed').attr('aria-expanded','false');
            $('#accordion a[data-parent="#accordion"]').children('.panel-collapse').removeClass('in').attr('aria-expanded','false').css('height','0px');
        });
    });

    $('a[data-parent="#accordion"]').on('click',function(){
        
        var span = $('body nav.navbar-primary #accordion.panel-group a.btn-expand-collapse span');
        
        $('body nav.navbar-primary').removeClass('collapsed');
        if($('body nav.navbar-primary').hasClass('collapsed')){
            span.removeClass('glyphicon-menu-left').addClass('glyphicon-menu-right');
        }else{
            span.removeClass('glyphicon-menu-right').addClass('glyphicon-menu-left');
        }
    });

    $('.counsel_img_2').on('click', function(){
        $('.btn-expand-collapse').trigger('click');
        $('#accordion a[data-parent="#accordion"]').addClass('collapsed');
        $('#accordion a[data-parent="#accordion"]').attr('aria-expanded','false');
        $('#accordion a[data-parent="#accordion"]').children('.panel-collapse').removeClass('in').attr('aria-expanded','false').css('height','0px');
    });

    $('.btn-expand-collapse').click(function(){
        $('.panel').trigger('click');
        $('a').removeClass('collapsed');
        $('#accordion .panel').each(function(){
            $(this).children('a').addClass('collapsed').attr('aria-expanded','false');
            $(this).children('.panel-collapse').removeClass('in').attr('aria-expanded','false').css('height','0px');
        });
    });

    

    $(document).on('submit', 'form[data-pjax]', function (event) {
        $.pjax.submit(event, '#pjax-container')
    })
    // 
    // $(document).pjax('a', '#pjax-container');
    // $(document).on("pjax:timeout", function (event) {
    //     // prevent timeout redirect
    //     event.preventDefault()
    // });
    // //

    window.QueryString = function (url) {
        // This function is anonymous, is executed immediately and 
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = url.substring(url.indexOf('?') + 1, url.length);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    };

    $('body').on('click', '.remove', function(){
        // alert($(this).data('pk'));
        var self = this;
        $.confirm({
            title: 'Do you want to continue?',
            content: "You're going to remove '"+ $(self).data('title') +"'",
            buttons: {
                confirm: function () {
                    $.ajax({
                        method: 'DELETE',
                        url: $(self).data('url')
                    })
                    .success(function(resp){
                        if($(self).closest('tr').length > 0)
                            $(self).closest('tr').hide('fast', function(){ this.remove(); });

                        if($(self).closest('li').length > 0)
                            $(self).closest('li').hide('fast', function(){ this.remove(); });
                    });
                },
                cancel: function () {
                    // $.alert('Canceled!');
                }
            }
        });
    });

    window.initEditable = function($selector) {
        $($selector).editable({
            validate: function(value){
                if($(this).attr('required') !== undefined && $.trim(value) == ''){
                    return 'This field is required.'
                }
            }
        });
    }

    $(function () {
        $('.sidebar').find('.panel a').on('click', function () {
            $(this).parent().parent().find('.panel-heading').removeClass('active');
            $(this).find('.panel-heading').addClass('active');
        });

        $('.sidebar').find('.panel .panel-body li').on('click', function () {
            $('.sidebar').find('li').removeClass('active')
            $(this).addClass('active');
        });

        var path = [location.protocol,'//',location.host, location.pathname].join('');
        if (path) {
            $('a[href="'+path+'"]').parents('div.panel').find('a[data-toggle="collapse"]').trigger('click');
            $('a[href="'+path+'"]').find('li').addClass('active');
        }

    });



    setInterval(check_stu_session, 30000);

    var countdownInterval = null;
    var c_form = $.confirm({
        title: 'Please confirm that you are with a student.',
        btnClass: 'btn-blue',
        lazyOpen: true,
        buttons: {
            EXTEND: function () {
                $.post({ 
                    url: "/ukeas/student/session/extend",
                    success: function(resp) {
                        // resp.data
                        if (resp.status) {
                            END_SESSION_TIME = new Date(resp.data.date);
                            clearInterval(countdownInterval);
                            countdownInterval = null;
                        } else {
                            alert('not found session in server');
                            window.location.href = "/ukeas";
                        }
                    }
                });
            },
            CLOSE: function () {
                $.get({ 
                    url: "/ukeas/student/session/end",
                    success: function(resp) {
                        if(JSON.parse(resp).status) {
                             window.location.href = "/ukeas";
                        } 
                    }
                }).complete(function(resp){
                });
            }
        }
    });    

    function check_stu_session(){
        if (typeof END_SESSION_TIME !== 'undefined' && END_SESSION_TIME) {
            var now = new Date();
            var distance = END_SESSION_TIME - now;
            var _second = 1000;
            var _minute = _second * 60;
            var _hour = _minute * 60;
            var minutes = Math.floor((distance % _hour) / _minute);
            var seconds = Math.floor((distance % _minute) / _second);
            $.get({
                url: "/ukeas/student/session/getSessionTime",
                success: function(resp) {
                    if (resp.status) {
                        END_SESSION_TIME = new Date(resp.data.date);
                        if (END_SESSION_TIME - now > 120000) {
                            if (c_form.isOpen()) {
                                c_form.close();
                                clearInterval(countdownInterval);
                                countdownInterval = null;
                            }
                        } else if (END_SESSION_TIME - now < 0) {
                            $.get({ 
                                url: "/ukeas/student/session/end",
                                success: function(resp) {
                                    if(JSON.parse(resp).status) {
                                         window.location.href = "/ukeas";
                                    } 
                                }
                            });
                        }
                    } else {
                        window.location.href = "/ukeas";
                    }
                }           
            });

            if (distance <= 120000 && distance > 0) {
                if (!countdownInterval) {
                    countdownInterval = setInterval(countdown_session, 1000);
                }

                if (c_form.isClosed()) {
                    c_form.open();
                    c_form.setContent("0" + minutes + ":" + seconds);
                }
            } 
        }
    }

    function countdown_session(){
        var now = new Date();
        var distance = END_SESSION_TIME - now
        if (distance <= 0) {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            $('.jconfirm .jconfirm-content-pane .jconfirm-content').html("00:00");
        } else {
            var _second = 1000;
            var _minute = _second * 60;
            var _hour = _minute * 60;
            var minutes = Math.floor((distance % _hour) / _minute);
            var seconds = Math.floor((distance % _minute) / _second);
            $('.jconfirm .jconfirm-content-pane .jconfirm-content').html( "0" + minutes + ":" + (seconds < 10 ? '0' + seconds : seconds));
        }
    }
    // setTimeout(function(){ 
        // $.ajax({
        //     url: "/student/session/check",
        //     method: 'POST',
        //     cache: false
        // }).success(function(resp) {
        //     var session_expired = resp.status;
        //     if(session_expired == false){
                
        //     }
        // });
    // }, 9000);
});