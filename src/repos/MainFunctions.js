import maplibregl, { FormatExpression } from "maplibre-gl";
import markerImage from "../assets/mapmarker.png";
import crossmapmarker from "../assets/crossmapmarker.png";
import mapMarkerStar from "../assets/mapMarkerStar.png";
import locationPin from "../assets/location-pin.png";


export const createMarkers = (locations,markers,map,selectedLocation,popoverPosition,markersUrl) => {
  debugger;
  markers.forEach((marker) => marker.remove());
  markers.length = 0;
  locations.forEach((location) => {
    let locationCor = location.location.coordinates;
    const markerEl = document.createElement("img");
    const matchingMarker = markersUrl.value.find(
      (item) => {
        let label = item.label;
       return label == location?.recommendation?.toLowerCase(); 
      }
    );

    if (matchingMarker && matchingMarker.image && matchingMarker.image.url) {
      markerEl.src = matchingMarker.image.url;
    }
    else{
      switch (location.recommendation) {
        case "Recommended":
          markerEl.src = mapMarkerStar;
          break;
        case "Visited":
          markerEl.src = locationPin;
          break;
        case "Not to visit":
          markerEl.src = crossmapmarker;
          break;
        default:
          markerEl.src = markerImage;
      }
    }
    markerEl.style.width = "30px";
    markerEl.style.height = "30px";
    markerEl.style.borderRadius = "50%"
    markerEl.dataset.id = location._id;
    let marker = new maplibregl.Marker({ element: markerEl })
      .setLngLat(locationCor)
      .addTo(map.value);
    marker.location = location;
    markerEl.addEventListener("click", () => {
      selectedLocation.value = location;

      // const [lng, lat] = location.location.coordinates;
      // const point = map.value.project([lng, lat]);

      // popoverPosition.value = { x: point.x, y: point.y };

      const mapContainer = document.getElementById('map');
      
      // Calculate smart position
      let smartPosition = calculatePopoverPosition(
        map.value,
        location.location.coordinates,
        null, // You can pass the actual popover element if available
        mapContainer
      );
          if (smartPosition) {
        popoverPosition.value = {
          x: smartPosition.x,
          y: smartPosition.y
        };
      }
      debugger
      
    });
    markers.push(marker);
  });
};
export const getUserLocation =(coordinatesCurr,map) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        coordinatesCurr.lat = position.coords.latitude;
        coordinatesCurr.lon = position.coords.longitude;
        initMap([coordinatesCurr.lon, coordinatesCurr.lat],map);
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        initMap([-0.1278, 51.5074],map); // Fallback to London
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
    initMap([-0.1278, 51.5074],map); // Fallback to London
  }
}
export const initMap = (centerCoords,map) => {
    debugger
  if (map.value) {
    map.value.remove();
  }

  map.value = new maplibregl.Map({
    container: "map",
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap contributors",
        },
      },
      layers: [
        {
          id: "osm-layer",
          type: "raster",
          source: "osm",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
    center: centerCoords,
    zoom: 13,
  });
//   map.value.on("click", (e) => {
//     if (pointerMode.value == "click") {
//       const clickedLngLat = e.lngLat;
//       console.log("The clicked lat long is", clickedLngLat);
//       const modalEl = document.getElementById("exampleModal");
//       modalInstance.value = new Modal(modalEl);
//       locationData.latitude = clickedLngLat.lat;
//       locationData.longitude = clickedLngLat.lng;
//       modalInstance.value.show();
//       pointerMode.value = "";
//     }
//   });

  const markerEl = document.createElement("img");
  markerEl.src = markerImage;
  markerEl.style.width = "30px";
  markerEl.style.height = "30px";

  new maplibregl.Marker({ element: markerEl })
    .setLngLat(centerCoords)
    .setPopup(new maplibregl.Popup().setText("You are here"))
    .addTo(map.value);


}
export const drawTripLine = (locations,map) => {
  const coordinates = locations.map((loc) => loc.location.coordinates);

  if (map.value.getSource("tripLine")) {
    map.value.removeLayer("tripLineLayer");
    map.value.removeSource("tripLine");
  }

  map.value.addSource("tripLine", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    },
  });

  map.value.addLayer({
    id: "tripLineLayer",
    type: "line",
    source: "tripLine",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#DC143C",
      "line-width": 4,
      "line-dasharray": [2, 4],
    },
  });
};
export const removeTripLine = (map) => {
  if (map.value.getLayer("tripLineLayer")) {
    map.value.removeLayer("tripLineLayer");
  }

  if (map.value.getSource("tripLine")) {
    map.value.removeSource("tripLine");
  }
};
export const calculatePopoverPosition = (map, coordinates, popoverElement, mapContainer) => {
  if (!map || !coordinates || !mapContainer) return { x: 0, y: 0 };

  const [lng, lat] = coordinates;
  const point = map.project([lng, lat]);

  const mapRect = mapContainer.getBoundingClientRect();
  const mapWidth = mapRect.width;
  const mapHeight = mapRect.height;

  // Fallback size
  let popoverWidth = 300;
  let popoverHeight = 200;

  if (popoverElement) {
    const rect = popoverElement.getBoundingClientRect();
    if (rect.width) popoverWidth = rect.width;
    if (rect.height) popoverHeight = rect.height;
  }

  // Initial position (to right and below marker)
  let x = point.x + 10;
  let y = point.y + 10;

  // Adjust horizontal if overflow
  if (x + popoverWidth > mapWidth) {
    x = point.x - popoverWidth - 10;
  }

  // Adjust vertical if overflow
  if (y + popoverHeight > mapHeight) {
    y = point.y - popoverHeight - 10;
  }

  // Clamp to stay within map bounds (margin 10px)
  x = Math.max(10, Math.min(x, mapWidth - popoverWidth - 10));
  y = Math.max(10, Math.min(y, mapHeight - popoverHeight - 10));

  return { x, y };
};

