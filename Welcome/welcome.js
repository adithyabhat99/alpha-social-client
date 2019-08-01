const host = "http://f982ac52.ngrok.io";
const lurl = host + "/api/v1.0/a/login";
const curl = host + "/api/v1.0/a/createaccount";
const basicHeader = {
  "Content-Type": "application/json"
};

document.addEventListener("DOMContentLoaded", function() {
  // Login
  document.getElementById("lbtn").addEventListener("click", event => {
    event.preventDefault();
    let username = document.getElementById("usn").value;
    let password = document.getElementById("psw").value;
    if (username == "") alert("Enter Username,Email or Phone");
    else if (password == "") alert("Enter Password");
    else {
      let headers = new Headers();
      headers.set("Authorization", "Basic " + btoa(`${username}:${password}`));
      fetch(lurl, {
        method: "POST",
        headers: headers
      })
        .then(response => response.json())
        .then(message => {
          if (message.hasOwnProperty("error")) {
            alert("Username or password is wrong");
            return;
          }
          window.localStorage.setItem(
            "x-access-token",
            message["x-access-token"]
          );
          var userurl = host + `/api/v1.0/a/getuserid?username=${username}`;
          var authHeader = {
            "Content-Type": "application/json",
            "x-access-token": message["x-access-token"]
          };
          fetch(userurl, {
            method: "GET",
            headers: authHeader
          })
            .then(response => response.json())
            .then(Userid => {
              window.localStorage.setItem("userid", Userid["userid"]);
              window.localStorage.setItem("username", Userid["username"]);
              redirectionFunc();
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    }
  });

  //   Create account
  document.getElementById("cbtn").addEventListener("click", event => {
    event.preventDefault();
    let fn = document.getElementById("fn").value;
    let ln = document.getElementById("ln").value;
    let un = document.getElementById("un").value;
    let pw = document.getElementById("pw").value;
    let em = document.getElementById("em").value;
    let ph = document.getElementById("ph").value;
    let ab = document.getElementById("ab").value;
    let pb = document.getElementById("pb").checked;
    if (em == "") em = "Null";
    if (ph == "") ph = "Null";
    if (ab == "") ab = "Null";
    if (fn == "" || ln == "") {
      alert("Enter full name");
    } else if (un == "") {
      alert("Enter username");
    } else if (pw == "") {
      alert("Enter password");
    } else if (em == "" || ph == "") {
      alert("Enter either email or password");
    } else {
      let data = {
        username: un,
        password: pw,
        firstname: fn,
        lastname: ln,
        email: em,
        phoneno: ph,
        bio: ab,
        public: pb == false ? "0" : "1"
      };
      fetch(curl, {
        method: "POST",
        headers: basicHeader,
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(message => {
          if (message.hasOwnProperty("error")) {
            alert(message["error"]);
          }
          window.localStorage.setItem(
            "x-access-token",
            message["x-access-token"]
          );
          window.localStorage.setItem("userid", message["userid"]);
          window.localStorage.setItem("username", un);
          redirectionFunc();
        })
        .catch(error => {
          console.log(error);
          alert(error["error"]);
        });
    }
  });
});

function redirectionFunc() {
  let Url = new URL(location.href);
  if (Url.searchParams.get("redirected") == "true") {
    if (
      Url.searchParams.get("devid") != null &&
      Url.searchParams.get("access") == "basic" &&
      Url.searchParams.get("function") != null &&
      Url.searchParams.get("referrer") != null
    ) {
      location.href = `../OAuth/basic.html?devid=${Url.searchParams.get(
        "devid"
      )}&referrer=${Url.searchParams.get(
        "referrer"
      )}&function=${Url.searchParams.get("function")}`;
    }
    if (Url.searchParams.get("referrer") != null) {
      location.href = `../${Url.searchParams.get("referrer")}`;
    }
  } else {
    location.href = "../index.html";
  }
}
