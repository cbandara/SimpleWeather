'use strict';

const DARK_SKY_API_KEY = `5792f0c29e36c83cf573a2c0693ae098`;
const ZIP_CODE_API_KEY = `EeZHEYnpQzjZPRGvjQqmd5pzWcAOu4DJXv9lsr0fPwHxHhf9g0CRWc02G6AamfKv`

// Add function to find User location

function zipCodeToLocation(zip) {
  const zipLink = `https://cors.io/?https://www.zipcodeapi.com/rest/${ZIP_CODE_API_KEY}/info.json/${zip}/degrees`;
  $.getJSON(zipLink,function(data) {
  let longitude = data.lng;
  let latitude = data.lat;
  darkSkyAPI(latitude, longitude);
  });
  console.log("After sending request");
}

function darkSkyAPI(lat,lng) {
  const darkLink = `https://cors.io/?https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${lat},${lng}`;
  $.getJSON(darkLink, function(forecast) {
    let icon = forecast.currently.icon;
    let temp = forecast.currently.temperature;
    let humidity = forecast.currently.humidity;
    let dewPoint = forecast.currently.dewPoint;
    let windSpeed = forecast.currently.windSpeed;
    // Add Wind Direction
    getWeatherHTMLString(icon, temp, humidity, dewPoint, windSpeed);
  })
  
}

// Connect skycons to HTML
function skycons() {
  var i,
      icons = new Skycons({
          "color" : "#FFFFFF",
      }),
      list  = [ // listing of all possible icons
          "clear-day",
          "clear-night",
          "partly-cloudy-day",
          "partly-cloudy-night",
          "cloudy",
          "rain",
          "sleet",
          "snow",
          "wind",
          "fog"
      ];

  for(i = list.length; i--;) {
    var weatherType = list[i],
          elements = document.getElementsByClassName(weatherType);

    for (e = elements.length; e--;) {
      icons.set(elements[e], weatherType);
    }
  }
  icons.play();
}



function renderPageHTML(htmlString) {
  $(`.content`).html(htmlString);
  
}

function getStartHtmlString() {
  return `
  <section class="start-page">
    <h1>Simple Weather</h1>
    <form class="location-form">
      <label for="location">Enter Zip Code</label>
      <input type="text" id="zipcode" class="zipcode">
      <button type="submit">Search</button>
      <div role="alert">
      </div>
    </form>
  </section>`
}

function getWeatherHTMLString(icon, temp, humidity, dewPoint, windSpeed) {
  console.log(icon, temp, humidity, dewPoint, windSpeed);
}

function loadStartPage() {
  renderPageHTML(getStartHtmlString());
}

function handleFormSubmit(event) {
  event.preventDefault();
  const queryTarget = $(event.currentTarget).find('.zipcode');
  const zipCode = queryTarget.val()
  zipCodeToLocation(zipCode);
}

// Event Handlers
$(function onLoad() { 
  loadStartPage();
  $(`.content`).on('submit', '.location-form', handleFormSubmit)
  
})
// Listen for user's currentLocation
// handle submit button
// Load start page
// handle back button


// STORE
