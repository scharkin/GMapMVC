App = Ember.Application.create();

App.Place = Ember.Object.extend({}); //create place model

App.PlaceController = Ember.ObjectController.extend({
  selected: false,  //handle one place

  actions: { // called from html template
    select: function () {
      this.selectPlace(); //select place on card click
    }
  },

  selectPlace: function () {
    var places = this.parentController._subControllers;
    for (var i = places.length - 1; i >= 0; i--) {
      if (places[i].get("selected")) {
        places[i].set("selected", false)
      } //clean all selected
    } //select only one place
    this.set("selected", !this.get("selected"));
  }
});

App.PlacesController = Ember.ArrayController.extend({
  itemController: "place", //handle all places
  sortProperties: ['city'], //sort list of places by city
  sortAscending: true
});

App.MapView = Ember.CollectionView.extend({ //show one place
  mapTagId: "place-map",
  itemViewClass: 'App.MarkerView',
  contentBinding: 'App.PlacesController',
  didInsertElement: function () { //life cycle event after insertion
    var that = this;
    $.getJSON("../api/places.json").then(function (data) {
      that.get("controller").set("content", data); //set places data list
    });
    this.map = new google.maps.Map(document.getElementById(this.mapTagId),
      { center: new google.maps.LatLng(42.33, -71.1), zoom: 8 });
  }
});

App.MarkerView = Ember.View.extend({
  iconMap: {
    true: "../img/pin.png",
    false: "../img/ball.png"
  },
  didInsertElement: function () {
    var pos = new google.maps.LatLng(this.content.get("lat"), this.content.get("lon"));
    this.marker = new google.maps.Marker({ //create marker
      position: pos,
      map: this.get("parentView").get("map"),
      icon: this.iconMap[this.content.selected]
    });
    var that = this;
    google.maps.event.addListener(this.marker, 'click', function () {
      that.content.selectPlace(); //select place on marker click
    });
  },

  observeSelected: function () {
    this.marker.setIcon(this.iconMap[this.content.selected]); //pin selected place
    this.get("parentView").get("map").panTo(this.marker.position); //center selected
    setTimeout(function () { // scroll to selected place card
      var el = $('.place.selected');
      if (el.length) {
        var element = $(el[0])
        var pos = element.position().top + element.parent().scrollTop();
        element.parent().animate({scrollTop: pos}, 1000);
      }
    }, 100);
  }.observes("content.selected") //watch selected property changes
});
