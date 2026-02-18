document.addEventListener("DOMContentLoaded", function () {

  /* ===================================== */
  /* HERO TYPING EFFECT */
  /* ===================================== */

  const text = [
    "Java • Spring Boot • Kafka",
    "Cloud • Microservices • AWS",
    "Enterprise Backend Engineer"
  ];

  let i = 0;
  let j = 0;
  let currentText = "";
  let isDeleting = false;

  function type() {
    const typingElement = document.querySelector(".typing");
    if (!typingElement) return;

    if (!isDeleting && j <= text[i].length) {
      currentText = text[i].substring(0, j++);
    } else if (isDeleting && j >= 0) {
      currentText = text[i].substring(0, j--);
    }

    typingElement.innerHTML = currentText;

    if (j === text[i].length) isDeleting = true;
    if (j === 0) {
      isDeleting = false;
      i = (i + 1) % text.length;
    }

    setTimeout(type, 100);
  }

  type();


  /* ===================================== */
  /* SCROLL REVEAL */
  /* ===================================== */

  window.addEventListener("scroll", function () {
    document.querySelectorAll(".reveal").forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;

      if (elementTop < windowHeight - 100) {
        el.classList.add("active");
      }
    });
  });


  /* ===================================== */
  /* PARTICLES */
  /* ===================================== */

  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 80 },
        size: { value: 3 },
        move: { speed: 1 },
        line_linked: { enable: true }
      }
    });
  }


  /* ===================================== */
  /* GITHUB PROJECT AUTO LOAD */
  /* ===================================== */

  const githubContainer = document.getElementById("github-projects");

  if (githubContainer) {
    fetch("https://api.github.com/users/aprantosh/repos")
      .then(response => response.json())
      .then(data => {
        data.slice(0, 4).forEach(repo => {
          const div = document.createElement("div");
          div.classList.add("card");
          div.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description available"}</p>
            <a href="${repo.html_url}" target="_blank">View Repository</a>
          `;
          githubContainer.appendChild(div);
        });
      })
      .catch(err => console.log("GitHub load error"));
  }


  /* ===================================== */
  /* AI CHAT SYSTEM */
  /* ===================================== */

  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");

  if (!chatToggle || !chatContainer || !chatMessages || !userInput) return;

  /* Toggle Chat */
  chatToggle.onclick = () => {
    chatContainer.style.display =
      chatContainer.style.display === "flex" ? "none" : "flex";
  };

  /* Enter Key Support */
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  /* Send Message */
  window.sendMessage = async function () {

    const message = userInput.value.trim();
    if (!message) return;

    chatMessages.innerHTML += `
      <div><strong>You:</strong> ${message}</div>
    `;

    userInput.value = "";

    /* Thinking animation */
    const thinkingDiv = document.createElement("div");
    thinkingDiv.innerHTML = "<strong>AI:</strong> <span class='dots'>...</span>";
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      /* Remove thinking dots */
      thinkingDiv.remove();

      /* Create AI message with typing effect */
      const aiDiv = document.createElement("div");
      aiDiv.innerHTML = "<strong>AI:</strong> ";
      chatMessages.appendChild(aiDiv);

      let index = 0;
      const reply = data.reply;

      function typeAI() {
        if (index < reply.length) {
          aiDiv.innerHTML += reply.charAt(index);
          index++;
          setTimeout(typeAI, 15);
        }
      }

      typeAI();

      chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
      thinkingDiv.remove();
      chatMessages.innerHTML += `
        <div style="color:red;">Error connecting to AI</div>
      `;
    }
  };

  /* Auto Greeting */
  setTimeout(() => {
    chatMessages.innerHTML += `
      <div><strong>AI:</strong> Hi! I'm Nabaraj's AI assistant. Ask me about his experience, tech stack, or leadership projects.</div>
    `;
  }, 1200);

});
