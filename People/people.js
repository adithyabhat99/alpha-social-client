if (!window.localStorage.hasOwnProperty("x-access-token")) {
  location.href = "../Welcome/welcome.html?redirected=true&referrer=People/people.html";
}
const token = window.localStorage.getItem("x-access-token");
const basicHeader = {
  "x-access-token": token
};
var num = 0;
document.addEventListener("DOMContentLoaded", event => {
  requests();
  suggestions();
});
function requests() {
  var url = `http://localhost/api/v1.0/f/getrequestlist`;
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
        var dpurl = `http://localhost/api/v1.0/a/getprofilepic?userid2=${
          data["list"][i]["userid"]
        }`;
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
            return "";
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
function suggestions() {}
