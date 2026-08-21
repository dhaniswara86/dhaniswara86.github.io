
document.addEventListener("DOMContentLoaded",function(){

const id =
new URLSearchParams(window.location.search).get("id");


document
.querySelectorAll(".action-button")
.forEach(function(button){

const url =
new URL(button.href,window.location.origin);

url.searchParams.set("id",id);

button.href=url.toString();

});

});
