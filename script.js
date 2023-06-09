// Select the search form element
const searchForm = document.getElementById('search-form');

// Add event listener for form submission
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission from refreshing the page

  // Get the value entered in the city input field
  const city = document.getElementById('city-input').value;

  // Call the function to fetch weather data
  getWeatherData(city);

  // Clear the input field
  document.getElementById('city-input').value = '';
});

function getWeatherData(city) {
  const apiKey = 'b2a4100b1f9013d9aca5c714e8917053'; // Replace with your OpenWeather API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  // Make a fetch request to the OpenWeather API
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error: ' + response.statusText);
      }
    })
    .then(function(data) {
      // Process the weather data and update the UI
      displayCurrentWeather(data);
    })
    .catch(function(error) {
      // Handle any errors that occur during the fetch request
      console.log(error);
      // Call a function to display an error message to the user
    });
}

function displayCurrentWeather(data) {
  // Select the elements where we want to display the weather information
  const cityName = document.getElementById('city-name');
  const date = document.getElementById('date');
  const icon = document.getElementById('weather-icon');
  const temperature = document.getElementById('temperature');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('wind-speed');

  // Update the text content of the selected elements with the weather data
  cityName.textContent = data.name;
  date.textContent = moment().format('MMMM Do YYYY');
  icon.setAttribute('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
  temperature.textContent = data.main.temp;
  humidity.textContent = data.main.humidity;
  windSpeed.textContent = data.wind.speed;
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
      temperature.textContent = data.list[i].main.temp;

      const humidity = document.createElement('p');
      humidity.textContent = data.list[i].main.humidity;

      forecastItem.appendChild(date);
      forecastItem.appendChild(icon);
      forecastItem.appendChild(temperature);
      forecastItem.appendChild(humidity);

      forecastContainer.appendChild(forecastItem);
    }
  }
}
