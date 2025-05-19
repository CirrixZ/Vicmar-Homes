function loadPropertyDetails(propertyId) {
            console.log("Loading property details for ID:", propertyId);

            fetch('data/properties.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(properties => {
                    // Find the property with the matching ID
                    const property = properties.find(p => p.id === propertyId);

                    if (property) {
                        console.log("Property found:", property.name);

                        // Populate the main property image
                        const mainImage = document.getElementById('property-main-image');
                        if (mainImage) {
                            const mainImagePath = `assets/images/properties/${property.images.main}`;
                            console.log("Main image path:", mainImagePath);
                            mainImage.src = mainImagePath;
                            mainImage.alt = property.name;
                            mainImage.onerror = () => {
                                console.error(`Failed to load main image: ${mainImagePath}`);
                                mainImage.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                            };
                        }

                        // Populate property overview details
                        document.getElementById('property-name').textContent = property.name;
                        document.getElementById('property-price').textContent = property.price ? `PHP ${property.price}` : 'Price upon request';
                        document.getElementById('property-lot-area').textContent = property.lotArea;
                        document.getElementById('property-floor-area').textContent = property.floorArea;

                        // Populate bedroom information
                        const bedroomsElement = document.getElementById('property-bedrooms');
                        if (bedroomsElement) {
                            bedroomsElement.innerHTML = '';

                            // Add default bedroom info
                            const defaultBedroomPara = document.createElement('p');
                            defaultBedroomPara.className = 'mb-1';
                            defaultBedroomPara.textContent = `${property.bedrooms.default}-BEDROOM, ${property.bathrooms}-TOILET&BATH`;
                            bedroomsElement.appendChild(defaultBedroomPara);

                            // Add optional bedroom configurations
                            if (property.bedrooms.options && property.bedrooms.options.length > 0) {
                                property.bedrooms.options.forEach(option => {
                                    const optionPara = document.createElement('p');
                                    optionPara.className = 'mb-1';
                                    optionPara.textContent = `(OPTIONAL ${option}-BEDROOM, ${property.bathrooms}-TOILET&BATH)`;
                                    bedroomsElement.appendChild(optionPara);
                                });
                            }
                        }

                        // Populate interior images
                        const interiorImagesContainer = document.getElementById('property-interior-images');
                        if (interiorImagesContainer) {
                            interiorImagesContainer.innerHTML = '';

                            if (property.images.interior && property.images.interior.length > 0) {
                                property.images.interior.forEach((imgSrc, index) => {
                                    const imgCol = document.createElement('div');
                                    imgCol.className = 'col';

                                    const img = document.createElement('img');
                                    const interiorPath = `assets/images/properties/${imgSrc}`;
                                    console.log(`Interior image ${index + 1} path:`, interiorPath);
                                    img.src = interiorPath;
                                    img.alt = `Interior Design ${index + 1}`;
                                    img.className = 'img-fluid rounded';
                                    img.onerror = () => {
                                        console.error(`Failed to load interior image: ${interiorPath}`);
                                        img.src = 'https://placehold.co/250x200?text=Interior+Image';
                                    };

                                    imgCol.appendChild(img);
                                    interiorImagesContainer.appendChild(imgCol);
                                });
                            } else {
                                console.warn("No interior images found for this property");
                            }
                        }

                        // Populate ground floor image and areas
                        console.log("Floor plans data:", property.floorPlans);

                        const groundFloorImage = document.getElementById('ground-floor-image');
                        if (groundFloorImage && property.floorPlans && property.floorPlans.groundFloor) {
                            // Try different path formats to handle various path structures
                            const groundFloorPath = `assets/images/floor_plan/${property.floorPlans.groundFloor.image}`;
                            console.log("Ground floor image path:", groundFloorPath);
                            groundFloorImage.src = groundFloorPath;
                        }

                        const groundFloorAreas = document.getElementById('ground-floor-areas');
                        if (groundFloorAreas && property.floorPlans && property.floorPlans.groundFloor && property.floorPlans.groundFloor.areas) {
                            // Keep the header row
                            groundFloorAreas.innerHTML = '<tr><td>Area</td><td>SQM</td></tr>';

                            property.floorPlans.groundFloor.areas.forEach(area => {
                                const row = document.createElement('tr');

                                const nameCell = document.createElement('td');
                                nameCell.textContent = area.name;

                                const areaCell = document.createElement('td');
                                areaCell.textContent = area.area;

                                row.appendChild(nameCell);
                                row.appendChild(areaCell);
                                groundFloorAreas.appendChild(row);
                            });
                        }

                        // Populate second floor image and areas
                        const secondFloorImage = document.getElementById('second-floor-image');
                        if (secondFloorImage && property.floorPlans && property.floorPlans.secondFloor) {
                            const secondFloorPath = `assets/images/floor_plan/${property.floorPlans.secondFloor.image}`;
                            console.log("Second floor image path:", secondFloorPath);
                            secondFloorImage.src = secondFloorPath;
                        }

                        // Conditionally show/hide second floor section
                        const secondFloorSection = document.getElementById('second-floor-section');
                        if (property.floorPlans && property.floorPlans.secondFloor) {
                            secondFloorSection.style.display = 'block';
                        } else {
                            secondFloorSection.style.display = 'none';
                        }

                        const secondFloorAreas = document.getElementById('second-floor-areas');
                        if (secondFloorAreas && property.floorPlans && property.floorPlans.secondFloor && property.floorPlans.secondFloor.areas) {
                            // Keep the header row
                            secondFloorAreas.innerHTML = '<tr><td>Area</td><td>SQM</td></tr>';

                            property.floorPlans.secondFloor.areas.forEach(area => {
                                const row = document.createElement('tr');

                                const nameCell = document.createElement('td');
                                nameCell.textContent = area.name;

                                const areaCell = document.createElement('td');
                                areaCell.textContent = area.area;

                                row.appendChild(nameCell);
                                row.appendChild(areaCell);
                                secondFloorAreas.appendChild(row);
                            });
                        }

                        // Initialize the 360 viewer after all property details are loaded
                        setTimeout(() => {
                            if (typeof initialize360Viewer === 'function') {
                                initialize360Viewer(propertyId);
                            } else {
                                console.error("360 viewer initialization function not found");
                            }
                        }, 200);
                    } else {
                        console.error('Property not found:', propertyId);
                        document.getElementById('content-container').innerHTML = `
                    <div class="container my-5 text-center">
                        <div class="alert alert-danger">
                            <h3>Property Not Found</h3>
                            <p>The property with ID "${propertyId}" could not be found.</p>
                            <button class="btn btn-primary mt-3" onclick="loadPage('home')">Return to Home</button>
                        </div>
                    </div>
                `;
                    }
                })
                .catch(error => {
                    console.error('Error loading property details:', error);
                    document.getElementById('content-container').innerHTML = `
                <div class="container my-5 text-center">
                    <div class="alert alert-danger">
                        <h3>Error Loading Property</h3>
                        <p>${error.message}</p>
                        <button class="btn btn-primary mt-3" onclick="loadPage('home')">Return to Home</button>
                    </div>
                </div>
            `;
                });
        }