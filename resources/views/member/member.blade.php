@extends('home.module.template-pages')
@section('content')
<div class="member-container">
    <table class="member-table">
        <thead>
            <tr>
                <th>
                    Nickname
                </th>
                <th>
                    Joined
                </th>
                <th>
                    Fictions
                </th>
                <th>
                    Reviews
                </th>
            </tr>
        </thead>
        <tbody class="member-table-body">
            <tr id="memberRowTemplate" class="member-row-template" hidden>
                <a>
                    <td>
                        Example nickname
                    </td>
                    <td>
                        22/01/2020 13:55:04
                    </td>
                    <td>
                        1
                    </td>
                    <td>
                        1
                    </td>
                </a>
            </tr>
        </tbody>
    </table>
</div>
<script>
    function getMemberList(){
        $.ajax({
            url: '{{ route("member.list") }}',
            method: 'GET',
            success: function(resp){
                if(('status' in resp) && resp.status == true && ('members' in resp.data)) {
                    if('data' in resp) {
                        if('members' in resp.data) {
                            $.each(resp.data.members, function(index, value) {
                                var memberRowTemplate = $('#memberRowTemplate');
                                var latestMemberRow = memberRowTemplate.clone();
                                latestMemberRow.removeAttr('id');

                                if(('id' in value) && ('nickname' in value) && ('joined' in value) && ('fictions' in value) && ('reviews' in value)) {
                                    latestMemberRow.html('<td><a href="/member/'+ value.id +'">' + value.nickname +'</a></td><td>' + value.joined + '</td><td>' + value.fictions + '</td><td>' + value.reviews + '</td>');
                                }

                                latestMemberRow.show();
                                $('.member-table-body').prepend(latestMemberRow);
                            });
                        }
                    }
                }
            }
        });
    }
    
    $(document).ready(function() {
        getMemberList();
    });
</script>
@endsection