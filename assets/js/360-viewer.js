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
    
    // Path to the 360 image - can be customized per property if needed
    let panoramaPath = 'assets/images/properties/360-view.jpg';
    
    // If you want to have different 360 views for different properties, 
    // you could use propertyId to determine which image to load
    // Example:
    // if (propertyId === 'property1') {
    //     panoramaPath = 'assets/images/properties/property1-360.jpg';
    // } else if (propertyId === 'property2') {
    //     panoramaPath = 'assets/images/properties/property2-360.jpg';
    // }
    
    // Initialize the panorama viewer with settings
    try {
        pannellum.viewer('panorama', {
            type: 'equirectangular',
            panorama: panoramaPath,
            autoLoad: true,
            autoRotate: -2, // Negative value for counterclockwise rotation (deg/s)
            compass: true,
            showZoomCtrl: true,
            showFullscreenCtrl: true,
            hfov: 120, // Horizontal field of view
            minHfov: 50,
            maxHfov: 120,
            pitch: 0, // Initial pitch
            yaw: 0, // Initial yaw
            showControls: true,
            hotSpotDebug: false
        });
        console.log("360 viewer initialized successfully");
    } catch (error) {
        console.error("Error initializing 360 viewer:", error);
    }
}