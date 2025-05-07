// Function to initialize the 360 panorama viewer
function initialize360Viewer(propertyId) {
    console.log("Initializing 360 viewer for property ID:", propertyId);

    // Check if the panorama container exists
    const panoramaElement = document.getElementById('panorama');
    if (!panoramaElement) {
        console.error('Panorama container not found');
        return;
    }

    // Check if Pannellum is loaded
    if (typeof pannellum === 'undefined') {
        console.error('Pannellum library not loaded');
        return;
    }

    // Map property IDs to their corresponding 360 images
    const property360Images = {
        'duplex-unit-deluxe1': 'assets/images/360/360-Duplex-Deluxe.jpg',
        'duplex-unit-premiere': 'assets/images/360/360-Duplex-Primere.jpg',
        'corner-unit': 'assets/images/360/360-Corner-Unit.jpg',
        // Add more properties as needed
    };

    // Define a placeholder image to use when no 360 image is available
    const placeholderImage = 'https://placehold.co/600x400?text=360+Not+Found';

    // Get the correct image path based on propertyId or use a default if not found
    let panoramaPath = property360Images[propertyId] || placeholderImage;

    // Initialize the panorama viewer with settings
    try {
        pannellum.viewer('panorama', {
            type: 'equirectangular',
            panorama: panoramaPath,
            autoLoad: true,
            autoRotate: -2,
            compass: true,
            showZoomCtrl: true,
            showFullscreenCtrl: true,
            hfov: 120,
            minHfov: 50,
            maxHfov: 120,
            pitch: 0,
            yaw: 0,
            showControls: true,
            hotSpotDebug: false
        });
        console.log("360 viewer initialized successfully with image:", panoramaPath);
    } catch (error) {
        console.error("Error initializing 360 viewer:", error);
    }
}