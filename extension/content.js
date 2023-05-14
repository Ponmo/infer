//Injected javascript
window.onload = function() {
    
    let dataType = null;

    const logo = document.createElement("img");
    logo.setAttribute("id", "logo");

    const inferWrapper = document.body.appendChild(document.createElement('div')); // Wrapper for shadowdom, sets position, size of box.
    inferWrapper.setAttribute("class", "inferWrapper");
    const shadowDom = inferWrapper.attachShadow({ mode: "open" }); // Create shadowDom for user interface.

    // Create some CSS to apply to the shadow DOM
    let style = document.createElement("style"); 

    // console.log(chrome.runtime.getURL("images/send.png"));
    
    //TODO: MUST INCLUDE LOGO ICON IN BOTTOM RIGHT CORNER + BACKGROUND PICTURE WITH ANIMATION.
    style.textContent = `
    #logo {
        content:url('chrome-extension://clblmpgkdonkpjihkgnjegdceellgihb/images/logo.png');
        height: 50px;
        width: 50px;
        border-radius: 100px;
    }
    .box_hide {
        cursor: pointer;
        background-image: linear-gradient(to bottom right, white, purple , green);
        visibility: visible;
        text-align: center;
        padding: 0px;
        position: fixed;
        background-color: white;
        width: 50px;
        height: 50px;
        border-radius: 100px;
        position: absolute;
        right: 0px;
        bottom: 0px;
        border: 1px solid black;
        font-size: 14px;
    }
    .box_hide > #copiedImage,
    .box_hide > .header,
    .box_hide > .boy,
    .box_hide > .modelTypeSelection,
    .box_hide > .close
    .box_hide > .videoLink
    .box_hide > .output {
        display: none;
    }
    .box_show > #logo {
        display: none;
    }
    .box_show {
        color: black;
        display: flex;
        flex-direction: column;
        background-image: url('chrome-extension://clblmpgkdonkpjihkgnjegdceellgihb/images/background.png');
        background-repeat: no-repeat;
        font-family: Arial, sans-serif;
        visibility: visible;
        background-position: center;
        text-align: center;
        padding: 0px;
        position: fixed;
        width: 350px;
        height: 600px;
        border-radius: 2px;
        position: absolute;
        right: 0px;
        bottom: 0px;
        border: 1px solid black;
        font-size: 14px;
        background-color: white;
    }
    @-webkit-keyframes fadeIn {
        from {opacity: 0;}
        to {opacity: 1;}
    }
    
    @keyframes fadeIn {
        from {opacity: 0;}
        to {opacity:1 ;}
    }
    #copiedImage {
        width: auto;
        max-height: 400px;
        max-width: 330px;
    }
    .close {
        color: #aaa;
        position: absolute;
        right: 8px;
        top: 6px;
        font-size: 18px;
        font-weight: bold;
    }
    
    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
    .header {
        text-align: left;
        min-height: 38px;
        width: auto;
        padding: 14px;
        padding-bottom: 0px;
        font-size: 22px;
        font-weight: bold;
        border-bottom: 1px solid gray;
    }
    .boy {
        position: relative;
        text-align: center;
        width: auto;
        padding:12px;
        
    }
    .titular {
        padding-left: 8px;
        background: linear-gradient(to bottom right, black, orange, cyan);
        background: -webkit-linear-gradient(to bottom right, orange, cyan);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    ::-webkit-scrollbar {
        width: 4px;
      }
    
    .input {
        overflow-x: scroll;
        width: auto;
        padding-right: 30px;
        width: calc(100% - 30px);
        height: 140px;
        resize: none;
        margin-bottom: 0px;
        padding-bottom: 0px;
        display: block;
    }
    .input_hide {
        display: none;
    }
    .send {
        background-color: white;
        padding: 2px;
        border-radius: 2px;
        position: absolute;
        cursor: pointer;
        bottom: 16px;
        right: 12px;
        height: 25px;
        width: 25px;
        content:url('chrome-extension://clblmpgkdonkpjihkgnjegdceellgihb/images/send.png');
    }
    .send_img {
        background-color: white;
        border: 1px solid cyan;
        padding: 2px;
        border-radius: 2px;
        position: absolute;
        cursor: pointer;
        bottom: 18px;
        right: 12px;
        height: 25px;
        width: 25px;
        content:url('chrome-extension://clblmpgkdonkpjihkgnjegdceellgihb/images/send.png');
    }
    .send_video {
        position: absolute;
        cursor: pointer;
        bottom: 10px;
        right: 10px;
        height: 25px;
        width: 25px;
        content:url('chrome-extension://clblmpgkdonkpjihkgnjegdceellgihb/images/send.png');
    }
    .videoLink {
        display: block;
        font-weight: bold;
        text-align: center;
        width: auto;
        padding-left: 24px;
        padding-right: 24px;
        word-break: break-all;
        margin-bottom: 0px;
        font-size: 16px;
    }
    .videoLink_2 {
        display: none;
        font-weight: bold;
        text-align: center;
        padding-left: 24px;
        padding-right: 24px;
        width: auto;
        word-break: break-all;
        margin-bottom: 0px;
        font-size: 16px;
    }
    #model {
        margin-bottom: 4px;
    }
    #modelType {
        margin-bottom: 4px;
    }
    #api {
        margin-bottom: 4px;
    }
    .output {
        margin-top: 12px;
        display: block;
        font-weight: bold;
        text-align: center;
        height: calc(100% - 24px);
        width: auto;
        padding-left: 24px;
        padding-right: 24px;
        word-break: break-all;
        margin-bottom: 0px;
        font-size: 16px;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    `;

    // const title = document.createElement("div").setAttribute("class", "title");
    // shadowDom.appendChild(title); // Name, settings (models, command keys, settings, ui)
    const box = document.createElement("div");
    box.setAttribute("class", "box_hide");

    box.appendChild(logo);
    
    const output = document.createElement("div");
    output.setAttribute("class", "output");
    output.textContent = "Output Area Output AreaOutput Area Output AreaOutput Area Output Area Output Area Output Area Output Area Output Area Output Area Output Area Output Area Output Area  Output AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput AreaOutput Area "
    
    const header = document.createElement("div");
    header.setAttribute("class", "header");

    const title = document.createElement("div");
    title.setAttribute("class", "titular");
    title.textContent = "Inferencienzia";

    const videoLink = document.createElement("div");
    videoLink.setAttribute("class", "videoLink_2");

    const modelTypeSelection = document.createElement("div");
    modelTypeSelection.innerHTML = '<label for="modelType">Model Type:</label><select name="modelType" id="modelType"><option value="volvo">Volvo</option><option value="saab">Saab</option><option value="mercedes">Mercedes</option><option value="audi">Audi</option></select> <label for="model">Model:</label><select name="model" id="model"></select><label for="name">REST API:</label><input type="text" id="api" name="api" maxlength="100" size="48">';
    modelTypeSelection.setAttribute("class", "modelTypeSelection");

    const boy = document.createElement("div");
    boy.setAttribute("class", "boy");

    const textAreaForm = document.createElement("div");
    textAreaForm.setAttribute("class", "form");

    const textArea = document.createElement("textArea");
    textArea.setAttribute("class", "input");
    textArea.setAttribute("name", "input");

    const send = document.createElement("img");
    send.setAttribute("class", "send");
    
    boy.appendChild(send);

    boy.appendChild(videoLink);
    boy.appendChild(textArea);
    box.appendChild(header);
    box.appendChild(boy);
    box.appendChild(modelTypeSelection);
    box.appendChild(output);


    const closeBtn = document.createElement("span");
    closeBtn.textContent = "X";
    closeBtn.setAttribute("class", "close"); 
    header.append(title);
    header.appendChild(closeBtn);


    // let link = document.createElement('link');
    // link.setAttribute('rel', 'stylesheet');
    // link.setAttribute('href', 'content.css');
    // shadowDom.appendChild(link);
    shadowDom.appendChild(box);
    shadowDom.appendChild(style);

    let optionsRequest = new XMLHttpRequest(); // Messy! 
    optionsRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(optionsRequest.responseText);
            let options = JSON.parse(optionsRequest.responseText);
            const modelTypes = Object.keys(options);
            console.log(modelTypes);
            let modelTypesHTML = '';
            let modelsHTML = '';
            for(let i = 0; i < modelTypes.length; i++) {
                modelTypesHTML += '<option class="' + modelTypes[i] + '" value="' + modelTypes[i] + '">' + modelTypes[i].replaceAll('_', ' ') + '</option>';

                const models = options[modelTypes[i]].split(' ');
                let modelsHTML = '';

                for(let j = 0; j < models.length; j++) {
                 modelsHTML += '<option class="' + modelTypes[i] + '" value="' + models[j] + '">' + models[j] + '</option>';
                }
                modelTypeSelection.querySelector('#model').innerHTML += modelsHTML; 
                console.log(modelTypeSelection.querySelector('#model').innerHTML);
            }
            modelTypeSelection.querySelector('#modelType').innerHTML = modelTypesHTML;
            console.log(modelTypeSelection.querySelector('#modelType').innerHTML);

            modelTypeSelection.querySelector('#modelType').value = "fill_mask";
            dataType = "text";
            modelTypeChanged(modelTypeSelection.querySelector('#modelType'))
            
        }
        else {
            // HANDLE ERRORS HERE
        }
    }
    optionsRequest.open("GET", "http://127.0.0.1:8000/get_options", true);
    optionsRequest.send();


    window.addEventListener("keydown", function(e) {
        // console.log(e.metaKey);
        // if (e.key >= 65 && e.key <= 90) {
        if(e.metaKey && e.key == 'a') { // Allow users to select what key to use, or automatically do it on active elements.
            e.preventDefault();
            let selectedText = getSelectionText();
            // if(selectedText != "") {
            box.className = "box_show";
            boy.querySelector("#copiedImage")?.remove();
            send.className = "send";
            textArea.className = "input";
            videoLink.className = "videoLink_2";
            textArea.value = selectedText;

            modelTypeSelection.querySelector('#modelType').value = "fill_mask";
            dataType = "text";
            modelTypeChanged(modelTypeSelection.querySelector('#modelType'))
        }
    });
    window.addEventListener("click", function(e) { //For checking videos/images, any other way to find if the mouse is over an image/video?
        if(e.metaKey) {
            if(e.altKey) { //Command + alt + click for videos.
                let video;
                if(e.target.tagName == "VIDEO") {
                    video = e.target;
                    console.log("e is a video");
                }
                else {
                    video = e.target.querySelector("video");
                }
                if(video) {
                    box.className = "box_show";
                    boy.querySelector("#copiedImage")?.remove();
                    send.className = "send_video";
                    videoLink.className = "videoLink";
                    textArea.className = "input_hide";
                    
                    videoLink.textContent = video.currentSrc;
                }
                else {
                    box.className = "box_show";
                    send.className = "send";
                    videoLink.className = "videoLink_2";
                    textArea.className = "input";
                    boy.querySelector("#copiedImage")?.remove();
                    textArea.value = "Could not find video D:";
                }
                
                modelTypeSelection.querySelector('#modelType').value = "video_to_text_transcribe";
                dataType = "video";
                modelTypeChanged(modelTypeSelection.querySelector('#modelType'))
            }
            else if(e.shiftKey) { // Command + shift + click for images.
                let image;
                if(e.target.tagName == 'IMG') {
                    image = e.target;
                }
                else {
                    image = e.target.querySelector("img");
                }
                if(image) { // Allow users to select what key to use, or automatically do it on active elements.
                    box.className = "box_show";
                    let copy = document.createElement("img");
                    copy.src = image.src;
                    boy.querySelector("#copiedImage")?.remove();
                    copy.setAttribute("id", "copiedImage");
                    boy.appendChild(copy);
                    send.className = "send_img";
                    videoLink.className = "videoLink_2";
                    textArea.className = "input_hide";
                }
                else {
                    box.className = "box_show";
                    send.className = "send";
                    videoLink.className = "videoLink_2";
                    boy.querySelector("#copiedImage")?.remove();
                    textArea.className = "input"
                    textArea.value = "Could not find image D:";
                }
                
                modelTypeSelection.querySelector('#modelType').value = "image_to_text_description";
                dataType = "image";
                modelTypeChanged(modelTypeSelection.querySelector('#modelType'))
            }
            
        }
    });
    
    box.addEventListener('mouseup', function handleClick() {
        if(box.className == "box_hide") {
            box.className = "box_show";
        }
    });
    closeBtn.addEventListener('click', function handleClick(e) {
        e.preventDefault();
        box.className = "box_hide";
    });

    send.addEventListener('click', function handleClick(e) {
        textArea.disabled = true;
        let proxyInferenceRequest = new XMLHttpRequest();
        proxyInferenceRequest.onreadystatechange = function() {
            console.log('HI');
            if (this.readyState == 4 && this.status == 200) {
                console.log(proxyInferenceRequest.responseText);
                // if (JSON.parse(proxyInferenceRequest.responseText)["misinfo"]);
            }
            else {
                // HANDLE ERRORS HERE, USUALLY WAITING FOR MODEL TO SPIN UP 20 SECONDS
            }
            textArea.disabled = false;
        }
        proxyInferenceRequest.open("POST", "http://127.0.0.1:8000/proxy_inference", true);
        proxyInferenceRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        proxyInferenceRequest.setRequestHeader("Accept", "application/json");
        data = null;
        if(dataType=='text') {
            data = textArea.value;
        }
        else if (dataType=='image') {
            data = boy.querySelector("#copiedImage").src;
        }
        else {
            data = videoLink.textContent;
        }
        console.log(JSON.stringify({"hugging_model": modelTypeSelection.querySelector('#model').value, "custom_model": modelTypeSelection.querySelector('#api').value, "data_type": dataType, "content": data}));
        proxyInferenceRequest.send(JSON.stringify({"hugging_model": modelTypeSelection.querySelector('#model').value, "custom_model": modelTypeSelection.querySelector('#api').value, "data_type": dataType, "content": data}));
    });

    modelTypeSelection.querySelector('#modelType').addEventListener('input', function (event) {
        modelTypeChanged(event.target);
    });

    // modelTypeSelection.querySelector('#modelType').addEventListener('onchange', modelTypeChanged(modelTypeSelection.querySelector('#modelType')));

    function modelTypeChanged(target) {
        const textModels = ['fill_mask', 'text_classification'];
        const imageModels = ['image_to_text_description', 'image_to_text_transcribe', 'object_detection'];
        const videoModels = ['video_to_text_transcribe'];
        let currentModelType = target.value;
        let shown = null;
        if (textModels.includes(currentModelType)) {
            shown = textModels;
        }
        else if (imageModels.includes(currentModelType)) {
            shown = imageModels;
        }
        else {
            shown = videoModels;
        }
        // if target.value
        console.log(currentModelType);
        let setDefault = false;
        let modelOptions = modelTypeSelection.querySelector('#model').querySelectorAll('option');
        for (let i = 0; i < modelOptions.length; i++) {
            if (modelOptions[i].className == currentModelType) {
                modelOptions[i].style.display = "block";
                if (!setDefault) {
                    modelTypeSelection.querySelector('#model').value = modelOptions[i].value;
                    setDefault = true;
                }
            }
            else {
                modelOptions[i].style.display = "none";
            }
        }
        let modelTypeOptions = modelTypeSelection.querySelector('#modelType').querySelectorAll('option');
        for (let i = 0; i < modelTypeOptions.length; i++) {
            if (shown.includes(modelTypeOptions[i].className)) {
                modelTypeOptions[i].style.display = "block";
            }
            else {
                modelTypeOptions[i].style.display = "none";
            }
        }
    }
};

// Gets active text from highlighted text as well as text in textareas and input fields.
function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
      (activeElTagName == "textarea") || (activeElTagName == "input" &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

function loadPopup() {
    
}