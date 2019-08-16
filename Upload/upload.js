const host = "http://localhost";
if (!window.localStorage.hasOwnProperty("x-access-token")) {
  location.href = "../Welcome/welcome.html?redirected=true&referrer=index.html";
}
const token = window.localStorage.getItem("x-access-token");
const basicHeader = {
  "x-access-token": token
};
const multiHeader = {
  "x-access-token": token,
  "Content-Type": "multipart/form-data"
};
document.addEventListener("DOMContentLoaded", function() {
  document.querySelector(".send").addEventListener("click", event => {
    event.preventDefault();
    if (document.getElementById("Image").files.length == 0) {
      alert("Select a file");
      return;
    }
    let caption =
      document.getElementById("caption").value == ""
        ? "Null"
        : document.getElementById("caption").value;
    let location =
      document.getElementById("location").value == ""
        ? "Null"
        : document.getElementById("location").value;
    let public = document.getElementById("public").checked == true ? "1" : "0";
    let Image = document.getElementById("Image").files[0];
    let details = {
      caption: caption,
      location: location,
      public: public
    };
    let form = new FormData();
    form.append("file", Image);
    form.append("details", JSON.stringify(details));
    let url = host + `/api/v1.0/p/post`;
    fetch(url, {
      method: "POST",
      headers: basicHeader,
      body: form
    })
      .then(response => response.json())
      .then(data => {
        if (data.hasOwnProperty("error")) {
          alert(data["error"]);
          return;
        }
        location.href = "../index.html";
      })
      .catch(error => {
        console.log(error);
        return;
      });
  });
  document.querySelector(".Image").addEventListener("change", event => {
    document.querySelector(".preview").src = URL.createObjectURL(
      event.target.files[0]
    );
  });
});
