// Typing Effect
const text = ["Java • Spring Boot • Kafka", 
              "Cloud • Microservices • AWS",
              "Enterprise Backend Engineer"];

let i = 0;
let j = 0;
let currentText = "";
let isDeleting = false;

function type() {
  const typingElement = document.querySelector(".typing");

  if (i < text.length) {
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
  }

  setTimeout(type, 100);
}

type();

// Scroll Reveal
window.addEventListener("scroll", function () {
  document.querySelectorAll(".reveal").forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
});

// Particles
particlesJS("particles-js", {
  particles: {
    number: { value: 80 },
    size: { value: 3 },
    move: { speed: 1 },
    line_linked: { enable: true }
  }
});
fetch("https://api.github.com/users/aprantosh/repos")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("github-projects");
    data.slice(0, 4).forEach(repo => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description available"}</p>
        <a href="${repo.html_url}" target="_blank">View Repository</a>
      `;
      container.appendChild(div);
    });
  });
async function sendMessage() {
  const input = document.getElementById("userInput").value;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: input })
  });

  const data = await response.json();

  document.getElementById("chatResponse").innerText =
    data.choices[0].message.content;
}
function toggleChat() {
  const chat = document.getElementById("chatContainer");
  chat.style.display = chat.style.display === "none" ? "block" : "none";
}
