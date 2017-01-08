angular.module("fish-cast")
.service('searchService', function(){

	this.location;
	this.date = Date.now();

    this.search = function(location){
        this.location = location;
        console.log("searchService location: " + this.location);
    }

})
.controller('landingCtrl', function($scope, searchService, $state) {
    $scope.date = searchService.date;
    $scope.location;
    console.log($scope.date);

    $scope.search = function(){
        console.log($scope.location);
        searchService.search($scope.location);
        $state.go('results');
    	//make http requests here for the weather and tides based on the location and date
    	//change the center of the g-map based on location input
    }

})
.controller('resultsCtrl', function($scope, searchService) {
    console.log("resultsCtrl loaded!");
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
})