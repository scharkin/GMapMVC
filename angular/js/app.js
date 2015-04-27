// app level module with dependencies
angular.module('myApp', ['google-maps']).
  controller('PlacesCtrl', function ($scope, $http) { // select places
    $http.get('../api/places.json').success(function (data) {
      $scope.places = _.map(data,function(e) {
        e.tip = e.address + ', ' + e.city;
        return e;
      });
    });
    $scope.center = {latitude: 42.3, longitude: -71.1};
    $scope.zoom = 10;

    $scope.selectPlace = function (place) {
      $scope.selectedPlaceId = place.id;
      $scope.center = {latitude: place.lat, longitude: place.lon};
    }

    $scope.getIcon = function (place) {
      return place.id == $scope.selectedPlaceId ? '../img/pin.png' : '../img/ball.png'
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
