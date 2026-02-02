window.onload = () => {
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const clearBtn = document.getElementById("clearBtn");
    const output = document.getElementById("output");
    const languageSelect = document.getElementById("languageSelect");

    let recognition;
    let isListening = false;

    // Check for browser support
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!window.SpeechRecognition) {
        alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;  // Keep listening until manually stopped
    recognition.interimResults = true;  // Show partial results
    recognition.lang = languageSelect.value;  // Set default language

    // Handle language change
    languageSelect.addEventListener("change", () => {
        recognition.lang = languageSelect.value;
    });

    // Start listening
    startBtn.addEventListener("click", () => {
        try {
            recognition.start();
            isListening = true;
            output.innerText = "🎤 Listening...";
        } catch (err) {
            console.error("Speech recognition error:", err);
        }
    });

    // Stop listening
    stopBtn.addEventListener("click", () => {
        recognition.stop();
        isListening = false;
    });

    // Clear text
    clearBtn.addEventListener("click", () => {
        output.innerText = "Your speech will appear here...";
    });

    // Process speech results
    recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + " ";
        }
        output.innerText = transcript.trim();
    };

    // Handle speech errors
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
            output.innerText = "❌ No speech detected. Try speaking louder.";
        } else if (event.error === "audio-capture") {
            output.innerText = "🎙️ No microphone detected. Check your mic settings.";
        } else if (event.error === "not-allowed") {
            output.innerText = "🚫 Microphone access denied. Allow permissions in browser settings.";
        } else {
            output.innerText = "⚠️ Speech recognition error. Try again.";
        }
    };

    // When speech ends
    recognition.onspeechend = () => {
        recognition.stop();
        isListening = false;
        output.innerText = "✅ Speech recognition stopped.";
    };
};
