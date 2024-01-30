import { getWeather } from './weather.js';
import { icons } from './iconMapping.js';

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

function positionSuccess({ coords }) {
	getWeather(coords.latitude, coords.longitude, Intl.DateTimeFormat().resolvedOptions().timeZone)
		.then((data) => renderWeatherData(data))
		.catch((e) => console.log(e));
}

function positionError() {
	alert('Please allow geolocation and refresh the page');
}

function renderWeatherData(data) {
	renderCurrentData(data);
	renderDailyData(data);
	renderHourlyData(data);

	document.body.classList.remove('blur');
}

function setValue(selector, value, parent = document) {
	parent.querySelector(selector).textContent = value;
}

function getIcon(iconCode) {
	return `./assets/icons/${icons[iconCode]}.svg`;
}

function renderCurrentData({ current, units }) {
	const currentTempElement = document.querySelector('.header-current-temp');
	setValue('.temp', current.currentTemp, currentTempElement);
	setValue('.unit', units.tempUnit, currentTempElement);

	const currentHigh = document.querySelector('.current-high');
	setValue('.value', current.maxTemp, currentHigh);

	const currentFeelsLike = document.querySelector('.current-fl');
	setValue('.value', current.feelsLikeTemp, currentFeelsLike);

	const currentWind = document.querySelector('.current-wind');
	setValue('.value', current.windSpeed, currentWind);

	const currentLow = document.querySelector('.current-low');
	setValue('.value', current.minTemp, currentLow);

	const currentPreciptation = document.querySelector('.current-precipitation');
	setValue('.value', current.precipitation, currentPreciptation);

	document.querySelector('.weather-icon.large').src = getIcon(current.iconCode);
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const dailySection = document.querySelector('.daily-section');
const dayTemplate = document.getElementById('day-card-template')
function renderDailyData({ daily, units }) {
	dailySection.innerHTML = '';

	daily.forEach((day) => {
		const element = dayTemplate.content.cloneNode(true);
		setValue('.value', day.maxTemp, element);
		setValue('.unit', units.tempUnit, element);
		setValue('.day', DAY_FORMATTER.format(day.timestamp), element);
		element.querySelector('.weather-icon').src = getIcon(day.iconCode);

		dailySection.append(element);
	});
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: '2-digit' });
const hourlyTable = document.querySelector('.hourly-section tbody')
const rowTemplate = document.getElementById('hour-row-template')
function renderHourlyData({ hourly, units }) {
  hourlyTable.innerHTML = ''
	hourly.forEach(hour => {
    const element = rowTemplate.content.cloneNode(true)
    setValue('.day', DAY_FORMATTER.format(hour.timestamp), element)
    setValue('[data-hour]', HOUR_FORMATTER.format(hour.timestamp), element)
    setValue('[data-temp-value]', hour.temperature, element)
    setValue('[data-temp-unit]', units.tempUnit, element)
    setValue('[data-fl-temp-value]', hour.feelsLikeTemp, element)
    setValue('[data-fl-temp-unit]', units.tempUnit, element)
    setValue('[data-wind-value]', hour.windSpeed, element)
    setValue('[data-wind-unit]', ` ${units.windSpeedUnit}`, element)
    setValue('[data-precipitation-value]', hour.precipitation, element)
    setValue('[data-precipitation-unit]', ` ${units.precipitationUnit}`, element)

    element.querySelector('.weather-icon').src = getIcon(hour.iconCode)

    hourlyTable.append(element)
  })
}
