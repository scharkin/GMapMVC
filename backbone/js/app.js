$(function () {
  var Cafe = Backbone.Model.extend({
    selected: false,

    select: function () {
      this.collection.each(function (model) {
        if (model.get('selected')) {
          model.set('selected', false)
        }
      });
      this.set("selected", !this.get("selected"));
    }
  });

  var Cafes = Backbone.Collection.extend({
    model: Cafe
  });

  var CafeView = Backbone.View.extend({
    className: 'place',
    iconMap: {
      true: "img/pin.png",
      false: "img/ball.png"
    },
    marker: undefined,
    events: {
      'click': 'select'
    },

    select: function () {
      this.model.select();
    },

    initialize: function () {
      this.template = _.template($('#cafeDetails').html());
      this.listenTo(this.model, 'change', this.showSelected);
    },

    showSelected: function () {
      this.marker.setIcon(this.iconMap[!!this.model.changed.selected]);
      this.selectItem(this.model.changed.selected);
    },

    selectItem: function () {
      if (this.model.changed.selected) {
        $('.place').removeClass('selected');
        $('.' + this.model.id).addClass('selected');
        this.scrollToSelected();
      }
    },

    scrollToSelected: function () {
      var el = $('.place.selected');
      if (el.length) {
        var element = $(el[0])
        var pos = element.position().top + element.parent().scrollTop();
        element.parent().animate({
          scrollTop: pos
        }, 1000);
      }
    },

    showOnMap: function (mapView) {
      var that = this;
      var position = new google.maps.LatLng(
        this.model.get('lat'), this.model.get('lon'));
      that.marker = new google.maps.Marker({
        position: position,
        map: mapView.map,
        icon: this.iconMap[false]
      });
      google.maps.event.addListener(that.marker, 'click', function (e) {
        that.model.select();
      });
    },

    render: function () {
      var view = this.template(this.model.toJSON());
      this.$el.html(view);
      return this.$el;
    }
  });

  var MapView = Backbone.View.extend({
    el: $('#gmap'),

    addCafe: function (cafe) {
      var view = new CafeView({model: cafe});
      view.showOnMap(this);
      var item = view.render();
      item.addClass(view.model.id);
      $('#glist').append(item);
    },

    initialize: function (cafes) {
      var latlng = new google.maps.LatLng(42.2, -71.3);
      var mapOptions = {
        zoom: 8,
        center: latlng
      };
      this.map = new google.maps.Map(document.getElementById('gmap'), mapOptions);
      var that = this;
      // sort cafe list by city
      var collection = new Cafes(new Cafes(cafes).sortBy(function(c) {return c.get('city')}));
      collection.each(function (cafe) {
        that.addCafe(cafe);
      });
    }
  });

  var cafes = [{city: 'Boston', name: 'MA, Boston - Landmark - Park Drive', zip: '02215', lon: '-71.10285', state: 'MA', address: '201 Brookline Avenue', lat: '42.344764', id: '601272'}, {city: 'Braintree', name: 'MA, Boston - Braintree', zip: '02184', lon: '-71.018779', state: 'MA', address: '400 Franklin Street', lat: '42.211673', id: '601396'}, {city: 'Milford', name: 'MA, Boston - Milford', zip: '01757', lon: '-71.491066', state: 'MA', address: '91 Medway Road', lat: '42.146906', id: '601457'}, {city: 'Lexington', name: 'MA, Boston - Lexington', zip: '02420', lon: '-71.225932', state: 'MA', address: '1684 Massachusetts Avenue', lat: '42.446879', id: '601521'}, {city: 'Bedford', name: 'MA, Boston - Bedford (DELCO)', zip: '01730', lon: '-71.235298', state: 'MA', address: '213 Burlington Road', lat: '42.501159', id: '607001'}, {city: 'Lynnfield', name: 'MA, Lynnfield - Market Street', zip: '01940', lon: '-71.030477', state: 'MA', address: '430 Market Street', lat: '42.515528', id: '601574'}, {city: 'Westford', name: 'MA, Westford - Cornerstone Square', zip: '01886', lon: '-71.426262', state: 'MA', address: '2 Cornerstone Square', lat: '42.565868', id: '601593'}, {city: 'Leominster', name: 'MA, Leominster - Commercial Rd', zip: '01453', lon: '-71.742981', state: 'MA', address: '100 Commercial Road', lat: '42.529667', id: '203419'}, {city: 'Chelmsford', name: 'MA, Chelmsford - Drum Hill Road', zip: '01824', lon: '-71.361861', state: 'MA', address: '90 Drum Hill Road', lat: '42.622474', id: '203420'}, {city: 'East Longmeadow', name: 'MA, East Longmeadow - North Main Street', zip: '01028', lon: '-72.526665', state: 'MA', address: '406 North Main Street', lat: '42.077457', id: '203424'}, {city: 'Marlborough', name: 'MA, Marlborough - Boston Post Road', zip: '01752', lon: '-71.591286', state: 'MA', address: '197 Boston Post Road W', lat: '42.340149', id: '203426'}, {city: 'Hadley', name: 'MA, Hadley - Russell Street', zip: '01035', lon: '-72.553719', state: 'MA', address: '351 Russell Street', lat: '42.353733', id: '203427'}, {city: 'West Springfield', name: 'MA, West Springfield - Riverdale Street', zip: '01089', lon: '-72.621834', state: 'MA', address: '935 Riverdale Street', lat: '42.130066', id: '203428'}, {city: 'Beverly', name: 'MA, Beverly - Dodge Street', zip: '01915', lon: '-70.889519', state: 'MA', address: '57 Dodge Street', lat: '42.575932', id: '203429'}, {city: 'Westborough', name: 'MA, Westborough - Union Street', zip: '01581', lon: '-71.609535', state: 'MA', address: '600 Union Street', lat: '42.270882', id: '203431'}, {city: 'Chicopee', name: 'MA, Chicopee - 591 Memorial Dr', zip: '01020', lon: '-72.575401', state: 'MA', address: '601 Memorial Drive', lat: '42.174732', id: '203433'}, {city: 'Pittsfield', name: 'MA, Pittsfield - Merrill Road', zip: '01201', lon: '-73.206436', state: 'MA', address: '635 Merrill Road', lat: '42.465149', id: '203436'}, {city: 'Natick', name: 'MA, Natick - Route 9', zip: '01760', lon: '-71.359154', state: 'MA', address: '841 Worcester Street', lat: '42.30101', id: '203437'}, {city: 'Worcester', name: 'MA, Worcester - Gold Star Boulevard', zip: '01606', lon: '-71.802864', state: 'MA', address: '120 Gold Star Boulevard', lat: '42.295979', id: '203440'}, {city: 'Newburyport', name: 'MA, Newburyport  - Storey Avenue', zip: '01950', lon: '-70.907135', state: 'MA', address: '55 Storey Avenue', lat: '42.820351', id: '203441'}, {city: 'Watertown', name: 'MA, Watertown - Arsenal Street', zip: '02472', lon: '-71.165154', state: 'MA', address: '321 Arsenal Street', lat: '42.363682', id: '203542'}, {city: 'Burlington', name: 'MA, Burlington - Cambridge Street', zip: '01803', lon: '-71.186852', state: 'MA', address: '34 Cambridge Street', lat: '42.48455', id: '203543'}, {city: 'Quincy', name: 'MA, North Quincy - Hancock Street', zip: '02171', lon: '-71.030914', state: 'MA', address: '200 Hancock Street', lat: '42.278217', id: '203544'}, {city: 'Everett', name: 'MA, Everett - Mystic View Road', zip: '02149', lon: '-71.069885', state: 'MA', address: '27 Mystic View Road', lat: '42.401016', id: '203545'}, {city: 'Franklin', name: 'MA, Franklin - Franklin Village Drive', zip: '02038', lon: '-71.42437', state: 'MA', address: '270 Franklin Village Drive', lat: '42.088917', id: '203546'}, {city: 'Danvers', name: 'MA, Danvers - Liberty Tree Mall', zip: '01923', lon: '-70.939568', state: 'MA', address: '100 Independence Way', lat: '42.551765', id: '203548'}, {city: 'Dedham', name: 'MA, Dedham - Providence Highway', zip: '02026', lon: '-71.178436', state: 'MA', address: '797 Providence Highway', lat: '42.238335', id: '203549'}, {city: 'Waltham', name: 'MA, Waltham - Lexington Street', zip: '02452', lon: '-71.233734', state: 'MA', address: '1100 Lexington Street', lat: '42.413033', id: '203550'}, {city: 'Hyannis', name: 'MA, Hyannis - Iyannough Road', zip: '02601', lon: '-70.29834', state: 'MA', address: '790 Iyannough Road', lat: '41.669613', id: '203551'}, {city: 'Saugus', name: 'MA, Saugus - Broadway US Route 1', zip: '01906', lon: '-71.024384', state: 'MA', address: '647 Broadway', lat: '42.479382', id: '203552'}, {city: 'Stoughton', name: 'MA, Stoughton - Park Street', zip: '02072', lon: '-71.06665', state: 'MA', address: '1334 Park Street', lat: '42.101868', id: '203553'}, {city: 'Hanover', name: 'MA, Hanover - Washington Street', zip: '02339', lon: '-70.843948', state: 'MA', address: '1401 Washington Street', lat: '42.144852', id: '203554'}, {city: 'Hingham', name: 'MA, Hingham - Derby Street', zip: '02043', lon: '-70.909233', state: 'MA', address: '92 Derby Street', lat: '42.178902', id: '203555'}, {city: 'Plymouth', name: 'MA, Plymouth - 46 Shops @ 5 Way', zip: '02360', lon: '-70.653198', state: 'MA', address: '46 Shops at 5 Way', lat: '41.929619', id: '203557'}, {city: 'Needham', name: 'MA, Needham - Highland Avenue', zip: '02494', lon: '-71.218567', state: 'MA', address: '120 Highland Avenue', lat: '42.304733', id: '203558'}, {city: 'Boston', name: 'MA, Boston - High Street', zip: '02110', lon: '-71.05172', state: 'MA', address: '200 High Street', lat: '42.356785', id: '203705'}, {city: 'Framingham', name: 'MA, Framingham - Cochituate Road', zip: '01701', lon: '-71.39962', state: 'MA', address: '400 Cochituate Road', lat: '42.305717', id: '203405'}, {city: 'Swampscott', name: 'MA, Swampscott - Paradise Road', zip: '01907', lon: '-70.90168', state: 'MA', address: '433 Paradise Road', lat: '42.48135', id: '600666'}, {city: 'Brookline', name: 'MA, Brookline - Harvard Street', zip: '02446', lon: '-71.122536', state: 'MA', address: '299 Harvard Street', lat: '42.342999', id: '601129'}, {city: 'Plymouth', name: 'MA, Plymouth - Colony Place', zip: '02360', lon: '-70.713364', state: 'MA', address: '138 Colony Place', lat: '41.955666', id: '601216'}, {city: 'Brookline', name: 'MA, Brookline - Commonwealth Ave', zip: '02115', lon: '-71.115448', state: 'MA', address: '888 Commonwealth Ave.', lat: '42.35136', id: '601359'}, {city: 'East Walpole', name: 'MA, East Walpole - Providence Hwy', zip: '02032', lon: '-71.20433', state: 'MA', address: '130 Providence Highway', lat: '42.153645', id: '601362'}, {city: 'Raynham', name: 'MA, Raynham - New State Highway', zip: '02767', lon: '-71.054207', state: 'MA', address: '300 New State Highway', lat: '41.906109', id: '601388'}, {city: 'Hingham', name: 'MA, Hingham - Shipyard Drive', zip: '02043', lon: '-70.921707', state: 'MA', address: '1 Shipyard Drive', lat: '42.251472', id: '601390'}, {city: 'Newton', name: 'MA, Newton - Centre Street', zip: '02459', lon: '-71.194862', state: 'MA', address: '1241 Centre Street', lat: '42.330822', id: '601403'}, {city: 'West Roxbury', name: 'MA, West Roxbury - Spring Street', zip: '02132', lon: '-71.163551', state: 'MA', address: '77 Spring Street', lat: '42.278053', id: '601411'}, {city: 'Boston', name: 'MA, Boston - Huntington Avenue', zip: '02115', lon: '-71.086456', state: 'MA', address: '289 Huntington Avenue', lat: '42.342068', id: '601415'}, {city: 'Dorchester', name: 'MA, Dorchester - Allstate Road', zip: '02125', lon: '-71.062576', state: 'MA', address: '8 Allstate Road', lat: '42.327171', id: '601429'}, {city: 'Brockton', name: 'MA, Brockton - Belmont Street', zip: '02301', lon: '-71.069099', state: 'MA', address: '1301 Belmont Street', lat: '42.058533', id: '601440'}, {city: 'Boston', name: 'MA, Boston - Boylston Street', zip: '02116', lon: '-71.073219', state: 'MA', address: '450 Boylston Street', lat: '42.351185', id: '601449'}, {city: 'Milbury', name: 'MA, Milbury - Worcester-Providence Turnpike', zip: '01527', lon: '-71.780029', state: 'MA', address: '70 Worcester-Providence Turnpike', lat: '42.200356', id: '601460'}, {city: 'Cambridge', name: 'MA, Cambridge - White Street', zip: '02140', lon: '-71.118835', state: 'MA', address: '5 White Street', lat: '42.38868', id: '601507'}, {city: 'Waltham', name: 'MA, Waltham - Main Street', zip: '02451', lon: '-71.253224', state: 'MA', address: '1030 Main Street', lat: '42.376334', id: '601537'}, {city: 'Boston', name: 'MA, Boston - Stuart Street', zip: '02116', lon: '-71.065376', state: 'MA', address: '115 Stuart Street', lat: '42.351105', id: '601540'}, {city: 'Cambrige', name: 'MA, Cambrige - Massachusetts Ave', zip: '02138', lon: '-71.116951', state: 'MA', address: '1288 Massachusetts Ave', lat: '42.372787', id: '601568'}, {city: 'Wilmington', name: 'MA, Wilmington - Main Street', zip: '01887', lon: '-71.181473', state: 'MA', address: '228 Main Street', lat: '42.556984', id: '601592'}, {city: 'Mashpee', name: 'MA, Mashpee - Steeple Street', zip: '02649', lon: '-70.491798', state: 'MA', address: '8 Steeple Street', lat: '41.616901', id: '601611'}, {city: 'Chestnut Hill', name: 'MA, Chestnut Hill - Boylston St.', zip: '02467', lon: '-71.176739', state: 'MA', address: '220 Boylston St.', lat: '42.319914', id: '601626'}, {city: 'Wayland', name: 'MA, Wayland - Boston Post Road', zip: '01778', lon: '-71.365898', state: 'MA', address: '400 Boston Post Road', lat: '42.366787', id: '601631'}, {city: 'Cambridge', name: 'MA, Cambridge - Alewife Brook Parkway', zip: '02138', lon: '-71.142159', state: 'MA', address: '174 Alewife Brook Parkway', lat: '42.390041', id: '601672'}, {city: 'Webster', name: 'MA, Webster - Worcester Road', zip: '01570', lon: '-71.863541', state: 'MA', address: '2 Worcester Road', lat: '42.06015', id: '601683'}, {city: 'Boston', name: 'MA, Boston - Union Street', zip: '02108', lon: '-71.056706', state: 'MA', address: '1 Union Street', lat: '42.360548', id: '601717'}, {city: 'North Andover', name: 'MA, North Andover - Peters Street', zip: '01845', lon: '-71.12677', state: 'MA', address: '58 Peters Street', lat: '42.675133', id: '203410'}, {city: 'Woburn', name: 'MA, Woburn - Mishawum Road', zip: '01801', lon: '-71.132866', state: 'MA', address: '296 Mishawum Road', lat: '42.505001', id: '203411'}, {city: 'Shrewsbury', name: 'MA, Shrewsbury - Boston Turnpike', zip: '01545', lon: '-71.752686', state: 'MA', address: '50 Boston Turnpike', lat: '42.273151', id: '203412'}, {city: 'North Attleboro', name: 'MA, North Attleborough - North Attleboro', zip: '02760', lon: '-71.347633', state: 'MA', address: '1250 South Washington Street', lat: '41.940434', id: '203856'}, {city: 'North Dartmouth', name: 'MA, North Dartmouth - N Dartmouth Mall Dr', zip: '02747', lon: '-70.989883', state: 'MA', address: '84 N Dartmouth Mall', lat: '41.642082', id: '203860'}, {city: 'Seekonk', name: 'MA, Seekonk - Highland Avenue', zip: '02771', lon: '-71.333541', state: 'MA', address: '221 A Highland Avenue', lat: '41.798767', id: '203869'}, {city: 'Plainville', name: 'MA, Plainville - Taunton Street', zip: '02762', lon: '-71.310951', state: 'MA', address: '103 Taunton Street', lat: '42.032516', id: '203873'}];
  new MapView(cafes);
});