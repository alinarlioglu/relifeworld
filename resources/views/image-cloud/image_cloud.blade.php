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
            <button class="btn navigation-home-btn" ><a href="/image/cloud" id="homeBtn">Home</a></button>
            @if(\Illuminate\Support\Facades\Auth::check())
                <button class="btn navigation-photos-btn"><a id="photosBtn" href="/image/cloud">My Photos</a></button>
            @else
                <button class="btn navigation-photos-btn"><a id="photosBtn" data-toggle="modal" data-target="#loginPopUp" data-dismiss="modal">My Photos</a></button>
            @endif
        </div>
        <div class="center">
            <div class="title">
                <h1>Drop file to upload</h1>
            </div>
            <div class="dropzone">
                <img src="http://100dayscss.com/codepen/upload.svg" class="upload-icon" />
                <input type="file" class="upload-input" />
            </div>
            @if(\Illuminate\Support\Facades\Auth::check())
                <button type="button" class="btn" name="uploadbutton"><a data-toggle="modal" data-target="#loginPopUp" data-dismiss="modal">Upload file</a></button>
            @else
                <button type="button" class="btn" name="uploadbutton">Upload file</button>
            @endif
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
        .register-section-button {
             cursor: pointer;
        }
        .center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50%;
            height: 400px;
            border-radius: 3px;
            box-shadow: 8px 10px 15px 0 rgba(0, 0, 0, 0.2);
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            flex-direction: column;
        }
        .title {
            width: 100%;
            height: 50px;
            border-bottom: 1px solid #999;
            text-align: center;
        }
        h1 {
            font-size: 16px;
            font-weight: 300;
            color: #666;
        }
        .dropzone {
            width: 50%;
            height: 40%;
            border: 1px dashed #999;
            border-radius: 3px;
            text-align: center;
        }
        .upload-icon {
            margin: 20%;
        }
        .upload-input {
            position: relative;
            top: -62px;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
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