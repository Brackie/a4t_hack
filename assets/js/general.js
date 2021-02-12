// if (!localStorage.token) window.location.assign("login.html");

let dropDownOpen = false;
let playerOpen = false;
$(document).ready(function(){
    $(".home p").addClass("zoom_in");
    $(".quick-links").addClass("slide-from-left");
    $(".legal").addClass("zoom-in");
    $("#newsletter-form").addClass("slide-from-right");
    $(".dialog").addClass("slide_from_right");

    $(window).scroll(function(){
        var winTop = $(window).scrollTop();

        $('.slide-from-top').each(function(){
            var pos = $(this).offset().top;
            if (pos < winTop + 600) {
                $(this).addClass("slide_from_top");
            }
        });

        $('.slide-from-left').each(function(){
            var pos = $(this).offset().top;
            if (pos < winTop + 600) {
                $(this).addClass("slide_from_left");
            }
        });

        $('.slide-from-right').each(function(){
            var pos = $(this).offset().top;
            if (pos < winTop + 600) {
                $(this).addClass("slide_from_right");
            }
        });

        $('.zoom-in').each(function(){
            var pos = $(this).offset().top;
            if (pos < winTop + 600) {
                $(this).addClass("zoom_in");
            }
        });
    });
    
    const navSide = $(".nav-side");
    $(".nav-toggle").on('click', function(event){
        event.preventDefault();
		navSide.css("left", "-100%");
		navSide.css("display", "block");
		navSide.animate({
			left: '0',
		}, 500);
	});

	$("#close-sidenav").on('click', function(event){
        event.preventDefault();
		navSide.animate({
			left: '-100%'
		}, 500, function(){
			navSide.css("display", "none");
		});
	});

    $(".dropdown-toggle").on('click', function(event){
        event.preventDefault();
        $(".dropdown .dropdown-menu").fadeToggle();
        dropDownOpen = true;
        event.stopPropagation();
    });

    window.onclick = function(event){
        if (dropDownOpen) {
            $(".dropdown-menu").each(function(){
                if($(this).css("display") === "block") $(this).fadeOut();
            });
            dropDownOpen = false;
        }
    };

    var d = new Date();
    var n = d.getFullYear();
    $('#year').text(n);

    get_user_session();

});

function get_user_session(){
    if(localStorage.user_details != "" && localStorage.user_details != null){
        let user_details = JSON.parse(localStorage.user_details);
        $('#username').text(user_details.name);
    }
}

function logout(){
    localStorage.setItem("user_details", "");   
    localStorage.setItem("aft_token", "");  
    window.location.assign("index.html");   
}

function showPrompt(message, state){
    if (state == 0){
        $("#prompt-icon").removeClass("fa-check");
        $("#prompt-icon").addClass("fa-close");
    }
    $(".prompt-message").html(message);
    $(".prompt").fadeToggle();
    setTimeout(function(){
        $(".prompt").fadeToggle();
    }, 2500);
}

function isEmptyObject(obj){
    return Object.keys(obj).length === 0;
}