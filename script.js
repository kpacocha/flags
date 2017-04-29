var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  $scope.game = {};
  $scope.game.score = 0;
  $scope.game.askedCount = 0;
  $scope.game.started = false;
  $scope.game.configuration = {};
  $scope.game.configuration = {questionCount: 4};

  $scope.mode = 0;
  $scope.regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  $scope.showAll = function() {
    $scope.mode = 1;
    $http.get("https://restcountries.eu/rest/v2/all")
      .then(function(response) {
          $scope.countries = response.data;
      });
    };

  $scope.showAll();

  

  

  $scope.gueessFlag = function() {
    $scope.mode = 2;
    var size = $scope.countries.length;
    var randomIndex = Math.floor((Math.random() * size) + 1);
    $scope.game.askedCount += 1;
    $scope.game.country = $scope.countries[randomIndex];
    $scope.game.answersIds = generateAnswers(size, randomIndex);
    if (document.getElementById("next_flag_button")) {
      document.getElementById("next_flag_button").disabled = true;
    }

    //$('.answer-button').disabled = false;
  };

  $scope.checkFlag = function(code) {

    var correctCode = $scope.game.country.alpha2Code;
    if (code == correctCode) {
      $scope.game.score += 1;
      var correctAnswear = '.answer_button--' + correctCode;
      $(correctAnswear).removeClass('btn-default').addClass('btn-success');
    } else {
      var correctAnswear = '.answer_button--' + correctCode;
      var wrongAnswear = '.answer_button--' + code;
      $(correctAnswear).removeClass('btn-default').addClass('btn-success');
      $(wrongAnswear).removeClass('btn-default').addClass('btn-danger');
    }
    
    document.getElementById("next_flag_button").disabled = false;
    $("#next_flag_button").removeClass('disabled');
  };

  $scope.changeRegion = function(newRegion) {
    var url = "https://restcountries.eu/rest/v2/region/" + newRegion;
    console.log(url);
    $http.get(url)
    .then(function(response) {
        $scope.countries = response.data;
    });
  };

  $scope.showMap = function() {
    $scope.mode = 3;
    showMap(null);
  };

  $scope.getResults = function() {
    return $scope.game.score / $scope.game.configuration.questionCount * 100;
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

function showMap(countryId) {
  if (countryId == null) {
    var mapDiv = "mapdiv";
    countryId = "PL";
  }
  else 
  var mapDiv = "map_" + countryId;

  AmCharts.makeChart( mapDiv, {
    "type": "map",
    "theme": "light",
    "dataProvider": {
      "map": "worldLow",
      "getAreasFromMap": true,
      "linkToObject": countryId
      //"areas": [
      //  { "id": countryId }
      //]
    },

    "areasSettings": {
      "autoZoom": true,
      "selectedColor": "#CC0000"
    },

    "smallMap": {}
  } );
};


$( document ).ready(function() {
  $('.modal').on('shown.bs.modal', function() {
    var id = $(this).attr('id').split('_')[1];
    showMap(id);
  })
});
