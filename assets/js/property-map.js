// Property data is loaded from propertyData.json

// Function to show property info popup with flexible number of units
function showPropertyInfo(event, info) {
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
            <div style="text-align: center; padding: 10px;">
                <h4>Lot ${info.lotNum}</h4>
                <table style="margin: 0 auto;">
                    <tr>
                        <td style="text-align: right; padding-right: 10px;">Lot Area:</td>
                        <td style="text-align: left;">${info.lotArea} sqm</td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-right: 10px;">Status:</td>
                        <td style="text-align: left;">${info.availability}</td>
                    </tr>
                </table>
            </div>
        `;
    } else if (units.length > 0) {
        // Multi-unit property (duplex, triplex) - maintain original layout
        popupHTML += '<div class="units-container">';

        units.forEach(unit => {
            const unitLetter = unit.key.replace('unit', '');
            popupHTML += `
                <div class="unit-info">
                    <h4 class="unit-title">Unit ${unitLetter} - Lot ${unit.data.lotNum}</h4>
                    <p><span class="label">Lot Area:</span> <span class="value">${unit.data.lotArea} sqm</span></p>
                    <p><span class="label">Status:</span> <span class="value">${unit.data.availability}</span></p>
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
    propertyInfo.classList.remove('visible');
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
    });

    hitArea.addEventListener('mouseleave', () => {
        hidePropertyInfo();
        svg.classList.remove('hover');
    });

    return {
        svg: svg,
        hitArea: hitArea
    };
}

// Function to setup highlighted areas
function setupHighlightedAreas() {
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
    fetch('../data/propertyData.json')
        .then(response => response.json())
        .then(data => {
            // Store the property data globally
            window.propertyData = data;
            
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
        })
        .catch(error => {
            console.error("Error loading property data:", error);
        });
}

// Function to scale highlights based on image size
function scaleHighlights() {
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

// Get elements - wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const baseMap = document.getElementById('baseMap');
    const mapWrapper = document.getElementById('mapWrapper');
    const propertyInfo = document.getElementById('propertyInfo');
    const highlightContainer = document.getElementById('highlightContainer');
    
    // Make these variables global so they can be accessed by all functions
    window.baseMap = baseMap;
    window.mapWrapper = mapWrapper;
    window.propertyInfo = propertyInfo;
    window.highlightContainer = highlightContainer;

    // If image is already loaded
    if (baseMap.complete) {
        setupHighlightedAreas();
    } else {
        // Wait for image to load
        baseMap.addEventListener('load', setupHighlightedAreas);
    }

    // Handle window resize
    window.addEventListener('resize', scaleHighlights);
});