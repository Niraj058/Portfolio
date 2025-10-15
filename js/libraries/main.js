let portfolio = {
  currentSection: "hero",
  spheres: {},
  currentFilter: "all",
  allProjects: [],
  allCategories: [],
  data: {
    config: null,
    about: null,
    projects: null,
    contact: null,
  },
};

// Load JSON data
async function loadContent() {
  try {
    // Load all data files
    const [config, about, projects, contact] = await Promise.all([
      fetch("data/config.json")
        .then((r) => r.json())
        .catch(() => null),
      fetch("data/about.json")
        .then((r) => r.json())
        .catch(() => null),
      fetch("data/projects.json")
        .then((r) => r.json())
        .catch(() => null),
      fetch("data/contact.json")
        .then((r) => r.json())
        .catch(() => null),
    ]);

    portfolio.data = { config, about, projects, contact };

    // Update content
    updateContent();
  } catch (error) { }
}

// Slide-up fade title alternating animation
function startAlternatingTitles(titleElement, titles) {
  if (!titles || titles.length <= 1) return;

  let currentIndex = 0;

  function showNextTitle() {
    const nextIndex = (currentIndex + 1) % titles.length;
    const nextText = titles[nextIndex];

    // Slide out current title (up and fade)
    titleElement.classList.add("slide-out");

    setTimeout(() => {
      // Change text and prepare for slide in
      titleElement.textContent = nextText;
      titleElement.classList.remove("slide-out");
      titleElement.classList.add("slide-in");

      // Force reflow to ensure the slide-in class is applied
      titleElement.offsetHeight;

      // Remove slide-in to trigger the slide up animation
      setTimeout(() => {
        titleElement.classList.remove("slide-in");
        currentIndex = nextIndex;
      }, 50);
    }, 500); // Wait for slide-out animation to complete
  }

  // Start the alternating cycle after initial load
  setTimeout(() => {
    setInterval(showNextTitle, 3000); // Change every 3 seconds
  }, 2000); // Wait 2 seconds before starting
}

// Time update function for header
function startTimeUpdate(timezone) {
  function updateTime() {
    const timeElement = document.getElementById("time-text");
    const mobileTimeElement = document.getElementById("mobile-time-text");

    if (timeElement || mobileTimeElement) {
      const now = new Date();
      // Convert to specified timezone offset
      const utcOffset = parseInt(timezone.replace("UTC", ""));
      const localTime = new Date(
        now.getTime() + utcOffset * 60 * 60 * 1000
      );
      const timeString = localTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      if (timeElement) timeElement.textContent = timeString;
      if (mobileTimeElement) mobileTimeElement.textContent = timeString;
    }
  }

  // Update immediately and then every minute
  updateTime();
  setInterval(updateTime, 60000);
}

function updateContent() {
  const { config, about, projects, contact } = portfolio.data;

  console.log("Updating content with data:", portfolio.data);

  // Update page title and meta
  if (config && config.site) {
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
      pageTitle.textContent = `${config.site.title} - ${config.site.description.split(".")[0]
        }`;
    }
  }

  // Update hero section
  if (config && config.hero) {
    console.log("Updating hero section with:", config.hero);
    const heroSubtitle = document.getElementById("hero-subtitle");
    if (heroSubtitle && config.hero.subtitle)
      heroSubtitle.textContent = config.hero.subtitle;

    const heroTitle = document.getElementById("hero-title");
    if (heroTitle) {
      // Set initial title
      heroTitle.textContent =
        config.hero.title || config.hero.alternatingTitles[0];

      // Start alternating titles if available
      if (
        config.hero.alternatingTitles &&
        config.hero.alternatingTitles.length > 1
      ) {
        startAlternatingTitles(heroTitle, config.hero.alternatingTitles);
      }
    }

    const heroTagline = document.getElementById("hero-tagline");
    if (heroTagline && config.hero.tagline)
      heroTagline.textContent = config.hero.tagline;
  }

  // Update header section
  if (config && config.header) {
    console.log("Updating header with:", config.header);

    // Update logo
    const headerLogo = document.getElementById("header-logo");
    if (headerLogo && config.header.logo) {
      headerLogo.textContent = config.header.logo;
    }

    // Update status badge
    if (config.header.status) {
      const statusText = document.getElementById("status-text");
      const statusDot = document.getElementById("status-dot");
      const mobileStatusText =
        document.getElementById("mobile-status-text");
      const mobileStatusDot =
        document.getElementById("mobile-status-dot");

      if (statusText) statusText.textContent = config.header.status.text;
      if (mobileStatusText)
        mobileStatusText.textContent = config.header.status.text;

      if (statusDot) {
        statusDot.classList.toggle(
          "unavailable",
          !config.header.status.available
        );
      }
      if (mobileStatusDot) {
        mobileStatusDot.classList.toggle(
          "unavailable",
          !config.header.status.available
        );
      }
    }

    // Update location badge
    if (config.header.location) {
      const locationText = document.getElementById("location-text");
      const timezoneText = document.getElementById("timezone-text");
      const mobileLocationText = document.getElementById(
        "mobile-location-text"
      );
      const mobileTimezoneText = document.getElementById(
        "mobile-timezone-text"
      );

      if (locationText) {
        locationText.textContent = `${config.header.location.city}, ${config.header.location.country}`;
      }
      if (mobileLocationText) {
        mobileLocationText.textContent = `${config.header.location.city}, ${config.header.location.country}`;
      }
      if (timezoneText) {
        timezoneText.textContent = config.header.location.timezone;
      }
      if (mobileTimezoneText) {
        mobileTimezoneText.textContent = config.header.location.timezone;
      }

      // Start the time update for the location
      startTimeUpdate(config.header.location.timezone);
    }
  }

  // Update about section
  if (about) {
    console.log("Updating about section with:", about);
    const aboutTitle = document.getElementById("about-title");
    if (aboutTitle && about.title) aboutTitle.textContent = about.title;

    const desc = document.getElementById("about-description");
    if (desc && about.description) desc.textContent = about.description;

    const skills = document.getElementById("skills-list");
    if (skills && about.skills)
      skills.textContent = about.skills.join(", ");

    const exp = document.getElementById("experience");
    if (exp && about.experience) exp.textContent = about.experience;

    const loc = document.getElementById("location");
    if (loc && about.location) loc.textContent = about.location;
  }

  // Update work section
  if (config && config.work) {
    const workTitle = document.getElementById("work-title");
    if (workTitle && config.work.title)
      workTitle.textContent = config.work.title;

    const workDesc = document.getElementById("work-description");
    if (workDesc && config.work.description)
      workDesc.textContent = config.work.description;
  }

  if (projects && projects.projects) {
    // Store all projects and categories
    portfolio.allProjects = projects.projects;
    portfolio.allCategories = projects.categories || [];

    // Render category filters
    renderCategoryFilters(portfolio.allCategories);

    // Render all projects
    renderProjects(portfolio.allProjects);
  }

  // Update contact section
  if (contact) {
    console.log("Updating contact section with:", contact);
    const contactTitle = document.getElementById("contact-title");
    if (contactTitle && contact.title)
      contactTitle.textContent = contact.title;

    const contactDesc = document.getElementById("contact-description");
    if (contactDesc && contact.description)
      contactDesc.textContent = contact.description;

    const contactEmail = document.getElementById("contact-email");
    if (contactEmail && contact.email)
      contactEmail.textContent = contact.email;

    // Render contact CTAs (callToAction.primary / secondary) into #contact-ctas
    try {
      const ctasContainer = document.getElementById("contact-ctas");
      if (ctasContainer) {
        // Clear existing CTAs
        ctasContainer.innerHTML = "";

        const ctaData = contact.callToAction || {};

        // Helper to create a CTA button
        function createCta(btnData, primary = false) {
          if (!btnData || !btnData.text) return null;
          const a = document.createElement("a");
          a.className = primary ? "btn btn-primary" : "btn btn-secondary";
          a.textContent = btnData.text;
          const href = btnData.link || "#";
          a.href = href;
          // Open external http(s) links in new tab
          a.target = href && href.startsWith("http") ? "_blank" : "_self";
          a.setAttribute("role", "button");
          if (btnData.color) {
            const baseBackground = btnData.color;
            const baseBorder = btnData.borderColor || baseBackground;
            const baseText = btnData.textColor || "#ffffff";
            a.style.backgroundColor = baseBackground;
            a.style.borderColor = baseBorder;
            a.style.color = baseText;
            if (
              btnData.hoverColor ||
              btnData.hoverBorderColor ||
              btnData.hoverTextColor
            ) {
              const hoverBackground = btnData.hoverColor || baseBackground;
              const hoverBorder = btnData.hoverBorderColor || hoverBackground;
              const hoverText = btnData.hoverTextColor || baseText;
              const applyHoverStyles = () => {
                a.style.backgroundColor = hoverBackground;
                a.style.borderColor = hoverBorder;
                a.style.color = hoverText;
              };
              const resetStyles = () => {
                a.style.backgroundColor = baseBackground;
                a.style.borderColor = baseBorder;
                a.style.color = baseText;
              };
              a.addEventListener("mouseenter", applyHoverStyles);
              a.addEventListener("focus", applyHoverStyles);
              a.addEventListener("mouseleave", resetStyles);
              a.addEventListener("blur", resetStyles);
            }
          }

          // Only make the CTA open the modal when it's a placeholder or '#'
          // Mailto and http links will behave normally and not open the modal
          const shouldOpenModal = !btnData.link || btnData.link === "#";
          if (shouldOpenModal && primary) {
            a.classList.add("project-toggle");
          }

          return a;
        }

        const primary = createCta(ctaData.primary, true);
        const secondary = createCta(ctaData.secondary, false);

        if (primary) ctasContainer.appendChild(primary);
        if (secondary) ctasContainer.appendChild(secondary);
      }
    } catch (e) {
      console.warn("Failed to render contact CTAs", e);
    }
  }
}

// Create environment stars (separate from sphere) - optimized
function createEnvironmentStars(scene, config, isLightSection = false) {
  const stars = [];

  for (let i = 0; i < config.starCount; i++) {
    // Create star with variable size - use lower polygon count
    const starSize =
      config.starSizeMin +
      Math.random() * (config.starSizeMax - config.starSizeMin);
    const starGeometry = new THREE.SphereGeometry(starSize, 6, 6); // Reduced from 8,8 to 6,6
    const starMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff, // Always white, CSS filter will handle color changes
      transparent: true,
      opacity: Math.random() * 0.7 + 0.3, // Opacity range 0.3 to 1.0
    });

    const star = new THREE.Mesh(starGeometry, starMaterial);

    // Position stars in a large sphere around the entire scene
    const distance =
      config.starDistanceMin +
      Math.random() * (config.starDistanceMax - config.starDistanceMin);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    star.position.x = distance * Math.sin(phi) * Math.cos(theta);
    star.position.y = distance * Math.sin(phi) * Math.sin(theta);
    star.position.z = distance * Math.cos(phi);

    // Add animation data
    star.userData = {
      originalOpacity: starMaterial.opacity,
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: config.twinkleSpeed * (0.5 + Math.random()),
      originalPosition: star.position.clone(),
    };

    scene.add(star);
    stars.push(star);
  }

  return stars;
}

function renderCategoryFilters(categories) {
  const filterContainer = document.getElementById("category-filter");
  if (!filterContainer || !categories) return;

  // Keep the "All" button and add category buttons
  const allButton = filterContainer.querySelector('[data-filter="all"]');

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "filter-btn";
    button.setAttribute("data-filter", category.id);
    button.textContent = category.name;

    button.addEventListener("click", () => filterProjects(category.id));

    filterContainer.appendChild(button);
  });

  // Add event listener to "All" button
  if (allButton) {
    allButton.addEventListener("click", () => filterProjects("all"));
  }
}

function filterProjects(categoryId) {
  portfolio.currentFilter = categoryId;

  // Update active button
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-filter") === categoryId) {
      btn.classList.add("active");
    }
  });

  // Filter and render projects
  let filteredProjects;
  if (categoryId === "all") {
    filteredProjects = portfolio.allProjects;
  } else {
    filteredProjects = portfolio.allProjects.filter(
      (project) =>
        project.categories && project.categories.includes(categoryId)
    );
  }

  renderProjects(filteredProjects);
  updateProjectCount(
    filteredProjects.length,
    portfolio.allProjects.length,
    categoryId
  );

  // Reset carousel position when filtering
  carouselState.currentIndex = 0;
  carouselState.currentTranslate = 0;
  carouselState.prevTranslate = 0;
}

function updateProjectCount(filtered, total, category) {
  const countElement = document.getElementById("project-count");
  if (!countElement) return;

  if (category === "all") {
    countElement.textContent = `Showing all ${total} projects`;
  } else {
    const categoryName =
      portfolio.allCategories.find((cat) => cat.id === category)?.name ||
      category;
    countElement.textContent = `Showing ${filtered} of ${total} projects in ${categoryName}`;
  }
}

function renderProjects(projects) {
  const track = document.getElementById("projects-track");
  if (!track || !projects) return;

  track.innerHTML = "";

  if (projects.length === 0) {
    track.innerHTML =
      '<div class="no-projects-message">No projects found in this category.</div>';
    return;
  }

  // Detect if mobile
  const isMobile = window.innerWidth <= 768;

  projects.forEach((project, index) => {
    const projectCard = document.createElement("div");
    projectCard.className = "swiper-slide project-card animate-in";
    projectCard.style.animationDelay = `${index * 0.1}s`;
    projectCard.setAttribute(
      "data-categories",
      project.categories ? project.categories.join(",") : ""
    );

    // Project categories badges
    const categoriesBadges = project.categories
      ? project.categories
        .map((catId) => {
          const category = portfolio.allCategories.find(
            (cat) => cat.id === catId
          );
          return `<span class="category-badge">${category ? category.name : catId
            }</span>`;
        })
        .join("")
      : "";

    // Create project links HTML
    const projectLinksHTML = `
            <div class="project-links">
              ${project.link && project.link !== "#"
        ? `<a href="${project.link}" target="_blank" class="project-link primary-link">View Project</a>`
        : ""
      }
              ${project.github
        ? `<a href="${project.github}" target="_blank" class="project-link secondary-link">GitHub</a>`
        : ""
      }
            </div>
          `;

    if (isMobile) {
      // Mobile version - always show content, no hover needed
      projectCard.innerHTML = `
                <div class="project-image-container">
                    <img src="${project.thumbnail}" alt="${project.title
        }" class="project-image" />
                    <div class="project-badges">
                        ${categoriesBadges}
                    </div>
                    <div class="project-overlay">
                        <div class="project-overlay-content">
                            <h3 class="project-title">${project.title}</h3>
                            <div class="project-technologies">
                                ${project.technologies
          ? project.technologies
            .map(
              (tech) =>
                `<span class="tech-badge">${typeof tech === "string"
                  ? tech
                  : tech.name
                }</span>`
            )
            .join("")
          : '<span class="text-muted">N/A</span>'
        }
                            </div>
                            <div class="project-year">Year: ${project.year || "N/A"
        }</div>
                        </div>
                    </div>
                </div>
            `;
    } else {
      // Desktop version - hover overlay
      projectCard.innerHTML = `
                <div class="project-image-container">
                    <img src="${project.thumbnail}" alt="${project.title
        }" class="project-image" />
                    <div class="project-badges">
                        ${categoriesBadges}
                    </div>
                    <div class="project-overlay">
                        <div class="project-overlay-content">
                            <h3 class="project-title">${project.title}</h3>
                            <div class="project-technologies">
                                ${project.technologies
          ? project.technologies
            .map(
              (tech) =>
                `<span class="tech-badge">${typeof tech === "string"
                  ? tech
                  : tech.name
                }</span>`
            )
            .join("")
          : '<span class="text-muted">N/A</span>'
        }
                            </div>
                            <div class="project-year">Year: ${project.year || "N/A"
        }</div>
                        </div>
                    </div>
                </div>
            `;
    }

    // Click handler to open modal
    projectCard.addEventListener("click", (e) => {
      // Prevent opening modal if clicking on action buttons
      if (e.target.closest(".project-link")) {
        return;
      }
      openProjectModal(project);
    });

    // Also add cursor pointer style
    projectCard.style.cursor = "pointer";

    track.appendChild(projectCard);
  });

  // Initialize Swiper after rendering
  initializeSwiper();
}

// Swiper instance
let projectsSwiper = null;

function initializeSwiper() {
  // Destroy existing swiper if it exists
  if (projectsSwiper) {
    projectsSwiper.destroy(true, true);
  }

  // Initialize new Swiper
  projectsSwiper = new Swiper("#projects-swiper", {
    // Responsive breakpoints
    slidesPerView: 1,
    spaceBetween: 20,
    centeredSlides: false,
    loop: false,
    watchOverflow: true,
    watchSlidesProgress: true,

    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: false,
      },
      768: {
        slidesPerView: 1.2,
        spaceBetween: 30,
        centeredSlides: false,
      },
      1024: {
        slidesPerView: 2.5,
        spaceBetween: 30,
        centeredSlides: false,
      },
      1200: {
        slidesPerView: 3.2,
        spaceBetween: 30,
        centeredSlides: false,
      },
    },

    // Navigation arrows
    navigation: {
      nextEl: ".projects-next",
      prevEl: ".projects-prev",
    },

    // Touch gestures
    touchRatio: 1,
    touchAngle: 45,
    grabCursor: true,

    // Smooth transitions
    speed: 400,

    // Auto height
    autoHeight: false,

    // Keyboard control
    keyboard: {
      enabled: true,
    },

    // Mouse wheel
    mousewheel: {
      forceToAxis: true,
    },
  });

  console.log(
    "Swiper initialized with",
    projectsSwiper.slides.length,
    "slides"
  );
}

// Initialize single traveling sphere
function init3D() {
  if (typeof THREE === "undefined") {
    return;
  }

  // Create the traveling sphere
  createTravelingSphere();
  setupScrollSphereAnimation();

  // Debug: Check if sphere container was created
  const sphereContainer = document.getElementById(
    "traveling-sphere-container"
  );
  if (sphereContainer) {
  } else {
  }
}

function testSimpleSphere() {
  // Create visible container
  const testContainer = document.createElement("div");
  testContainer.id = "test-sphere";
  testContainer.style.cssText = `
          position: fixed;
          top: 100px;
          right: 100px;
          width: 200px;
          height: 200px;
          background: rgba(255, 0, 0, 0.3);
          border: 2px solid red;
          border-radius: 50%;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        `;
  testContainer.textContent = "TEST SPHERE";
  document.body.appendChild(testContainer);

  if (typeof THREE !== "undefined") {
    try {
      // Create THREE.js scene in the container
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });

      renderer.setSize(200, 200);
      renderer.setClearColor(0x000000, 0);
      testContainer.appendChild(renderer.domElement);

      // Create a simple sphere
      const geometry = new THREE.SphereGeometry(50, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      camera.position.z = 150;

      // Animate
      function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.x += 0.005; // Reduced from 0.01
        sphere.rotation.y += 0.005; // Reduced from 0.01
        renderer.render(scene, camera);
      }
      animate();
    } catch (error) { }
  } else {
  }
}

function createTravelingSphere() {
  // Performance detection
  const isLowEndDevice =
    window.innerWidth <= 768 ||
    navigator.hardwareConcurrency <= 2 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  console.log(
    `Creating sphere with performance mode: ${isLowEndDevice ? "LOW-END" : "HIGH-END"
    }`
  );

  // Create main container for the sphere (fixed to viewport)
  const sphereContainer = document.createElement("div");
  sphereContainer.id = "traveling-sphere-container";
  sphereContainer.className = "traveling-sphere-container";
  document.body.appendChild(sphereContainer);

  // Create THREE.js scene
  const scene = new THREE.Scene();

  // Configuration for environment - adaptive based on device performance
  const envConfig = {
    starCount: isLowEndDevice
      ? 150
      : window.innerWidth <= 768
        ? 250
        : 500,
    starSizeMin: 0.5,
    starSizeMax: isLowEndDevice ? 1.5 : 2,
    starDistanceMin: 2000,
    starDistanceMax: isLowEndDevice ? 3500 : 4000,
    twinkleSpeed: isLowEndDevice ? 0.0003 : 0.0005,
  };

  // Calculate sphere size with performance considerations
  const isMobile = window.innerWidth <= 768;
  const sphereSize = isLowEndDevice
    ? isMobile
      ? 375
      : 600
    : isMobile
      ? 450
      : 900;

  // Create environment stars (separate from sphere) - optimized
  function createEnvironmentStars(scene, config, isLightSection = false) {
    const stars = [];

    for (let i = 0; i < config.starCount; i++) {
      // Create star with variable size - use lower polygon count
      const starSize =
        config.starSizeMin +
        Math.random() * (config.starSizeMax - config.starSizeMin);
      const starGeometry = new THREE.SphereGeometry(starSize, 6, 6); // Reduced from 8,8 to 6,6
      const starMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, // Always white, CSS filter will handle color changes
        transparent: true,
        opacity: Math.random() * 0.7 + 0.3, // Opacity range 0.3 to 1.0
      });

      const star = new THREE.Mesh(starGeometry, starMaterial);

      // Position stars in a large sphere around the entire scene
      const distance =
        config.starDistanceMin +
        Math.random() * (config.starDistanceMax - config.starDistanceMin);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      star.position.x = distance * Math.sin(phi) * Math.cos(theta);
      star.position.y = distance * Math.sin(phi) * Math.sin(theta);
      star.position.z = distance * Math.cos(phi);

      // Add animation data
      star.userData = {
        originalOpacity: starMaterial.opacity,
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: config.twinkleSpeed * (0.5 + Math.random()),
        originalPosition: star.position.clone(),
      };

      scene.add(star);
      stars.push(star);
    }

    return stars;
  }

  // Determine if this is a light section based on container parent
  let isLightSection = false;
  const parentSection = sphereContainer.closest(".section");
  if (parentSection) {
    isLightSection = parentSection.classList.contains("light-theme");
  }

  // Create environment stars (independent of sphere)
  const environmentStars = createEnvironmentStars(
    scene,
    envConfig,
    isLightSection
  );

  // Use OrthographicCamera to eliminate perspective distortion
  const frustumSize = Math.max(sphereSize * 1.5, 1000); // Size of the orthographic frustum
  const aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2, // left
    (frustumSize * aspect) / 2, // right
    frustumSize / 2, // top
    frustumSize / -2, // bottom
    1, // near
    10000 // far
  );

  // Use WebGLRenderer with performance optimizations
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: window.innerWidth > 768, // Disable antialiasing on mobile for performance
    powerPreference: "low-power", // Use integrated GPU if available
    precision: "mediump", // Use medium precision for better performance
  });

  // Set renderer to fullscreen size
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // Performance optimizations
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
  renderer.shadowMap.enabled = false; // Disable shadows for performance
  sphereContainer.appendChild(renderer.domElement);

  // Adaptive particle count based on device performance
  const particleCount = isLowEndDevice
    ? 200
    : window.innerWidth <= 768
      ? 300
      : 600;
  const particles = [];
  const lines = [];

  // Create particles using simple SpriteMaterial (compatible with old THREE.js)
  const particleMaterial = new THREE.SpriteMaterial({
    color: 0x000000, // Start with black for white hero section
    transparent: true,
    opacity: 0.8,
  });

  for (let i = 0; i < particleCount; i++) {
    // Use lower polygon count geometry for particles
    const particleSize = sphereSize * 0.003; // Adjusted for fixed pixel sizes
    const geometry = new THREE.SphereGeometry(particleSize, 4, 4); // Reduced from 6,6 to 4,4
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff, // Start with white for black hero section
      transparent: true,
      opacity: 0.8,
    });
    const particle = new THREE.Mesh(geometry, material);

    // Position particles on sphere surface
    particle.position.x = Math.random() * 2 - 1;
    particle.position.y = Math.random() * 2 - 1;
    particle.position.z = Math.random() * 2 - 1;
    particle.position.normalize();
    particle.position.multiplyScalar(
      Math.random() * 15 + sphereSize * 0.4
    );

    // Store original data for animation with reduced complexity
    particle.userData = {
      originalPosition: particle.position.clone(),
      baseRadius: particle.position.length(),
      sphericalCoords: {
        radius: particle.position.length(),
        phi: Math.atan2(particle.position.y, particle.position.x),
        theta: Math.acos(
          particle.position.z / particle.position.length()
        ),
      },
      animationOffset: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.001 + 0.0005, // Reduced speed for smoother animation
      // Physics properties optimized for performance
      velocity: new THREE.Vector3(2, 2, 0.5), // Reduced velocity
      acceleration: new THREE.Vector3(2, 2, 0), // Reduced acceleration
      mass: Math.random() * 0.4 + 0.1, // Lighter particles
      drag: Math.random() * 0.008 + 0.004, // Slightly increased drag for stability
      hasExploded: false,
      explosionTime: 0,
      bounceCount: 0,
      maxBounces: Math.floor(Math.random() * 3) + 2, // Fewer bounces (2-4)
      explosionForce: Math.random() * 80 + 40, // Reduced explosion force (40-120)
      glowFactor: Math.random() * 0.3 + 1.2, // Reduced glow intensity
    };

    scene.add(particle);
    particles.push(particle);
  }

  // Create connecting lines with adaptive count for performance
  const lineCount = sphere.isLowEndDevice ? 50 : (window.innerWidth <= 768 ? 100 : 200);
  for (let i = 0; i < lineCount; i++) {
    // start and end points
    const start = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    start.normalize().multiplyScalar(sphereSize * 0.4);
    const end = start.clone().multiplyScalar(Math.random() * 0.3 + 1);

    // buffer geometry with 2 points
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: Math.random() * 0.3 + 0.1,
      transparent: true,
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    lines.push(line);
  }

  // Position camera for fullscreen view
  camera.position.set(0, 0, sphereSize * 1.2); // Closer since orthographic doesn't need perspective distance
  camera.lookAt(0, 0, 0); // Look at sphere center

  // Debug: Log camera and stars info

  if (environmentStars.length > 0) {
  }

  // Store sphere data globally with performance settings
  portfolio.travelingSphere = {
    scene,
    camera,
    renderer,
    particles,
    lines,
    environmentStars, // Add environment stars to sphere object
    envConfig, // Add configuration for easy access
    container: sphereContainer,
    currentSection: "hero",
    targetCameraPosition: { x: 0, y: 0, z: sphereSize * 1.2 }, // Camera target for orthographic
    currentCameraPosition: { x: 0, y: 0, z: sphereSize * 1.2 }, // Current camera position for orthographic
    previousCameraPosition: { x: 0, y: 0, z: sphereSize * 1.2 }, // For velocity calculation
    sphereSize: sphereSize,
    size: sphereSize, // Also store as 'size' for resize handler compatibility
    isTransitioning: false,
    rollRotation: 0,
    mouseInfluence: { x: 0, y: 0 }, // Mouse influence for camera rotation
    isBeingHeld: false, // Track if sphere is being clicked/held
    holdStartTime: null, // When the hold started
    isShaking: false, // Nervous shake state
    isExploding: false, // Explosion state
    currentFilter: false, // Track current filter state (false = normal, true = inverted)
    // Performance optimization properties
    lastRenderTime: 0,
    performanceMode: isLowEndDevice
      ? "low-end"
      : window.innerWidth <= 768
        ? "mobile"
        : "desktop",
    frameSkipCounter: 0,
    isLowEndDevice: isLowEndDevice,
  };

  // Start animation loop
  animateTravelingSphere();

  // Set initial position
  updateSpherePosition("hero", false);
}

// Function to update environment star count dynamically
function updateStarCount(newCount) {
  const sphere = portfolio.travelingSphere;
  if (!sphere) {
    return;
  }

  console.log(
    `Updating star count from ${sphere.envConfig.starCount} to ${newCount}`
  );

  // Remove existing environment stars
  if (sphere.environmentStars) {
    sphere.environmentStars.forEach((star) => {
      sphere.scene.remove(star);
      if (star.geometry) star.geometry.dispose();
      if (star.material) star.material.dispose();
    });
  }

  // Update configuration
  sphere.envConfig.starCount = newCount;

  // Determine current section theme
  const currentSectionElement = document.querySelector(
    `#${portfolio.currentSection}`
  );
  const isLightSection = currentSectionElement
    ? currentSectionElement.classList.contains("light-theme")
    : false;

  // Create new environment stars with updated count
  sphere.environmentStars = createEnvironmentStars(
    sphere.scene,
    sphere.envConfig,
    isLightSection
  );
}

// Expose star count control to global scope for easy access
window.setStarCount = updateStarCount;

function animateTravelingSphere() {
  const sphere = portfolio.travelingSphere;
  if (!sphere) {
    return;
  }

  requestAnimationFrame(animateTravelingSphere);

  // Performance optimization: Adaptive frame skipping based on device capability
  const now = performance.now();
  const frameSkip = sphere.isLowEndDevice
    ? 3
    : window.innerWidth <= 768
      ? 2
      : 1;
  const targetFrameTime = 16.67 * frameSkip; // 20fps for low-end, 30fps for mobile, 60fps for desktop

  if (now - (sphere.lastRenderTime || 0) < targetFrameTime) {
    return;
  }
  sphere.lastRenderTime = now;

  // Animate particles with adaptive optimization
  const particleSkip = sphere.isLowEndDevice
    ? 3
    : window.innerWidth <= 768
      ? 2
      : 1;
  sphere.particles.forEach((particle, index) => {
    // Skip particles for performance on low-end devices
    if (index % particleSkip !== 0) return;

    const time = now * particle.userData.speed * 0.001; // Use performance.now for consistency
    const offset = particle.userData.animationOffset;

    // Handle explosion effect for particles with realistic physics
    if (sphere.isExploding) {
      const explosionProgress =
        (Date.now() - sphere.explosionStartTime) / 4000; // 4 second explosion for physics

      if (explosionProgress < 1) {
        const userData = particle.userData;

        // Initialize explosion physics on first frame
        if (!userData.hasExploded) {
          userData.hasExploded = true;
          userData.explosionTime = Date.now();

          // Calculate explosion force from center of sphere
          const sphereCenter = new THREE.Vector3(0, 0, 0);
          const direction = particle.position
            .clone()
            .sub(sphereCenter)
            .normalize();

          // Random explosion force based on distance and particle mass
          const baseForce = (Math.random() * 80 + 40) / userData.mass; // Stronger force for lighter particles
          const randomness = new THREE.Vector3(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
          );

          // Set initial velocity (explosion force + randomness)
          userData.velocity = direction
            .multiplyScalar(baseForce)
            .add(randomness);

          console.log(
            `Particle ${index} exploded with velocity:`,
            userData.velocity
          );
        }

        // Apply physics forces
        const deltaTime = 0.016; // ~60fps
        const gravity = new THREE.Vector3(0, -50, 0); // Downward gravity
        const wind = new THREE.Vector3(
          Math.sin(Date.now() * 0.001) * 5,
          0,
          Math.cos(Date.now() * 0.001) * 5
        ); // Subtle wind effect

        // Calculate forces
        userData.acceleration.copy(gravity);
        userData.acceleration.add(wind);

        // Air resistance (drag force opposite to velocity)
        const dragForce = userData.velocity
          .clone()
          .multiplyScalar(-userData.drag);
        userData.acceleration.add(dragForce);

        // Update velocity: v = v + a*t
        userData.velocity.add(
          userData.acceleration.clone().multiplyScalar(deltaTime)
        );

        // Update position: p = p + v*t
        const displacement = userData.velocity
          .clone()
          .multiplyScalar(deltaTime);
        particle.position.add(displacement);

        // Boundary collision detection and bouncing
        const bounds = {
          minX: -window.innerWidth,
          maxX: window.innerWidth,
          minY: -window.innerHeight,
          maxY: window.innerHeight * 0.3, // Floor higher up
          minZ: -1000,
          maxZ: 1000,
        };

        // Bounce off boundaries with energy loss
        if (
          particle.position.x < bounds.minX ||
          particle.position.x > bounds.maxX
        ) {
          userData.velocity.x *= -0.7; // Bounce with energy loss
          userData.bounceCount++;
          particle.position.x = Math.max(
            bounds.minX,
            Math.min(bounds.maxX, particle.position.x)
          );
        }

        if (particle.position.y < bounds.minY) {
          userData.velocity.y *= -0.6; // Floor bounce with more energy loss
          userData.bounceCount++;
          particle.position.y = bounds.minY;

          // Add some random horizontal scatter on floor impact
          userData.velocity.x += (Math.random() - 0.5) * 20;
          userData.velocity.z += (Math.random() - 0.5) * 20;
        }

        if (
          particle.position.z < bounds.minZ ||
          particle.position.z > bounds.maxZ
        ) {
          userData.velocity.z *= -0.7;
          userData.bounceCount++;
          particle.position.z = Math.max(
            bounds.minZ,
            Math.min(bounds.maxZ, particle.position.z)
          );
        }

        // Golden glow effect during explosion
        particle.material.color.setHex(0xffd700);
        particle.material.opacity = Math.max(
          0.9 - explosionProgress * 0.6,
          0.1
        );

        // Scale particles based on velocity for motion blur effect
        const speed = userData.velocity.length();
        const glowScale = 1 + Math.min(speed * 0.01, 2);
        particle.scale.set(glowScale, glowScale, glowScale);

        // Fade out after too many bounces or low velocity
        if (userData.bounceCount > userData.maxBounces || speed < 5) {
          particle.material.opacity *= 0.98;
          userData.velocity.multiplyScalar(0.95); // Gradual stop
        }
      } else {
        // Explosion finished, hide the particle
        particle.visible = false;
      }
      return;
    }

    // Base position from stored original
    const userData = particle.userData;
    let basePos = userData.originalPosition.clone();

    // Always apply rolling rotation (it naturally decays when not transitioning)
    if (sphere.rollRotation && Math.abs(sphere.rollRotation) > 0.001) {
      const axis = new THREE.Vector3(0, 1, 0);
      basePos.applyAxisAngle(axis, sphere.rollRotation);
    }

    // Mouse interaction - rotate sphere with cursor in X and Y axis (constrained)
    if (sphere.mouseInfluence) {
      // Constrained rotation - limit the maximum rotation angles
      const maxRotationX = Math.PI / 6; // 30 degrees max rotation on X-axis (up/down)
      const maxRotationY = Math.PI / 4; // 45 degrees max rotation on Y-axis (left/right)

      // Calculate constrained rotations based on mouse influence
      const mouseRotationY = sphere.mouseInfluence.x * maxRotationY; // Horizontal rotation (left/right)
      const mouseRotationX = sphere.mouseInfluence.y * maxRotationX; // Vertical rotation (up/down)

      // Apply rotations in order: Y-axis first (left/right), then X-axis (up/down)
      basePos.applyAxisAngle(new THREE.Vector3(0, 1, 0), mouseRotationY); // Horizontal
      basePos.applyAxisAngle(new THREE.Vector3(1, 0, 0), mouseRotationX); // Vertical
    }

    // Add violent shake if being held for more than 1 second
    if (sphere.isShaking && sphere.isBeingHeld) {
      const holdDuration = (Date.now() - sphere.holdStartTime) / 1000;
      const shakeIntensity = Math.min(holdDuration, 3) * 2.5; // More violent shaking

      // Violent random shaking
      basePos.x += (Math.random() - 0.5) * shakeIntensity * 2;
      basePos.y += (Math.random() - 0.5) * shakeIntensity * 2;
      basePos.z += (Math.random() - 0.5) * shakeIntensity * 2;

      // Golden glow effect when shaking intensely
      if (holdDuration > 1.5) {
        particle.material.color.setHex(0xffd700); // Golden color
        particle.material.opacity =
          0.9 + Math.sin(Date.now() * 0.01) * 0.1; // Pulsing glow

        // Scale particles for glow effect
        const glowScale = 1 + Math.sin(Date.now() * 0.008) * 0.3;
        particle.scale.set(glowScale, glowScale, glowScale);
      } else {
        // Reset to normal appearance
        particle.material.color.setHex(0xffffff);
        particle.material.opacity = 0.8;
        particle.scale.set(1, 1, 1);
      }
    } else {
      // Reset to normal appearance when not shaking
      particle.material.color.setHex(0xffffff);
      particle.material.opacity = 0.8;
      particle.scale.set(1, 1, 1);
    }

    // Gentle floating animation (reduced when transitioning)
    const floatIntensity = sphere.isTransitioning ? 0.3 : 1.0;
    particle.position.x =
      basePos.x + Math.sin(time + offset) * 3 * floatIntensity;
    particle.position.y =
      basePos.y + Math.cos(time + offset * 1.1) * 3 * floatIntensity;
    particle.position.z =
      basePos.z + Math.sin(time * 0.5 + offset) * 3 * floatIntensity;
  });

  // Animate environment stars (twinkling effect) - adaptive optimization
  if (sphere.environmentStars && sphere.environmentStars.length > 0) {
    const starSkip = sphere.isLowEndDevice
      ? 4
      : window.innerWidth <= 768
        ? 3
        : 2;
    sphere.environmentStars.forEach((star, index) => {
      // Skip stars for performance on low-end devices
      if (index % starSkip !== 0) return;

      const time = now * 0.001;
      const userData = star.userData;

      // Create twinkling effect by varying opacity (simplified calculation)
      const twinkle =
        Math.sin(time * userData.twinkleSpeed + userData.twinkleOffset) *
        0.2 +
        0.8;
      star.material.opacity = userData.originalOpacity * twinkle;

      // Remove subtle movement on low-end devices for performance
      if (!sphere.isLowEndDevice && window.innerWidth > 768) {
        const subtleMovement =
          Math.sin(time * 0.0003 + userData.twinkleOffset) * 0.3;
        star.position.x = userData.originalPosition.x + subtleMovement;
        star.position.y =
          userData.originalPosition.y + subtleMovement * 0.5;
      }
    });
  }

  // Animate lines to grow randomly and rotate with sphere
  sphere.lines.forEach((line, index) => {
    const time = Date.now() * 0.001;
    const lineData = line.userData || {};

    // Initialize line growth data if not exists
    if (!lineData.growthPhase) {
      lineData.growthPhase = Math.random() * Math.PI * 2;
      lineData.growthSpeed = Math.random() * 0.002 + 0.001;
      lineData.originalStart = null; // Store original start position
      lineData.originalEnd = null; // Store original end position
      // Physics properties for realistic explosion
      lineData.startVelocity = new THREE.Vector3(0, 0, 0);
      lineData.endVelocity = new THREE.Vector3(0, 0, 0);
      lineData.startAcceleration = new THREE.Vector3(0, 0, 0);
      lineData.endAcceleration = new THREE.Vector3(0, 0, 0);
      lineData.hasExploded = false;
      lineData.explosionTime = 0;
      lineData.mass = Math.random() * 0.5 + 0.3; // Lighter than particles
      lineData.drag = Math.random() * 0.015 + 0.005;
      line.userData = lineData;
    }

    // Handle explosion effect with realistic physics for lines
    if (sphere.isExploding) {
      const explosionProgress =
        (Date.now() - sphere.explosionStartTime) / 4000; // 4 second explosion

      if (
        explosionProgress < 1 &&
        line.geometry &&
        line.geometry.vertices &&
        line.geometry.vertices.length >= 2
      ) {
        // Initialize explosion physics on first frame
        if (!lineData.hasExploded) {
          lineData.hasExploded = true;
          lineData.explosionTime = Date.now();

          // Store original positions if not already stored
          if (!lineData.originalStart) {
            lineData.originalStart = line.geometry.vertices[0].clone();
            lineData.originalEnd = line.geometry.vertices[1].clone();
          }

          // Calculate explosion forces for both endpoints
          const sphereCenter = new THREE.Vector3(0, 0, 0);

          // Start point explosion
          const startDirection = lineData.originalStart
            .clone()
            .sub(sphereCenter)
            .normalize();
          const startForce = (Math.random() * 60 + 30) / lineData.mass;
          const startRandomness = new THREE.Vector3(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25
          );
          lineData.startVelocity = startDirection
            .multiplyScalar(startForce)
            .add(startRandomness);

          // End point explosion (slightly different force for realistic breaking)
          const endDirection = lineData.originalEnd
            .clone()
            .sub(sphereCenter)
            .normalize();
          const endForce = (Math.random() * 60 + 30) / lineData.mass;
          const endRandomness = new THREE.Vector3(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25
          );
          lineData.endVelocity = endDirection
            .multiplyScalar(endForce)
            .add(endRandomness);

          console.log(
            `Line ${index} exploded with start velocity:`,
            lineData.startVelocity
          );
        }

        // Apply physics to both endpoints
        const deltaTime = 0.016;
        const gravity = new THREE.Vector3(0, -40, 0);
        const wind = new THREE.Vector3(
          Math.sin(Date.now() * 0.001) * 3,
          0,
          Math.cos(Date.now() * 0.001) * 3
        );

        // Update start point
        lineData.startAcceleration.copy(gravity).add(wind);
        const startDrag = lineData.startVelocity
          .clone()
          .multiplyScalar(-lineData.drag);
        lineData.startAcceleration.add(startDrag);
        lineData.startVelocity.add(
          lineData.startAcceleration.clone().multiplyScalar(deltaTime)
        );

        const startDisplacement = lineData.startVelocity
          .clone()
          .multiplyScalar(deltaTime);
        line.geometry.vertices[0].add(startDisplacement);

        // Update end point
        lineData.endAcceleration.copy(gravity).add(wind);
        const endDrag = lineData.endVelocity
          .clone()
          .multiplyScalar(-lineData.drag);
        lineData.endAcceleration.add(endDrag);
        lineData.endVelocity.add(
          lineData.endAcceleration.clone().multiplyScalar(deltaTime)
        );

        const endDisplacement = lineData.endVelocity
          .clone()
          .multiplyScalar(deltaTime);
        line.geometry.vertices[1].add(endDisplacement);

        // Boundary collision for line endpoints
        const bounds = {
          minX: -window.innerWidth,
          maxX: window.innerWidth,
          minY: -window.innerHeight,
          maxY: window.innerHeight * 0.3,
          minZ: -1000,
          maxZ: 1000,
        };

        // Bounce start point
        if (
          line.geometry.vertices[0].x < bounds.minX ||
          line.geometry.vertices[0].x > bounds.maxX
        ) {
          lineData.startVelocity.x *= -0.6;
          line.geometry.vertices[0].x = Math.max(
            bounds.minX,
            Math.min(bounds.maxX, line.geometry.vertices[0].x)
          );
        }
        if (line.geometry.vertices[0].y < bounds.minY) {
          lineData.startVelocity.y *= -0.5;
          line.geometry.vertices[0].y = bounds.minY;
        }
        if (
          line.geometry.vertices[0].z < bounds.minZ ||
          line.geometry.vertices[0].z > bounds.maxZ
        ) {
          lineData.startVelocity.z *= -0.6;
          line.geometry.vertices[0].z = Math.max(
            bounds.minZ,
            Math.min(bounds.maxZ, line.geometry.vertices[0].z)
          );
        }

        // Bounce end point
        if (
          line.geometry.vertices[1].x < bounds.minX ||
          line.geometry.vertices[1].x > bounds.maxX
        ) {
          lineData.endVelocity.x *= -0.6;
          line.geometry.vertices[1].x = Math.max(
            bounds.minX,
            Math.min(bounds.maxX, line.geometry.vertices[1].x)
          );
        }
        if (line.geometry.vertices[1].y < bounds.minY) {
          lineData.endVelocity.y *= -0.5;
          line.geometry.vertices[1].y = bounds.minY;
        }
        if (
          line.geometry.vertices[1].z < bounds.minZ ||
          line.geometry.vertices[1].z > bounds.maxZ
        ) {
          lineData.endVelocity.z *= -0.6;
          line.geometry.vertices[1].z = Math.max(
            bounds.minZ,
            Math.min(bounds.maxZ, line.geometry.vertices[1].z)
          );
        }

        line.geometry.verticesNeedUpdate = true;

        // Golden glow effect for lines during explosion
        line.material.color.setHex(0xffd700);

        // Calculate line speed for opacity effect
        const avgSpeed =
          (lineData.startVelocity.length() +
            lineData.endVelocity.length()) /
          2;
        line.material.opacity = Math.max(
          0.8 - explosionProgress * 0.5,
          0.1
        );

        // Break lines if they stretch too far
        const lineLength = line.geometry.vertices[0].distanceTo(
          line.geometry.vertices[1]
        );
        const originalLength = lineData.originalStart.distanceTo(
          lineData.originalEnd
        );
        if (lineLength > originalLength * 3) {
          // Line broke, fade it out faster
          line.material.opacity *= 0.95;
        }
      } else {
        // Explosion finished, hide the line
        line.visible = false;
      }
      return;
    }

    // Store original positions if not stored
    if (
      line.geometry &&
      line.geometry.vertices &&
      line.geometry.vertices.length >= 2
    ) {
      if (lineData.originalStart === null) {
        lineData.originalStart = line.geometry.vertices[0].clone();
        lineData.originalEnd = line.geometry.vertices[1].clone();
      }

      // Start with original positions
      let startPos = lineData.originalStart.clone();
      let endPos = lineData.originalEnd.clone();

      // Always apply rolling rotation (it naturally decays when not transitioning)
      if (sphere.rollRotation && Math.abs(sphere.rollRotation) > 0.001) {
        const axis = new THREE.Vector3(0, 1, 0);
        startPos.applyAxisAngle(axis, sphere.rollRotation);
        endPos.applyAxisAngle(axis, sphere.rollRotation);
      }

      // Apply sphere rotation to line start and end points with X and Y axis (constrained)
      if (sphere.mouseInfluence) {
        // Constrained rotation - same limits as particles
        const maxRotationX = Math.PI / 6; // 30 degrees max rotation on X-axis (up/down)
        const maxRotationY = Math.PI / 4; // 45 degrees max rotation on Y-axis (left/right)

        // Calculate constrained rotations based on mouse influence
        const mouseRotationY = sphere.mouseInfluence.x * maxRotationY; // Horizontal rotation (left/right)
        const mouseRotationX = sphere.mouseInfluence.y * maxRotationX; // Vertical rotation (up/down)

        // Apply rotations in order to both start and end points: Y-axis first, then X-axis
        startPos.applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          mouseRotationY
        ); // Horizontal
        startPos.applyAxisAngle(
          new THREE.Vector3(1, 0, 0),
          mouseRotationX
        ); // Vertical
        endPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), mouseRotationY); // Horizontal
        endPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), mouseRotationX); // Vertical
      }

      // Add violent shake to lines if sphere is shaking
      if (sphere.isShaking && sphere.isBeingHeld) {
        const holdDuration = (Date.now() - sphere.holdStartTime) / 1000;
        const shakeIntensity = Math.min(holdDuration, 3) * 1.5; // More violent shaking for lines

        startPos.x += (Math.random() - 0.5) * shakeIntensity;
        startPos.y += (Math.random() - 0.5) * shakeIntensity;
        startPos.z += (Math.random() - 0.5) * shakeIntensity;

        endPos.x += (Math.random() - 0.5) * shakeIntensity;
        endPos.y += (Math.random() - 0.5) * shakeIntensity;
        endPos.z += (Math.random() - 0.5) * shakeIntensity;

        // Golden glow effect for lines when shaking intensely
        if (holdDuration > 1.5) {
          line.material.color.setHex(0xffd700); // Golden color
          line.material.opacity = 0.9 + Math.sin(Date.now() * 0.01) * 0.1; // Pulsing glow
        } else {
          // Reset to normal appearance
          line.material.color.setHex(0xffffff);
          line.material.opacity = 0.4;
        }
      } else {
        // Reset to normal appearance when not shaking
        line.material.color.setHex(0xffffff);
        line.material.opacity = 0.4;
      }

      // Calculate growth factor for alive feeling
      const growthFactor =
        1.0 +
        Math.sin(time * lineData.growthSpeed + lineData.growthPhase) *
        0.1;

      // Apply growth from start point (origin)
      const direction = endPos.clone().sub(startPos).normalize();
      const originalLength = lineData.originalStart.distanceTo(
        lineData.originalEnd
      );
      const newLength = originalLength * growthFactor;

      endPos = startPos.clone().add(direction.multiplyScalar(newLength));

      // Update line geometry
      line.geometry.vertices[0].copy(startPos);
      line.geometry.vertices[1].copy(endPos);
      line.geometry.verticesNeedUpdate = true;
    }
  });

  // Smoothly interpolate camera position instead of sphere position
  const lerpSpeed = 0.05;
  const cameraPositionDelta =
    Math.abs(
      sphere.targetCameraPosition.x - sphere.currentCameraPosition.x
    ) +
    Math.abs(
      sphere.targetCameraPosition.y - sphere.currentCameraPosition.y
    ) +
    Math.abs(
      sphere.targetCameraPosition.z - sphere.currentCameraPosition.z
    );

  // Check if transitioning (moving to new position) - use smaller threshold for more gradual transition
  sphere.isTransitioning = cameraPositionDelta > 1;

  // Interpolate camera position first
  sphere.currentCameraPosition.x +=
    (sphere.targetCameraPosition.x - sphere.currentCameraPosition.x) *
    lerpSpeed;
  sphere.currentCameraPosition.y +=
    (sphere.targetCameraPosition.y - sphere.currentCameraPosition.y) *
    lerpSpeed;
  sphere.currentCameraPosition.z +=
    (sphere.targetCameraPosition.z - sphere.currentCameraPosition.z) *
    lerpSpeed;

  // Apply mouse influence to the interpolated position before velocity calculation
  let currentCameraX = sphere.currentCameraPosition.x;
  let currentCameraY = sphere.currentCameraPosition.y;
  let currentCameraZ = sphere.currentCameraPosition.z;

  // Mouse influence no longer affects camera position - only sphere rotation
  // Camera stays in its interpolated position for section transitions

  // Calculate movement velocity for natural deceleration (including mouse influence)
  const previousPosition = sphere.previousCameraPosition || {
    x: currentCameraX,
    y: currentCameraY,
    z: currentCameraZ,
  };

  const velocity = Math.abs(
    currentCameraX -
    previousPosition.x +
    (currentCameraY - previousPosition.y) +
    (currentCameraZ - previousPosition.z)
  );

  // Store current position (with mouse influence) for next frame velocity calculation
  sphere.previousCameraPosition = {
    x: currentCameraX,
    y: currentCameraY,
    z: currentCameraZ,
  };

  // Update roll rotation with velocity-based deceleration for natural feel
  if (sphere.isTransitioning) {
    // Still moving between sections - maintain rotation speed
    sphere.rollRotation += 0.015; // Reduced from 0.03
  } else {
    // Calculate deceleration based on actual movement velocity
    const minVelocity = 0.001; // Minimum velocity to consider "moving"
    const velocityFactor = Math.min(velocity * 20, 1); // Scale velocity to rotation influence

    if (velocity > minVelocity) {
      // Still has momentum - continue rotating but slow down based on velocity
      const rotationSpeed = 0.005 + velocityFactor * 0.01; // Reduced from 0.01 + 0.02
      sphere.rollRotation += rotationSpeed;
    }

    // Always apply gradual decay for smooth stop
    sphere.rollRotation *= 0.985; // Slightly less aggressive decay for more natural feel
  }

  // Update camera position with mouse influence applied as an offset
  let finalCameraX = currentCameraX; // Use the already calculated position with mouse influence
  let finalCameraY = currentCameraY;
  let finalCameraZ = currentCameraZ;

  sphere.camera.position.set(finalCameraX, finalCameraY, finalCameraZ);
  sphere.camera.lookAt(0, 0, 0); // Always look at sphere center
  sphere.container.style.height = `${sphere.sphereSize}px`;

  sphere.renderer.render(sphere.scene, sphere.camera);
}

function updateSpherePosition(sectionId, animate = true) {
  const sphere = portfolio.travelingSphere;
  if (!sphere) return;

  // Calculate target camera position based on section
  // Keep sphere at center (0,0,0), move camera around it
  let targetX, targetY, targetZ;

  const baseDistance = sphere.sphereSize * 1.2; // Updated base distance for orthographic camera

  // Determine camera position based on section
  switch (sectionId) {
    case "hero":
      targetX = 0; // Center view
      targetY = 0;
      targetZ = baseDistance;
      break;
    case "about":
      targetX = baseDistance * 1.1; // Move camera more to the right
      targetY = baseDistance * 0.1; // Slightly up
      targetZ = baseDistance * 0.7; // Closer for more dramatic angle
      break;
    case "work":
      targetX = -baseDistance * 1.3; // Move camera more to the left
      targetY = -baseDistance * 0.1; // Slightly down
      targetZ = baseDistance * 0.7; // Closer for more dramatic angle
      break;
    case "contact":
      targetX = 0;
      targetY = 0;
      targetZ = baseDistance;
      break;
    default:
      targetX = 0;
      targetY = 0;
      targetZ = baseDistance;
  }

  console.log(`Target camera position for ${sectionId}:`, {
    targetX,
    targetY,
    targetZ,
  });

  // Update target camera position
  if (animate) {
    sphere.targetCameraPosition.x = targetX;
    sphere.targetCameraPosition.y = targetY;
    sphere.targetCameraPosition.z = targetZ;
    sphere.isTransitioning = true;
  } else {
    sphere.targetCameraPosition.x = targetX;
    sphere.targetCameraPosition.y = targetY;
    sphere.targetCameraPosition.z = targetZ;
    sphere.currentCameraPosition.x = targetX;
    sphere.currentCameraPosition.y = targetY;
    sphere.currentCameraPosition.z = targetZ;

    // IMPORTANT: Update previousCameraPosition to prevent velocity calculation errors
    sphere.previousCameraPosition = {
      x: targetX,
      y: targetY,
      z: targetZ,
    };

    sphere.camera.position.set(targetX, targetY, targetZ);
    sphere.camera.lookAt(0, 0, 0); // Always look at sphere center
    console.log(
      "Camera positioned immediately at:",
      sphere.currentCameraPosition
    );
  }

  sphere.currentSection = sectionId;
  portfolio.currentSection = sectionId; // Update global current section

  // Update sphere color for the new section
  updateSphereColor();

  // Update footer color and scroll icon
  updateFooterColor();
  updateHeaderColor();
  updateMobileToggleColor();
  updateScrollIcon();

  // Update mobile nav active state
  updateMobileNavActive();
}

function updateSphereColor() {
  const sphere = portfolio.travelingSphere;
  if (!sphere || !sphere.container) return;

  // Get canvas element
  const canvas = sphere.container.querySelector("canvas");
  if (!canvas) return;

  // Check if sphere is currently in a light section by checking current section
  const currentSectionElement = document.querySelector(
    `#${portfolio.currentSection}`
  );
  if (!currentSectionElement) return;

  const isLightSection =
    currentSectionElement.classList.contains("light-theme");

  // Apply invert filter directly to canvas
  if (isLightSection) {
    canvas.style.filter = "invert(1)";
    canvas.style.transition = "filter 0.3s ease-in-out";
  } else {
    canvas.style.filter = "invert(0)";
    canvas.style.transition = "filter 0.3s ease-in-out";
  }

  // Set opacity based on section
  if (
    portfolio.currentSection === "hero" ||
    portfolio.currentSection === "contact"
  ) {
    canvas.style.opacity = "0.5";
  } else {
    canvas.style.opacity = "1";
  }

  // Update environment star colors based on section theme
  if (sphere.environmentStars) {
    sphere.environmentStars.forEach((star) => {
      // Since canvas gets inverted on light sections, we need to account for that
      // On light sections: use white stars (will become dark after inversion)
      // On dark sections: use white stars (no inversion)
      const starColor = isLightSection ? 0xffffff : 0xffffff; // Always white, let CSS filter handle the inversion
      star.material.color.setHex(starColor);
    });
  }

  console.log(
    `Sphere color updated for section: ${portfolio.currentSection}, isLight: ${isLightSection}`
  );
}

function setupScrollSphereAnimation() {
  // Track current section with intersection observer
  const sections = document.querySelectorAll(".section");
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px 0px 0px",
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        if (sectionId !== portfolio.travelingSphere?.currentSection) {
          updateSpherePosition(sectionId, true);
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // Add additional scroll listener as backup
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentSection = Math.floor(scrollPosition / windowHeight);

      const sectionIds = ["hero", "about", "work", "contact"];
      const targetSection = sectionIds[currentSection];

      if (
        targetSection &&
        targetSection !== portfolio.travelingSphere?.currentSection
      ) {
        portfolio.currentSection = targetSection; // Update global first
        updateSpherePosition(targetSection, true);
      }
    }, 100);
  });

  // Handle manual section navigation for scroll snap
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          updateSpherePosition(targetId, true);
        }, 100);
      }
    });
  });
}

// Window resize handler
window.addEventListener("resize", () => {
  const sphere = portfolio.travelingSphere;
  if (sphere && sphere.camera && sphere.renderer) {
    // Update orthographic camera for new aspect ratio
    const frustumSize = Math.max(sphere.sphereSize * 1.5, 1000);
    const aspect = window.innerWidth / window.innerHeight;

    sphere.camera.left = (frustumSize * aspect) / -2;
    sphere.camera.right = (frustumSize * aspect) / 2;
    sphere.camera.top = frustumSize / 2;
    sphere.camera.bottom = frustumSize / -2;
    sphere.camera.updateProjectionMatrix();

    sphere.renderer.setSize(window.innerWidth, window.innerHeight);

    // Recalculate sphere size for mobile/desktop transitions
    const isMobile = window.innerWidth <= 768;
    const newSphereSize = isMobile ? 600 : 1200;

    // Store the new sphere size in both properties
    sphere.size = newSphereSize;
    sphere.sphereSize = newSphereSize;

    // Update camera frustum for new sphere size
    const newFrustumSize = Math.max(newSphereSize * 1.5, 1000);
    const newAspect = window.innerWidth / window.innerHeight;

    sphere.camera.left = (newFrustumSize * newAspect) / -2;
    sphere.camera.right = (newFrustumSize * newAspect) / 2;
    sphere.camera.top = newFrustumSize / 2;
    sphere.camera.bottom = newFrustumSize / -2;
    sphere.camera.updateProjectionMatrix();

    // Update sphere position for new viewport size
    updateSpherePosition(sphere.currentSection, false);
  }

  // Update Swiper on resize
  if (projectsSwiper) {
    projectsSwiper.update();
  }

  // Re-render projects on mobile/desktop switch
  if (portfolio.allProjects && portfolio.allProjects.length > 0) {
    const currentCategory =
      document.querySelector(".filter-btn.active")?.dataset.filter ||
      "all";
    filterProjects(currentCategory);
  }
});

// Mouse tracking for sphere rotation (constrained to viewport)
lastMouseMoveTime = Date.now();
window.addEventListener("mousemove", (e) => {
  const sphere = portfolio.travelingSphere;
  if (sphere) {
    lastMouseMoveTime = Date.now();

    // Normalize mouse position to [-1, 1] range, constrained to viewport
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    // Constrain and smooth the influence (made even smoother)
    sphere.mouseInfluence.x +=
      (mouseX * 0.3 - sphere.mouseInfluence.x) * 0.08; // Slightly increased responsiveness
    sphere.mouseInfluence.y +=
      (mouseY * 0.3 - sphere.mouseInfluence.y) * 0.08; // Smoother interpolation

    // Clamp values to prevent crazy rotation
    sphere.mouseInfluence.x = Math.max(
      -0.3,
      Math.min(0.3, sphere.mouseInfluence.x)
    );
    sphere.mouseInfluence.y = Math.max(
      -0.3,
      Math.min(0.3, sphere.mouseInfluence.y)
    );
  }
});

// Decay mouse influence when not moving mouse
setInterval(() => {
  const sphere = portfolio.travelingSphere;
  if (sphere && Date.now() - lastMouseMoveTime > 2000) {
    // After 2 seconds of no mouse movement
    sphere.mouseInfluence.x *= 0.95; // Gradually return to neutral
    sphere.mouseInfluence.y *= 0.95;
  }
}, 50);


// Make sphere containers clickable anywhere on page
document.addEventListener("mousedown", (e) => {
  const sphere = portfolio.travelingSphere;
  if (sphere && !sphere.isExploding) {
    sphere.isBeingHeld = true;
    sphere.holdStartTime = Date.now();

    console.log(
      "Sphere hold started at:",
      new Date().toLocaleTimeString()
    );

    // Start shaking after 0.5 seconds
    setTimeout(() => {
      if (sphere.isBeingHeld) {
        sphere.isShaking = true;
      }
    }, 500);

    // Explode after 3 seconds
    sphereHoldTimeout = setTimeout(() => {
      if (sphere.isBeingHeld) {
        sphere.isExploding = true;
        sphere.explosionStartTime = Date.now();
        sphere.isBeingHeld = false;
        sphere.isShaking = false;

        // Make sphere container disappear after explosion
        setTimeout(() => {
          if (sphere.container) {
            sphere.container.classList.add("fade-out");

            setTimeout(() => {
              sphere.container.classList.add("hidden");
            }, 1000);
          }
        }, 4000); // Wait for longer explosion to finish
      }
    }, 3000);
    // }
  }
});

document.addEventListener("mouseup", () => {
  const sphere = portfolio.travelingSphere;
  if (sphere) {
    sphere.isBeingHeld = false;
    sphere.isShaking = false;
    clearTimeout(sphereHoldTimeout);
  }
});

// Also handle mouse leave to prevent stuck states
document.addEventListener("mouseleave", () => {
  const sphere = portfolio.travelingSphere;
  if (sphere) {
    sphere.isBeingHeld = false;
    sphere.isShaking = false;
    clearTimeout(sphereHoldTimeout);
  }
}); // Add keyboard shortcut for testing - removed since CSS masks handle color changes

// Create toast notification
function createToastNotification() {
  // Check if toast already exists
  if (document.getElementById("interaction-toast")) {
    return;
  }

  const toast = document.createElement("div");
  toast.id = "interaction-toast";
  toast.className = "toast-notification";
  toast.innerHTML = `
          <button class="toast-close" onclick="dismissToast()">&times;</button>
          Click and hold anywhere for 3 seconds to remove distractions
        `;

  document.body.appendChild(toast);

  // Show toast after a brief delay
  setTimeout(() => {
    toast.classList.add("show");
  }, 1000);

  // Auto-hide toast after 8 seconds
  setTimeout(() => {
    dismissToast();
  }, 8000);
}

// Dismiss toast notification
function dismissToast() {
  const toast = document.getElementById("interaction-toast");
  if (toast) {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }
}

// Initialize everything
document.addEventListener("DOMContentLoaded", function () {
  // Remove any loading classes
  document.body.classList.remove("loading");
  document.body.classList.add("overflow-auto");

  // Hide any loaders
  const loaders = document.querySelectorAll(".loader, #loader");
  loaders.forEach((loader) => {
    loader.classList.add("hidden");
  });

  // Load content and initialize 3D
  loadContent().then(() => {
    init3D();
  });

  // Create and show toast notification
  setTimeout(() => {
    createToastNotification();
  }, 2000); // Show toast 2 seconds after page load
});

// Simple footer color update
function updateFooterColor() {
  const footer = document.getElementById("fixed-footer");
  if (!footer) return;

  // Remove existing theme classes
  footer.classList.remove("footer-light", "footer-dark");

  // Add appropriate class based on current section
  if (
    portfolio.currentSection === "hero" ||
    portfolio.currentSection === "work"
  ) {
    footer.classList.add("footer-dark"); // White text for dark sections
  } else {
    footer.classList.add("footer-light"); // Black text for light sections
  }
}

// Simple header color update
function updateHeaderColor() {
  const header = document.getElementById("fixed-header");
  if (!header) return;

  // Remove existing theme classes
  header.classList.remove("header-light", "header-dark");

  // Add appropriate class based on current section
  if (
    portfolio.currentSection === "hero" ||
    portfolio.currentSection === "work"
  ) {
    header.classList.add("header-dark"); // White text for dark sections
  } else {
    header.classList.add("header-light"); // Black text for light sections
  }
}

// Update mobile toggle color based on current section
function updateMobileToggleColor() {
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  if (!mobileToggle) return;

  // Remove existing theme classes
  mobileToggle.classList.remove("toggle-light", "toggle-dark");

  // Add appropriate class based on current section
  if (
    portfolio.currentSection === "hero" ||
    portfolio.currentSection === "work"
  ) {
    mobileToggle.classList.add("toggle-dark"); // White hamburger for dark sections
  } else {
    mobileToggle.classList.add("toggle-light"); // Black hamburger for light sections
  }
}

// Update scroll icon based on current section
function updateScrollIcon() {
  const scrollContainer = document.querySelector(".footer-scroll");
  if (!scrollContainer) return;

  if (portfolio.currentSection === "contact") {
    // Show arrow up for last section
    scrollContainer.innerHTML = '<div class="arrow-up"></div>';
  } else {
    // Show scroll mouse for other sections
    scrollContainer.innerHTML =
      '<div class="scroll-mouse"><div class="scroll-wheel"></div></div>';
  }
}

// Update mobile nav active state
function updateMobileNavActive() {
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.dataset.section === portfolio.currentSection) {
      link.classList.add("active");
    }
  });
}

// Simple footer functionality
function initializeFooter() {
  const navLinks = document.querySelectorAll(".footer-nav-link");

  // Handle navigation clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = link.dataset.section;

      // Update portfolio current section
      portfolio.currentSection = targetSection;

      // Update sphere position
      if (portfolio.travelingSphere) {
        updateSpherePosition(targetSection, true);
      }

      // Update footer color and active nav link
      updateFooterColor();
      updateHeaderColor();
      updateMobileToggleColor();
      updateScrollIcon();
      navLinks.forEach((navLink) => {
        navLink.classList.remove("active");
        if (navLink.dataset.section === targetSection) {
          navLink.classList.add("active");
        }
      });

      // Scroll to section smoothly
      const section = document.querySelector(`#${targetSection}`);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Handle scroll icon click (mouse for next section, arrow for top)
  const scrollMouse = document.querySelector(".footer-scroll");
  scrollMouse.addEventListener("click", () => {
    const sections = ["hero", "about", "work", "contact"];
    const currentIndex = sections.indexOf(portfolio.currentSection);

    let nextSection;
    if (portfolio.currentSection === "contact") {
      // If on last section, go to top (hero)
      nextSection = "hero";
    } else {
      // Otherwise go to next section
      const nextIndex = (currentIndex + 1) % sections.length;
      nextSection = sections[nextIndex];
    }

    // Trigger navigation to target section
    portfolio.currentSection = nextSection;

    if (portfolio.travelingSphere) {
      updateSpherePosition(nextSection, true);
    }

    // Update footer color and active nav link
    updateFooterColor();
    updateHeaderColor();
    updateMobileToggleColor();
    updateScrollIcon();
    navLinks.forEach((navLink) => {
      navLink.classList.remove("active");
      if (navLink.dataset.section === nextSection) {
        navLink.classList.add("active");
      }
    });

    const section = document.querySelector(`#${nextSection}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Set initial footer color and scroll icon
  updateFooterColor();
  updateHeaderColor();
  updateMobileToggleColor();
  updateScrollIcon();

  // Initialize mobile menu
  initializeMobileMenu();
}

// Mobile menu functionality
function initializeMobileMenu() {
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileSidebar = document.getElementById("mobile-sidebar");
  const mobileOverlay = document.getElementById("mobile-overlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  function openMobileMenu() {
    mobileToggle.classList.add("active");
    mobileToggle.classList.add("menu-open");
    mobileSidebar.classList.add("active");
    mobileOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    mobileToggle.classList.remove("active");
    mobileToggle.classList.remove("menu-open");
    mobileSidebar.classList.remove("active");
    mobileOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  // Toggle menu
  mobileToggle.addEventListener("click", () => {
    if (mobileSidebar.classList.contains("active")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close menu
  mobileOverlay.addEventListener("click", closeMobileMenu);

  // Handle mobile nav clicks
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = link.dataset.section;

      // Update portfolio current section
      portfolio.currentSection = targetSection;

      // Update sphere position
      if (portfolio.travelingSphere) {
        updateSpherePosition(targetSection, true);
      }

      // Update footer color and scroll icon
      updateFooterColor();
      updateHeaderColor();
      updateMobileToggleColor();
      updateScrollIcon();

      // Update active mobile nav link
      mobileNavLinks.forEach((navLink) => {
        navLink.classList.remove("active");
        if (navLink.dataset.section === targetSection) {
          navLink.classList.add("active");
        }
      });

      // Scroll to section smoothly
      const section = document.querySelector(`#${targetSection}`);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }

      // Close mobile menu
      closeMobileMenu();
    });
  });
}

// Initialize footer after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initializeFooter, 100); // Small delay to ensure other scripts are ready
});

// ===== PROJECT MODAL FUNCTIONALITY =====
let projectImagesSwiper = null;

function openProjectModal(project) {
  const modal = document.getElementById("project-modal");
  if (!modal) {
    return;
  }

  // Populate modal content
  populateModalContent(project);

  // Show modal
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Initialize images swiper
  initializeProjectImagesSwiper(project);
}

function closeProjectModal() {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  modal.classList.remove("active");
  document.body.style.overflow = "";

  // Destroy swiper instance
  if (projectImagesSwiper) {
    projectImagesSwiper.destroy(true, true);
    projectImagesSwiper = null;
  }
}

function populateModalContent(project) {
  // Update featured image
  const featuredImage = document.getElementById("project-featured-image");
  if (featuredImage) {
    featuredImage.src = project.thumbnail || "";
    featuredImage.alt = project.title || "Project Image";
  }

  // Update title
  const title = document.getElementById("project-modal-title");
  if (title) {
    title.textContent = project.title || "Project Title";
  }

  // Update category
  const category = document.getElementById("project-modal-category");
  if (category && project.categories && project.categories.length > 0) {
    const categoryName =
      portfolio.allCategories.find(
        (cat) => cat.id === project.categories[0]
      )?.name || project.categories[0];
    category.textContent = categoryName;
  }

  // Update client
  const client = document.getElementById("project-modal-client");
  if (client) {
    client.textContent = project.client || "Client Name";
  }

  // Update role
  const role = document.getElementById("project-modal-role");
  if (role) {
    role.textContent = project.role || "Design & Development";
  }

  // Update year
  const year = document.getElementById("project-modal-year");
  if (year) {
    year.textContent = project.year || new Date().getFullYear();
  }

  // Update description
  const description = document.getElementById(
    "project-modal-description"
  );
  if (description) {
    description.textContent =
      project.fullDescription ||
      project.description ||
      "Project description will be displayed here.";
  }

  // Update technologies with devicon icons
  const techContainer = document.getElementById(
    "project-modal-technologies"
  );
  if (techContainer && project.technologies) {
    techContainer.innerHTML = "";
    project.technologies.forEach((tech) => {
      const techIcon = document.createElement("div");
      techIcon.className = "tech-icon";
      techIcon.setAttribute("data-tooltip", tech.name);

      const icon = document.createElement("i");
      icon.className = tech.icon || "devicon-javascript-plain";

      techIcon.appendChild(icon);
      techContainer.appendChild(techIcon);
    });
  }

  // Update CTA buttons
  const ctaContainer = document.getElementById("project-modal-cta");
  if (ctaContainer) {
    let ctaHTML = "";
    if (project.link && project.link !== "#") {
      ctaHTML += `<a href="${project.link}" target="_blank" class="project-cta-btn primary">
            Project Link
            </a>`;
    }
    if (project.github) {
      ctaHTML += `<a href="${project.github}" target="_blank" class="project-cta-btn secondary">
              <i class="devicon-github-original"></i>Project Link
            </a>`;
    }
    ctaContainer.innerHTML = ctaHTML;
  }
}

function initializeProjectImagesSwiper(project) {
  // Create image slides
  const imagesTrack = document.getElementById("project-images-track");
  if (!imagesTrack) return;

  imagesTrack.innerHTML = "";

  // Add project images - for now we'll use the thumbnail and create placeholder slides
  // In a real implementation, you'd have multiple images for each project
  const images = project.images || [project.thumbnail];

  images.forEach((imageSrc) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    // Check if it's a video
    if (imageSrc.includes(".mp4") || imageSrc.includes(".webm")) {
      slide.innerHTML = `<video src="${imageSrc}" loop controls autoplay muted></video>`;
    } else {
      slide.innerHTML = `<img src="${imageSrc}" alt="${project.title}" />`;
    }

    imagesTrack.appendChild(slide);
  });

  // Initialize Swiper
  projectImagesSwiper = new Swiper(".project-images-swiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: images.length > 1,
    navigation: {
      nextEl: ".project-images-swiper .swiper-button-next",
      prevEl: ".project-images-swiper .swiper-button-prev",
    },
    pagination: {
      el: ".project-images-swiper .swiper-pagination",
      clickable: true,
    },
    keyboard: {
      enabled: true,
    },
  });
}

// Modal event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Close button
  const closeBtn = document.querySelector(".project-modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeProjectModal);
  }

  // Overlay click
  const overlay = document.querySelector(".project-modal-overlay");
  if (overlay) {
    overlay.addEventListener("click", closeProjectModal);
  }

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProjectModal();
    }
  });
});

// Project form modal: move existing .project-form-card into modal on open
document.addEventListener("DOMContentLoaded", () => {
  const formModal = document.getElementById("project-form-modal");
  const modalOverlay = document.getElementById("form-modal-overlay");
  const modalBody = document.getElementById("form-modal-body");
  const modalClose = document.getElementById("form-modal-close");
  const formCard = document.querySelector(".project-form-card");

  // If the form is hard-coded in the modal, we don't need to move it.
  if (!formModal || !modalBody || !formCard) return;

  // Focus trap helpers
  let lastFocusedElement = null;
  function trapFocus(container) {
    const focusable = container.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return () => { };
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleKey(e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }

  let removeTrap = null;
  let triggerElement = null;

  function openFormModal(trigger) {
    triggerElement = trigger || null;
    lastFocusedElement = document.activeElement;

    // Show with animation class (form is already in modal markup)
    formModal.setAttribute("aria-hidden", "false");
    formModal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Trap focus inside modal
    removeTrap = trapFocus(formModal);
    const firstInput = formModal.querySelector('input, select, textarea, button, a[href]');
    if (firstInput) firstInput.focus();
  }

  function closeFormModal() {
    // Hide with animation
    formModal.classList.remove("show");
    formModal.setAttribute("aria-hidden", "true");

    // Remove focus trap
    if (removeTrap) {
      removeTrap();
      removeTrap = null;
    }

    document.body.style.overflow = "auto";

    // Return focus to the element that opened the modal
    if (triggerElement && typeof triggerElement.focus === "function") {
      triggerElement.focus();
    } else if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  // Delegated handler for .project-toggle clicks (works for dynamic CTAs)
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest && e.target.closest(".project-toggle");
    if (!toggle) return;
    // If the toggle has a real href (mailto/http) let it behave normally
    const href = toggle.getAttribute("href") || "";
    const isPlaceholder = !href || href === "#";
    if (!isPlaceholder) return; // leave normal links alone

    e.preventDefault();
    openFormModal(toggle);
  });

  // Overlay click closes
  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeFormModal);
  }

  // Close button
  if (modalClose) {
    modalClose.addEventListener("click", closeFormModal);
  }

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // If the project modal (slideshow) is open, prefer closing that one first
      const projectModal = document.getElementById("project-modal");
      if (projectModal && projectModal.classList.contains("active")) return;
      closeFormModal();
    }
  });
});

// Fallback to toggle visual state for custom inputs when :has() is not available
document.addEventListener("DOMContentLoaded", () => {
  // radios
  document.querySelectorAll('.custom-radio input[type="radio"]').forEach((r) => {
    const parent = r.closest('.custom-radio');
    function update() {
      if (!parent) return;
      if (r.checked) parent.classList.add('selected');
      else parent.classList.remove('selected');
    }
    r.addEventListener('change', () => {
      // clear other radios in the same name group
      document.querySelectorAll('input[name="' + r.name + '"]').forEach((other) => {
        const p = other.closest('.custom-radio');
        if (p) p.classList.toggle('selected', other.checked);
      });
    });
    // init
    update();
  });

  // checkboxes
  document.querySelectorAll('.custom-checkbox input[type="checkbox"]').forEach((c) => {
    const parent = c.closest('.custom-checkbox');
    function update() {
      if (!parent) return;
      parent.classList.toggle('selected', c.checked);
    }
    c.addEventListener('change', update);
    update();
  });
});


document
  .getElementById("project-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "full-name",
      document.getElementById("full-name").value
    );
    formData.append("email", document.getElementById("email").value);
    formData.append(
      "design",
      document.querySelector("input[name=design]:checked")?.value || ""
    );
    formData.append(
      "cms",
      document.querySelector("input[name=cms]:checked")?.value || ""
    );
    formData.append(
      "frontend",
      document.getElementById("frontend").value
    );

    // Optional toppings
    document
      .querySelectorAll("input[name='toppings[]']:checked")
      .forEach((cb) => {
        formData.append("toppings[]", cb.value);
      });
    formData.append(
      "_wpcf7_unit_tag",
      "wpcf7-f" + "15" + "-837"
    );
    formData.append("message", document.getElementById("message").value);

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : "Submit";

    function setStatus(text, disable = true) {
      if (!submitBtn) return;
      submitBtn.textContent = text;
      submitBtn.disabled = !!disable;
    }

    try {
      // show loading state
      setStatus("Sending…", true);

      const response = await fetch(
        "https://api.kitmane.com/wp-json/contact-form-7/v1/contact-forms/15/feedback",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("CF7 Response:", data);

      if (data.status === "mail_sent") {
        setStatus("✅ Sent", true);
        e.target.reset();
      } else {
        const msg = data.message || "Check required fields";
        setStatus("❌ " + msg, false);
      }
    } catch (err) {
      console.error("Error:", err);
      setStatus("❌ An error occurred", false);
    } finally {
      // restore button text after a short delay if it's not disabled
      setTimeout(() => {
        if (submitBtn && !submitBtn.disabled) {
          submitBtn.textContent = originalBtnText;
        }
        // If the submitBtn shows a success state (disabled), keep it for a bit then restore
        if (submitBtn && submitBtn.disabled) {
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            // optionally close modal here if desired
          }, 1500);
        }
      }, 1200);
    }
  });


// Initialize new Swiper
projectsSwiper = new Swiper("#projects-swiper", {
  // Responsive breakpoints
  slidesPerView: 1,
  spaceBetween: 20,
  centeredSlides: false,
  loop: false,
  watchOverflow: true,
  watchSlidesProgress: true,

  breakpoints: {
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
      centeredSlides: false,
    },
    768: {
      slidesPerView: 1.2,
      spaceBetween: 30,
      centeredSlides: false,
    },
    1024: {
      slidesPerView: 2.5,
      spaceBetween: 30,
      centeredSlides: false,
    },
    1200: {
      slidesPerView: 3.2,
      spaceBetween: 30,
      centeredSlides: false,
    },
  },

  // Navigation arrows
  navigation: {
    nextEl: ".projects-next",
    prevEl: ".projects-prev",
  },

  // Touch gestures
  touchRatio: 1,
  touchAngle: 45,
  grabCursor: true,

  // Smooth transitions
  speed: 400,

  // Auto height
  autoHeight: false,

  // Keyboard control
  keyboard: {
    enabled: true,
  },

  // Mouse wheel
  mousewheel: {
    forceToAxis: true,
  },
});

console.log(
  "Swiper initialized with",
  projectsSwiper.slides.length,
  "slides"
);


// Initialize single traveling sphere
function init3D() {
  if (typeof THREE === "undefined") {
    return;
  }

  // Create the traveling sphere
  createTravelingSphere();
  setupScrollSphereAnimation();

  // Debug: Check if sphere container was created
  const sphereContainer = document.getElementById(
    "traveling-sphere-container"
  );
  if (sphereContainer) {
  } else {
  }
}

function testSimpleSphere() {
  // Create visible container
  const testContainer = document.createElement("div");
  testContainer.id = "test-sphere";
  testContainer.style.cssText = `
          position: fixed;
          top: 100px;
          right: 100px;
          width: 200px;
          height: 200px;
          background: rgba(255, 0, 0, 0.3);
          border: 2px solid red;
          border-radius: 50%;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        `;
  testContainer.textContent = "TEST SPHERE";
  document.body.appendChild(testContainer);

  if (typeof THREE !== "undefined") {
    try {
      // Create THREE.js scene in the container
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });

      renderer.setSize(200, 200);
      renderer.setClearColor(0x000000, 0);
      testContainer.appendChild(renderer.domElement);

      // Create a simple sphere
      const geometry = new THREE.SphereGeometry(50, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      camera.position.z = 150;

      // Animate
      function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.x += 0.005; // Reduced from 0.01
        sphere.rotation.y += 0.005; // Reduced from 0.01
        renderer.render(scene, camera);
      }
      animate();
    } catch (error) { }
  } else {
  }
}

function createTravelingSphere() {
  // Performance detection
  const isLowEndDevice =
    window.innerWidth <= 768 ||
    navigator.hardwareConcurrency <= 2 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  console.log(
    `Creating sphere with performance mode: ${isLowEndDevice ? "LOW-END" : "HIGH-END"
    }`
  );

  // Create main container for the sphere (fixed to viewport)
  const sphereContainer = document.createElement("div");
  sphereContainer.id = "traveling-sphere-container";
  sphereContainer.className = "traveling-sphere-container";
  document.body.appendChild(sphereContainer);

  // Create THREE.js scene
  const scene = new THREE.Scene();

  // Configuration for environment - adaptive based on device performance
  const envConfig = {
    starCount: isLowEndDevice
      ? 150
      : window.innerWidth <= 768
        ? 250
        : 500,
    starSizeMin: 0.5,
    starSizeMax: isLowEndDevice ? 1.5 : 2,
    starDistanceMin: 2000,
    starDistanceMax: isLowEndDevice ? 3500 : 4000,
    twinkleSpeed: isLowEndDevice ? 0.0003 : 0.0005,
  };

  // Calculate sphere size with performance considerations
  const isMobile = window.innerWidth <= 768;
  const sphereSize = isLowEndDevice
    ? isMobile
      ? 375
      : 600
    : isMobile
      ? 450
      : 900;


  // Determine if this is a light section based on container parent
  let isLightSection = false;
  const parentSection = sphereContainer.closest(".section");
  if (parentSection) {
    isLightSection = parentSection.classList.contains("light-theme");
  }

  // Create environment stars (independent of sphere)
  const environmentStars = createEnvironmentStars(
    scene,
    envConfig,
    isLightSection
  );

  // Use OrthographicCamera to eliminate perspective distortion
  const frustumSize = Math.max(sphereSize * 1.5, 1000); // Size of the orthographic frustum
  const aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2, // left
    (frustumSize * aspect) / 2, // right
    frustumSize / 2, // top
    frustumSize / -2, // bottom
    1, // near
    10000 // far
  );

  // Use WebGLRenderer with performance optimizations
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: window.innerWidth > 768, // Disable antialiasing on mobile for performance
    powerPreference: "low-power", // Use integrated GPU if available
    precision: "mediump", // Use medium precision for better performance
  });

  // Set renderer to fullscreen size
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // Performance optimizations
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
  renderer.shadowMap.enabled = false; // Disable shadows for performance
  sphereContainer.appendChild(renderer.domElement);

  // Adaptive particle count based on device performance
  const particleCount = isLowEndDevice
    ? 200
    : window.innerWidth <= 768
      ? 300
      : 600;
  const particles = [];
  const lines = [];

  // Create particles using simple SpriteMaterial (compatible with old THREE.js)
  const particleMaterial = new THREE.SpriteMaterial({
    color: 0x000000, // Start with black for white hero section
    transparent: true,
    opacity: 0.8,
  });

  for (let i = 0; i < particleCount; i++) {
    // Use lower polygon count geometry for particles
    const particleSize = sphereSize * 0.003; // Adjusted for fixed pixel sizes
    const geometry = new THREE.SphereGeometry(particleSize, 4, 4); // Reduced from 6,6 to 4,4
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff, // Start with white for black hero section
      transparent: true,
      opacity: 0.8,
    });
    const particle = new THREE.Mesh(geometry, material);

    // Position particles on sphere surface
    particle.position.x = Math.random() * 2 - 1;
    particle.position.y = Math.random() * 2 - 1;
    particle.position.z = Math.random() * 2 - 1;
    particle.position.normalize();
    particle.position.multiplyScalar(
      Math.random() * 15 + sphereSize * 0.4
    );

    // Store original data for animation with reduced complexity
    particle.userData = {
      originalPosition: particle.position.clone(),
      baseRadius: particle.position.length(),
      sphericalCoords: {
        radius: particle.position.length(),
        phi: Math.atan2(particle.position.y, particle.position.x),
        theta: Math.acos(
          particle.position.z / particle.position.length()
        ),
      },
      animationOffset: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.001 + 0.0005, // Reduced speed for smoother animation
      // Physics properties optimized for performance
      velocity: new THREE.Vector3(2, 2, 0.5), // Reduced velocity
      acceleration: new THREE.Vector3(2, 2, 0), // Reduced acceleration
      mass: Math.random() * 0.4 + 0.1, // Lighter particles
      drag: Math.random() * 0.008 + 0.004, // Slightly increased drag for stability
      hasExploded: false,
      explosionTime: 0,
      bounceCount: 0,
      maxBounces: Math.floor(Math.random() * 3) + 2, // Fewer bounces (2-4)
      explosionForce: Math.random() * 80 + 40, // Reduced explosion force (40-120)
      glowFactor: Math.random() * 0.3 + 1.2, // Reduced glow intensity
    };

    scene.add(particle);
    particles.push(particle);
  }

  // Create connecting lines with adaptive count for performance
  const lineCount = isLowEndDevice
    ? 50
    : window.innerWidth <= 768
      ? 100
      : 200;
  for (let i = 0; i < lineCount; i++) {
    const geometry = new THREE.Geometry();

    const vertex = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
    vertex.normalize();
    vertex.multiplyScalar(sphereSize * 0.4);

    geometry.vertices.push(vertex);

    const vertex2 = vertex.clone();
    vertex2.multiplyScalar(Math.random() * 0.3 + 1);

    geometry.vertices.push(vertex2);

    const line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        color: 0xffffff, // Start with white for black hero section
        opacity: Math.random() * 0.3 + 0.1, // Reduced opacity for subtle effect
        transparent: true,
      })
    );
    scene.add(line);
    lines.push(line);
  }

  // Position camera for fullscreen view
  camera.position.set(0, 0, sphereSize * 1.2); // Closer since orthographic doesn't need perspective distance
  camera.lookAt(0, 0, 0); // Look at sphere center

  // Debug: Log camera and stars info

  if (environmentStars.length > 0) {
  }

  // Store sphere data globally with performance settings
  portfolio.travelingSphere = {
    scene,
    camera,
    renderer,
    particles,
    lines,
    environmentStars, // Add environment stars to sphere object
    envConfig, // Add configuration for easy access
    container: sphereContainer,
    currentSection: "hero",
    targetCameraPosition: { x: 0, y: 0, z: sphereSize * 1.2 }, // Camera target for orthographic
    currentCameraPosition: { x: 0, y: 0, z: sphereSize * 1.2 }, // Current camera position for orthographic
    previousCameraPosition: { x: 0, y: 0, z: sphereSize * 1.2 }, // For velocity calculation
    sphereSize: sphereSize,
    size: sphereSize, // Also store as 'size' for resize handler compatibility
    isTransitioning: false,
    rollRotation: 0,
    mouseInfluence: { x: 0, y: 0 }, // Mouse influence for camera rotation
    isBeingHeld: false, // Track if sphere is being clicked/held
    holdStartTime: null, // When the hold started
    isShaking: false, // Nervous shake state
    isExploding: false, // Explosion state
    currentFilter: false, // Track current filter state (false = normal, true = inverted)
    // Performance optimization properties
    lastRenderTime: 0,
    performanceMode: isLowEndDevice
      ? "low-end"
      : window.innerWidth <= 768
        ? "mobile"
        : "desktop",
    frameSkipCounter: 0,
    isLowEndDevice: isLowEndDevice,
  };

  // Start animation loop
  animateTravelingSphere();

  // Set initial position
  updateSpherePosition("hero", false);
}

// Function to update environment star count dynamically
function updateStarCount(newCount) {
  const sphere = portfolio.travelingSphere;
  if (!sphere) {
    return;
  }

  console.log(
    `Updating star count from ${sphere.envConfig.starCount} to ${newCount}`
  );

  // Remove existing environment stars
  if (sphere.environmentStars) {
    sphere.environmentStars.forEach((star) => {
      sphere.scene.remove(star);
      if (star.geometry) star.geometry.dispose();
      if (star.material) star.material.dispose();
    });
  }

  // Update configuration
  sphere.envConfig.starCount = newCount;

  // Determine current section theme
  const currentSectionElement = document.querySelector(
    `#${portfolio.currentSection}`
  );
  const isLightSection = currentSectionElement
    ? currentSectionElement.classList.contains("light-theme")
    : false;

  // Create new environment stars with updated count
  sphere.environmentStars = createEnvironmentStars(
    sphere.scene,
    sphere.envConfig,
    isLightSection
  );
}

// Expose star count control to global scope for easy access
window.setStarCount = updateStarCount;

function animateTravelingSphere() {
  const sphere = portfolio.travelingSphere;
  if (!sphere) {
    return;
  }

  requestAnimationFrame(animateTravelingSphere);

  // Performance optimization: Adaptive frame skipping based on device capability
  const now = performance.now();
  const frameSkip = sphere.isLowEndDevice
    ? 3
    : window.innerWidth <= 768
      ? 2
      : 1;
  const targetFrameTime = 16.67 * frameSkip; // 20fps for low-end, 30fps for mobile, 60fps for desktop

  if (now - (sphere.lastRenderTime || 0) < targetFrameTime) {
    return;
  }
  sphere.lastRenderTime = now;

  // Animate particles with adaptive optimization
  const particleSkip = sphere.isLowEndDevice
    ? 3
    : window.innerWidth <= 768
      ? 2
      : 1;
  sphere.particles.forEach((particle, index) => {
    // Skip particles for performance on low-end devices
    if (index % particleSkip !== 0) return;

    const time = now * particle.userData.speed * 0.001; // Use performance.now for consistency
    const offset = particle.userData.animationOffset;

    // Handle explosion effect for particles with realistic physics
    if (sphere.isExploding) {
      const explosionProgress =
        (Date.now() - sphere.explosionStartTime) / 4000; // 4 second explosion for physics

      if (explosionProgress < 1) {
        const userData = particle.userData;

        // Initialize explosion physics on first frame
        if (!userData.hasExploded) {
          userData.hasExploded = true;
          userData.explosionTime = Date.now();

          // Calculate explosion force from center of sphere
          const sphereCenter = new THREE.Vector3(0, 0, 0);
          const direction = particle.position
            .clone()
            .sub(sphereCenter)
            .normalize();

          // Random explosion force based on distance and particle mass
          const baseForce = (Math.random() * 80 + 40) / userData.mass; // Stronger force for lighter particles
          const randomness = new THREE.Vector3(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
          );

          // Set initial velocity (explosion force + randomness)
          userData.velocity = direction
            .multiplyScalar(baseForce)
            .add(randomness);

          console.log(
            `Particle ${index} exploded with velocity:`,
            userData.velocity
          );
        }

        // Apply physics forces
        const deltaTime = 0.016; // ~60fps
        const gravity = new THREE.Vector3(0, -50, 0); // Downward gravity
        const wind = new THREE.Vector3(
          Math.sin(Date.now() * 0.001) * 5,
          0,
          Math.cos(Date.now() * 0.001) * 5
        ); // Subtle wind effect

        // Calculate forces
        userData.acceleration.copy(gravity);
        userData.acceleration.add(wind);

        // Air resistance (drag force opposite to velocity)
        const dragForce = userData.velocity
          .clone()
          .multiplyScalar(-userData.drag);
        userData.acceleration.add(dragForce);

        // Update velocity: v = v + a*t
        userData.velocity.add(
          userData.acceleration.clone().multiplyScalar(deltaTime)
        );

        // Update position: p = p + v*t
        const displacement = userData.velocity
          .clone()
          .multiplyScalar(deltaTime);
        particle.position.add(displacement);

        // Boundary collision detection and bouncing
        const bounds = {
          minX: -window.innerWidth,
          maxX: window.innerWidth,
          minY: -window.innerHeight,
          maxY: window.innerHeight * 0.3, // Floor higher up
          minZ: -1000,
          maxZ: 1000,
        };

        // Bounce off boundaries with energy loss
        if (
          particle.position.x < bounds.minX ||
          particle.position.x > bounds.maxX
        ) {
          userData.velocity.x *= -0.7; // Bounce with energy loss
          userData.bounceCount++;
          particle.position.x = Math.max(
            bounds.minX,
            Math.min(bounds.maxX, particle.position.x)
          );
        }

        if (particle.position.y < bounds.minY) {
          userData.velocity.y *= -0.6; // Floor bounce with more energy loss
          userData.bounceCount++;
          particle.position.y = bounds.minY;

          // Add some random horizontal scatter on floor impact
          userData.velocity.x += (Math.random() - 0.5) * 20;
          userData.velocity.z += (Math.random() - 0.5) * 20;
        }

        if (
          particle.position.z < bounds.minZ ||
          particle.position.z > bounds.maxZ
        ) {
          userData.velocity.z *= -0.7;
          userData.bounceCount++;
          particle.position.z = Math.max(
            bounds.minZ,
            Math.min(bounds.maxZ, particle.position.z)
          );
        }

        // Golden glow effect during explosion
        particle.material.color.setHex(0xffd700);
        particle.material.opacity = Math.max(
          0.9 - explosionProgress * 0.6,
          0.1
        );

        // Scale particles based on velocity for motion blur effect
        const speed = userData.velocity.length();
        const glowScale = 1 + Math.min(speed * 0.01, 2);
        particle.scale.set(glowScale, glowScale, glowScale);

        // Fade out after too many bounces or low velocity
        if (userData.bounceCount > userData.maxBounces || speed < 5) {
          particle.material.opacity *= 0.98;
          userData.velocity.multiplyScalar(0.95); // Gradual stop
        }
      } else {
        // Explosion finished, hide the particle
        particle.visible = false;
      }
      return;
    }

    // Base position from stored original
    const userData = particle.userData;
    let basePos = userData.originalPosition.clone();

    // Always apply rolling rotation (it naturally decays when not transitioning)
    if (sphere.rollRotation && Math.abs(sphere.rollRotation) > 0.001) {
      const axis = new THREE.Vector3(0, 1, 0);
      basePos.applyAxisAngle(axis, sphere.rollRotation);
    }

    // Mouse interaction - rotate sphere with cursor in X and Y axis (constrained)
    if (sphere.mouseInfluence) {
      // Constrained rotation - limit the maximum rotation angles
      const maxRotationX = Math.PI / 6; // 30 degrees max rotation on X-axis (up/down)
      const maxRotationY = Math.PI / 4; // 45 degrees max rotation on Y-axis (left/right)

      // Calculate constrained rotations based on mouse influence
      const mouseRotationY = sphere.mouseInfluence.x * maxRotationY; // Horizontal rotation (left/right)
      const mouseRotationX = sphere.mouseInfluence.y * maxRotationX; // Vertical rotation (up/down)

      // Apply rotations in order: Y-axis first (left/right), then X-axis (up/down)
      basePos.applyAxisAngle(new THREE.Vector3(0, 1, 0), mouseRotationY); // Horizontal
      basePos.applyAxisAngle(new THREE.Vector3(1, 0, 0), mouseRotationX); // Vertical
    }

    // Add violent shake if being held for more than 1 second
    if (sphere.isShaking && sphere.isBeingHeld) {
      const holdDuration = (Date.now() - sphere.holdStartTime) / 1000;
      const shakeIntensity = Math.min(holdDuration, 3) * 2.5; // More violent shaking

      // Violent random shaking
      basePos.x += (Math.random() - 0.5) * shakeIntensity * 2;
      basePos.y += (Math.random() - 0.5) * shakeIntensity * 2;
      basePos.z += (Math.random() - 0.5) * shakeIntensity * 2;

      // Golden glow effect when shaking intensely
      if (holdDuration > 1.5) {
        particle.material.color.setHex(0xffd700); // Golden color
        particle.material.opacity =
          0.9 + Math.sin(Date.now() * 0.01) * 0.1; // Pulsing glow

        // Scale particles for glow effect
        const glowScale = 1 + Math.sin(Date.now() * 0.008) * 0.3;
        particle.scale.set(glowScale, glowScale, glowScale);
      } else {
        // Reset to normal appearance
        particle.material.color.setHex(0xffffff);
        particle.material.opacity = 0.8;
        particle.scale.set(1, 1, 1);
      }
    } else {
      // Reset to normal appearance when not shaking
      particle.material.color.setHex(0xffffff);
      particle.material.opacity = 0.8;
      particle.scale.set(1, 1, 1);
    }

    // Gentle floating animation (reduced when transitioning)
    const floatIntensity = sphere.isTransitioning ? 0.3 : 1.0;
    particle.position.x =
      basePos.x + Math.sin(time + offset) * 3 * floatIntensity;
    particle.position.y =
      basePos.y + Math.cos(time + offset * 1.1) * 3 * floatIntensity;
    particle.position.z =
      basePos.z + Math.sin(time * 0.5 + offset) * 3 * floatIntensity;
  });

  // Animate environment stars (twinkling effect) - adaptive optimization
  if (sphere.environmentStars && sphere.environmentStars.length > 0) {
    const starSkip = sphere.isLowEndDevice
      ? 4
      : window.innerWidth <= 768
        ? 3
        : 2;
    sphere.environmentStars.forEach((star, index) => {
      // Skip stars for performance on low-end devices
      if (index % starSkip !== 0) return;

      const time = now * 0.001;
      const userData = star.userData;

      // Create twinkling effect by varying opacity (simplified calculation)
      const twinkle =
        Math.sin(time * userData.twinkleSpeed + userData.twinkleOffset) *
        0.2 +
        0.8;
      star.material.opacity = userData.originalOpacity * twinkle;

      // Remove subtle movement on low-end devices for performance
      if (!sphere.isLowEndDevice && window.innerWidth > 768) {
        const subtleMovement =
          Math.sin(time * 0.0003 + userData.twinkleOffset) * 0.3;
        star.position.x = userData.originalPosition.x + subtleMovement;
        star.position.y =
          userData.originalPosition.y + subtleMovement * 0.5;
      }
    });
  }

  // Animate lines to grow randomly and rotate with sphere
  sphere.lines.forEach((line, index) => {
    const time = Date.now() * 0.001;
    const lineData = line.userData || {};

    // Initialize line growth data if not exists
    if (!lineData.growthPhase) {
      lineData.growthPhase = Math.random() * Math.PI * 2;
      lineData.growthSpeed = Math.random() * 0.002 + 0.001;
      lineData.originalStart = null; // Store original start position
      lineData.originalEnd = null; // Store original end position
      // Physics properties for realistic explosion
      lineData.startVelocity = new THREE.Vector3(0, 0, 0);
      lineData.endVelocity = new THREE.Vector3(0, 0, 0);
      lineData.startAcceleration = new THREE.Vector3(0, 0, 0);
      lineData.endAcceleration = new THREE.Vector3(0, 0, 0);
      lineData.hasExploded = false;
      lineData.explosionTime = 0;
      lineData.mass = Math.random() * 0.5 + 0.3; // Lighter than particles
      lineData.drag = Math.random() * 0.015 + 0.005;
      line.userData = lineData;
    }

    // Handle explosion effect with realistic physics for lines
    if (sphere.isExploding) {
      const explosionProgress =
        (Date.now() - sphere.explosionStartTime) / 4000; // 4 second explosion

      if (
        explosionProgress < 1 &&
        line.geometry &&
        line.geometry.vertices &&
        line.geometry.vertices.length >= 2
      ) {
        // Initialize explosion physics on first frame
        if (!lineData.hasExploded) {
          lineData.hasExploded = true;
          lineData.explosionTime = Date.now();

          // Store original positions if not already stored
          if (!lineData.originalStart) {
            lineData.originalStart = line.geometry.vertices[0].clone();
            lineData.originalEnd = line.geometry.vertices[1].clone();
          }

          // Calculate explosion forces for both endpoints
          const sphereCenter = new THREE.Vector3(0, 0, 0);

          // Start point explosion
          const startDirection = lineData.originalStart
            .clone()
            .sub(sphereCenter)
            .normalize();
          const startForce = (Math.random() * 60 + 30) / lineData.mass;
          const startRandomness = new THREE.Vector3(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25
          );
          lineData.startVelocity = startDirection
            .multiplyScalar(startForce)
            .add(startRandomness);

          // End point explosion (slightly different force for realistic breaking)
          const endDirection = lineData.originalEnd
            .clone()
            .sub(sphereCenter)
            .normalize();
          const endForce = (Math.random() * 60 + 30) / lineData.mass;
          const endRandomness = new THREE.Vector3(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25
          );
          lineData.endVelocity = endDirection
            .multiplyScalar(endForce)
            .add(endRandomness);

          console.log(
            `Line ${index} exploded with start velocity:`,
            lineData.startVelocity
          );
        }

        // Apply physics to both endpoints
        const deltaTime = 0.016;
        const gravity = new THREE.Vector3(0, -40, 0);
        const wind = new THREE.Vector3(
          Math.sin(Date.now() * 0.001) * 3,
          0,
          Math.cos(Date.now() * 0.001) * 3
        );

        // Update start point
        lineData.startAcceleration.copy(gravity).add(wind);
        const startDrag = lineData.startVelocity
          .clone()
          .multiplyScalar(-lineData.drag);
        lineData.startAcceleration.add(startDrag);
        lineData.startVelocity.add(
          lineData.startAcceleration.clone().multiplyScalar(deltaTime)
        );

        const startDisplacement = lineData.startVelocity
          .clone()
          .multiplyScalar(deltaTime);
        line.geometry.vertices[0].add(startDisplacement);

        // Update end point
        lineData.endAcceleration.copy(gravity).add(wind);
        const endDrag = lineData.endVelocity
          .clone()
          .multiplyScalar(-lineData.drag);
        lineData.endAcceleration.add(endDrag);
        lineData.endVelocity.add(
          lineData.endAcceleration.clone().multiplyScalar(deltaTime)
        );

        const endDisplacement = lineData.endVelocity
          .clone()
          .multiplyScalar(deltaTime);
        line.geometry.vertices[1].add(endDisplacement);

        // Boundary collision for line endpoints
        const bounds = {
          minX: -window.innerWidth,
          maxX: window.innerWidth,
          minY: -window.innerHeight,
          maxY: window.innerHeight * 0.3,
          minZ: -1000,
          maxZ: 1000,
        };

        // Bounce start point
        if (
          line.geometry.vertices[0].x < bounds.minX ||
          line.geometry.vertices[0].x > bounds.maxX
        ) {
          lineData.startVelocity.x *= -0.6;
          line.geometry.vertices[0].x = Math.max(
            bounds.minX,
            Math.min(bounds.maxX, line.geometry.vertices[0].x)
          );
        }
        if (line.geometry.vertices[0].y < bounds.minY) {
          lineData.startVelocity.y *= -0.5;
          line.geometry.vertices[0].y = bounds.minY;
        }
        if (
          line.geometry.vertices[0].z < bounds.minZ ||
          line.geometry.vertices[0].z > bounds.maxZ
        ) {
          lineData.startVelocity.z *= -0.6;
          line.geometry.vertices[0].z = Math.max(
            bounds.minZ,
            Math.min(bounds.maxZ, line.geometry.vertices[0].z)
          );
        }

        // Bounce end point
        if (
          line.geometry.vertices[1].x < bounds.minX ||
          line.geometry.vertices[1].x > bounds.maxX
        ) {
          lineData.endVelocity.x *= -0.6;
          line.geometry.vertices[1].x = Math.max(
            bounds.minX,
            Math.min(bounds.maxX, line.geometry.vertices[1].x)
          );
        }
        if (line.geometry.vertices[1].y < bounds.minY) {
          lineData.endVelocity.y *= -0.5;
          line.geometry.vertices[1].y = bounds.minY;
        }
        if (
          line.geometry.vertices[1].z < bounds.minZ ||
          line.geometry.vertices[1].z > bounds.maxZ
        ) {
          lineData.endVelocity.z *= -0.6;
          line.geometry.vertices[1].z = Math.max(
            bounds.minZ,
            Math.min(bounds.maxZ, line.geometry.vertices[1].z)
          );
        }

        line.geometry.verticesNeedUpdate = true;

        // Golden glow effect for lines during explosion
        line.material.color.setHex(0xffd700);

        // Calculate line speed for opacity effect
        const avgSpeed =
          (lineData.startVelocity.length() +
            lineData.endVelocity.length()) /
          2;
        line.material.opacity = Math.max(
          0.8 - explosionProgress * 0.5,
          0.1
        );

        // Break lines if they stretch too far
        const lineLength = line.geometry.vertices[0].distanceTo(
          line.geometry.vertices[1]
        );
        const originalLength = lineData.originalStart.distanceTo(
          lineData.originalEnd
        );
        if (lineLength > originalLength * 3) {
          // Line broke, fade it out faster
          line.material.opacity *= 0.95;
        }
      } else {
        // Explosion finished, hide the line
        line.visible = false;
      }
      return;
    }

    // Store original positions if not stored
    if (
      line.geometry &&
      line.geometry.vertices &&
      line.geometry.vertices.length >= 2
    ) {
      if (lineData.originalStart === null) {
        lineData.originalStart = line.geometry.vertices[0].clone();
        lineData.originalEnd = line.geometry.vertices[1].clone();
      }

      // Start with original positions
      let startPos = lineData.originalStart.clone();
      let endPos = lineData.originalEnd.clone();

      // Always apply rolling rotation (it naturally decays when not transitioning)
      if (sphere.rollRotation && Math.abs(sphere.rollRotation) > 0.001) {
        const axis = new THREE.Vector3(0, 1, 0);
        startPos.applyAxisAngle(axis, sphere.rollRotation);
        endPos.applyAxisAngle(axis, sphere.rollRotation);
      }

      // Apply sphere rotation to line start and end points with X and Y axis (constrained)
      if (sphere.mouseInfluence) {
        // Constrained rotation - same limits as particles
        const maxRotationX = Math.PI / 6; // 30 degrees max rotation on X-axis (up/down)
        const maxRotationY = Math.PI / 4; // 45 degrees max rotation on Y-axis (left/right)

        // Calculate constrained rotations based on mouse influence
        const mouseRotationY = sphere.mouseInfluence.x * maxRotationY; // Horizontal rotation (left/right)
        const mouseRotationX = sphere.mouseInfluence.y * maxRotationX; // Vertical rotation (up/down)

        // Apply rotations in order to both start and end points: Y-axis first, then X-axis
        startPos.applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          mouseRotationY
        ); // Horizontal
        startPos.applyAxisAngle(
          new THREE.Vector3(1, 0, 0),
          mouseRotationX
        ); // Vertical
        endPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), mouseRotationY); // Horizontal
        endPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), mouseRotationX); // Vertical
      }

      // Add violent shake to lines if sphere is shaking
      if (sphere.isShaking && sphere.isBeingHeld) {
        const holdDuration = (Date.now() - sphere.holdStartTime) / 1000;
        const shakeIntensity = Math.min(holdDuration, 3) * 1.5; // More violent shaking for lines

        startPos.x += (Math.random() - 0.5) * shakeIntensity;
        startPos.y += (Math.random() - 0.5) * shakeIntensity;
        startPos.z += (Math.random() - 0.5) * shakeIntensity;

        endPos.x += (Math.random() - 0.5) * shakeIntensity;
        endPos.y += (Math.random() - 0.5) * shakeIntensity;
        endPos.z += (Math.random() - 0.5) * shakeIntensity;

        // Golden glow effect for lines when shaking intensely
        if (holdDuration > 1.5) {
          line.material.color.setHex(0xffd700); // Golden color
          line.material.opacity = 0.9 + Math.sin(Date.now() * 0.01) * 0.1; // Pulsing glow
        } else {
          // Reset to normal appearance
          line.material.color.setHex(0xffffff);
          line.material.opacity = 0.4;
        }
      } else {
        // Reset to normal appearance when not shaking
        line.material.color.setHex(0xffffff);
        line.material.opacity = 0.4;
      }

      // Calculate growth factor for alive feeling
      const growthFactor =
        1.0 +
        Math.sin(time * lineData.growthSpeed + lineData.growthPhase) *
        0.1;

      // Apply growth from start point (origin)
      const direction = endPos.clone().sub(startPos).normalize();
      const originalLength = lineData.originalStart.distanceTo(
        lineData.originalEnd
      );
      const newLength = originalLength * growthFactor;

      endPos = startPos.clone().add(direction.multiplyScalar(newLength));

      // Update line geometry
      line.geometry.vertices[0].copy(startPos);
      line.geometry.vertices[1].copy(endPos);
      line.geometry.verticesNeedUpdate = true;
    }
  });

  // Smoothly interpolate camera position instead of sphere position
  const lerpSpeed = 0.05;
  const cameraPositionDelta =
    Math.abs(
      sphere.targetCameraPosition.x - sphere.currentCameraPosition.x
    ) +
    Math.abs(
      sphere.targetCameraPosition.y - sphere.currentCameraPosition.y
    ) +
    Math.abs(
      sphere.targetCameraPosition.z - sphere.currentCameraPosition.z
    );

  // Check if transitioning (moving to new position) - use smaller threshold for more gradual transition
  sphere.isTransitioning = cameraPositionDelta > 1;

  // Interpolate camera position first
  sphere.currentCameraPosition.x +=
    (sphere.targetCameraPosition.x - sphere.currentCameraPosition.x) *
    lerpSpeed;
  sphere.currentCameraPosition.y +=
    (sphere.targetCameraPosition.y - sphere.currentCameraPosition.y) *
    lerpSpeed;
  sphere.currentCameraPosition.z +=
    (sphere.targetCameraPosition.z - sphere.currentCameraPosition.z) *
    lerpSpeed;

  // Apply mouse influence to the interpolated position before velocity calculation
  let currentCameraX = sphere.currentCameraPosition.x;
  let currentCameraY = sphere.currentCameraPosition.y;
  let currentCameraZ = sphere.currentCameraPosition.z;

  // Mouse influence no longer affects camera position - only sphere rotation
  // Camera stays in its interpolated position for section transitions

  // Calculate movement velocity for natural deceleration (including mouse influence)
  const previousPosition = sphere.previousCameraPosition || {
    x: currentCameraX,
    y: currentCameraY,
    z: currentCameraZ,
  };

  const velocity = Math.abs(
    currentCameraX -
    previousPosition.x +
    (currentCameraY - previousPosition.y) +
    (currentCameraZ - previousPosition.z)
  );

  // Store current position (with mouse influence) for next frame velocity calculation
  sphere.previousCameraPosition = {
    x: currentCameraX,
    y: currentCameraY,
    z: currentCameraZ,
  };

  // Update roll rotation with velocity-based deceleration for natural feel
  if (sphere.isTransitioning) {
    // Still moving between sections - maintain rotation speed
    sphere.rollRotation += 0.015; // Reduced from 0.03
  } else {
    // Calculate deceleration based on actual movement velocity
    const minVelocity = 0.001; // Minimum velocity to consider "moving"
    const velocityFactor = Math.min(velocity * 20, 1); // Scale velocity to rotation influence

    if (velocity > minVelocity) {
      // Still has momentum - continue rotating but slow down based on velocity
      const rotationSpeed = 0.005 + velocityFactor * 0.01; // Reduced from 0.01 + 0.02
      sphere.rollRotation += rotationSpeed;
    }

    // Always apply gradual decay for smooth stop
    sphere.rollRotation *= 0.985; // Slightly less aggressive decay for more natural feel
  }

  // Update camera position with mouse influence applied as an offset
  let finalCameraX = currentCameraX; // Use the already calculated position with mouse influence
  let finalCameraY = currentCameraY;
  let finalCameraZ = currentCameraZ;

  sphere.camera.position.set(finalCameraX, finalCameraY, finalCameraZ);
  sphere.camera.lookAt(0, 0, 0); // Always look at sphere center
  sphere.container.style.height = `${sphere.sphereSize}px`;

  sphere.renderer.render(sphere.scene, sphere.camera);
}

function updateSpherePosition(sectionId, animate = true) {
  const sphere = portfolio.travelingSphere;
  if (!sphere) return;

  // Calculate target camera position based on section
  // Keep sphere at center (0,0,0), move camera around it
  let targetX, targetY, targetZ;

  const baseDistance = sphere.sphereSize * 1.2; // Updated base distance for orthographic camera

  // Determine camera position based on section
  switch (sectionId) {
    case "hero":
      targetX = 0; // Center view
      targetY = 0;
      targetZ = baseDistance;
      break;
    case "about":
      targetX = baseDistance * 1.1; // Move camera more to the right
      targetY = baseDistance * 0.1; // Slightly up
      targetZ = baseDistance * 0.7; // Closer for more dramatic angle
      break;
    case "work":
      targetX = -baseDistance * 1.3; // Move camera more to the left
      targetY = -baseDistance * 0.1; // Slightly down
      targetZ = baseDistance * 0.7; // Closer for more dramatic angle
      break;
    case "contact":
      targetX = 0;
      targetY = 0;
      targetZ = baseDistance;
      break;
    default:
      targetX = 0;
      targetY = 0;
      targetZ = baseDistance;
  }

  console.log(`Target camera position for ${sectionId}:`, {
    targetX,
    targetY,
    targetZ,
  });

  // Update target camera position
  if (animate) {
    sphere.targetCameraPosition.x = targetX;
    sphere.targetCameraPosition.y = targetY;
    sphere.targetCameraPosition.z = targetZ;
    sphere.isTransitioning = true;
  } else {
    sphere.targetCameraPosition.x = targetX;
    sphere.targetCameraPosition.y = targetY;
    sphere.targetCameraPosition.z = targetZ;
    sphere.currentCameraPosition.x = targetX;
    sphere.currentCameraPosition.y = targetY;
    sphere.currentCameraPosition.z = targetZ;

    // IMPORTANT: Update previousCameraPosition to prevent velocity calculation errors
    sphere.previousCameraPosition = {
      x: targetX,
      y: targetY,
      z: targetZ,
    };

    sphere.camera.position.set(targetX, targetY, targetZ);
    sphere.camera.lookAt(0, 0, 0); // Always look at sphere center
    console.log(
      "Camera positioned immediately at:",
      sphere.currentCameraPosition
    );
  }

  sphere.currentSection = sectionId;
  portfolio.currentSection = sectionId; // Update global current section

  // Update sphere color for the new section
  updateSphereColor();

  // Update footer color and scroll icon
  updateFooterColor();
  updateHeaderColor();
  updateMobileToggleColor();
  updateScrollIcon();

  // Update mobile nav active state
  updateMobileNavActive();
}

function updateSphereColor() {
  const sphere = portfolio.travelingSphere;
  if (!sphere || !sphere.container) return;

  // Get canvas element
  const canvas = sphere.container.querySelector("canvas");
  if (!canvas) return;

  // Check if sphere is currently in a light section by checking current section
  const currentSectionElement = document.querySelector(
    `#${portfolio.currentSection}`
  );
  if (!currentSectionElement) return;

  const isLightSection =
    currentSectionElement.classList.contains("light-theme");

  // Apply invert filter directly to canvas
  if (isLightSection) {
    canvas.style.filter = "invert(1)";
    canvas.style.transition = "filter 0.3s ease-in-out";
  } else {
    canvas.style.filter = "invert(0)";
    canvas.style.transition = "filter 0.3s ease-in-out";
  }

  // Set opacity based on section
  if (
    portfolio.currentSection === "hero" ||
    portfolio.currentSection === "contact"
  ) {
    canvas.style.opacity = "0.5";
  } else {
    canvas.style.opacity = "1";
  }

  // Update environment star colors based on section theme
  if (sphere.environmentStars) {
    sphere.environmentStars.forEach((star) => {
      // Since canvas gets inverted on light sections, we need to account for that
      // On light sections: use white stars (will become dark after inversion)
      // On dark sections: use white stars (no inversion)
      const starColor = isLightSection ? 0xffffff : 0xffffff; // Always white, let CSS filter handle the inversion
      star.material.color.setHex(starColor);
    });
  }

  console.log(
    `Sphere color updated for section: ${portfolio.currentSection}, isLight: ${isLightSection}`
  );
}

function setupScrollSphereAnimation() {
  // Track current section with intersection observer
  const sections = document.querySelectorAll(".section");
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px 0px 0px",
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        if (sectionId !== portfolio.travelingSphere?.currentSection) {
          updateSpherePosition(sectionId, true);
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // Add additional scroll listener as backup
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentSection = Math.floor(scrollPosition / windowHeight);

      const sectionIds = ["hero", "about", "work", "contact"];
      const targetSection = sectionIds[currentSection];

      if (
        targetSection &&
        targetSection !== portfolio.travelingSphere?.currentSection
      ) {
        portfolio.currentSection = targetSection; // Update global first
        updateSpherePosition(targetSection, true);
      }
    }, 100);
  });

  // Handle manual section navigation for scroll snap
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          updateSpherePosition(targetId, true);
        }, 100);
      }
    });
  });
}

// Window resize handler
window.addEventListener("resize", () => {
  const sphere = portfolio.travelingSphere;
  if (sphere && sphere.camera && sphere.renderer) {
    // Update orthographic camera for new aspect ratio
    const frustumSize = Math.max(sphere.sphereSize * 1.5, 1000);
    const aspect = window.innerWidth / window.innerHeight;

    sphere.camera.left = (frustumSize * aspect) / -2;
    sphere.camera.right = (frustumSize * aspect) / 2;
    sphere.camera.top = frustumSize / 2;
    sphere.camera.bottom = frustumSize / -2;
    sphere.camera.updateProjectionMatrix();

    sphere.renderer.setSize(window.innerWidth, window.innerHeight);

    // Recalculate sphere size for mobile/desktop transitions
    const isMobile = window.innerWidth <= 768;
    const newSphereSize = isMobile ? 600 : 1200;

    // Store the new sphere size in both properties
    sphere.size = newSphereSize;
    sphere.sphereSize = newSphereSize;

    // Update camera frustum for new sphere size
    const newFrustumSize = Math.max(newSphereSize * 1.5, 1000);
    const newAspect = window.innerWidth / window.innerHeight;

    sphere.camera.left = (newFrustumSize * newAspect) / -2;
    sphere.camera.right = (newFrustumSize * newAspect) / 2;
    sphere.camera.top = newFrustumSize / 2;
    sphere.camera.bottom = newFrustumSize / -2;
    sphere.camera.updateProjectionMatrix();

    // Update sphere position for new viewport size
    updateSpherePosition(sphere.currentSection, false);
  }

  // Update Swiper on resize
  if (projectsSwiper) {
    projectsSwiper.update();
  }

  // Re-render projects on mobile/desktop switch
  if (portfolio.allProjects && portfolio.allProjects.length > 0) {
    const currentCategory =
      document.querySelector(".filter-btn.active")?.dataset.filter ||
      "all";
    filterProjects(currentCategory);
  }
});

// Mouse tracking for sphere rotation (constrained to viewport)
let lastMouseMoveTime = Date.now();
window.addEventListener("mousemove", (e) => {
  const sphere = portfolio.travelingSphere;
  if (sphere) {
    lastMouseMoveTime = Date.now();

    // Normalize mouse position to [-1, 1] range, constrained to viewport
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    // Constrain and smooth the influence (made even smoother)
    sphere.mouseInfluence.x +=
      (mouseX * 0.3 - sphere.mouseInfluence.x) * 0.08; // Slightly increased responsiveness
    sphere.mouseInfluence.y +=
      (mouseY * 0.3 - sphere.mouseInfluence.y) * 0.08; // Smoother interpolation

    // Clamp values to prevent crazy rotation
    sphere.mouseInfluence.x = Math.max(
      -0.3,
      Math.min(0.3, sphere.mouseInfluence.x)
    );
    sphere.mouseInfluence.y = Math.max(
      -0.3,
      Math.min(0.3, sphere.mouseInfluence.y)
    );
  }
});

// Decay mouse influence when not moving mouse
setInterval(() => {
  const sphere = portfolio.travelingSphere;
  if (sphere && Date.now() - lastMouseMoveTime > 2000) {
    // After 2 seconds of no mouse movement
    sphere.mouseInfluence.x *= 0.95; // Gradually return to neutral
    sphere.mouseInfluence.y *= 0.95;
  }
}, 50);

// Click and hold functionality for sphere
let sphereHoldTimeout;

// Make sphere containers clickable anywhere on page
document.addEventListener("mousedown", (e) => {
  const sphere = portfolio.travelingSphere;
  if (sphere && !sphere.isExploding) {
    sphere.isBeingHeld = true;
    sphere.holdStartTime = Date.now();

    console.log(
      "Sphere hold started at:",
      new Date().toLocaleTimeString()
    );

    // Start shaking after 0.5 seconds
    setTimeout(() => {
      if (sphere.isBeingHeld) {
        sphere.isShaking = true;
      }
    }, 500);

    // Explode after 3 seconds
    sphereHoldTimeout = setTimeout(() => {
      if (sphere.isBeingHeld) {
        sphere.isExploding = true;
        sphere.explosionStartTime = Date.now();
        sphere.isBeingHeld = false;
        sphere.isShaking = false;

        // Make sphere container disappear after explosion
        setTimeout(() => {
          if (sphere.container) {
            sphere.container.classList.add("fade-out");

            setTimeout(() => {
              sphere.container.classList.add("hidden");
            }, 1000);
          }
        }, 4000); // Wait for longer explosion to finish
      }
    }, 3000);
    // }
  }
});

document.addEventListener("mouseup", () => {
  const sphere = portfolio.travelingSphere;
  if (sphere) {
    sphere.isBeingHeld = false;
    sphere.isShaking = false;
    clearTimeout(sphereHoldTimeout);
  }
});

// Also handle mouse leave to prevent stuck states
document.addEventListener("mouseleave", () => {
  const sphere = portfolio.travelingSphere;
  if (sphere) {
    sphere.isBeingHeld = false;
    sphere.isShaking = false;
    clearTimeout(sphereHoldTimeout);
  }
}); // Add keyboard shortcut for testing - removed since CSS masks handle color changes

// Create toast notification
function createToastNotification() {
  // Check if toast already exists
  if (document.getElementById("interaction-toast")) {
    return;
  }

  const toast = document.createElement("div");
  toast.id = "interaction-toast";
  toast.className = "toast-notification";
  toast.innerHTML = `
          <button class="toast-close" onclick="dismissToast()">&times;</button>
          Click and hold anywhere for 3 seconds to remove distractions
        `;

  document.body.appendChild(toast);

  // Show toast after a brief delay
  setTimeout(() => {
    toast.classList.add("show");
  }, 1000);

  // Auto-hide toast after 8 seconds
  setTimeout(() => {
    dismissToast();
  }, 8000);
}

// Dismiss toast notification
function dismissToast() {
  const toast = document.getElementById("interaction-toast");
  if (toast) {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }
}

// Initialize everything
document.addEventListener("DOMContentLoaded", function () {
  // Remove any loading classes
  document.body.classList.remove("loading");
  document.body.classList.add("overflow-auto");

  // Hide any loaders
  const loaders = document.querySelectorAll(".loader, #loader");
  loaders.forEach((loader) => {
    loader.classList.add("hidden");
  });

  // Load content and initialize 3D
  loadContent().then(() => {
    init3D();
  });

  // Create and show toast notification
  setTimeout(() => {
    createToastNotification();
  }, 2000); // Show toast 2 seconds after page load
});

// Simple footer color update
function updateFooterColor() {
  const footer = document.getElementById("fixed-footer");
  if (!footer) return;

  // Remove existing theme classes
  footer.classList.remove("footer-light", "footer-dark");

  // Add appropriate class based on current section
  if (
    portfolio.currentSection === "hero" ||
    portfolio.currentSection === "work"
  ) {
    footer.classList.add("footer-dark"); // White text for dark sections
  } else {
    footer.classList.add("footer-light"); // Black text for light sections
  }
}

// Simple header color update
function updateHeaderColor() {
  const header = document.getElementById("fixed-header");
  if (!header) return;

  // Remove existing theme classes
  header.classList.remove("header-light", "header-dark");

  // Add appropriate class based on current section
  if (
    portfolio.currentSection === "hero" ||
    portfolio.currentSection === "work"
  ) {
    header.classList.add("header-dark"); // White text for dark sections
  } else {
    header.classList.add("header-light"); // Black text for light sections
  }
}

// Update mobile toggle color based on current section
function updateMobileToggleColor() {
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  if (!mobileToggle) return;

  // Remove existing theme classes
  mobileToggle.classList.remove("toggle-light", "toggle-dark");

  // Add appropriate class based on current section
  if (
    portfolio.currentSection === "hero" ||
    portfolio.currentSection === "work"
  ) {
    mobileToggle.classList.add("toggle-dark"); // White hamburger for dark sections
  } else {
    mobileToggle.classList.add("toggle-light"); // Black hamburger for light sections
  }
}

// Update scroll icon based on current section
function updateScrollIcon() {
  const scrollContainer = document.querySelector(".footer-scroll");
  if (!scrollContainer) return;

  if (portfolio.currentSection === "contact") {
    // Show arrow up for last section
    scrollContainer.innerHTML = '<div class="arrow-up"></div>';
  } else {
    // Show scroll mouse for other sections
    scrollContainer.innerHTML =
      '<div class="scroll-mouse"><div class="scroll-wheel"></div></div>';
  }
}

// Update mobile nav active state
function updateMobileNavActive() {
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.dataset.section === portfolio.currentSection) {
      link.classList.add("active");
    }
  });
}

// Simple footer functionality
function initializeFooter() {
  const navLinks = document.querySelectorAll(".footer-nav-link");

  // Handle navigation clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = link.dataset.section;

      // Update portfolio current section
      portfolio.currentSection = targetSection;

      // Update sphere position
      if (portfolio.travelingSphere) {
        updateSpherePosition(targetSection, true);
      }

      // Update footer color and active nav link
      updateFooterColor();
      updateHeaderColor();
      updateMobileToggleColor();
      updateScrollIcon();
      navLinks.forEach((navLink) => {
        navLink.classList.remove("active");
        if (navLink.dataset.section === targetSection) {
          navLink.classList.add("active");
        }
      });

      // Scroll to section smoothly
      const section = document.querySelector(`#${targetSection}`);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}
