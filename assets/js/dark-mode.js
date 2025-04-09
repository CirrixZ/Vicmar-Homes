// Check for dark mode preference on initial page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait for navbar to be loaded
    setTimeout(function() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            // Check local storage
            if (localStorage.getItem('darkMode') === 'enabled') {
                enableDarkMode();
                darkModeToggle.checked = true;
            }
            
            // Add event listener
            darkModeToggle.addEventListener('change', function() {
                if (this.checked) {
                    enableDarkMode();
                } else {
                    disableDarkMode();
                }
            });
        }
    }, 500); // Give time for navbar to load
});

// Function to toggle dark mode from navbar toggle
function toggleDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

// Function to enable dark mode
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
}

// Function to disable dark mode
function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', null);
}

// Add event listener for content changes
// This ensures dark mode persists when loading new pages
const contentContainer = document.getElementById('content-container');
if (contentContainer) {
    const observer = new MutationObserver(function(mutations) {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.checked = true;
            }
        }
    });
    
    observer.observe(contentContainer, { childList: true });
}

// Also observe the navbar container to ensure toggle state persists
const navbarContainer = document.getElementById('navbar-container');
if (navbarContainer) {
    const navObserver = new MutationObserver(function(mutations) {
        setTimeout(function() {
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle && localStorage.getItem('darkMode') === 'enabled') {
                darkModeToggle.checked = true;
            }
        }, 100);
    });
    
    navObserver.observe(navbarContainer, { childList: true });
}