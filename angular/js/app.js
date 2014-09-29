// app level module with dependencies
angular.module('myApp', ['google-maps']).
  controller('PlacesCtrl', function ($scope, $http) { // select places
    $http.get('../api/places.json').success(function (data) {
      $scope.places = data;
    });
    $scope.center = {latitude: 42.2, longitude: -71.3};
    $scope.zoom = 8;

    $scope.selectPlace = function (place) {
      $scope.selectedPlaceId = place.id;
      $scope.center = {latitude: place.lat, longitude: place.lon};
    }

    $scope.getIcon = function (place) {
      var icon = '../img/ball.png';
      if ($scope.selectedPlaceId == place.id) {
        icon = '../img/pin.png'
      }
      return icon;
    }
  }).
  directive('scrollIf', function () { // scroll to selected place
    return function (scope, element, attrs) {
      scope.$watch(attrs.scrollIf, function (value) {
        if (value) {
          var pos = element.position().top + element.parent().scrollTop();
          element.parent().animate({scrollTop: pos}, 1000);
        }
      });
    }
  });
