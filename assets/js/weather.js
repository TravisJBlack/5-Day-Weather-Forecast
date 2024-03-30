const searchedEl = document.getElementById('searched-cities');
const cityInputEL = document.getElementById('city');
const searchButton = document.getElementById('save');
const forcast = document.getElementById('forcast');
const searchedLocations = JSON.parse(localStorage.getItem('locations')) || [];
function init() {
    
    console.log(searchedLocations);
     if(searchedLocations.length === 0){
         return;
    }

    for(let i = 0; i < searchedLocations.length; i++){
      const cityContainer = document.createElement('button');
      cityContainer.classList = 'w-100 previous-search';
      cityContainer.textContent = `${searchedLocations[i]}`;
      searchedEl.append(cityContainer);
    }
}

init();

const citySubmit = function (event){
    event.preventDefault();

    const enterCity = cityInputEL.value.trim();
    console.log(enterCity);
    if(enterCity) {
        getLatLon(enterCity);
    } else {
        alert('Please enter a city');
    }

};



//getting data from api server
const getLatLon = function (enterCity){
    console.log(enterCity);
    const apiKey = '3b52e6db8fc05a700ab6ed26ec8829e0';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${enterCity}&APPID=${apiKey}`;

    fetch(apiUrl).then(function(response) {
        if (response.ok){
            response.json().then(function(data){
                get5DayForcast(data.coord.lat, data.coord.lon)
            });
        }   else {
            alert(`Error:${response.status}`);
        }
    });
};

const get5DayForcast = function (lat, lon){
    const apiKey = '3b52e6db8fc05a700ab6ed26ec8829e0';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&esclude=hourly,alerts&APPID=${apiKey}&units=imperial`;

    fetch(apiUrl)
        .then(function(response) {
        if (response.ok){
            response.json().then(function(data){
                searchedLocations.push(data.city.name);
                localStorage.setItem('locations',JSON.stringify(searchedLocations));
                displayForcast(data.city.name, data.list)
            });
        }   else {
            alert(`Error:${response.status}`);
        }
    });
};

const displayForcast = function (city, weatherList){
    let dateFormat = dayjs(weatherList[0].dt_txt).format('(M/D/YYYY)');
    const weatherContainer = document.createElement('section');
    weatherContainer.classList = 'border border-dark p-3 mr-3';
    forcast.appendChild(weatherContainer);

    const cityContainer = document.createElement('button');
    cityContainer.classList = 'w-100';
    cityContainer.textContent = `${city}`;
    searchedEl.append(cityContainer);
    
    const title = document.createElement('h4');
    title.textContent = `${city} ${dateFormat}`;
    weatherContainer.append(title);

    const temp = document.createElement('p');
    temp.textContent = `Temp: ${weatherList[0].main.temp}°F`;
    weatherContainer.append(temp);

    const wind = document.createElement('p');
    wind.textContent = `Wind: ${weatherList[0].wind.speed} MPH`;
    weatherContainer.append(wind);

    const humidity = document.createElement('p');
    humidity.textContent = `Humidity: ${weatherList[0].main.humidity} %`;
    weatherContainer.append(humidity);
    
    // const realList = JSON.parse(weatherList);
    // console.log(realList);
    // for (let i =8; i < realList.length; i += 8) {
    //     console.log(`${realList[i]}`);
    // }
    
};

searchButton.addEventListener('click', citySubmit);
