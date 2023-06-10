//select the search form element
const searchForm = document.getElementById('search-form');

//add event listener for form submission
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission from refreshing the page

  //get the value entered in the city input field
  const city = document.getElementById('city-input').value;

  //call the function to fetch weather data
  getWeatherData(city);

  //clear the input field
  document.getElementById('city-input').value = '';

  //add the searched city to the search history
  addToSearchHistory(city);
});

function getWeatherData(city) {
  const apiKey = 'b2a4100b1f9013d9aca5c714e8917053'; // Replace with your OpenWeather API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  //make a fetch request to the OpenWeather API
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error: ' + response.statusText);
      }
    })
    .then(function(data) {
      //process the weather data and update the UI
      displayCurrentWeather(data);
      displayForecast(data);
    })
    .catch(function(error) {
      //handle any errors that occur during the fetch request
      console.log(error);
      //call a function to display an error message to the user
    });
}

function displayCurrentWeather(data) {
  //select the elements where we want to display the weather information
  const cityName = document.getElementById('city-name');
  const date = document.getElementById('date');
  const icon = document.getElementById('weather-icon');
  const temperature = document.getElementById('temperature');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('wind-speed');

  //update the text content of the selected elements with the weather data
  cityName.textContent = data.city.name;
  date.textContent = moment().format('MMMM Do YYYY');
  icon.setAttribute('src', `http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`);
  temperature.textContent = `Temperature: ${Math.round(data.list[0].main.temp - 273.15)}°C`;
  humidity.textContent = `Humidity: ${data.list[0].main.humidity}%`;
  windSpeed.textContent = `Wind-Speed: ${data.list[0].wind.speed} km/h`;
}

function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = ''; // Clear any existing forecast data

  for (let i = 0; i < data.list.length; i++) {
    if (data.list[i].dt_txt.includes('12:00:00')) {
      const forecastItem = document.createElement('div');
      forecastItem.classList.add('forecast-item');

      const date = document.createElement('p');
      date.textContent = moment(data.list[i].dt_txt).format('MMMM Do');

      const icon = document.createElement('img');
      icon.setAttribute('src', `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`);

      const temperature = document.createElement('p');
      temperature.textContent = `Temp: ${Math.round(data.list[i].main.temp - 273.15)}°C`; // Convert Kelvin to Celsius

      const humidity = document.createElement('p');
      humidity.textContent = `Humidity: ${data.list[i].main.humidity}%`; // Append "%" to humidity

      const windSpeed = document.createElement('p');
      windSpeed.textContent = `Wind: ${data.list[i].wind.speed} km/h`; // Append "km/h" to wind speed

      forecastItem.appendChild(date);
      forecastItem.appendChild(icon);
      forecastItem.appendChild(temperature);
      forecastItem.appendChild(humidity);
      forecastItem.appendChild(windSpeed);

      forecastContainer.appendChild(forecastItem);
    }
  }
}

//select the city buttons
const cityButtons = document.getElementsByClassName('city-button');

//add event listeners to the city buttons
for (let i = 0; i < cityButtons.length; i++) {
  cityButtons[i].addEventListener('click', function () {
    const cityName = cityButtons[i].textContent;
    getWeatherData(cityName);
  });
}

//call the function to fetch Perth's weather on startup
getWeatherData('Perth');

//function to add a city to the search history
function addToSearchHistory(city) {
  //retrieve the existing search history from local storage
  const searchHistory = getSearchHistoryFromLocalStorage();

  //add the new city to the search history
  searchHistory.push(city);

  //save the updated search history to local storage
  saveSearchHistoryToLocalStorage(searchHistory);
}

//function to retri eve search history from local storage
function getSearchHistoryFromLocalStorage() {
  const searchHistory = localStorage.getItem('searchHistory');
  return searchHistory ? JSON.parse(searchHistory) : [];
}

//function to save search history to local storage
function saveSearchHistoryToLocalStorage(searchHistory) {
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}
