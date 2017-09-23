angular.module('app.routes', ['ngRoute'])

	.config(function($routeProvider, $locationProvider) {

		$routeProvider

		// route for the home page
			.when('/', {
				templateUrl : 'views/pages/home.html'
			})
			// login page
			.when('/login', {
				controller: 'mainCtrl',
				templateUrl: 'views/pages/login.html'
			})

			.when('/clima', {
				templateUrl: 'views/pages/iot/casa.html',
				controller: 'mqttController',
				controllerAs: 'mqtt'
			})

			.when('/energia', {
				templateUrl: 'views/pages/iot/energia.html',
				controller: 'mqttControllerEnergia'
			})

			.when('/maps', {
				templateUrl: 'views/pages/iot/localizacao.html',
				controller: 'mqttControllerMaps'
			})

			.when('/agua', {
				templateUrl: 'views/pages/iot/agua.html',
				controller: 'mqttController',
				controllerAs: 'mqtt'
			})

			.when('/iluminacao', {
				templateUrl: 'views/pages/iot/iluminacao.html',
				controller: 'mqttController',
				controllerAs: 'mqtt'
			})

			.otherwise({
				templateUrl: 'views/pages/error/error.html'
			});

	});
