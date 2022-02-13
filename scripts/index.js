// Main start Minesweeper

import App from './App.js'

// waits for every request before running javacript
document.addEventListener('DOMContentLoaded', event => {
    // Execute main app
    const app = new App(0);
    app.run()
})

