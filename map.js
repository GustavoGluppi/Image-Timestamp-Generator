let startLatLng = [51.505, -0.09];
/* if (navigator.geolocation) {
  startLatLng = await navigator.geolocation.getCurrentPosition((pos) => {
    return [pos.coords.latitude, pos.coords.longitude];
  });
  console.log(startLatLng);
} */

const map = L.map("map").setView(startLatLng, 13);
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let marker = null;
function onMapClick(e) {
  if (marker) {
    marker.remove();
  }

  marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
}

map.on("click", onMapClick);

//https://leafletjs.com/reference.html#zoom/pan-options
