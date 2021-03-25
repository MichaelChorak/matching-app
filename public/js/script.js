/* javascript: profile page, get a random image from an extern api */
// https://codepen.io/FlorinPop17/details/vYYaLwR
//https://www.youtube.com/watch?v=7f2HNadULOs

const buttonRandomImage = document.getElementById('imageBtn');
const displayImage = document.getElementById('showImage');

buttonRandomImage.addEventListener('click', getRandomImage);

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
const menuBtn = document.getElementById('settingBnt'); //b
const dropdown = document.getElementsByClassName('showSettingsMenu')[0]; //ul
menuBtn.addEventListener('click', getShowSettings);

function getShowSettings() {
  this.classList.toggle("active");
  dropdown.classList.toggle("active");
}
