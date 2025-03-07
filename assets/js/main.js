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