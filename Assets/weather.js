var locationsDiv = document.getElementById("searchedLocations");
var lat = "latitude";
var lon = "longitude";
var uvIndex = (lat + lon);
var apiKey = "19113027cee7d9c234b7c839da7576c2";
var locations = [];
var city = $(this).prev().val().trim();
var cityName = newLocations[i];

init(); 
listClicker(); 
searchClicker(); 


function init(){
     var savedLocations = JSON.parse(localStorage.getItem("locations"));

    if (savedLocations !== null){
        locations = savedLocations
    }   
    
    renderButtons(); 
}


function storeLocations(){
    localStorage.setItem("locations", JSON.stringify(locations)); 
}

function renderButtons(){
    locationsDiv.innerHTML = ""; 
    if(locations == null){
        return;
    }
    var newLocations = [...new Set(locations)];
    for(var i=0; i < newLocations.length; i++){
        var cityName = newLocations[i]; 

        var btnEl = document.createElement("button");
        btnEl.textContent = cityName; 
        btnEl.setAttribute("class", "listbtn"); 

        locationsDiv.appendChild(btnEl);
        listClicker();
      }
    }

function listClicker(){
$(".listbtn").on("click", function(event){
    event.preventDefault();
    city = $(this).text().trim();
    APIcalls(); 
})
}

function searchClicker() {
$("#searchBtn").on("click", function(event){
    event.preventDefault();
    var city = $(this).prev().val().trim()
    

    locations.push(city);
    if (city == ""){
        return; 
    }

    APIcalls();
    storeLocations(); 
    renderButtons();
})
}


function APIcalls(){
    
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=imperial`;
    
    $("#nameOfCity").text("Today's Weather in " + city);
    $.ajax({
        url: forecastUrl,
        method: "GET",
    }).then(function(response){
        var dayNumber = 0; 
        

        for(var i=0; i< response.list.length; i++){
            

            if(response.list[i].dt_txt.split(" ")[1] == "18:00:00")
            {

                var day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                var month = response.list[i].dt_txt.split("-")[1];
                var year = response.list[i].dt_txt.split("-")[0];
                $("#" + dayNumber + "date").text(month + "/" + day + "/" + year); 
       
                $("#" + dayNumber + "fiveDayTemp").text("Temp: " + Math.round(response.list[i].main.temp) + String.fromCharCode(176)+"F");
                $("#" + dayNumber + "fiveDayHumidity").text("Humidity: " + response.list[i].main.humidity + "%");
                $("#" + dayNumber + "fiveDayIcon").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                dayNumber++; 
                        }   
        }
    });


    $.get(currentWeatherUrl).then(function (response) {
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        var queryUV = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
                
        $.get(queryUV)
        .then(function (uvResponse) {
      
      var color = "green";
      var UVindex = uvResponse.value;
      if(UVindex > 10) {
          color = "red";
      }
      else if(UVindex > 4) {
          color = "orange";
      };

      var uvSpan = $("<span>").text(uvResponse.value).css("color", color);
      $("#todayUVIndex").text("UV Index: ").append(uvSpan);
 })
 

     $.ajax({
         url:currentWeatherUrl,
         method: "GET", 
     }).then(function(currentData){
         $("#nameOfCity").text("Today's Weather in " + city + ":");
         $("#todayTemp").text("Temperature: " + Math.round(currentData.main.temp) + String.fromCharCode(176)+"F");
         $("#todayHumidity").text("Humidity: " + currentData.main.humidity + "%");
         $("#todayWindSpeed").text("Wind Speed: " + currentData.wind.speed + " mph");
         $("#todayIconDiv").attr({"src": "http://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png",
          "height": "100px", "width":"100px"});
    });
});

}