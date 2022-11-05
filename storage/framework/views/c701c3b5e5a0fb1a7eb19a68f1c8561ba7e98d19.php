<div class="modal fade" id="registrationPopUp" tabindex="-1" role="dialog" aria-labelledby="registration_pop_up_title" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"><i class="fas fa-times"></i></span>
                </button>
                <h3 class="modal-title" id="popup_login_input_title">Register</h3>
            </div>
            <div class="modal-body">
                <span id="popup" data-information="userDetailsForRegistration">
                    <div id="popup_contact_info">
                        <div class="modalBody">
                            <div class="nickname registration-nickname">
                                <span>Nickname: </span>
                                <input type="text" name="nickname" placeholder="Nickname" style="margin-left: 19%;">
                            </div>
                            <div id="email_select" class="registration-email">
                                <span>Email: </span>
                                <input type="text" name="registeredEmail" placeholder="example@relife.com" style="margin-left: 29.3%;">
                            </div>
                            <div id="first_password" class="registration-password">
                                <span>Password: </span>
                                <input type="password" name="firstPassword" style="margin-left: 20%;">
                            </div>
                            <div id="confirm_password" class="registration-confirm-password">
                                <span>Confirm password: </span>
                                <input type="password" name="confirmPassword">
                            </div>
                            <span id="matchingPasswords"></span><span id="passwordLength"></span><span id="userErrorMessage"></span>
                        </div>
                    </div>
                </span>
            </div>
            <div class="modal-footer">
                <input id="submitUserRegistrationDetails" type="submit" name="submitUserRegistrationDetails" class="send action-button" value="Register now" />
            </div>
        </div>
    </div>
</div>
<script>
    //Minimum number of characters neecded for the password.
    var minimumPasswordCharacters = 6;
    //Execute when the document is ready.
    $(document).ready(function(){
        $('input[name="nickname"],input[name="registeredEmail"]').on("keyup",function(){
            checkFormatValidity();
        });
        $('input[name="firstPassword"],input[name="confirmPassword"]').on("keyup",function(){
            checkPasswordMatch();
            checkFormatValidity();
        });
        $('input[name="nickname"],input[name="registeredEmail"],input[name="firstPassword"],input[name="confirmPassword"]').trigger("keyup");
    });
    //Checking that the nickname, email, password, and confirm password fields have data entered.
    //It also checks that the password and confirm password fields are equal to each other in type, length, and characters.
    //Lastly, it checks that the password field has a minimum of 6 characters. It highlights the
    function checkFormatValidity(){
        if($('input[name="nickname"]').val() != '' && $('input[name="registeredEmail"]').val() != '' && $('input[name="firstPassword"]').val() != null && $('input[name="confirmPassword"]').val() != null && $('input[name="firstPassword"]').val() == $('input[name="confirmPassword"]').val() && $('input[name="firstPassword"]').val().length >= minimumPasswordCharacters){
            $("span[data-information='userDetailsForRegistration'] input#submitDetails").css( {"background-color": "#CCCCCC", "pointer-events": "auto"});
        }else{
            $("span[data-array-key='userDetailsForRegistration'] input#submitDetails").css( {"background-color": "#fe9ba3", "pointer-events": "none"});

        }
    }

    function checkPasswordMatch(){
        if($('input[name="firstPassword"]').val().length < minimumPasswordCharacters){
            $('#passwordLength').css("color","red");
            $('#passwordLength').html("The password must be a minimum of 6 characters.");
        }else{
            $('#passwordLength').html("");
        }
        if($('input[name="firstPassword"]').val() != $('input[name="confirmPassword"]').val()) {
            $('input[name="confirmPassword"]').css("border-width","2px");
            $('input[name="confirmPassword"]').css("border-color","red");
            $('#matchingPasswords').css("color","red");
            $('#matchingPasswords').html("Passwords do not match.");
        }else{
            $('input[name="confirmPassword"]').css("border-color","none");
            $('#matchingPasswords').html("");
            $('#matchingPasswords').css("color","black");
        }
    }

    $('#submitUserRegistrationDetails').off('click');
    $('#submitUserRegistrationDetails').on('click', function (event) {
        event.preventDefault();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            url: '<?php echo e(route('member.store')); ?>',
            method: 'POST',
            data: {
                'memberDetails': {
                    'email': $('[name="registeredEmail"]').val(),
                    'nickname': $('[name="nickname"]').val(),
                    'password':$('[name="firstPassword"]').val(),
                    'confirmPassword':$('[name="confirmPassword"]').val()
                }
            },
            success: function(resp) {
                if('status' in resp) {
                    if(resp.status == true) {
                        location.reload();
                    } else {
                        $('#userErrorMessage').html("The entered user profile exists. Please enter a new email.")
                    }
                }
            }
        });
    });

</script><?php /**PATH C:\Users\alina\relifeworld\resources\views/home/components/registration.blade.php ENDPATH**/ ?>