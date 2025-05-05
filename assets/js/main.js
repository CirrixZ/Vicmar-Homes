document.addEventListener('DOMContentLoaded', function () {
    // Load the navigation bar
    fetch('components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
        });

    // Load the footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        });

    // Load the home page by default
    fetch('pages/home.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('content-container').innerHTML = data;
            // Initialize components after loading content
            initializeCarousels();
            initializeFilters();
        });
});

// Global variable to track the previous page
let previousPage = 'listing'; // Default to properties

// Modify your loadPropertyDetails function to capture the origin page
function loadPropertyDetails(propertyId) {
    // Capture the current page before loading property details
    previousPage = window.location.href.includes('listing.html') ? 'listing' : 'properties';

    // Rest of your existing loadPropertyDetails function...
}

// Modify the Go Back button's onclick function
function goBackToPreviousPage() {
    loadPage(previousPage);
}