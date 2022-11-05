$.fn.editable.defaults.mode = 'popup';
$.fn.datepicker.defaults.format = "yyyy-mm-dd";
function initEditStatus(){
    $('#gender').select2({
        data: [{id: 'M', text: 'Male'}, {id: 'F', text: 'Female'}, {id: 'N', text: 'Later'}]
    });

    // $('.qual').select2({
    //     data: JSON.parse('<?php echo json_encode($quals);?>')
    // });

    $('.uni_id').select2({
        placeholder: "Search for a University",
        allowClear: true,
        closeOnSelect: true,
        minimumInputLength: 3,
        ajax: {
            url: "/ukeas/search/unicommon",
            dataType: 'json',
            quietMillis: 250,
            data: function (term, page) { // page is the one-based page number tracked by Select2
                return {
                    q: term, //search term
                    page: page // page number
                };
            },
            results: function (data, page) {
                var more = (page * 30) < data.length; // whether or not there are more results available
                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: data, more: more };
            }
        },
        initSelection: function (item, callback) {
            var id = $(item).val();
            if (id !== "") {
                $.ajax("/ukeas/search/unicommon?id=" + id, {
                    dataType: "json"
                }).done(function(data) {
                    var id = data[0].id;
                    var text = data[0].text;
                    var data = { id: id, text: text };
                    callback(data); 
                });
            }
        },
    });

    $('#nationality').select2({
        placeholder: "Search for Country",
        tags: true,
        allowClear: true,
        closeOnSelect: true,
        minimumInputLength: 2,
        ajax: {
            url: "/ukeas/search/country",
            dataType: 'json',
            quietMillis: 250,
            data: function (term, page) { // page is the one-based page number tracked by Select2
                return {
                    q: term, //search term
                    page: page // page number
                };
            },
            results: function (data, page) {
                var more = (page * 30) < data.length; // whether or not there are more results available
    
                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: data, more: more };
            }
        },
        initSelection: function (item, callback) {
            var ids = $(item).val();
            if (ids !== "") {
                $.ajax("/ukeas/search/country?ids=" + ids, {
                    dataType: "json"
                }).done(function(resp) {
                    var data = [];
                    resp.forEach(function(item){
                        
                        data.push({ id: item.id, text: item.text });
                    });
                    //console.log(data);
                    callback(data); 
                });
            } 
        }, 
    });

    $('.degree_fos').select2({
        placeholder: "Search for a field of study",
        allowClear: true,
        closeOnSelect: true,
        minimumInputLength: 3,
        ajax: {
            url: "/ukeas/search/fos",
            dataType: 'json',
            quietMillis: 250,
            data: function (term, page) { // page is the one-based page number tracked by Select2
                return {
                    q: term, //search term
                    page: page // page number
                };
            },
            results: function (data, page) {
                var more = (page * 30) < data.length; // whether or not there are more results available
                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: data, more: more };
            }
        },
        initSelection: function (item, callback) {
            var id = $(item).val();
            if (id !== "") {
                $.ajax("/ukeas/search/fos?ids=" + id, {
                    dataType: "json"
                }).done(function(data) {
                    var id = data[0].id;
                    var text = data[0].text;
                    var data = { id: id, text: text };
                    callback(data); 
                });
            }
        },
    });

    $('#personal_country_id').select2({
        placeholder: "Search for a Country",
        allowClear: true,
        closeOnSelect: true,
        minimumInputLength: 2,
        ajax: {
            url: "/ukeas/search/country",
            dataType: 'json',
            quietMillis: 250,
            data: function (term, page) { // page is the one-based page number tracked by Select2
                return {
                    q: term, //search term
                    page: page // page number
                };
            },
            results: function (data, page) {
                var more = (page * 30) < data.length; // whether or not there are more results available
    
                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: data, more: more };
            }
        },
        initSelection: function (item, callback) {
            var id = $(item).val();
            if (id !== "") {
                $.ajax("/ukeas/search/country?id=" + id, {
                    dataType: "json"
                }).done(function(data) {
                    var id = data[0].id;
                    var text = data[0].text;
                    var data = { id: id, text: text };
                    callback(data); 
                });
            }
        },
    }).on("change", function (e) { $('#city_id').val('').trigger('change'); });
    
    $('#city_id').select2({
        placeholder: "Search for a City",
        allowClear: true,
        closeOnSelect: true,
        minimumInputLength: 2,
        ajax: {
            url: "/ukeas/search/city",
            dataType: 'json',
            quietMillis: 250,
            data: function (term, page) { // page is the one-based page number tracked by Select2
                return {
                    c_id: $('#personal_country_id').val(),
                    q: term, //search term
                    page: page // page number
                };
            },
            results: function (data, page) {
                var more = (page * 30) < data.length; // whether or not there are more results available
    
                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: data, more: more };
            }
        },
        initSelection: function (item, callback) {
            var id = $(item).val();
            if (id !== "") {
                $.ajax("/ukeas/search/city?id=" + id, {
                    dataType: "json"
                }).done(function(data) {
                    var id = data[0].id;
                    var text = data[0].text;
                    var data = { id: id, text: text };
                    callback(data); 
                });
            }
        },
    });
};
//jesus 20190223 initEditStatus();

$('.student_content').on('click', '#btnAddDegree', function(e){
    var degree = document.querySelector('#degree');
    var size = $('#degreeContent').children().length;
    degree = $(degree.innerHTML.replace(/_new/g, '_new_'+size))[0]; 
    var clone = document.importNode(degree, true); 
    document.querySelector('#degreeContent').appendChild(clone);
    initEditStatus();
    // $('.degree_number').empty();
    $('.degree_number:last').append(size+1);
});

$('.student_content').on('click', '#btnAddQual', function(e){
    var qual = document.querySelector('#qual_temp');
    var size = $('#qualContent').children().length;
    qual = $(qual.innerHTML.replace(/_new/g, '_new_'+size))[0]; 
    var clone = document.importNode(qual, true); 
    document.querySelector('#qualContent').appendChild(clone);
    initEditStatus();
    // $('.degree_number').empty();
    $('.qual_number:last').append(size+1);
});


$(".student_content").on('click', '#btnSave', function(){
    $("[name='main_degree_radio']").each(function(){
        var id_value = $(this).attr('id');
        $(this).attr('name',id_value);  
    })
});
//
$(".student_content").on('submit', '#studentForm', function(e){
    $submitBtn = $('#btnSave');
    e.preventDefault();
    $(this).ajaxSubmit({
        beforeSubmit: function(arr, $form, options){
            $submitBtn.button('loading');
        },
        complete: function(response) 
        {
            if (response.status == 200){
                if($('#editProfileModal').length) {
                    $('#editProfileModal').modal('toggle');
                } else {
                    window.location = "/student";
                }              
            } else {
                alert('Sorry, the student profile could not be updated');
            }
            //$submitBtn.button('reset');
        }
    });
    return false;
});

$('body').on('click', '.remove-degree', function(e){
    var status = $(this).siblings('.status');
    var size = $('#degreeContent').children().length;
    $(this).closest('.degreeEntity').hide('slow', function(){ 
        if ( status.val() === 'old'){
            status.val('del');
        } else {
            $(this).remove();
        } 
    });
});

$('body').on('click', '.remove-qual', function(e){
    var status = $(this).siblings('.status');
    console.log('trigger!');
    $(this).closest('.qual').hide('slow', function(){ 
        if ( status.val() === 'old'){
            status.val('del');
        } else {
            $(this).remove();
        } 
    });
});

//jesus 20190223 initEditStatus();

//gpa validation
$('body').on('keyup', '.stu_gpa_field', function(){
    var gpaValue = $(this).val();
    var gpaType = $(this).parent().parent().find('.gpa_selection').val();

    if(validateGpa(gpaValue, gpaType) == true){
        $(this).css({"border":"none"});
        $('#btnSave').removeAttr("disabled");
    }else{
        $(this).css({"border":"1px solid #f24"});
        $('#btnSave').attr("disabled", true);
    }
});

$('body').on('change', '.gpa_selection', function(){
    var gpa_value = $(this).parent().siblings().children(".stu_gpa_field").val('');
    var gpa_type = $(this).val();
    if(gpa_type == 0){
        $(this).parent().siblings().children(".stu_gpa_field").attr("placeholder","e.g. 86.53");
    }
    else if(gpa_type == 1){
        $(this).parent().siblings().children(".stu_gpa_field").attr("placeholder","e.g. 4.2");
    }
    else{
        $(this).parent().siblings().children(".stu_gpa_field").attr("placeholder","e.g. 3.7");
    }
});

//gpa input validation
function validateGpa(gpaValue, gpaType){
    var regExpression = {};
    regExpression["PER"] = /^[0-9]{2}(\.[0-9]{1,2})?$/;
    //regExpression["4.0"] = /^[1-4]{1}(.[0-9]{0,1})$/;
    // jesus 20190222 : changed all 0,1 into 1,2 (decimal parts)
    regExpression["4.0"] = /^[1-4]{1}(.[0-9]{1,2})$/;
    regExpression["4.3"] = /^[1-4]{1}(.[0-9]{1,2})$/;
    regExpression["4.5"] = /^[1-4]{1}(.[0-9]{1,2})$/;

    var maxValue = {};
    maxValue["PER"]= 100;
    maxValue["4.0"] = 4.0;
    maxValue["4.3"] = 4.3;
    maxValue["4.5"] = 4.5;

    var minValue = {};
    minValue["PER"]= 50;
    minValue["4.0"] = 0.0;
    minValue["4.3"] = 0.0;
    minValue["4.5"] = 0.0;
    return (regExpression[gpaType].test(gpaValue) && gpaValue <= maxValue[gpaType] && gpaValue >= minValue[gpaType]);
}

function initEditable() {
    $('.entryPoint, .proBody, .addEntryReq, .qualReq').on('shown', function(e, editable){
        editable.options.params.dest = $(this).attr('data-dest');
    }).editable({
        params:{},
        validate: function(value){
            if($(this).attr('required') !== undefined && $.trim(value) == ''){
                return 'This field is required.'
            }
        }
    });
}


/////////////////////////////////////////////////////////////////////////////// 
$("#studentForm input").on("invalid", function() {
    //goto tab id
	tabLinkId = $(this).parents('.tab-pane').data('tab-index');
    
    $("#"+tabLinkId).trigger("click");
    $(this).validate();
        
});

$('body').on('change','.qual_type', function(){
    $(this).parents('.qual').find('.qual_score').val('');
    $(this).parents('.qual').find('.qual_date_input').val('');

    $('.qual_score').trigger('keyup');
});

$('body').on('keyup', '.qual_score_overall', function(){
    var exam_type = $(this).parents('.qual').find('.qual_type').val();
    var score = $(this).val();
    if(ValidateOverallScore(exam_type, score) == true){
        $(this).css('border-bottom','2px solid #70FFDB');
    }else{
        $(this).css('border-bottom','2px solid red');
    }
});

$('body').on('keyup', '.qual_score_detail', function(){
	var exam_type = $(this).parents('.qual').find('.qual_type').val();
    var score = $(this).val();
    if(ValidatedetailScore(exam_type, score) == true){
        $(this).css('border-bottom','2px solid #70FFDB');
    }else{
        $(this).css('border-bottom','2px solid red');
    }
});

function ValidateOverallScore(exam_type, score){
    var regExpression = {};
    regExpression["IELTS"] = /^(?!0$)\d+(?:[,.][05])?$/;
    regExpression["IELTS UKVI"] = /^(?!0$)\d+(?:[,.][05])?$/;
    regExpression["TOEFL"] = /^\d+$/;
    regExpression["PEARSON"] = /^\d+$/;

    var maxValue = {};
    maxValue["IELTS"] = 9;
    maxValue["IELTS UKVI"] = 9;
    maxValue["TOEFL"] = 120;
    maxValue["PEARSON"] = 90;
    return (regExpression[exam_type].test(score) && score <= maxValue[exam_type]);
}

function ValidatedetailScore(exam_type, score){
    var regExpression = {};
    regExpression["IELTS"] = /^(?!0$)\d+(?:[,.][05])?$/;
    regExpression["IELTS UKVI"] = /^(?!0$)\d+(?:[,.][05])?$/;
    regExpression["TOEFL"] = /^\d+$/;
    regExpression["PEARSON"] = /^\d+$/;

    var maxValue = {};
    maxValue["IELTS"] = 9;
    maxValue["IELTS UKVI"] = 9;
    maxValue["TOEFL"] = 30;
    maxValue["PEARSON"] = 90;
    return (regExpression[exam_type].test(score) && score <= maxValue[exam_type]);
}

//initEditStatus();