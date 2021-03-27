/* javascript: profile page, get a random image from an extern api */
// https://codepen.io/FlorinPop17/details/vYYaLwR
//https://www.youtube.com/watch?v=7f2HNadULOs
/* https://stackoverflow.com/questions/64420332/javascript-how-to-create-a-dropdown-effect-without-jquery */

const buttonRandomImage = document.getElementById('imageBtn');
const displayImage = document.getElementById('showImage');
const menuBtn = document.getElementById('settingBnt'); 
const dropdown = document.getElementsByClassName('showSettingsMenu')[0];

/* eventlistener */
buttonRandomImage.addEventListener('click', getRandomImage);
menuBtn.addEventListener('click', getShowSettings);

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
function getShowSettings() {
  this.classList.toggle("active");
  dropdown.classList.toggle("active");
}