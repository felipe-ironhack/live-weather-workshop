export const icons = {}

function addToMap(codeArray, name) {
  codeArray.forEach(code => {
    icons[code] = name
  })
}

addToMap([0, 1], 'sun');
addToMap([2], 'cloud-sun');
addToMap([3], 'cloud');
addToMap([45, 48], 'smog');
addToMap([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], 'cloud-showers-heavy');
addToMap([71, 73, 75, 77, 85, 86], 'snowflake');
addToMap([95, 96, 99], 'cloud-bolt');