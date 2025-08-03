import { getStateAcronym } from "./utils.js";

let startLatLong = [51.505, -0.09];
const map = L.map("map").setView(startLatLong, 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

if (navigator.geolocation) {
  startLatLong = navigator.geolocation.getCurrentPosition((pos) => {
    map.setView([pos.coords.latitude, pos.coords.longitude], 13);
  });
}

let marker = null;
function onMapClick(e) {
  if (marker) {
    marker.remove();
  }

  marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
}

async function chooseLocation() {
  const lat = marker._latlng.lat;
  const long = marker._latlng.lng;

  const searchLocationUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=jsonv2`;

  const response = await fetch(searchLocationUrl);

  if (!response.ok) {
    console.log(response.statusText);
  }

  const data = await response.json();

  document.getElementById("street").value = data.address.road;
  document.getElementById("district").value = data.address.suburb;
  document.getElementById("city").value = data.address.city;
  document.getElementById("state").value = getStateAcronym(data.address.state);
}

map.on("click", onMapClick);

document
  .getElementById("chooseLocationButton")
  .addEventListener("click", chooseLocation);

//https://leafletjs.com/reference.html#zoom/pan-options
