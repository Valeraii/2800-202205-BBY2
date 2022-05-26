function getTimeline() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              let data = JSON.parse(this.responseText);
              console.log(data);
              if(data.status == "success") {
                for (let i = 0; i < data.rows.length; i++) {
                    let row = data.rows[i];
                    let card = document.createElement("section");
                    card.setAttribute("class", "notification-section");
                    let cardText2 = document.createElement("span");
                    cardText2.setAttribute("id", "timelineID");
                    cardText2.innerHTML = row.timelineID;

                    let photo = document.createElement("img");
                    photo.setAttribute("src", "/img/timelineImages/" + row.playimage + ".jpg");

                    let cardHeader = document.createElement("div");
                    cardHeader.setAttribute("class", "group-header");

                    let cardDate = document.createElement("div");
                    cardDate.setAttribute("id", "group-date");
                    cardDate.innerHTML = row.playdate;

                    let notificationGrid= document.createElement("div");
                    notificationGrid.setAttribute("class", "notification-grid");

                    let avatar = document.createElement("div");
                    avatar.setAttribute("class", "avatar");
                    avatar.setAttribute("id", "avatar-id");
                    avatar.innerHTML = row.userID;
                    
                    let profilePic = document.createElement("img");
                    profilePic.setAttribute("src", "/img/userImages/" + row.userID + "id.jpg");

                    let notificationCard= document.createElement("div");
                    notificationCard.setAttribute("class", "notification-card");

                    let content = document.createElement("div");
                    content.setAttribute("id", "notification-content");
                    content.setAttribute("class", "notification-content");
                    content.innerHTML = row.caption;

                    let notificationHeader = document.createElement("div");
                    notificationHeader.setAttribute("class", "notification-header");

                    let time = document.createElement("div");
                    time.setAttribute("id", "notification-time");
                    time.setAttribute("class", "notification-time");
                    time.innerHTML = row.playtime;

                    let cardText1 = document.createElement("span");
                    cardText1.setAttribute("class", "material-symbols-outlined");
                    cardText1.setAttribute("type", "button");
                    cardText1.innerHTML = "delete";
                    cardText1.setAttribute("onclick", "removePost(this.id)");
                    cardText1.setAttribute("id", row.timelineID);
                  
                    document.getElementById("timeline-cards").appendChild(card);
                    card.appendChild(cardText2);
                    card.appendChild(cardHeader);
                    cardHeader.appendChild(cardDate);
                    card.appendChild(notificationGrid);
                    notificationGrid.appendChild(avatar);
                    avatar.appendChild(profilePic);
                    notificationGrid.appendChild(notificationCard);
                    notificationCard.appendChild(notificationHeader);
                    notificationCard.appendChild(photo);
                    notificationCard.appendChild(content);
                    notificationHeader.appendChild(time);
                    notificationHeader.appendChild(cardText1);
                }
                    let caption = document.querySelectorAll(".notification-content");
                    for(let j = 0; j < caption.length; j++) {
                        caption[j].addEventListener("click", editCaption);
                    }
                } else {
                   
                }
            } else {
           
            }
        } else {
           
        }
    };
    xhr.open("GET", "/get-timeline");
    xhr.send();
}
getTimeline();

function editCaption(e) {
    let spanText = e.target.innerHTML;
    let parent = e.target.parentNode;
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function(e) {
        let v = null;
        if(e.which == 13) {
            v = input.value;
            let newSpan = document.createElement("span");
            newSpan.addEventListener("click", editCaption);
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {timelineID: document.getElementById("timelineID").innerHTML,
                              caption: v};         
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                      getTimeline();
                    } else {
                   
                    }
                } else {
                  
                }
            };
            xhr.open("POST", "/update-timeline-caption");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("timelineID=" + dataToSend.timelineID + "&caption=" + dataToSend.caption);
        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);
}

document.getElementById("submit").addEventListener("click", function(e) {
    e.preventDefault();

    const imageUpload = document.querySelector('#image-upload');
    const picData = new FormData();
    for(let i = 0; i < imageUpload.files.length; i++) {
        picData.append("files", imageUpload.files[i]);
    }
 
    const options = {
        method: 'POST',
        body: picData,
    };
    fetch("/upload-timeline", options).then(function(res) {
        console.log(res);
    }).catch(function(err) {("Error:", err)});

    const current = new Date();
    const time = current.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    let formData = {playimage: time,
                    userID: document.getElementById("avatar-id").innerHTML,
                    timelineID: document.getElementById("timelineID").innerHTML,
                    caption: document.getElementById("caption").value};
    document.getElementById("caption").value = "";

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
          
              document.getElementById("add-status").innerHTML = "DB updated.";
            } else {
             
            }
        } else {
         
        }
    };
    xhr.open("POST", "/add-timeline");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.send("caption=" + formData.caption + "&timelineID=" + formData.timelineID + "&userID=" + formData.userID + "&playimage=" + formData.playimage);
});

function removePost(clicked_id) {
    //console.log(clicked_id);
    var result = confirm("Are you sure you want to delete this post?");
    if(result) {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.readyState == XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    getTimeline();
                } else { 
            }
        } else {
           
        }
    };
    xhr.open("POST", "/delete-post");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("timelineID=" + clicked_id);
    } 
    
}

