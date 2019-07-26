if (!window.localStorage.hasOwnProperty("x-access-token")) {
  location.href = "../Welcome/welcome.html?redirected=true&referrer=List/list.html";
}
const token = window.localStorage.getItem("x-access-token");
const basicHeader = {
  "x-access-token": token
};
var num = 0;
var executed = false;
document.addEventListener("DOMContentLoaded", function() {
  List();
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
      List();
      executed = true;
      setTimeout(() => {
        executed = false;
      }, 3000);
    }
  };

  document.querySelector(".requests").addEventListener("click", event => {
    let c = event.target.className;
    let myid = window.localStorage.getItem("userid");
    if (c == "reimg" || c == "reP" || c == "request") {
      let userid = event.target.parentElement.getAttribute("userid");
      if (c == "request") {
        userid = event.target.getAttribute("userid");
      }
      location.href = `../User/user.html?userid=${userid}`;
    }
  });
});

function List() {
  let Url = new URL(location.href);
  let type = Url.searchParams.get("type");
  let url;
  let topHeader = document.querySelector(".header");
  if (type == "followers") {
    topHeader.innerText = "Followers";
    let userid = new URL(location.href).searchParams.get("userid");
    url = `http://localhost/api/v1.0/f/getfollowerslist?userid=${userid}&num=${num}`;
  }
  if (type == "following") {
    topHeader.innerText = "Following";
    let userid = new URL(location.href).searchParams.get("userid");
    url = `http://localhost/api/v1.0/f/getfollowinglist?userid=${userid}`;
  }
  if (type == "likes") {
    topHeader.innerText = "Likes";
    let postid = new URL(location.href).searchParams.get("postid");
    url = `http://localhost/api/v1.0/p/getlikeslist?postid=${postid}&num=${num}`;
  }
  fetch(url, { method: "GET", headers: basicHeader })
    .then(response => response.json())
    .then(data => {
      if (data.hasOwnProperty("error")) {
        console.log(data);
        return;
      }
      Array.from(data["list"]).forEach(element => {
        let username = element["username"];
        let userid = element["userid"];
        let f = element["userfollows"];
        let myid = window.localStorage.getItem("userid");

        let Request = document.createElement("div");
        Request.setAttribute("userid", userid);
        Request.className = "request";
        let reimg = document.createElement("img");
        reimg.className = "reimg";
        let reP = document.createElement("p");
        reP.className = "reP";
        reP.innerText = username;
        var dpurl = `http://localhost/api/v1.0/a/getprofilepic?userid2=${userid}`;
        fetch(dpurl, {
          method: "GET",
          headers: basicHeader
        })
          .then(resonse => resonse.blob())
          .then(dpBlob => {
            var dpourl = URL.createObjectURL(dpBlob);
            reimg.src = dpourl;
          })
          .catch(error => {
            console.log(error);
            return;
          });
        Request.appendChild(reimg);
        Request.appendChild(reP);
        document.querySelector(".requests").appendChild(Request);
      });
    })
    .catch(error => {
      console.log("error");
    });
}
