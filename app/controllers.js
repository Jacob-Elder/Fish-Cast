angular.module("fish-cast")
.service('searchService', function(){

	this.location;
	this.date = Date.now();

})
.controller('landingCtrl', function($scope, searchService) {
    $scope.date = searchService.date;
    console.log($scope.date);
});