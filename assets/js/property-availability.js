/**
 * Determine if a property is available for detailed viewing
 * @param {string} propertyId - The ID of the property
 * @returns {boolean} - Whether the property details are available
 */
function isPropertyDetailsAvailable(propertyId) {
  // Convert property ID to lowercase for case-insensitive comparison
  const id = propertyId.toLowerCase();
  
  // Check if the property ID matches one of the priority types
  return id.includes('duplex') || 
         id === 'corner-unit' || 
         id === 'rowhouse-economic-unit';
}

// Override the existing displayPropertyCards function
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

  // Apply priority sorting if the function exists
  const sortedProperties = typeof sortPropertiesByPriority === 'function' ? 
      sortPropertiesByPriority(properties) : properties;

  // Create property cards
  sortedProperties.forEach(property => {
      const card = document.createElement('div');
      card.className = 'col';

      const bedroomText = property.bedrooms ?
          `${property.bedrooms.default} Bedroom${property.bedrooms.default !== 1 ? 's' : ''}` :
          'N/A';

      const bathroomText = property.bathrooms ?
          `${property.bathrooms} Bathroom${property.bathrooms !== 1 ? 's' : ''}` :
          'N/A';
          
      // Check if property details are available
      const detailsAvailable = isPropertyDetailsAvailable(property.id);
      
      // Create button with appropriate styling and functionality
      const buttonHtml = detailsAvailable ? 
          `<button class="btn btn-success w-100" 
                  onclick="loadPage('property-details', {id: '${property.id}'})">
            View Details
          </button>` :
          `<button class="btn btn-secondary w-100" disabled>
            Details Coming Soon
          </button>`;

      card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="assets/images/Properties/${property.images?.main || 'placeholder.jpg'}" 
             class="card-img-top" alt="${property.name || 'Property'}" 
             style="height: 200px; object-fit: cover;"
             onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="card-body">
          <h5 class="card-title">${property.name || 'Unnamed Property'}</h5>
          <p class="card-text text-success fw-bold">${property.price ? `PHP ${property.price}` : 'Price upon request'}</p>
          <p class="card-text">
            <small class="text-muted">
              ${bedroomText} | ${bathroomText} | ${property.floorArea || 'N/A'}
            </small>
          </p>
        </div>
        <div class="card-footer bg-white border-top-0">
          ${buttonHtml}
        </div>
      </div>
    `;

      cardsContainer.appendChild(card);
  });
}