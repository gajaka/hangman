function isEmpty(x) {
    return (!x || 0 === x.length);
}
function wrapped_register() {
    let form = document.getElementById("registerForm");
    do_register();

}

window.onload = function () {
    let form = document.addEventListener("submit",do_register);
    let reg_login = document.getElementById('register_login');
    reg_login.visibility = 'hidden';

};
function do_register() {
let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/register", true);
    let usr=document.getElementById("username").value;
    let pwd=document.getElementById("password").value;
    if (isEmpty(usr) && isEmpty(pwd)){
        return false;
    }
    data = {username: usr, password: pwd}
    xhttp.onreadystatechange = function () {
        console.log("readystate: " + xhttp.readyState);
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let a = JSON.parse(xhttp.responseText);
            console.log(a.message)
            document.getElementById("message").innerHTML = a.message;
            document.getElementById('register_login').style.visibility = 'visible';
        }
        if (xhttp.readyState == 4 && xhttp.status == 201) {
            let a = JSON.parse(xhttp.responseText);
            document.getElementById("message").innerHTML = a.message;
            document.getElementById('register_login').style.visibility = 'visible';

        }
        if (xhttp.readyState == 4 && xhttp.status == 400) {
            let a = JSON.parse(xhttp.responseText);
            document.getElementById("message").innerHTML = a.message;
        }

    };

    xhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
    let stringi = JSON.stringify(data);
    xhttp.withCredentials = true;
    xhttp.send(stringi);

}