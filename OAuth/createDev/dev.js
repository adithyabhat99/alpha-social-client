const host = "http://localhost";
if (!window.localStorage.hasOwnProperty("x-access-token")) {
  location.href =
    "../Welcome/welcome.html?redirected=true&referrer=OAuth/createDev/dev.html";
}
const token = window.localStorage.getItem("x-access-token");
const basicHeader = {
  "x-access-token": token
};
document.addEventListener("DOMContentLoaded", function() {
  document.querySelector(".create").addEventListener("click", event => {
    event.preventDefault();
    var url = host + `/api/v1.0/auth/devaccount`;
    fetch(url, {
      method: "PUT",
      headers: basicHeader
    })
      .then(r => r.json())
      .then(r => {
        if (r.hasOwnProperty("error")) {
          console.log(r);
          alert(r["error"]);
          return;
        }
        document.querySelector(".res").innerText =
          "Fetch your api token by sending (POST) basic auth request (username and password) of alpha-social to <a href=host+'/api/v1.0/a/login'host+>/api/v1.0/a/login</a>";
      });
  });
});
