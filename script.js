// script.js

// Example: Fractal or Particle Background Animation
// You can implement a simple canvas-based animation or use SVG animations.
// For simplicity, this example does not include a complex animation.

// Initialize tooltips for Skills Page
document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});

// Additional interactive elements can be added here
