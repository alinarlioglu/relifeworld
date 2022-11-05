//common filter
var filter_data;
var which_btn;
var params = {};
$('.user_filter').autocomplete({
    source: function (request, response) {
        $.get('/ukeas/search/user?', {
            q: request.term
        }, function (data) {
            response(data);
        });
    },
    minLength: 2,
    position: {
        my: "left top",
        at: "left bottom"
    },
    select: function (event, ui) {
        // console.log(ui.item.id);
        var selected_id = ui.item.id;
        $('input[name=user_filter]').attr('data-id', selected_id);
    },
    cache: false
});

$('.user_filter').unbind('click');
$('.user_filter').on('keyup', function () {
    if ($(this).val() == '') {
        $('input[name=user_filter]').removeAttr('data-id');
    }
});
$('.log_search_btn').unbind('click');
$('.log_search_btn').on('click', function () {
    which_btn = $(this).attr('name');
    get_search_filter();
    // call_search_api();
});

$('input[name=start_date]').unbind('change');
$('input[name=start_date]').on('change', function () {
    check_date();
});

$('input[name=end_date]').unbind('change');
$('input[name=end_date]').on('change', function () {
    check_date();
});

//acceptance filter
$('#acc_sub_type').unbind('change');
$('#acc_sub_type').on('change', function () {
    var selected_type = $(this).val();
    if (selected_type == 'IMP' || selected_type == 'CAL' || selected_type == 'ALL') {
        $('input[name=origin_uni],input[name=dest_uni]').prop('disabled', true);
    } else if (selected_type == 'VIE' || selected_type == 'EDI') {
        $('input[name=origin_uni],input[name=dest_uni]').prop('disabled', false);
    }
});
$('#acc_sub_type').trigger('change');

$('input[name="stu_log_email"]').autocomplete({
    source: "/ukeas/search/student/lookup",
    minLength: 2,
    position: {
        my: "left top",
        at: "left bottom"
    },
    select: function (event, ui) {
        //
    }
});

//
$("#origin_uni").autocomplete({
    source: "/ukeas/search/unicommon?",
    minLength: 2,
    position: {
        my: "left top",
        at: "left bottom"
    },
    select: function (event, ui) {
        $('#origin_uni').attr('data-id', ui.item.id);
    }
});

$('#origin_uni, #dest_uni').unbind('keyup');
$("#origin_uni, #dest_uni").on('keyup', function () {
    if ($(this).val() == '') {
        $(this).removeAttr('data-id');
    }
});

$("#dest_uni").autocomplete({
    source: "/ukeas/search/unicommon?",
    minLength: 2,
    position: {
        my: "left top",
        at: "left bottom"
    },
    select: function (event, ui) {
        $('#dest_uni').attr('data-id', ui.item.id);
    }
});

function check_date() {
    var end_date = $('input[name=end_date]').val();
    var start_date = $('input[name=start_date]').val();
    if (end_date != '' && end_date < start_date) {
        $('input[name=end_date]').css('border', '1px solid #f24');
    } else {
        $('input[name=end_date]').css('border', '1px solid #d5d5d5');
    }
}

function get_search_filter() {
    params = {};
    var log_type = $('div[name=log_tag]').attr('id');

    //common filter
    var sub_type = $('#' + log_type)
        .find('select[name=sub_type]')
        .val();
    var start_date = $('#' + log_type)
        .find('input[name=start_date]')
        .val();
    var end_date = $('#' + log_type)
        .find('input[name=end_date]')
        .val();
    var user_id = $('#' + log_type)
        .find('input[name="user_filter"]')
        .attr('data-id');

    //acceptance log filter
    var origin_id = $('#' + log_type)
        .find('#origin_uni')
        .attr('data-id');
    var dest_id = $('#' + log_type)
        .find('#dest_uni')
        .attr('data-id');
    var file_name = $('#' + log_type)
        .find('.filename')
        .val();

    //course log
    var course_name = $('#' + log_type)
        .find('#course_name')
        .val();

    //student log
    var student_email = $('#' + log_type)
        .find('input[name=stu_log_email]')
        .val();

    params.sub_type = sub_type;
    if (start_date)
        params.start_date = start_date
    if (end_date)
        params.end_date = end_date;
    if (user_id !== undefined)
        params.user_id = user_id;
    if (origin_id)
        params.origin_id = origin_id;
    if (dest_id)
        params.dest_id = dest_id;
    if (file_name) {
        params.file_name = file_name;
    }
    if (student_email)
        params.student_email = student_email;
    if ($('input[name="type_ug"]').is(':checked')) {
        params.type_ug = 1;
    }
    if ($('input[name="type_pg"]').is(':checked')) {
        params.type_pg = 1;
    }
    if (course_name) {
        params.course_name = course_name;
    }
    call_url(params);
    // document.location.href = '/log_login?user_id=' + (user_id !== undefined ?
    // user_id : '') + '&start_date=' + start_date + '&end_date=' + end_date +
    // '&sub_type=' + login_type + '&page=1';
}

function call_url(params) {
    console.log("which: "+which_btn);
    document.location.href = '/ukeas/' + which_btn + '?' + $.param(params);
}

function call_search_api() {
    // document.location.href = '/log_login?start_date=' + start_date + '&as;dlfk&page=2';
    // $.ajax({
    // url: 'search/log_login',
    // method: 'POST',
    // data: filter_data,
    // success: function(){
    // }
    // });
}