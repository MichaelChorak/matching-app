/* javascript: profile page, get a random image from an extern api */
// https://github.com/public-apis/public-apis
//https://www.youtube.com/watch?v=7f2HNadULOs
/* https://stackoverflow.com/questions/64420332/javascript-how-to-create-a-dropdown-effect-without-jquery */

const buttonRandomImage = document.getElementById("imageBtn");
const bntImageOnclick = document.getElementById("imageBtn");
const displayImage = document.getElementById("showImage");
const menuBtn = document.getElementById("settingBnt");
const dropdown = document.querySelector(".showSettingsMenu");

/* eventlistener */
buttonRandomImage.addEventListener("click", getRandomImage);
menuBtn.addEventListener("click", getShowSettings);

/* onclick */
bntImageOnclick.attachEvent("onclick", eventSolution);

/* funtion with the method fetch(), to get an random image*/
function getRandomImage() {
  fetch("https://random.dog/woof.json")
  .then(res => res.json())
  .then(data => {
    if (data.url.includes(".mp4")) {
      getRandomImage();
    }
    else {
      displayImage.innerHTML = `<img src=${data.url} alt="randomImage" />`;
    }
  });
}

/* if the browser doesn't support eventListener */
function eventSolution() { 
  fetch("https://random.dog/woof.json")
  .then(res => res.json())
  .then(data => {
    if (data.url.includes(".mp4")) {
      getRandomImage();
    }
    else {
      displayImage.innerHTML = `<img src=${data.url} alt="randomImage" />`;
    }
  });
}

/* function to check, if the browser support EventListener */
function supportEventBrowser() {
  if (document.addEventListener) {
    document.addEventListener("click", supportEvent);
  } else if (document.attachEvent) {
    document.attachEvent("onclick", notSupportEvent);
  }
  function notSupportEvent() {
    alert("Sorry, your browser doesn't support addEventListener");
  }
  function supportEvent() {
   // console.log('Support Event :)!');
  }
}
supportEventBrowser();

/* settings menu microinteraction - profile page */
function getShowSettings() {
  dropdown.classList.toggle("active");
}
