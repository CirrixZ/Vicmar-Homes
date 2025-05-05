/**
 * Sort properties based on a predefined priority order
 * Priority: Duplex, Corner Unit, Rowhouse Economic, Triplex, Others
 */
function sortPropertiesByPriority(properties) {
    // Define property types and their priority (lower number = higher priority)
    const priorityMap = {
        'duplex': 1,  // All Duplex units
        'corner-unit': 2,  // Corner units
        'rowhouse-economic-unit': 3,  // Rowhouse Economic
        'triplex': 4,  // All Triplex units
        'rowhouse': 5,  // Other Rowhouse units
        'other': 6  // Everything else
    };

    // Helper function to determine the priority of a property
    function getPropertyPriority(property) {
        const id = property.id.toLowerCase();
        
        if (id.includes('duplex')) {
            return priorityMap['duplex'];
        } else if (id === 'corner-unit') {
            return priorityMap['corner-unit'];
        } else if (id === 'rowhouse-economic-unit') {
            return priorityMap['rowhouse-economic-unit'];
        } else if (id.includes('triplex')) {
            return priorityMap['triplex'];
        } else if (id.includes('rowhouse')) {
            return priorityMap['rowhouse'];
        } else {
            return priorityMap['other'];
        }
    }

    // Sort properties based on priority
    return [...properties].sort((a, b) => {
        const priorityA = getPropertyPriority(a);
        const priorityB = getPropertyPriority(b);
        
        return priorityA - priorityB;
    });
}

// Note: We're no longer overriding displayPropertyCards here
// since our new implementation in property-availability.js
// already handles sorting by calling sortPropertiesByPriority

// Make the function available globally
window.sortPropertiesByPriority = sortPropertiesByPriority;