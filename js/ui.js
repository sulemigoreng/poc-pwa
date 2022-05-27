var btn_add = document.getElementById("btn-add");
btn_add.addEventListener("click", () => {
    
});

// Mobile UI
var btn_nav = document.getElementById("m-nav-btn");
var btn_nav_back = document.getElementById("m-btn-back");
var m_nav = document.getElementById("m-navbar");

btn_nav.addEventListener("click", () => {
    m_nav.classList.remove("m-navbar-hide");
    m_nav.classList.add("m-navbar");
});

btn_nav_back.addEventListener("click", () => {
    m_nav.classList.remove("m-navbar");
    m_nav.classList.add("m-navbar-hide");
});