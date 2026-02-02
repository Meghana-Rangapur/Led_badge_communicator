const textInput = document.getElementById("textInput");
const speakBtn = document.getElementById("speakBtn");
const stopBtn = document.getElementById("stopBtn");
const clearBtn = document.getElementById("clearBtn");
const languageSelect = document.getElementById("languageSelect");

let speechInstance = new SpeechSynthesisUtterance();

speakBtn.addEventListener("click", () => {
    if (textInput.value.trim() !== "") {
        speechInstance.text = textInput.value;
        speechInstance.lang = languageSelect.value;
        window.speechSynthesis.speak(speechInstance);
    } else {
        alert("Please enter text before playing speech.");
    }
});

stopBtn.addEventListener("click", () => {
    window.speechSynthesis.cancel();
});

clearBtn.addEventListener("click", () => {
    textInput.value = "";
});
