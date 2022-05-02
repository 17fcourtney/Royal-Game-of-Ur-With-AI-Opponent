function checkACookieExists() {
    $(document).ready(function() {
        if (document.cookie.split(';').some((item) => item.includes('mute=true'))) {
            if (!$('.speaker').hasClass('mute')) {
                $('.speaker').addClass('mute');
            }  
            return true;
        } else if (document.cookie.split(';').some((item) => item.includes('mute=false')))  {
                if ($('.speaker').hasClass('mute'))
                $('.speaker').removeClass('mute');        
            return false;
        }
    });
}

function createCookies() {
    document.cookie = "mute=false; expires=Fri, 31 Dec 9999 23:59:59 GMT; Secure";
    //see if we can instantly recheck if cookie is created
}

function setMuteCookieStatus(status) {
    if (status === false && document.cookie.split(';').some((item) => item.includes('mute=true'))) {
        document.cookie = "mute=false; expires=Fri, 31 Dec 9999 23:59:59 GMT; Secure";
    } else if (status === true && document.cookie.split(';').some((item) => item.includes('mute=false'))) {
        document.cookie = "mute=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; Secure";
    } else {
        console.log("failed getting/setting mute cookie status");
        return undefined;
    }
}

var difficulty = './neural.json';
$(document).ready(function() {
        $(document).on("click",".difficulty_buttons", function() {
            if ($(this).attr('id') == 'beginnerButton') {
              console.log('beginner');
              localStorage.setItem('difficulty','./lessAggressiveAI.json');
            } else {
              localStorage.setItem('difficulty','./neural.json');
            }
          });    
})
