// ================= THEME TOGGLE =================

const themeToggleBtn = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    if (themeToggleBtn) {
        themeToggleBtn.checked = true;
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("change", () => {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
}


// ================= VISITOR NAME STATE =================

const visitorNameInput = document.getElementById("visitorName");
const saveNameBtn = document.getElementById("saveNameBtn");
const greetingMessage = document.getElementById("greetingMessage");

const savedVisitorName = localStorage.getItem("visitorName");

if (savedVisitorName && greetingMessage) {
    greetingMessage.textContent = `Welcome back, ${savedVisitorName}!`;
    if (visitorNameInput) {
        visitorNameInput.value = savedVisitorName;
    }
}

if (saveNameBtn) {
    saveNameBtn.addEventListener("click", () => {
        const name = visitorNameInput.value.trim();

        if (name === "") {
            greetingMessage.textContent = "Please enter your name first.";
            return;
        }

        localStorage.setItem("visitorName", name);
        greetingMessage.textContent = `Welcome, ${name}!`;
    });
}


// ================= CONTACT FORM VALIDATION =================

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name === "" || email === "" || message === "") {
            formMessage.textContent = "Please fill in all fields.";
            formMessage.style.color = "red";
            return;
        }

        if (!emailPattern.test(email)) {
            formMessage.textContent = "Please enter a valid email address.";
            formMessage.style.color = "red";
            return;
        }

        formMessage.textContent = "Message submitted successfully.";
        formMessage.style.color = "green";

        contactForm.reset();
    });
}


// ================= PROJECT SEARCH / FILTER / SORT =================

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortProjects = document.getElementById("sortProjects");
const projectsGrid = document.querySelector(".projects-grid");
const noResultsMessage = document.getElementById("noResultsMessage");
const loadingMessage = document.getElementById("loadingMessage");

let projectCards = Array.from(document.querySelectorAll(".project-card"));

function updateProjects() {
    if (!projectsGrid) return;

    loadingMessage.classList.remove("hidden");

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortProjects.value;

    let visibleCards = [...projectCards];

    // Filter by category
    if (selectedCategory !== "all") {
        visibleCards = visibleCards.filter(card =>
            card.dataset.category === selectedCategory
        );
    }

    // Search filter
    visibleCards = visibleCards.filter(card =>
        card.textContent.toLowerCase().includes(searchText)
    );

    // Sorting
    if (selectedSort === "az") {
        visibleCards.sort((a, b) => {
            const titleA = a.querySelector("h3").textContent.toLowerCase();
            const titleB = b.querySelector("h3").textContent.toLowerCase();
            return titleA.localeCompare(titleB);
        });
    }

    if (selectedSort === "za") {
        visibleCards.sort((a, b) => {
            const titleA = a.querySelector("h3").textContent.toLowerCase();
            const titleB = b.querySelector("h3").textContent.toLowerCase();
            return titleB.localeCompare(titleA);
        });
    }

    // Hide all
    projectCards.forEach(card => {
        card.style.display = "none";
    });

    // Show filtered
    visibleCards.forEach(card => {
        card.style.display = "block";
        projectsGrid.appendChild(card);
    });

    if (visibleCards.length === 0) {
        noResultsMessage.classList.remove("hidden");
    } else {
        noResultsMessage.classList.add("hidden");
    }

    loadingMessage.classList.add("hidden");
}

if (searchInput) {
    searchInput.addEventListener("input", updateProjects);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", updateProjects);
}

if (sortProjects) {
    sortProjects.addEventListener("change", updateProjects);
}


// ================= GITHUB API =================

const repoList = document.getElementById("repoList");
const repoLoadingMessage = document.getElementById("repoLoadingMessage");
const repoErrorMessage = document.getElementById("repoErrorMessage");

const githubUsername = "memnt01F";

async function loadGitHubRepos() {

    if (!repoList) return;

    try {
        repoLoadingMessage.classList.remove("hidden");
        repoErrorMessage.classList.add("hidden");

        const response = await fetch(
            `https://api.github.com/users/${githubUsername}/repos`
        );

        if (!response.ok) {
            throw new Error("API failed");
        }

        const repos = await response.json();

        repoLoadingMessage.classList.add("hidden");

        const topRepos = repos.slice(0, 6);

        topRepos.forEach(repo => {

            const repoCard = document.createElement("div");
            repoCard.classList.add("repo-card");

            repoCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || "No description available."}</p>
                <a href="${repo.html_url}" target="_blank">
                    View Repository
                </a>
            `;

            repoList.appendChild(repoCard);

        });

    } catch (error) {

        repoLoadingMessage.classList.add("hidden");
        repoErrorMessage.classList.remove("hidden");

    }
}

loadGitHubRepos();


// ================= SCROLL PROGRESS BAR =================

window.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const scrollPercent =
        (scrollTop / scrollHeight) * 100;

    const progressBar =
        document.getElementById("progressBar");

    if (progressBar) {
        progressBar.style.width =
            scrollPercent + "%";
    }

});
