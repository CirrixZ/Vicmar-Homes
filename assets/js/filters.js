function initializeFilters() {
  console.log("Initializing filters...");

  // Make sure we're on the properties page by checking for elements
  if (document.getElementById('location-filter') ||
    document.getElementById('price-filter') ||
    document.getElementById('type-filter')) {
    console.log("Filter elements found, loading properties...");
    loadProperties();

    // Add event listeners to the filter dropdowns
    const locationFilter = document.getElementById('location-filter');
    const priceFilter = document.getElementById('price-filter');
    const typeFilter = document.getElementById('type-filter');

    console.log("Filter elements found:", {
      locationFilter: !!locationFilter,
      priceFilter: !!priceFilter,
      typeFilter: !!typeFilter
    });

    if (locationFilter) locationFilter.addEventListener('change', filterProperties);
    if (priceFilter) priceFilter.addEventListener('change', filterProperties);
    if (typeFilter) typeFilter.addEventListener('change', filterProperties);
  } else {
    console.log("No filter elements found, skipping initialization");
  }
}

// Load properties from JSON
function loadProperties() {
  console.log("Loading properties...");
  fetch('data/properties.json')
    .then(response => {
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Properties loaded:", data.length);
      window.allProperties = data;

      // Initial display of all properties
      displayFilteredResults(data);
      displayPropertyCards(data);
    })
    .catch(error => {
      console.error('Error loading properties:', error);
      // Display error in results area for better debugging
      const resultsContainer = document.getElementById('results-list');
      if (resultsContainer) {
        resultsContainer.innerHTML = `<p class="text-danger">Error loading properties: ${error.message}</p>
        <p>Check that data/properties.json exists and is valid JSON.</p>`;
      }
    });
}

// Filter properties based on selected criteria
function filterProperties() {
  console.log("Filtering properties...");
  if (!window.allProperties) {
    console.error("No properties data available for filtering");
    return;
  }

  const locationFilter = document.getElementById('location-filter');
  const priceFilter = document.getElementById('price-filter');
  const typeFilter = document.getElementById('type-filter');

  const location = locationFilter ? locationFilter.value : 'all';
  const priceRange = priceFilter ? priceFilter.value : 'all';
  const propertyType = typeFilter ? typeFilter.value : 'all';

  console.log("Filter values:", { location, priceRange, propertyType });

  // Filter the properties
  let filtered = window.allProperties.filter(property => {
    // Skip location filter if "all" is selected
    if (location !== 'all' && property.location && !property.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }

    // Filter by price range
    if (priceRange !== 'all') {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      const propertyPrice = parseNumericPrice(property.price);

      if (propertyPrice < minPrice || propertyPrice > maxPrice) {
        return false;
      }
    }

    // Filter by property type
    if (propertyType !== 'all' && property.type && property.type !== propertyType) {
      return false;
    }

    return true;
  });

  console.log("Filtered properties:", filtered.length);

  // Display the filtered results
  displayFilteredResults(filtered);
  displayPropertyCards(filtered);
}

// Helper function to parse price from string format
function parseNumericPrice(priceString) {
  if (!priceString) return 0;

  // Remove all non-digit characters
  const numericString = priceString.replace(/[^\d]/g, '');
  return parseInt(numericString) || 0;
}

// Display filtered results in the results box
function displayFilteredResults(properties) {
  const resultsContainer = document.getElementById('results-list');

  if (!resultsContainer) {
    console.error("Results container not found");
    return;
  }

  // Clear previous results
  resultsContainer.innerHTML = '';

  if (!properties || properties.length === 0) {
    resultsContainer.innerHTML = '<p>No properties match your criteria.</p>';
    return;
  }

  // Create a list of property names
  properties.forEach(property => {
    const propertyItem = document.createElement('div');
    propertyItem.className = 'py-2 border-bottom';

    propertyItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-0">${property.name || 'Unnamed Property'}</h6>
          <span class="text-muted small">${property.type || 'Property'}</span>
        </div>
        <button class="btn btn-sm btn-outline-success" 
                onclick="loadPage('property-details', {id: '${property.id}'})">
          View Details
        </button>
      </div>
    `;

    resultsContainer.appendChild(propertyItem);
  });
}

// Display property cards in the featured properties section
function displayPropertyCards(properties) {
  const cardsContainer = document.getElementById('property-cards');

  if (!cardsContainer) {
    console.error("Cards container not found");
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
      `${property.bathrooms} Bath${property.bathrooms !== 1 ? 's' : ''}` :
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