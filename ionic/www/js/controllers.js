angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('MapCtrl', function($scope, $ionicLoading) {
  $scope.mapCreated = function(map) {
    console.log('map',map)
    $scope.map = map;
  };
})

.controller('PlaylistsCtrl', function($scope, $http) {
  $http.get('places.json').success(function (data) {
    $scope.$parent.playlists = data;
  });
  $scope.$parent.selectPlace = function (place) {
    window.selectedPlaceId = place.id;
    $scope.selectedPlaceId = window.selectedPlaceId;
    window.center = {latitude: place.lat, longitude: place.lon};
  }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
    window.center = {latitude: 42.2, longitude: -71.1};
    $scope.center = window.center;
    $scope.zoom = 10;
    $scope.getIcon = function (place) {
      var isSelected = place.id == window.selectedPlaceId;
      return isSelected ? 'pin.png' : 'ball.png'
    }
});
