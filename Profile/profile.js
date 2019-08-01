const host = "http://f982ac52.ngrok.io";
if (!window.localStorage.hasOwnProperty("x-access-token")) {
  location.href =
    "../Welcome/welcome.html?redirected=true&referrer=Profile/profile.html";
}
const token = window.localStorage.getItem("x-access-token");
const basicHeader = {
  "x-access-token": token
};
var num = 0;
var executed = false;
document.addEventListener("DOMContentLoaded", event => {
  var myurl = host + `/api/v1.0/a/getmydetails`;
  fetch(myurl, {
    method: "GET",
    headers: basicHeader
  })
    .then(resonse => resonse.json())
    .then(data => {
      if (data.hasOwnProperty("error")) {
        console.log(data);
        return;
      }
      document.querySelector(".username").innerText +=
        data["details"]["username"];
      document.querySelector(".firstname").innerText +=
        data["details"]["firstname"];
      document.querySelector(".lastname").innerText +=
        data["details"]["lastname"];
      document.querySelector(".email").innerText +=
        data["details"]["email"] == null ? "" : data["details"]["email"];
      document.querySelector(".phone").innerText +=
        data["details"]["phoneno"] == null ? "" : data["details"]["phoneno"];
      document.querySelector(".followers").innerText +=
        data["details"]["followerscount"];
      document.querySelector(".following").innerText +=
        data["details"]["followingcount"];
      document.querySelector(".bio").innerText +=
        data["details"]["bio"] == null ? "" : data["details"]["bio"];

      document.querySelector(".astatus").innerText +=
        data["details"]["public"] == 1 ? " Public" : " Private";

      var dpurl = host + `/api/v1.0/a/getprofilepic?userid2=${window.localStorage.getItem("userid")}`;
      fetch(dpurl, {
        method: "GET",
        headers: basicHeader
      })
        .then(resonse => resonse.blob())
        .then(dpBlob => {
          let dpourl = URL.createObjectURL(dpBlob);
          document.querySelector(".mydp").src = dpourl;
        })
        .catch(error => {
          console.log(error);
          return;
        });
    })
    .catch(error => {
      console.log(error);
    });
  Posts();
  window.onscroll = function() {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      document.getElementById("back-top").style.display = "block";
    } else {
      document.getElementById("back-top").style.display = "none";
    }
    if (
      window.scrollY > document.body.offsetHeight - window.outerHeight &&
      executed == false
    ) {
      num += 1;
      Posts();
      executed = true;
      setTimeout(() => {
        executed = false;
      }, 3000);
    }
  };

  document.querySelector(".Details").addEventListener("click", event => {
    e = event.target.className;
    if (e == "followers") {
      location.href = `../List/list.html?type=followers&userid=${window.localStorage.getItem(
        "userid"
      )}`;
    }
    if (e == "following") {
      location.href = `../List/list.html?type=following&userid=${window.localStorage.getItem(
        "userid"
      )}`;
    }
    if (e == "edit far fa-edit") {
      location.href = `../Edit/Profile/eProfile.html`;
    }
    if (e == "upload fas fa-upload") {
      location.href = "../Upload/upload.html";
    }
    if (e == "dev fab fa-dev") {
      location.href = "../OAuth/Dev/dev.html";
    }
    if (e == "logout fas fa-sign-out-alt") {
      localStorage.removeItem("x-access-token");
      localStorage.removeItem("userid");
      localStorage.removeItem("username");
      location.href = "../Welcome/welcome.html";
    }
  });

  document.querySelector(".posts").addEventListener("click", event => {
    var e = event.target.className;
    if (
      e == "image-footer" ||
      e == "comment far fa-comment" ||
      e == "comments" ||
      e == "pimg"
    ) {
      location.href = `../Post/post.html?postid=${event.target.parentElement.getAttribute(
        "postid"
      )}`;
    }
    if (e == "like far fa-thumbs-up") {
      var lurl =
        host +
        `/api/v1.0/p/like/post?postid=${event.target.parentElement.getAttribute(
          "postid"
        )}`;
      var ulurl =
        host +
        `/api/v1.0/p/delete/like?postid=${event.target.parentElement.getAttribute(
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
            let l = event.target.parentElement.firstChild.nextSibling.innerText;
            let L = parseInt(l) + 1;
            event.target.parentElement.firstChild.nextSibling.innerText = L.toString();
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        event.target.style.color = "black";
        fetch(ulurl, {
          method: "DELETE",
          headers: basicHeader
        })
          .then(response => response.json())
          .then(data => {
            if (data.hasOwnProperty("error")) {
              console.log("error");
            }
            let l = event.target.parentElement.firstChild.nextSibling.innerText;
            let L = parseInt(l) - 1;
            event.target.parentElement.firstChild.nextSibling.innerText = L.toString();
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
    if (e == "likes") {
      location.href = `../List/list.html?type=likes&postid=${event.target.parentElement.getAttribute(
        "postid"
      )}`;
    }
  });
});
function Posts() {
  let url = host + `/api/v1.0/p/getpostsfor/user?num=${num}`;
  fetch(url, {
    method: "GET",
    headers: basicHeader
  })
    .then(response => response.json())
    .then(data => {
      if (data.hasOwnProperty("error")) {
        alert("Error");
        console.log(data);
        return;
      }
      for (let i = 0; i < data["list"].length; i++) {
        let post = document.createElement("div");
        post.className = "post";
        let imageHeader = document.createElement("div");
        imageHeader.className = "image-header";
        let dp = document.createElement("img");
        dp.className = "dp";
        let details = document.createElement("div");
        details.className = "details";
        let username = document.createElement("a");
        username.className = "username";
        let location = document.createElement("p");
        location.className = "location";
        let caption = document.createElement("p");
        caption.className = "caption";
        let image = document.createElement("div");
        image.className = "image";
        let pimg = document.createElement("img");
        pimg.className = "pimg";
        let imageFooter = document.createElement("div");
        imageFooter.className = "image-footer";
        let like = document.createElement("i");
        like.className = "like far fa-thumbs-up";
        let nolikes = document.createElement("p");
        nolikes.className = "nolikes";
        let comment = document.createElement("i");
        comment.className = "comment far fa-comment";
        let nocomments = document.createElement("p");
        nocomments.className = "nocomments";
        let likes = document.createElement("a");
        likes.className = "likes";
        likes.innerText = "Likes";
        let comments = document.createElement("a");
        comments.className = "comments";
        comments.innerText = "Comments";
        var userid = data["list"][i]["userid"];
        var dpurl = host + `/api/v1.0/a/getprofilepic?userid2=${userid}`;
        fetch(dpurl, {
          method: "GET",
          headers: basicHeader
        })
          .then(resonse => resonse.blob())
          .then(dpBlob => {
            var dpourl = URL.createObjectURL(dpBlob);
            dp.src = dpourl;
          })
          .catch(error => {
            console.log(error);
            return;
          });
        username.href = `../User/user.html?userid=${userid}`;
        var uurl = host + `/api/v1.0/a/getusername?userid2=${userid}`;
        fetch(uurl, { method: "GET", headers: basicHeader })
          .then(response => response.json())
          .then(usname => {
            if (usname.hasOwnProperty("error")) {
              console.log(data);
              return;
            }
            username.innerText = usname["username"];
          })
          .catch(error => {
            console.log(error);
            return;
          });
        location.innerText = data["list"][i]["location"];
        caption.innerText = data["list"][i]["caption"];
        var purl =
          host + `/api/v1.0/p/getpost?postid=${data["list"][i]["postid"]}`;
        fetch(purl, {
          metod: "GET",
          headers: basicHeader
        })
          .then(response => response.blob())
          .then(pblob => {
            var pourl = URL.createObjectURL(pblob);
            pimg.src = pourl;
          })
          .catch(error => {
            console.log(error);
          });
        if (data["list"][i]["userliked"] == 1) {
          like.style.color = "yellow";
        } else {
          like.style.color = "black";
        }
        nolikes.innerText = data["list"][i]["likes"];
        nocomments.innerText = data["list"][i]["comments"];
        imageHeader.setAttribute("userid", data["list"][i]["userid"]);
        image.setAttribute("postid", data["list"][i]["postid"]);
        imageFooter.setAttribute("postid", data["list"][i]["postid"]);
        imageHeader.appendChild(dp);
        imageHeader.appendChild(details);
        imageHeader.appendChild(caption);
        details.appendChild(username);
        details.appendChild(location);
        imageFooter.appendChild(like);
        imageFooter.appendChild(nolikes);
        imageFooter.appendChild(comment);
        imageFooter.appendChild(nocomments);
        imageFooter.appendChild(likes);
        imageFooter.appendChild(comments);
        image.appendChild(pimg);
        post.appendChild(imageHeader);
        post.appendChild(image);
        post.appendChild(imageFooter);
        post.setAttribute("postid", data["list"][i]["postid"]);
        //When I set box-shadow inside css it wast't working,So added here
        post.style.boxShadow = "0 1px 5px rgba(104, 104, 104, 0.8)";
        document.querySelector(".posts").appendChild(post);
      }
    })
    .catch(error => {
      console.log(error);
      return;
    });
}
