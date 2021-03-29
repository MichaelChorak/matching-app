const hamburgermenu = document.querySelector("#hamburgermenu"); // persons menu
const wholeHamburgermenu = document.querySelector("#wholeHamburgermenu"); // persons menu

function showWholeHamburgermenu() {
  wholeHamburgermenu.classList.toggle("showWholeHamburgermenu");
}

hamburgermenu.addEventListener("click", showWholeHamburgermenu);
