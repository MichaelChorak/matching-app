menuBtn = document.querySelector('#showMenu');
menu = document.querySelector('#menu');
sluitenMenu = document.querySelector('header > section > div:first-child');
inputIngredient = document.createElement('input');
addBtn = document.querySelector('#addBtn');
receptForm = document.querySelector('#voegReceptForm');
label = document.querySelector('#label');



function showMenu(){
  // menu.classList.add('laatMenuZien');
  if (menu.classList.contains('laatMenuZien')) {
    menu.classList.remove('laatMenuZien');
      menu.classList.remove('menuTerug');
  } else {
    menu.classList.add('laatMenuZien')
    menu.classList.add('menuTerug')
    }
  }

function closeMenu(){
  menu.classList.remove('menuTerug');
  //
}

function voegRegelToe(){
  //creeer een input element on click
  let inputIngredient = document.createElement('input');
  //voeg attributen toe zodat ze overeen komen met de overige input attributen
  inputIngredient.setAttribute('type', 'text');
  inputIngredient.setAttribute('name', 'ingredienten');
  inputIngredient.setAttribute('value', '');
  inputIngredient.setAttribute('class', 'testInput');
  //voeg het toe als child van de label
  label.appendChild(inputIngredient);
}


addBtn.addEventListener('click', voegRegelToe);
menuBtn.addEventListener('click', showMenu);
sluitenMenu.addEventListener('click', closeMenu);
