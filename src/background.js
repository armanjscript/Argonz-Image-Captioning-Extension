import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;
env.useBrowserCache = true;




class PipelineSingleton {
    static task = 'image-to-text';
    static model = 'Xenova/vit-gpt2-image-captioning';
    static instance = null;

    static async getInstance() {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model);
        }

        return this.instance;
    }
}

const captioner = async (imageUrl) => {
    // Get the pipeline instance. This will load and build the model when run for the first time.
    let model = await PipelineSingleton.getInstance();

    // Actually run the model on the input image
    let result = await model(imageUrl);
    return result;
};



chrome.runtime.onInstalled.addListener(function () {
    console.log('The extension installed successfully.');
    console.log('The Loading model for image captioning takes a long time.');
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // console.log(message);
    // Run model generating caption asynchronously
    (async function () {
        // Perform generating caption
        let result = await captioner(message);

        // Send response back to UI
        sendResponse(result);
    })();
    return true;
});

