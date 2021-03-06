angular.module("fish-cast")
.service('searchService', function($http, $state, $timeout){

	this.location;
    this.forecast = null;
    this.lat;
    this.lng;
    this.error = false;
    this.tides;
    this.tripResults;
    this.tripTides;

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
                        forecast.lowTides = [];
                        forecast.highTides = [];
                        forecast.formattedDate = forecast.date.pretty;
                        forecast.formattedDate = forecast.formattedDate.split(' ');
                        //Change the month in the weather forecast to a number
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
                        //set the latitude and longitude for google maps
                        searchService.lat = response.data.current_observation.display_location.latitude;
                        searchService.lng = response.data.current_observation.display_location.longitude;
                        searchService.city = response.data.current_observation.display_location.full;
                        $http({
                            method: 'GET',
                            url: 'http://www.worldtides.info/api?extremes&lat=' + searchService.lat + '&lon=' + searchService.lng + '&length=' + 861640 + '&maxcalls=2' + '&key=' + 'aa7eeccd-b1cc-4752-9e59-cdcfa7e3ddaf',
                        }).then(function(response){
                            console.log(response);
                            //Format the tide info to be the same as weather forecast, So they can be paired up
                            searchService.tides = response.data.extremes;
                            searchService.tides.forEach(function(tide){
                                tide.date = tide.date.split("T");
                                tide.date = tide.date[0];
                                //Match the tides with the appropriate day from the weather forecast
                                for (var i = 0; i < searchService.forecast.length; i++) {
                                    if (tide.date == searchService.forecast[i].formattedDate) {
                                        searchService.forecast[i].tides.push(tide);
                                    }
                                }
                                //Seperate the tides for each day into Low and High tides
                                for (var i = 0; i < searchService.forecast.length; i++){
                                    for (var j = 0; j < searchService.forecast[i].tides.length; j++){
                                        if (searchService.forecast[i].tides[j].type == "Low") {
                                            searchService.forecast[i].lowTides.push(searchService.forecast[i].tides[j]);
                                            searchService.forecast[i].tides.splice(j, 1);

                                        }
                                        else {
                                            searchService.forecast[i].highTides.push(searchService.forecast[i].tides[j]);
                                            searchService.forecast[i].tides.splice(j, 1);
                                        }
                                    }
                                }
                            });
                            $timeout(function(){$state.go('results')}, 1000);
                        });
                    });
                }
        });

    };

    searchService.tripSearch = function(tripResults, tripTides){
        searchService.tripResults = tripResults;
        searchService.tripTides = tripTides;
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

    //callback function to display an error message if the location isn't found
    function checkForError() {
        $scope.error = searchService.error;
        if ($scope.error == true) {
            $timeout(resetError, 5000);
        }
    };

    //callback function to get rid of the error message
    function resetError() {
        $scope.error = false;
    };

})
.controller('resultsCtrl', function($scope, searchService, $http) {
    console.log("resultsCtrl loaded!");
    $scope.lat = searchService.lat;
    $scope.lng = searchService.lng;
    $scope.location = searchService.location;
    $scope.city = searchService.city;
    $scope.map = { center: { latitude: $scope.lat, longitude: $scope.lng }, zoom: 11 };
    $scope.forecast = searchService.forecast;
    console.log($scope.forecast);

    $scope.start_date;
    $scope.end_date;
    $scope.formatted_start_date;
    $scope.formatted_end_date;
    $scope.start_epoch;
    $scope.end_epoch;
    $scope.tripLength;
    $scope.tripResults;
    $scope.tripTides;


    $scope.show10Day = true;

    $scope.click10Day = function(){
        $scope.show10Day = true;
        $scope.showTripPlanner = false;
    }

    $scope.clickTripPlanner = function(){
        $scope.showTripPlanner = true;
        $scope.show10Day = false;
    }

    $scope.tripSearch = function(a,b){
        $scope.start_date = new Date(a);
        $scope.end_date = new Date(b);
        $scope.formatted_start_date = getFormattedDate($scope.start_date);
        $scope.formatted_end_date = getFormattedDate($scope.end_date);
        $scope.start_epoch = Date.parse($scope.start_date)/1000;
        $scope.end_epoch = Date.parse($scope.end_date)/1000;
        $scope.tripLength = $scope.end_epoch - $scope.start_epoch;
        console.log($scope.start_epoch);
        console.log($scope.end_epoch);
        console.log("trip length: " + $scope.tripLength);
        //HTTP Request for the trip's weather forecast
        $http({
            method: "GET",
            url: "http://api.wunderground.com/api/8511c7dcba1454f3/planner_" + $scope.formatted_start_date + $scope.formatted_end_date + "/q/CA/" + $scope.location + ".json"
        }).then(function(response){
            console.log(response);
            $scope.tripResults = response.data.trip;
            //HTTP request for the tides throughout the trip;
            $http({
                method: "GET",
                url: "https://www.worldtides.info/api?extremes&lat=" + $scope.lat + "&lon=" + $scope.lng + "&start=" + $scope.start_epoch + "&length=" + $scope.tripLength + "&key=aa7eeccd-b1cc-4752-9e59-cdcfa7e3ddaf"
            }).then(function(response){
                console.log(response);
                $scope.tripTides = response.data.extremes;
                searchService.tripSearch($scope.tripResults, $scope.tripTides);
            });
        });
    }

    function getFormattedDate(date) {
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return month + day;
    }

})