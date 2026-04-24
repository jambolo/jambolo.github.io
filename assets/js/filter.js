// Project filtering and rendering logic

const projectsData = [
  // ADVENT OF CODE (type = aoc)
  {
    title: "2025 - Rust",
    description: "Solutions for Advent of Code 2025 in Rust.",
    projectType: "aoc",
    topic: "aoc",
    isWip: false,
    github: "https://github.com/jambolo/advent-of-code-2025",
    languages: ["Rust"],
  },
  {
    title: "2025 Visualizations",
    description: "Visualizations of the solutions to Advent of Code 2025.",
    projectType: "aoc",
    topic: "aoc",
    isWip: false,
    github: "https://github.com/jambolo/advent-of-code-2025-visualizations",
    demo: "advent-of-code-2025-visualizations/index.html",
    languages: ["TypeScript"],
  },
  {
    title: "2024 - Haskell",
    description: "Solutions for Advent of Code 2024 in Haskell.",
    projectType: "aoc",
    topic: "aoc",
    isWip: true,
    github: "https://github.com/jambolo/advent-of-code-2024",
    languages: ["Haskell"],
  },
  {
    title: "2023 - Rust",
    description: "Solutions for Advent of Code 2023 in Rust.",
    projectType: "aoc",
    topic: "aoc",
    isWip: true,
    github: "https://github.com/jambolo/advent-of-code-2023",
    languages: ["Rust"],
  },
  {
    title: "2022 - Python",
    description: "Solutions for Advent of Code 2022 in Python.",
    projectType: "aoc",
    topic: "aoc",
    isWip: false,
    github: "https://github.com/jambolo/advent-of-code-2022",
    languages: ["Python"],
  },
  {
    title: "2021 - C++",
    description: "Solutions for Advent of Code 2021 in C++.",
    projectType: "aoc",
    topic: "aoc",
    isWip: false,
    github: "https://github.com/jambolo/advent-of-code-2021",
    languages: ["C++"],
  },
  {
    title: "2020 - Julia",
    description: "Solutions for Advent of Code 2020 in Julia.",
    projectType: "aoc",
    topic: "aoc",
    isWip: false,
    github: "https://github.com/jambolo/advent-of-code-2020",
    languages: ["Julia"],
  },
  {
    title: "2016 - TypeScript",
    description: "Solutions for Advent of Code 2016 in TypeScript.",
    projectType: "aoc",
    topic: "aoc",
    isWip: false,
    github: "https://github.com/jambolo/advent-of-code-2016",
    languages: ["TypeScript"],
  },
  {
    title: "2015 - Go",
    description: "Solutions for Advent of Code 2015 in Go.",
    projectType: "aoc",
    topic: "aoc",
    isWip: false,
    github: "https://github.com/jambolo/advent-of-code-2015",
    languages: ["Go"],
  },

  // APPLICATIONS
  {
    title: "bip39",
    description: "Various BIP-39 tools.",
    projectType: "applications",
    topic: "crypto",
    isWip: false,
    github: "https://github.com/jambolo/bip39",
    languages: ["CoffeeScript", "Node.js"],
  },
  {
    title: "blackjack",
    description: "Various tools for analyzing the game of Blackjack.",
    projectType: "applications",
    topic: "gameanalysis",
    isWip: false,
    github: "https://github.com/jambolo/blackjack",
    languages: ["Julia"],
  },
  {
    title: "cargo-wrap-comments",
    description: "Formats comments in Rust source files at configurable width.",
    projectType: "applications",
    topic: "devtools",
    isWip: false,
    github: "https://github.com/jambolo/cargo-wrap-comments",
    crate: "https://crates.io/crates/cargo-wrap-comments",
    languages: ["Rust"],
  },
  {
    title: "ClueSolver",
    description: "A simple solver for the game of Clue.",
    projectType: "applications",
    topic: "gameanalysis",
    isWip: false,
    github: "https://github.com/jambolo/ClueSolver",
    languages: ["C++"],
  },
  {
    title: "craps",
    description: "Various tools to analyze the game of craps.",
    projectType: "applications",
    topic: "gameanalysis",
    isWip: false,
    github: "https://github.com/jambolo/craps",
    languages: ["CoffeeScript", "Node.js"],
  },
  {
    title: "dominoes",
    description: "Play dominoes against the computer.",
    projectType: "applications",
    topic: "gameai",
    isWip: false,
    github: "https://github.com/jambolo/dominoes",
    languages: ["Rust"],
  },
  {
    title: "git-helpers",
    description: "Bash scripts and aliases that make git easier to use.",
    projectType: "applications",
    topic: "devtools",
    isWip: false,
    github: "https://github.com/jambolo/git-helpers",
    languages: ["Bash"],
  },
  {
    title: "github-workflows",
    description: "A collection of reusable GitHub Actions workflows.",
    projectType: "applications",
    topic: "devtools",
    isWip: false,
    github: "https://github.com/jambolo/github-workflows",
    languages: ["YAML"],
  },
  {
    title: "joinmarket-schedule",
    description: "Schedule tool for JoinMarket.",
    projectType: "applications",
    topic: "crypto",
    isWip: false,
    github: "https://github.com/jambolo/joinmarket-schedule",
    languages: ["CoffeeScript", "Node.js"],
  },
  {
    title: "konane",
    description: "Play Konane against the computer.",
    projectType: "applications",
    topic: "gameai",
    isWip: false,
    github: "https://github.com/jambolo/konane",
    languages: ["Rust"],
  },
  {
    title: "LanguageAnalysis",
    description: "C++ utilities for analyzing language data with n-gram focus.",
    projectType: "applications",
    topic: "algorithms",
    isWip: false,
    github: "https://github.com/jambolo/LanguageAnalysis",
    languages: ["C++"],
  },
  {
    title: "Nim",
    description: "Play Nim against the computer.",
    projectType: "applications",
    topic: "gameai",
    isWip: false,
    github: "https://github.com/jambolo/Nim",
    languages: ["C++"],
  },
  {
    title: "Not A Clue",
    description: "An application that assists with playing the game of Clue.",
    projectType: "applications",
    topic: "gameanalysis",
    isWip: false,
    github: "https://github.com/jambolo/not-a-clue",
    demo: "not-a-clue/index.html",
    languages: ["CoffeeScript", "React"],
  },
  {
    title: "pai-gow-poker",
    description: "Various tools to analyze the game of Pai Gow Poker.",
    projectType: "applications",
    topic: "gameanalysis",
    isWip: false,
    github: "https://github.com/jambolo/pai-gow-poker",
    languages: ["CoffeeScript", "Node.js"],
  },
  {
    title: "Sieve",
    description: "Finds all primes up to a limit using a Sieve of Eratosthenes.",
    projectType: "applications",
    topic: "algorithms",
    isWip: false,
    github: "https://github.com/jambolo/Sieve",
    languages: ["C++"],
  },
  {
    title: "Sudoku",
    description: "Sudoku puzzle solver, generator, move suggester, and difficulty rater.",
    projectType: "applications",
    topic: "gameanalysis",
    isWip: false,
    github: "https://github.com/jambolo/Sudoku",
    languages: ["C++"],
  },
  {
    title: "sudokujs",
    description: "A sudoku game.",
    projectType: "applications",
    topic: "gameanalysis",
    isWip: false,
    github: "https://github.com/jambolo/sudokujs",
    demo: "sudokujs/index.html",
    languages: ["CoffeeScript"],
  },
  {
    title: "Tic-Tac-Toe",
    description: "Play Tic-Tac-Toe against the computer.",
    projectType: "applications",
    topic: "gameai",
    isWip: false,
    github: "https://github.com/jambolo/Tic-Tac-Toe",
    languages: ["C++"],
  },
  {
    title: "Wordle Solver",
    description: "An application that assists with the game of Wordle.",
    projectType: "applications",
    topic: "gameanalysis",
    isWip: false,
    github: "https://github.com/jambolo/wordle-solver",
    demo: "wordle-solver/index.html",
    languages: ["CoffeeScript"],
  },

  // LIBRARIES
  {
    title: "AsynchronousCache",
    description: "Asynchronous cache interface class.",
    projectType: "libraries",
    topic: "algorithms",
    isWip: false,
    github: "https://github.com/jambolo/AsynchronousCache",
    docs: "docs/AsynchronousCache/html/index.html",
    languages: ["C++"],
  },
  {
    title: "BinaryTree",
    description: "Binary tree implementation.",
    projectType: "libraries",
    topic: "algorithms",
    isWip: false,
    github: "https://github.com/jambolo/BinaryTree",
    docs: "docs/BinaryTree/html/index.html",
    languages: ["C++"],
  },
  {
    title: "Buffer",
    description: "Generic I/O buffer.",
    projectType: "libraries",
    topic: "algorithms",
    isWip: false,
    github: "https://github.com/jambolo/Buffer",
    docs: "docs/Buffer/html/index.html",
    languages: ["C++"],
  },
  {
    title: "Cache",
    description: "Generic cache implementations.",
    projectType: "libraries",
    topic: "algorithms",
    isWip: false,
    github: "https://github.com/jambolo/Cache",
    docs: "docs/Cache/html/index.html",
    languages: ["C++"],
  },
  {
    title: "Crypto",
    description: "Cryptographic utility functions.",
    projectType: "libraries",
    topic: "crypto",
    isWip: false,
    github: "https://github.com/jambolo/Crypto",
    docs: "docs/Crypto/html/index.html",
    languages: ["C++"],
  },
  {
    title: "drawArc",
    description: "Computes the first endpoint for drawing an arbitrary arc using arcTo.",
    projectType: "libraries",
    topic: "graphics",
    isWip: false,
    github: "https://github.com/jambolo/drawArc",
    docs: "https://github.com/jambolo/drawArc#drawarc",
    demo: "drawArc/index.html",
    languages: ["CoffeeScript"],
  },
  {
    title: "game-player",
    description: "Base component library for implementing a player for two-person games in Rust.",
    projectType: "libraries",
    topic: "gameai",
    isWip: false,
    github: "https://github.com/jambolo/game-player",
    docs: "docs/game-player/game_player/index.html",
    languages: ["Rust"],
  },
  {
    title: "GamePlayer",
    description: "A game player for two-person perfect-information games with minimax and alpha-beta pruning.",
    projectType: "libraries",
    topic: "gameai",
    isWip: false,
    github: "https://github.com/jambolo/GamePlayer",
    docs: "docs/GamePlayer/html/index.html",
    languages: ["C++"],
  },
  {
    title: "Glfwx",
    description: "C++ wrapper for GLFW.",
    projectType: "libraries",
    topic: "graphics",
    isWip: false,
    github: "https://github.com/jambolo/Glfwx",
    docs: "docs/Glfwx/html/index.html",
    languages: ["C++"],
  },
  {
    title: "Glx",
    description: "OpenGL extensions.",
    projectType: "libraries",
    topic: "graphics",
    isWip: false,
    github: "https://github.com/jambolo/Glx",
    docs: "docs/Glx/html/index.html",
    languages: ["C++"],
  },
  {
    title: "Heightfield",
    description: "Heightfield object.",
    projectType: "libraries",
    topic: "graphics",
    isWip: false,
    github: "https://github.com/jambolo/Heightfield",
    docs: "docs/Heightfield/html/index.html",
    languages: ["C++"],
  },
  {
    title: "Misc",
    description: "Miscellaneous features and functionality not worthy of individual projects.",
    projectType: "libraries",
    topic: "devtools",
    isWip: false,
    github: "https://github.com/jambolo/Misc",
    docs: "docs/Misc/html/index.html",
    languages: ["C++"],
  },
  {
    title: "Msxmlx",
    description: "MSXML Extensions.",
    projectType: "libraries",
    topic: "devtools",
    isWip: false,
    github: "https://github.com/jambolo/Msxmlx",
    docs: "docs/Msxmlx/html/index.html",
    languages: ["C++", "Windows"],
  },
  {
    title: "NeuralNet",
    description: "Various neural network implementations.",
    projectType: "libraries",
    topic: "algorithms",
    isWip: false,
    github: "https://github.com/jambolo/NeuralNet",
    docs: "docs/NeuralNet/html/index.html",
    languages: ["C++"],
  },
  {
    title: "PathFinder",
    description: "A path-finder implementation using A*.",
    projectType: "libraries",
    topic: "algorithms",
    isWip: false,
    github: "https://github.com/jambolo/PathFinder",
    docs: "docs/PathFinder/html/index.html",
    languages: ["C++"],
  },
  {
    title: "PidController",
    description: "Basic PID controller.",
    projectType: "libraries",
    topic: "other",
    isWip: false,
    github: "https://github.com/jambolo/PidController",
    docs: "docs/PidController/html/index.html",
    languages: ["C++"],
  },
  {
    title: "python",
    description: "Miscellaneous Python utility libraries.",
    projectType: "libraries",
    topic: "devtools",
    isWip: false,
    github: "https://github.com/jambolo/python",
    docs: "docs/python/index.html",
    languages: ["Python"],
  },
  {
    title: "Rect",
    description: "Operations on a rectangle with integer coordinates.",
    projectType: "libraries",
    topic: "graphics",
    isWip: false,
    github: "https://github.com/jambolo/Rect",
    docs: "docs/Rect/html/index.html",
    languages: ["C++"],
  },
  {
    title: "TgaFile",
    description: "TGA format and file support.",
    projectType: "libraries",
    topic: "graphics",
    isWip: false,
    github: "https://github.com/jambolo/TgaFile",
    docs: "docs/TgaFile/html/index.html",
    languages: ["C++"],
  },
  {
    title: "thick-xiaolin-wu",
    description: "Extension to Xiaolin Wu's line drawing algorithm for drawing thick lines.",
    projectType: "libraries",
    topic: "graphics",
    isWip: false,
    github: "https://github.com/jambolo/thick-xiaolin-wu",
    languages: ["CoffeeScript"],
  },
  {
    title: "Thread",
    description: "Thread management and synchronization utilities.",
    projectType: "libraries",
    topic: "algorithms",
    isWip: false,
    github: "https://github.com/jambolo/Thread",
    docs: "docs/Thread/html/index.html",
    languages: ["C++"],
  },
  {
    title: "Wx",
    description: "Windows API extensions.",
    projectType: "libraries",
    topic: "devtools",
    isWip: false,
    github: "https://github.com/jambolo/Wx",
    docs: "docs/Wx/html/index.html",
    languages: ["C++", "Windows"],
  },
  {
    title: "zstream",
    description: "C++ streams for zip files.",
    projectType: "libraries",
    topic: "algorithms",
    isWip: false,
    github: "https://github.com/jambolo/zstream",
    docs: "docs/zstream/html/index.html",
    languages: ["C++"],
  },

  // BUILT BY AI (GitHub Spark)
  {
    title: "BIP-39 Toolkit",
    description: "Various tools dealing with BIP-39.",
    projectType: "builtbyai",
    topic: "crypto",
    isWip: false,
    github: "https://github.com/jambolo/mnemonic-toolkit-web",
    demo: "https://bip-39-toolkit--jambolo.github.app",
    languages: ["GitHub Spark"],
  },
  {
    title: "Blackjack Simulation",
    description: "Simulates a huge number of Blackjack hands.",
    projectType: "builtbyai",
    topic: "gameanalysis",
    isWip: false,
    github: "https://github.com/jambolo/blackjack-simulator",
    demo: "https://blackjack-simulator--jambolo.github.app",
    languages: ["GitHub Spark"],
  },
  {
    title: "I Luv Suits Simulation",
    description: "Simulates a huge number of hands in the casino game I Luv Suits.",
    projectType: "builtbyai",
    topic: "gameanalysis",
    isWip: false,
    github: "https://github.com/jambolo/i-luv-suits",
    demo: "https://i-luv-suits-simulati--jambolo.github.app",
    languages: ["GitHub Spark"],
  },
  {
    title: "D&D Dice Rolling Simulation",
    description: "Simulates D&D dice rolling to obtain expected results.",
    projectType: "builtbyai",
    topic: "other",
    isWip: false,
    demo: "https://dd-stat-generator--jambolo.github.app",
    languages: ["GitHub Spark"],
  },
  {
    title: "Bitcoin Keys Demo",
    description: "Demonstrations of the derivations and features of Bitcoin keys.",
    projectType: "builtbyai",
    topic: "crypto",
    isWip: false,
    github: "https://github.com/jambolo/bitcoin-keys-demo",
    demo: "https://bitcoin-keys-demo--jambolo.github.app",
    languages: ["GitHub Spark"],
  },

  // WIP STATUS PROJECTS (type may be applications or libraries)
  {
    title: "Backgammon",
    description: "A backgammon-player.",
    projectType: "applications",
    topic: "gameai",
    isWip: true,
    github: "https://github.com/jambolo/Backgammon",
    languages: ["C++"],
  },
  {
    title: "Beast",
    description: "A boolean expression simplifier.",
    projectType: "libraries",
    topic: "algorithms",
    isWip: true,
    github: "https://github.com/jambolo/Beast",
    languages: ["C++"],
  },
  {
    title: "bitcoin-keys-demo-cs",
    description: "Demonstrations of the derivations and features of Bitcoin keys.",
    projectType: "applications",
    topic: "crypto",
    isWip: true,
    github: "https://github.com/jambolo/bitcoin-keys-demo-cs",
    languages: ["CoffeeScript"],
  },
  {
    title: "BloomFilter",
    description: "A generic bloom filter.",
    projectType: "libraries",
    topic: "algorithms",
    isWip: true,
    github: "https://github.com/jambolo/BloomFilter",
    docs: "docs/BloomFilter/html/index.html",
    languages: ["C++"],
  },
  {
    title: "Chess",
    description: "A chess-player.",
    projectType: "applications",
    topic: "gameai",
    isWip: true,
    github: "https://github.com/jambolo/Chess",
    languages: ["C++"],
  },
  {
    title: "confetti-demo",
    description: "A test bed for the Confetti particle system library.",
    projectType: "applications",
    topic: "graphics",
    isWip: true,
    github: "https://github.com/jambolo/confetti-demo",
    languages: ["C"],
  },
  {
    title: "Confetti",
    description: "A Vulkan-based particle system.",
    projectType: "libraries",
    topic: "graphics",
    isWip: true,
    github: "https://github.com/jambolo/Confetti",
    docs: "docs/Confetti/html/index.html",
    languages: ["C++"],
  },
  {
    title: "ConfettiMachine",
    description: "A particle system construction kit using the Confetti library.",
    projectType: "libraries",
    topic: "graphics",
    isWip: true,
    github: "https://github.com/jambolo/ConfettiMachine",
    languages: ["C++"],
  },
  {
    title: "Equity",
    description: "An implementation of a Bitcoin node.",
    projectType: "libraries",
    topic: "crypto",
    isWip: true,
    github: "https://github.com/jambolo/Equity",
    docs: "docs/equity/html/index.html",
    languages: ["C++"],
  },
  {
    title: "NameGenerator",
    description: "Generates random names.",
    projectType: "applications",
    topic: "other",
    isWip: true,
    github: "https://github.com/jambolo/NameGenerator",
    languages: ["C++"],
  },
  {
    title: "StateMachine",
    description: "A generic state machine implementation.",
    projectType: "libraries",
    topic: "algorithms",
    isWip: true,
    github: "https://github.com/jambolo/StateMachine",
    languages: ["C++"],
  },
  {
    title: "Tsunami",
    description: "A go-player.",
    projectType: "applications",
    topic: "gameai",
    isWip: true,
    github: "https://github.com/jambolo/Tsunami",
    languages: ["C++"],
  },
  {
    title: "vktutorial",
    description: "Exploring Vulkan tutorial implementations.",
    projectType: "applications",
    topic: "graphics",
    isWip: true,
    github: "https://github.com/jambolo/vktutorial",
    languages: ["C"],
  },
  {
    title: "Vkx",
    description: "Extensions to the Vulkan library.",
    projectType: "libraries",
    topic: "graphics",
    isWip: true,
    github: "https://github.com/jambolo/Vkx",
    docs: "docs/Vkx/html/index.html",
    languages: ["C++"],
  },
];

const categoryColors = {
  aoc: "#00D96F",
  gameai: "#00D9FF",
  crypto: "#FF6B35",
  algorithms: "#B537F2",
  devtools: "#1E88E5",
  gameanalysis: "#FF8F00",
  graphics: "#26A69A",
  other: "#607D8B",
};

const topicLabels = {
  aoc: "Advent of Code",
  gameai: "Game AI & Theory",
  crypto: "Cryptography & Bitcoin",
  algorithms: "Algorithms & Data Structures",
  devtools: "Development Tools",
  gameanalysis: "Game Analysis",
  graphics: "Computer Graphics",
  other: "Other",
};

const activeFilters = {
  type: "all",
  topic: "all",
  status: "all",
};

function matchesAllFilters(project) {
  const typeMatch = activeFilters.type === "all" || project.projectType === activeFilters.type;
  const topicMatch = activeFilters.topic === "all" || project.topic === activeFilters.topic;
  const statusMatch =
    activeFilters.status === "all" ||
    (activeFilters.status === "wip" && project.isWip === true);

  return typeMatch && topicMatch && statusMatch;
}

function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  const filtered = projectsData.filter((project) => matchesAllFilters(project));

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "projects-empty";
    empty.textContent = "No projects match the selected filters.";
    grid.appendChild(empty);
    return;
  }

  filtered.forEach((project) => {
    const card = createProjectCard(project);
    grid.appendChild(card);
  });
}

function safeUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url, location.href);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return url;
  } catch (_) { /* relative path */ }
  // Allow relative paths (no protocol)
  if (/^[^:]*$/.test(url)) return url;
  return null;
}

function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";

  card.style.setProperty("--category-color", categoryColors[project.topic] || "#607D8B");

  const languages = (project.languages || [])
    .map((lang) => `<span class="project-language">${lang}</span>`)
    .join("");

  const status = project.isWip
    ? '<span class="project-status">Work in Progress</span>'
    : "";

  let links = "";
  const githubUrl = safeUrl(project.github);
  if (githubUrl) {
    links += `<a href="${githubUrl}" class="project-link" target="_blank" rel="noopener">GitHub</a>`;
  }
  const demoUrl = safeUrl(project.demo);
  if (demoUrl) {
    links += `<a href="${demoUrl}" class="project-link" target="_blank" rel="noopener">Live Demo</a>`;
  }
  const docsUrl = safeUrl(project.docs);
  if (docsUrl) {
    links += `<a href="${docsUrl}" class="project-link" target="_blank" rel="noopener">Docs</a>`;
  }
  const crateUrl = safeUrl(project.crate);
  if (crateUrl) {
    links += `<a href="${crateUrl}" class="project-link" target="_blank" rel="noopener">crates.io</a>`;
  }

  card.innerHTML = `
    <span class="project-category">${topicLabels[project.topic] || "Other"}</span>
    <h3 class="project-title">${project.title}</h3>
    ${status}
    <p class="project-description">${project.description}</p>
    <div class="project-meta">${languages}</div>
    <div class="project-links">${links}</div>
  `;

  return card;
}

function initializeFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.filterGroup;
      const value = btn.dataset.filter;
      if (!group) {
        return;
      }

      activeFilters[group] = value;

      const groupButtons = document.querySelectorAll(`.filter-btn[data-filter-group="${group}"]`);
      groupButtons.forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");

      renderProjects();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  initializeFilters();
});
