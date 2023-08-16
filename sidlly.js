let userInputE1=document.getElementById("userInput");
let weatherResultContainer=document.getElementById("weatherResultContainer");
let cityNameE1=document.getElementById("cityName");
let countryNameE1=document.getElementById("countryName");
let weatherIconImgE1=document.getElementById("weatherIconImg");
let weatherTempE1=document.getElementById("weatherTemp");
let weatherTempDescE1=document.getElementById("weatherTempDesc");
let dayDetailsE1=document.getElementById("dayDetails");
let maxMinTempE1=document.getElementById("maxMinTemp");
let feelsLikeE1=document.getElementById("feelsLike");
let humidityE1=document.getElementById("humidity");
let windSpeedE1=document.getElementById("windSpeed");
let visibilityE1=document.getElementById("visibility");
let weatherBgImgE1=document.getElementById("weatherBgImg");
var cityErrorDiscriptionE1=document.getElementById("cityErrorDiscription");


let weatherImageMap = {
    "broken clouds": "weather-icons/brokenclouds.jpg",
    "clear sky": "weather-icons/clearsky.jpg",
    "light intensity drizzle": "weather-icons/drizzle.jpg",
    "dust": "weather-icons/dust.jpg",
    "few clouds": "weather-icons/fewclouds.jpg",
    "fog": "weather-icons/fog.jpg",
    "haze":"weather-icons/haze.jpg",
    "very heavy rain":"weather-icons/heavyrain.jpg",
    "heavy snow":"weather-icons/heavysnow.jpg",
    "heavy thunderstorm":"weather-icons/heavythunderstorm.jpg",
    "light rain":"weather-icons/lightrain.jpg",
    "light snow":"weather-icons/lightsnow.jpg",
    "light thunderstorm":"weather-icons/lightthunderstorm.jpg",
    "mist":"weather-icons/mist.jpg",
    "moderate rain":"weather-icons/moderaterain.jpg",
    "moderate snow":"weather-icons/moderatesnow.jpg",
    "moderate thunderstorm":"weather-icons/moderatethunderstorm.jpg",
    "overcast clouds":"weather-icons/overcastclouds.jpg",
    "scattered clouds":"weather-icons/scatteredclouds.jpg",
    "smoke":"weather-icons/smoke.jpg",
    "squalls":"weather-img/squalls.jpg",
    "thunderstorms and drizzle":"weather-icons/thunderstormsanddrizzle.jpg",
    "heavy intensity rain":"weather-icons/thunderstormsandrain.jpg",
    "thunderstorms and snow":"weather-icons/thunderstormsandsnow.jpg",
    "tornado":"weather-icons/tornado.jpg"
};

let city=""
let key="ac7a03fd46b0355c5699ad915809f175";
let weather = {};
weather.temperature = {
  unit: "celsius",
};
let KELVIN = 273;
let weatherTime={};
let timeDetailsArray=[];
let timeIconDetailsArray=[];
let timeTempDetailsArray=[];

let itemLIst=[];
let uniqueNoCounter=0;

// When the user presses the Enter key, the code gets the value of 
// the element, which is the name of a city

userInputE1.addEventListener("keyup",function(event){
    if(event.keyCode===13){
        event.preventDefault();
        city=userInputE1.value;
        getSearchWeather(city);
        getSearchTime(city);
        if (city===""){
            alert("Enter City Name !!!");
        }
    }

});

// shows current temp and other weather details

function getSearchWeather(city){
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
    fetch(api)
    .then(function(response){
        return response.json();
    })
    .then(function(jsonData){
        console.log(jsonData);
        if (jsonData.cod==="404"){
            cityErrorDiscriptionE1.innerHTML="City not found";
            userInputE1.value="";
        }
        else{
            cityErrorDiscriptionE1.innerHTML="";
        }
        weather.cityName=jsonData.name;
        weather.country = jsonData.sys.country;
        weather.iconId = jsonData.weather[0].icon;
        weather.temperature.value=Math.floor(jsonData.main.temp-KELVIN);
        weather.description=jsonData.weather[0].description.toLowerCase();
        let imageSrc=(weatherImageMap[weather.description]);
        weatherBgImgE1.style.backgroundImage = `url(${imageSrc})`;
        // date/month/day
        let nowInLocalTime = Date.now()  + 1000 * (jsonData.timezone/ 3600);
        let millitime = new Date(nowInLocalTime);
        let dateFormat = millitime.toLocaleString();
        let day = millitime.toLocaleString("en-US", {weekday: "short"});
        let month = millitime.toLocaleString("en-US", {month: "short"}); 
        let date = millitime.toLocaleString("en-US", {day: "numeric"});
        weather.dayMonthDetails=date+" "+month+" "+day;
        // maxtemp/mintemp
        weather.maxTemp=Math.floor(jsonData.main.temp_max-KELVIN);
        weather.minTemp=Math.floor(jsonData.main.temp_min-KELVIN);
    })
    .then(function () {
        displayWeather();
    });
}
function displayWeather(){
    weatherResultContainer.classList.remove("d-none");
    cityNameE1.textContent=`${weather.cityName}`;
    countryNameE1.textContent=`${weather.country}`;
    weatherIconImgE1.src=`http://openweathermap.org/img/w/${weather.iconId}.png`;
    weatherTempE1.textContent=`${weather.temperature.value}`;
    weatherTempDescE1.textContent=`${weather.description}`;
    dayDetailsE1.textContent=`${weather.dayMonthDetails}`;
    maxMinTempE1.textContent=`${weather.maxTemp}°C / ${weather.minTemp}°C`;
    userInputE1.value="";
}


// shows next 5 days weather details & 24 hours updated weather temp with time

function getSearchTime(city){
    let api1=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${key}`;
    fetch(api1)
    .then(function(response){
        return response.json();
    })
    .then(function(jsonData){
        console.log(jsonData);
        for (let i=2;i<=6;i++){
            // Displays time for one day
            weatherTime.time=jsonData.list[i].dt_txt;
            let dateTimeString = weatherTime.time;
            let dateTime = new Date(dateTimeString);
            var hour = dateTime.getHours();
            var minute = dateTime.getMinutes();
            let ampm = hour >= 12 ? "PM" : "AM";
            hour = hour % 12 || 12; // Convert 0 to 12
            let timeDetails=(hour+":"+minute+"0 "+ampm);
            timeDetailsArray.push(timeDetails);
            // displays icon-images
            weatherTime.icon=jsonData.list[i].weather[0].icon;
            timeIconDetailsArray.push(weatherTime.icon);
            // displays temperature
            weatherTime.temp=Math.floor(jsonData.list[i].main.temp-KELVIN);
            timeTempDetailsArray.push(weatherTime.temp);
        }
        for (let i=1;i<=40;i=i+8){
            let weatherWeekTime={};
            // week days of overall week
            let dateTimeString = jsonData.list[i].dt_txt;
            let dateTime = new Date(dateTimeString);
            let day = dateTime.toLocaleString("en-US", {weekday: "long"});
            weatherWeekTime.day=day;
            // icon-images of overall week
            weatherWeekTime.icon=jsonData.list[i].weather[0].icon;
            // weather-description of overall week
            weatherWeekTime.description=jsonData.list[i].weather[0].description;
            // max temp of overall week
            weatherWeekTime.maxtemp=Math.floor(jsonData.list[i].main.temp_max-KELVIN);
            // min temp of overall week
            weatherWeekTime.mintemp=Math.floor(jsonData.list[i].main.temp_min-KELVIN);
            // humidity 
            weatherWeekTime.humidity=Math.floor(jsonData.list[i].main.humidity);
            // rain percentage
            weatherWeekTime.rain=jsonData.list[i].rain;
            // pressure
            weatherWeekTime.pressure=jsonData.list[i].main.pressure;
            // wind-speed
            weatherWeekTime.windspeed=jsonData.list[i].wind.speed;
            // temp feels like
            weatherWeekTime.tempfeelslike=Math.floor(jsonData.list[i].main.feels_like-KELVIN);
            // uniqueNo
            uniqueNoCounter++;
            weatherWeekTime.uniqueNo = uniqueNoCounter;

            itemLIst.push(weatherWeekTime);
        }
        console.log(itemLIst);
    })
    .then(function(){
        displayTime();
    })
}
function displayTime(){
    // displays time
    if (timeDetailsArray.length > 5) {
        timeDetailsArray = timeDetailsArray.slice(0, 5);
    }
    let timeItemList=document.getElementById("timeItemList");
    timeItemList.innerHTML="";
    timeItemList.classList.add("time-item-list",);
    for (let i = 0; i < timeDetailsArray.length; i++) {
        let listItem = document.createElement("p");
        listItem.textContent = timeDetailsArray[i];
        timeItemList.appendChild(listItem);
    }

    // displays icons
    if (timeIconDetailsArray.length > 5) {
        timeIconDetailsArray = timeIconDetailsArray.slice(5, 10);
    }
    let timeWeatherDetailsIcon=document.getElementById("timeWeatherDetailsIcon");
    timeWeatherDetailsIcon.innerHTML="";
    timeWeatherDetailsIcon.classList.add("time-weather-details-icon");
    for (let i = 0; i < timeIconDetailsArray.length; i++) {
        let imgItem = document.createElement("img");
        imgItem.classList.add("time-weather-details-icon","col-2");
        imgItem.src=`http://openweathermap.org/img/w/${timeIconDetailsArray[i]}.png`;
        timeWeatherDetailsIcon.appendChild(imgItem);
    }

    // displays temperature
    if (timeTempDetailsArray.length > 5) {
        timeTempDetailsArray = timeTempDetailsArray.slice(5, 10);
    }
    let timeTempList=document.getElementById("timeTempList");
    timeTempList.innerHTML="";
    timeTempList.classList.add("time-temp-details");
    for (let i = 0; i < timeTempDetailsArray.length; i++) {
        let listItem = document.createElement("p");
        listItem.classList.add("col-2");
        listItem.textContent=timeTempDetailsArray[i]+"°C";
        timeTempList.appendChild(listItem);

    }
    
    let selectedItemId = null;
    let selectedBottomItem = null;

    function dropItem(itemId, item) {
        let listItemToShow = document.getElementById(itemId);
        let daysListContainer = listItemToShow.parentNode;
    
        if (selectedBottomItem) {
            daysListContainer.removeChild(selectedBottomItem);
            selectedBottomItem = null;
        }
    
        if (selectedItemId !== itemId) {
            selectedItemId = itemId;
            for (let listItem of daysListContainer.children) {
                if (listItem === listItemToShow) {
                    listItem.classList.remove("d-none");
                } else {
                    listItem.classList.add("d-none");
                }
            }
    
            selectedBottomItem = createBottomListItem(item); // Create the bottomListItem
            daysListContainer.appendChild(selectedBottomItem);
        } else {
            selectedItemId = null;
            for (let listItem of daysListContainer.children) {
                listItem.classList.remove("d-none");
            }
        }
    }

    // DOM manipulations

    function createBottomListItem(item) {
        let bottomListItem=document.createElement("li");
        bottomListItem.classList.add("bottom-drop-details");
        daysListContainer.appendChild(bottomListItem);

        let bottomMainContainer=document.createElement("div");
        bottomMainContainer.classList.add("d-flex","flex-row","container-height","mt-2");
        bottomListItem.appendChild(bottomMainContainer);

        let mainIconImg=document.createElement("img");
        mainIconImg.classList.add("details-of-ropdown-icon");
        mainIconImg.src=`http://openweathermap.org/img/w/${item.icon}.png`;
        bottomMainContainer.appendChild(mainIconImg);

        let mainMiniContainer=document.createElement("div");
        mainMiniContainer.classList.add("d-flex","flex-column","p-2");
        bottomMainContainer.appendChild(mainMiniContainer);

        let bottomDescription=document.createElement("h5");
        bottomDescription.classList.add("details-of-ropdown-description");
        bottomDescription.textContent=item.description;
        mainMiniContainer.appendChild(bottomDescription);

        let maxMinHeading=document.createElement("p");
        maxMinHeading.classList.add("details-of-ropdown-max-min");
        maxMinHeading.textContent=`The high will be ${item.maxtemp}°C,the low will be ${item.mintemp}°C.`;
        mainMiniContainer.appendChild(maxMinHeading);

        let bottomMiniContainer=document.createElement("div");
        bottomMiniContainer.classList.add("weather-other-forecast-container","mt-2");
        bottomListItem.appendChild(bottomMiniContainer);

        let insideMiniContainer=document.createElement("div");
        insideMiniContainer.classList.add("mini-forecast-container");
        bottomMiniContainer.appendChild(insideMiniContainer);

        let rainContainer=document.createElement("div");
        insideMiniContainer.appendChild(rainContainer);

        let rainIcon=document.createElement("i");
        rainIcon.classList.add("fa-solid","fa-cloud-showers-heavy","pr-2");
        rainContainer.appendChild(rainIcon);

        let rainPercentage=document.createElement("span");
        if (item.rain && item.rain["3h"] !== undefined) {
            let rainAmount = item.rain["3h"];
            rainAmount= Math.floor((rainAmount / 3) * 100);
            rainPercentage.textContent=`${rainAmount}%`
        }else {
            rainPercentage.textContent=`No rain`;
        }
        rainContainer.appendChild(rainPercentage);

        let windContainer=document.createElement("div");
        insideMiniContainer.appendChild(windContainer);

        let windIcon=document.createElement("i");
        windIcon.classList.add("fa-solid","fa-wind","pr-2");
        windContainer.appendChild(windIcon);

        let windDescription=document.createElement("span");
        windDescription.textContent=item.windspeed+"m/s E";
        windContainer.appendChild(windDescription);

        let pressureContainer=document.createElement("div");
        insideMiniContainer.appendChild(pressureContainer);

        let pressureIcon=document.createElement("i");
        pressureIcon.classList.add("fa-regular","fa-compass","pr-2");
        pressureContainer.appendChild(pressureIcon);

        let pressureDescription=document.createElement("span");
        pressureDescription.textContent=item.pressure+"hPa";
        pressureContainer.appendChild(pressureDescription);

        let insideMiniCont1=document.createElement("div");
        insideMiniCont1.classList.add("mini-forecast-container");
        bottomMiniContainer.appendChild(insideMiniCont1);

        let humidityItem=document.createElement("span");
        humidityItem.classList.add("dropdown-humidity");
        humidityItem.textContent="Humidity: "+item.humidity+"%";
        insideMiniCont1.appendChild(humidityItem);

        let tempFeelsLikeItem=document.createElement("span");
        tempFeelsLikeItem.classList.add("tempfeels-like");
        tempFeelsLikeItem.textContent="Feels_like: "+item.tempfeelslike+"°C";
        insideMiniCont1.appendChild(tempFeelsLikeItem);

        return bottomListItem;
    }

    function createAndAppendItem(item){
        let itemId="item"+item.uniqueNo;
        let daysListContainer=document.getElementById("daysListContainer");
        
        let listItem=document.createElement("li");
        listItem.classList.add("each-days-list");
        listItem.id=itemId;
        daysListContainer.appendChild(listItem);

        let weekDay=document.createElement("span");
        weekDay.classList.add("details-of-week-day");
        weekDay.id="detailsOfWeekDay";
        weekDay.textContent=item.day;
        listItem.appendChild(weekDay);

        let iconDescriptionMaxMinContainer=document.createElement("div");
        iconDescriptionMaxMinContainer.classList.add("icon-description-container");
        listItem.appendChild(iconDescriptionMaxMinContainer);

        let iconDescriptionContainer=document.createElement("div");
        iconDescriptionContainer.classList.add("d-flex","flex-row");
        iconDescriptionMaxMinContainer.appendChild(iconDescriptionContainer);

        let iconImage=document.createElement("img");
        iconImage.classList.add("details-of-week-icons");
        iconImage.id="detailsOfWeekIcon";
        iconImage.src=`http://openweathermap.org/img/w/${item.icon}.png`;
        iconDescriptionContainer.appendChild(iconImage);

        let weatherDescription=document.createElement("span");
        weatherDescription.classList.add("detail-week-weather-description");
        weatherDescription.id="detailsOfWeekWeatherDescription";
        weatherDescription.textContent=item.description;
        iconDescriptionContainer.appendChild(weatherDescription);

        let maxMinContainer=document.createElement("div");
        maxMinContainer.classList.add("d-flex","flex-row","detail-of-max-min-temp");
        iconDescriptionMaxMinContainer.appendChild(maxMinContainer);

        let maxTemp=document.createElement("span");
        maxTemp.id="detailsOfMax";
        maxTemp.textContent=item.maxtemp+"/";
        maxMinContainer.appendChild(maxTemp);

        let minTemp=document.createElement("span");
        minTemp.id="detailsOfMin";
        minTemp.textContent=item.mintemp+"°C";
        maxMinContainer.appendChild(minTemp);

        let dropdownContainer=document.createElement("div");
        dropdownContainer.id="dayDropdown";
        dropdownContainer.onclick = function () {
            dropItem(itemId,item);
            listItem.classList.toggle("bg-list");
        };
        iconDescriptionMaxMinContainer.appendChild(dropdownContainer);

        let dropIcon=document.createElement("i");
        dropIcon.classList.add("fa-solid","fa-caret-down","drop-down-icon");
        dropdownContainer.appendChild(dropIcon);
    }

    if (itemLIst.length > 5) {
        itemLIst = itemLIst.slice(5, 10);
    }
    daysListContainer.innerHTML="";

    for (let item of itemLIst){
        createAndAppendItem(item);
    }

}

// shows current location with full weather forecast details

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(setposition)
}

function setposition(position){
    latitude=position.coords.latitude;
    longitude=position.coords.longitude;
    getWeather(latitude,longitude);
}

function getWeather(latitude,longitude){
    let api=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api)
    .then(function(response){
        return response.json();
    })
    .then(function(jsonData){
        console.log(jsonData);
        weather.cityName=jsonData.name;
        weather.country = jsonData.sys.country;
        weather.iconId = jsonData.weather[0].icon;
        weather.temperature.value=Math.floor(jsonData.main.temp-KELVIN);
        weather.description=jsonData.weather[0].description.toLowerCase();
        let imageSrc=(weatherImageMap[weather.description]);
        weatherBgImgE1.style.backgroundImage = `url(${imageSrc})`;
        // date/month/day
        let nowInLocalTime = Date.now()  + 1000 * (jsonData.timezone/ 3600);
        let millitime = new Date(nowInLocalTime);
        let dateFormat = millitime.toLocaleString();
        let day = millitime.toLocaleString("en-US", {weekday: "short"});
        let month = millitime.toLocaleString("en-US", {month: "short"}); 
        let date = millitime.toLocaleString("en-US", {day: "numeric"});
        weather.dayMonthDetails=date+" "+month+" "+day;
        // maxtemp/mintemp
        weather.maxTemp=Math.floor(jsonData.main.temp_max-KELVIN);
        weather.minTemp=Math.floor(jsonData.main.temp_min-KELVIN);
        // weatherdetails
        weather.feelsLike=Math.floor(jsonData.main.feels_like-KELVIN);
        weather.humidity= Math.floor(jsonData.main.humidity);
        weather.windSpeed=Math.floor(jsonData.wind.speed);
        weather.visibility=(jsonData.visibility/1000);
    })
    .then(function () {
        displayWeather();
    });

    let api1=`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${key}`;
    fetch(api1)
    .then(function(response){
        return response.json();
    })
    .then(function(jsonData){
        console.log(jsonData);
        for (let i=2;i<=6;i++){
            // Displays time for one day
            weatherTime.time=jsonData.list[i].dt_txt;
            let dateTimeString = weatherTime.time;
            let dateTime = new Date(dateTimeString);
            var hour = dateTime.getHours();
            var minute = dateTime.getMinutes();
            let ampm = hour >= 12 ? "PM" : "AM";
            hour = hour % 12 || 12; // Convert 0 to 12
            let timeDetails=(hour+":"+minute+"0 "+ampm);
            timeDetailsArray.push(timeDetails);
            // displays icon-images
            weatherTime.icon=jsonData.list[i].weather[0].icon;
            timeIconDetailsArray.push(weatherTime.icon);
            // displays temperature
            weatherTime.temp=Math.floor(jsonData.list[i].main.temp-KELVIN);
            timeTempDetailsArray.push(weatherTime.temp);
        }
        for (let i=1;i<=40;i=i+8){
            let weatherWeekTime={};
            // week days of overall week
            let dateTimeString = jsonData.list[i].dt_txt;
            let dateTime = new Date(dateTimeString);
            let day = dateTime.toLocaleString("en-US", {weekday: "long"});
            weatherWeekTime.day=day;
            // icon-images of overall week
            weatherWeekTime.icon=jsonData.list[i].weather[0].icon;
            // weather-description of overall week
            weatherWeekTime.description=jsonData.list[i].weather[0].description;
            // max temp of overall week
            weatherWeekTime.maxtemp=Math.floor(jsonData.list[i].main.temp_max-KELVIN);
            // min temp of overall week
            weatherWeekTime.mintemp=Math.floor(jsonData.list[i].main.temp_min-KELVIN);
            // humidity 
            weatherWeekTime.humidity=Math.floor(jsonData.list[i].main.humidity);
            // rain percentage
            weatherWeekTime.rain=jsonData.list[i].rain;
            // pressure
            weatherWeekTime.pressure=jsonData.list[i].main.pressure;
            // wind-speed
            weatherWeekTime.windspeed=jsonData.list[i].wind.speed;
            // temp feels like
            weatherWeekTime.tempfeelslike=Math.floor(jsonData.list[i].main.feels_like-KELVIN);
            // uniqueNo
            uniqueNoCounter++;
            weatherWeekTime.uniqueNo = uniqueNoCounter;

            itemLIst.push(weatherWeekTime);
        }
        console.log(itemLIst);
    })
    .then(function(){
        displayTime();
    })
}