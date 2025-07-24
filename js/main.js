const BASE_URL = "https://dach-mallonn.de"; // Replace with your domain

// Scroll-responsive header
window.addEventListener("scroll", () => {
  const header = document.getElementById("siteHeader");
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Mouse-driven hero overlay effect
document.addEventListener('mousemove', function (e) {
  const overlay = document.getElementById('heroOverlay');
  if (!overlay) return;

  const x = e.clientX / window.innerWidth;
  const redStop = Math.min(100, Math.max(0, x * 100));
  const whiteStop = 100 - redStop;

  overlay.style.background = `
    linear-gradient(
      to right,
      rgba(153, 0, 0, 0.7) ${redStop}%,
      rgba(255, 255, 255, 0.3) ${whiteStop}%
    )
  `;
});

// Dynamically set active nav link
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-btn");

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// Search function for index.html file
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("quickSearch");
  const button = document.getElementById("searchButton");
  const resultsContainer = document.getElementById("searchResults");
  const resultsList = document.getElementById("resultsList");

  const searchableSections = Array.from(document.querySelectorAll("section, .service-entry, .team-member, .hero-content, .kontakt-aligned"));

  function performSearch(query) {
    const q = query.toLowerCase().trim();
    resultsList.innerHTML = "";

    if (!q) {
      resultsContainer.style.display = "none";
      return;
    }

    let matches = 0;

    searchableSections.forEach(section => {
      if (section.textContent.toLowerCase().includes(q)) {
        const title = section.querySelector("h1, h2, h3")?.innerText || "Unbenannter Abschnitt";
        const fullText = section.textContent.trim();
        const index = fullText.toLowerCase().indexOf(q);

        const snippetStart = Math.max(0, index - 60);
        const snippetEnd = Math.min(fullText.length, index + 100);
        const snippet = fullText.substring(snippetStart, snippetEnd).replace(/\s+/g, ' ') + "...";

        const id = section.id || ("match-" + Math.random().toString(36).substr(2, 9));
        section.id = id;

        const entry = document.createElement("li");
        entry.style.padding = "1rem 0";
        entry.style.borderTop = matches > 0 ? "1px solid #ddd" : "none";
        entry.style.margin = "0";

        const link = document.createElement("a");
        link.href = `#${id}`;
        link.style.textDecoration = "none";
        link.style.color = "#000";
        link.style.display = "block";

        const titleEl = document.createElement("h3");
        titleEl.textContent = title;
        titleEl.style.margin = "0 0 0.5rem 0";
        titleEl.style.fontWeight = "bold";
        titleEl.style.fontSize = "1.1rem";

        const textEl = document.createElement("p");
        textEl.textContent = snippet;
        textEl.style.fontSize = "0.95rem";
        textEl.style.color = "#444";
        textEl.style.margin = "0";

        link.appendChild(titleEl);
        link.appendChild(textEl);
        entry.appendChild(link);
        resultsList.appendChild(entry);

        matches++;
      }
    });

    if (matches > 0) {
      resultsContainer.style.display = "block";
    } else {
      resultsList.innerHTML = `<li style="padding: 1rem 0;">Keine Ergebnisse gefunden für „${query}“</li>`;
      resultsContainer.style.display = "block";
    }
  }

  input.addEventListener("keypress", e => {
    if (e.key === "Enter") performSearch(input.value);
  });

  button.addEventListener("click", () => {
    performSearch(input.value);
  });
});

// Contact form handler
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("status");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const data = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          status.textContent = "Message sent!";
          form.reset();
        } else {
          const result = await response.json();
          status.textContent = result.error || "There was a problem.";
        }
      } catch (error) {
        status.textContent = "Network error. Please try again.";
      }
    });
  }
});

// Sliding function for flachdach leistungen.html
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById('baSliderOverlay');
  const handle = document.getElementById('baSliderHandle');
  const container = handle?.parentElement;

  if (!overlay || !handle || !container) return;

  let active = false;

  const updateSlider = (x) => {
    const rect = container.getBoundingClientRect();
    let pos = x - rect.left;
    pos = Math.max(0, Math.min(pos, rect.width));
    overlay.style.width = pos + 'px';
    handle.style.left = pos + 'px';
  };

  handle.addEventListener('mousedown', () => active = true);
  document.addEventListener('mouseup', () => active = false);
  document.addEventListener('mousemove', (e) => {
    if (active) updateSlider(e.clientX);
  });

  handle.addEventListener('touchstart', () => active = true);
  document.addEventListener('touchend', () => active = false);
  document.addEventListener('touchmove', (e) => {
    if (active && e.touches[0]) updateSlider(e.touches[0].clientX);
  });
});

