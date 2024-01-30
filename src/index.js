import { getWeather } from "./weather.js";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({ coords }) {
  getWeather(coords.latitude, coords.longitude, Intl.DateTimeFormat().resolvedOptions().timeZone)
}

function positionError() {
  alert('Please allow geolocation and refresh the page')
}