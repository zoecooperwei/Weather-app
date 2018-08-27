if(typeof jQuery!=='undefined'){
    console.log('jQuery Loaded');
}
else{
    console.log('not loaded yet');
}

// display skycons
var skycons = new Skycons({"color": "#fff"});

skycons.play();

// enter city name
$(document).ready(function(){
  $("#search_button").click(function geoFindLocation(){
    var cityName = $('#cityName').val();
    requestData(cityName);
  });

  $("#cityName").keypress(function (e){
    var value = $("#cityName").val();
    if((e.which==13)&&value){
      requestData(value);
    }
  })
});

// request weather, location and time data of the city
function requestData(cityName){
  // request and load location
  var map = new Image();
  map.src = "https://maps.googleapis.com/maps/api/staticmap?center="+cityName+"&zoom=13&scale=1&size=200x200&maptype=roadmap&format=png&visual_refresh=true";
  $("#map").html(map);
  // request and load time
  $.getJSON("http://api.worldweatheronline.com/premium/v1/tz.ashx?key=12891fa87d374189bef01106182508&q="+cityName+"&format=json",
    function(data){
      var rawTime = JSON.stringify(data);
      var newTime = JSON.parse(rawTime);
      var time = newTime.data.time_zone[0].localtime;
      getTime(time);
      $(".time").html(time);
    }
  )
  // request weather
  function getTime(time){
    hour = time.slice(11,13);
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&APPID=d513b230efddbb56c45dd07bb4ff64ee&units=metric",
    function(data){
    var rawCity = JSON.stringify(data);
    var newData = JSON.parse(rawCity);
    // load weather
    updateCityData(newData, hour);
    }
  )
  }

  // ！！！！！这里需要直接通过cityName来request时间JSON，实现和weather update的同步
};

  // function requestTime(newData){
  //   var lat = newData.coord.lat;
  //   var lon = newData.coord.lon;
    // $.getJSON("http://api.timezonedb.com/v2/get-time-zone?key=9HO0KV4NHEH5&format=json&by=position&lat="+lat+"&lng="+lon,
    //   function(data){
    //     var rawTime = JSON.stringify(data);
    //     var newTime = JSON.parse(rawTime);
    //     updateTime(newTime);
    //   }
    // )
  // }

  // function updateTime(newTime){
  //   var time = newTime.formatted;
  //   var hour = time.slice(11, 13);
  //   $(".time").html(time);
  // }

 // load weather information
function updateCityData(newData, hour){
  // var lat = newData.coord.lat;
  // var lon = newData.coord.lon;
  // $.getJSON("http://api.timezonedb.com/v2/get-time-zone?key=9HO0KV4NHEH5&format=json&by=position&lat="+lat+"&lng="+lon,
  //   function(data){
  //     var rawTime = JSON.stringify(data);
  //     var newTime = JSON.parse(rawTime);
  //     var time = newTime.formatted;
  //     $(".time").html(time);
  //   }
  // )

    var h = hour;
    $('.notice').html("");
 		var tem = newData.main.temp;
 		var name = newData.name;
 		var weather = newData.weather[0].main;
    var weatherDes = newData.weather[0].description;
    // display basic weather info
    $("#weather_temp").html(tem + '°C');
    $("#weather_condition").html(weather);
    $("#city_location").html(name);
    // display specific weather info
    var windSpeed = newData.wind.speed;
    $("#wind_speed").html(windSpeed + ' m/s');
    var pressure = newData.main.pressure;
    $("#pressure").html(pressure + ' hpa');
    var tempMax = newData.main.temp_max;
    var tempMin = newData.main.temp_min;
    $("#temp_range").html(tempMin + '°C' + ' ~ ' + tempMax + '°C');
    var cloudiness = newData.weather[0].description;
    $("#cloudiness").html(cloudiness);
    var humidity = newData.main.humidity;
    $("#humidity").html(humidity + ' %');
    var visibility = newData.visibility;
    $("#visibility").html(visibility + ' m');
    // display skycons of the weather
    choice(weather, weatherDes, h);

    // if(weather.indexOf("Sunny")==0){
    //   skycons.set("icon1", Skycons.CLEAR_DAY);
    // } else if(weather.indexOf("Clouds")==0){
    //   skycons.set("icon1", Skycons.CLOUDY);
    // } else if(weather.indexOf("Rain")==0){
    //   skycons.set("icon1", Skycons.RAIN);
    // } else if(weather.indexOf("Thunderstorm"==0)){
    //   skycons.set("icon1", Skycons.SLEET);
    // } else if(weather.indexOf("Clear"==0)){
    //   skycons.set("icon1", Skycons.CLEAR_DAY);
    // } else if(weather.indexOf("Snow"==0)){
    //   skycons.set("icon1", Skycons.SNOW);
    // }  
}

// display skycons of the weather
function choice(weather, weatherDes, h){
  // var hour = time.slice(11, 13);
  // console.log(hour);
  console.log(h);
  switch(0){
      case weather.indexOf("Sunny"):
        skycons.set("icon1", Skycons.CLEAR_DAY)
        // $("body").css("background-image", "url('img/sunny.jpg')")
        break;
      case weather.indexOf("Clouds"):
        if((weatherDes.indexOf("few")>=0)&&(weatherDes.indexOf("clouds")>=0)){
          if((h>=7)&&(h<=19)){
            skycons.set("icon1", Skycons.PARTLY_CLOUDY_DAY);
          }else if((h<7)||(h>19)){
            skycons.set("icon1", Skycons.PARTLY_CLOUDY_NIGHT);
            console.log(h);
          }
        }else{skycons.set("icon1", Skycons.CLOUDY)}
        // $("body").css("background-image", "url('img/cloud_day.jpg')")
        break;
      case weather.indexOf("Rain"):
        skycons.set("icon1", Skycons.RAIN)
        // $("body").css("background-image", "url('img/rain.jpg')")
        break;
      case weather.indexOf("Thunderstorm"):
        skycons.set("icon1", Skycons.SLEET)
        break;
      // case weather.indexOf("Clear"):
      //   skycons.set("icon1", Skycons.CLEAR_DAY)
      //   break;
      case weather.indexOf("Clear"):
        if((h>=7)&&(h<=19)){
            skycons.set("icon1", Skycons.CLEAR_DAY);
            console.log(h);
        } else if((h<7)||(h>19)){
          skycons.set("icon1", Skycons.CLEAR_NIGHT);
          // console.log(h);
        }
      // $("body").css("background-image", "url('img/sunny.jpg')")
        break;
      case weather.indexOf("Snow"):
        skycons.set("icon1", Skycons.SNOW)
        // $("body").css("background-image", "url('img/snow.jpg')")
        break;
      default:
        skycons.set("icon1", Skycons.CLEAR_DAY)
         // $("body").css("background-image", "url('img/sunny.jpg')");
      }
}

// automatic location detection and load info
window.onload = function geoLocalLocation() {
  $('.notice').html("Locating...");
  if (navigator.geolocation){
  	function success(position) {
    var lat  = position.coords.latitude;
    var lon = position.coords.longitude;

    var map = new Image();
    map.src = "https://maps.googleapis.com/maps/api/staticmap?center="+lat +","+lon+ "&zoom=13&size=200x200&sensor=false";
  	$("#map").html(map);

    function gettime(time){
      var hour = time.slice(11, 13);
      $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID=d513b230efddbb56c45dd07bb4ff64ee&units=metric", 
      function(data){
      var rawData = JSON.stringify(data);
      var newData = JSON.parse(rawData);
      updateCityData(newData, hour);
      });
    }

    $.getJSON("http://api.timezonedb.com/v2/get-time-zone?key=9HO0KV4NHEH5&format=json&by=position&lat="+lat+"&lng="+lon,
    function(data){
      var rawTime = JSON.stringify(data);
      var newTime = JSON.parse(rawTime);
      var time = newTime.formatted;
      // hour = time.slice(11, 13);
      gettime(time);
      $(".time").html(time);
      })
    }

  	function error(){
    $(".notice").html("Unable to retrive your position");
  }

    navigator.geolocation.getCurrentPosition(success, error);
  } else{
    $(".notice").html("Geolocation is not supported by your browser");
    return;
  }
}
