deploy_guides.controller('HomeCtrl', ['$scope', 'deployGuideService', function($scope, Guide) {
  var parseDiffOutput = function(diff_output) {

    var isChangeInNewBranch = function(diff_line) {
      return (diff_line.charAt(0) === ">");
    }

    var isChangedLine = function(diff_line) {
      return (isChangeInNewBranch(diff_line) || isChangeInOldBranch(diff_line) || isDiffFragment(diff_line));
    }

    var isChangeInOldBranch = function(diff_line) {
      return (diff_line.charAt(0) === "<");
    }

    var isDiffFragment = function(line) {
      regexp = new RegExp(/([1-9]+[acd]{1})+/);

      return (regexp.exec(line) !== null);
    }

    var lines = diff_output.split("\n");
    relevantLines = lines.filter(isChangedLine);

    // Strip out trailing '>'
    for (index = 0; index < relevantLines.length; index++) {
      if (isChangeInNewBranch(relevantLines[index])) {
        relevantLines[index] = relevantLines[index].substr(1);
      }
    }

    var indexFragmentStart = -1;
    var fragments = [];
    for(index = 0; index < relevantLines.length; index++) {
      if (isDiffFragment(relevantLines[index])) {
        if (index > indexFragmentStart) {
          var fragmentContent = relevantLines.slice(indexFragmentStart, index).join("\n");
          if ( $.trim(fragmentContent) !== '' ) {
            fragments.push({
              content: fragmentContent,
              isSelected: false
            });
          }
        }
        indexFragmentStart = index + 1;
      }
    }

    return fragments;
  };

  $scope.in_construct_state = false;

  $scope.generateDeployGuide = function() {
    $scope.in_construct_state = false;

    wantedFragments = [];
    for(index = 0; index < $scope.fragments.length; index++) {
      if ($scope.fragments[index].isSelected) {
        wantedFragments.push($scope.fragments[index].content);
      }
    }

    $scope.deployGuide = wantedFragments.join("\n");
    console.log($scope.deployGuide);
  }

  $scope.inConstructState = function() {
    return $scope.in_construct_state;
  }

  $scope.computeDeployGuide = function() {
    $scope.in_construct_state = false;

    console.log("Extracting deploy guide for repo: " + $scope.repo.name);
    Guide.getInstallationGuide($scope.repo.name, $scope.repo.old_branch, $scope.repo.new_branch, function(data, status) {
      if (status === 422) {
        $scope.deployGuide = data.error;
      } else if(status === 500) {
        $scope.deployGuide = "Server threw up all over our request :("
      } else {
        $scope.in_construct_state = true;
        $scope.fragments = parseDiffOutput(data.contents);
      }
    });
  }

  $scope.selectFragment = function(fragment) {
    fragment.isSelected = !fragment.isSelected;
  }
}])
