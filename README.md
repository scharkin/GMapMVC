Compare JS frameworks
=====================
Demo app with [Google Maps API](https://developers.google.com/maps/web/) created to compare 
[Angular](https://angularjs.org/), [Backbone](http://backbonejs.org/), 
[Ember](http://emberjs.com/), and [Polymer](https://www.polymer-project.org/).

<a href="http://www.youtube.com/watch?feature=player_embedded&v=Yo_i4Nd9e5E
" target="_blank"><img src="http://img.youtube.com/vi/Yo_i4Nd9e5E/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

##### Run a web server

python -m SimpleHTTPServer

##### See in a browser
http://localhost:8000/angular

http://localhost:8000/backbone

http://localhost:8000/ember


##### Setup polymer with preinstaled [Bower](http://bower.io/)
cd polymer; bower update; cd ..

##### Setup ionic with preinstaled [nodejs](https://nodejs.org/)
sudo npm install -g ios-sim

sudo npm install -g ionic cordova

cd ionic

bower update  

##### Run in iOS emulator
ionic platform add ios

ionic build ios

ionic emulate ios

##### Run on Android device or [emulator](http://www.genymotion.com)
ionic platform add android

ionic build android

ionic run android
