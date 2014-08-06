var deploy_guides = angular.module('extract-deploy-guides', ['ngRoute', 'ngResource'])
  //.controller('HomeCtrl', [

deploy_guides.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({
    templateUrl: '/templates/home.html',
    controller: 'HomeCtrl'
  })
}])
