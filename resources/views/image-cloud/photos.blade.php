<html>
<head>
    <title>Image Cloud</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="_token" content="{!! csrf_token() !!}"/>
    <meta name="referrer" content="no-referrer" />

    <script src="{{ asset('relife/js/jquery-3.4.1.min.js') }}"></script>
    <script src="{{ asset('relife/js/bootstrap.min.js') }}"></script>

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
    <link rel="stylesheet" href="{{ asset('relife/css/bootstrap.min.css') }}">
    <link rel="stylesheet" type="text/css" href="imageCloud.css">
</head>
<body>
    <div class="frame">
        <div class="navigation-container">
            <button class="btn navigation-btn"><a id="downloadBtn">Download</a></button>
            <button class="btn navigation-home-btn"><a href="{{ route('image.photos') }}" id="homeBtn">Home</a></button>
            @if(\Illuminate\Support\Facades\Auth::check())
                <button class="btn navigation-photos-btn"><a id="photosBtn" href="/image/cloud">My Photos</a></button>
            @else
                <button class="btn navigation-photos-btn"><a id="photosBtn" data-toggle="modal" data-target="#loginPopUp" data-dismiss="modal">My Photos</a></button>
            @endif
        </div>
        <div class="photos-container">
            <div class="photo-template">
                <a data-toggle="modal" data-target="#photoPopUp" data-dismiss="modal">
                    <img id="example1" src="{{ asset('relife/img/default-cover.jpg') }}">
                </a>
            </div>
            <div class="photo-template">
                <img id="example2" src="{{ asset('relife/img/default-cover.jpg') }}">
            </div>
        </div>
        <div class="modal fade" id="loginPopUp" tabindex="-1" role="dialog" aria-labelledby="popup_login_input_title" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true"><i class="fas fa-times"></i></span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="login-container">
                            <div class="username">
                                <span>Email: </span>
                                <input type="text" name="email" placeholder="example@cloud.com">
                            </div>
                            <div class="login-password">
                                <span>Password: </span>
                                <input type="password" name="password">
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="registration-container" hidden>
                            <div class="email">
                                <span>Email: </span>
                                <input type="text" name="registeredEmail" placeholder="example@relife.com">
                            </div>
                            <div class="first-name">
                                <span>First name: </span>
                                <input type="text" name="firstName" placeholder="Enter your first name">
                            </div>
                            <div class="phone-number">
                                <span>Surname: </span>
                                <input type="number" name="phoneNumber" placeholder="Enter your phone number...">
                            </div>
                            <div class="password">
                                <span>Password: </span>
                                <input type="password" name="firstPassword">
                            </div>
                            <div class="confirm-password">
                                <span>Confirm password: </span>
                                <input type="password" name="confirmPassword">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="login-buttons-container">
                            <button><a class="register-section-button">Become a member!</a></button>
                            <input id="login" type="submit" name="send" class="send action-button" value="Login" />
                        </div>
                        <div class="register-buttons-container" hidden>
                            <button><a class="login-section-button">Back to login</a></button>
                            <input id="register" type="submit" name="send" class="send action-button" value="Register" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        $(document).ready(function () {
            $('.photo-template a').off('click');
            $('.photo-template a').on('click', function() {
                console.log('hi');
                console.log($(this).find('img').parent().html());
                $('.modal-body').html($(this).find('img').parent().html());
            });

            $('.register-section-button').off('click');
            $('.register-section-button').on('click', function () {
                $('.register-buttons-container').show();
                $('.registration-container').show();
                $('.login-container').hide();
                $('.login-buttons-container').hide();
            });

            $('.login-section-button').off('click');
            $('.login-section-button').on('click', function () {
                $('.login-container').show();
                $('.login-buttons-container').show();
                $('.register-buttons-container').hide();
                $('.registration-container').hide();
            });
        });
    </script>
    <style>
        @import url(https://fonts.googleapis.com/css?family=Open+Sans:700,300);
        .frame {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 2px;
            box-shadow: 4px 8px 16px 0 rgba(0, 0, 0, 0.1);
            background: linear-gradient(to top right, #722F37 0%, hotpink 100%);
            color: #333;
            font-family: "Open Sans", Helvetica, sans-serif;
        }
        .btn {
            display: block;
            width: 30%;
            height: 45px;
            background: #722F37;
            color: #fff;
            border-radius: 3px;
            border: 0;
            box-shadow: 0 3px 0 0 hotpink;
            transition: all 0.3s ease-in-out;
            font-size: 14px;
        }
        .btn:hover {
            background: rebeccapurple;
            box-shadow: 0 3px 0 0 deeppink;
        }
        .navigation-btn {
            display: inline-block;
            margin-left: 3%;
            margin-top: 2%;
        }
        .navigation-photos-btn {
            display: inline-block;
            margin-right: 3%;
            margin-top: 2%;
            float: right;
        }
        .navigation-home-btn {
            display: inline-block;
            margin-left: 1.5%;
            margin-top: 2%;
        }
        .navigation-container a {
            text-decoration: none;
            color: white;
        }
        .photo-template {
            display: inline-block;
            margin-left: 3%;
            margin-top: 3%;
            margin-bottom: 3%;
            margin-right: 4%;
            border: 5px gold solid;
            padding: 0.1%;
            border-radius: 7%;
        }
        .photo-template img {
            width: 100px;
        }
        .photos-container {
            display: block;
            width: 80%;
            margin: 0 auto;
            margin-top: 3%;
            border: 10px #77dd77 solid;
            border-radius: 10%;
        }
        .photo-template a {
            cursor: pointer;
        }
        .modal-body img {
            width: 55%;
            height: 400px;
            margin-left: 20%;
        }
        .modal-header {
            padding: 20px;
        }
        .navigation-container a {
            text-decoration: none;
            color: white;
        }
        .login-buttons-container button, .login-buttons-container input, .register-buttons-container button, .register-buttons-container input {
            background: lightcyan;
            margin-right: 7%;
            border-radius: 10%;
        }
        .login-buttons-container button:hover, .login-buttons-container input:hover, .register-buttons-container button:hover, .register-buttons-container input:hover {
            background: lightyellow;
        }
        .login-container div, .registration-container div {
            margin-top: 2%;
        }
    </style>
</body>
</html>