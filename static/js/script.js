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
      if(data.url.includes('.mp4')) {
        getRandomImage();
      }
      else {
        displayImage.innerHTML = `<img src=${data.url} alt="randomImage" />`;
      }
    });
}

/* upload a file */
/* source: https://flaviocopes.com/how-to-upload-files-fetch/ */
document.querySelector('#fileUpload').addEventListener('change', event => {
  handleImageUpload(event)
});

const handleImageUpload = event => {
  const files = event.target.files
  const formData = new FormData()
  formData.append('#myFile', files[0])

  fetch('/saveImage', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.error(error)
  })
}

/* test upload 2 */








