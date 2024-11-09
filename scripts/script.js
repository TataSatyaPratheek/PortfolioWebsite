// scripts/script.js

// ==================== Typewriter Effect ====================

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

// ==================== Dark/Light Mode Toggle ====================

const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

if (themeToggleBtn) {
    // Initialize theme based on localStorage or default to dark
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

        // Update theme icon and save preference
        if (document.body.classList.contains('bright-mode')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'bright');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ==================== Particle Background Animation ====================

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

    // Particle class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Update particle position
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

    // Initialize particles
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

    // Animate particles
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        particlesArray.forEach(particle => {
            particle.update();
        });
    }

    // Initialize and start animation
    init();
    animate();

    // Observe theme changes to update particle colors
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                particlesArray.forEach(particle => {
                    particle.color = (document.body.classList.contains('bright-mode')) ? 'rgba(0, 170, 255, 0.7)' : 'rgba(0, 255, 0, 0.7)';
                });
            }
        });
    });

    observer.observe(document.body, { attributes: true });
}

// ==================== Scroll To Top Button Functionality ====================

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
        <div class="col-12">
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
            if (!featuredProjectsContainer) return;

            // Select featured projects based on "featured" flag or first 3 if not present
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
            if (!latestBlogsContainer) return;

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
            if (!blogContainer) return;

            // Clear existing content to prevent duplication
            blogContainer.innerHTML = '';

            // Assuming blogs are ordered from latest to oldest
            data.forEach(blog => {
                const blogCard = createBlogCard(blog.title, blog.image, blog.description, blog.link);
                blogContainer.insertAdjacentHTML('beforeend', blogCard);
            });
        })
        .catch(error => console.error('Error loading blog posts:', error));
}

// Function to render Projects (used in projects.html)
function renderProjects() {
    fetch('data/projects.json')
        .then(response => response.json())
        .then(data => {
            const projectsContainer = document.getElementById('projects-container');
            if (!projectsContainer) return;

            // Clear existing content to prevent duplication
            projectsContainer.innerHTML = '';

            data.forEach(project => {
                const projectCard = createProjectCard(project.title, project.image, project.description, project.skills, project.link);
                projectsContainer.insertAdjacentHTML('beforeend', projectCard);
            });
        })
        .catch(error => console.error('Error loading projects:', error));
}

// Function to render Skills (used in skills.html)
function renderSkills() {
    fetch('data/skills.json')
        .then(response => response.json())
        .then(data => {
            const skillsContainer = document.getElementById('skills-container');
            if (!skillsContainer) return;

            // Clear existing content to prevent duplication
            skillsContainer.innerHTML = '';

            data.forEach(skill => {
                const skillItem = createSkillItem(skill.name, skill.icon, skill.projects);
                skillsContainer.insertAdjacentHTML('beforeend', skillItem);
            });
        })
        .catch(error => console.error('Error loading skills:', error));
}

// Function to render Experience (used in experience.html)
function renderExperience() {
    fetch('data/experience.json')
        .then(response => response.json())
        .then(data => {
            const experienceContainer = document.getElementById('experience-container');
            if (!experienceContainer) return;

            // Clear existing content to prevent duplication
            experienceContainer.innerHTML = '';

            data.forEach(exp => {
                const experienceItem = createExperienceItem(exp.role, exp.company, exp.duration, exp.responsibilities, exp.skills);
                experienceContainer.insertAdjacentHTML('beforeend', experienceItem);
            });
        })
        .catch(error => console.error('Error loading experience:', error));
}

// ==================== Dynamic Detail Page Rendering ====================

// Function to render Blog Detail based on URL parameter
function renderBlogDetail() {
    const params = new URLSearchParams(window.location.search);
    const blogTitle = params.get('title');

    if (!blogTitle) {
        document.querySelector('.blog-detail-section').innerHTML = '<p>Blog post not found.</p>';
        return;
    }

    fetch('data/blog.json')
        .then(response => response.json())
        .then(data => {
            const blog = data.find(b => b.title.toLowerCase().replace(/\s+/g, '-') === blogTitle.toLowerCase().replace(/\s+/g, '-'));
            if (!blog) {
                document.querySelector('.blog-detail-section').innerHTML = '<p>Blog post not found.</p>';
                return;
            }

            document.getElementById('blog-title').textContent = blog.title;
            document.getElementById('blog-image').src = blog.image;
            document.getElementById('blog-image').alt = blog.title;
            document.getElementById('blog-description').textContent = blog.description;
            document.getElementById('blog-tags').textContent = blog.tags.join(', ');
            document.getElementById('blog-content').textContent = blog.content;

            const relatedProjectsContainer = document.getElementById('blog-related-projects');
            if (relatedProjectsContainer) {
                relatedProjectsContainer.innerHTML = '';
                blog.related_projects.forEach(project => {
                    const projectLink = project.toLowerCase().replace(/\s+/g, '-');
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="projects.html#${projectLink}">${project}</a>`;
                    relatedProjectsContainer.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error loading blog detail:', error));
}

// Function to render Project Detail based on URL fragment
function renderProjectDetail() {
    const hash = window.location.hash.substring(1); // Remove the '#' character
    if (!hash) {
        document.querySelector('.project-detail-section').innerHTML = '<p>Project not found.</p>';
        return;
    }

    fetch('data/projects.json')
        .then(response => response.json())
        .then(data => {
            const project = data.find(p => p.title.toLowerCase().replace(/\s+/g, '-') === hash.toLowerCase().replace(/\s+/g, '-'));
            if (!project) {
                document.querySelector('.project-detail-section').innerHTML = '<p>Project not found.</p>';
                return;
            }

            document.getElementById('project-title').textContent = project.title;
            document.getElementById('project-image').src = project.image;
            document.getElementById('project-image').alt = project.title;
            document.getElementById('project-description').textContent = project.description;
            document.getElementById('project-skills').textContent = project.skills.join(', ');
            document.getElementById('project-details').textContent = project.details.map(detail => detail.text).join('\n\n');

            const citationsContainer = document.getElementById('project-citations');
            if (citationsContainer) {
                citationsContainer.innerHTML = '';
                project.details.forEach(detail => {
                    detail.citations.forEach(citation => {
                        const li = document.createElement('li');
                        li.textContent = citation;
                        citationsContainer.appendChild(li);
                    });
                });
            }

            const relatedProjectsContainer = document.getElementById('project-related-projects');
            if (relatedProjectsContainer) {
                relatedProjectsContainer.innerHTML = '';
                project.related_projects.forEach(relProject => {
                    const relProjectLink = relProject.toLowerCase().replace(/\s+/g, '-');
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="projects.html#${relProjectLink}">${relProject}</a>`;
                    relatedProjectsContainer.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error loading project detail:', error));
}

// ==================== Initialization Based on Page ====================

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();

    switch(currentPage) {
        case 'index.html':
        case '':
            // Call functions to render content specific to the index page
            renderFeaturedProjects();
            renderLatestBlogs();
            break;
        case 'projects.html':
            renderProjects();
            break;
        case 'blog.html':
            renderBlogs();
            break;
        case 'skills.html':
            renderSkills();
            break;
        case 'experience.html':
            renderExperience();
            break;
        case 'blog-detail.html':
            renderBlogDetail();
            break;
        case 'project-detail.html':
            renderProjectDetail();
            break;
        case 'contact.html':
            // No dynamic content to render
            break;
        default:
            // Handle unknown pages if necessary
            break;
    }
});