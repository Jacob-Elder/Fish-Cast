var app = angular.module("fish-cast", ["ui.router", 'uiGmapgoogle-maps'])
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

app.directive("lineGraph", function(){

	function link(scope, element, attr){
		var data = [
			{ "time": 3, "height": -.7},
			{ "time": 10, "height": 2.1},
			{ "time": 15, "height": 0.3}
		];
		var graph = d3.select("#graph");
		var element = element[0];
		var MARGINS = {
		top: 20,
		right: 20,
		bottom: 20,
		left: 50
		};
		var WIDTH = 350;
		var HEIGHT = 200;
		var xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0,24]); //scale x-axis to fit all values
		var yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([-2,3])

		var xAxis = d3.svg.axis().scale(xScale);
		var yAxis = d3.svg.axis().scale(yScale).orient("left");

		graph.append("svg:g").attr("transform", "translate(0, 131)").call(xAxis);
		graph.append("svg:g").attr("transform", "translate(47, -49)").call(yAxis.ticks(6));

		var lineGen = d3.svg.line()
  		.x(function(d) {
    		return xScale(d.time);
  		})
  		.y(function(d) {
    		return yScale(d.height);
  		});

		graph.append('svg:path').attr('d', lineGen(data));
	}

	return {
		link: link,
		restrict: "E"
	};
})
