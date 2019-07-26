const postid=(new URL(location.href)).searchParams.get("postid");
if (!window.localStorage.hasOwnProperty("x-access-token")) {
  location.href = `../Welcome/welcome.html?redirected=true&referrer=Post/post.html?postid=${postid}`;
}
const token = window.localStorage.getItem("x-access-token");
const basicHeader = {
  "x-access-token": token
};
var num = 0;
var executed = false;

document.addEventListener("DOMContentLoaded", event => {
  FetchPost();
  Comments();
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
      Comments();
      executed = true;
      setTimeout(() => {
        executed = false;
      }, 3000);
    }
  };
});

function FetchPost(){
    var u=new URL(location.href);
    console.log();
    const url=`http://localhost/api/v1.0/getpostdetails?postid=${}`;
}