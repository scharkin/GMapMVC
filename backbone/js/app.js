$(function () {
  var Place = Backbone.Model.extend({ // handle a place
    selected: false,

    select: function () { // clear all, select one place
      this.collection.each(function (model) {
        if (model.get('selected')) {
          model.set('selected', false)
        }
      });
      this.set("selected", !this.get("selected"));
    }
  });

  var Places = Backbone.Collection.extend({ // handle all places
    model: Place
  });

  var PlaceView = Backbone.View.extend({
    className: 'place',
    iconMap: {true: "../img/pin.png", false: "../img/ball.png"},
    pin: undefined, // no pin initially
    events: {
      'click': function () { this.model.select() }
    },

    initialize: function () {
      this.listenTo(this.model, 'change', this.showSelectedPlace);
      this.template = _.template($('#placeCell').html());
    },

    showSelectedPlace: function () {
      this.pin.setIcon(this.iconMap[!!this.model.changed.selected]);
      this.map.panTo(this.pin.position);
      this.highlightPlaceCard(this.model.changed.selected);
    },

    highlightPlaceCard: function () {
      if (this.model.changed.selected) {
        $('.place').removeClass('selected');
        $('.' + this.model.id).addClass('selected');
        this.scrollToSelected();
      }
    },

    scrollToSelected: function () {
      var el = $('.place.selected');
      if (el.length) {
        var element = $(el[0]); // scroll to selected place card
        var pos = element.position().top + element.parent().scrollTop();
        element.parent().animate({scrollTop: pos}, 1000);
      }
    },

    showOnMap: function (map) {
      this.map = map;
      this.pin = new google.maps.Marker({ //create marker
        position: new google.maps.LatLng(this.model.get('lat'), this.model.get('lon')),
        map: map,
        icon: this.iconMap[false]
      });
      var that = this;
      google.maps.event.addListener(that.pin, 'click', function (e) {
        that.model.select(); // select place on marker click
      });
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this.$el;
    }
  });

  var MapView = Backbone.View.extend({
    el: $('#place-map'),

    addPlace: function (place) {
      var view = new PlaceView({model: place});
      view.showOnMap(this.map);
      $('#place-list').append(view.render().addClass(view.model.id));
    },

    initialize: function () {
      this.map = new google.maps.Map(document.getElementById('place-map'),
        { zoom: 10, center: new google.maps.LatLng(42.3, -71.1)});
      var that = this;
      $.getJSON("../api/places.json").then(function (data) { // get places
        new Places(new Places(data).sortBy(function(c) { // create collection
          return c.get('city'); // sort places by city
        })).each(function (place) {
          that.addPlace(place); //add place to the map and list views
        });
      });
    }
  });

  new MapView();
});
