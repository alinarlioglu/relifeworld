// history.go(0);
//page button function
var docw = $('.left').width();
$('html, body').scrollTop(0);
$("body").on('click', '.next_page_button', function(){
    // window.scrollTo(0, 0);
    var setPosition = $(this).parent().children().find('.left').attr('data-position');
    var btn_id = $(this).attr('id');
    $('.step').removeClass('active');
    $(this).parents('.left').next().children('.step').addClass('active');
    $(this).parents('.left').next().removeClass('hide_page');
    $("#main").animate({
        scrollLeft: $("#main").scrollLeft() + docw
    }, 200, function(){});
    $("html").animate({
        scrollTop: 0
    }, 200, function(){});    
});

function okayForm(i){
    $(i).parents('.step.active').addClass('confirmed');
}

function failForm(i){
    $(i).parents('.step.active').removeClass('confirmed');
}

// page1 local name validation
$('input.local_name_field').keyup(function(){
    validatePage1(this);
});

// page1 english first name validation
$('input.eng_firstname_field').keyup(function(){
    validatePage1(this);
});

// page1 english last name validation
$('input.eng_lastname_field').keyup(function(){
    validatePage1(this);
});

// page1 input validation
function validatePage1(i){
    var local_name = $('.local_name_field').val();
    var eng_first_name = $('.eng_firstname_field').val();
    var eng_last_name = $('.eng_lastname_field').val();
    var gender_click = $('.gender_click').length;
    var birthday_input = $('input[name="personal[birthday]"]').attr('data-birth');
    if(local_name != '' && eng_first_name != '' && eng_last_name != '' && birthday_input != '' && gender_click == 1) {
        okayForm(i);
    }
    else{
        failForm(i);
    }
}

//page1 gender selection
$('.gender').click(function(){   
    if($('.gender_click').length){
        $('.gender_click').not($(this)).removeClass('gender_click').addClass('gender');
    }      
    $(this).removeClass('gender').addClass('gender_click');  
    $('input.local_name_field').trigger('keyup');   
}); 

//page1 semantic UI datepicker
var dateIni = new Date('1994-10-28');
$('#birthday').calendar({
    type: 'date',
    startMode: 'year', 
    monthFirst: true,
    initialDate: dateIni,
    onChange: function(dateText, inst) {
        $("input").attr('data-birth', inst);
        $('.student_birthday').empty();
        $('.student_birthday').append(inst);
        $('input.local_name_field').trigger('keyup');
    },
    formatter: {
        date: function (date, settings) {
            if (!date) return '';
            var day = date.getDate() + '';
            if (day.length < 2) {
                day = '0' + day;
            }
            var month = (date.getMonth() + 1) + '';
            if (month.length < 2) {
                month = '0' + month;
            }
            var year = date.getFullYear();
            return year + '/' + month + '/' + day;
        }
        
    }
});

//page2 select year
$('body').on('click', '.study_year', function(){
    if($('.study_year_select').length){
        $('.study_year_select').not($(this)).removeClass('study_year_select').addClass('study_year');
    }      
    $(this).removeClass('study_year').addClass('study_year_select');  
    if($('.degree_dropdown').val() == ''){
        failForm(this);
    }   
}); 

//page2 select month
$('body').on('click', '.month_select', function(){
    if($('.month_selected').length){
        $('.month_selected').not($(this)).removeClass('month_selected').addClass('month_select');
    }      
    $(this).removeClass('month_select').addClass('month_selected');     
    if($('.degree_dropdown').val() == ''){
        failForm(this);
    } 
}); 
//
/*$("[name='UK']").click(function(){
    $('.student_study_destination').empty().append('UK').attr('id',87);
});*/

/*$("[name='USA']").click(function(){
    $('.student_study_destination').empty().append('USA').attr('id',88);
});*/

$(".label").on("click", function() {
    $(this).toggleClass('degree_selected');
    var selectedIds = $('.degree_selected').map(function() {
        return this.id;
    }).get();
    var degree_selected_arr = [];
    $('.stu_qualification').empty();
    $('.degree_selected').each(function(i){
        var name = $(this).children('.degree_choice').attr('name');
        var degree_id = $(this).children('.degree_choice').attr('id');
        var selected_id = $(this).attr('for');
        $('.stu_qualification').append("<span class='profile_degree' name='degree' id='" + degree_id + "'>" + name + "</span><br>");
        degree_selected_arr.push(selected_id);
    });
    //check if doctorate/master/other is selected
    if(jQuery.inArray( "2", degree_selected_arr) == -1  && jQuery.inArray( "4", degree_selected_arr) == -1 && jQuery.inArray( "6", degree_selected_arr) == -1){
        $('#form_work').hide();
        settingPosition();
    }else{
        $('#form_work').show();
        settingPosition();
    }
    $('#form_step3, #form_step5, #form_step6').show();
});

$('.degree_selection').click(function(){
    var number_of_fos = $('.degree_selected').length;
    if(number_of_fos > 0 ){
        okayForm(this);
    }
    else{
        failForm(this);
    }
});

$('.level_of_edu').hide();
$('.degree_dropdown').on('change', function(){
    $('.level_of_edu').hide();
    var drop_value = $('.degree_dropdown').val();
    var drop_data_name = $('.degree_dropdown option:selected').text();
    var drop_data_id = $('.degree_dropdown option:selected').attr('data-id');
    $('.stu_qualification').empty().append("<span class='profile_degree' name='degree' id='" + drop_data_id + "'>" + drop_data_name + "</span><br>")
    if(drop_value == 'high_school'){
        $('.level_of_edu, #final_interest').hide();
    }else if(drop_value == 'lang_school'){
        $('.level_of_edu, #final_interest').hide();
    }else if(drop_value == 'university'){
        $('.level_of_edu, #final_interest, #final_education').show();
    }

    if(drop_value == 'high_school' || drop_value == 'lang_school'){
        okayForm(this);
        settingPosition();
    }else if(drop_value == 'university' && $('.degree_selected').length > 0){
        settingPosition();
        okayForm(this);
    }else{
        failForm(this);
    }
});

$('.student_study_destination').empty();

$('body').on('click', '#step2_btn', function(){
    var deg_val = $('.degree_dropdown').val();
   // $('.student_study_destination').empty().append('UK').attr('id',87);
    if(deg_val == 'lang_school' || deg_val == 'high_school'){
        $('#form_step5 .step').addClass('active');
        $('#form_step3, #form_step4, #form_work').hide();
        $('#form_step5').removeClass('hide_page');
        settingPosition();
    }else {
        //
    }
    if(deg_val == 'lang_school'){
        $('#stu_degree_level option[name="Bachelor"]').attr('selected','selected');
        $('#sec_stu_degree_level option[name="High School"]').attr('selected','selected');
        $('.high_sch_row_2').hide();
        $('.sec_degree_title_field').removeClass('step5_field');
        settingPosition();
    }else if(deg_val == 'university'){
        var arr_degree = [];
        $('#form_step3, #form_step4, #form_step5').show();
        settingPosition();
        $('.degree_selection label').each(function(){
            if($(this).hasClass('degree_selected') == true){
                var degree_selected = $(this).children().attr('name');
                arr_degree.push(degree_selected);
            }
        });
        if($.inArray('Doctorate', arr_degree) >= 0){
            $('#stu_degree_level option[name="Masters"]').attr('selected','selected');
            $('#sec_stu_degree_level option[name="Bachelor"]').attr('selected','selected');
            $('#third_stu_degree_level option[name="High School"]').attr('selected','selected');
            $('.high_sch_row_3').hide();
            $('.third_degree_title_field').removeClass('step5_field');
        }else if($.inArray('Masters', arr_degree) >= 0){
            $('#stu_degree_level option[name="Bachelor"]').attr('selected','selected');
            $('#sec_stu_degree_level option[name="High School"]').attr('selected','selected');
            $('.high_sch_row_2').hide();
            $('.sec_degree_title_field').removeClass('step5_field');
        }else if($.inArray('Bachelor', arr_degree) >= 0 || $.inArray('Foundation', arr_degree) >= 0 || $.inArray('Degree', arr_degree) >= 0){
            $('#stu_degree_level option[name="High School"]').attr('selected','selected');
            $('.high_sch_row').hide();
            $('.degree_title_field').removeClass('step5_field');
        }
    }else if(deg_val == 'high_school'){
        $('#stu_degree_level option[name="High School"]').attr('selected','selected');
        $('.high_sch_row').hide();
        $('.stu_degree_fos, .degree_title_field').removeClass('step5_field');
    }
});

//page3 search filter
$('.quick_search').click(function(){
    $(this).val('');
});

$('[data-search]').on('keyup', function() {
    var searchVal = $(this).val();
    var filterItems = $('[data-filter-item]');
    if ( searchVal != '' ) {
        // filterItems.parents('.col-sm-4').addClass('hidden');
        filterItems.addClass('hidden');
        $('[data-filter-item][data-filter-name*="' + searchVal.toLowerCase() + '"]').removeClass('hidden');
    } else {
        filterItems.removeClass('hidden');
    }
});

//page3 level of fos selection 
$(".fos_check").on("click", function() {
    $(this).toggleClass('fos_checked');
    $(this).parent().find('.dot').toggleClass('dot_green');
    $('.quick_search').val('').trigger('keyup');
    var selectedIds = $('.fos_checked').map(function() {
        return this.id;
    }).get();
    var selectedIds = $('.dot_green').map(function() {
        return this.id;
    }).get();

    var length = $('.fos_checked').length;
    $('.stu_fos_interest').empty();
    $('.fos_checked').each(function(i){
        var name = $(this).attr('name');
        var fos_id = $(this).attr('id');
        $('.stu_fos_interest').append("<span class='profile_fos' name='fos' id='" + fos_id + "'>" + name + "</span><br>");
    });
    if($('.fos_checked').length > 0){
        okayForm($(this));
    }
    else{
        failForm($(this));
    }

});

$('body').on('click', '#step3_btn', function () {
    deg_val = $('.degree_dropdown').val();
    if(deg_val == 'university' && $("[name='USA']").hasClass('flag_selected')) {
        $('#form_step5 .step').addClass('active');
        $('#form_step4').hide();
        $('#form_step5').removeClass('hide_page');
        settingPosition();
        $('.uni_interest').hide();
    }
});

var asJSON_std_tests = [];
$(".country_selector").click(function() {

    if($(".country_selector").hasClass('flag_selected')) {
        $(".country_selector").removeClass("flag_selected");
    }
    $(this).addClass('flag_selected');

    if($("[name='UK']").hasClass('flag_selected')) {
        $("#form_tests").hide();
        $('#final_standardized_test').hide();
        asJSON_std_tests = null;
    } else if($("[name='USA']").hasClass('flag_selected')) {
        $("#form_tests").show();
        $('#final_standardized_test').show();
    }

    $('.student_study_destination').empty().append($(this).attr('name')).attr('id',$(this).attr('id'));

    var countrySelected = $(this).attr('name');

    $(".degree_selection").hide();
    $(".degree_selection").each(function() {
        if(countrySelected != 'USA') {
            if($(this).attr('data-uk') == 1) {
                $(this).show();
            }
        } else {
            if($(this).attr('data-usa') == 1) {
                $(this).show();
            }
        }
    });
});

$('.dot').click(function(){
    // $(this).toggleClass('dot_green');
    $(this).parent().find('.fos_check').toggleClass('fos_checked');
    if($('.dot_green').length > 0){
        okayForm($(this));
    }
    else{
        failForm($(this));
    }
});

//page3 count fields selected
$('.fos_selection').click(function(){
    $('.fos_select').each(function(){
        var count = $('.fos_checked').length;
        $('.number_fos_select').empty().append(count);
    });
});

//page3 list all option
$('.fos_select2').hide();
$('.list_all').on('click', function(){
    $('.fos_select2').show();
    $(this).hide();
});

$('body').on('click', '.next_page_button', function(){ 
    var length = $('.school').length;
    $('.stu_uni_interest').empty();
    $('.school').each(function(){
        var name = $(this).attr('name');
        var uni_id = $(this).attr('id')
        $('.stu_uni_interest').append("<span class='profile_uni' name='uni' id='" + uni_id + "'>" + name + "</span><br>");
    });
    $(this).parents('.left').next().children('.step').addClass('active');
});

//page4 remove previous value when mouse click in search input
$('body').on('click','.uni_keyword_search', function(){
    $(this).val('');
});

// $('body').on('keyup','.uni_keyword_search', function(){
//     $('.loading').show();
// });
$('.uni_keyword_search').keyup(function(){
    $('.loading').show();
});

$('body').on('click', '.ui-menu-item', function(){
    $('.uni_keyword_search').val('');
});

$('.uni_keyword_search').keyup(function (event) {
    if (event.which == 13) {
        //do some thing...
        $('.uni_keyword_search').val('');
        $('.loading').hide();
    }
}); 
//page4 add-degree
$('.search_uni, .show_school, .havent_decide').hide();
$('.know_uni_yes').on('click', function(){
    // $('.next_page_button').hide();
    if($('.school').length > 0 ){
        okayForm($(this));
    }else{
        failForm($(this));
    }
    $('.search_uni').show();
    $('.havent_decide').hide();
    $(this).addClass("selected");
    $(this).parents().find('.know_uni_no').removeClass("selected");
    $('.uni_interest').show();
});

//page4 have some preference
$('.know_uni_no').on('click', function(){
    okayForm($(this));
    $('.search_uni').hide();
    $('.havent_decide').show();
    $(this).parents().find('.know_uni_yes').removeClass("selected");
    $(this).addClass("selected");
    $('.uni_interest').hide();
});

$('#form_step4').click(function(){
    okayForm($(this));
});
//

//page4 uni interested & show uni
$("[name='uni_interest']").autocomplete({
    source: "/ukeas/search/unicommon?c_id=87",
    minLength: 2,
    position: {
        my: "left top",
        at: "left bottom"
    },
    select: function(event, ui) {
        $(this).val('');
        $(this).attr('palecholder','')
        $('.loading').hide();
        $('.uni_keyword_search').val('');
        if(ui.item.logo != null){
            var school_block = "<div class='school' id='" + ui.item.id + "' name='" + ui.item.text + "'>"+
                                "<p class='card_uni_name'>" + ui.item.text + "</p><br>"+
                                "<div class='school_image'><img src='http://www.study-without-borders.com/wallpaper/university/logo/" + ui.item.logo + "'></div>"+
                                "<span class='school_dot'></span>"+
                            "</div>";
        }else{
            var school_block = "<div class='school' id='" + ui.item.id + "' name='" + ui.item.text + "'>"+
                "<p class='card_uni_name'>" + ui.item.text + "</p><br>"+
                "<div class='school_image'><img src='/image/university.png'></div>"+
                "<span class='school_dot'></span>"+
            "</div>";
        }
        $('.show_school').show().append(school_block);
        $('.show_school').each(function(){
            var count = $('.school').length;
            $('.number_uni_select').empty().append(count);
        });
        $('#form_step4').children('.step').addClass('confirmed');
    }
});
//page4 school selected
$('body').on('click', '.school', function(){
    $(this).removeClass('school').toggleClass('school_unselect');
    var selectedIds = $('.school_unselect').map(function() {
        return this.id;
    }).get();
    $('.show_school').each(function(){
        var count = $('.school').length;
        $('.number_uni_select').empty().append(count);
    });
    if($('.school').length > 0){
        okayForm($(this));
    }else{
        failForm($(this));
    }
});

$('body').on('click', '.school_unselect', function(){
    $(this).removeClass('school_unselect').toggleClass('school');
    $(this).children().find('.school_dot').removeClass('school_dot').addClass('school_dot_unselect');
    var selectedIds = $('.school').map(function() {
        return this.id;
    }).get();
    var selectedIds = $('.school_dot_unselect').map(function() {
        return this.id;
    }).get();
    $('.show_school').each(function(){
        var count = $('.school').length;
        $('.number_uni_select').empty().append(count);
    });
    if($('.school').length > 0){
        okayForm($(this));
    }else{
        failForm($(this));
    }
});

//change degree estimate checkbox
$(".gpa_estimated").on("click", function() {
    $('.degree_gpa_input').trigger('click');
    $(this).toggleClass('gpa_estimated_checked');
    $(this).parent().find('.gpa_circle').toggleClass('gpa_circle_checked');
    var selectedIds = $('.gpa_estimated_checked').map(function() {
        return this.id;
    }).get();
    var selectedIds = $('.gpa_circle_checked').map(function() {
        return this.id;
    }).get();
    var id = $(this).parents().closest('.visible_degree').attr('id');
    var esti = $(this).hasClass('gpa_estimated_checked');
    if(id == 1 && esti == true){
        $('.degree_gpa_estimate').append('1');
    }
    else if(id == 2 && esti == true){
        $('.degree_gpa_estimate_2').append('1');
    }
    else if(id == 3 && esti == true){
        $('.degree_gpa_estimate_3').append('1');
    }
    else{
        $('.degree_gpa_estimate').append('0');
    }
}); 

//page5 select topest degree
$('.topest_check').click(function(){
    if($('.topest_checked').length){
        $('.topest_checked').not($(this)).removeClass('topest_checked').addClass('topest_check');
    }  
    if($('.topdegree_circle_select').length){
        $('.topdegree_circle_select').not($(this)).removeClass('topdegree_circle_select').addClass('topdegree_circle');
    }       
    $(this).removeClass('topest_check').addClass('topest_checked'); 
    $(this).find('.topdegree_circle').removeClass('topdegree_circle').addClass('topdegree_circle_select');
}); 
//page5 academic
// $('.second_academic').hide();
$('.add_degree').on('click', function(){
    failForm(this);
    $(this).hide();
    $(this).parents().find('.delete_aca2_btn').show();
    $(this).parents('.academic_info').next().addClass('visible_degree');
});
// $('.third_academic').hide();
$('.add_degree_sec').on('click', function(){
    failForm(this);
    $(this).hide();
    $(this).parents().find('.delete_aca2_btn').hide();
    $(this).parents().find('.delete_aca3_btn').show();
    $(this).parents('.academic_info').next().addClass('visible_degree');
});
var starting, ending, count;
//page5 datepicker start

$(".start_cal").each(function(){
        if($(this).on("click")) {
            count = $(this).attr('data-attr');
            clickStartCalendar(count);
        }
});

$(".end_cal").each(function(){
    if($(this).on("click")) {
        count = $(this).attr('data-attr');
        clickEndCalendar(count);
    }
});

function clickStartCalendar (count){

    $('#start_degree'+count).calendar({
        type: 'month',
        startMode: 'year', 
        monthFirst: true,
        onChange: function(dateText, inst) {
            $("input[name=start_year_input"+count+"]").val(inst);
            var start = inst;
            var end = $("input[name=end_year_input"+count+"]").val();
            degreeDateValidation(start, end, count);
            //$(".degree_start_year_field").val(inst);
        },
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var day = date.getDate() + '';
                if (day.length < 2) {
                    day = '0' + day;
                }
                var month = (date.getMonth() + 1) + '';
                if (month.length < 2) {
                    month = '0' + month;
                }
                var year = date.getFullYear();
                return year + '-' + month;
            }
            
        }
    });
}

//page5 datepicker end
function clickEndCalendar(count){

    $('#end_degree'+count).calendar({
        type: 'month',
        startMode: 'year', 
        monthFirst: true,
        onChange: function(dateText, inst) {
            $("input[name=end_year_input"+count+"]").val(inst);
            var end = inst;
            var start = $("input[name=start_year_input"+count+"]").val();
            degreeDateValidation(start, end, count);
        },
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var day = date.getDate() + '';
                if (day.length < 2) {
                    day = '0' + day;
                }
                var month = (date.getMonth() + 1) + '';
                if (month.length < 2) {
                    month = '0' + month;
                }
                var year = date.getFullYear();
                return year + '-' + month;
            }
            
        }
    });
}

//
$('.delete_aca2_btn').click(function(){
    var empty = 0;
    $(this).hide();
    $('.add_degree').css('display:block'); 
    $(this).parents().find('.add_degree').show(); 
    $(this).parents('.academic_info').removeClass('visible_degree');
    $(this).parents().find('table #sec_academic').remove();
    $('#degree2 .step5_field').val('');
    check_step5_field(this);
});
//
$('.delete_aca3_btn').click(function(){
    $(this).hide();      
    $(this).parents().find('.delete_aca2_btn').show();
    $(this).parents().find('.add_degree_sec').show();
    $(this).parents('.academic_info').removeClass('visible_degree');
    $(this).parents().find('table #third_academic').remove();
    $('#degree3 .step5_field').val('');
    check_step5_field(this);
});

$('#stu_degree_uni').on('keyup', function(){
    if($(this).val() != ''){
        $('.loading').show();
    }else{
        $('.loading').hide();
    }
});

//**********************  page5 uni API

var degreeNeedValidate = ['1','2','3','4','5']; //Bachelor, Doctorate, Masters, PG Diploma, Masters by research
var countryNeedValidate = ['79', '87']; // TW, UK

$("[name='degree_uni']").autocomplete({
    source: "/ukeas/search/unicommon?showLocalName=1&&c_id=79",
    minLength: 2,
    position: {
        my: "left top",
        at: "left bottom"
    },
    select: function(event, ui) {
        $('.loading').hide();
        $(this).val(ui.item.text);
        $(this).attr('data-id',ui.item.id);
        $('.stu_profile_uni_name').empty().append(ui.item.text).attr('data-id', ui.item.id);
        $('.stu_profile_uni_id').empty().append(ui.item.id);
    }, change: function(event, ui) {
        var degreeId = $(this).parents('.academic_info').find('.degree_level').val();
        var countryId = $(this).parents('.academic_info').find('.countrySelectTemplate').val();

        if (degreeNeedValidate.includes(degreeId) && countryNeedValidate.includes(countryId)) {
            if (ui.item === null) {
                $(this).removeAttr('data-id');
                $(this).css({'border-bottom':'2px solid #f24'});
                failForm(this);
            } else {
                $(this).css({"border-bottom":"1px solid #dddddd"});
                check_step5_field(this);
            }
        } else {
            $(this).css({"border-bottom":"1px solid #dddddd"});
            check_step5_field(this);
        }
    }
});
//

//
$('body').on('change','.countrySelectTemplate', function(){
    var degree_id = $(this).parents('.visible_degree').attr('id');
    $("#" + degree_id + " [name='degree_uni']").autocomplete('option','source', '/ukeas/search/unicommon?showLocalName=1&&c_id='+ $(this).val());
});

$('.visible_degree .step5_field').keyup(function(){
    check_step5_field(this);
    check_fos(this);
    check_study_year(this);
});
//
$('.degree_gpa_input').keyup(function(){
    var gpaValue = $(this).val();
    var gpaType = $(this).parent().parent().find('.gpa_selection').val();
    // validateGpa(gpaValue, gpaType);
    if(validateGpa(gpaValue, gpaType) == false){
        $(this).css({"border-bottom":"1px solid #f24"});
        $(this).attr('data-check','false');
        failForm(this);
        // check_gpa(this);
    }else{
        $(this).css({"border-bottom":"1px solid #dddddd"});
        $(this).attr('data-check','true');
        check_step5_field(this);
    }
});
//
$('.gpa_selection').change(function(){
    failForm(this);
    var gpa_value = $(this).siblings().find('.degree_gpa_input').val('');
    var gpa_type = $(this).val();
    if(gpa_type == 'PER'){
        $(this).siblings().find('.degree_gpa_input').attr("placeholder","e.g. 86.53");
    }
    else if(gpa_type == '4.0'){
        $(this).siblings().find('.degree_gpa_input').attr("placeholder","e.g. 3.8");
    }
    else if(gpa_type == '4.3'){
        $(this).siblings().find('.degree_gpa_input').attr("placeholder","e.g. 3.7");
    }
    else{
        $(this).siblings().find('.degree_gpa_input').attr("placeholder","e.g. 3.7");
    }
});
//
$('.degree_end_year_field').keyup(function(){
    // check_step5_field(this);
});
//
function removeAutoSelectionFosDropdown() {
    $(window).on('click', function () {
        if (($('#fos_name_selected1').attr('data-check') == "false") || ($('#fos_name_selected2').attr('data-check') == "false") || ($('#fos_name_selected3').attr('data-check') == "false") ) {
            $(".fos_dropdown").find('#1').removeClass('selected');
            $(".fos_dropdown").find('#1').removeClass('active');
        }
    });
}

$("#degree1 .search").off("click", function(){});
$("#degree1 .search").on("click",function(){
    removeAutoSelectionFosDropdown();
});
$("#degree2 .search").off("click", function(){});
$("#degree2 .search").on("click",function(){
    removeAutoSelectionFosDropdown();
});

$("#degree3 .search").off("click", function(){});
$("#degree3 .search").on("click",function(){
    removeAutoSelectionFosDropdown();
});

$('.ui.dropdown').dropdown({fullTextSearch: true});
$('#degree1 .fos_drop_selection').on('click', function(){
    var fos_selected_id = $(this).attr('id');
    var fos_selected_name = $(this).text().replace('Select one from the list','').replace('- ','');
    // console.log(fos_selected_name);
    $('#fos_name_selected1').attr({
        'data-fos-id': fos_selected_id,
        'data-check': true
    });
    $(this).parents().closest('.fos_dropdown').css('border', '1px solid #D8E1E2');
    $('.stu_profile_fos_name').empty().append(fos_selected_name).attr('data-id', fos_selected_id);
    setTimeout(function(i){
        check_step5_field(this);
        check_fos(this);
        // $('.step5_field').trigger('click');
    }, 200);
});
//
$('#degree2 .fos_drop_selection').on('click', function(){
    var fos_selected_id = $(this).attr('id');
    $('#fos_name_selected2').attr({
        'data-fos-id': fos_selected_id,
        'data-check': true
    });
    $(this).parents().closest('.fos_dropdown').css('border', '1px solid #D8E1E2');
    setTimeout(function(i){
        check_step5_field(this);
        check_fos(this);
        // $('.step5_field').trigger('click');
    }, 200);
});
//
$('#degree3 .fos_drop_selection').on('click', function(){
    var fos_selected_id = $(this).attr('id');
    $('#fos_name_selected3').attr({
        'data-fos-id': fos_selected_id,
        'data-check': true
    });
    $(this).parents().closest('.fos_dropdown').css('border', '1px solid #D8E1E2');
    setTimeout(function(i){
        check_step5_field(this);
        check_fos(this);
        // $('.step5_field').trigger('click');
    }, 200);
});
//
$('.fos_dropdown .search').on('keyup', function(){
    var current_id = $(this).parents().closest('.visible_degree').attr('id');
    $('#'+ current_id + ' .text').text('');
    $('#'+ current_id + ' .text').attr({
        'data-fos-id':'',
        'data-check': false
    });
    $(this).parents().closest('.fos_dropdown').css('border','1px solid #f24');
    failForm(this);
});
//
$(".quantity").keypress(function (e) {
    //if the letter is not digit then display error and don't type anything
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
       return false;
   }
});
//gpa input validation
function validateGpa(gpaValue, gpaType){
    var regExpression = {};
    regExpression["PER"] = /^[0-9]{2}(\.[0-9]{1,2})?$/;
    regExpression["4.0"] = /^[1-4]{1}(.[0-9]{0,1})$/;
    regExpression["4.3"] = /^[1-4]{1}(.[0-9]{0,1})$/;
    regExpression["4.5"] = /^[1-4]{1}(.[0-9]{0,1})$/;
    regExpression["5.0"] = /^[1-4]{1}(.[0-9]{0,1})$/;

    var maxValue = {};
    maxValue["PER"]= 100;
    maxValue["4.0"] = 4.0;
    maxValue["4.3"] = 4.3;
    maxValue["4.5"] = 4.5;
    maxValue["5.0"] = 5.0;

    var minValue = {};
    minValue["PER"]= 50;
    minValue["4.0"] = 0.0;
    minValue["4.3"] = 0.0;
    minValue["4.5"] = 0.0;
    minValue["5.0"] = 0.0;
    return (regExpression[gpaType].test(gpaValue) && gpaValue <= maxValue[gpaType] && gpaValue >= minValue[gpaType]);
}
//check the next degree needed to be input
function next_degree(i){
    var data_id = parseInt($('.visible_degree').last().attr('data-id'));
    var degree_val_arr = [$('#stu_degree_level').val(), $('#sec_stu_degree_level').val()];
    var degree_arr = ["'#stu_degree_level'","'#sec_stu_degree_level'","'#third_stu_degree_level'"];
    if(degree_val_arr[data_id] == 2){
        $('div[data-id="'+ data_id +'"] .next_deg_text').empty().append('<span>Please enter your Master degree details!</span>');
        // $(degree_arr[data_id + 1] +' option[value="4"]').attr('selected','selected');
        $('div[data-id="'+ (data_id + 1) +'"] .degree_level option[value="4"]').attr('selected','selected');
    }else if(degree_val_arr[data_id]== 4){
        $('div[data-id="'+ data_id +'"] .next_deg_text').empty().append('<span>Please enter your Bachelor degree details!</span>');
        // $(degree_arr[data_id + 1 ] +' option[value="1"]').attr('selected','selected');
    }
}
//
function check_fos(i){
    $('.visible_degree .text').each(function(){
        var check_false = $('.visible_degree div.text[data-check=false]').length;
        if(check_false > 0){
            failForm(i);
        }
    });
}
//check all year input
function check_study_year(i){
    $('.visible_degree input[name=start_year_input]').each(function(){
        var check_false = $('.visible_degree input[name=start_year_input][data-check=false]').length;
        // console.log(check_false);
        if(check_false > 0){
            failForm(i);
        }
    });
}
//
function check_step5_field(i){
    var check_gpa = $('.visible_degree').find('.degree_gpa_field').attr('data-check');
    var sec_check_gpa = $('.visible_degree').find('.sec_degree_gpa_field').attr('data-check');
    var third_check_gpa = $('.visible_degree').find('.third_degree_gpa_field').attr('data-check');
    var check_fos1 = $('.visible_degree').find('#fos_name_selected1').text();
    var check_fos2 = $('.visible_degree').find('#fos_name_selected2').text();
    var check_fos3 = $('.visible_degree').find('#fos_name_selected3').text();
    var empty = 0;

    $('.visible_degree .step5_field:visible').each(function(){
        var element = $(this);
        if(element.val() == ''){
            empty++;
        } else if (element.parent().attr('class') === 'form-degree-uni') {
            var degreeId = $(this).parents('.academic_info').find('.degree_level').val();
            var countryId = $(this).parents('.academic_info').find('.countrySelectTemplate').val();

            if (degreeNeedValidate.includes(degreeId) && countryNeedValidate.includes(countryId)) {
                if ($(this).attr('data-id') === undefined) {
                    empty++;
                }
            }
        }
        
        if(empty > 0){
            failForm(element);
        }
    });

    var check_gpa_false;
    $('.visible_degree .degree_gpa_input').each(function(){
        check_gpa_false = $('.visible_degree input.degree_gpa_input[data-check=false]').length;
        if(check_gpa_false > 0){
            failForm(i);
        }
    });

    var check_year_false;
    $('.visible_degree .degree_start_year_field').each(function(){
        check_year_false = $('.visible_degree input.degree_start_year_field[data-check=false]').length;
        if(check_year_false > 0){
            failForm(i);
        }
    });

    var check_fos_value;
    $('.visible_degree .fos_dropdown').each(function(){
        check_fos_value = $('.visible_degree .fos_dropdown:visible .text[data-check=false]').length;
        if(check_fos_value > 0){
            $('.step.active').removeClass('confirmed');
        }
    });
    // console.log(check_fos_value);
    //console.log(empty,check_gpa_false,check_year_false,check_fos_value);
    //check all the fields are input
    if(empty == 0 && check_gpa_false == 0 && check_year_false == 0 && check_fos_value == 0){
        // okayForm(i);
        // console.log("innnnnnn");
        $('.step.active').addClass('confirmed');
        next_degree(this);
    }else{
        failForm(i);
    }
}
var degree_start_year_field = $('.degree_start_year_field').val();
var degree_end_year_field = $('.degree_end_year_field').val();

/*$('.degree_year input').keyup(function(i,j){
    i = parseInt($(this).parents('.row').find('.degree_start_year_field').val());
    j = parseInt($(this).parents('.row').find('.degree_end_year_field').val());
    var check_study_year1 = $('.degree_start_year_field').attr('data-check');

    if( i > j){
        $(this).parents('.row').find('.degree_year .gray_border').css('border', '1px solid #f24');
        $(this).parents('.row').find('.degree_year:first-child input').attr('data-check','false');
    }
    else if( i <= j){
        $(this).parents('.row').find('.degree_year .gray_border').css('border', '1px solid #D8E1E2');
        $(this).parents('.row').find('.degree_year:first-child input').attr('data-check','true');
    }
    check_step5_field(this);
});*/

function degreeDateValidation(i = null, j = null, count){
    
    var check_study_year1 = $('.degree_start_year_field').attr('data-check');

    if( i <= j || j == ""){
        $('.degree_year #end_degree'+count).parents('.row').find('.degree_year .gray_border').css('border', '1px solid #D8E1E2');
        $('.degree_year #end_degree'+count).parents('.row').find('.degree_year:first-child input').attr('data-check','true');
    }else if( i > j){
        $('.degree_year #end_degree'+count).parents('.row').find('.degree_year .gray_border').css('border', '1px solid #f24');
        $('.degree_year #end_degree'+count).parents('.row').find('.degree_year:first-child input').attr('data-check','false');
    }
    check_step5_field($('.degree_year input'));
}

$('body').on('click', '#step5_btn', function(){
    // $('#form_step5').addClass('hide_page');
    $('#form_step5 .step').removeClass('active');
    // $('#fos_name_selected').
    if($(".degree_dropdown").val() == 'high_school'){
        //
    }else{
        $('#form_step6 .step').removeClass('active');
    }
    $('.degree_selected').each(function(){
        var name = $(this).children('.degree_choice').attr('name');
        if(name != 'Doctorate' && name != 'Masters'){
            // $('#form_step6').removeClass('hide_page');
            // $('#form_step6').find('.step').addClass('active');
        }
    });
    $(this).parents().closest('.step').removeClass('active');
    var sec_stu_profile_title_name =  $(this).parents().find('.sec_degree_title_field').val();
    var sec_stu_profile_uni_id = $(this).parents().find('.sec_stu_degree_uni').attr('data-id');
    var sec_stu_profile_uni_name = $(this).parents().find('.sec_stu_degree_uni').val();
    var sec_stu_degree_start_year = $(this).parents().find('.sec_degree_start_year_field').val();
    var sec_stu_degree_end_year = $(this).parents().find('.sec_degree_end_year_field').val();
    var sec_stu_profile_fos_name = $('#fos_name_selected2').text().replace('Select one from the list','').replace('- ','');
    var sec_degree_gpa = $(this).parents().find('.sec_degree_gpa_field').val();
    var sec_stu_profile_degree = $(this).parents().find('#sec_stu_degree_level').attr('name');

    var third_stu_profile_title_name =  $(this).parents().find('.third_degree_title_field').val();
    var third_stu_profile_uni_id = $(this).parents().find('.third_stu_degree_uni').attr('data-id');
    var third_stu_profile_uni_name = $(this).parents().find('.third_stu_degree_uni').val();
    var third_stu_degree_start_year = $(this).parents().find('.third_degree_start_year_field').val();
    var third_stu_degree_end_year = $(this).parents().find('.third_degree_end_year_field').val();
    var third_stu_profile_fos_name =  $('#fos_name_selected3').text().replace('Select one from the list','').replace('- ','');
    var third_degree_gpa = $(this).parents().find('.third_degree_gpa_field').val();
    var third_stu_profile_degree = $(this).parents().find('#third_stu_degree_level').attr('name');
    $('.sec_degree_gpa').empty().append(sec_degree_gpa);
    $('.third_stu_profile_degree').empty();
    
    var id = $(this).parents().closest('.visible_degree').attr('id');
    var esti = $(this).hasClass('gpa_estimated_checked');
    var new_table = '<hr><table class="info_table degree_table" id="sec_academic">'+
                        '<tbody>'+
                            '<tr>'+
                                '<td class="table_info_title_2">Title:</td>'+
                                '<td class="table_info_ans_2 sec_stu_profile_title_name" name="title">' + sec_stu_profile_title_name + '</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td class="table_info_title_2">Field of study:</td>'+
                                '<td class="table_info_ans_2 sec_stu_profile_fos_name" name="fosName">' + sec_stu_profile_fos_name + '</td>'+
                            '</tr>'+
                            '<tr style="display:none">'+
                                '<td class="table_info_title_2">University ID:</td>'+
                                '<td class="table_info_ans_2 sec_stu_profile_uni_id" name="universityId">' + sec_stu_profile_uni_id + '</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td class="table_info_title_2">University name:</td>'+
                                '<td class="table_info_ans_2 sec_stu_profile_uni_name" name="universityName">'+ sec_stu_profile_uni_name +'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td class="table_info_title_2">Start year:</td>'+
                                '<td class="table_info_ans_2 sec_stu_degree_start_year" name="startYear">' + sec_stu_degree_start_year + '</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td class="table_info_title_2">End year:</td>'+
                                '<td class="table_info_ans_2 sec_stu_degree_end_year" name="endYear">' + sec_stu_degree_end_year + '</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td class="table_info_title_2">GPA:</td>'+
                                '<td class="table_info_ans_2 sec_degree_gpa" name="gpaOriginal">' + sec_degree_gpa + '</td>'+
                            '</tr>'+
                            '<tr style="display:none">'+
                                '<td class="table_info_title_2">GPA estimate:</td>'+
                                '<td class="table_info_ans_2 degree_gpa_estimate_2" name="gpaIsEstimated"></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td class="table_info_title_2">Degree Level:</td>'+
                                '<td class="table_info_ans_2 sec_stu_profile_degree" name="degreeText"></td>'+
                            '</tr>'+
                            '<tr style="display:none">'+
                                '<td class="table_info_title_2">THE TOPEST:</td>'+
                                '<td class="table_info_ans_2 sec_stu_profile_degree_top" name="useThis"></td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>';

    var new_sec_table = '<hr><table class="info_table degree_table" id="third_academic">'+
        '<tbody>'+
            '<tr>'+
                '<td class="table_info_title_3">Title:</td>'+
                '<td class="table_info_ans_3 third_stu_profile_title_name" name="title">' + third_stu_profile_title_name + '</td>'+
            '</tr>'+
            '<tr>'+
                '<td class="table_info_title_3">Field of study:</td>'+
                '<td class="table_info_ans_3 third_stu_profile_fos_name" name="fosName">' + third_stu_profile_fos_name + '</td>'+
            '</tr>'+
            '<tr style="display:none">'+
                '<td class="table_info_title_3">UNIVERSITY ID:</td>'+
                '<td class="table_info_ans_3 third_stu_profile_uni_id" name="universityId">' + third_stu_profile_uni_id + '</td>'+
            '</tr>'+
            '<tr>'+
                '<td class="table_info_title_3">University name:</td>'+
                '<td class="table_info_ans_3 third_stu_profile_uni_name" name="universityName">'+ third_stu_profile_uni_name +'</td>'+
            '</tr>'+
            '<tr>'+
                '<td class="table_info_title_3">Start year:</td>'+
                '<td class="table_info_ans_3 third_stu_degree_start_year" name="startYear">' + third_stu_degree_start_year + '</td>'+
            '</tr>'+
            '<tr>'+
                '<td class="table_info_title_3">End year:</td>'+
                '<td class="table_info_ans_3 third_stu_degree_end_year" name="endYear">' + third_stu_degree_end_year + '</td>'+
            '</tr>'+
            '<tr>'+
                '<td class="table_info_title_3">GPA:</td>'+
                '<td class="table_info_ans_3 third_degree_gpa" name="gpaOriginal">' + third_degree_gpa + '</td>'+
            '</tr>'+
            '<tr style="display:none">'+
                '<td class="table_info_title_3">GPA estimate:</td>'+
                '<td class="table_info_ans_3 degree_gpa_estimate_3" name="gpaIsEstimated"></td>'+
            '</tr>'+
            '<tr>'+
                '<td class="table_info_title_3">Degree level:</td>'+
                '<td class="table_info_ans_3 third_stu_profile_degree" name="degreeText"></td>'+
            '</tr>'+
            '<tr style="display:none">'+
                '<td class="table_info_title_3">THE TOPEST:</td>'+
                '<td class="table_info_ans_3 third_stu_profile_degree_top" name="useThis"></td>'+
            '</tr>'+
        '</tbody>'+
    '</table>';

    if(sec_stu_profile_uni_name != '' && typeof(sec_stu_profile_uni_name) != undefined && $('#sec_academic').length == 0){
        $(".aca_table").append(new_table);
    }
    else if(sec_stu_profile_uni_name == ''){
        $('#sec_academic').remove();
    }

    if(third_stu_profile_uni_name != '' && typeof(third_stu_profile_uni_name) != undefined && $('#third_academic').length == 0){
        $(".aca_table").append(new_sec_table);
    }
    else if(third_stu_profile_uni_name == ''){
        $('#third_academic').remove();
    }
    
    if($('.stu_degree_uni').val() == ''){
        $('#final_education').hide();
    }else{
        $('#final_education').show();
    }
});

//page6 input validation
$('.step6_field').keyup(function(){
    page6_input_validate(this);
});

$('.contact_time_select').change(function(){
    page6_input_validate(this);
    var contact_time = $(this).val();
    $('.stu_profile_contact_time').append(contact_time);
});

$('.contact_preferred_select').change(function(){
    page6_input_validate(this);
    if($(this).val() == 'line'){
        $('#contact_online').prop('checked', true);
    }
});

$("input[name='city']").autocomplete({
    source: "/ukeas/search/city?c_id=79",
    minLength: 2,
    position: {
        my: "left top",
        at: "left bottom"
    },
    select: function(event, ui) {
        $(this).val(ui.item.text);
        $(this).attr('data-id', ui.item.id);
        //$('.loading').hide();
        page6_input_validate(this);
        // $('.step6_field').trigger('keyup');
        $('#city_field').css({'border':'none'});
        // $('#city_field').attr('data-id',$(this).val());
    }
});
//
$('#city_field').on("keyup, keypress", function(){
    if($(this).val() != ''){
        //$('.loading').show();
        // console.log($(this).attr('id'))
        $(this).removeAttr('data-id');
        //$(this).css({'border-bottom':'2px solid #f24'});
        $(this).parents('.step.active').removeClass('confirmed');
    }
});

//Validate marketing questions
var status;
$(".market_question").off("click change");
$(".market_question").on("click change", function() {

    var check_id = []; index = 0; var arr=[];
    $('.market_question').each(function(){
        var data_radio_id = 0; var data_option_id = 0;
        data_question_type = $(this).attr('data-question-type');
        data_required_type = $(this).attr('data-required-type');
        data_question_id = $(this).attr('data-question-id');
        if(data_question_type == "single" && data_required_type == "required") {
               
            $('.suboption').each(function(count){
                data_option_id = $(this).attr("data-option-id");
                //store all the suboption's id
                arr[count]=data_option_id;
            });

            //obtain the data-radio-id of the selected option.
            $('input[name="q'+data_question_id+'_radio"]').each(function() {
                if($(this).is(':checked')) {
                    data_radio_id = $(this).attr('data-radio-id');
                }
            });
            //check if the option selected contains suboption
            checkIfInArray = arr.includes(data_radio_id);

            //logic for validating the green tick.
            if($('#q'+data_question_id+'_op'+data_radio_id).is(':checked') && (checkIfInArray==true)) {
                if($('input[name="q'+data_question_id+'_sub'+data_radio_id+'_radio"]').is(':checked')){
                    check_id[index] = true;
                }else{
                    check_id[index] = false;
                }
            }else if($('input[name="q'+data_question_id+'_radio"]').is(':checked') && (checkIfInArray==false)) {
                check_id[index] = true; 
            }else{
                check_id[index] = false;
            }    
        }else if(data_question_type == "multiple" && data_required_type == "required") {
            $('[data-ans-id='+ data_question_id +']').each(function(){
                if($('input[name="q'+data_question_id+'_checkbox"]:checked').length == 0){
                    check_id[index] = false;
                }else{
                   check_id[index] = true;
                }   
            });
        }

        index++;
        var checker = check_id => check_id.every(Boolean);
        if(checker(check_id)){
            okayForm($(this));
        }else{
            failForm($(this));
        }  
    });
});

//page6
$(function() {
    var list = $('.js-dropdown-list');
    var link = $('.js-link');
    link.click(function(e) {
        e.preventDefault();
        list.slideToggle(200);
    });
});
//carousel
$('.carousel').carousel({
    interval: 5000,
    pause: false
});
//
var count_eng = 0;
$('body').on('click', '.add_new_qua', function(){
    failForm(this);
    count_eng ++;
    $('.eng_exam_score').append($('.eng_template').html());
    $('.eng_block').last().attr({
        'style':'display:block',
        'id':'eng_block'+ count_eng
    });
    addExam(count_eng);
});

function addExam(count_eng){
    $('.eng_block .exam_date').last().attr('id','exam_date'+ count_eng);
    $('.eng_block .date_input').last().attr('id','date_input'+ count_eng);
    
    $('#exam_date'+ count_eng +':visible').calendar({
        type: 'date',
        startMode: 'year', 
        monthFirst: true,
        onChange: function(dateText, inst) {
            $("#date_input"+ count_eng).attr('data-date', inst);
            $('#eng_block'+ count_eng + ' .score_input').trigger('keyup');
            check_eng(this);
        },
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var day = date.getDate() + '';
                if (day.length < 2) {
                    day = '0' + day;
                }
                var month = (date.getMonth() + 1) + '';
                if (month.length < 2) {
                    month = '0' + month;
                }
                var year = date.getFullYear();
                return year + '/' + month + '/' + day;
            }
        }
    });
}
//
$('body').on('click', '.delete_eng_block', function(){
    var has_qualification = $('.eng_block:visible').length; //default is 1 (which is template's)
    $(this).parents('.eng_block').remove();
    if(has_qualification === 1){ 
        failForm(this);
        $('#form_eng').children('.step').removeClass('confirmed');
    } else {
        check_eng(this);
    }
});
//
$('input[name=exam]').on('click', function(){
    if($(this).val() == 'yes'){     
        count_eng ++;
        $('.add_new_qua').show();
        $('.eng_exam_score').append($('.eng_template').html());
        $('.eng_block').last().attr({
            'style':'display:block',
            'id':'eng_block'+ count_eng
        });
        addExam(count_eng);
        failForm(this);
    }else{
        $('.eng_block').css('display','none');
        $('.eng_exam_scroe').empty();
        $('.add_new_qua').hide();
        okayForm(this);
    }
});

$('body').on('keyup', '.eng_input', function(){
    check_eng(this);
});


$('body').on('change','.eng_selection', function(){

    let input_id = $(this).parents('.eng_block').attr('id');
    let exam_type = $('#' + input_id + ' .eng_selection :selected').val();
    //console.log(exam_type);

    $('#' + input_id).find('.eng_input').each(function () {
        let score = $(this).val();
        if($(this).hasClass(".score_input")) {
            if(ValidateOverallScore(exam_type, score) == true){
                $(this).css('border-bottom','2px solid #70FFDB');
                $(this).attr('data-check','true');
            }
        }else {
            if (ValidatedetailScore(exam_type, score) == true) {
                $(this).css('border-bottom', '2px solid #70FFDB');
                $(this).attr('data-check', 'true');
            } else {
                $(this).css('border-bottom', '2px solid red');
                $(this).attr('data-check', 'false');
                failForm(this);
            }
        }
    });

    check_eng(this);

});

function check_eng(k){
    var empty = 0;
    var eng_id = $(k).parents('.eng_block').attr('id').replace('eng_block', '');
    var input_id = $(k).parents('.eng_block').attr('id');
    var date_pick = $('#date_input'+ eng_id ).attr('data-date');
    var exam_type = $('#' + input_id + ' .eng_selection :selected').val();
    let valid = true;
    var score = $(k).val();
    $('.eng_input:visible').each(function(){
        if($(this).val() == ''){
            empty++;
        }
    });
    $('.date_input:visible').each(function(){
        if($(this).attr('data-date') == undefined){
            empty++;
        }
    });

    $('#' + input_id).find('.eng_input').each(function () {
        if ($(this).attr('data-check') == "false") {
            valid = false;
            return false;
        }
    });

    if((empty == 0) && (valid == true) && (date_pick != undefined)){
        okayForm(k);
    }else{
        failForm(k);
    }
}
//
$('body').on('keyup', '.score_input', function(){
    var input_id = $(this).parents('.eng_block').attr('id');
    var exam_type = $('#' + input_id + ' .eng_selection :selected').val();
    var score = $(this).val();
    if(ValidateOverallScore(exam_type, score) == true){
        $(this).css('border-bottom','2px solid #70FFDB');
        $(this).attr('data-check','true');
    }else{
        $(this).css('border-bottom','2px solid red');
        $(this).attr('data-check','false');
        failForm(this);
    }
    check_eng(this);
});

$('body').on('keyup', '.score_detail', function(){
    var input_id = $(this).parents('.eng_block').attr('id');
    var exam_type = $('#' + input_id + ' .eng_selection :selected').val();
    var score = $(this).val();
    if(ValidatedetailScore(exam_type, score) == true){
        $(this).css('border-bottom','2px solid #70FFDB');
        $(this).attr('data-check','true');
    }else{
        $(this).css('border-bottom','2px solid red');
        $(this).attr('data-check','false');
        failForm(this);
    }
    check_eng(this);
});

function ValidateOverallScore(exam_type, score){
    var regExpression = {};
    regExpression["IELTS"] = /^(?!0$)\d+(?:[,.][05])?$/;
    regExpression["IELTS UKVI"] = /^(?!0$)\d+(?:[,.][05])?$/;
    regExpression["TOEFL"] = /^\d+$/;
    regExpression["Pearson"] = /^\d+$/;

    var maxValue = {};
    maxValue["IELTS"] = 9;
    maxValue["IELTS UKVI"] = 9;
    maxValue["TOEFL"] = 120;
    maxValue["Pearson"] = 90;
    return (regExpression[exam_type].test(score) && score <= maxValue[exam_type]);
}

function ValidatedetailScore(exam_type, score){
    var regExpression = {};
    regExpression["IELTS"] = /^(?!0$)\d+(?:[,.][05])?$/;
    regExpression["IELTS UKVI"] = /^(?!0$)\d+(?:[,.][05])?$/;
    regExpression["TOEFL"] = /^\d+$/;
    regExpression["Pearson"] = /^\d+$/;

    var maxValue = {};
    maxValue["IELTS"] = 9;
    maxValue["IELTS UKVI"] = 9;
    maxValue["TOEFL"] = 30;
    maxValue["Pearson"] = 90;
    return (regExpression[exam_type].test(score) && score <= maxValue[exam_type]);
}

function ValidateScore(exam_type, score){
    var regExpression = {};
    regExpression["IELTS"] = /^(?!0$)\d+(?:[,.][05])?$/;
    regExpression["IELTS UKVI"] = /^(?!0$)\d+(?:[,.][05])?$/;
    regExpression["TOEFL"] = /^\d+$/;
    regExpression["Pearson"] = /^\d+$/;

    var maxValue = {};
    maxValue["IELTS"] = 9;
    maxValue["IELTS UKVI"] = 9;
    maxValue["TOEFL"] = 120;
    maxValue["Pearson"] = 90;
    return (regExpression[exam_type].test(score) && score <= maxValue[exam_type]);
}
//
var eng_arr = [];
var qualification_arr ;
var asJSON_lang;
$('body').on('click', '#eng_btn', function(){
    $('#final_eng_q tbody tr').remove();
    var eng_ids = [];
    $('.eng_exam_score').children('.eng_block:visible').each(function(){
        eng_ids.push($(this).attr('id').replace('eng_block', ''));
    });

    var eng_answer_arr;
    qualification_arr = [];
    var degree_level = $('.degree_dropdown').val();
   
    if(degree_level == 'lang_school' || degree_level == 'high_school'){
        if($("[name='UK']").hasClass('flag_selected')) {
            $('#form_step6').removeClass('hide_page');
            $('#form_step6 .step').addClass('active');
            $('#form_tests').hide();
        } else if($("[name='USA']").hasClass('flag_selected')) {
            $('#form_step6').addClass('hide_page');
            $('#form_step6 .step').removeClass('active');
            $('#form_tests').show();
        }
    }else if(degree_level == 'university'){
         $('.degree_selected').each(function(){
            var degree_selected = $(this).find('.degree_choice').attr('name');
            var selected_num = $('.degree_selected').length;
            if(selected_num == 1 && (degree_selected == 'Bachelor' || degree_selected == 'Foundation' || degree_selected == 'Degree')){
                $('#form_step6').removeClass('hide_page');
                $('#form_step6 .step').addClass('active');
            }else{
                //$('#form_work').removeClass('hide_page');
                //$('#form_work .step').addClass('active');
                if($("[name='USA']").hasClass('flag_selected')) {
                    $('#form_tests').removeClass('hide_page');
                    $('#form_tests .step').addClass('active');
                } else {
                    $('#form_work').removeClass('hide_page');
                    $('#form_work .step').addClass('active');
                }
            }
        });
    }
    var wantsIELTS = $('.want_class input:checked').length;

    if(eng_ids.length != 0){ 
       /* $('<div id="final_eng_q">\
                <div class="blue_font_title">YOUR ENGLISH QUALIFICATION\
                    <div class="link_page link_page_3" data-hook="form_eng"><span class="page_back_arrow">🡨<\/span><\/div>\
                <\/div>\
                <table class="info_table">\
                    <tbody>\
                    <\/tbody>\
                <\/table>\
                <hr>\
            <\/div>').insertAfter($('#final_education'));*/
       $("#final_eng_q").show();
    }

    eng_ids.forEach(function(index) {
        
        var exam_type = $('#eng_block' + index + ' .eng_selection :selected').val();
        var score_overall = $('#eng_block' + index + ' .score_input_overall').val();
        var score_listening = $('#eng_block' + index + ' .score_input_listening').val();
        var score_speaking = $('#eng_block' + index + ' .score_input_speaking').val();
        var score_writing = $('#eng_block' + index + ' .score_input_writing').val();
        var score_reading = $('#eng_block' + index + ' .score_input_reading').val();
        var date = $('#date_input' + index).val();

        $('#final_eng_q tbody').append('<tr>\
                <td class="table_info_title">Qualification Type:<\/td>\
                <td class="table_info_ans stu_end_q_type" name="q_type">' + exam_type + '<\/td>\
            <\/tr>\
            <tr>\
                <td class="table_info_title">Score:<\/td>\
                <td class="table_info_ans stu_q_score" name="q_score">' + score_overall + " (Listening : " + score_listening + ", Speaking : " + score_speaking + ", Writing : " + score_writing + ", Reading : " + score_reading + ")" +'<\/td>\
            <\/tr>\
            <tr>\
                <td class="table_info_title">Test Date:<\/td>\
                <td class="table_info_ans stu_q_date" name="q_date">' + date + '<\/td>\
            <\/tr>'
        );
        var qulification_arr_title = ['type','score_overall', 'score_listening', 'score_speaking', 'score_writing', 'score_reading', 'date'];
        var qulification_arr_ans = [exam_type, score_overall, score_listening, score_speaking, score_writing, score_reading, date];
        var obj_eng = {};
        for (var i = 0; i < qulification_arr_title.length; i++) {
            obj_eng[qulification_arr_title[i]] = qulification_arr_ans[i];
        }
        var asJSON_eng = /*JSON.stringify*/(obj_eng);
        qualification_arr.push(asJSON_eng);
    });
    
    var language_title_arr = ["wantsIELTS" , "qualifications"];
    var language_ans_arr= [];
    if(wantsIELTS == 1){
        language_ans_arr.push(1);
    }else{
        language_ans_arr.push(0);
    }
    if(eng_ids != undefined){
        language_ans_arr.push(qualification_arr);
    }else{
        language_ans_arr.push(null);
    }

    var obj_final_eng = {};
    for (var i = 0; i < language_title_arr.length; i++) {
        obj_final_eng[language_title_arr[i]] = language_ans_arr[i];
    }
    asJSON_lang = /*JSON.stringify*/(obj_final_eng);
});
//Page Standardized Tests

var count_tests = 0;
$('body').on('click', '.add_new_tests', function(){
    failForm(this);
    count_tests ++;
    $('.tests_exam_score').append($('.standardized_tests_template').html());
    $('.standardized_tests_block').last().attr({
        'style':'display:block',
        'id':'standardized_tests_block'+ count_tests
    });
    addStandardTests(count_tests);
});

$('input[name=tests]').on('click', function(){
    if($(this).val() == 'yes'){     
        count_tests ++;
        $('.add_new_tests').show();
        $('.tests_exam_score').append($('.standardized_tests_template').html());
        $('.standardized_tests_block').last().attr({
            'style':'display:block',
            'id':'standardized_tests_block'+ count_tests
        });
        addStandardTests(count_tests);
        failForm(this);
    }else{
        $('.standardized_tests_block').css('display','none');
        $('.tests_exam_score').empty();
        $('.add_new_tests').hide();
        okayForm(this);
    }
});

function addStandardTests(count_tests){
    $('.standardized_tests_block .standardized_tests_date').last().attr('id','standardized_tests_date'+ count_tests);
    $('.standardized_tests_block .date_input_tests').last().attr('id','date_input_tests'+ count_tests);
    
    $('#standardized_tests_date'+ count_tests +':visible').calendar({
        type: 'date',
        startMode: 'year', 
        monthFirst: true,
        onChange: function(dateText, inst) {
            $("#date_input_tests"+ count_tests).attr('data-date', inst);
            $('#standardized_tests_block'+ count_tests + ' .standardized_tests_input').trigger('keyup');
            check_tests(this);
        },
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var day = date.getDate() + '';
                if (day.length < 2) {
                    day = '0' + day;
                }
                var month = (date.getMonth() + 1) + '';
                if (month.length < 2) {
                    month = '0' + month;
                }
                var year = date.getFullYear();
                return year + '/' + month + '/' + day;
            }
        }
    });
}

$('body').on('click', '.delete_tests_block', function(){
    var has_tests = $('.standardized_tests_block:visible').length; //default is 1 (which is template's)
    $(this).parents('.standardized_tests_block').remove();
    if(has_tests === 1){
        failForm(this);
        $('#form_tests').children('.step').removeClass('confirmed');
    } else {
        check_tests(this);
    }
});

$('body').on('keyup', '.standardized_tests_input', function(){
    check_tests(this);
});

$('body').on('keyup', '.standardized_tests_input', function(){
    var input_id = $(this).parents('.standardized_tests_block').attr('id');
    var exam_type = $('#' + input_id + ' .tests_selection :selected').val();
    var score = $(this).val();
    if(ValidateStandardizedTests(exam_type, score) == true){
        $(this).css('border-bottom','2px solid #70FFDB');
        $(this).attr('data-check','true');
    }else{
        $(this).css('border-bottom','2px solid red');
        $(this).attr('data-check','false');
        failForm(this);
    }
    check_tests(this);
});

function ValidateStandardizedTests(exam_type, score){
    var regExpression = {};
    regExpression["SAT"] = /^(?!0$)\d+(?:[,.][05])?$/;
    regExpression["ACT"] = /^(?!0$)\d+(?:[,.][05])?$/;
    regExpression["GRE"] = /^\d+$/;
    regExpression["GMAT"] = /^\d+$/;

    var maxValue = {};
    maxValue["SAT"] = 1600;
    maxValue["ACT"] = 36;
    maxValue["GRE"] = 340;
    maxValue["GMAT"] = 800;
    return (regExpression[exam_type].test(score) && score <= maxValue[exam_type]);
}

function check_tests(k){
    var empty = 0;
    var eng_id = $(k).parents('.standardized_tests_block').attr('id').replace('standardized_tests_block', '');
    var input_id = $(k).parents('.standardized_tests_block').attr('id');
    var date_pick = $('#date_input_tests'+ eng_id ).attr('data-date');
    var exam_type = $('#' + input_id + ' .tests_selection :selected').val();
    let valid = true;
    var score = $(k).val();
    $('.standardized_tests_input:visible').each(function(){
        if($(this).val() == ''){
            empty++;
        }
    });
    $('.date_input_tests:visible').each(function(){
        if($(this).attr('data-date') == undefined){
            empty++;
        }
    });

    $('#' + input_id).find('.standardized_tests_input').each(function () {
        if ($(this).attr('data-check') == "false") {
            valid = false;
            return false;
        }
    });

    if((empty == 0) && (valid == true) && (date_pick != undefined)){
        okayForm(k);
    }else{
        failForm(k);
    }
}

$('body').off('click','#tests_btn');
$('body').on('click','#tests_btn', function(){
    $('#final_standardized_test tbody tr').remove();
    var tests_ids = [];
    $('.tests_exam_score').children('.standardized_tests_block:visible').each(function(){
        tests_ids.push($(this).attr('id').replace('standardized_tests_block', ''));
    });
    if(tests_ids.length != 0){ 
        /*$('<div id="final_standardized_test">\
                <div class="blue_font_title">STANDARDIZED TESTS\
                    <div class="link_page link_page_3" data-hook="form_tests"><span class="page_back_arrow back_standard_tests">🡨<\/span><\/div>\
                <\/div>\
                <table class="info_table">\
                    <tbody>\
                    <\/tbody>\
                <\/table>\
                <hr>\
            <\/div>').insertBefore($('#final_contactinfo'));*/
        if(jQuery.isArray(asJSON_std_tests) == false) {
            asJSON_std_tests = [];
        }

        $("#final_standardized_test").show();
    
        tests_ids.forEach(function(index){

            var type = $('#standardized_tests_block'+index + ' .tests_selection').val();
            var score = $('#standardized_tests_block'+index + ' .standardized_tests_input').val();
            var test_date = $('#date_input_tests'+index).val();
            asJSON_std_tests.push({"type":type,"total_score":score,"date":test_date});

            //Create template for Summary page

            $('#final_standardized_test tbody').append('<tr>\
                    <td class="table_info_title">Type:<\/td>\
                    <td class="table_info_ans stu_type_tests" name="test_type">' + type + '<\/td>\
                <\/tr>\
                <tr>\
                    <td class="table_info_title">Score:<\/td>\
                    <td class="table_info_ans stu_score_tests" name="test_score">' + score + '<\/td>\
                <\/tr>\
                <tr>\
                    <td class="table_info_title">Date:<\/td>\
                    <td class="table_info_ans stu_date_tests" name="test_date">' + test_date + '<\/td>\
                <\/tr></div>'
            );

        });
    }else{
        asJSON_std_tests = null;
    }

    var degree_level = $('.degree_dropdown').val();
    if(degree_level == 'lang_school' || degree_level == 'high_school') {
        $('#form_step6').removeClass('hide_page');
        $('#form_step6 .step').addClass('active');
        //$('#form_step6').css('display','block');
        //$('#form_step6 .step').addClass('active');
    }else{
        $('#form_work').css('display','block');
        $('#form_work .step').addClass('active');
    }
    settingPosition();
}); 

//page work experience
var count_work_exp = 0;
$('body').on('click', '.add_new_job', function(){
    failForm(this);
    count_work_exp++;
    $(this).text('ADD ONE MORE');
    $('.work_detail').append($('.work_template').html());
    $('.work_block').last().attr({
        'style':'display:block',
        'id':'work_block'+ count_work_exp
    });
    $('.start_work').last().attr('id','start_work'+ count_work_exp);
    $('.end_work').last().attr('id','end_work'+ count_work_exp);
    $('#work_block'+ count_work_exp).find('input[name="end_year_radio"]').attr('name', 'end_year_radio'+ count_work_exp);
    $('#work_block'+ count_work_exp).find('.end_year_btn input').attr('id', 'end'+ count_work_exp);
    $('#work_block'+ count_work_exp).find('label[for="end"]').attr('for', 'end'+ count_work_exp);
    $('#work_block'+ count_work_exp).find('input[name="end_year_radio'+ count_work_exp+'"]').last().attr('id', 'ongoing'+ count_work_exp);
    $('#work_block'+ count_work_exp).find('label[for="ongoing"]').attr('for', 'ongoing'+ count_work_exp);
    createStartCalendar(count_work_exp);
    createEndCalendar(count_work_exp);
});
//
function createStartCalendar(k){
    $('#start_work'+ k).calendar({
        type: 'month',
        startMode: 'year', 
        monthFirst: true,
        onChange: function(dateText, inst) {
            $("#start_work"+ k + " .start_work_input").attr('data-birth', inst);
            var m_start = inst;
            var m_end = $('#end_work'+ k +' .start_work_input').attr('data-birth');
            if(m_start > m_end){
                $('#end_work'+ k +' .ui.input input').css('border','1px solid #f24');
                $('#work_block' + k + ' .start_work_input').attr('data-check', false);
                failForm(this);
            }else{
                $('#end_work'+ k +' .ui.input input').css('border','1px solid rgba(34,36,38,.15)');
                $('#work_block' + k + ' .start_work_input').attr('data-check', true);
                $('#end' + k).attr('data-check', true);
                check_work_field(this);
            }
            check_work_field(this);
            check_date(this);
        },
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var day = date.getDate() + '';
                if (day.length < 2) {
                    day = '0' + day;
                }
                var month = (date.getMonth() + 1) + '';
                if (month.length < 2) {
                    month = '0' + month;
                }
                var year = date.getFullYear();
                return year + '/' + month;
            }
            
        }
    });
}
//
function createEndCalendar(k){
    $('#end_work'+ k).calendar({
        type: 'month',
        startMode: 'year', 
        monthFirst: true,
        onChange: function(dateText, inst) {
            $("#end_work"+ k + " .end_work_input").attr('data-birth', inst);
            var m_start = $('#start_work'+ k +' .start_work_input').attr('data-birth');
            var m_end = inst;
            if(m_start > m_end){
                $('#end_work'+ k +' .ui.input input').css('border','1px solid #f24');
                $('#work_block' + k + ' .start_work_input').attr('data-check', false);
                failForm(this);
            }else{
                $('#end_work'+ k +' .ui.input input').css('border','1px solid rgba(34,36,38,.15)');
                $('#work_block' + k + ' .start_work_input').attr('data-check', true);
                $('#end' + k).attr('data-check', true);
                check_work_field(this);
            }
            check_work_field(this);
            check_date(this);
        },
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var day = date.getDate() + '';
                if (day.length < 2) {
                    day = '0' + day;
                }
                var month = (date.getMonth() + 1) + '';
                if (month.length < 2) {
                    month = '0' + month;
                }
                var year = date.getFullYear();
                return year + '/' + month;
            }
            
        }
    });
}
//
$('body').on('click', 'input[name^="end_year_radio"]', function(){
    var e = $(this);
    var radio_id = $(this).attr('name').replace('end_year_radio', '');
    var check_radio = e.val();
    var work_id = $(this).parents('.work_block').attr('id').replace('work_block', '');
    var radio_checked = $('input[name="end_year_radio' + work_id + '"]:checked').val();
    if(radio_checked == 'end'){
        $('#end' + work_id).attr('data-check', false);
        failForm(this);
    }else if(radio_checked == 'ongoing'){
        $('#end' + work_id).attr('data-check', true);
    }
    // check_work_field(this);
    $('.work_field:last').trigger('keyup');
    if(check_radio == 'end'){
        $('#work_block' + radio_id + ' .end_year_block').show();
        $('#work_block' + radio_id + ' .end_work_input').val('');
        $('#work_block' + radio_id + ' .end_work_input').attr('data-birth','');
    }else{
        $('#work_block' + radio_id + ' .end_year_block').hide();
        $('#work_block' + radio_id + ' .start_work_input').attr('data-check', true);
    }
    check_date(this);
    check_work_field(this);
});
//
$('body').on('click', '.delete_work_block', function(){
    var has_work = $('.company_name').length-1; //default is 1 (which is template's)
    $(this).parents('.work_block').remove();
    if(has_work == 1){ //no work exp
        okayForm(this);
        $('#form_work').children('.step').addClass('confirmed');
    }else{
        failForm(this);
    }
    check_work_field(this);
});
//
$('body').on('keyup', '.work_field', function(){
    check_work_field(this);
    check_date(this);
});
//
$('body').on('change', '.start_work_input', function(){
    check_work_field(this);
});
//
$('body').on('mouseup', '.end_work_input', function(){
    var input_block_id = $(this).parents().closest('.end_work').attr('id');
    createEndCalendar(input_block_id);
    // var input_block_id_num = $(this).parents().closest('.end_work').attr('id').replace('work_block','');
    var start_mon = $('#'+ input_block_id).find('.start_work_input').attr('data-birth');
    var end_mon = $('#'+ input_block_id).find('.end_work_input').attr('data-birth');
    if(start_mon > end_mon){
        $('#'+ input_block_id +' .ui.input input').css('border','1px solid #f24');
    }
    $(this).parents().find('.work_field').trigger('keyup');
    $('.job_desc_textarea').trigger('keyup');
    var id = $(this).parents('.end_work').closest().attr('id');
    check_work_field(this);
    check_date(this);
});
//
$('input[value=end]').on('click', function(){
    var work_id = $(this).parents('.work_block').attr('id').replace('work_block', '');
    $('#end' + work_id).attr('data-check', false);
    failForm(this);
});
//
$('input[value=ongoing]').on('click', function(){
    var work_id = $(this).parents('.work_block').attr('id').replace('work_block', '');
    $('#end' + work_id).attr('data-check', true);
    // failForm(this);
});
//
function check_work_field(k){
    $('.work_block').each(function(){
        var work_empty = 0;
        var check_end_date = $('input[value=end]').attr('data-check');
        if(check_end_date == 'false'){
            failForm(k);
        }
        var work_id = $(k).parents('.work_block').attr('id').replace('work_block', '');
        var start_work_input = $('#work_block' + work_id + ' .start_work_input').val();
        var start_check = $('#work_block' + work_id + ' .start_work_input').attr('data-check');
        var end_check = $('#end' + work_id).attr('data-check');
        var ongoing_check = $('#ongoing' + work_id).attr('data-check');
        var radio_checked = $('input[name="end_year_radio' + work_id + '"]:checked').val();
        var start_time = $('#work_block' + work_id + ' .start_work_input').attr('data-birth');
        var end_time = $('#work_block' + work_id + ' .end_work_input:visible').attr('data-birth');
        $('#work_block'+ work_id +' .work_field').each(function(){
            if($(this).val() == ''){
                work_empty++;
            }
        });
        if(end_time != '' && (start_time < end_time)){
            $('#work_block' + work_id + ' .start_work_input').attr('data-check', true);
            $('#work_block' + work_id + ' .end_work_input').attr('data-check', true);
        }else if(end_time != '' && (start_time > end_time)){
            $('#end' + work_id).attr('data-check', false);
        }else if(end_time == ''){
            $('#end' + work_id).attr('data-check', false);
        }else{
            $('#end' + work_id).attr('data-check', true);
        }

        $('.work_block input[value=end]').each(function(){
            if(work_empty == 0 && $('#end' + work_id).attr('data-check') == 'true' ){
                okayForm(k);
            }else{
                failForm(k);
            }
        });
    });
}
//
function check_date(i){
    $('.work_block:visible input[value=end]').each(function(){
        var check_false = $('.work_block:visible input[value=end][data-check=false]').length;
        // console.log(check_false);
        if(check_false > 0){
            failForm(i);
        }
    });
}
//
var work_array = [];
$('body').on('click', '#work_btn', function(){
    $('.info_check').find('[id^=final_work]').empty();
    work_array = [];
    $('.work_block:visible').each(function(){
        var work_id = $(this).attr('id').replace('work_block', '');
        var company_name = $('#work_block' + work_id + ' .company_name input').val();
        var country = $('#work_block' + work_id + ' .country_work').val();
        var country_text = $('#work_block' + work_id + ' .country_work :selected').text();
        var job_title = $('#work_block' + work_id + ' .job_title input').val();
        var job_desc = $('#work_block' + work_id + ' .job_desc_textarea').val();
        var start_time = $('#work_block' + work_id + ' .start_work_input').attr('data-birth');
        var radio_checked = $('input[name="end_year_radio' + work_id + '"]:checked').val();
        var end = $('#work_block' + work_id + ' .end_work_input').attr('data-birth');
        var work_exp_ans_arr;

        if(company_name != ''){ //there's some work exp
            $('<div id="final_work' + work_id + '">'+
                '<div class="blue_font_title">WORK EXPERIENCE '+
                    '<div class="link_page link_page_1" data-hook="form_work"><span class="page_back_arrow">🡨</span></div>'+
                '</div>'+
                '<table class="info_table" id="work' + work_id + '">'+
                    '<tbody>'+
                        '<tr>'+
                            '<td class="table_info_title">Company name:</td>'+
                            '<td class="table_info_ans" name="companyName">' + company_name + '</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="table_info_title">Country:</td>'+
                            '<td class="table_info_ans" name="countryName">' + country_text + '</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="table_info_title">Job title:</td>'+
                            '<td class="table_info_ans" name="jobTitle">' + job_title + '</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="table_info_title">Start year:</td>'+
                            '<td class="table_info_ans" name="strat_year">' + start_time + '</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="table_info_title">End year:</td>'+
                (radio_checked == 'ongoing' ? '<td class="table_info_ans" name="end_year">ongoing</td>' : '<td class="table_info_ans" name="end_year">' + end + '</td>') +

                        '</tr>'+
                        '<tr>'+
                            '<td class="table_info_title">Job description:</td>'+
                            '<td class="table_info_ans" name="job_description">' + job_desc + '</td>'+
                        '</tr>'+
                    '</tbody>'+
                '</table>'+
                '<hr>'+
            '</div>').insertBefore("#final_contactinfo");
        }

        var work_exp_title_arr = ["company" , "country" , "jobTitle" , "jobDescription", "start", "end"];
        if(radio_checked == 'end'){
            work_exp_ans_arr = [company_name, country, job_title, job_desc, start_time, end];
        }else{
            work_exp_ans_arr = [company_name, country, job_title, job_desc, start_time, null];
        }

        var obj_work = {};
        for (var i = 0; i < work_exp_title_arr.length; i++) {
            obj_work[work_exp_title_arr[i]] = work_exp_ans_arr[i];
        }
        var asJSON_work = /*JSON.stringify*/(obj_work);
        work_array.push(asJSON_work);
        work_id++;
    });
});

function page6_input_validate(i){
    var email_field = $(i).parents().find('.email_field').val();
    var mobile_number_field = $(i).parents().find('.mobile_number_field').val();
    var city_field = $(i).parents().find('.city_field').val();
    var address_field = $(i).parents().find('.address_field').val();
    var post_code =  $(i).parents().find('.post_code').val();
    var empty = 0;
    var valid = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email_field) && true;
    
    if(valid == false){
        $('.email_field').css({'border-bottom':'2px solid #f24'});
        $('.email_field').attr('data-check','false');
        var check_email = $('.email_field').attr('data-check');
    }
    else if(valid == true){
        $('.email_field').css({'border':'none'});
        $('.email_field').attr('data-check','true');
        var check_email = $('.email_field').attr('data-check');
    }
    $('.step6_field').each(function(){
        var element = $(this);
        if(element.is("input") && element.val() == ''){
            empty++;
        }else if(element.is("select") && element.children("option:selected").attr("value") == null){
            empty++;
        }else if(empty > 0){
            failForm(element);
        }
    });

    if(empty == 0 && check_email == 'true' ){
        okayForm($(i));
    }
    else if(empty != 0 || check_email == 'false'){
        failForm($(i));
    }
}
//
$('.degree_level').change(function(){
    var degree_level = $('.stu_degree_level:selected').attr('name');
    if(degree_level == 'High School'){
        $('.high_sch_row').hide();
        $('.stu_degree_fos, .degree_title_field').removeClass('step5_field');
    }else{
        $('.high_sch_row').show();
        $('.stu_degree_fos, .degree_title_field').addClass('step5_field');
    }
});
//
$('#sec_stu_degree_level').on('change', function(){
    var sec_degree = $('.sec_stu_degree_level:selected').attr('name');
    var sec_degree_id = $('.sec_stu_degree_level:selected').attr('value');
    $('.sec_stu_profile_degree').empty().append(sec_degree);
    if(sec_degree == 'High School'){
        $('.high_sch_row_2').hide();
        $('.sec_stu_degree_fos, .sec_degree_title_field').removeClass('step5_field');
    }else{
        $('.high_sch_row_2').show();
        $('.sec_stu_degree_fos, .sec_degree_title_field').addClass('step5_field');
    }
});
//
$('#third_stu_degree_level').on('change', function(){
    var third_degree = $('.third_stu_degree_level:selected').attr('name');
    var third_degree_id = $('.third_stu_degree_level:selected').attr('value');

    if(third_degree == 'High School'){
        $('.high_sch_row_3').hide();
        $('.third_stu_degree_fos, .third_degree_title_field').removeClass('step5_field');
    }else{
        $('.high_sch_row_3').show();
        $('.third_stu_degree_fos, .third_degree_title_field').addClass('step5_field');
    }
});
//dynamic value show in the last page(student's profile)
$('body').on('click', '.next_page_button', function(){
    var gender_select = $('.gender_click').length;
    if(gender_select > 0){
        var stu_gender = $('.gender_click').attr('value');
        $('.student_gender').empty().append(stu_gender);
        if(stu_gender == 'M'){
            $('.stu_photo').empty().append("<img src='/image/boy.png' width='70px' height='70px'>");
        }else{
            $('.stu_photo').empty().append("<img src='/image/girl.png' width='70px' height='70px'>");
        }
    }
    //eng_firstname
    $('.student_eng_firstname, .student_eng_lastname, .stu_name, .student_local_name, .student_study_year, .student_study_month, .stu_profile_email, .stu_profile_mobile_number, .stu_profile_city, .stu_profile_address, .stu_profile_postcode, .stu_profile_contact_time, .stu_profile_degree, .stu_degree_start_year, .stu_degree_end_year, .stu_profile_title_name, .degree_gpa, .stu_profile_degree_top, .stu_profile_uni_name, .stu_profile_contact_preferred_way, .sec_stu_profile_degree, .third_stu_profile_degree').empty();
    var name = $('.eng_firstname_field').val();
    $('.student_eng_firstname').append(name);
    $('.stu_name').append(name);
    //eng_lastname
    var last_name = $('.eng_lastname_field').val();
    $('.student_eng_lastname').append(last_name);
    //local_name
    var local_name = $('.local_name_field').val();
    $('.student_local_name').append(local_name);
    //stu_study_year
    var student_study_year = $('.study_year_select').attr('name');
    $('.student_study_year').append(student_study_year);
    //stu_study_month
    var student_study_month = $('.month_selected').attr('name');
    $('.student_study_month').append(student_study_month);
    var email_field = $(this).parents().find('.email_field').val();
    $('.stu_profile_email').append(email_field);
    var mobile_number_field = $(this).parents().find('.mobile_number_field').val();
    $('.stu_profile_mobile_number').append(mobile_number_field);
    var city_field =  $(this).parents().find('.city_field').val();
    $('.stu_profile_city').append(city_field);
    var address_field = $(this).parents().find('.address_field').val();
    $('.stu_profile_address').append(address_field);
    var post_code = $(this).parents().find('.post_code').val();
    $('.stu_profile_postcode').append(post_code);
    var contact_time = $('.contact_time_selection:selected').val();
    $('.stu_profile_contact_time').append(contact_time);
    var degree = $('.stu_degree_level:selected').attr('name');
    var degree_id = $('.stu_degree_level:selected').attr('value');
    $('.stu_profile_degree').append(degree);
    var profile_degree_start_year = $('.degree_start_year_field').val();
    $('.stu_degree_start_year').append(profile_degree_start_year);
    var profile_degree_end_year = $('.degree_end_year_field').val();
    $('.stu_degree_end_year').append(profile_degree_end_year);
    var degree_title_field = $('.degree_title_field').val();
    $('.stu_profile_title_name').append(degree_title_field);
    var degree_gpa_field = $('.degree_gpa_field').val();
    $('.degree_gpa').append(degree_gpa_field);
    var profile_uni_name = $('.stu_degree_uni').val();
    $('.stu_profile_uni_name').append(profile_uni_name);
    var profile_degree_fos = $('.stu_degree_fos').val();
    $('.stu_profile_fos_name').append(profile_degree_fos);
    var contact_prefer = $('.contact_prefer_selection:selected').val();
    $('.stu_profile_contact_preferred_way').append(contact_prefer);
    var sec_degree = $('.sec_stu_degree_level:selected').attr('name');
    var sec_degree_id = $('.sec_stu_degree_level:selected').attr('value');
    $('.sec_stu_profile_degree').append(sec_degree);
    var third_degree = $('.third_stu_degree_level:selected').attr('name');
    var third_degree_id = $('.third_stu_degree_level:selected').attr('value');
    $('.third_stu_profile_degree').append(third_degree);
});
//
$('.visible_degree').each(function(){
    var str = $('input .step5_field').serialize();
});

//hide and show the sub option based on the selected option radiobutton
$('.suboption').hide();
$('.market_question').off('change');
$('.market_question').on('change', function() {
    $('.market_question').each(function() {
        data_question_id = $(this).attr('data-question-id');    
        data_question_type = $(this).attr('data-question-type');
        var i =0;

        if(data_question_type == "single") {
            $('input[name="q'+data_question_id+'_radio"]').each(function(){
                    var data_radio_id = $(this).attr('data-radio-id');
                    if($("#q"+data_question_id+"_op"+data_radio_id+"").is(':checked')) {
                        $('[data-option-id='+data_radio_id+'][data-option-type='+data_question_type+']').show();
                    }else {
                        $('[data-option-id='+data_radio_id+'][data-option-type='+data_question_type+']').hide();
                        $('input[name="q'+data_question_id+'_sub'+data_radio_id+'_radio"]').prop('checked', false);
                    }//
            }); 
        }else if(data_question_type == "multiple") {
            /* $('input[name="q'+data_question_id+'_checkbox"]').each(function(){
                var opt_is_check = $(this).is(':checked');
                var chx_id = $(this).attr('data-chx-id');
                if($("#q"+data_question_id+"_op"+chx_id+"").is(':checked')) {
                    $('[data-option-id='+chx_id+'][data-option-type='+data_question_type+']').show();
                    
                }else {
                    
                    $('[data-option-id='+chx_id+'][data-option-type='+data_question_type+']').hide();
                    $('input[name="q'+data_question_id+'_sub'+chx_id+'_checkbox"]').prop('checked', false);
                }
            });*/
        }  
        
    });
            
});
//
var final_mkt_array = [];
$('#mkt_btn').click(function(){
    var ans_value_id_arr;
    var ans_value_text_arr;
    var data_question_id, question, data_question_type;
    var mkt_array = [];
    var new_free_array = [];
    ans_mkt_array = [];
    final_mkt_array = [];
    questionnaire_id = $('.mkt_content').attr('data-questionnaire-id');
    
    $('.market_question').each(function(){
        var marketing_title_arr = ["id" , "question" , "type" , "answers"];
        var marketing_ans_arr = [data_question_id, question, data_question_type, ans_value_arr];
        var status_json = 0;
        var obj_mkt = {};
        var obj_mkt_answers = {};
        for (var i = 0; i < marketing_title_arr.length; i++) {
            obj_mkt[marketing_title_arr[i]] = marketing_ans_arr[i];
        }
        var asJSON_mkt = /*JSON.stringify*/(obj_mkt);
        var ans_value_arr = [];
        var subAnswers = [];
        
        data_question_id = $(this).attr('data-question-id');
        data_question_type = $(this).attr('data-question-type');
        question = $(this).children('.mkt_quest').text().trim();
        
        if(data_question_type == 'single'){
            status_json = 1;
            ans_value_id_arr  = [];
            ans_value_text_arr = [];
            var answer_id = $(this).find('input:checked').attr('data-radio-id');
            var answer_text = $(this).find('input:checked').next('label:first').text().trim();
            ans_value_id_arr.push(answer_id);
            ans_value_text_arr.push(answer_text);
            
            var sub_answer_id = $("[data-option-id='"+answer_id+"']").find('input:checked').attr('data-radio-id');
            var sub_answer_text = $("[data-option-id='"+answer_id+"']").find('input:checked').next('label').text().trim();
            if(sub_answer_id && sub_answer_text){
                subAnswers.push({"optId":sub_answer_id, "optText": sub_answer_text});
            }
        
        }else if(data_question_type == 'multiple'){
            ans_value_id_arr = [];
            ans_value_text_arr = [];
            var obj_multiple = {};
            $('[data-ans-id='+ data_question_id +']').each(function(){
                var opt_is_check = $(this).is(':checked');
                if(opt_is_check == true){
                    var answer_id = $(this).attr('data-chx-id');
                    var answer_text = $(this).next('label').text().trim();
                    ans_value_id_arr.push(answer_id);
                    ans_value_text_arr.push(answer_text);
                }
                if($('input[name="q'+data_question_id+'_checkbox"]:checked').length != 0){
                    status_json=1;
                }
            });
        }else{
            var free_arr;
            var obj_free = {};
            ans_value_id_arr = [];
            ans_value_text_arr = [];
            $('[data-ans-id='+ data_question_id +']').each(function(){
                var answer_id = null;
                var answer_text = $(this).val();
                ans_value_id_arr.push(answer_id);
                ans_value_text_arr.push(answer_text);
            });
        }

        for (var j = 0; j < ans_value_id_arr.length; j++) {
            if(Object.keys(subAnswers).length != 0) {
                ans_value_arr.push({"optId":ans_value_id_arr[j], "optText": ans_value_text_arr[j], subAnswers});
            }else {
                ans_value_arr.push({"optId":ans_value_id_arr[j], "optText": ans_value_text_arr[j]});
            }
        }

        if(status_json == 1){
            mkt_array = {
                "id":data_question_id,
                "question":question,
                "type":data_question_type,
                "answers":ans_value_arr,
            };
            ans_mkt_array.push(mkt_array);
        }
        
    });
    final_mkt_array = {"questionnaireId":questionnaire_id,"questionnaire":ans_mkt_array};
    console.log(JSON.stringify(final_mkt_array));
});
//page slide left and right
$(document).ready(function(){
    settingPosition();
});
//
function settingPosition(){
    var windowWidth = $('.left:first-child').position('.page_slides').left;
    $('.left').each(function(){
       var thisPosition = $(this).position().left;
       $(this).attr('data-position', thisPosition);     
    });

    $('.step-cover').on('click', function(){
        var thisPosition = $(this).position();
        $(this).attr('data-position', thisPosition);
        var setPosition = $(this).parents('.left').attr('data-position');
        $('.step').removeClass('active');
        $(this).parent('.step').addClass('active');
        $("#main").animate({
           scrollLeft: setPosition - windowWidth
        }, 200, function(){});
        $("html").animate({
           scrollTop: 0
        }, 200, function(){});
     });

    $('body').on('click', '.archor .link_page', function(){
        var hookID = $(this).attr('data-hook'),
            hookPosition = $('#' + hookID).attr('data-position');
        $('.step').removeClass('active');
        $('.step').addClass('confirmed');
        // $('.left').addClass('hide_page');
        $('#' + hookID).find('.step').addClass('active');
        // $('#' + hookID).removeClass('hide_page');
        $("#main").animate({
           scrollLeft: hookPosition - windowWidth
        }, 200, function(){});
        $("html").animate({
           scrollTop: 0
        }, 200, function(){});
     });
};

//JSON
function submitJson(){
    var company_name = $('.work_block').length;
    var do_we_have_degree1 = $('.table_info_ans').length;
    var do_we_have_degree2 = $('.table_info_ans_2').length;
    var do_we_have_degree3 = $('.table_info_ans_3').length;
    var personal_title_arr = [];
    var personal_ans_arr = [];
    var academic_title_arr = [];
    var academic_ans_arr = [];
    var academic_title_arr_2 = [];
    var academic_ans_arr_2 = [];
    var academic_title_arr_3 = [];
    var academic_ans_arr_3 = [];
    var contact_title_arr = [];
    var contact_ans_arr = [];
    var level_arr = [];
    var fos_array =[];
    var uni_arr = [];
    var marketing = [];

    var degree1_gpa_esti = $('#degree1').find('.gpa_estimated').hasClass('gpa_estimated_checked');
    var degree2_gpa_esti = $('#degree2').find('.gpa_estimated').hasClass('gpa_estimated_checked');
    var degree3_gpa_esti = $('#degree3').find('.gpa_estimated').hasClass('gpa_estimated_checked');
    var degree1_the_topest_deg = $('#degree1').find('div').hasClass('topest_checked');
    var degree2_the_topest_deg = $('#degree2').find('div').hasClass('topest_checked');
    var degree3_the_topest_deg = $('#degree3').find('div').hasClass('topest_checked');

    var student_study_destination = $('.student_study_destination').attr('id');
    var deperature_year =  $('.student_study_year').text();
    var deperature_month = $('.student_study_month').text();

    var degreeGroupId_1 = $('.stu_degree_level:selected').attr('value');
    var degreeGroupId_2 = $('.sec_stu_degree_level:selected').attr('value');
    var degreeGroupId_3 = $('.third_stu_degree_level:selected').attr('value');
    var degreeGroupId_title = 'degreeGroupId';

    var degree_uni_id = 'universityId';
    var degree_universityId = $('#degree1').find('.stu_degree_uni').attr('data-id');
    var sec_degree_universityId = $('#degree2').find('.sec_stu_degree_uni').attr('data-id');
    var third_degree_universityId = $('#degree3').find('.third_stu_degree_uni').attr('data-id');

    var gpa_sys_title = 'gpaSystem';
    var gpa_system_1 = $('#degree1').find('#gpa_selection_1').val();
    var gpa_system_2 = $('#degree2').find('#gpa_selection_2').val();
    var gpa_system_3 = $('#degree3').find('#gpa_selection_3').val();

    var fosId_title = 'fosId';
    var degree_fosId_1 = $('#fos_name_selected1').attr('data-fos-id');
    var degree_fosId_2 = $('#fos_name_selected2').attr('data-fos-id');
    var degree_fosId_3 = $('#fos_name_selected3').attr('data-fos-id');
    
    $('#personal tr').each(function() {
        var personal_title = $(this).find('.table_info_ans').attr('name');
        var personal_ans = $(this).find('.table_info_ans').text();    
        
        personal_title_arr.push(personal_title);
        personal_ans_arr.push(personal_ans);
    });

    $('.aca_table').each(function(){
        $('#academic tr').each(function() {
            var academic_title = $(this).find('.table_info_ans').attr('name');
            var academic_ans = $(this).find('.table_info_ans').text();
            var fos_exist = $('.stu_profile_fos_name').val();   
            var uni_id = $('.stu_degree_uni').attr('data-id'); 
            var gpa_title = 'gpaIsEstimated';
            if(degree1_gpa_esti == true){
                var gpa_ans = '1';
            }else{
                var gpa_ans = '0';
            }
            academic_title_arr.push(academic_title, gpa_title, degreeGroupId_title, degree_uni_id, gpa_sys_title);
            academic_ans_arr.push(academic_ans, gpa_ans, degreeGroupId_1, degree_universityId, gpa_system_1);
            if(degree_fosId_1 != undefined){
                academic_title_arr.push(fosId_title);
                academic_ans_arr.push(degree_fosId_1);
            }else if(fos_exist == ''){
                academic_title_arr.push(fosId_title);
                academic_ans_arr.push(null);
            }
            if(uni_id != undefined){
                academic_title_arr.push(degree_uni_id);
                academic_ans_arr.push(degree_universityId);
            }else{
                academic_title_arr.push(degree_uni_id);
                academic_ans_arr.push(null);
            }
        });
        
        $('#sec_academic tr').each(function() {
            var academic_title_2 = $(this).find('.table_info_ans_2').attr('name');
            var academic_ans_2 = $(this).find('.table_info_ans_2').text();   
            var fos_exist = $('.sec_stu_profile_fos_name').val();  
            var sec_uni_id = $('.sec_stu_degree_uni').attr('data-id'); 
            var gpa_title = 'gpaIsEstimated';
            if(degree2_gpa_esti == true){
                var gpa_ans = '1';
            }else{
                var gpa_ans = '0';
            }
            academic_title_arr_2.push(academic_title_2, gpa_title, degreeGroupId_title, gpa_sys_title);
            academic_ans_arr_2.push(academic_ans_2, gpa_ans, degreeGroupId_2, gpa_system_2);
            if(degree_fosId_2 != undefined){
                academic_title_arr_2.push(fosId_title);
                academic_ans_arr_2.push(degree_fosId_2);
            }else if(fos_exist == ''){
                academic_title_arr_2.push(fosId_title);
                academic_ans_arr_2.push(null);
            }
            if(sec_uni_id != undefined){
                academic_title_arr_2.push(degree_uni_id);
                academic_ans_arr_2.push(sec_degree_universityId);
            }else{
                academic_title_arr_2.push(degree_uni_id);
                academic_ans_arr_2.push(null);
            }
        });

        $('#third_academic tr').each(function() {
            var academic_title_3 = $(this).find('.table_info_ans_3').attr('name');
            var academic_ans_3 = $(this).find('.table_info_ans_3').text();
            var fos_exist = $('.third_stu_profile_fos_name').val(); 
            var third_uni_id = $('.third_stu_degree_uni').attr('data-id');     
            var gpa_title = 'gpaIsEstimated';
            if(degree3_gpa_esti == true){
                var gpa_ans = '1';
            }else{
                var gpa_ans = '0';
            }
            academic_title_arr_3.push(academic_title_3, gpa_title, degreeGroupId_title, gpa_sys_title);
            academic_ans_arr_3.push(academic_ans_3, gpa_ans, degreeGroupId_3, gpa_system_3);
            if(degree_fosId_3 != undefined){
                academic_title_arr_3.push(fosId_title);
                academic_ans_arr_3.push(degree_fosId_3);
            }else if(fos_exist == ''){
                academic_title_arr_3.push(fosId_title);
                academic_ans_arr_3.push(null);
            }
            if(third_uni_id != undefined){
                academic_title_arr_3.push(degree_uni_id);
                academic_ans_arr_3.push(third_degree_universityId);
            }else{
                academic_title_arr_3.push(degree_uni_id);
                academic_ans_arr_3.push(null);
            }
        });
        //check if this is the most revelent degree
        if(degree1_the_topest_deg == true || $('#form_step5 .topest_checked:visible').length == 0){
            academic_title_arr.push('useThis');
            academic_ans_arr.push('1');
            academic_title_arr_2.push('useThis');
            academic_ans_arr_2.push('0');
            academic_title_arr_3.push('useThis');
            academic_ans_arr_3.push('0');
        }
        
        else if(degree2_the_topest_deg == true){
            academic_title_arr.push('useThis');
            academic_ans_arr.push('0');
            academic_title_arr_2.push('useThis');
            academic_ans_arr_2.push('1');
            academic_title_arr_3.push('useThis');
            academic_ans_arr_3.push('0');
        }

        else if(degree3_the_topest_deg == true){
            academic_title_arr.push('useThis');
            academic_ans_arr.push('0');
            academic_title_arr_2.push('useThis');
            academic_ans_arr_2.push('0');
            academic_title_arr_3.push('useThis');
            academic_ans_arr_3.push('1');
        }
    });
   
    $('#contact tr').each(function() {
        var contact_title = $(this).find('.table_info_ans').attr('name');
        var contact_ans = $(this).find('.table_info_ans').text();    
        var contact_useLine = 'useLine'; 
        var contact_cityid = 'cityId'; 
        var city_id =  $('.city_field').attr('data-id');
        if($('#contact_online:checkbox').prop('checked')==true){
            contact_title_arr.push(contact_useLine);
            contact_ans_arr.push('1');
        }
        else{
            contact_title_arr.push(contact_useLine);
            contact_ans_arr.push('0');
        }
        if(typeof(city_id) !== 'undefined'){
            contact_title_arr.push(contact_cityid);
            contact_ans_arr.push($('.city_field').attr('data-id'));
        }
        else{
            contact_title_arr.push(contact_cityid);
            contact_ans_arr.push(null);
        }
        contact_title_arr.push(contact_title);
        contact_ans_arr.push(contact_ans);
    }); 

    $('.stu_fos_interest span').each(function(){
        var fos_id = $(this).attr('id');
        fos_array.push(fos_id);
    });

    $('.stu_qualification span').each(function(){
        var level_id = $(this).attr('id');
        // if(level_id != 'Language School' && level_id != 'High School / College'){
            level_arr.push(level_id);
        // }
        
    });

    $('.stu_uni_interest span').each(function(){
        var uni_id = $(this).attr('id');
        uni_arr.push(uni_id);
    });

    var interests_title_arr = ["destinations" , "departureYear" , "departureMonth" , "level", "fos" , "universities"];
    var interests_ans_arr;
    if(deperature_month != ''){
        interests_ans_arr = [[student_study_destination], deperature_year, deperature_month, level_arr, fos_array, uni_arr];
    }else{
        interests_ans_arr = [[student_study_destination], deperature_year, null, level_arr, fos_array, uni_arr];
    }
    
    var academic_arr = [];
    var obj_per = {};
    var obj_inter = {};
    var obj_aca = {};
    var obj_aca2 = {};
    var obj_aca3 = {};
    var obj_con = {};

    for (var i = 0; i < personal_title_arr.length; i++) {
        obj_per[personal_title_arr[i]] = personal_ans_arr[i];
    }
    var asJSON_per = JSON.stringify(obj_per);

    for (var l = 0; l < interests_title_arr.length; l++) {
        obj_inter[interests_title_arr[l]] = interests_ans_arr[l];
    }
    var asJSON_inter = JSON.stringify(obj_inter);

    for (var k = 0; k < academic_title_arr.length; k++) {
        if(academic_ans_arr[k] != ''){
            obj_aca[academic_title_arr[k]] = academic_ans_arr[k];
        }else{
            obj_aca[academic_title_arr[k]] = null;
        }
    }
    var asJSON_aca = JSON.stringify(obj_aca);


    if(do_we_have_degree2 != 0 && do_we_have_degree3 == 0){
        for (var h = 0; h < academic_title_arr_2.length; h++) {
            if(academic_ans_arr_2[h] != ''){
                obj_aca2[academic_title_arr_2[h]] = academic_ans_arr_2[h];
            }else{
                obj_aca2[academic_title_arr_2[h]] = null;
            }
        }
        var asJSON_aca2 = JSON.stringify(obj_aca2);
    }
    else if(do_we_have_degree2 != 0 && do_we_have_degree3 != 0){
        for (var h = 0; h < academic_title_arr_2.length; h++) {
            if(academic_ans_arr_2[h] != ''){
                obj_aca2[academic_title_arr_2[h]] = academic_ans_arr_2[h];
            }else{
                obj_aca2[academic_title_arr_2[h]] = null;
            }
        }
        var asJSON_aca2 = JSON.stringify(obj_aca2);
        for (var m = 0; m < academic_title_arr_3.length; m++) {
            if(academic_ans_arr_3[m] != ''){
                obj_aca3[academic_title_arr_3[m]] = academic_ans_arr_3[m];
            }else{
                obj_aca3[academic_title_arr_3[m]] = null;
            }
        }
        var asJSON_aca3 = JSON.stringify(obj_aca3);
    }
    
    for (var j = 0; j < contact_title_arr.length; j++) {
        if(contact_ans_arr[j] != ''){
            obj_con[contact_title_arr[j]] = contact_ans_arr[j];
        }else{
            obj_con[contact_title_arr[j]] = null;
        }
        
     }
    var asJSON_con = JSON.stringify(obj_con);

    //common data in student json 
    var jJSON = '{'+
    '"personal": '+ asJSON_per + ',' +
    '"interests": '+ asJSON_inter + ',' +
    '"marketing": ' + JSON.stringify(final_mkt_array) + ','+
    '"contact": ' + asJSON_con + ','+
    '"language":' + JSON.stringify(asJSON_lang)+ ','+
    '"standardizedTests":'+ JSON.stringify(asJSON_std_tests);

    //work experience
    if(company_name == 1){
        jJSON += ', "work": null';        
    }else{
        jJSON += ', "work": ' + JSON.stringify(work_array);
    }

    //educational background
    var jsonAcademic = ', "academic": ['+ asJSON_aca;
    
    if(do_we_have_degree2 != 0){
        jsonAcademic += ',' + asJSON_aca2;
    }

    if(do_we_have_degree3 != 0){
        jsonAcademic += ',' + asJSON_aca3;
    }

    jJSON += jsonAcademic+']}';
    $('input[name="studentData"]').val(jJSON);
    $('#studentDataForm').submit();


    console.log($('input[name="studentData"]').val());
};