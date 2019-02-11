function isEmpty(x) {
    return (!x || 0 === x.length);
}

function wrapped_choice() {
    let form = document.getElementById("choose_form");
    do_choose();
}

function wrapped_puzzle(){
    let form1 = document.getElementById("puzzle_f");
    do_puzzle();
}


function do_choose() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/choose", true);
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.responseText);
            let a = JSON.parse(xhttp.responseText);
            document.getElementById("puzzle_table").rows[0].cells[1].innerText=a.puzzle;
            document.getElementById("puzzle_table").rows[1].cells[1].innerText=a.score;
            document.getElementById("puzzle_table").rows[2].cells[1].innerText=a.threshold;
            document.getElementById("message").innerHTML='';
            document.getElementById('puzzlebttn').style.visibility='visible';
        }
        if (xhttp.readyState == 4 && xhttp.status == 401) {
            let a = JSON.parse(xhttp.responseText);
            document.getElementById("message").innerHTML=a.message;
        }

    };
    xhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
    let cookie_access_token=getCookie("access_token");
    xhttp.setRequestHeader('Authorization', 'Bearer ' + cookie_access_token);
    xhttp.withCredentials = true;
    xhttp.send(xhttp);
}

function do_puzzle() {
    let xhttp = new XMLHttpRequest();
    let letter_coice=document.getElementById("letter_coice").value;
    if(isEmpty(letter_coice) || (/\s/.test(letter_coice))){
        return;
    }
    xhttp.open("POST", "/puzzle/" +letter_coice, true);
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let rspJSON=xhttp.responseText;
            console.log(rspJSON);
            let a = JSON.parse(rspJSON);
            document.getElementById("puzzle_table").rows[0].cells[1].innerText=a.puzzle;
            document.getElementById("puzzle_table").rows[1].cells[1].innerText=a.score;
            document.getElementById("puzzle_table").rows[2].cells[1].innerText=a.threshold;
            document.getElementById("letter_coice").value="";
            if(a.hasOwnProperty('message') ){
                document.getElementById("message").innerHTML=a.message
            }
        }
        if (xhttp.readyState == 4 && xhttp.status == 400) {
            let rspJSON=xhttp.responseText;
            console.log(rspJSON);
            let a = JSON.parse(rspJSON);
            document.getElementById("letter_coice").value="";
            document.getElementById("message").innerText=a.message;
        }
    };
    let puzzle=document.getElementById("puzzle_table").rows[0].cells[1].innerText;
    let score= document.getElementById("puzzle_table").rows[1].cells[1].innerText;
    let threshold=document.getElementById("puzzle_table").rows[2].cells[1].innerText;
    document.getElementById("message").innerHTML="";
    let data = {score: score, threshold: threshold, puzzle:puzzle};
    let server_token = getCookie("access_token");
    xhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + server_token);
    let stringi = JSON.stringify(data);
    xhttp.withCredentials = true;
    xhttp.send(stringi);
}

function do_logout() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/logout", true);
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.responseText);
            let a = JSON.parse(xhttp.responseText);
            document.getElementById("message").style.visibility = 'visible';
            document.getElementById("message").innerHTML = a.message;
            document.getElementById("puzzle_table").style.display='none';
            document.getElementById('choosebttn').style.display='none';
            document.getElementById('puzzlebttn').style.display='none';
            document.getElementById('logoutbttn').style.display='none';
            document.getElementById('letter_coice').style.display='none';
            document.getElementById('login_link').style.visibility='visible';
            deleteCookie("access_token");
        }

    };
    let server_token = getCookie("access_token");
    xhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + server_token);
    xhttp.send();
}

window.onload = function () {
    let at=getCookie("access_token");
    if (isEmpty(at)){
         let req = new XMLHttpRequest();
        req.open('GET', document.location, false);
        req.send(null);
        let access_token = req.getResponseHeader("Authorisation").split(" ")[1];
        setCookie("access_token",access_token,1);
    }

    let form1 = document.getElementById("puzzle_f");
    let form_logout = document.getElementById("logout_form");
    let choosebttn = document.getElementById('choosebttn');
    choosebttn.addEventListener("click", wrapped_choice);
    let puzzlebttn = document.getElementById('puzzlebttn');
    puzzlebttn.addEventListener("click", wrapped_puzzle);
    puzzlebttn.style.visibility='hidden';
     let logoutbttn = document.getElementById('logoutbttn');
    logoutbttn.style.visibility = 'visible';
    logoutbttn.addEventListener("click", do_logout);
    let loginlink=document.getElementById('login_link');
    loginlink.style.visibility='hidden';
};
