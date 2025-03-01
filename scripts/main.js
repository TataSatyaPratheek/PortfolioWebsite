// main.js - Core JavaScript functionality for the portfolio website

// ==============================================
// Global Variables and Helper Functions
// ==============================================
const THEME_KEY = 'portfolio-theme';
const THEME_DARK = 'dark-theme';
const THEME_LIGHT = 'light-theme';
let currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Helper function for async fetching JSON data
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}

// ==============================================
// Site Initialization
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize common components
    loadHeader();
    loadFooter();
    initThemeToggle();
    initParticles();
    initScrollToTop();
    initPreloader();
    
    // Page-specific initializations
    initPageContent();
});

// Initialize preloader
function initPreloader() {
    // Hide preloader after page load
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.getElementById('preloader').style.opacity = '0';
            setTimeout(function() {
                document.getElementById('preloader').style.display = 'none';
            }, 500);
        }, 500);
    });
}

// Load header component
async function loadHeader() {
    const headerElement = document.getElementById('header');
    if (!headerElement) return;
    
    // Fetch the header HTML
    try {
        const response = await fetch('components/header.html');
        if (!response.ok) throw new Error('Failed to load header');
        
        const html = await response.text();
        headerElement.innerHTML = html;
        
        // Set active navigation based on current page
        const navLinks = headerElement.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === 'index.html' && href === '#home') || 
                (currentPage === '' && href === '#home')) {
                link.classList.add('active');
            }
        });
        
        // Initialize mobile menu toggle
        const mobileMenuToggle = headerElement.querySelector('.mobile-menu-toggle');
        const navMenu = headerElement.querySelector('.nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                this.classList.toggle('active');
            });
            
            // Close menu when clicking on a nav link
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                });
            });
        }
    } catch (error) {
        console.error('Error loading header:', error);
        headerElement.innerHTML = '<div class="alert alert-danger">Failed to load header component</div>';
    }
}

// Load footer component
async function loadFooter() {
    const footerElement = document.getElementById('footer');
    if (!footerElement) return;
    
    try {
        const response = await fetch('components/footer.html');
        if (!response.ok) throw new Error('Failed to load footer');
        
        const html = await response.text();
        footerElement.innerHTML = html;
        
        // Update copyright year
        const yearElement = footerElement.querySelector('.copyright-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    } catch (error) {
        console.error('Error loading footer:', error);
        footerElement.innerHTML = '<div class="alert alert-danger">Failed to load footer component</div>';
    }
}

// ==============================================
// Theme Handling
// ==============================================
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    if (!themeToggleBtn || !themeIcon) return;
    
    // Set initial theme based on localStorage or system preference
    const storedTheme = localStorage.getItem(THEME_KEY);
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // If there's a stored preference, use that. Otherwise, follow system preference
    if (storedTheme) {
        document.body.classList.add(storedTheme);
        updateThemeIcon(themeIcon, storedTheme === THEME_DARK);
    } else {
        const initialTheme = systemPrefersDark ? THEME_DARK : THEME_LIGHT;
        document.body.classList.add(initialTheme);
        localStorage.setItem(THEME_KEY, initialTheme);
        updateThemeIcon(themeIcon, systemPrefersDark);
    }
    
    // Theme toggle click handler
    themeToggleBtn.addEventListener('click', function() {
        const isDarkTheme = document.body.classList.contains(THEME_DARK);
        
        // Toggle themes
        document.body.classList.remove(isDarkTheme ? THEME_DARK : THEME_LIGHT);
        document.body.classList.add(isDarkTheme ? THEME_LIGHT : THEME_DARK);
        
        // Update localStorage
        localStorage.setItem(THEME_KEY, isDarkTheme ? THEME_LIGHT : THEME_DARK);
        
        // Update icon
        updateThemeIcon(themeIcon, !isDarkTheme);
        
        // Also update particles if on the page
        updateParticlesColor(!isDarkTheme);
    });
}

function updateThemeIcon(iconElement, isDarkTheme) {
    if (!iconElement) return;
    
    // Change icon based on current theme
    iconElement.className = isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
}

// ==============================================
// Particles Background
// ==============================================
let particlesInstance = null;

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const isDarkTheme = document.body.classList.contains(THEME_DARK);
    
    // Initialize particles
    particlesInstance = new Particles(canvas, {
        particleCount: 50,
        particleColor: isDarkTheme ? '#4ade80' : '#0ea5e9',
        lineColor: isDarkTheme ? 'rgba(74, 222, 128, 0.1)' : 'rgba(14, 165, 233, 0.1)',
        particleSpeed: 0.5,
        lineThickness: 1,
        responsive: [
            {
                breakpoint: 768,
                options: {
                    particleCount: 30
                }
            },
            {
                breakpoint: 480,
                options: {
                    particleCount: 15
                }
            }
        ]
    });
    
    // Start animation
    particlesInstance.start();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (particlesInstance) {
            particlesInstance.resize();
        }
    });
}

function updateParticlesColor(isDarkTheme) {
    if (!particlesInstance) return;
    
    particlesInstance.updateColors({
        particleColor: isDarkTheme ? '#4ade80' : '#0ea5e9',
        lineColor: isDarkTheme ? 'rgba(74, 222, 128, 0.1)' : 'rgba(14, 165, 233, 0.1)'
    });
}

// ==============================================
// Scroll-to-Top Button
// ==============================================
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('back-to-top');
    if (!scrollToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==============================================
// Typing Animation (for Home Page)
// ==============================================
function initTypingAnimation() {
    const typedElement = document.querySelector('.typed-text');
    if (!typedElement) return;
    
    // Options for the typing animation
    const options = {
        strings: [
            'Data Scientist',
            'Software Engineer',
            'AI Enthusiast',
            'Machine Learning Expert'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true
    };
    
    // Initialize Typed.js
    new Typed(typedElement, options);
}

// ==============================================
// Page-Specific Content Loading
// ==============================================
function initPageContent() {
    // Initialize typing animation (if on home page)
    initTypingAnimation();
    
    // Load page-specific content based on current page
    switch (currentPage) {
        case '':
        case 'index.html':
            loadFeaturedProjects();
            loadLatestBlogs();
            break;
        case 'projects.html':
            loadAllProjects();
            break;
        case 'blog.html':
            loadAllBlogs();
            break;
        case 'skills.html':
            loadSkills();
            break;
        case 'experience.html':
            loadExperience();
            break;
        case 'contact.html':
            initContactForm();
            break;
        case 'about.html':
            // No specific initialization needed for about page
            break;
        default:
            // Check if it's a detail page
            if (currentPage === 'project-detail.html') {
                loadProjectDetail();
            } else if (currentPage === 'blog-detail.html') {
                loadBlogDetail();
            }
            break;
    }
}

// ==============================================
// Project Data Handling
// ==============================================
async function loadFeaturedProjects() {
    const container = document.getElementById('featured-projects-container');
    if (!container) return;
    
    const projects = await fetchData('data/projects.json');
    if (!projects) {
        showLoadingError(container);
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Filter featured projects
    const featuredProjects = projects.filter(project => project.featured);
    
    if (featuredProjects.length === 0) {
        container.innerHTML = '<div class="col-12 text-center">No featured projects found.</div>';
        return;
    }
    
    // Create and append project cards
    featuredProjects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        container.appendChild(projectCard);
    });
}

async function loadAllProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    const projects = await fetchData('data/projects.json');
    if (!projects) {
        showLoadingError(container);
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    if (projects.length === 0) {
        container.innerHTML = '<div class="col-12 text-center">No projects found.</div>';
        return;
    }
    
    // Create and append project cards
    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        container.appendChild(projectCard);
    });
}

async function loadProjectDetail() {
    const container = document.querySelector('.project-detail-content');
    if (!container) return;
    
    // Get project ID from URL hash or query parameter
    const projectId = window.location.hash.substring(1) || new URLSearchParams(window.location.search).get('id');
    
    if (!projectId) {
        container.innerHTML = '<div class="alert alert-warning">Project not specified.</div>';
        return;
    }
    
    const projects = await fetchData('data/projects.json');
    if (!projects) {
        showLoadingError(container);
        return;
    }
    
    // Find the project
    const project = projects.find(p => 
        p.title.toLowerCase().replace(/\s+/g, '-') === projectId.toLowerCase()
    );
    
    if (!project) {
        container.innerHTML = '<div class="alert alert-warning">Project not found.</div>';
        return;
    }
    
    // Set page title
    document.title = `${project.title} - Project | Portfolio`;
    
    // Update project details
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-image').src = project.image;
    document.getElementById('project-image').alt = project.title;
    document.getElementById('project-description').textContent = project.description;
    
    // Create skills badges
    const skillsContainer = document.getElementById('project-skills');
    if (skillsContainer) {
        skillsContainer.innerHTML = project.skills.map(skill => 
            `<span class="badge badge-primary mr-2 mb-2">${skill}</span>`
        ).join('');
    }
    
    // Project details
    const detailsContainer = document.getElementById('project-details');
    if (detailsContainer && project.details) {
        detailsContainer.innerHTML = project.details.map(detail => 
            `<p>${detail.text}</p>`
        ).join('');
    }
    
    // Citations
    const citationsContainer = document.getElementById('project-citations');
    if (citationsContainer && project.details) {
        citationsContainer.innerHTML = '';
        
        const citations = [];
        project.details.forEach(detail => {
            if (detail.citations && detail.citations.length) {
                detail.citations.forEach(citation => {
                    if (!citations.includes(citation)) {
                        citations.push(citation);
                    }
                });
            }
        });
        
        if (citations.length) {
            citations.forEach(citation => {
                const li = document.createElement('li');
                li.textContent = citation;
                citationsContainer.appendChild(li);
            });
        } else {
            citationsContainer.innerHTML = '<li>No citations available</li>';
        }
    }
    
    // Related projects
    const relatedContainer = document.getElementById('project-related-projects');
    if (relatedContainer && project.related_projects && project.related_projects.length) {
        relatedContainer.innerHTML = '';
        
        // Find related projects
        const relatedProjects = projects.filter(p => 
            project.related_projects.includes(p.title)
        );
        
        if (relatedProjects.length) {
            const row = document.createElement('div');
            row.className = 'row';
            
            relatedProjects.forEach((relatedProject, index) => {
                const card = createProjectCard(relatedProject, index, 'col-md-6');
                row.appendChild(card);
            });
            
            relatedContainer.appendChild(row);
        } else {
            relatedContainer.innerHTML = '<p>No related projects found</p>';
        }
    }
}

function createProjectCard(project, index, colClass = 'col-lg-4 col-md-6') {
    // Create card container
    const colElement = document.createElement('div');
    colElement.className = `${colClass} mb-4`;
    colElement.setAttribute('data-aos', 'fade-up');
    colElement.setAttribute('data-aos-delay', (index % 3) * 100);
    
    // Create project URL
    const projectUrl = project.link || `project-detail.html#${project.title.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Create skill badges
    const skillBadges = project.skills.map(skill => 
        `<span class="badge badge-primary mr-1">${skill}</span>`
    ).join('');
    
    // Create card HTML
    colElement.innerHTML = `
        <div class="card project-card h-100 shadow-sm">
            <div class="card-img-container">
                <img src="${project.image}" class="card-img-top" alt="${project.title}">
                ${project.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${project.title}</h5>
                <p class="card-text flex-grow-1">${project.description.length > 120 ? project.description.substring(0, 120) + '...' : project.description}</p>
                <div class="skills-container mb-3">
                    ${skillBadges}
                </div>
                <a href="${projectUrl}" class="btn btn-primary mt-auto">View Details</a>
            </div>
        </div>
    `;
    
    return colElement;
}

// ==============================================
// Blog Data Handling
// ==============================================
async function loadLatestBlogs() {
    const container = document.getElementById('latest-blogs-container');
    if (!container) return;
    
    const blogs = await fetchData('data/blog.json');
    if (!blogs) {
        showLoadingError(container);
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    if (blogs.length === 0) {
        container.innerHTML = '<div class="col-12 text-center">No blog posts found.</div>';
        return;
    }
    
    // Get latest 2 blogs
    const latestBlogs = blogs.slice(0, 2);
    
    // Create and append blog cards
    latestBlogs.forEach((blog, index) => {
        const blogCard = createBlogCard(blog, index);
        container.appendChild(blogCard);
    });
}

async function loadAllBlogs() {
    const container = document.getElementById('blogs-container');
    if (!container) return;
    
    const blogs = await fetchData('data/blog.json');
    if (!blogs) {
        showLoadingError(container);
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    if (blogs.length === 0) {
        container.innerHTML = '<div class="col-12 text-center">No blog posts found.</div>';
        return;
    }
    
    // Create and append blog cards
    blogs.forEach((blog, index) => {
        const blogCard = createBlogCard(blog, index);
        container.appendChild(blogCard);
    });
}

async function loadBlogDetail() {
    const container = document.querySelector('.blog-detail-content');
    if (!container) return;
    
    // Get blog title from URL parameter
    const blogTitle = new URLSearchParams(window.location.search).get('title');
    
    if (!blogTitle) {
        container.innerHTML = '<div class="alert alert-warning">Blog post not specified.</div>';
        return;
    }
    
    const blogs = await fetchData('data/blog.json');
    if (!blogs) {
        showLoadingError(container);
        return;
    }
    
    // Find the blog
    const blog = blogs.find(b => 
        b.title.toLowerCase().replace(/\s+/g, '-') === blogTitle.toLowerCase()
    );
    
    if (!blog) {
        container.innerHTML = '<div class="alert alert-warning">Blog post not found.</div>';
        return;
    }
    
    // Set page title
    document.title = `${blog.title} - Blog | Portfolio`;
    
    // Update blog details
    document.getElementById('blog-title').textContent = blog.title;
    document.getElementById('blog-image').src = blog.image;
    document.getElementById('blog-image').alt = blog.title;
    document.getElementById('blog-description').textContent = blog.description;
    
    // Create tag badges
    const tagsContainer = document.getElementById('blog-tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = blog.tags.map(tag => 
            `<span class="badge badge-primary mr-2 mb-2">${tag}</span>`
        ).join('');
    }
    
    // Blog content
    const contentContainer = document.getElementById('blog-content');
    if (contentContainer) {
        contentContainer.textContent = blog.content;
    }
    
    // Related projects
    const relatedContainer = document.getElementById('blog-related-projects');
    if (relatedContainer && blog.related_projects && blog.related_projects.length) {
        relatedContainer.innerHTML = '';
        
        // Get all projects
        const projects = await fetchData('data/projects.json');
        if (!projects) {
            relatedContainer.innerHTML = '<p>Failed to load related projects</p>';
            return;
        }
        
        // Find related projects
        const relatedProjects = projects.filter(p => 
            blog.related_projects.includes(p.title)
        );
        
        if (relatedProjects.length) {
            const row = document.createElement('div');
            row.className = 'row';
            
            relatedProjects.forEach((relatedProject, index) => {
                const card = createProjectCard(relatedProject, index, 'col-md-6');
                row.appendChild(card);
            });
            
            relatedContainer.appendChild(row);
        } else {
            relatedContainer.innerHTML = '<p>No related projects found</p>';
        }
    }
}

function createBlogCard(blog, index, colClass = 'col-lg-6 col-md-6') {
    // Create card container
    const colElement = document.createElement('div');
    colElement.className = `${colClass} mb-4`;
    colElement.setAttribute('data-aos', 'fade-up');
    colElement.setAttribute('data-aos-delay', (index % 2) * 100);
    
    // Create blog URL
    const blogUrl = blog.link || `blog-detail.html?title=${blog.title.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Create tag badges
    const tagBadges = blog.tags.map(tag => 
        `<span class="badge badge-primary mr-1">${tag}</span>`
    ).join('');
    
    // Format date if available
    const dateString = blog.date ? new Date(blog.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '';
    
    // Create card HTML
    colElement.innerHTML = `
        <div class="card blog-card h-100 shadow-sm">
            <div class="card-img-container">
                <img src="${blog.image}" class="card-img-top" alt="${blog.title}">
                ${dateString ? `<span class="date-badge"><i class="far fa-calendar-alt"></i> ${dateString}</span>` : ''}
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${blog.title}</h5>
                <p class="card-text flex-grow-1">${blog.description.length > 150 ? blog.description.substring(0, 150) + '...' : blog.description}</p>
                <div class="tags-container mb-3">
                    ${tagBadges}
                </div>
                <a href="${blogUrl}" class="btn btn-primary mt-auto">Read More</a>
            </div>
        </div>
    `;
    
    return colElement;
}

// ==============================================
// Skills Data Handling
// ==============================================
async function loadSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;
    
    const skills = await fetchData('data/skills.json');
    if (!skills) {
        showLoadingError(container);
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    if (skills.length === 0) {
        container.innerHTML = '<div class="col-12 text-center">No skills found.</div>';
        return;
    }
    
    // Group skills by category if available
    const groupedSkills = {};
    skills.forEach(skill => {
        const category = skill.category || 'Other';
        if (!groupedSkills[category]) {
            groupedSkills[category] = [];
        }
        groupedSkills[category].push(skill);
    });
    
    // Create sections for each category
    Object.keys(groupedSkills).forEach((category, categoryIndex) => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'skills-category mb-5';
        categoryElement.setAttribute('data-aos', 'fade-up');
        categoryElement.setAttribute('data-aos-delay', categoryIndex * 100);
        
        categoryElement.innerHTML = `
            <h3 class="category-title mb-4">${category}</h3>
            <div class="row" id="category-${category.toLowerCase().replace(/\s+/g, '-')}"></div>
        `;
        
        container.appendChild(categoryElement);
        
        const categoryContainer = categoryElement.querySelector('.row');
        
        // Add skills to this category
        groupedSkills[category].forEach((skill, skillIndex) => {
            const skillElement = createSkillItem(skill, skillIndex);
            categoryContainer.appendChild(skillElement);
        });
    });
}

function createSkillItem(skill, index) {
    // Create skill container
    const colElement = document.createElement('div');
    colElement.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
    colElement.setAttribute('data-aos', 'fade-up');
    colElement.setAttribute('data-aos-delay', (index % 4) * 100);
    
    // Create HTML for projects that use this skill
    let projectsHTML = '';
    if (skill.projects && skill.projects.length > 0) {
        const projectLinks = skill.projects.map(project => 
            `<a href="projects.html#${project.toLowerCase().replace(/\s+/g, '-')}" class="skill-project-link">${project}</a>`
        ).join('');
        
        projectsHTML = `
            <div class="skill-projects mt-2">
                <small>Used in:</small>
                <div class="skill-projects-list">
                    ${projectLinks}
                </div>
            </div>
        `;
    }
    
    // Create skill HTML
    colElement.innerHTML = `
        <div class="skill-item text-center">
            <div class="skill-icon">
                <img src="${skill.icon}" alt="${skill.name}" class="img-fluid">
            </div>
            <h5 class="skill-name mt-3">${skill.name}</h5>
            ${projectsHTML}
        </div>
    `;
    
    return colElement;
}

// ==============================================
// Experience Data Handling
// ==============================================
async function loadExperience() {
    const container = document.getElementById('experience-container');
    if (!container) return;
    
    const experiences = await fetchData('data/experience.json');
    if (!experiences) {
        showLoadingError(container);
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    if (experiences.length === 0) {
        container.innerHTML = '<div class="col-12 text-center">No experience entries found.</div>';
        return;
    }
    
    // Create timeline container
    const timelineElement = document.createElement('div');
    timelineElement.className = 'experience-timeline';
    container.appendChild(timelineElement);
    
    // Create and append experience items
    experiences.forEach((experience, index) => {
        const experienceItem = createExperienceItem(experience, index);
        timelineElement.appendChild(experienceItem);
    });
}

function createExperienceItem(experience, index) {
    // Create experience item container
    const itemElement = document.createElement('div');
    itemElement.className = `timeline-item ${index % 2 === 0 ? 'left' : 'right'}`;
    itemElement.setAttribute('data-aos', index % 2 === 0 ? 'fade-right' : 'fade-left');
    itemElement.setAttribute('data-aos-delay', (index % 4) * 100);
    
    // Create responsibilities list
    let responsibilitiesHTML = '';
    if (experience.responsibilities && experience.responsibilities.length > 0) {
        const listItems = experience.responsibilities.map(responsibility => 
            `<li>${responsibility}</li>`
        ).join('');
        
        responsibilitiesHTML = `
            <div class="responsibilities mt-3">
                <h6>Responsibilities:</h6>
                <ul>
                    ${listItems}
                </ul>
            </div>
        `;
    }
    
    // Create skills badges
    let skillsHTML = '';
    if (experience.skills && experience.skills.length > 0) {
        const badges = experience.skills.map(skill => 
            `<span class="badge badge-primary mr-2 mb-2">${skill}</span>`
        ).join('');
        
        skillsHTML = `
            <div class="skills mt-3">
                <h6>Skills Used:</h6>
                <div class="skills-badges">
                    ${badges}
                </div>
            </div>
        `;
    }
    
    // Create experience HTML
    itemElement.innerHTML = `
        <div class="timeline-content shadow-sm">
            <div class="timeline-date">${experience.duration}</div>
            <h4 class="timeline-title">${experience.role}</h4>
            <h5 class="timeline-company">${experience.company}</h5>
            ${responsibilitiesHTML}
            ${skillsHTML}
        </div>
    `;
    
    return itemElement;
}

// ==============================================
// Contact Form Handling
// ==============================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
            showFormError('Please fill in all required fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormError('Please enter a valid email address.');
            return;
        }
        
        // Since GitHub Pages is static, we can't actually process the form
        // In a real implementation, you'd use a service like Formspree or Netlify Forms
        // For now, we'll just simulate success
        showFormSuccess();
        
        // Clear form
        contactForm.reset();
    });
    
    function showFormError(message) {
        const alertElement = document.getElementById('form-alert');
        if (alertElement) {
            alertElement.className = 'alert alert-danger';
            alertElement.textContent = message;
            alertElement.style.display = 'block';
            
            // Hide after 5 seconds
            setTimeout(() => {
                alertElement.style.display = 'none';
            }, 5000);
        }
    }
    
    function showFormSuccess() {
        const alertElement = document.getElementById('form-alert');
        if (alertElement) {
            alertElement.className = 'alert alert-success';
            alertElement.textContent = 'Thank you for your message! Since this is a GitHub Pages site, this form does not actually send emails. In a real website, you would use a service like Formspree or Netlify Forms.';
            alertElement.style.display = 'block';
        }
    }
}

// ==============================================
// Helper Functions
// ==============================================
function showLoadingError(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="col-12 text-center">
            <div class="alert alert-danger">
                Failed to load data. Please try again later.
            </div>
        </div>
    `;
}

// Document ready check - init everything when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize common components
        loadHeader();
        loadFooter();
        initThemeToggle();
        initParticles();
        initScrollToTop();
        initPreloader();
        
        // Page-specific initializations
        initPageContent();
    });
} else {
    // DOM already loaded, init immediately
    loadHeader();
    loadFooter();
    initThemeToggle();
    initParticles();
    initScrollToTop();
    initPreloader();
    
    // Page-specific initializations
    initPageContent();
}