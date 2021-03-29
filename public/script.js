menu = document.querySelector('#menu');
sluitenMenu = document.querySelector('header > section > div:first-child');
inputIngredient = document.createElement('input');
addBtn = document.querySelector('#addBtn');
receptForm = document.querySelector('#voegReceptForm');
label = document.querySelector('#label');


function voegRegelToe() {
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
