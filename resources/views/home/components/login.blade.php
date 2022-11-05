@if(!(\Illuminate\Support\Facades\Auth::guard('members')->check()))
    <div class="modal fade" id="loginPopUp" tabindex="-1" role="dialog" aria-labelledby="popup_login_input_title" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                    </button>
                    <h3 class="modal-title" id="popup_login_input_title">Member Login</h3>
                </div>
                <div class="modal-body">
                    <input type="text" name="email" placeholder="example@relife.com">
                    <input type="password" name="password">
                    <span class="login_failed_message" hidden><br><br>Please enter a valid email and password.</span>
                    <div class="clear"></div>
                </div>
                <div class="modal-footer">
                    <input type="button" name="registerPopUp" class="forgot-password-btn" data-toggle="modal" data-target="#registrationPopUp" data-dismiss="modal" value="Register" />
                    <input id="login_submit" type="submit" name="send" class="send action-button" value="Submit" />
                </div>
            </div>
        </div>
    </div>
    @include('home.components.registration')
@endif

<script>
    $('#loginPopUp').hide();
    $('#login_submit').off('click');
    $('#login_submit').on('click', function(event) {
        event.preventDefault();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            url: '{{route('member.login')}}',
            method: 'POST',
            data: {
                'email':$('[name="email"]').val(),
                'password':$('[name="password"]').val()
            },
            success: function(resp){
                console.log("Email: " + $('[name="email"]').val());
                console.log("Password: " + $('[name="password"]').val());
                console.log(resp);
                if(('login' in resp.data)) {  //typeof resp.data.login !== 'undefined'
                    if((resp.data.login == true)) {
                        $("#loginPopUp").modal("hide");
                        if($(".login_failed_message").is(":visible")) {
                            $(".login_failed_message").hide();
                        }
                        location.reload();
                    } else {
                        $(".login_failed_message").show();
                    }
                }

            }
        });
    });
</script>