function initializeCarousels() {
    console.log("Initializing carousels...");
    // Get all carousel elements
    const carousels = document.querySelectorAll('.carousel');
    
    if (carousels.length === 0) {
      console.log("No carousels found on this page");
      return;
    }
    
    console.log(`Found ${carousels.length} carousels to initialize`);
    
    // Initialize each carousel with Bootstrap's carousel
    carousels.forEach((carousel, index) => {
      try {
        const bsCarousel = new bootstrap.Carousel(carousel, {
          interval: 5000,
          wrap: true
        });
        console.log(`Carousel #${index + 1} initialized`);
      } catch (error) {
        console.error(`Error initializing carousel #${index + 1}:`, error);
      }
    });
  }