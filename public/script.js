menuBtn = document.querySelector('#showMenu');
menu = document.querySelector('#menu');
sluitenMenu = document.querySelector('header > section > div:first-child');

console.log(sluitenMenu);

function showMenu(){
  menu.classList.add('laatMenuZien');
}

function closeMenu(){
  menu.classList.remove('laatMenuZien');
}

menuBtn.addEventListener('click', showMenu);
sluitenMenu.addEventListener('click', closeMenu);
