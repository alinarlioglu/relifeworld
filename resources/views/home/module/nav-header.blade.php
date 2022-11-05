<header id="header">
    @include('home.components.login')
    <div class="container">
        <div class="top-navigation-menu">
            <ul class="navigation-menu-right">
                <li>
                    <a href="{{ route('relife.home') }}" class="logo"><img src="{{ asset('relife/img/relife-logo.png') }}" alt="Logo"></a>
                </li>
                <li>
                    <div id="login-btn">
                        @if(!(\Illuminate\Support\Facades\Auth::guard('members')->check()))
                            <a id="loginButton" href="#" data-toggle="modal" data-target="#loginPopUp" data-dismiss="modal"><strong>Login</strong></a>
                        @else
                            <a id="loginButton" href="#">Hello</a>
                        @endif
                    </div>
                </li>
            </ul>
        </div>
        <div class="container">
            <ul class="main-menu navigation-menu-right">
                <li>
                    <a href="{{ route('books.search') }}">Read</a>
                </li>
                <li>
                    @if(!(\Illuminate\Support\Facades\Auth::guard('members')->check()))
                        <a id="writeButton" href="{{ route('books.write.new') }}">Write</a>
                        <script>
                            $(document).ready(function() {
                                $('#writeButton').removeAttr('href');
                                $('#writeButton').off('click');
                                $('#writeButton').on('click', function () {
                                    $('#loginButton').trigger('click');
                                });
                            });
                        </script>
                    @else
                        <div class="dropdown">
                            <a>Write</a>
                            <div class="dropdown-content">
                                <a href="{{ route('books.write.existing') }}">Existing novels</a>
                                <a href="{{ route('books.write.new') }}">New novel</a>
                            </div>
                        </div>
                    @endif
                </li>
                <li>
                    <a href="{{ route('member.page') }}">Member List</a>
                </li>
                <li>
                    <a href="{{ route('books.bestrated') }}">Best Rated</a>
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
