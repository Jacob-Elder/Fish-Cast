angular.module("fish-cast")
.service('searchService', function($http, $state){

	this.location;
    this.forecast = null;
    this.lat;
    this.lng;
    this.error = false;

    var searchService = this;

    this.search = function(location){
        searchService.location = location;

        $http({
            method: 'GET',
            url: 'http://api.wunderground.com/api/8511c7dcba1454f3/forecast10day/q/CA/' + searchService.location + '.json'
        }).then(function successCallback(response) {
                console.log(response);
                if (response.data.response.error) {
                    searchService.error = true;
                }
                else {
                    searchService.forecast = response.data.forecast.simpleforecast.forecastday;
                    $http({
                        method: 'GET',
                        url: 'http://api.wunderground.com/api/8511c7dcba1454f3/conditions/q/CA/' + searchService.location + '.json'
                    }).then(function successCallback(response) {
                        searchService.lat = response.data.current_observation.display_location.latitude;
                        searchService.lng = response.data.current_observation.display_location.longitude;
                        searchService.city = response.data.current_observation.display_location.full;
                        $state.go('results');
                    });
                }
        });

    }

})
.controller('landingCtrl', function($scope, searchService, $timeout) {
    $scope.location;
    $scope.error = false;

    $scope.search = function(){
        console.log($scope.location);
        searchService.search($scope.location);
        $timeout(checkForError, 1000);
    }

    function checkForError() {
        $scope.error = searchService.error;
        if ($scope.error == true) {
            $timeout(resetError, 5000);
        }
    };

    function resetError() {
        $scope.error = false;
    };

})
.controller('resultsCtrl', function($scope, searchService) {
    console.log("resultsCtrl loaded!");
    $scope.lat = searchService.lat;
    $scope.lng = searchService.lng;
    $scope.city = searchService.city;
    $scope.map = { center: { latitude: $scope.lat, longitude: $scope.lng }, zoom: 11 };
    $scope.forecast = searchService.forecast;
    console.log($scope.forecast);
})