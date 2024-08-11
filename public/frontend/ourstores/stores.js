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

    // Center point for the map
    const centerLatlng = { lat: 25.7617, lng: -80.1918 }; // Centered around Miami, FL

    // Create the map, centered on the specified point
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: centerLatlng,
      mapId: "DEMO_MAP_ID",
    });

    // Array of locations to be marked
    const locations = [
      { lat: 25.9579, lng: -80.1391, title: "Miami Store - Aventura" }, // Biscayne Blvd, Aventura, FL
      { lat: 25.790654, lng: -80.1300455, title: "Miami Store - Ocean Drive" }, // Ocean Drive, Miami Beach, FL
      { lat: 40.7590, lng: -73.9845, title: "New York Times Square Store" }, // Broadway, New York, NY
      { lat: 34.0983, lng: -118.3267, title: "Los Angeles Store" }, // Sunset Blvd, Los Angeles, CA
      { lat: 47.6097, lng: -122.3331, title: "Seattle Store" } // Pike St, Seattle, WA
    ];

    // Loop through locations and add markers
    locations.forEach((location) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map,
        title: location.title,
      });

      // Add click listener to each marker
      marker.addListener("click", () => {
        map.setZoom(8);
        map.setCenter(marker.position);
      });
    });
  }


}


Main.initComponents([Header, Stores]);

Main.hidePreLoader();
