/**
 * Slideshow.js - Common slideshow functionality
 * Handles keyboard events and Socket.IO communication for retro presentations
 */

class Slideshow {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.socket = null;
        
        this.init();
    }

    init() {
        // Initialize Socket.IO
        this.socket = io();

        // Set up keyboard event listeners
        this.setupKeyboardEvents();

        // Listen for slide changes from other clients
        this.socket.on('slideChange', (data) => {
            this.goToSlide(data.slideIndex, false);
        });

        // Show the first slide
        this.showSlide(this.currentSlide);
    }

    setupKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ': // Space bar
                    event.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault();
                    this.previousSlide();
                    break;
                case 'Home':
                    event.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    event.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
            }
        });
    }

    showSlide(n) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // Ensure index is within bounds
        if (n >= this.slides.length) {
            this.currentSlide = this.slides.length - 1;
        } else if (n < 0) {
            this.currentSlide = 0;
        } else {
            this.currentSlide = n;
        }

        // Show the current slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].style.display = 'flex';
        }
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(index, broadcast = true) {
        this.showSlide(index);
        
        // Broadcast the change to other clients via Socket.IO
        if (broadcast && this.socket) {
            this.socket.emit('slideChange', {
                slideIndex: this.currentSlide
            });
        }
    }
}

// Initialize slideshow when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Slideshow();
});
