document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const generateButton = document.getElementById('generate-button');
    const captionOutput = document.getElementById('caption-output');
    const imageFrame = document.getElementById('image-show');
    const progressBar = document.getElementById('progress-bar');
    let imageDataUrl = '';

    progressBar.style.display = 'none';
    imageInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          imageDataUrl = reader.result;
          imageFrame.src = imageDataUrl;
        };
        reader.readAsDataURL(file);
      }
    });

    generateButton.addEventListener('click', async () => {
        captionOutput.style.display = 'none';
        progressBar.style.display = 'block';
        let message = '';
        if (imageDataUrl) {
            chrome.runtime.sendMessage(imageDataUrl, (response) => {
                // Handle results returned by the service worker (`background.js`) and update the popup's UI.
                console.log(response);
                if(!response){
                  message = "Some errors occured!";
                }
                else {
                  message = response[0].generated_text;
                }
                progressBar.style.display='none';
                captionOutput.style.display='block';
                captionOutput.textContent =message;
            });
        }
      });

});