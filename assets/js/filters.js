// assets/js/filters.js

// Initialize property filters
function initializeFilters() {
    loadProperties();
    
    // Add event listeners to the filter dropdowns
    document.getElementById('location-filter')?.addEventListener('change', filterProperties);
    document.getElementById('price-filter')?.addEventListener('change', filterProperties);
    document.getElementById('type-filter')?.addEventListener('change', filterProperties);
  }
  
  // Load properties from JSON
  function loadProperties() {
    fetch('data/properties.json')
      .then(response => response.json())
      .then(data => {
        // Store properties in a global variable for filtering
        window.allProperties = data;
        
        // Initial display of all properties
        displayFilteredResults(data);
        displayPropertyCards(data);
      })
      .catch(error => {
        console.error('Error loading properties:', error);
      });
  }
  
  // Filter properties based on selected criteria
  function filterProperties() {
    if (!window.allProperties) return;
    
    const location = document.getElementById('location-filter').value;
    const priceRange = document.getElementById('price-filter').value;
    const propertyType = document.getElementById('type-filter').value;
    
    // Filter the properties
    let filtered = window.allProperties.filter(property => {
      // Skip location filter if "all" is selected
      if (location !== 'all' && !property.location?.toLowerCase().includes(location.toLowerCase())) {
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
      if (propertyType !== 'all' && property.type !== propertyType) {
        return false;
      }
      
      return true;
    });
    
    // Display the filtered results
    displayFilteredResults(filtered);
    displayPropertyCards(filtered);
  }
  
  // Helper function to parse price from string format
  function parseNumericPrice(priceString) {
    return parseInt(priceString.replace(/[^\d]/g, ''));
  }
  
  // Display filtered results in the results box
  function displayFilteredResults(properties) {
    const resultsContainer = document.getElementById('results-list');
    
    if (!resultsContainer) return;
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    if (properties.length === 0) {
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
            <h6 class="mb-0">${property.name}</h6>
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
    
    if (!cardsContainer) return;
    
    // Clear previous cards
    cardsContainer.innerHTML = '';
    
    // Create property cards
    properties.forEach(property => {
      const card = document.createElement('div');
      card.className = 'col';
      
      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="assets/images/Properties/${property.images.main}" class="card-img-top" alt="${property.name}" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${property.name}</h5>
            <p class="card-text text-success fw-bold">${property.price}</p>
            <p class="card-text">
              <small class="text-muted">
                ${property.bedrooms.default} Bedroom${property.bedrooms.default !== 1 ? 's' : ''} | 
                ${property.bathrooms} Bath${property.bathrooms !== 1 ? 's' : ''} | 
                ${property.floorArea}
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