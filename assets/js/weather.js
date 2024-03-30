const searchedEl = document.getElementById('searched-cities');
const cityInputEL = document.getElementById('city');
const searchButton = document.getElementById('save');


function init() {
    const serchedLocations = JSON.parse(localStorage.getItem('locations')) || [];

    // if(searchedLocations.length === 0){
    //     return;
    // }

    // for(const location of searchedLocations){

    // }
}

init();

const citySubmit = function (event){
    event.preventDefault();

    const enterCity = cityInputEL.ariaValueMax.trim();

    if(enterCity) {
        getDayforcast(enterCity);
    } else {
        alert('Please enter a city');
    }

    return enterCity;

};



//getting data from api server
const getDayforcast = function (event, enterCity){
     event.preventDefault();

    // const enterCity = cityInputEL.value.trim();

    // if(enterCity) {
    //     get5Dayforcast(enterCity);
    // } else {
    //     alert('Please enter a city');
    // }
    console.log(enterCity);
    const apiKey ='3b52e6db8fc05a700ab6ed26ec8829e0'
    const apiUrl = `api.openweathermap.org/data/2.5/weather?q=houston&APPID=${apiKey}`;

    fetch(apiUrl).then(function(response) {
        if (response.ok){
            response.json().then(function(data){
                console.log(data);
            });
        }   else {
            alert(`Error:${response.status}`);
        }
    });
};

searchButton.addEventListener('click', getDayforcast);


//not part of project just using for refereence 

// const getFeaturedRepos = function (language) {
//     const apiUrl = `https://api.github.com/search/repositories?q=${language}+is:featured&sort=help-wanted-issues`;
  
//     fetch(apiUrl).then(function (response) {
//       if (response.ok) {
//         response.json().then(function (data) {
//           displayRepos(data.items, language);
//         });
//       } else {
//         alert(`Error:${response.statusText}`);
//       }
//     });
//   };