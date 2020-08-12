$('#send-message').click(function() {
    var user2 = $.trim($('#user2').val());
    var message = $.trim($('#message').val());
    $.ajax({
        url: '/message'+user2,
        type: 'POST',
        dataType: 'json',
        data: {
            //'username': username,
            'message': message
        },
        success: function(response) {
            if (response.status == 'OK') {
                // socket.emit('message', {
                //     'username': username,
                //     'message': message
                // });
                $('#message').val('');
            }
        }
    });
});