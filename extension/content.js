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
    select {  
        background-color:#1F99CD;
        background-image: url(~"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20448%22%20enable-background%3D%22new%200%200%20256%20448%22%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E.arrow%7Bfill%3A@{arrow}%3B%7D%3C%2Fstyle%3E%3Cpath%20class%3D%22arrow%22%20d%3D%22M255.9%20168c0-4.2-1.6-7.9-4.8-11.2-3.2-3.2-6.9-4.8-11.2-4.8H16c-4.2%200-7.9%201.6-11.2%204.8S0%20163.8%200%20168c0%204.4%201.6%208.2%204.8%2011.4l112%20112c3.1%203.1%206.8%204.6%2011.2%204.6%204.4%200%208.2-1.5%2011.4-4.6l112-112c3-3.2%204.5-7%204.5-11.4z%22%2F%3E%3C%2Fsvg%3E%0A");
        background-position: right 10px center;
        background-repeat: no-repeat;
        background-size: auto 50%;
        border-radius:2px;
        border:none;
        color: #ffffff;
        padding: 10px 20px 10px 10px;
        // disable default appearance
        outline: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        &::-ms-expand { display: none };
      }
      
      // remove dotted firefox border
      @-moz-document url-prefix() {
        select {
          color: rgba(0,0,0,0);
          text-shadow: 0 0 0 #ffffff;
        }
      }

    #logo {
        content:url('chrome-extension://clblmpgkdonkpjihkgnjegdceellgihb/images/logo.png');
        height: 50px;
        width: 50px;
        border-radius: 100px;
    }
    #logo2 {
        content: url(chrome-extension://clblmpgkdonkpjihkgnjegdceellgihb/images/logo.png);
        height: 44px;
        width: 44px;
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
        color: white;
        display: flex;
        flex-direction: column;
        background-repeat: no-repeat;
        font-family: Arial, sans-serif;
        visibility: visible;
        background-position: 50% 200%;
        text-align: center;
        padding: 0px;
        padding-bottom: 12px;
        position: fixed;
        width: 350px;
        height: 600px;
        border-radius: 2px;
        position: absolute;
        right: 0px;
        bottom: 0px;
        border: 1px solid black;
        font-size: 14px;
        background-color: black;;
        background-image: url(chrome-extension://clblmpgkdonkpjihkgnjegdceellgihb/images/back.png);
    }
    @-webkit-keyframes fadeIn {
        from {opacity: 0;}
        to {opacity: 1;}
    }
    input {
        padding-left: 4px;
        line-height: 22px;
    padding: 0px 14px;
    width: 100%;
    min-height: 36px;
    border: unset;
    border-radius: 4px;
    outline-color: rgb(84 105 212 / 0.5);
        background-color: #1F99CD;
        box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                    rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                    rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                    rgba(60, 66, 87, 0.16) 0px 0px 0px 1px, 
                    rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                    rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                    rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    }
    input::placeholder {
        opacity: 0.8;
        color: white;
    }
    
    @keyframes fadeIn {
        from {opacity: 0;}
        to {opacity:1 ;}
    }
    #copiedImage {
        width: auto;
        max-height: 270px;
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
        color: #959595;
        text-decoration: none;
        cursor: pointer;
    }
    .header {
        text-align: left;
        min-height: 50px;
        width: auto;
        padding: 9px;
        padding-bottom: 0px;
        font-size: 22px;
        font-weight: bold;
        border-bottom: 1px solid gray;
        display: flex;
    }
    .boy {
        position: relative;
        text-align: center;
        width: auto;
        padding:12px;
        
    }
    .titular {
        padding-top: 6px;
        padding-left: 8px;
        font-size: 24px;
        color: white;
    }
    ::-webkit-scrollbar {
        width: 4px;
      }
    
    .input {
        overflow-x: scroll;
        color: black;
        width: auto;
        padding-right: 30px;
        width: calc(100% - 30px);
        height: 140px;
        resize: none;
        margin-bottom: 0px;
        padding-bottom: 0px;
        background-color: white;
        display: block;
    }
    .input_hide {
        display: none;
    }
    .loader {
        display: none;
        margin: auto;
        width: 48px;
        height: 48px;
        position: relative;
      }
      .loader::after,
      .loader::before {
        content: '';  
        box-sizing: border-box;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 2px solid orange;
        position: absolute;
        left: 0;
        top: 0;
        animation: animloader 2s linear infinite;
      }
      .loader::after {
        animation-delay: 1s;
      }
      
      @keyframes animloader {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
    .send {
        background-color: white;
    padding: 2px;
    border-radius: 2px;
    position: absolute;
    cursor: pointer;
    bottom: 15px;
    right: 15px;
    height: 25px;
    width: 25px;
        content: url('chrome-extension://clblmpgkdonkpjihkgnjegdceellgihb/images/send.png');
    }
    .send_img {
        background-color: white;
        border: 1px solid cyan;
        padding: 2px;
        border-radius: 2px;
        position: absolute;
        cursor: pointer;
        bottom: 12px;
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
    label {
        padding-right: 5px;
    }
    #model {
        margin-bottom: 4px;
        width: 292px;
    }
    #modelType {
        width: 257px;
        margin-bottom: 4px;
    }
    #api {
        width: 255px;
        margin: auto;
        color: white;
        margin-bottom: 4px;
        background-color: #1F99CD;
    }
    .output {
        margin-top: 12px;
        display: none;
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
        padding-bottom: 12px;
    }
    #custom {
        margin-bottom:4px;
    }
    .setting {

    }
    `;

    const loader = document.createElement("span");
    loader.setAttribute("class", "loader");

    // const title = document.createElement("div").setAttribute("class", "title");
    // shadowDom.appendChild(title); // Name, settings (models, command keys, settings, ui)
    const box = document.createElement("div");
    box.setAttribute("class", "box_hide");

    box.appendChild(logo);
    
    const output = document.createElement("div");
    output.setAttribute("class", "output");
    output.textContent = ""
    
    const header = document.createElement("div");
    header.setAttribute("class", "header");

    const title = document.createElement("div");
    title.setAttribute("class", "titular");
    title.textContent = "Octobazooka";

    const setting = document.createElement("div");
    setting.setAttribute("class", "settings");
    setting.textContent = "Settings";


    const videoLink = document.createElement("div");
    videoLink.setAttribute("class", "videoLink_2");

    const modelTypeSelection = document.createElement("div");
    modelTypeSelection.innerHTML = '<label for="modelType">Model Type</label><select name="modelType" id="modelType"><option value="volvo">Volvo</option><option value="saab">Saab</option><option value="mercedes">Mercedes</option><option value="audi">Audi</option></select><br><label for="model">Model</label><select name="model" id="model"></select><label for="name" id="custom">Custom</label><input placeholder="Or use your own API endpoint..." type="text" id="api" name="api">';
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
    
    box.appendChild(loader);

    const logo2 = document.createElement("img");
    logo2.setAttribute("id", "logo2");

    const closeBtn = document.createElement("span");
    closeBtn.textContent = "X";
    closeBtn.setAttribute("class", "close"); 
    header.append(logo2);
    header.append(title);
    header.append(setting);
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

                for (let j = 0; j < models.length; j++) {
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
        if(e.metaKey && e.key == 'd') { // Allow users to select what key to use, or automatically do it on active elements.
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
    window.addEventListener("contextmenu", function(e)  { //For checking videos/images, any other way to find if the mouse is over an image/video?
        if(e.metaKey) {
            if(e.altKey) { //Command + alt + click for videos.
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
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
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
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

    // function convertBLOB(videoFile, videoEl) {

    //     // Preconditions:
    //     if( !( videoFile instanceof Blob ) ) throw new Error( '`videoFile` must be a Blob or File object.' ); // The `File` prototype extends the `Blob` prototype, so `instanceof Blob` works for both.
    //     if( !( videoEl instanceof HTMLVideoElement ) ) throw new Error( '`videoEl` must be a <video> element.' );
        
    //     // 
    //     const newObjectUrl = URL.createObjectURL( videoFile );
            
    //     // URLs created by `URL.createObjectURL` always use the `blob:` URI scheme: https://w3c.github.io/FileAPI/#dfn-createObjectURL
    //     const oldObjectUrl = videoEl.currentSrc;
    //     console.log(oldObjectUrl);
    //     if( oldObjectUrl && oldObjectUrl.startsWith('blob:') ) {
    //         // It is very important to revoke the previous ObjectURL to prevent memory leaks. Un-set the `src` first.
    //         // See https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    
    //         videoEl.src = ''; // <-- Un-set the src property *before* revoking the object URL.
    //         URL.revokeObjectURL( oldObjectUrl );
    //     }
    
    //     // Then set the new URL:
    //     videoEl.src = newObjectUrl;
    //     console.log(videoEl.src);

    //     return(videoEl.src);
    
    //     // And load it:
    //     // videoEl.load(); // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/load
        
    // }

    send.addEventListener('click', function handleClick(e) {
        console.log("hello");
        output.style.display = "none";
        loader.style.display = "inline-block";
        textArea.disabled = true;
        let proxyInferenceRequest = new XMLHttpRequest();
        proxyInferenceRequest.onreadystatechange = function() {
            if (this.readyState == 4 && (this.status == 200 || this.status == 400)) {
                console.log(proxyInferenceRequest.responseText);
                output.textContent = proxyInferenceRequest.responseText;
                output.style.display = "block";
                loader.style.display = "none";
                // if (JSON.parse(proxyInferenceRequest.responseText)["misinfo"]);
            }
            else {
                output.style.display = "block";
                loader.style.display = "none";
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
        else if (dataType == 'video') {
            data = videoLink.textContent;
        }
        console.log(JSON.stringify({"model": modelTypeSelection.querySelector('#model').value, "custom_model": modelTypeSelection.querySelector('#api').value, "data_type": dataType, "content": data}));
        proxyInferenceRequest.send(JSON.stringify({"model": modelTypeSelection.querySelector('#model').value, "custom_model": modelTypeSelection.querySelector('#api').value, "data_type": dataType, "content": data}));
    });

    modelTypeSelection.querySelector('#modelType').addEventListener('input', function (event) {
        modelTypeChanged(event.target);
    });

    // modelTypeSelection.querySelector('#modelType').addEventListener('onchange', modelTypeChanged(modelTypeSelection.querySelector('#modelType')));

    function modelTypeChanged(target) {
        const textModels = ['fill_mask', 'text_classification', 'community'];
        const imageModels = ['image_to_text_description', 'image_to_text_transcribe', 'object_detection', 'community'];
        const videoModels = ['video_to_text_transcribe', 'community'];
        let currentModelType = target.value;
        // if (currentModelType == 'community') {
        //     dataType = 'community';
        // }
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