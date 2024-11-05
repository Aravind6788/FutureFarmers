document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".comments").addEventListener("click", function() {
       document.querySelector(".chat-window").classList.toggle("chat-window1");
       
       document.querySelector(".chat-window1").classList.toggle("chat-window");
    });
});