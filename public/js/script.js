const   headMenu = document.querySelector('#headMenu');
const   wholeMenu = document.querySelector('#wholeMenu');
const   submenu1  = document.querySelector('#submenu1');
const   menuOne   = document.querySelector('#menuOne');
const   submenu2  = document.querySelector('#submenu2');
const   menuSecond    = document.querySelector('#menuSecond');

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

headMenu.addEventListener('click', showWholeMenu);
submenu1.addEventListener('click', showSubmenu1);
submenu2.addEventListener('click', showSubmenu2);