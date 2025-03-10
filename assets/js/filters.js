function initializeFilters() {
  console.log("Initializing filters...");

  // Make sure we're on the properties page by checking for elements
  if (document.getElementById('location-filter') &&
    document.getElementById('price-filter') &&
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