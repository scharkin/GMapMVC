GMapMVC
=======

[Angular](https://angularjs.org/), 
[Backbone](http://backbonejs.org/), 
[Ember](http://emberjs.com/),
[Polymer](https://www.polymer-project.org/) 
with [Google Maps API](https://developers.google.com/maps/web/). 

# prerequisite
[bower](http://bower.io/) should be installed 
# update polymer
cd polymer
bower update
cd ..

# run a web server
python -m SimpleHTTPServer

# see in a browser
http://localhost:8000/angular
http://localhost:8000/backbone
http://localhost:8000/ember

# ionic prerequisite
[nodejs](https://nodejs.org/) should be installed
# ionic setup
sudo npm install -g ios-sim
sudo npm install -g ionic cordova
cd ionic
bower update  

## ios emulator
ionic platform add ios
ionic build ios
ionic emulate ios

## hookup android device to USB port or run [Genymotion](http://www.genymotion.com) emulator
ionic platform add android
ionic build android
ionic run android

# run presentation
sudo npm install -g grunt
cd presentation
grunt
