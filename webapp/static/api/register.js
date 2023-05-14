$(document).ready(function() {
    $('#submit').click(function() {
        $.ajax({
            type: "POST",
            url: "/register_api",
            data: {'sentences': $('#input-area').val()},
            success: function(data) {
                $("#input-area").css("border", "2px solid green"); 
                $("#input-area").css("background-color", "#edfff1"); 
                // }
                // else {
                //     // $('#output').fadeTo(0, 0).delay(50).fadeTo(500, 1);
                //     $("#input-area").css("border", "2px solid red"); 
                //     $("#input-area").css("background-color", "#ffedee");
                // }
                // $("#output").text(data['results']);
            }
        });
    });
});