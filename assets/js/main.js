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

// Display property cards in the featured properties section
function displayPropertyCards(properties) {
    const cardsContainer = document.getElementById('property-cards');

    if (!cardsContainer) {
        console.log("Property cards container not found on this page");
        return;
    }

    // Clear previous cards
    cardsContainer.innerHTML = '';

    if (!properties || properties.length === 0) {
        cardsContainer.innerHTML = '<div class="col-12 text-center"><p>No properties match your criteria.</p></div>';
        return;
    }

    // Create property cards
    properties.forEach(property => {
        const card = document.createElement('div');
        card.className = 'col';

        const bedroomText = property.bedrooms ?
            `${property.bedrooms.default} Bedroom${property.bedrooms.default !== 1 ? 's' : ''}` :
            'N/A';

        const bathroomText = property.bathrooms ?
            `${property.bathrooms} Bathroom${property.bathrooms !== 1 ? 's' : ''}` :
            'N/A';

        card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="assets/images/Properties/${property.images?.main || 'placeholder.jpg'}" 
               class="card-img-top" alt="${property.name || 'Property'}" 
               style="height: 200px; object-fit: cover;"
               onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
          <div class="card-body">
            <h5 class="card-title">${property.name || 'Unnamed Property'}</h5>
            <p class="card-text text-success fw-bold">${property.price || 'Price upon request'}</p>
            <p class="card-text">
              <small class="text-muted">
                ${bedroomText} | ${bathroomText} | ${property.floorArea || 'N/A'}
              </small>
            </p>
          </div>
          <div class="card-footer bg-white border-top-0">
            <button class="btn btn-success w-100" 
                    onclick="loadPage('property-details', {id: '${property.id}'})">
              View Details
            </button>
          </div>
        </div>
      `;

        cardsContainer.appendChild(card);
    });
}