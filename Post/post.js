const host = "http://localhost";
const postid = new URL(location.href).searchParams.get("postid");
if (!window.localStorage.hasOwnProperty("x-access-token")) {
  location.href = `../Welcome/welcome.html?redirected=true&referrer=Post/post.html?postid=${postid}`;
}
const token = window.localStorage.getItem("x-access-token");
const basicHeader = {
  "Content-Type": "application/json",
  "x-access-token": token
};
const myid = window.localStorage.getItem("userid");
var num = 0;
var executed = false;
document.addEventListener("DOMContentLoaded", event => {

  document.querySelector(".image-header").addEventListener("click",event=>{
    let e=event.target.className;
    let Userid=document.querySelector(".image-header").getAttribute("userid");
    if(e=="image-header" || e=="dp" || e=="username" || e=="details"){
      location.href=`../User/user.html?userid=${Userid}`;
    }
  });



  const url = host + `/api/v1.0/p/postdetails?postid=${postid}`;
  fetch(url, {
    method: "GET",
    headers: basicHeader
  })
    .then(res => res.json())
    .then(data => {
      if (data.hasOwnProperty("error")) {
        console.log(data);
        return;
      }
      data = data["data"];
      document
        .querySelector(".image-header")
        .setAttribute("userid", data["userid"]);
      document.querySelector(".location").innerText =
        data["location"] == null ? "" : data["location"];
      document.querySelector(".caption").innerText =
        data["location"] == null ? "" : data["caption"];
      document.querySelector(".like").style.color =
        data["userliked"] == 1 ? "yellow" : "black";
      document.querySelector(".nolikes").innerText = data["likes"];
      let uurl = host + `/api/v1.0/a/username?userid2=${data["userid"]}`;
      fetch(uurl, { method: "GET", headers: basicHeader })
        .then(response => response.json())
        .then(usname => {
          if (usname.hasOwnProperty("error")) {
            console.log(data);
            return;
          }
          document.querySelector(".username").innerText = usname["username"];
        })
        .catch(error => {
          console.log(error);
          return;
        });

      let dpurl = host + `/api/v1.0/a/profilepic?userid2=${data["userid"]}`;
      fetch(dpurl, {
        method: "GET",
        headers: basicHeader
      })
        .then(resonse => resonse.blob())
        .then(dpBlob => {
          var dpourl = URL.createObjectURL(dpBlob);
          document.querySelector(".dp").src = dpourl;
        })
        .catch(error => {
          console.log(error);
          return;
        });
      let purl = host + `/api/v1.0/p/post?postid=${data["postid"]}`;
      fetch(purl, {
        metod: "GET",
        headers: basicHeader
      })
        .then(response => response.blob())
        .then(pblob => {
          var pourl = URL.createObjectURL(pblob);
          document.querySelector(".pimg").src = pourl;
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
      return;
    });

  window.onscroll = function() {
    if (
      window.scrollY > document.body.offsetHeight - window.outerHeight &&
      executed == false
    ) {
      num += 1;
      //Comments();
      executed = true;
      setTimeout(() => {
        executed = false;
      }, 3000);
    }
  };

  document.querySelector(".image-footer").addEventListener("click", event => {
    let e = event.target.className;
    if (e == "like far fa-thumbs-up") {
      var lurl =
        host +
        `/api/v1.0/p/like?postid=${event.target.parentElement.getAttribute(
          "postid"
        )}`;
      if (event.target.style.color == "black") {
        event.target.style.color = "yellow";
        fetch(lurl, {
          method: "PUT",
          headers: basicHeader
        })
          .then(response => response.json())
          .then(data => {
            if (data.hasOwnProperty("error")) {
              console.log(data);
              return;
            }
            let l = document.querySelector(".nolikes").innerText;
            let L = parseInt(l) + 1;
            document.querySelector(".nolikes").innerText = L.toString();
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        event.target.style.color = "black";
        fetch(lurl, {
          method: "DELETE",
          headers: basicHeader
        })
          .then(response => response.json())
          .then(data => {
            if (data.hasOwnProperty("error")) {
              console.log(data);
              return;
            }
            let l = document.querySelector(".nolikes").innerText;
            let L = parseInt(l) - 1;
            document.querySelector(".nolikes").innerText = L.toString();
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
    if (e == "likes") {
      location.href = `../List/list.html?type=likes&postid=${postid}`;
    }
  });

  let curl = host + `/api/v1.0/p/commentslist?postid=${postid}&num=${num}`;
  fetch(curl, {
    method: "GET",
    headers: basicHeader
  })
    .then(res => res.json())
    .then(data => {
      if (data.hasOwnProperty("error")) {
        console.log(data);
        return;
      }
      Array.from(data["list"]).forEach(item => {
        let userComment = document.createElement("div");
        userComment.className = "userComment";
        let Username = document.createElement("Username");
        Username.className = "Username";
        let message = document.createElement("message");
        message.className = "message";
        userComment.setAttribute("userid", item["userid"]);
        Username.innerText = item["username"];
        message.innerText = item["message"];
        let Delete = document.createElement("button");
        Delete.className = "delete";
        Delete.setAttribute("commentid", item["commentid"]);
        Delete.innerText = "Delete";
        userComment.appendChild(Username);
        userComment.appendChild(message);
        if (item["userid"] == myid) {
          Delete.style.display = "block";
          userComment.appendChild(Delete);
        }
        document.querySelector(".Comments").appendChild(userComment);
      });
    })
    .catch(error => {
      console.log(error);
      return;
    });

  document.querySelector(".commentBtn").addEventListener("click", event => {
    let Message = document.querySelector(".commentInput").value;
    if (Message == "") {
      alert("Empty comment not possible");
      return;
    }
    let curl = host + `/api/v1.0/p/comment?postid=${postid}`;
    let data = { comment: Message };
    fetch(curl, {
      method: "POST",
      headers: basicHeader,
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.hasOwnProperty("error")) {
          console.log(data);
          return;
        }
        let userComment = document.createElement("div");
        userComment.className = "userComment";
        let Username = document.createElement("Username");
        Username.className = "Username";
        let message = document.createElement("message");
        message.className = "message";
        userComment.setAttribute(
          "userid",
          window.localStorage.getItem["userid"]
        );
        Username.innerText = window.localStorage.getItem("username");
        message.innerText = Message;
        userComment.appendChild(Username);
        userComment.appendChild(message);
        document.querySelector(".Comments").appendChild(userComment);
      })
      .catch(error => {
        console.log(error);
      });
  });

  document.querySelector(".Comments").addEventListener("click", event => {
    let e = event.target.className;
    if (e == "delete") {
      let durl =
        host +
        `/api/v1.0/p/comment?commentid=${event.target.getAttribute(
          "commentid"
        )}`;
      fetch(durl, {
        method: "DELETE",
        headers: basicHeader
      })
        .then(r => r.json())
        .then(d => {
          if (d.hasOwnProperty("error")) {
            console.log(d);
            return;
          }
          event.target.parentElement.style.display = "none";
        })
        .catch(e => {
          console.log(e);
          return;
        });
    }
    if (e == "Username") {
      location.href = `../User/user.html?userid=${event.target.parentElement.getAttribute(
        "userid"
      )}`;
    }
  });
});
