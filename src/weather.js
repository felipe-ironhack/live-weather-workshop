export async function getWeather(lat, lon, timezone) {
	const params = new URLSearchParams();
	params.append('latitude', lat);
	params.append('longitude', lon);
	params.append('timezone', timezone);
	
	const results = await fetch(
		'https://api.open-meteo.com/v1/forecast?current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timeformat=unixtime&' +
			params.toString()
	);

	const data = await results.json();

	return {
		units: parseUnits(data),
		current: parseCurrentData(data),
		daily: parseDailyData(data),
		hourly: parseHourlyData(data),
	};
}

function parseUnits({ current_units }) {
	const {
		precipitation: precipitationUnit,
		temperature_2m: tempUnit,
		wind_speed_10m: windSpeedUnit,
	} = current_units;

	return { tempUnit, precipitationUnit, windSpeedUnit };
}

function parseCurrentData({ current, daily }) {
	const {
		apparent_temperature: feelsLikeTemp,
		temperature_2m: currentTemp,
		weather_code: iconCode,
		wind_speed_10m: windSpeed,
		precipitation,
	} = current;

	const {
		temperature_2m_max: [maxTemp],
		temperature_2m_min: [minTemp],
	} = daily;

	return { precipitation, feelsLikeTemp, currentTemp, iconCode, windSpeed, maxTemp, minTemp };
}

function parseDailyData({ daily }) {
	return daily.time.map((time, index) => {
		return {
			timestamp: time * 1000,
			iconCode: daily.weather_code[index],
			maxTemp: daily.temperature_2m_max[index],
		};
	});
}

function parseHourlyData({ hourly, current, daily }) {
	return hourly.time
		.map((time, index) => {
			return {
				timestamp: time * 1000,
				feelsLikeTemp: hourly.apparent_temperature[index],
				temperature: hourly.temperature_2m[index],
				windSpeed: hourly.wind_speed_10m[index],
				precipitation: hourly.precipitation[index],
				iconCode: hourly.weather_code[index],
			};
		})
		.filter(({ timestamp }) => timestamp >= current.time * 1000 && timestamp <= daily.time[1] * 1000);
}
