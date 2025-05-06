// chatController.js

const userInput = document.getElementById("userInput");
const responseArea = document.getElementById("responseArea");
const micBtn = document.getElementById("micBtn");

async function askAI() {
  const msg = userInput.value.trim();
  if (!msg) return;

  // Show user message
  responseArea.innerHTML += `<div class="user-msg">You: ${msg}</div>`;

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });

    const data = await response.json();
    const reply = data.response || data.error || "Sorry, I couldn't understand that.";

    // Show bot response
    responseArea.innerHTML += `<div class="bot-msg">Bot: ${reply}</div>`;
    responseArea.scrollTop = responseArea.scrollHeight;

    // Speak the reply
    const utterance = new SpeechSynthesisUtterance(reply);
    speechSynthesis.speak(utterance);

  } catch (err) {
    console.error("Error contacting AI server:", err);
    responseArea.innerHTML += `<div class="error-msg">Server error. Try again later.</div>`;
  }

  userInput.value = "";
}

// Optional: Enter key triggers askAI
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") askAI();
});

// 🎙️ Speech-to-Text input
micBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    const speechText = event.results[0][0].transcript;
    userInput.value = speechText;
    askAI(); // auto send after recognition
  };

  recognition.onerror = (e) => {
    alert("Speech recognition error: " + e.error);
  };
});
