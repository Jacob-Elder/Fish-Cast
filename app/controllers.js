angular.module("fish-cast")
.service('searchService', function($http, $state, $timeout){

	this.location;
    this.forecast = null;
    this.lat;
    this.lng;
    this.error = false;
    this.minHeight = null;
    this.maxHeight = null;
    this.tides;

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
                    //Loop through the forecasts and make the date format the same as from the tides API
                    searchService.forecast.forEach(function(forecast){
                        forecast.tides = [];
                        forecast.formattedDate = forecast.date.pretty;
                        forecast.formattedDate = forecast.formattedDate.split(' ');
                        //Change the date to number format
                        switch(forecast.formattedDate[4]){
                            case "January":
                                forecast.formattedDate[4] = '01';
                                break;
                            case "February":
                                forecast.formattedDate[4] = '02';
                                break;
                            case "March":
                                forecast.formattedDate[4] = '03';
                                break;
                            case "April":
                                forecast.formattedDate[4] = '04';
                                break;
                            case "May":
                                forecast.formattedDate[4] = '05';
                                break;
                            case "June":
                                forecast.formattedDate[4] = '06';
                                break;
                            case "July":
                                forecast.formattedDate[4] = '07';
                                break;
                            case "August":
                                forecast.formattedDate[4] = '08';
                                break;
                            case "September":
                                forecast.formattedDate[4] = '09';
                                break;
                            case "October":
                                forecast.formattedDate[4] = '10';
                                break;
                            case "November":
                                forecast.formattedDate[4] = '11';
                                break;
                            case "December":
                                forecast.formattedDate[4] = '12';
                                break;

                        }
                        //Remove the comma after the day
                        forecast.formattedDate[5] = forecast.formattedDate[5].replace(",", "");
                        //Put it all together in the right order ex:2017-07-18
                        forecast.formattedDate = forecast.formattedDate[6] + '-' + forecast.formattedDate[4] + '-' + forecast.formattedDate[5];
                    });
                    $http({
                        method: 'GET',
                        url: 'http://api.wunderground.com/api/8511c7dcba1454f3/conditions/q/CA/' + searchService.location + '.json'
                    }).then(function successCallback(response) {
                        searchService.lat = response.data.current_observation.display_location.latitude;
                        searchService.lng = response.data.current_observation.display_location.longitude;
                        searchService.city = response.data.current_observation.display_location.full;
                        $http({
                            method: 'GET',
                            url: 'http://www.worldtides.info/api?extremes&lat=' + searchService.lat + '&lon=' + searchService.lng + '&length=' + 861640 + '&maxcalls=2' + '&key=' + 'aa7eeccd-b1cc-4752-9e59-cdcfa7e3ddaf',
                        }).then(function(response){
                            console.log(response);
                            searchService.tides = response.data.extremes;
                            searchService.tides.forEach(function(tide){
                                tide.date = tide.date.split("T");
                                tide.date = tide.date[0];
                                for (var i = 0; i < searchService.forecast.length; i++) {
                                    if (tide.date == searchService.forecast[i].formattedDate) {
                                        searchService.forecast[i].tides.push(tide);
                                    }
                                }
                            });
                            $timeout(function(){$state.go('results')}, 500);
                        });
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