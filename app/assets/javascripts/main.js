var deploy_guides = angular.module('extract-deploy-guides', ['ngRoute', 'ngResource'])

deploy_guides.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({
    templateUrl: '/templates/home.html',
    controller: 'HomeCtrl'
  })
}]);

deploy_guides.directive('contenteditable', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      // view -> model
      element.bind('blur', function() {
        scope.$apply(function() {
          ctrl.$setViewValue(element.html());
        });
      });

      // model -> view
      ctrl.$render = function() {
        element.html(ctrl.$viewValue);
      };
    }
  };
});
