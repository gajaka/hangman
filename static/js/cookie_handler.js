function getCookie(cookie_name) {
    cookie_name = cookie_name + "=";
    var cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookie_name) == 0) {
            return cookie.substring(cookie_name.length, cookie.length);
        }
    }
    return "";
}

function setCookie(cookie_name, value, expirydays) {
    let d = new Date();
    d.setTime(d.getTime() + (expirydays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cookie_name + "=" + value + "; " + expires;
}

function deleteCookie(name) {
    setCookie(name, "", -1);
}