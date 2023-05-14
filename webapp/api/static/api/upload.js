$(document).ready(function() {
    $('#submit').click(function() {
        $("#input-area").css("border", "0px"); 
        $("#input-area").css("background-color", "white"); 
        $.ajax({
            type: "POST",
            url: "/register_api",
            data: {'url': $('#input-area').val()},
            success: function(data, textStatus, xhr) {
                $("#input-area").css("border", "2px solid green"); 
                $("#input-area").css("background-color", "#edfff1"); 
                // }
                // else {
                //     // $('#output').fadeTo(0, 0).delay(50).fadeTo(500, 1);
                //     $("#input-area").css("border", "2px solid red"); 
                //     $("#input-area").css("background-color", "#ffedee");
                // }
                // $("#output").text(data['results']);
            },
            error: function(xhr, status, error) {
                alert(JSON.parse(xhr.responseText));
            }
        });
    });
});