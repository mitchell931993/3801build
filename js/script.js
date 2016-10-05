angular.module('IoT', ['ngRoute'])

 .controller('MainController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
 })

 .controller('LandingController', function($scope, $routeParams) {
     $scope.name = "LandingController";
     $scope.params = $routeParams;
 })

.controller('FormController', ['$scope',
    function($scope) {

    }
])

.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'index/welcome.html',
    controller: 'LandingController',
  })
  .when('/Home/contact', {
    templateUrl: 'index/contact.html',
    controller: 'LandingController'
  });

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});
