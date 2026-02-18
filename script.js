document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     Typing Effect
  ========================= */

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

    const full = text[i];

    if (!isDeleting) currentText = full.substring(0, j++);
    else currentText = full.substring(0, j--);

    typingElement.textContent = currentText;

    if (!isDeleting && j > full.length) {
      isDeleting = true;
      setTimeout(type, 700);
      return;
    }

    if (isDeleting && j < 0) {
      isDeleting = false;
      i = (i + 1) % text.length;
      j = 0;
    }

    setTimeout(type, isDeleting ? 35 : 55);
  }
  type();


  /* =========================
     Mobile Nav Toggle
  ========================= */

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  function setNavOpen(open) {
    if (!navLinks || !navToggle) return;
    navLinks.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.contains("open");
      setNavOpen(!isOpen);
    });

    // close menu when clicking a link (mobile)
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => setNavOpen(false));
    });

    // close if clicking outside
    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("open")) return;
      const clickedInside = navLinks.contains(e.target) || navToggle.contains(e.target);
      if (!clickedInside) setNavOpen(false);
    });

    // close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });
  }


  /* =========================
     Scroll Reveal
  ========================= */

  function revealOnScroll() {
    document.querySelectorAll(".reveal").forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 120) el.classList.add("active");
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();


  /* =========================
     Particles
  ========================= */

  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 70 },
        size: { value: 2 },
        move: { speed: 1.2 },
        line_linked: { enable: true }
      }
    });
  }


  /* =========================
     GitHub Projects (optional)
     - NOTE: Your current HTML does NOT include #github-projects.
     - This will run only if you add <div id="github-projects"></div>
  ========================= */

  const githubContainer = document.getElementById("github-projects");
  const GITHUB_USER = "nabarajkandel"; // update if different

  if (githubContainer) {
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6`)
      .then(res => {
        if (!res.ok) throw new Error("GitHub API error");
        return res.json();
      })
      .then(repos => {
        githubContainer.innerHTML = "";
        repos.slice(0, 4).forEach(repo => {
          const div = document.createElement("div");
          div.classList.add("card");
          div.innerHTML = `
            <h3>${repo.name}</h3>
            <p class="muted">${repo.description || "No description available."}</p>
            <p class="tiny muted">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</p>
            <a class="btn btn-small" href="${repo.html_url}" target="_blank" rel="noopener">View Repository</a>
          `;
          githubContainer.appendChild(div);
        });
      })
      .catch(() => {
        githubContainer.innerHTML = `
          <div class="card">
            <h3>GitHub Projects</h3>
            <p class="muted">Couldn’t load projects (rate limit or username not set).</p>
          </div>
        `;
      });
  }


  /* =========================
     Copy Email Button
  ========================= */

  const copyBtn = document.getElementById("copyEmailBtn");
  const copyStatus = document.getElementById("copyStatus");

  // ✅ Put the correct email here (double-check spelling before publishing)
  const EMAIL = "nabarajkan@gmail.com";

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(EMAIL);
        if (copyStatus) copyStatus.textContent = "Email copied to clipboard ✅";
      } catch (e) {
        // fallback if clipboard blocked
        const temp = document.createElement("input");
        temp.value = EMAIL;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
        if (copyStatus) copyStatus.textContent = "Email copied ✅";
      }

      setTimeout(() => {
        if (copyStatus) copyStatus.textContent = "";
      }, 2500);
    });
  }


  /* =========================
     Footer year
  ========================= */

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* =========================
     AI Chat System (Vercel API)
  ========================= */

  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const chatClose = document.getElementById("chat-close");
  const chatSendBtn = document.getElementById("chat-send");
  const chatStatus = document.getElementById("chat-status");


  function addMessage(role, text) {
    if (!chatMessages) return null;
    const div = document.createElement("div");
    div.className = role === "user" ? "msg user" : "msg ai";
    div.innerHTML = `<strong>${role === "user" ? "You" : "AI"}:</strong> ${text}`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  function typeInto(element, fullText, speed = 14) {
    let idx = 0;
    element.innerHTML = `<strong>AI:</strong> `;
    function step() {
      if (idx < fullText.length) {
        element.innerHTML += fullText.charAt(idx++);
        setTimeout(step, speed);
      }
    }
    step();
  }

  function toggleChat(forceOpen = null) {
    if (!chatContainer) return;
    const isOpen = chatContainer.style.display === "flex";
    const next = forceOpen === null ? !isOpen : forceOpen;
    chatContainer.style.display = next ? "flex" : "none";
    if (next && userInput) userInput.focus();
  }

  // auto open once after page loads (remove later if you want)
  // Auto-open once after page loads (remove later if you want)

  if (!localStorage.getItem("chat_auto_opened")) {
  setTimeout(() => toggleChat(true), 1200);
  localStorage.setItem("chat_auto_opened", "1");
}

  if (chatToggle) {
    chatToggle.onclick = () => toggleChat();
    // keyboard accessibility
    chatToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") toggleChat();
    });
  }
  if (chatClose) chatClose.onclick = () => toggleChat(false);
  if (chatSendBtn) chatSendBtn.onclick = () => window.sendMessage();

  // close chat on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleChat(false);
  });

  // Welcome message
  setTimeout(() => {
    if (chatMessages) addMessage("ai", "Hi! I’m Nabaraj’s assistant. Ask me about his experience, tech stack, or projects.");
  }, 700);

 window.sendMessage = async function () {
  const message = userInput?.value.trim();
  if (!message) return;

  addMessage("user", message);
  userInput.value = "";

  const aiDiv = document.createElement("div");
  aiDiv.className = "msg ai";
  aiDiv.innerHTML = `<strong>AI:</strong> ...`;
  chatMessages.appendChild(aiDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // ✅ show status while calling API
  if (chatStatus) chatStatus.textContent = "Typing…";

  try {
    const response = await fetch("https://nabaraj-portfolio-ruby.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!response.ok) throw new Error("Server error");

    const data = await response.json();
    const reply = data?.reply || "I didn’t get a reply from the server.";

    // ✅ back to online once we got reply
    if (chatStatus) chatStatus.textContent = "Online";

    typeInto(aiDiv, reply, 14);

  } catch (error) {
    if (chatStatus) chatStatus.textContent = "Offline";
    aiDiv.innerHTML = `<strong>AI:</strong> <span style="color:#ff6b6b;">Error connecting to AI.</span>`;
  }
};


  // Enter to send
  if (userInput) {
    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") window.sendMessage();
    });
  }

});
