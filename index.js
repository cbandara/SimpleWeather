'use strict';

const DARK_SKY_API_KEY = `5792f0c29e36c83cf573a2c0693ae098`;
const ZIP_CODE_API_KEY = `EeZHEYnpQzjZPRGvjQqmd5pzWcAOu4DJXv9lsr0fPwHxHhf9g0CRWc02G6AamfKv`

// Add function to find User location

function zipCodeToLocation(zip) {
  const zipLink = `https://www.zipcodeapi.com/rest/${ZIP_CODE_API_KEY}/info.json/${zip}/degrees`;
  $.getJSON(zipLink, function (data) {
    let longitude = data.lng;
    let latitude = data.lat;
    let city = data.city;
    let state = data.state;
    darkSkyAPI(latitude, longitude, city, state);
  });
}

function darkSkyAPI(lat, lng, city, state) {
  const darkLink = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${lat},${lng}`;
  $.getJSON(darkLink, function (forecast) {
    let icn = forecast.currently.icon;
    let temp = forecast.currently.temperature;
    let humidity = forecast.currently.humidity * 100;
    let dewPoint = forecast.currently.dewPoint;
    let windSpeed = forecast.currently.windSpeed;
    let precip = forecast.currently.precipProbability * 100;
    // Add Wind Direction

    renderPageHTML(getWeatherHTMLString(city, state, temp, humidity, dewPoint, windSpeed, precip));

    renderIcon(icn);
  })
}

function renderIcon(icn) {
  let skycons = new Skycons({ "color": "white" });
  skycons.add("icon1", icn);
  skycons.play();
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
      <div class="v-alert" role="alert">
      </div>
    </form>
  </section>`
}

function getWeatherHTMLString(city, state, temp, humidity, dewPoint, windSpeed, precip) {
  // Add Skycons
  // Add Wind Direction
  return `
  <section class="weather-page">
  <nav>
    <button type="button" class="back-btn">Back</button>
    <h1>Location</h1>
  </nav>
    <p class="city-state">${city}, ${state}</p>
    <div class="box">
      <canvas id="icon1" width="100" height="100"></canvas>
    </div>
    <div class="box">
      <h2>Temperature</h2>
      <p>${temp} °F</p>
    </div>
    <div class="box">
      <h2>Humidity</h2>
      <p>${humidity}%</p>
      <h2>Dew Point</h2>
      <p>${dewPoint} °F</p>
    </div>
    <div class="box">
      <h2>Wind</h2>
      <p>${windSpeed}</p>
      <h2>Precipitation</h2>
      <p>${precip}%</p>
    </div>
  </section>`
}

function loadStartPage() {
  renderPageHTML(getStartHtmlString());
}

function handleFormSubmit(event) {
  event.preventDefault();
  const queryTarget = $(event.currentTarget).find('.zipcode');
  const zipCode = queryTarget.val()
  if (zipCode.length === 5) {
    zipCodeToLocation(zipCode)
  }
  else {
    $(".v-alert").html("<p>Not a valid zip code</p>")
  }
}

$(function onLoad() {
  loadStartPage();
  $(`.content`).on('submit', '.location-form', handleFormSubmit)
  $(`.content`).on('click', '.back-btn', loadStartPage)
})