angular.module("fish-cast", ["ui.router", 'uiGmapgoogle-maps'])
.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
			$urlRouterProvider.otherwise("/");

	$stateProvider
	.state("landing", {
		url: "/",
		templateUrl: "app/views/landing.html",
		controller: "landingCtrl"
	})
	.state("results", {
		url: "/results",
		templateUrl: "app/views/results.html",
		controller: "resultsCtrl"
	})

	$locationProvider.html5Mode(true);
}]);