let map;
let autocomplete;

async function initMap() {
    map = new google.maps.Map(document.getElementById('mapDisplayer'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });

    const input = document.getElementById('locationInpt');
    const options = {
        types: ['geocode']
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', onPlaceChanged);
}

async function onPlaceChanged() {
    const place = autocomplete.getPlace();

    map.setCenter(place.geometry.location);
    map.setZoom(14);

    const lat = place.geometry.location.lat();
    const long = place.geometry.location.lng();
    fetchWeather(lat, long);
}

async function fetchWeather(lat, long) {
    console.log(lat,long);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        Weather(data.current_weather);
        console.log(data)
    } catch (error) {
        console.error('Error al obtener el clima:', error);
    }
}

function weatherStatus(code, hour){
    if (code < 30 && hour == 0 ){
        return "./assets/night.png"
    } else if (code < 30 && hour !== 0 ) {
        return "./assets/sunny.png"
    } else if (code < 60){ 
        return "./assets/partialCloudly.png"
    } else if (code < 90){
        return "./assets/ligthrain.png"
    } else if (code < 100){
        return "./assets/rainy.png"
    } else {
        return "./assets/storm.png"
    }
}

function Weather(weather) {
    const icon = document.getElementById('icon')
    const weatherDiv = document.getElementById('climateStatus');
    const windDirDiv = document.getElementById('humidity');
    const windDiv = document.getElementById('windSpeed');

    icon.innerHTML = `
    <img class="climateImg" src=${weatherStatus(weather.weathercode, weather.is_day)} />
    `
    

    weatherDiv.innerHTML = `
        <h3>Clima Actual: </h3>
        <p>Temperatura: ${weather.temperature} °C</p>`

    windDirDiv.innerHTML = `
       <h3>Dirección del viento:</h3>
       <p>${weather.winddirection}°</p>`

    windDiv.innerHTML = `
    <h3>Velocidad del viento:</h3>
       <p>${weather.windspeed} km/h</p>`
}

