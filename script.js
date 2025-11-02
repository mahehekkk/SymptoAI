document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------
     🌙 THEME TOGGLE (OPTIONAL)
  ---------------------------------*/
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      const isDark = document.body.classList.contains("dark-theme");
      themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    });
  }

  /* -------------------------------
     🔐 LOGIN FUNCTIONALITY
  ---------------------------------*/
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (email && password) {
        sessionStorage.setItem("loggedInUser", email);
        window.location.href = "dashboard.html";
      } else {
        alert("Please fill in all fields.");
      }
    });
  }

  /* -------------------------------
     🧾 DASHBOARD CHECK (Optional)
  ---------------------------------*/
  const userEmail = sessionStorage.getItem("loggedInUser");
  const dashboardGreeting = document.getElementById("dashboardGreeting");

  if (dashboardGreeting && userEmail) {
    dashboardGreeting.textContent = `Welcome back, ${userEmail.split("@")[0]}! 💙`;
  }

  if (dashboardGreeting && !userEmail) {
    window.location.href = "index.html";
  }

  /* -------------------------------
     🧮 BMI TRACKER
  ---------------------------------*/
  const toggleBmi = document.getElementById("toggleBmi");
  const bmiContent = document.getElementById("bmiContent");
  const calculateBtn = document.getElementById("calculateBMI");
  const resetBtn = document.getElementById("resetBtn");
  const bmiValue = document.getElementById("bmiValue");
  const bmiMessage = document.getElementById("bmiMessage");
  const resultCard = document.getElementById("resultCard");

  if (toggleBmi) {
    toggleBmi.addEventListener("click", () => {
      const isHidden = bmiContent.style.display === "none";
      bmiContent.style.display = isHidden ? "block" : "none";
      toggleBmi.textContent = isHidden ? "▲" : "▼";
    });
  }

  if (calculateBtn) {
    calculateBtn.addEventListener("click", () => {
      const weight = parseFloat(document.getElementById("weight").value);
      const height = parseFloat(document.getElementById("height").value) / 100;

      if (!weight || !height) {
        alert("⚠️ Please enter both height and weight!");
        return;
      }

      const bmi = (weight / (height * height)).toFixed(1);
      let category = "", color = "", message = "";

      if (bmi < 18.5) {
        category = "Underweight";
        color = "#b30000";
        message = "You’re underweight. Eat a balanced diet!";
      } else if (bmi < 25) {
        category = "Normal";
        color = "#00b300";
        message = "Perfect! Keep maintaining your healthy lifestyle!";
      } else if (bmi < 30) {
        category = "Overweight";
        color = "#ffcc00";
        message = "Slightly overweight. Try to be more active!";
      } else if (bmi < 35) {
        category = "Obese (Class I)";
        color = "#ff6600";
        message = "Obese level 1. Consult a doctor for a plan.";
      } else {
        category = "Obese (Class II)";
        color = "#990000";
        message = "Obese level 2. Prioritize your health now!";
      }

      bmiValue.textContent = `Your BMI is ${bmi} (${category})`;
      bmiValue.style.color = color;
      bmiMessage.textContent = message;
      resultCard.classList.remove("hidden");
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document.getElementById("height").value = "";
      document.getElementById("weight").value = "";
      resultCard.classList.add("hidden");
    });
  }

}); // 👈 everything stays inside this one big listener
// 🤖 Chatbot Toggle Logic
document.addEventListener("DOMContentLoaded", function () {
  const chatbotIcon = document.getElementById("chatbot-icon");
  const chatbotWindow = document.getElementById("chatbot-window");

  chatbotIcon.addEventListener("click", () => {
    chatbotWindow.classList.toggle("hidden");
  });
});
// ===== MOOD TRACKER TOGGLE =====
const toggleMood = document.getElementById("toggleMood");
const moodContent = document.getElementById("moodContent");
toggleMood.addEventListener("click", () => {
  const open = moodContent.style.display === "block";
  moodContent.style.display = open ? "none" : "block";
  toggleMood.textContent = open ? "▼" : "▲";
});

// ===== MOOD TRACKER LOGIC =====
const moodDate = document.getElementById("moodDate");
const moodSelect = document.getElementById("moodSelect");
const moodNote = document.getElementById("moodNote");
const saveMood = document.getElementById("saveMood");
const moodHistory = document.querySelector("#moodHistory tbody");

if (moodDate) moodDate.valueAsDate = new Date();

function loadMoods() {
  const data = JSON.parse(localStorage.getItem("moods_" + email) || "[]");
  moodHistory.innerHTML = "";
  data.slice(-5).reverse().forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${entry.date}</td><td>${entry.mood}</td><td>${entry.note}</td>`;
    moodHistory.appendChild(row);
  });
}

if (saveMood) {
  saveMood.addEventListener("click", () => {
    const date = moodDate.value;
    const mood = moodSelect.value;
    const note = moodNote.value.trim();
    if (!date || !mood) return alert("Please select a date and mood!");
    const allData = JSON.parse(localStorage.getItem("moods_" + email) || "[]");
    allData.push({ date, mood, note });
    localStorage.setItem("moods_" + email, JSON.stringify(allData));
    alert("✅ Mood saved!");
    loadMoods();
    moodSelect.value = "";
    moodNote.value = "";
    moodDate.valueAsDate = new Date();
  });
}

loadMoods();
// ===== MOOD PIE CHART =====
function updateMoodChart() {
  const data = JSON.parse(localStorage.getItem("moods_" + email) || "[]");
  if (!data.length) return;

  const moodCounts = {};
  data.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });

  const ctx = document.getElementById("moodChart").getContext("2d");

  // Destroy old chart if any (important if reloaded)
  if (window.moodChartInstance) {
    window.moodChartInstance.destroy();
  }

  window.moodChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(moodCounts),
      datasets: [{
        data: Object.values(moodCounts),
        backgroundColor: [
          "#4caf50", "#2196f3", "#ffeb3b", "#ff5722", "#9c27b0"
        ]
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: getComputedStyle(document.body).color } }
      }
    }
  });
}

// Update chart whenever moods are saved
if (saveMood) {
  saveMood.addEventListener("click", () => {
    updateMoodChart();
  });
}

// Load chart on page load
updateMoodChart();
const ctx = document.getElementById('moodChart').getContext('2d');
new Chart(ctx, {
  type: 'pie',
  data: data,
  options: {
    responsive: true,
  }
});
/* -------------------------------
   🌙 SLEEP TRACKER
---------------------------------*/
const toggleSleep = document.getElementById("toggleSleep");
const sleepContent = document.getElementById("sleepContent");
const calcSleep = document.getElementById("calcSleep");
const resetSleep = document.getElementById("resetSleep");
const sleepTime = document.getElementById("sleepTime");
const wakeTime = document.getElementById("wakeTime");
const sleepDuration = document.getElementById("sleepDuration");
const sleepMessage = document.getElementById("sleepMessage");

// ▼ / ▲ Toggle dropdown visibility
if (toggleSleep) {
  toggleSleep.addEventListener("click", () => {
    const isHidden = sleepContent.style.display === "none" || sleepContent.style.display === "";
    sleepContent.style.display = isHidden ? "block" : "none";
    toggleSleep.textContent = isHidden ? "▲" : "▼";
  });
}

// 💤 Calculate sleep duration
if (calcSleep) {
  calcSleep.addEventListener("click", () => {
    const sleepVal = sleepTime.value;
    const wakeVal = wakeTime.value;
    if (!sleepVal || !wakeVal) {
      alert("Please select both Sleep and Wake times!");
      return;
    }

    const baseDate = new Date().toISOString().split("T")[0];
    const sleepDate = new Date(`${baseDate}T${sleepVal}:00`);
    let wakeDate = new Date(`${baseDate}T${wakeVal}:00`);
    if (wakeDate <= sleepDate) wakeDate.setDate(wakeDate.getDate() + 1);

    const diff = (wakeDate - sleepDate) / (1000 * 60 * 60);
    const duration = Math.round(diff * 10) / 10;
    sleepDuration.textContent = duration;

    if (duration < 4) sleepMessage.textContent = "⚠️ Too little sleep — rest more!";
    else if (duration < 7) sleepMessage.textContent = "😴 You could use a bit more rest!";
    else if (duration <= 9) sleepMessage.textContent = "🌙 Great sleep!";
    else sleepMessage.textContent = "🛌 You overslept a bit!";
  });
}

// 🔁 Reset button
if (resetSleep) {
  resetSleep.addEventListener("click", () => {
    sleepTime.value = "";
    wakeTime.value = "";
    sleepDuration.textContent = "0";
    sleepMessage.textContent = "";
  });
}
// script.js

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault(); // stop page reload

  // You can add your actual login check here if needed
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (email && password) {
    // Save login status (optional)
    localStorage.setItem("isLoggedIn", "true");

    // Redirect to dashboard.html
    window.location.href = "dashboard.html";
  } else {
    alert("Please enter both email and password.");
  }
});
/* -------------------------------
   💬 CHATBOT MESSAGE LOGIC
---------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  if (sendBtn && userInput && chatBox) {
    sendBtn.addEventListener("click", () => {
      const message = userInput.value.trim();
      if (message === "") return;

      // Add user message
      const userMsg = document.createElement("div");
      userMsg.classList.add("user-message");
      userMsg.textContent = message;
      chatBox.appendChild(userMsg);

      userInput.value = "";
      chatBox.scrollTop = chatBox.scrollHeight;

      // Bot reply simulation
      const botMsg = document.createElement("div");
      botMsg.classList.add("bot-message");
      botMsg.textContent = "Thinking...";
      chatBox.appendChild(botMsg);

      setTimeout(() => {
        botMsg.textContent = "🤖 " + "You said: " + message;
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 1000);
    });
  } else {
    console.warn("Chatbot send elements missing!");
  }
});
// ===== Chatbot Open/Close =====
const chatbotToggle = document.querySelector(".chatbot-toggler");
const chatbotContainer = document.querySelector(".chatbot");

chatbotToggle.addEventListener("click", () => {
  chatbotContainer.classList.toggle("show");
});
/* -------------------------------
   💬 SMART CHATBOT (Frontend + Gemini)
---------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const chatbotToggle = document.querySelector(".chatbot-toggler");
  const chatbotContainer = document.querySelector(".chatbot");
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const closeChat = document.getElementById("close-chat");

  // ✅ Toggle open/close
  if (chatbotToggle && chatbotContainer) {
    chatbotToggle.addEventListener("click", () => {
      chatbotContainer.classList.toggle("show");
    });
  }
  if (closeChat) {
    closeChat.addEventListener("click", () => {
      chatbotContainer.classList.remove("show");
    });
  }

  // ✅ Message handling
  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    const userMsg = document.createElement("div");
    userMsg.classList.add("user-message");
    userMsg.textContent = message;
    chatBox.appendChild(userMsg);
    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Show typing indicator
    const botMsg = document.createElement("div");
    botMsg.classList.add("bot-message");
    botMsg.textContent = "💬 Typing...";
    chatBox.appendChild(botMsg);

    try {
      // 🌐 Call backend route (Gemini API)
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      botMsg.textContent = data.reply || "Sorry, I didn’t get that 🤖";
    } catch (err) {
      botMsg.textContent = "⚠️ Error connecting to server.";
      console.error(err);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }
  if (userInput) {
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }
});
/* -------------------------------
   ✉️ MOCK OTP SYSTEM (SIGNUP)
---------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const signupForm = document.getElementById("signupForm");
  const emailInput = document.getElementById("signupEmail");
  const otpInput = document.getElementById("signupOtp");
  const passwordInput = document.getElementById("signupPassword");

  let generatedOTP = null;

  // --- SEND OTP ---
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener("click", function () {
      const email = emailInput.value.trim();
      if (!email) {
        alert("⚠️ Please enter your email first!");
        return;
      }

      // generate 4-digit mock OTP
      generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

      // show OTP for testing
      alert(`Your OTP is: ${generatedOTP} (demo)`);

      sendOtpBtn.textContent = "Resend OTP";
      sendOtpBtn.disabled = true;

      // enable resend after 30s
      setTimeout(() => {
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = "Send OTP";
      }, 30000);
    });
  }

  // --- SIGNUP SUBMIT ---
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const enteredOTP = otpInput.value.trim();
      const password = passwordInput.value.trim();

      if (!generatedOTP) {
        alert("Please click 'Send OTP' first.");
        return;
      }

      if (enteredOTP !== generatedOTP) {
        alert("❌ Invalid OTP! Please try again.");
        return;
      }

      if (!password) {
        alert("Please create a password.");
        return;
      }

      // Save user data locally (mock)
      localStorage.setItem("userEmail", emailInput.value.trim());
      localStorage.setItem("userPassword", password);

      alert("✅ Signup successful! Redirecting...");
      window.location.href = "setup.html";
    });
  }
});
