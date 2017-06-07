if (document.querySelector('iframe') != null) {
    document.querySelector('iframe').height = window.innerHeight - 64;
}
var triangle = document.querySelector(".triangle");
var dropmenu = document.querySelectorAll(".dropMenu");
var dropbtns = document.querySelectorAll(".dropbtn");
if(triangle!=null){
    triangle.addEventListener("click", function () {
        document.querySelectorAll(".dropdown").forEach(dropdowns => dropdowns.classList.toggle("show"));
        triangle.classList.toggle("triangle-show");
    })
}
dropbtns.forEach(dBtn => dBtn.addEventListener('click', dropdown));

function dropdown() {
    this.nextElementSibling.classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (e) {
    if (!e.target.matches('.dropbtn>a>.dropclick')) {
        dropmenu.forEach(menu => {
            if (menu.classList.contains('show')) {
                menu.classList.remove('show');
            }
        });
    }
}