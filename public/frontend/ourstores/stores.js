import Main from '../main.js';
import Header from '../header.js';

class Stores {
  constructor() {
    this.initMap();
  }
  async initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { PlacesService } = await google.maps.importLibrary("places");

    // Center point for the map
    const centerLatlng = { lat: 25.7617, lng: -80.1918 }; // Centered around Miami, FL

    // Create the map, centered on the specified point
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: centerLatlng,
      mapId: "DEMO_MAP_ID",
    });

    // Initialize the Places service
    const service = new google.maps.places.PlacesService(map);

    // Array of place names to search for
    const placeNames = [
      "Biscayne Blvd, Aventura, FL",
      "Ocean Drive, Miami Beach, FL",
      "Broadway, New York, NY",
      "Sunset Blvd, Los Angeles, CA",
      "Pike St, Seattle, WA"
    ];

    // Function to handle the Places API response
    function handleSearchResult(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(result => {
          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: result.geometry.location,
            map,
            title: result.name,
          });

          // Add click listener to each marker
          marker.addListener("click", () => {
            map.setZoom(8);
            map.setCenter(marker.position);
          });
        });
      } else {
        console.error(`Places search was not successful: ${status}`);
      }
    }

    // Loop through place names and perform a Text Search request for each
    placeNames.forEach(placeName => {
      const request = {
        query: placeName,
        fields: ["name", "geometry"],
      };

      service.textSearch(request, handleSearchResult);
    });
  }





}


Main.initComponents([Header, Stores]);

Main.hidePreLoader();
