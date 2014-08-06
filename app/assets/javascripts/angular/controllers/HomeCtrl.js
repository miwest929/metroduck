deploy_guides.controller('HomeCtrl', ['$scope', 'deployGuideService', function($scope, Guide) {
  $scope.computeDeployGuide = function() {
    console.log("Extracting deploy guide for repo: " + $scope.repo.name);
    Guide.getInstallationGuide($scope.repo.name, $scope.repo.old_branch, function(data, status) {
      console.log(data);
      $scope.repo.old_installation_guide = data.contents;
    });
  }
}])
