## OCTOBAZOOKA
By Noah and Ramon Wang

**Using the Extension:**

Clone the project locally. Then, go to the Extensions Manager page of Chrome. Turn on developer mode in the top right corner. Press Load Unpacked, and select the extension folder.


**Keyboard Commands:**

Ctrl+D = Selects the text that you have highlighted.

Cmd+Shft+RightClick = Select image.

Cmd+Option+RightClick = Select video.


**Test Your Inference and Register Models:**

Go to "octobazooka.store" and register your API URL on the Upload page (after logging in and verifying your identity). Alternatively, if you do not want it publicly avaliable on the extension for community use, you can also paste it directly into the extension, and we will not save it. If you upload your model and decide to stop accepting requests, we automatically delete your API from our database


**Set up your own inference accessible through a REST API.** 

Accept POST requests from "octobazooka.store" and expect JSON in this format:
{'inputs': 'I am text, or an image source, or a video link.'}

Return any JSON response, and it will display on the extension.
