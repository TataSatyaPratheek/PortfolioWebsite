// script.js

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
