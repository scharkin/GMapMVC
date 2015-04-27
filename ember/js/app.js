App = Ember.Application.create();

App.Place = Ember.Object.extend({}); //create place model

App.PlaceController = Ember.ObjectController.extend({  // handle one place
  selected: false,

  actions: { // called from html template
    select: function () {
      this.selectPlace();
    } // select place on card click
  },

  selectPlace: function () {
    var places = this.parentController._subControllers;
    for (var i = places.length - 1; i >= 0; i--) {
      if (places[i].get("selected")) {
        places[i].set("selected", false)
      } // clear all selected
    } // select one place
    this.set("selected", !this.get("selected"));
  }
});

App.PlacesController = Ember.ArrayController.extend({ // handle all places
  itemController: "place",
  sortProperties: ['city'], // sort list of places by city
  sortAscending: true
});

App.MapView = Ember.CollectionView.extend({ // show map
  itemViewClass: 'App.MarkerView', // convention
  contentBinding: 'App.PlacesController', // convention

  didInsertElement: function () { // life cycle event after insertion
    this.map = new google.maps.Map(document.getElementById("place-map"),
      { center: new google.maps.LatLng(42.3, -71.1), zoom: 10 });
    var that = this;
    $.getJSON("../api/places.json").then(function (data) {
      that.get("controller").set("content", data); // load places
    });
  }
});

App.MarkerView = Ember.View.extend({
  iconMap: {true: "../img/pin.png", false: "../img/ball.png"},

  didInsertElement: function () {
    this.marker = new google.maps.Marker({ // create marker
      position: new google.maps.LatLng(this.content.get("lat"), this.content.get("lon")),
      map: this.get("parentView").get("map"),
      icon: this.iconMap[this.content.selected]
    });
    var that = this;
    google.maps.event.addListener(this.marker, 'click', function () {
      that.content.selectPlace(); // select place on marker click
    });
  },

  observeSelected: function () {
    this.marker.setIcon(this.iconMap[this.content.selected]); // pin a place
    this.get("parentView").get("map").panTo(this.marker.position); // center it
    setTimeout(function () {
      var el = $('.place.selected');
      if (el.length) {
        var element = $(el[0]) // auto scroll to selected place card
        var pos = element.position().top + element.parent().scrollTop();
        element.parent().animate({scrollTop: pos}, 1000);
      }
    }, 100);
  }.observes("content.selected") // watch property change
});
