// Copyright (C) Nicholas johnson 2022

import App from './App.js'

// waits for every request before running javacript
document.addEventListener('DOMContentLoaded', event => {
    // Execute main app
    const app = new App();
    app.run()
})

