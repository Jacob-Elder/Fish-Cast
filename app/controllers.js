angular.module("fish-cast")
.service('searchService', function($http, $state){

	this.location;
	this.date = Date.now();
    this.forecast;
    this.lat;
    this.lng;

    var searchService = this;

    this.search = function(location){
        searchService.location = location;

        $http({
            method: 'GET',
            url: 'http://api.wunderground.com/api/8511c7dcba1454f3/forecast10day/q/CA/' + searchService.location + '.json'
        }).then(function successCallback(response) {
            searchService.forecast = response.data.forecast.simpleforecast.forecastday;
            $http({
                method: 'GET',
                url: 'http://api.wunderground.com/api/8511c7dcba1454f3/conditions/q/CA/' + searchService.location + '.json'
            }).then(function successCallback(response) {
                searchService.lat = response.data.current_observation.display_location.latitude;
                searchService.lng = response.data.current_observation.display_location.longitude;
                $state.go('results');
            });
        });

    }

})
.controller('landingCtrl', function($scope, searchService) {
    $scope.date = searchService.date;
    $scope.location;
    console.log($scope.date);

    $scope.search = function(){
        console.log($scope.location);
        searchService.search($scope.location);
    }

})
.controller('resultsCtrl', function($scope, searchService) {
    console.log("resultsCtrl loaded!");
    $scope.lat = searchService.lat;
    $scope.lng = searchService.lng;
    $scope.map = { center: { latitude: $scope.lat, longitude: $scope.lng }, zoom: 8 };
    $scope.forecast = searchService.forecast;
    console.log($scope.forecast);
})