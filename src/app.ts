import "./style.css";
import * as L from "leaflet";
import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

// Inicializa o mapa e define uma visão padrão
const map = L.map("map").setView([51.505, -0.09], 13);

// Adiciona o tile layer ao mapa
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // Envia a busca para a API Nominatim
  axios
    .get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURI(
        enteredAddress
      )}&format=json`
    )
    .then((response) => {
      if (response.status !== 200 || response.data.length === 0) {
        throw new Error("Could not fetch location!");
      }
      const data = response.data[0];
      const lat = parseFloat(data.lat);
      const lon = parseFloat(data.lon);

      // Atualiza a visão do mapa para a nova localização
      map.setView([lat, lon], 13);

      // Adiciona um marcador na nova localização
      const marker = L.marker([lat, lon]).addTo(map);
      marker.bindPopup(`Location: ${enteredAddress}`).openPopup();
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}

form?.addEventListener("submit", searchAddressHandler);

// Log para verificar se o mapa foi inicializado corretamente
console.log(map);
