// Property data is loaded from propertyData.json

// Global variables for map elements
let baseMap;
let mapWrapper;
let propertyInfo;
let highlightContainer;

// Function to show property info popup with flexible number of units
function showPropertyInfo(event, info) {
    // Ensure propertyInfo is available
    if (!propertyInfo) {
        console.error("Property info element not found");
        return;
    }
    
    // Get pointer position
    const rect = mapWrapper.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Start building the HTML for the popup
    let popupHTML = `
        <h3 class="property-header">Block ${info.blockNum} - ${info.type}</h3>
    `;

    // Check what units are available and add them dynamically
    const units = [];
    if (info.unitA) units.push({ key: 'unitA', data: info.unitA });
    if (info.unitB) units.push({ key: 'unitB', data: info.unitB });
    if (info.unitC) units.push({ key: 'unitC', data: info.unitC });

    // For single unit properties that don't have unit designations
    if (units.length === 0 && info.lotNum) {
        // Single unit property (like row house)
        popupHTML += `
            <div class="single-unit">
                <table class="single-unit-table">
                    <tr>
                        <td>Lot Number:</td>
                        <td>${info.lotNum}</td>
                    </tr>
                    <tr>
                        <td>Lot Area:</td>
                        <td>${info.lotArea} sqm</td>
                    </tr>
                    <tr>
                        <td>Status:</td>
                        <td>${info.availability}</td>
                    </tr>
                </table>
            </div>
        `;
    } else if (units.length > 0) {
        // Add class based on number of units
        let unitContainerClass = '';
        if (units.length === 2) unitContainerClass = 'two-units';
        else if (units.length === 3) unitContainerClass = 'three-units';
        
        // Multi-unit property (duplex, triplex)
        popupHTML += `<div class="units-container ${unitContainerClass}">`;

        units.forEach(unit => {
            const unitLetter = unit.key.replace('unit', '');
            let availabilityClass = '';
            
            // Add class for status coloring
            if (unit.data.availability.toLowerCase() === 'available') {
                availabilityClass = 'available';
            } else if (unit.data.availability.toLowerCase() === 'sold') {
                availabilityClass = 'sold';
            } else if (unit.data.availability.toLowerCase() === 'reserved') {
                availabilityClass = 'reserved';
            }

            popupHTML += `
                <div class="unit-info">
                    <h4 class="unit-title">Unit ${unitLetter} - Lot ${unit.data.lotNum}</h4>
                    <p><span class="label">Lot Area:</span> <span class="value">${unit.data.lotArea} sqm</span></p>
                    <p><span class="label">Status:</span> <span class="value ${availabilityClass}">${unit.data.availability}</span></p>
                </div>
            `;
        });

        popupHTML += '</div>';
    }

    // Add the footer
    popupHTML += `
        <div class="property-footer">
            ${info.phase} • ${info.type} Property
        </div>
    `;

    // Set popup content
    propertyInfo.innerHTML = popupHTML;

    // Position the popup
    propertyInfo.style.left = `${x + 10}px`;
    propertyInfo.style.top = `${y + 10}px`;

    // Check if popup would extend beyond the right edge
    const popupRect = propertyInfo.getBoundingClientRect();
    if (x + popupRect.width + 20 > rect.width) {
        propertyInfo.style.left = `${x - popupRect.width - 10}px`;
    }

    // Check if popup would extend beyond the bottom edge
    if (y + popupRect.height + 20 > rect.height) {
        propertyInfo.style.top = `${y - popupRect.height - 10}px`;
    }

    // Show the popup
    propertyInfo.classList.add('visible');
}

// Function to hide property info popup
function hidePropertyInfo() {
    if (propertyInfo) {
        propertyInfo.classList.remove('visible');
    }
}

// Function to create polygonal highlighted area from coordinates
function createHighlightedArea(coordsString, info, groupClass) {
    // Parse the coordinates
    const points = coordsString.split(',').map(Number);
    const coordinates = [];

    // Group coordinates into points
    for (let i = 0; i < points.length; i += 2) {
        coordinates.push({
            x: points[i],
            y: points[i + 1]
        });
    }

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.pointerEvents = "none";
    svg.classList.add("highlight-area");

    // Create polygon element
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", coordsString);
    polygon.classList.add(`${groupClass}-polygon`);

    svg.appendChild(polygon);

    // Create an invisible div that covers the polygon for mouse events
    const hitArea = document.createElement("div");
    hitArea.style.position = "absolute";

    // Create polygon path for clip-path
    const clipPath = `polygon(${coordinates.map(point => `${point.x}px ${point.y}px`).join(', ')})`;
    hitArea.style.clipPath = clipPath;
    hitArea.style.webkitClipPath = clipPath;

    // Set full size and position
    hitArea.style.top = "0";
    hitArea.style.left = "0";
    hitArea.style.width = "100%";
    hitArea.style.height = "100%";
    hitArea.style.cursor = "pointer";

    // Add mouse events
    hitArea.addEventListener('mousemove', (e) => {
        showPropertyInfo(e, info);
        svg.classList.add('hover');
        // Add hover class to specific polygon type
        const polygonElement = svg.querySelector(`.${groupClass}-polygon`);
        if (polygonElement) {
            polygonElement.classList.add('hover');
        }
    });

    hitArea.addEventListener('mouseleave', () => {
        hidePropertyInfo();
        svg.classList.remove('hover');
        // Remove hover class from specific polygon type
        const polygonElement = svg.querySelector(`.${groupClass}-polygon`);
        if (polygonElement) {
            polygonElement.classList.remove('hover');
        }
    });

    return {
        svg: svg,
        hitArea: hitArea
    };
}

// Function to setup highlighted areas
function setupHighlightedAreas() {
    console.log("Setting up highlighted areas...");
    
    // Get references to the elements
    baseMap = document.getElementById('baseMap');
    mapWrapper = document.getElementById('mapWrapper');
    propertyInfo = document.getElementById('propertyInfo');
    highlightContainer = document.getElementById('highlightContainer');
    
    // Check if required elements exist
    if (!baseMap || !mapWrapper || !propertyInfo || !highlightContainer) {
        console.error("Required map elements not found: ", {
            baseMap: !!baseMap,
            mapWrapper: !!mapWrapper,
            propertyInfo: !!propertyInfo,
            highlightContainer: !!highlightContainer
        });
        return;
    }
    
    console.log("Map elements found, continuing initialization...");
    
    // Clear existing highlights
    highlightContainer.innerHTML = '';

    // Create a container for SVGs
    const svgContainer = document.createElement('div');
    svgContainer.style.position = 'absolute';
    svgContainer.style.top = '0';
    svgContainer.style.left = '0';
    svgContainer.style.width = '100%';
    svgContainer.style.height = '100%';
    svgContainer.style.pointerEvents = 'none';

    // Create a container for hit areas
    const hitAreaContainer = document.createElement('div');
    hitAreaContainer.style.position = 'absolute';
    hitAreaContainer.style.top = '0';
    hitAreaContainer.style.left = '0';
    hitAreaContainer.style.width = '100%';
    hitAreaContainer.style.height = '100%';

    // Add containers to the main container
    highlightContainer.appendChild(svgContainer);
    highlightContainer.appendChild(hitAreaContainer);

    // Fetch the property data from JSON file
    fetch('../data/propertyData.json')  // Use relative path from pages directory
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load property data: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Property data loaded successfully:", Object.keys(data));
            
            // Create highlighted areas for each property
            for (const [type, properties] of Object.entries(data)) {
                properties.forEach(property => {
                    const elements = createHighlightedArea(property.coords, property.info, property.group);
                    svgContainer.appendChild(elements.svg);
                    hitAreaContainer.appendChild(elements.hitArea);
                });
            }
            
            // Scale highlights based on image size
            scaleHighlights();
            console.log("Map initialization complete!");
        })
        .catch(error => {
            console.error("Error loading property data:", error);
        });
}

// Function to scale highlights based on image size
function scaleHighlights() {
    if (!baseMap || !highlightContainer) return;
    
    const imageNaturalWidth = baseMap.naturalWidth || 1200; // Assuming natural width is 1200px
    const imageWidth = baseMap.offsetWidth;
    const scale = imageWidth / imageNaturalWidth;

    // Apply scaling to highlight container
    highlightContainer.style.position = 'absolute';
    highlightContainer.style.top = '0';
    highlightContainer.style.left = '0';
    highlightContainer.style.width = '100%';
    highlightContainer.style.height = '100%';
    highlightContainer.style.transform = `scale(${scale})`;
    highlightContainer.style.transformOrigin = 'top left';
}

// Initialize the map when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded - checking for map elements...");
    
    // Check if we're on a page with the map
    if (document.getElementById('mapContainer')) {
        console.log("Map container found, initializing map...");
        
        const baseMapImg = document.getElementById('baseMap');
        if (baseMapImg) {
            if (baseMapImg.complete) {
                console.log("Base map image already loaded, setting up highlights");
                setupHighlightedAreas();
            } else {
                console.log("Waiting for base map image to load...");
                baseMapImg.addEventListener('load', setupHighlightedAreas);
            }
        } else {
            console.error("Base map image not found");
        }
    } else {
        console.log("Map container not found - not on map page");
    }
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', scaleHighlights);
});

// Export the setup function so it can be called from index.html
window.setupHighlightedAreas = setupHighlightedAreas;