deploy_guides.controller('HomeCtrl', ['$scope', 'deployGuideService', function($scope, Guide) {
  var ignoreFragmentRules = [];

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

    var removeFirstChar = function(line) {
      return line.substr(1);
    }

    var computeFragments = function(lines) {
      var indexFragmentStart = -1;
      var fragments = [];
      for(index = 0; index < lines.length; index++) {
        if (isDiffFragment(lines[index]) && (index > indexFragmentStart)) {
          if (index > indexFragmentStart) {
            var fragmentContent = lines.slice(indexFragmentStart, index)
            if ( $.trim(fragmentContent) !== '' ) {
              oldChanges = fragmentContent.filter(isChangeInOldBranch).map(removeFirstChar);
              newChanges = fragmentContent.filter(isChangeInNewBranch).map(removeFirstChar);

              fragments.push({
                old_changes: oldChanges.join("\n"),
                new_changes: newChanges.join("\n"),
                isSelected: false
              });
            }
          }
          indexFragmentStart = index + 1;
        }
      }

      return fragments;
    };

    var lines = diff_output.split("\n");
    relevantLines = lines.filter(isChangedLine);

    fragments = computeFragments(relevantLines);

    // Remove fragments that are whitespace changes only

    return fragments;
  };

  $scope.in_construct_state = false;
  $scope.deployGuide = null;

  $scope.generateDeployGuide = function() {
    $scope.in_construct_state = false;

    wantedFragments = [];
    for(index = 0; index < $scope.fragments.length; index++) {
      if ($scope.fragments[index].isSelected) {
        wantedFragments.push($scope.fragments[index].new_changes);
      }
    }

    if (wantedFragments.length === 0)
      $scope.deployGuide = "Generated deployment guide is empty.";
    else
      $scope.deployGuide = wantedFragments.join("\n");
  }

  $scope.inConstructState = function() {
    return $scope.in_construct_state;
  }

  $scope.computeDeployGuide = function() {
    console.log("Extracting deploy guide for repo: " + $scope.repo.name);
    Guide.getInstallationGuide($scope.repo.name, $scope.repo.old_branch, $scope.repo.new_branch, $scope.repo.old_path, $scope.repo.new_path, function(data, status) {
      $scope.in_construct_state = false;
      if (status === 422) {
        $scope.deployGuide = data.error;
      } else if(status === 500) {
        $scope.deployGuide = "Server threw up all over our request :("
      } else {
        $scope.fragments = parseDiffOutput(data.contents);
        if ($scope.fragments.length === 0)
          $scope.deployGuide = "No infrastructure changes detected.";
        else
          $scope.in_construct_state = true;
      }
    });
  }

  $scope.selectFragment = function(fragment) {
    fragment.isSelected = !fragment.isSelected;
  }
}])
