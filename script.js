// ---------- Data ----------
const phases = [
  {
    title: "Python Fundamentals",
    days: "Days 1–10",
    color: "blue",
    tasks: [
      "Variables, data types, input/output",
      "If-else and comparison operators",
      "For loop and while loop",
      "Strings and string methods",
      "Lists and tuples",
      "Dictionaries and sets",
      "Functions and recursion basics",
      "Prime, factorial and palindrome",
      "String and list coding problems",
      "Revision and 20-question test",
    ],
  },
  {
    title: "Problem Solving + SQL",
    days: "Days 11–20",
    color: "green",
    tasks: [
      "Arrays and searching",
      "Sorting basics",
      "Two-sum problem",
      "Second-largest number",
      "Frequency counting",
      "Time complexity basics",
      "SQL SELECT and WHERE",
      "ORDER BY and GROUP BY",
      "SQL JOIN and aggregate functions",
      "Subqueries and SQLite practice",
    ],
  },
  {
    title: "Aptitude + CS Fundamentals",
    days: "Days 21–30",
    color: "purple",
    tasks: [
      "Percentages, ratios and averages",
      "Profit and loss",
      "Time and work",
      "Speed and distance",
      "Reasoning: series and coding-decoding",
      "Verbal ability and comprehension",
      "OOP concepts",
      "DBMS and normalization",
      "Operating systems basics",
      "Computer networks and mock test",
    ],
  },
  {
    title: "Projects + Interview Prep",
    days: "Days 31–38",
    color: "orange",
    tasks: [
      "Revise Python and React",
      "Revise SQL",
      "Prepare project explanation",
      "Explain project architecture",
      "Prepare Deloitte simulation explanation",
      "Practice Python interview questions",
      "Practice SQL and DBMS questions",
      "Prepare HR interview answers",
    ],
  },
  {
    title: "Mock Tests + Applications",
    days: "Days 39–45",
    color: "teal",
    tasks: [
      "Full aptitude and coding mock test",
      "Python and SQL revision",
      "CS fundamentals revision",
      "Technical mock interview",
      "HR mock interview and resume review",
      "Final mock test and weak topics",
      "Apply to suitable fresher jobs",
    ],
  },
];

const checklist = [
  "Infosys application submit cheyyadam",
  "Python basics complete cheyyadam",
  "50 Python problems practice cheyyadam",
  "SQL lo 30 queries solve cheyyadam",
  "5 aptitude mock tests rayadam",
  "Project explanation prepare cheyyadam",
  "Resume and certificates verify cheyyadam",
  "3 technical mock interviews complete cheyyadam",
];

const studyPlan = [
  { subject: "Python Coding", time: "1 hour", target: "3–5 problems" },
  { subject: "Aptitude & Reasoning", time: "1 hour", target: "20 questions" },
  { subject: "SQL", time: "45 min", target: "5 queries" },
  { subject: "CS Fundamentals", time: "45 min", target: "1 topic" },
  { subject: "Interview Practice", time: "30 min", target: "2 questions" },
];

const links = [
  { name: "HackerRank Python", url: "https://www.hackerrank.com/domains/python" },
  { name: "HackerRank SQL", url: "https://www.hackerrank.com/domains/sql" },
  { name: "LeetCode", url: "https://leetcode.com/problemset/" },
  { name: "IndiaBIX Aptitude", url: "https://www.indiabix.com/" },
];

const navItems = [
  ["Home", "⌂"],
  ["Roadmap", "▤"],
  ["Daily Plan", "▦"],
  ["Practice Links", "↗"],
  ["Progress", "▥"],
  ["Notes", "▧"],
];

const phaseIcons = ["🐍", "▤", "🧠", "</>", "✓"];

// ---------- State (persisted in localStorage, same keys as the React version) ----------
function loadSaved(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

const state = {
  page: "Home",
  completed: loadSaved("jobprep45_completed", {}),
  checked: loadSaved("jobprep45_checklist", []),
  notes: localStorage.getItem("jobprep45_notes") || "",
  selectedPhase: 0,
};

function persist() {
  localStorage.setItem("jobprep45_completed", JSON.stringify(state.completed));
  localStorage.setItem("jobprep45_checklist", JSON.stringify(state.checked));
  localStorage.setItem("jobprep45_notes", state.notes);
}

function stats() {
  const totalTasks = phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const doneTasks = Object.values(state.completed).filter(Boolean).length;
  const percent = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const checklistPercent = checklist.length
    ? Math.round((state.checked.length / checklist.length) * 100)
    : 0;
  return { totalTasks, doneTasks, percent, checklistPercent };
}

// ---------- Actions (exposed globally so inline handlers can call them) ----------
function setPage(name) {
  state.page = name;
  render();
}

function goToPhase(i) {
  state.selectedPhase = i;
  state.page = "Roadmap";
  render();
}

function setSelectedPhase(i) {
  if (i < 0 || i >= phases.length) return;
  state.selectedPhase = i;
  render();
}

function toggleTask(phaseIndex, taskIndex) {
  const key = `${phaseIndex}-${taskIndex}`;
  state.completed[key] = !state.completed[key];
  persist();
  render();
}

function toggleChecklist(i, isChecked) {
  if (isChecked) {
    if (!state.checked.includes(i)) state.checked.push(i);
  } else {
    state.checked = state.checked.filter((x) => x !== i);
  }
  persist();
  render();
}

function updateNotes(value) {
  state.notes = value;
  persist();
  // no re-render here, so the textarea keeps focus/cursor position
}

// ---------- Rendering ----------
function renderNav() {
  const nav = document.getElementById("nav-list");
  nav.innerHTML = navItems
    .map(
      ([name, icon]) => `
      <button class="nav-item ${state.page === name ? "active" : ""}" onclick="setPage('${name}')">
        <span>${icon}</span>${name}
      </button>`
    )
    .join("");
}

function renderHome() {
  const { totalTasks, doneTasks, percent } = stats();
  const phaseCards = phases
    .map((phase, i) => {
      const done = phase.tasks.filter((_, j) => state.completed[`${i}-${j}`]).length;
      const miniPct = Math.round((done / phase.tasks.length) * 100);
      const previewTasks = phase.tasks
        .slice(0, 4)
        .map((t) => `<li>${t}</li>`)
        .join("");
      return `
        <button class="phase-card ${phase.color}" onclick="goToPhase(${i})">
          <div class="phase-top">
            <span class="phase-icon">${phaseIcons[i]}</span>
            <strong>Phase ${i + 1}: ${phase.title}</strong>
            <small>${phase.days}</small>
          </div>
          <ul>${previewTasks}</ul>
          <div class="mini-progress">
            <div><span style="width:${miniPct}%"></span></div>
            <small>${done}/${phase.tasks.length}</small>
            <b>›</b>
          </div>
        </button>`;
    })
    .join("");

  return `
    <section class="welcome">
      <div>
        <h1>Hello Satish 👋</h1>
        <p>Your 45-day journey to get job ready starts here.</p>
      </div>
      <div class="target-card">
        <span class="target-icon">◎</span>
        <div>
          <strong>Target</strong>
          <p>Infosys (System Engineer) + Other Fresher Jobs</p>
          <small>Application deadline: Sep 29, 2026</small>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="stat green"><span>▣</span><small>Total Days</small><strong>45</strong><small>days</small></div>
      <div class="stat purple"><span>✓</span><small>Tasks Completed</small><strong>${doneTasks}</strong><small>of ${totalTasks}</small></div>
      <div class="stat blue"><span>◷</span><small>Daily Study Time</small><strong>4–5</strong><small>hours</small></div>
      <div class="stat orange"><span>◎</span><small>Current Phase</small><strong>Phase 1</strong><small>Python Fundamentals</small></div>
    </section>

    <section class="progress-card">
      <div class="section-heading"><strong>Overall Progress</strong><b>${percent}%</b></div>
      <div class="progress-track"><div style="width:${percent}%"></div></div>
      <small>${doneTasks} of ${totalTasks} roadmap tasks completed</small>
    </section>

    <section class="section">
      <h2>▣ 45-Day Roadmap</h2>
      <div class="phase-grid">${phaseCards}</div>
    </section>`;
}

function renderRoadmap() {
  const i = state.selectedPhase;
  const phase = phases[i];
  const done = phase.tasks.filter((_, j) => state.completed[`${i}-${j}`]).length;
  const pct = Math.round((done / phase.tasks.length) * 100);

  const tabs = phases
    .map(
      (p, idx) => `
      <button class="${state.selectedPhase === idx ? "selected" : ""}" onclick="setSelectedPhase(${idx})">
        Phase ${idx + 1}
      </button>`
    )
    .join("");

  const taskRows = phase.tasks
    .map(
      (task, j) => `
      <label class="task">
        <input type="checkbox" ${state.completed[`${i}-${j}`] ? "checked" : ""} onchange="toggleTask(${i}, ${j})" />
        <span>${task}</span>
      </label>`
    )
    .join("");

  return `
    <section class="page-section">
      <h1>45-Day Roadmap</h1>
      <p class="subtitle">Complete each task and track your progress.</p>
      <div class="phase-tabs">${tabs}</div>
      <div class="detail-card ${phase.color}">
        <h2>${phase.title}</h2>
        <p>${phase.days}</p>
        <div class="task-list">${taskRows}</div>
        <div class="progress-track"><div style="width:${pct}%"></div></div>
      </div>
      <div class="phase-navigation">
        <button ${i === 0 ? "disabled" : ""} onclick="setSelectedPhase(${i - 1})">← Previous</button>
        <button ${i === phases.length - 1 ? "disabled" : ""} onclick="setSelectedPhase(${i + 1})">Next Phase →</button>
      </div>
    </section>`;
}

function renderDailyPlan() {
  const rows = studyPlan
    .map(
      (item) => `
      <div class="study-row">
        <strong>${item.subject}</strong><span>${item.time}</span><span>${item.target}</span>
      </div>`
    )
    .join("");

  return `
    <section class="page-section">
      <h1>Daily Study Plan</h1>
      <p class="subtitle">Follow this routine every day. Take short breaks between sessions.</p>
      <div class="table-card">
        <div class="study-row study-head"><span>Subject</span><span>Time</span><span>Daily Target</span></div>
        ${rows}
      </div>
      <div class="info-card"><strong>Tip</strong><p>Start with the most difficult topic while you are fresh. Review yesterday's topics for 10 minutes.</p></div>
    </section>`;
}

function renderPracticeLinks() {
  const cards = links
    .map(
      (link) => `
      <a class="link-card" href="${link.url}" target="_blank" rel="noreferrer">
        <span>↗</span><strong>${link.name}</strong><b>Open website →</b>
      </a>`
    )
    .join("");

  return `
    <section class="page-section">
      <h1>Practice Links</h1>
      <p class="subtitle">Free websites to practice coding, SQL and aptitude.</p>
      <div class="link-grid">${cards}</div>
    </section>`;
}

function renderProgress() {
  const { totalTasks, doneTasks, percent, checklistPercent } = stats();
  const items = checklist
    .map(
      (item, i) => `
      <label class="task">
        <input type="checkbox" ${state.checked.includes(i) ? "checked" : ""} onchange="toggleChecklist(${i}, this.checked)" />
        <span>${item}</span>
      </label>`
    )
    .join("");

  return `
    <section class="page-section">
      <h1>Your Progress</h1>
      <p class="subtitle">Track your completed roadmap tasks and preparation checklist.</p>
      <div class="progress-card big-progress">
        <strong>Roadmap completion</strong><h2>${percent}%</h2>
        <div class="progress-track"><div style="width:${percent}%"></div></div>
        <small>${doneTasks} / ${totalTasks} tasks completed</small>
      </div>
      <div class="check-card">
        <div class="section-heading"><h2>Job Preparation Checklist</h2><b>${state.checked.length}/${checklist.length}</b></div>
        <div class="progress-track"><div style="width:${checklistPercent}%"></div></div>
        ${items}
      </div>
    </section>`;
}

function renderNotes() {
  return `
    <section class="page-section">
      <h1>My Notes</h1>
      <p class="subtitle">Write important topics, interview questions or things to revise.</p>
      <textarea class="notes" placeholder="Type your notes here..." oninput="updateNotes(this.value)">${state.notes}</textarea>
      <small class="saved">Notes automatically save in this browser.</small>
    </section>`;
}

function render() {
  renderNav();
  const main = document.getElementById("main-content");
  let content;
  switch (state.page) {
    case "Home": content = renderHome(); break;
    case "Roadmap": content = renderRoadmap(); break;
    case "Daily Plan": content = renderDailyPlan(); break;
    case "Practice Links": content = renderPracticeLinks(); break;
    case "Progress": content = renderProgress(); break;
    case "Notes": content = renderNotes(); break;
    default: content = renderHome();
  }
  main.innerHTML = content + `<footer>JobPrep 45 · Your daily progress matters. Keep learning, Satish! 💪</footer>`;
}

render();
