Use the Extension:

Clone the project locally. Then, go to the Extensions Manager page of Chrome. Turn on developer mode in the top right corner. Press Load Unpacked, and select the extension folder.

Commands:
Ctrl+A = I don't know

Test Your Inference (image-to-text and text-to-text only):

Set up your own inference accessible through a REST API. Accept POST requests from "mydomain.com" and expect JSON in this format:
{'inputs': 'I am text, or an image source, or a video link.'}

Return any JSON response, and it will display on the extension.

Go to "mydomain.com" and register your API URL on the Upload page (after logging in and verifying your identity). Alternatively, if you do not want it publicly avaliable on the extension for community use, you can also paste it directly into the extension, and we will not save it.