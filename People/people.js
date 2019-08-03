const host = "http://localhost";
if (!window.localStorage.hasOwnProperty("x-access-token")) {
  location.href =
    "../Welcome/welcome.html?redirected=true&referrer=People/people.html";
}
const token = window.localStorage.getItem("x-access-token");
const basicHeader = {
  "x-access-token": token
};
var num = 0;
var executed = false;
document.addEventListener("DOMContentLoaded", event => {
  requests();
  suggestions();
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
      suggestions();
      executed = true;
      setTimeout(() => {
        executed = false;
      }, 3000);
    }
  };

  document.querySelector(".requests").addEventListener("click", event => {
    e = event.target.className;
    if (e == "accept") {
      let userid = event.target.parentElement.getAttribute("userid");
      let aurl = host + `/api/v1.0/f/approve?userid2=${userid}`;
      fetch(aurl, {
        method: "PUT",
        headers: basicHeader
      })
        .then(response => response.json())
        .then(data => {
          if (data.hasOwnProperty("error")) {
            console.log(data);
            return;
          }
          event.target.parentElement.style.display = "none";
        })
        .catch(error => {
          console.log(error);
          return;
        });
    }
    if (e == "reject") {
      let userid = event.target.parentElement.getAttribute("userid");
      let aurl = host + `/api/v1.0/f/disapprove?userid2=${userid}`;
      fetch(aurl, {
        method: "DELETE",
        headers: basicHeader
      })
        .then(response => response.json())
        .then(data => {
          if (data.hasOwnProperty("error")) {
            console.log(data);
            return;
          }
          event.target.parentElement.style.display = "none";
        })
        .catch(error => {
          console.log(error);
          return;
        });
    }
    if (e == "request") {
      location.href = `../User/user.html?userid=${event.target.getAttribute(
        "userid"
      )}`;
    }
  });

  document.querySelector(".suggestions").addEventListener("click", event => {
    let e = event.target.className;
    if (e == "request") {
      location.href = `../User/user.html?userid=${event.target.getAttribute(
        "userid"
      )}`;
    }
  });

  document.querySelector(".Submit").addEventListener("click", e => {
    let str = document.querySelector(".Sname").value;
    if (str == "") {
      alert("Enter name!");
      return;
    }
    let Name = str.split(" ");
    if (Name.length == 2) {
      let fn = Name[0];
      let ln = Name[1];
      location.href = `../List/list.html?type=search&fn=${fn}&ln=${ln}`;
    } else {
      location.href = `../List/list.html?type=search&fn=${str}`;
    }
  });
});
function requests() {
  var url = host + `/api/v1.0/f/requestslist`;
  fetch(url, {
    method: "GET",
    headers: basicHeader
  })
    .then(response => response.json())
    .then(data => {
      if (data.hasOwnProperty("error")) {
        console.log(data);
        return;
      }
      for (let i = 0; i < data["list"].length; i++) {
        let request = document.createElement("div");
        request.className = "request";
        let reimg = document.createElement("img");
        reimg.className = "reimg";
        let rep = document.createElement("p");
        rep.className = "reP";
        let accept = document.createElement("button");
        accept.className = "accept";
        let reject = document.createElement("button");
        reject.className = "delete";
        accept.innerText = "Accept";
        reject.innerText = "Reject";
        var dpurl =
          host +
          `/api/v1.0/a/profilepic?userid2=${data["list"][i]["userid"]}`;
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
        rep.innerText = data["list"][i]["username"];
        request.setAttribute("userid", data["list"][i]["userid"]);
        request.appendChild(reimg);
        request.appendChild(rep);
        request.appendChild(accept);
        request.appendChild(reject);
        request.style.boxShadow = "0 1px 5px rgba(104, 104, 104, 0.8)";
        document.querySelector(".requests").appendChild(request);
      }
    })
    .catch(error => {
      console.log("error");
    });
}
function suggestions() {
  var url = host + `/api/v1.0/f/suggestions/users?num=${num}`;
  fetch(url, {
    method: "GET",
    headers: basicHeader
  })
    .then(response => response.json())
    .then(data => {
      if (data.hasOwnProperty("error")) {
        console.log(data);
        return;
      }
      for (let i = 0; i < data["list"].length; i++) {
        let request = document.createElement("div");
        request.className = "request";
        let reimg = document.createElement("img");
        reimg.className = "reimg";
        let rep = document.createElement("p");
        rep.className = "reP";
        var dpurl =
          host +
          `/api/v1.0/a/profilepic?userid2=${data["list"][i]["userid"]}`;
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
        rep.innerText = data["list"][i]["username"];
        request.setAttribute("userid", data["list"][i]["userid"]);
        request.appendChild(reimg);
        request.appendChild(rep);
        request.style.boxShadow = "0 1px 5px rgba(104, 104, 104, 0.8)";
        document.querySelector(".suggestions").appendChild(request);
      }
    })
    .catch(error => {
      console.log("error");
    });
}