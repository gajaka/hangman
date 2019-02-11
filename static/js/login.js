function isEmpty(x) {
    return (!x || 0 === x.length);
}

function wrapped_auth() {
    let form = document.getElementById("loginForm");
    auth();
}

function auth() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/login", true);
    let usr = document.getElementById("username").value;
    let pwd = document.getElementById("password").value;
    if (isEmpty(usr) && isEmpty(pwd)) {
        document.getElementById("message").style.visibility = 'hidden';
        document.getElementById('choose').style.visibility = 'hidden';
        document.getElementById('logoutbttn').style.display = 'none';
        document.getElementById('register_login').style.visibility = 'visible';
        return false;
    }

    data = {username: usr, password: pwd}
    xhttp.onreadystatechange = function () {
        console.log("readystate: " + xhttp.readyState);
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let a = JSON.parse(xhttp.responseText);
            setCookie("access_token", a.access_token,1);
            document.getElementById("message").style.visibility = 'visible';
            document.getElementById("message").innerHTML = a.message;
            document.getElementById('choose').style.visibility = 'visible';
            let lgbttn = document.getElementById('logoutbttn');
            lgbttn.style.visibility = 'visible';
            lgbttn.style.display = 'block';
            document.getElementById('register_login').style.display = 'none';
        }
        if (xhttp.readyState == 4 && xhttp.status == 401) {
            let a = JSON.parse(xhttp.responseText);
            document.getElementById("message").style.visibility = 'visible';
            document.getElementById("message").innerHTML = a.message;
            document.getElementById('choose').style.visibility = 'hidden';
            document.getElementById('logoutbttn').style.display = 'none';
            document.getElementById('register_login').style.display = 'block';

        }
        if (xhttp.readyState == 4 && xhttp.status == 400) {
            let a = JSON.parse(xhttp.responseText);
            document.getElementById("message").style.visibility = 'visible';
            document.getElementById("message").innerHTML = a.message;
            document.getElementById('choose').style.visibility = 'hidden';
            document.getElementById('logoutbttn').style.display = 'none';
            document.getElementById('register_login').style.display = 'block';

        }

    };

    xhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
    let stringi = JSON.stringify(data);
    xhttp.withCredentials = true;
    xhttp.send(stringi);


}

window.onload = function () {
    let form = document.addEventListener("submit", wrapped_auth);
    let choose = document.getElementById('choose');
    choose.style.visibility = 'hidden';
    let logoutbttn = document.getElementById('logoutbttn');
    logoutbttn.style.visibility = 'hidden';
    logoutbttn.addEventListener("click", do_logout);
    let register = document.getElementById('register_login');
    register.style.visibility = 'visible';
};

function do_logout() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/logout", true);
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.responseText);
            let a = JSON.parse(xhttp.responseText);
            document.getElementById("message").style.visibility = 'visible';
            document.getElementById("message").innerHTML = a.message;
            document.getElementById('choose').style.visibility = 'hidden';
            let lgbttn = document.getElementById('logoutbttn');
            lgbttn.style.visibility = 'hidden';
            lgbttn.style.display = 'block';
            document.getElementById('register_login').style.display = 'block';
            deleteCookie("access_token");
        }

    };
    let server_token = getCookie("access_token");
    xhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + server_token);
    xhttp.send();
}

