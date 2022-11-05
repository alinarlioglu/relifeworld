//fixed menu function
function fixedMenu() {
    var header = document.getElementById("header");
    var sticky = header.offsetTop;
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

$(document).ready(function(){
    //fixed menu
    window.onscroll = function(){ fixedMenu(); };
    
    // mobile menu click event
    $('.menuBtn').click(function() {
        $(this).toggleClass('act');
        if($(this).hasClass('act')) {
            $('.mainMenu').addClass('act');
        }
        else {
            $('.mainMenu').removeClass('act');
        }
    });
    
    $('#degree').on('change', function(){
        $("#form_course_finding input[name=next]").css( {"background-color": "gray", "pointer-events": "none"});	
        
        if($('#degree').val() != null){ 
            $('#form_course_finding input[name=next]').css( {"background-color": "#df0024", "pointer-events": "auto"});
        }        
    });
    $('#degree').trigger('change');

    $('#form_course_finding #multiselect-subjects').on('change', function(){
        $("#btn_submit").css( {"background-color": "gray", "pointer-events": "none"});	
        
        if($('#form_course_finding #multiselect-subjects').val().length != 0){ 
            $('#btn_submit').css( {"background-color": "#df0024", "pointer-events": "auto"});
        }        
    });
    $('#form_course_finding #multiselect-subjects').trigger('change');
});