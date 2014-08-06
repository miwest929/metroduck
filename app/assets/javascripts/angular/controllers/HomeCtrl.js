deploy_guides.controller('HomeCtrl', ['$scope', 'deployGuideService', function($scope, Guide) {
  var isChangeInNewBranch = function(diff_line) {
    return (diff_line.charAt(0) === ">");
  }

  var isChangeInOldBranch = function(diff_line) {
    return (diff_line.charAt(0) === "<");
  }

  var filterOut = function(lines, filterFn) {
    var filteredLines = [];

    for (index = 0; index < lines.length; ++index) {
      if (!filterFn(lines[index])) {
        filteredLines.push(lines[index]);
      }
    }

    return filteredLines;
  }

  // selectFn must return true or false. true implies that the line should get be included.
  var selectLines = function(lines, selectFn) {
    var selectedLines = [];

    for (index = 0; index < lines.length; ++index) {
      if (selectFn(lines[index])) {
        selectedLines.push(lines[index]);
      }
    }

    return selectedLines;
  }

  var parseDiffOutput = function(diff_output) {
    var lines = diff_output.split("\n");

    var relevantLines = filterOut(lines, isChangeInOldBranch);

    // Strip out trailing '>'
    for (index = 0; index < relevantLines.length; index++) {
      if (isChangeInNewBranch(relevantLines[index])) {
        relevantLines[index] = relevantLines[index].substr(1);
      }
    }

    var isDiffFragment = function(line) {
      regexp = new RegExp(/[1-9ad,]+/);

      return regexp.exec(line) === null;
    }

    var indexFragmentStart = -1;
    var fragments = [];
    for(index = 0; index < relevantLines.length; index++) {
      if (isDiffFragment(relevantLines[index])) {
        if (indexFragmentStart !== -1 && index > indexFragmentStart) {
          fragments.push({
            content: relevantLines.slice(indexFragmentStart, index - 1).join("\n"),
            isSelected: false
          });
        }
        indexFragmentStart = index + 1;
      }
    }

    return fragments;
  };

  $scope.diff_output = null;
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
        console.log("422!!!");
        $scope.diff_output = data.error;
      } else {
        $scope.in_construct_state = true;
        $scope.fragments = parseDiffOutput(data.contents);
        $scope.diff_output = parseDiffOutput(data.contents);
      }
    });
  }

  $scope.selectFragment = function(fragment) {
    fragment.isSelected = !fragment.isSelected;
  }
}])
