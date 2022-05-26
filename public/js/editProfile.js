function getOneUser() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              let data = JSON.parse(this.responseText);
              if(data.status == "success") {
                let userID = "<div class=ID><span>UserID: </span>";
                let fName = "<div class=firstName><span>First Name: </span>";
                let lName = "<div class=lastName><span>Last Name: </span>";
                let e = "<div class=email><span>Email: </span>";
                let p = "<div class=pass><span>Password: </span>";
                for (let i = 0; i < data.rows.length; i++) {
                    let row = data.rows[i];             
                    document.getElementById("profilePicture").src = "img/userImages/" + row.userID + "id.jpg";
                    userID += "<span class=IDValue id=IDValue>" + row.userID + "</span></div>";
                    document.getElementById("ID").innerHTML = userID
                    fName +=  "<span class=firstNameValue id=firstNameValue>" + row.firstName + "</span></div>";
                    document.getElementById("firstName").innerHTML = fName;
                    lName +=  "<span id=lastNameValue class=lastNameValue>" + row.lastName + "</span></div>";
                    document.getElementById("lastName").innerHTML = lName;
                    e +=  "<span class=emailValue id=emailValue>" + row.email + "</span></div>";
                    document.getElementById("email").innerHTML = e;
                    p +=  "<span id=passValue class=passValue>" + row.pass + "</span></div>";
                    document.getElementById("pass").innerHTML = p;
                }
                    let email = document.querySelectorAll(".emailValue");
                    for(let j = 0; j < email.length; j++) {
                        email[j].addEventListener("click", editEmail);
                    }
                    let firstName = document.querySelectorAll(".firstNameValue");
                    for(let j = 0; j < firstName.length; j++) {
                        firstName[j].addEventListener("click", editFirstName);
                    }
                 
                    let lastName = document.querySelectorAll(".lastNameValue");
                    for(let j = 0; j < lastName.length; j++) {
                        lastName[j].addEventListener("click", editLastName);
                    }
                    
                    let pass = document.querySelectorAll(".passValue");
                    for(let j = 0; j < pass.length; j++) {
                        pass[j].addEventListener("click", editPassword);
                    }
                } else {
                   
                }
            } else {
           
            }
        } else {
           
        }
    };
    xhr.open("GET", "/get-one-user");
    xhr.send();
}
getOneUser();

function editEmail(e) {
    console.log(document.getElementById("IDValue").innerHTML);
    let spanText = e.target.innerHTML;
    let parent = e.target.parentNode;
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function(e) {
        let v = null;
        if(e.which == 13) {
            v = input.value;
            let newSpan = document.createElement("span");
            newSpan.addEventListener("click", editEmail);
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {userID: document.getElementById("IDValue").innerHTML,
                              email: v,};
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                      getOneUser();
                    } else {
                   
                    }
                } else {
                  
                }
            };
            xhr.open("POST", "/update-user-email");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("userID=" + dataToSend.userID + "&email=" + dataToSend.email);
        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);
}

function editFirstName(e) {
    let spanText = e.target.innerHTML;
    let parent = e.target.parentNode;
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function(e) {
        let v = null;
        if(e.which == 13) {
            v = input.value;
            let newSpan = document.createElement("span");
            newSpan.addEventListener("click", editFirstName);
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {userID: document.getElementById("IDValue").innerHTML,
                              firstName: v};
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                      getOneUser();
                    } else {
                      
                    }
                } else {
                   
                }
            };
            xhr.open("POST", "/update-user-firstName");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("userID=" + dataToSend.userID + "&firstName=" + dataToSend.firstName);
        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);
}

function editLastName(e) {
    let spanText = e.target.innerHTML;
    let parent = e.target.parentNode;
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function(e) {
        let v = null;
        if(e.which == 13) {
            v = input.value;
            let newSpan = document.createElement("span");
            newSpan.addEventListener("click", editLastName);
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {userID: document.getElementById("IDValue").innerHTML,
                              lastName: v};
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                      getOneUser();
                    } else {
                    
                    }
                } else {
              
                }
            };
            xhr.open("POST", "/update-user-lastName");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("userID=" + dataToSend.userID + "&lastName=" + dataToSend.lastName);
        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);

}

function editPassword(e) {
    let spanText = e.target.innerHTML;
    let parent = e.target.parentNode;
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function(e) {
        let v = null;
        if(e.which == 13) {
            v = input.value;
            let newSpan = document.createElement("span");
            newSpan.addEventListener("click", editPassword);
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {
                              userID: document.getElementById("IDValue").innerHTML,
                              pass: v};

            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                      getOneUser();
                    } else {
                    
                    }
                } else {
                 
                }
            };
            xhr.open("POST", "/update-user-password");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("userID=" + dataToSend.userID + "&pass=" + dataToSend.pass);
        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);
}

const upLoadForm = document.getElementById("upload-images-form");
upLoadForm.addEventListener("submit", uploadImages);

function uploadImages(e) {
    e.preventDefault();
    const imageUpload = document.querySelector('#image-upload');
    const formData = new FormData();
    for(let i =0; i < imageUpload.files.length; i++) {
        formData.append("files", imageUpload.files[i]);
    }
    const options = {
        method: 'POST',
        body: formData,
    };
    fetch("/upload-images", options).then(function(res) {

    }).catch(function(err) {("Error:", err)}
    );
}

function imgError() {
    document.getElementById("profilePicture").src = "img/userImages/dp.jpg";
}