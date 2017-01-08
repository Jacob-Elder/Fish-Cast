angular.module("fish-cast")
.service('searchService', function($http, $state){

	this.location;
	this.date = Date.now();
    this.data;
    this.lat;
    this.lng;

    var searchService = this;

    this.search = function(location){
        this.location = location;

        $http({
            method: 'GET',
            url: 'http://api.wunderground.com/api/8511c7dcba1454f3/forecast10day/q/CA/San_Francisco.json'
        }).then(function successCallback(response) {
            console.log(response);
        });

        $http({
            method: 'GET',
            url: 'http://api.wunderground.com/api/8511c7dcba1454f3/conditions/q/CA/San_Francisco.json'
        }).then(function successCallback(response) {
            console.log(response.data.current_observation.display_location.latitude);
            searchService.lat = response.data.current_observation.display_location.latitude;
            searchService.lng = response.data.current_observation.display_location.longitude;
            $state.go('results');
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
    console.log($scope.lat);
    console.log($scope.lng);
    $scope.map = { center: { latitude: $scope.lat, longitude: $scope.lng }, zoom: 8 };
})