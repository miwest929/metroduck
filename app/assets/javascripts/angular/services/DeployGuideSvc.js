deploy_guides.factory('deployGuideService', ['$http', function($http) {
  getInstallationGuide = function (repo, branch, callback) {
    $http.defaults.headers.put["Content-Type"] = "application/json";
    $http({method: 'get', url: 'installation_guide?repo=' + repo + "&branch=" + branch})
      .success( function(data, status, headers, config) { callback(data, status); });
  }

  return {getInstallationGuide: getInstallationGuide};
}])
