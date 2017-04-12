var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  $scope.guessFlag = {};
  $scope.guessFlag.score = 0;
  $scope.guessFlag.allAsk = 0;

  $scope.mode = 0;

  $http.get("https://restcountries.eu/rest/v2/all")
  .then(function(response) {
    //console.log(response.data);
      $scope.data = response.data;
  });

  $scope.showAll = function() {
    $scope.mode = 1;
    $scope.countries = $scope.data;
  };

  $scope.gueessFlag = function() {
    $scope.mode = 2;
    var size = $scope.data.length;
    var randomIndex = Math.floor((Math.random() * size) + 1);


    $scope.guessFlag.country = $scope.data[randomIndex];
    $scope.guessFlag.answersIds = generateAnswers(size, randomIndex);
    if (document.getElementById("next_flag_button")) {
      document.getElementById("next_flag_button").disabled = true;
    }

    //$('.answer-button').disabled = false;
  };

  $scope.checkFlag = function(code) {
    var correctCode = $scope.guessFlag.country.alpha2Code;
    if (code == correctCode) {
      $scope.guessFlag.score += 1;
      var correctAnswear = '.answer_button--' + correctCode;
      $(correctAnswear).removeClass('btn-default').addClass('btn-success');
    } else {
      var correctAnswear = '.answer_button--' + correctCode;
      var wrongAnswear = '.answer_button--' + code;
      $(correctAnswear).removeClass('btn-default').addClass('btn-success');
      $(wrongAnswear).removeClass('btn-default').addClass('btn-danger');
    }
    $scope.guessFlag.allAsk += 1;
    document.getElementById("next_flag_button").disabled = false;
    $("#next_flag_button").removeClass('disabled');
  };



});

function generateAnswers(size, randomIndex){
  var answersIds = generateThreeRandom(size);
  answersIds.push(randomIndex);
  answersIds.sort(function(a, b){return a-b});
  return answersIds;
}

function generateThreeRandom(n){
  var n3 = Math.floor(Math.random() * n);
  var n2 = Math.floor(Math.random() * n);
  var n1 = Math.floor(Math.random() * n);

  while(n1 == n3)
  {
      n1 = Math.floor(Math.random() * n);
  }
  while (n2 == n1 || n2 == n3)
  {
      n2 = Math.floor(Math.random() * n);
  }
  return [n1,n2,n3];
}
