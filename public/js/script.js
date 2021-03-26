const   headMenu = document.querySelector('#headMenu');
const   wholeMenu = document.querySelector('#wholeMenu');
const   submenu1  = document.querySelector('#submenu1');
const   menuOne   = document.querySelector('#menuOne');
const   submenu2  = document.querySelector('#submenu2');
const   menuSecond    = document.querySelector('#menuSecond');

/* profile */
const buttonRandomImage = document.getElementById('imageBtn');
const displayImage = document.getElementById('showImage');
const menuBtn = document.getElementById('settingBnt'); 
const dropdown = document.getElementsByClassName('showSettingsMenu')[0];

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

/* javascript: profile page, get a random image from an extern api */
// https://codepen.io/FlorinPop17/details/vYYaLwR
//https://www.youtube.com/watch?v=7f2HNadULOs
/* funtion with the method fetch(), to get an random image*/
function getRandomImage() {
  fetch('https://random.dog/woof.json')
    .then(res => res.json())
    .then(data => {
      if (data.url.includes('.mp4')) {
        getRandomImage();
      }
      else {
        displayImage.innerHTML = `<img src=${data.url} alt="randomImage" />`;
      }
    });
}

/* settings menu microinteraction - profile page */
/* https://stackoverflow.com/questions/64420332/javascript-how-to-create-a-dropdown-effect-without-jquery */
function getShowSettings() {
  this.classList.toggle("active");
  dropdown.classList.toggle("active");
}

headMenu.addEventListener('click', showWholeMenu);
submenu1.addEventListener('click', showSubmenu1);
submenu2.addEventListener('click', showSubmenu2);

buttonRandomImage.addEventListener('click', getRandomImage);
menuBtn.addEventListener('click', getShowSettings);


