//we have access to a global angular variable becaude we brought in the
//angular package in our index.html
var isItCloudyDependencies = [
  'firebase'
];
angular
//create our module, which points to the root of our application
//the dots below are called method chaining
  .module("isItCloudy", isItCloudyDependencies)
  //next we'll create our controller
  .controller("MainController", MainController)

//next we'll create a factory this will speak to our weather API
  .factory("WeatherAPI", WeatherAPI);
WeatherAPI.$inject = ["$http"];
function WeatherAPI($http) {
  function getWeatherForZipCode(zipCode) {
    return $http.get("http://api.openweathermap.org/data/2.5/weather?zip="+ zipCode +",us&APPID=00f3ffdd009fd71660c71c8a064aa5b5");

  }
  return {
    "getWeatherForZipCode": getWeatherForZipCode
  };
}

//manually injecting $scope into our controller
//minification-safe, expert level achieved
MainController.$inject = [
  "$scope",
  "$firebaseArray",
  "WeatherAPI"
];

  function MainController ($scope, $firebaseArray, WeatherAPI) {
    var ref = new Firebase("https://isitcloudy.firebaseio.com/");
    $scope.greeting = "Hello World!";
    $scope.forecasts = $firebaseArray(ref);
    $scope.user = "Super Star";
    $scope.KelvinToF = function(degreesKelvin) {
      return Math.round(degreesKelvin *(9/5) - 459.67);
    };
    $scope.getForecastByZipCode = function(zipCode) {
      WeatherAPI.getWeatherForZipCode(zipCode)
      .then(onSuccess)
      .catch(onFailure);
    };
    //this is matching up to the repeat
    function onSuccess(response){
      var forecast = response.data;
      forecast.zipCode = $scope.zipCode;
      $scope.forecasts.forEach(function(arrItem, index){
        if(arrItem.zipCode === $scope.zipCode) {
          $scope.forecasts.$remove(arrItem)
        }
      });
      $scope.forecasts.$add(forecast);
    }
    function onFailure(error) {
      console.error(error);
    }
  }
