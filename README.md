# Retro

A slideshow presentation server for retro presentations in French.

## Features

- Express server running on port 8026
- Serves static files from the `public` folder
- Common slideshow.js for keyboard navigation
- Socket.IO integration for real-time updates across multiple clients
- Beautiful, responsive presentation design

## Installation

```bash
npm install
```

## Usage

Start the server:

```bash
npm start
```

Then open your browser to:

- Main retro: http://localhost:8026/marché-de-noel/index.html
- Aperture retro: http://localhost:8026/aperture/index.html

## Keyboard Controls

- **Arrow Right / Arrow Down / Space**: Next slide
- **Arrow Left / Arrow Up**: Previous slide
- **Home**: Go to first slide
- **End**: Go to last slide

## Structure

```
├── server.js                          # Express server with Socket.IO
├── public/                           # Public folder served by Express
│   ├── slideshow.js                  # Common slideshow functionality
│   └── marché-de-noel/              # Current retro presentation
│       └── index.html               # Marché de Noël presentation
└── package.json                     # Project dependencies
```

## Adding New Retros

To add a new retro presentation:

1. Create a new folder in `public/` (e.g., `public/my-retro/`)
2. Create an `index.html` file in that folder
3. Include the slideshow.js script and Socket.IO client:
    ```html
    <script src="/socket.io/socket.io.js"></script>
    <script src="/slideshow.js"></script>
    ```
4. Structure your slides with the class `slide`:
    ```html
    <div class="slide">
    	<h1>My Slide Title</h1>
    	<p>Slide content</p>
    </div>
    ```
5. Access your retro at http://localhost:8026/my-retro/index.html

## License

ISC
