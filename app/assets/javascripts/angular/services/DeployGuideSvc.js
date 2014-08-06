deploy_guides.factory('deployGuideService', ['$http', function($http) {
  var constructUrl = function(repo, old_branch, new_branch) {
    queryParams = 'repo=' + repo + "&old_branch=" + old_branch + "&new_branch=" + new_branch;

    return ('installation_guide?' + queryParams);
  };

  getInstallationGuide = function (repo, old_branch, new_branch, callback) {
    $http.defaults.headers.put["Content-Type"] = "application/json";
    $http({method: 'get', url: constructUrl(repo, old_branch, new_branch)})
      .success( function(data, status, headers, config) { callback(data, status); })
      .error(function(data, status, headers, config) { callback(data, status); });
  }

  return {getInstallationGuide: getInstallationGuide};
}])
