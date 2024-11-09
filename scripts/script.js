// scripts/script.js

// Typewriter Effect for Name
document.addEventListener('DOMContentLoaded', function() {
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const fullName = "Satya Pratheek TATA";
        let index = 0;
  
        function typeWriter() {
            if (index < fullName.length) {
                nameElement.textContent += fullName.charAt(index);
                index++;
                setTimeout(typeWriter, 150);
            }
        }
  
        typeWriter();
    }
  });
  
  // Dark/Light Mode Toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  if (themeToggleBtn) {
    // Check for saved user preference, if any, on load of the website
    if (localStorage.getItem('theme') === 'bright') {
        document.body.classList.add('bright-mode');
        themeIcon.textContent = '☀️';
    } else {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '🌙';
    }
  
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('bright-mode');
        document.body.classList.toggle('dark-mode');
  
        // Change the icon
        if (document.body.classList.contains('bright-mode')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'bright');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });
  }
  
  // Simple Particle Background Animation
  const canvas = document.getElementById('background-animation');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;
  
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
  
    // Create Particle class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
  
        // Draw individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
  
        // Update particle position, check boundaries
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }
  
    // Create particle array
    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
  
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = (document.body.classList.contains('bright-mode')) ? 'rgba(0, 170, 255, 0.7)' : 'rgba(0, 255, 0, 0.7)';
  
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }
  
    // Check particles and update color based on theme
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
  
        particlesArray.forEach(particle => {
            particle.update();
        });
    }
  
    // Initialize and animate
    init();
    animate();
  
    // Update particle colors on theme change
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                particlesArray.forEach(particle => {
                    particle.color = (document.body.classList.contains('bright-mode')) ? 'rgba(0, 170, 255, 0.7)' : 'rgba(0, 255, 0, 0.7)';
                });
            }
        });
    });
  
    // Observe class changes on body
    observer.observe(document.body, { attributes: true });
  }
  
  // Scroll To Top Button Functionality
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  
  if (scrollToTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
  
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
  }
  
  // ==================== Dynamic Content Rendering Functions ====================
  
  // Function to create Project Card HTML
  function createProjectCard(title, image, description, skills, link) {
      const skillsBadges = skills.map(skill => `<span class="badge badge-primary mr-1">${skill}</span>`).join('');
      return `
          <div class="col-md-4 mb-4">
              <div class="card project-card">
                  <img src="${image}" class="card-img-top" alt="${title}">
                  <div class="card-body">
                      <h5 class="card-title">${title}</h5>
                      <p class="card-text">${description}</p>
                      <div class="skills mb-3">
                          ${skillsBadges}
                      </div>
                      <a href="${link}" class="btn btn-primary">Learn More</a>
                  </div>
              </div>
          </div>
      `;
  }
  
  // Function to create Blog Card HTML
  function createBlogCard(title, image, description, link) {
      return `
          <div class="col-md-6 mb-4">
              <div class="card blog-card">
                  <img src="${image}" class="card-img-top" alt="${title}">
                  <div class="card-body">
                      <h5 class="card-title">${title}</h5>
                      <p class="card-text">${description}</p>
                      <a href="${link}" class="btn btn-primary">Read More</a>
                  </div>
              </div>
          </div>
      `;
  }
  
  // Function to create Skill Item HTML
  function createSkillItem(name, icon, projects) {
      let links = '';
      if (projects.length > 0) {
          projects.forEach(project => {
              const projectLink = `projects.html#${project.toLowerCase().replace(/\s+/g, '-')}`;
              links += `<a href="${projectLink}" class="d-block">${project}</a>`;
          });
      }
      return `
          <div class="col-md-3 col-sm-4 col-6 mb-4 text-center">
              <a href="${projects.length > 0 ? projects.map(project => `projects.html#${project.toLowerCase().replace(/\s+/g, '-')}`).join(' ') : '#'}" class="skill-link" aria-label="${name}">
                  <img src="${icon}" alt="${name}" class="skill-icon mb-2">
                  <p>${name}</p>
              </a>
              ${links}
          </div>
      `;
  }
  
  // Function to create Experience Item HTML
  function createExperienceItem(role, company, duration, responsibilities, skills) {
      const responsibilitiesList = responsibilities.map(resp => `<li>${resp}</li>`).join('');
      const skillsList = skills.length > 0 ? `<p><strong>Skills Used:</strong></p><ul>${skills.map(skill => `<li>${skill}</li>`).join('')}</ul>` : '';
      return `
          <div class="card mb-4">
              <div class="card-body">
                  <h3 class="card-title">${role} at ${company}</h3>
                  <h5 class="card-subtitle mb-2 text-muted">${duration}</h5>
                  <p><strong>Responsibilities:</strong></p>
                  <ul>
                      ${responsibilitiesList}
                  </ul>
                  ${skillsList}
              </div>
          </div>
      `;
  }
  
  // ==================== Rendering Functions ====================
  
  // Function to render Featured Projects
  function renderFeaturedProjects() {
      fetch('data/projects.json')
          .then(response => response.json())
          .then(data => {
              const featuredProjectsContainer = document.getElementById('featured-projects-container');
              // Select top 3 featured projects based on "featured" flag or first 3 if not present
              const featuredProjects = data.filter(project => project.featured).length > 0 ? data.filter(project => project.featured) : data.slice(0, 3);
              featuredProjects.forEach(project => {
                  const projectCard = createProjectCard(project.title, project.image, project.description, project.skills, project.link);
                  featuredProjectsContainer.insertAdjacentHTML('beforeend', projectCard);
              });
          })
          .catch(error => console.error('Error loading featured projects:', error));
  }
  
  // Function to render Latest Blogs
  function renderLatestBlogs() {
      fetch('data/blog.json')
          .then(response => response.json())
          .then(data => {
              const latestBlogsContainer = document.getElementById('latest-blogs-container');
              // Sort blogs by date if available, else keep as is
              // Assuming blogs are ordered from latest to oldest
              const latestBlogs = data.slice(0, 2);
              latestBlogs.forEach(blog => {
                  const blogCard = createBlogCard(blog.title, blog.image, blog.description, blog.link);
                  latestBlogsContainer.insertAdjacentHTML('beforeend', blogCard);
              });
          })
          .catch(error => console.error('Error loading latest blogs:', error));
  }
  
  // Function to render All Blogs (used in blog.html)
  function renderBlogs() {
      fetch('data/blog.json')
          .then(response => response.json())
          .then(data => {
              const blogContainer = document.getElementById('blog-container');
              // Assuming blogs are ordered from latest to oldest
              data.forEach(blog => {
                  const blogCard = createBlogCard(blog.title, blog.image, blog.description, blog.link);
                  blogContainer.insertAdjacentHTML('beforeend', blogCard);
              });
          })
          .catch(error => console.error('Error loading blog posts:', error));
  }
  
  // Function to render Projects
  function renderProjects() {
      fetch('data/projects.json')
          .then(response => response.json())
          .then(data => {
              const projectsContainer = document.getElementById('projects-container');
              data.forEach(project => {
                  const projectCard = createProjectCard(project.title, project.image, project.description, project.skills, project.link);
                  projectsContainer.insertAdjacentHTML('beforeend', projectCard);
              });
          })
          .catch(error => console.error('Error loading projects:', error));
  }
  
  // Function to render Skills
  function renderSkills() {
      fetch('data/skills.json')
          .then(response => response.json())
          .then(data => {
              const skillsContainer = document.getElementById('skills-container');
              data.forEach(skill => {
                  const skillItem = createSkillItem(skill.name, skill.icon, skill.projects);
                  skillsContainer.insertAdjacentHTML('beforeend', skillItem);
              });
          })
          .catch(error => console.error('Error loading skills:', error));
  }
  
  // Function to render Experience
  function renderExperience() {
      fetch('data/experience.json')
          .then(response => response.json())
          .then(data => {
              const experienceContainer = document.getElementById('experience-container');
              data.forEach(exp => {
                  const experienceItem = createExperienceItem(exp.role, exp.company, exp.duration, exp.responsibilities, exp.skills);
                  experienceContainer.insertAdjacentHTML('beforeend', experienceItem);
              });
          })
          .catch(error => console.error('Error loading experience:', error));
  }