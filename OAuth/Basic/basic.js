if (!window.localStorage.hasOwnProperty("x-access-token")) {
  location.href =
    "../Welcome/welcome.html?redirected=true&referrer=OAuth/Basic/basic.html";
}
const token = window.localStorage.getItem("x-access-token");
const basicHeader = {
  "x-access-token": token
};

const Url = new URL(location.href);

document.addEventListener("DOMContentLoaded", function() {
  let referrer = Url.searchParams.get("referrer");
  let devid = Url.searchParams.get("devid");
  let func = Url.searchParams.get("function");
  document.querySelector(".ok").addEventListener("click", event => {
    event.preventDefault();
    let url = `http://localhost/api/v1.0/auth/grantbasicaccess?devid=${devid}`;
    fetch(url, {
      method: "PUT",
      headers: basicHeader
    })
      .then(response => response.json())
      .then(data => {
        if (data.hasOwnProperty("error")) {
          location.href = `${referrer}?error=true`;
          console.log(data);
          return;
        }
        location.href = `${referrer}?alpha_userid=${
          data["userid"]
        }&function=${func}&alpha_error=false`;
      })
      .catch(error => {
        console.log(error);
        location.href = `${referrer}?function=${func}&alpha_error=false`;
      });
  });
  document.querySelector(".cancel").addEventListener("click", event => {
    location.href = `${referrer}?function=${func}&alpha_error=false`;
  });
});
