$(function () {
  var Place = Backbone.Model.extend({
    selected: false, //model to handle one place

    select: function () {
      this.collection.each(function (model) {
        if (model.get('selected')) {
          model.set('selected', false)
        } //clean all selected
      }); //select only one place
      this.set("selected", !this.get("selected"));
    }
  });

  var Places = Backbone.Collection.extend({
    model: Place  //collection to handle all places
  });

  var PlaceView = Backbone.View.extend({
    className: 'place',
    iconMap: {
      true: "../img/pin.png",
      false: "../img/ball.png"
    },
    marker: null,
    events: {
      'click': 'select'
    },

    select: function () {
      this.model.select();
    },

    initialize: function () {
      this.template = _.template($('#placeDetails').html());
      this.listenTo(this.model, 'change', this.showSelectedPlace);
    },

    showSelectedPlace: function () {
      this.marker.setIcon(this.iconMap[!!this.model.changed.selected]);
      this.selectPlaceCard(this.model.changed.selected);
      this.map.panTo(this.marker.position);
    },

    selectPlaceCard: function () {
      if (this.model.changed.selected) {
        $('.place').removeClass('selected');
        $('.' + this.model.id).addClass('selected');
        this.scrollToSelected();
      }
    },

    scrollToSelected: function () { // scroll to selected place card
      var el = $('.place.selected');
      if (el.length) {
        var element = $(el[0]);
        var pos = element.position().top + element.parent().scrollTop();
        element.parent().animate({scrollTop: pos}, 1000);
      }
    },

    showOnMap: function (map) {
      this.map = map;
      this.marker = new google.maps.Marker({ //create marker
        position: new google.maps.LatLng(this.model.get('lat'), this.model.get('lon')),
        map: map,
        icon: this.iconMap[false]
      });
      var that = this;
      google.maps.event.addListener(that.marker, 'click', function (e) {
        that.model.select(); //select place on marker click
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
        { zoom: 8, center: new google.maps.LatLng(42.2, -71.3)});
      var that = this;
      $.getJSON("../api/places.json").then(function (data) { //get places data
        new Places(new Places(data).sortBy(function(c) { //create collection
          return c.get('city'); //sort places by city
        })).each(function (place) {
          that.addPlace(place); //add place to the map and list views
        });
      });
    }
  });

  new MapView();
});
