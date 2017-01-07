angular.module("fish-cast")
.service('searchService', function(){

	this.location;
	this.date = Date.now();

})
.controller('landingCtrl', function($scope, searchService) {
    $scope.date = searchService.date;
    console.log($scope.date);

    $scope.search = function(location){
    	console.log(location);
    	//make http requests here for the weather and tides based on the location and date
    	//change the center of the g-map based on location input
    }
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

});