const   headMenu = document.querySelector('#headMenu'); // rondje
const   wholeMenu = document.querySelector('#wholeMenu'); // dishes en persons
const   submenu1  = document.querySelector('#submenu1'); //dishes menuknop / naam
const   menuOne = document.querySelector('#menuOne'); //dishes menu
const   submenu2  = document.querySelector('#submenu2'); //persons menuknop / naam
const   menuSecond  = document.querySelector('#menuSecond'); // persons menu

function showWholeMenu() {
    wholeMenu.classList.toggle('showWholeMenu');
    console.log('showWholeMenu');
  }

  
function showSubmenu1() {
    menuOne.classList.toggle('showSubmenu1');
  }

function showSubmenu2() {
    menuSecond.classList.toggle('showSubmenu2');
  }

function showWholeHamburgermenu() {
    wholeHamburgermenu.classList.toggle('showWholeHamburgermenu');
  }

headMenu.addEventListener('click', showWholeMenu);
submenu1.addEventListener('click', showSubmenu1);
submenu2.addEventListener('click', showSubmenu2);