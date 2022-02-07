const apiKey = '&appid=e27ff4075c1646a3a72ff79f2e4b1c2a';
const apiURL = 'https://api.openweathermap.org/';
const siteURL = 'https://openweathermap.org/';
const date = new Date();

const $placeSearch = document.getElementById('placeSearch')
const $yourSearches = document.getElementById('yourSearches')
const $today = document.getElementById('today')
const $forecast = document.getElementById('forecast')

function searchOnEnter(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        searchForAPlace();
    }
}

function searchForAPlace() {
    place = $placeSearch.value;
    $placeSearch.value = '';
    axios.get(`${apiURL}/data/2.5/weather?q=${place}${apiKey}`)
        .then(res => {
            saveSearch(place);
            liveCondition(res.data);
            showFiveForecast(place);
        });
}

function saveSearch (city) {
    const li = document.createElement('li')
    li.className = 'list-group-item list-item'
    li.textContent = city
    li.addEventListener('click', function getWeather () {
        axios.get(`${apiURL}/data/2.5/weather?q=${city}${apiKey}`)
            .then(res => {
                liveCondition(res.data);
                showFiveForecast(city);
            });
    })
    $yourSearches.appendChild(li)
}

function liveCondition(response) {
    const tempF = Math.round((response.main.temp - 273.15) * 1.80 + 32);
    $today.innerHTML = ''

    const code = `
        <img class="weather-img" src="${siteURL}/img/w/${response.weather[0].icon}.png">
        <h4 class="card-title">${response.name}</h4>
        <h5 class="card-title">${date.toLocaleDateString('en-US')}</h5>
        <p class="card-text">Temperature: ${tempF} °F</p>
        <p class="card-text">Humidity: ${response.main.humidity} %</p>
        <p class="card-text">Wind Speed: ${response.wind.speed} MPH</p>
    `

    $today.innerHTML = code

    const cityLon = response.coord.lon;
    const cityLat = response.coord.lat;

    axios.get(`${apiURL}/data/2.5/uvi?lat=${cityLat}&lon=${cityLon}&units=imperial&exclude=minutely,hourly${apiKey}`)
        .then(res => {
            const uvi = res.data
            const p = document.createElement('p')
            if (uvi.value > 7) {
                p.className = 'card-text uv-severe'
            } else if (uvi.value >= 3 && uvi.value < 7) {
                p.className = 'card-text uv-ok'
            } else {
                p.className = 'card-text uv-favorable'
            }
            p.textContent = 'UV Index: ' + uvi.value
            $today.appendChild(p)
        })
}

function showFiveForecast(place) {
    axios.get(`${apiURL}/data/2.5/forecast?q=${place}&units=imperial${apiKey}`)
        .then(res => {
            $forecast.innerHTML = ''
            var code = ''
            const listItem = res.data.list
            for (let i = 5; i < 40; i += 8) {
                const tempF = Math.round(listItem[i].main.temp)
                code += `
                    <div class="col-md-6">
                        <div class="rounded-3 bg-gray p-2 my-2">
                            <h5>${new Date(listItem[i].dt_txt).toLocaleDateString('en-US')}</h5>
                            <img class="forecast-img" src="${siteURL + '/img/w/' + listItem[i].weather[0].icon}.png">
                            <p>Temperature: ${tempF} °F</p>
                            <p>Humidity: ${listItem[i].main.humidity} %</p>
                        </div>
                    </div>
                `
            }
            $forecast.innerHTML = code
        });
}
