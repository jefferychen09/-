import { content } from "./content.js";

const langKey = "jiehui-portfolio-lang";
let lang = localStorage.getItem(langKey) || "zh";

const get = (obj, path) => path.split(".").reduce((acc, key) => acc?.[key], obj);

function applyLanguage() {
  const dictionary = content[lang];
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = get(dictionary, node.dataset.i18n);
    if (value) node.textContent = value;
  });

  document.querySelectorAll("[data-lang-option]").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.langOption === lang);
  });

  renderProjects(dictionary.projectsData, dictionary.projects.labels);
  renderProof(dictionary.proofData);
  renderPrinciples(dictionary.principlesData);
  renderStacks(dictionary.stacks);
  renderProcess(dictionary.processData);
  renderAchievements(dictionary.achievementsData);
  renderNotes(dictionary.notesData);
}

function renderProof(items) {
  const grid = document.querySelector("#proofGrid");
  grid.innerHTML = items
    .map(
      ([value, label]) => `
        <div class="proof-item">
          <strong>${value}</strong>
          <span>${label}</span>
        </div>
      `
    )
    .join("");
}

function renderPrinciples(items) {
  const grid = document.querySelector("#principleGrid");
  grid.innerHTML = items
    .map(
      (item) => `
        <article class="principle-card reveal">
          <span class="principle-dot" aria-hidden="true"></span>
          <h3>${item.title}</h3>
          <p>${item.body}</p>
        </article>
      `
    )
    .join("");
  observeReveals();
}

function renderProjects(projects, labels) {
  const grid = document.querySelector("#projectGrid");
  grid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card reveal">
          <div class="project-visual">
            <img src="${project.image}" alt="${project.imageAlt}" loading="lazy" />
            <span class="asset-note">${labels.status}: ${project.status}</span>
          </div>
          <div class="project-body">
            <div class="meta">
              <span>${project.date}</span>
              <span>${project.role}</span>
            </div>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            <div class="project-details">
              <div>
                <span>${labels.challenge}</span>
                <p>${project.challenge}</p>
              </div>
              <div>
                <span>${labels.responsibility}</span>
                <p>${project.responsibility}</p>
              </div>
              <div>
                <span>${labels.outcome}</span>
                <p>${project.outcome}</p>
              </div>
            </div>
            <div class="highlight-list">
              ${project.highlights.map((item) => `<strong>${item}</strong>`).join("")}
            </div>
            <div class="project-proof">
              <div class="proof-panel verified">
                <span>${labels.verifiedFacts}</span>
                <div>
                  ${project.metrics.map((item) => `<strong>${item}</strong>`).join("")}
                </div>
              </div>
              <div class="proof-panel materials">
                <span>${labels.materials}</span>
                <div>
                  ${project.evidence.map((item) => `<em>${item}</em>`).join("")}
                </div>
              </div>
            </div>
            <div class="tag-list">
              ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
          </div>
        </article>
      `
    )
    .join("");
  observeReveals();
}

function renderStacks(stacks) {
  const grid = document.querySelector("#stackGrid");
  grid.innerHTML = stacks
    .map(
      (stack) => `
        <article class="stack-card reveal">
          <h3>${stack.title}</h3>
          <ul>
            ${stack.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
  observeReveals();
}

function renderProcess(items) {
  const rail = document.querySelector("#processRail");
  rail.innerHTML = items
    .map(
      ([number, title, body]) => `
        <article class="process-step reveal">
          <span>${number}</span>
          <div>
            <h3>${title}</h3>
            <p>${body}</p>
          </div>
        </article>
      `
    )
    .join("");
  observeReveals();
}

function renderAchievements(items) {
  const list = document.querySelector("#achievementList");
  list.innerHTML = items
    .map(
      ([year, text]) => `
        <div class="achievement-item reveal">
          <span class="achievement-year">${year}</span>
          <span class="achievement-text">${text}</span>
        </div>
      `
    )
    .join("");
  observeReveals();
}

function renderNotes(notes) {
  const grid = document.querySelector("#noteGrid");
  grid.innerHTML = notes
    .map(
      (note) => `
        <article class="note-card reveal">
          <div>
            <span class="note-date">${note.date}</span>
            <h3>${note.title}</h3>
          </div>
          <p>${note.summary}</p>
        </article>
      `
    )
    .join("");
  observeReveals();
}

let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
  }

  document.querySelectorAll(".reveal:not(.is-visible)").forEach((node) => {
    revealObserver.observe(node);
  });
}

document.querySelector(".lang-toggle").addEventListener("click", () => {
  lang = lang === "zh" ? "en" : "zh";
  localStorage.setItem(langKey, lang);
  applyLanguage();
});

document.querySelector("#year").textContent = new Date().getFullYear();
applyLanguage();
