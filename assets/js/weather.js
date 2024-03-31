// getting references to import from DOM elements.
const searchedEl = document.getElementById('searched-cities');
const cityInputEL = document.getElementById('city');
const searchButton = document.getElementById('save');
const forcast = document.getElementById('forcast');
const dailyForcast = document.getElementById('daily-forecast');
const historyButton = document.getElementById('#city');

// declare gloabl variable to hold previous searches 
const searchedLocations = JSON.parse(localStorage.getItem('locations')) || [];

//function to run at page load to render list of previous searches.
function init() {
    // creates previous searched city into button on page 
    for(let i = 0; i < searchedLocations.length; i++){
      const cityContainer = document.createElement('button');
      cityContainer.classList = `w-100 btn btn-info bg-secondary border-0 my-1 data-${searchedLocations[i]}`;
      cityContainer.setAttribute('id','city');
      cityContainer.textContent = `${searchedLocations[i]}`;
      searchedEl.prepend(cityContainer);
    }
};

init();

//handles getting data from the search button and then makes a history button out of it and transitions to getLatLon function while passing city name
const citySubmit = function (event){
    event.preventDefault();

    const cityData = cityInputEL.value.trim();
    const enterCity = cityData.charAt(0).toUpperCase()+cityData.slice(1);
    console.log(enterCity);

    
    
    if(enterCity) {
    const cityContainer = document.createElement('button');
    cityContainer.classList = `w-100 btn btn-info bg-secondary border-0 data-${enterCity}`;
    cityContainer.setAttribute('id','city');
    cityContainer.textContent = `${enterCity}`;
    searchedEl.prepend(cityContainer);
        searchedLocations.push(enterCity);
        localStorage.setItem('locations',JSON.stringify(searchedLocations));
        getLatLon(enterCity);
    } else {
        alert('Please enter a city');
    }

};

//gets lattitude and longitude coordinates from sever
const getLatLon = function (enterCity){
    if(!enterCity){
        enterCity = searchedLocations[searchedLocations.length-1];
    }

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

//use the data we got from server to get weather data about searched city
const get5DayForcast = function (lat, lon){
    const apiKey = '3b52e6db8fc05a700ab6ed26ec8829e0';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&esclude=hourly,alerts&APPID=${apiKey}&units=imperial`;

    fetch(apiUrl)
        .then(function(response) {
        if (response.ok){
            response.json().then(function(data){
                
                console.log(data);
        
                displayForcast(data.city.name, data.list)
            });
        }   else {
            alert(`Error:${response.status}`);
        }
    });
};

//displays wanted data from the server. Function creates dynamic elments with styling and classes and appends them to the html document
const displayForcast = function (city, weatherList){
    while (forcast.hasChildNodes()){
        forcast.removeChild(forcast.firstChild);
    }

    let dateFormat = dayjs(weatherList[0].dt_txt).format('(M/D/YYYY)');
    const weatherContainer = document.createElement('section');
    weatherContainer.classList = 'border border-dark p-3 mr-3';
    forcast.appendChild(weatherContainer);

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
    const array = [];
    for (let i = 0; i < weatherList.length; i +=8){
        
        array.push(dayjs(weatherList[i].dt_txt).format('M/D/YYYY'), weatherList[i].main.temp, weatherList[i].wind.speed, weatherList[i].main.humidity);
    }
    while (dailyForcast.hasChildNodes()){
        dailyForcast.removeChild(dailyForcast.firstChild);
    }
    console.log(array);
    
    for (let i = 0; i < array.length; i += 4){
        const dailyCity = document.createElement('section');
        
        dailyCity.classList = 'd-block-flex bg-success text-light p-0 m-1 col-2 w-100';

        dailyCity.innerHTML = `<p>${array[i]}<p>
                                <p>Temp: ${array[i+1]}°F<p>
                                <p>Wind: ${array[i+2]} MPH<p>
                                <p>Humidity: ${array[i+3]}%<p>`
        dailyForcast.appendChild(dailyCity);
    }
    
};


//if no cities are in storage does nothing but if previous cities are avaialbe then it will run through functions to display the last one searched
if(searchedLocations.length === 0){
console.log('no city');
} else {
    getLatLon();
}

//waits for a click on the search button to start the fucntions 
searchButton.addEventListener('click', citySubmit);

// historyButton.addEventListener('click', function(){
//     console.log('hello');
// })
