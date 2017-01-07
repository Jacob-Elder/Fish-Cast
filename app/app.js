angular.module("fish-cast", ["ui.router", 'uiGmapgoogle-maps'])
.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
			$urlRouterProvider.otherwise("/");

	$stateProvider
	.state("home", {
		url: "/",
		templateUrl: "app/views/landing.html",
		controller: "landingCtrl"
	})

	$locationProvider.html5Mode(true);
}]);