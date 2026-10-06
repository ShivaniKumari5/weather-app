// const API_key= "dd83c6147b5820d6e698d5bb9a90131e";


// //  function renderInfo(data){
// //   let newPara = document.createElement('p');
// //   newPara.textContent =`${data?.main?.temp?.toFixed(2)} °C`;
// //   document.body.appendChild(newPara);

// // }
// async function fetchWeatherDetails(){
//     try{
//         let lat=31.827883;
//         let lon= 31.827883;

//         let result= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
//         let data= await result.json();
//         console.log(data);
//         //  renderInfo(data);
//     }
//     catch(err){
//         console.log("error found!!!",err);
//     }
   
//  }
// // 31.827883
// // script.js:41 31.827883



// function getLocationn(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("geo location not supported");
//     }
// }
//  function showPosition(position){
//     let lat = position.coords.latitude;
//     let lon = position.coords.longitude;
//     console.log(lat);
//     console.log(lat);
// }

// 31.828118608593662
// 31.828118608593662
//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}


const userTab= document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer= document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer =document.querySelector(".user-info-container");

// initial variable setup
const API_key= "dd83c6147b5820d6e698d5bb9a90131e";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromsessionStorage();



function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    
    if(! searchForm.classList.contains("active")){
        // means active class  search form conatiner mein nhi hai (means invisible hai)
        // searchform ko visible kraoo
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        // mai pehle se he serch tab par hu abb your weather tab par jao (visible krao)
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");

        //abb ham your weather tab mein aa gye abb weather bhi dispa;yy krvana hai ; so lets check locla storage 
        // first for coordinates if we have saved them there
        getfromsessionStorage();
    }
}
}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
})
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})
function getfromsessionStorage(){
    const localCoordinates= sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agar localcoordinates nhi mile toh iska mtlb apne grant Access nhi kiya hai
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const{lati,lon} = coordinates;
    // make grant Access container invisible
    grantAccessContainer.classList.remove("active");

    // make loader visible
    loadingScreen.classList.add("active");
    // API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${lon}&units=metric&appid=${API_key}`);
        
        const data = await response.json();
        console.log(data);

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        // pending HW=> handlded in search info weather api call city not found vali

    }

 }
 function renderWeatherInfo(weatherInfo){
    // first we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity =document.querySelector("[data-humidity]");
    const cloudiness  = document.querySelector("[data-cloudiness]");

    // fetch information from weather object and put it in elements
   
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/16x12/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`;
    temp.innerText =`${weatherInfo?.main?.temp.toFixed(2)}°C`;
   windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText =`${weatherInfo?.clouds?.all}%`;

 }

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No geoloaction support available");
    }
}
function showPosition(position){
    const userCoordinates={
        lati: position.coords.latitude,
        lon:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


 const grantAccesButton = document.querySelector("[data-grantAccess]");
 grantAccesButton.addEventListener('click',getLocation);

 const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(searchInput.value ===""){
        return;
    }
    else{
        fetchSearchweatherInfo(searchInput.value);
    }

});
const errorContainer = document.querySelector(".error-container");
async function fetchSearchweatherInfo(city){
     loadingScreen.classList.add("active");
     userInfoContainer.classList.remove("active");
     grantAccessContainer.classList.remove("active");
     errorContainer.classList.remove("active");
     try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_key}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        
        if(data.cod ==="404"){
            errorContainer.classList.add("active");
            return;
        } 
        userInfoContainer.classList.add("active");    
        renderWeatherInfo(data);
         
    }
       
     catch(err){
        console.log(err);
        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
    }
}

// const errorContainer = document.querySelector(".error-container")
// const errorMessage = document.querySelector("[error-img]");
// async function serachCity(city) {
//     try{
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_key}`);
//         const data = await response.json();
//         if(data ==="404"){
//             errorContainer.classList.add("active");
//             return
//         }
//         //else
//             errorContainer.classList.remove("active");
//      }
//      catch(err){
//         loadingScreen.classList.remove("active");
//         console.log(err);
//         errorContainer.textContent ="error found";
//         errorContainer.classList.add("active");

//      }

    
// }