document.addEventListener("DOMContentLoaded", function () {

  /* ========================= */
  /* Typing Effect */
  /* ========================= */

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


  /* ========================= */
  /* Scroll Reveal */
  /* ========================= */

  window.addEventListener("scroll", function () {
    document.querySelectorAll(".reveal").forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 100) {
        el.classList.add("active");
      }
    });
  });


  /* ========================= */
  /* Particles */
  /* ========================= */

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


  /* ========================= */
  /* GitHub Projects */
  /* ========================= */

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
      });
  }


  /* ========================= */
  /* AI Chat System */
  /* ========================= */

  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");

  if (chatToggle) {
    chatToggle.onclick = () => {
      chatContainer.style.display =
        chatContainer.style.display === "flex" ? "none" : "flex";
    };
  }

  window.sendMessage = async function () {
    const message = userInput.value.trim();
    if (!message) return;

    chatMessages.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
    userInput.value = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      chatMessages.innerHTML += `
        <div><strong>AI:</strong> ${data.reply}</div>
      `;

      chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
      chatMessages.innerHTML += `
        <div style="color:red;">Error connecting to AI</div>
      `;
    }
  };

});
