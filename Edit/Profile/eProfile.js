const host = "http://f982ac52.ngrok.io";
if (!window.localStorage.hasOwnProperty("x-access-token")) {
  location.href =
    "../../Welcome/welcome.html?redirected=true&referrer=index.html";
}
const token = window.localStorage.getItem("x-access-token");
const basicHeader = {
  "x-access-token": token,
  "Content-Type": "application/json"
};
const userid = window.localStorage.getItem("userid");
const username = window.localStorage.getItem("username");
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".header").innerText =
    "Hi," + window.localStorage.getItem("username");
  document.querySelector("#cbtn").addEventListener("click", e => {
    let fn = document.querySelector("#fn").value;
    let ln = document.querySelector("#ln").value;
    let un = document.querySelector("#un").value;
    let opw = document.querySelector("#opw").value;
    let pw = document.querySelector("#pw").value;
    let em = document.querySelector("#em").value;
    let ph = document.querySelector("#ph").value;
    let ab = document.querySelector("#ab").value;

    if (fn != "" && ln != "") {
      Fetch(host + `/api/v1.0/a/update/name`, {
        new_firstname: fn,
        new_lastname: ln
      });
    }
    if (un != "") {
      Fetch(host + `/api/v1.0/a/update/username`, {
        new_username: un
      });
      window.localStorage.setItem("username", un);
    }
    if (opw != "" && pw != "") {
      Fetch(host + `/api/v1.0/a/update/password`, {
        new_password: pw,
        old_password: opw
      });
    }
    if (em != "") {
      Fetch(host + `/api/v1.0/a/update/email`, { new_email: em });
    }
    if (ph != "") {
      Fetch(host + `/api/v1.0/a/update/phoneno`, { new_phoneno: ph });
    }
    if (ab != "") {
      Fetch(host + `/api/v1.0/a/update/bio`, { new_bio: ab });
    }

    location.href = `../../Profile/profile.html`;
  });
  let pb = document.querySelector("#pb").checked;
  pb = pb == true ? "1" : "0";
  Fetch(host + `/api/v1.0/a/update/public`, { public: pb });

  document.querySelector(".Image").addEventListener("change", event => {
    document.querySelector(".preview").src = URL.createObjectURL(
      event.target.files[0]
    );
  });
  document.querySelector(".upload").addEventListener("click", e => {
    let Image = document.getElementById("Image").files[0];
    let purl = host + `/api/v1.0/a/update/profilepic`;
    let form = new FormData();
    form.append("file", Image);
    fetch(purl, {
      method: "PUT",
      headers: basicHeader,
      body: form
    })
      .then(r => r.json())
      .then(d => {
        if (d.hasOwnProperty("error")) {
          console.log(d);
          alert(d["error"]);
          return;
        }
      })
      .catch(e => {
        console.log(e);
        return;
      });
  });
});

function Fetch(url, data) {
  fetch(url, {
    method: "PUT",
    headers: basicHeader,
    body: JSON.stringify(data)
  })
    .then(r => r.json())
    .then(d => {
      if (d.hasOwnProperty("error")) {
        console.log(d);
        alert(d["error"]);
        return;
      }
    })
    .catch(e => {
      console.log(e);
      return;
    });
}
