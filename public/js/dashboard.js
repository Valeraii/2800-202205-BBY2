$('#menu-btn').click(function(){
    $('#menu').toggleClass("active");
 })

 $('#menu-btn').click(function(){
    $('#menu').toggleClass("active");
 })

 function getUsers() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              let data = JSON.parse(this.responseText);
              if(data.status == "success") {
                let str = `<tr>
                    <th class="userID"><span>ID</span></th>
                    <th class="adminRights"><span>Admin</span></th>
                    <th class="firstName"><span>First Name</span></th>
                    <th class="lastName"><span>Last Name</span></th>
                    <th class="email"><span>Email</span></th>
                    <th class="pass"><span>Password</span></th>
                    </tr>`;
                for (let i = 0; i < data.rows.length; i++) {
                    let row = data.rows[i];
                    str  += ("<tr><td class='userID'>" + row.userID
                        + "</td><td class='adminRights'><span>" + row.adminRights 
                        + "</span></td><td class='firstName'><span>" + row.firstName
                        + "</span></td><td class='lastName'><span>" + row.lastName
                        + "</span></td><td class='email'><span>" + row.email
                        + "</span></td><td class='pass'><span>" + row.pass
                        + "</span></td></tr>");
                }
                    document.getElementById("users").innerHTML = str;

                    let email = document.querySelectorAll("td[class='email'] span");
                    for(let j = 0; j < email.length; j++) {
                        email[j].addEventListener("click", editEmail);
                    }
                    
                    let admin = document.querySelectorAll("td[class='adminRights'] span");
                    for(let j = 0; j < admin.length; j++) {
                        admin[j].addEventListener("click", editAdmin);
                    }
                    
                    let firstName = document.querySelectorAll("td[class='firstName'] span");
                    for(let j = 0; j < firstName.length; j++) {
                        firstName[j].addEventListener("click", editFirstName);
                    }
                 
                    let lastName = document.querySelectorAll("td[class='lastName'] span");
                    for(let j = 0; j < lastName.length; j++) {
                        lastName[j].addEventListener("click", editLastName);
                    }
                    
                    let pass = document.querySelectorAll("td[class='pass'] span");
                    for(let j = 0; j < pass.length; j++) {
                        pass[j].addEventListener("click", editPassword);
                    }
                } else {
                    console.log("Error!");
                }
            } else {
              console.log(this.status);
            }
        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("GET", "/get-users");
    xhr.send();
}
getUsers();

function editAdmin(e) {
    let spanText = e.target.innerHTML;
    let parent = e.target.parentNode;
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function(e) {
        let v = null;
        if(e.which == 13) {
            v = input.value;
            let newSpan = document.createElement("span");
            newSpan.addEventListener("click", editAdmin);
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {userID: parent.parentNode.querySelector(".userID").innerHTML,
                              adminRights: v,
                              firstName: parent.parentNode.querySelector(".firstName").innerHTML,
                              lastName: parent.parentNode.querySelector(".lastName").innerHTML,
                              email: parent.parentNode.querySelector(".email").innerHTML,
                              pass: parent.parentNode.querySelector(".pass").innerHTML};
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                      document.getElementById("add-status").innerHTML = "Record updated.";
                      getUsers();
                    } else {
                      console.log(this.status);
                    }
                } else {
                    console.log("ERROR", this.status);
                }
            }
            xhr.open("POST", "/update-user-admin");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("userID=" + dataToSend.userID + "&adminRights=" + dataToSend.adminRights + "&firstName=" + dataToSend.firstName + "&lastName=" + dataToSend.lastName + "&email=" + dataToSend.email + "&pass=" + dataToSend.pass);
        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);
}

function editEmail(e) {
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
            let dataToSend = {userID: parent.parentNode.querySelector(".userID").innerHTML,
                              adminRights: parent.parentNode.querySelector(".adminRights").innerHTML,
                              firstName: parent.parentNode.querySelector(".firstName").innerHTML,
                              lastName: parent.parentNode.querySelector(".lastName").innerHTML,
                              email: v,
                              pass: parent.parentNode.querySelector(".pass").innerHTML};
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                      document.getElementById("add-status").innerHTML = "Record updated.";
                      getUsers();
                    } else {
                      console.log(this.status);
                    }
                } else {
                    console.log("ERROR", this.status);
                }
            }
            xhr.open("POST", "/update-user-email");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            //console.log("dataToSend", "id=" + dataToSend.id + "&email=" + dataToSend.email);
            xhr.send("userID=" + dataToSend.userID + "&adminRights=" + dataToSend.adminRights + "&firstName=" + dataToSend.firstName + "&lastName=" + dataToSend.lastName + "&email=" + dataToSend.email + "&pass=" + dataToSend.pass);
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
            let dataToSend = {userID: parent.parentNode.querySelector(".userID").innerHTML,
                              adminRights: parent.parentNode.querySelector(".adminRights").innerHTML,
                              firstName: v,
                              lastName: parent.parentNode.querySelector(".lastName").innerHTML,
                              email: parent.parentNode.querySelector(".email").innerHTML,
                              pass: parent.parentNode.querySelector(".pass").innerHTML};
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                      document.getElementById("add-status").innerHTML = "Record updated.";
                      getUsers();
                    } else {
                      console.log(this.status);
                    }
                } else {
                    console.log("ERROR", this.status);
                }
            }
            xhr.open("POST", "/update-user-firstName");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("userID=" + dataToSend.userID + "&adminRights=" + dataToSend.adminRights + "&firstName=" + dataToSend.firstName + "&lastName=" + dataToSend.lastName + "&email=" + dataToSend.email + "&pass=" + dataToSend.pass);
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
            let dataToSend = {userID: parent.parentNode.querySelector(".userID").innerHTML,
                              adminRights: parent.parentNode.querySelector(".adminRights").innerHTML,
                              firstName: parent.parentNode.querySelector(".firstName").innerHTML,
                              lastName: v,
                              email: parent.parentNode.querySelector(".email").innerHTML,
                              pass: parent.parentNode.querySelector(".pass").innerHTML};
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                      document.getElementById("add-status").innerHTML = "Record updated.";
                      getUsers();
                    } else {
                      console.log(this.status);
                    }
                } else {
                    console.log("ERROR", this.status);
                }
            }
            xhr.open("POST", "/update-user-lastName");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("userID=" + dataToSend.userID + "&adminRights=" + dataToSend.adminRights + "&firstName=" + dataToSend.firstName + "&lastName=" + dataToSend.lastName + "&email=" + dataToSend.email + "&pass=" + dataToSend.pass);
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
            let dataToSend = {userID: parent.parentNode.querySelector(".userID").innerHTML,
                              adminRights: parent.parentNode.querySelector(".adminRights").innerHTML,
                              firstName: parent.parentNode.querySelector(".firstName").innerHTML,
                              lastName: parent.parentNode.querySelector(".lastName").innerHTML,
                              email: parent.parentNode.querySelector(".email").innerHTML,
                              pass: v};

            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                      document.getElementById("add-status").innerHTML = "Record updated.";
                      getUsers();
                    } else {
                      console.log(this.status);
                    }
                } else {
                    console.log("ERROR", this.status);
                }
            }
            xhr.open("POST", "/update-user-password");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("userID=" + dataToSend.userID + "&adminRights=" + dataToSend.adminRights + "&firstName=" + dataToSend.firstName + "&lastName=" + dataToSend.lastName + "&email=" + dataToSend.email + "&pass=" + dataToSend.pass);
        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);
}

document.getElementById("submit").addEventListener("click", function(e) {
    e.preventDefault();
    let formData = { adminRights: document.getElementById("adminRights").value,
                     firstName: document.getElementById("firstName").value,
                     lastName: document.getElementById("lastName").value,
                     email: document.getElementById("email").value,
                     pass: document.getElementById("pass").value};
    document.getElementById("adminRights").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("pass").value = "";

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              getUsers();
              document.getElementById("add-status").innerHTML = "DB updated.";
            } else {
              console.log(this.status);
            }
        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("POST", "/add-user");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("adminRights=" + formData.adminRights + "&firstName=" + formData.firstName + "&lastName=" + formData.lastName + "&email=" + formData.email + "&pass=" + formData.pass);
})

document.getElementById("delete").addEventListener("click", function(e) {
    e.preventDefault();
    let deleteUser = {userID: document.getElementById("deleteUser").value};
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              getUsers();
              document.getElementById("delete-status").innerHTML = "Record deleted.";
            } else {
              console.log(this.status);
            }
        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("POST", "/delete-all-customers");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("userID=" + deleteUser.userID);
});
