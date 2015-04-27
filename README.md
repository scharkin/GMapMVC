Compare JS frameworks
=====================
Use [Google Maps API](https://developers.google.com/maps/web/) with 
[Angular](https://angularjs.org/), 
[Backbone](http://backbonejs.org/), 
[Ember](http://emberjs.com/),
[Polymer](https://www.polymer-project.org/). 
[See video](https://www.youtube.com/watch?v=Yo_i4Nd9e5E)

###### Run a web server
```
python -m SimpleHTTPServer
```

##### See in a browser
```
http://localhost:8000/angular
http://localhost:8000/backbone
http://localhost:8000/ember
```

#### Setup polymer with preinstaled [Bower](http://bower.io/)
```
cd polymer
bower update
cd ..
```

##### Setup ionic with preinstaled [nodejs](https://nodejs.org/)
```
sudo npm install -g ios-sim
sudo npm install -g ionic cordova
cd ionic
bower update  
```

#### Run in iOS emulator
```
ionic platform add ios
ionic build ios
ionic emulate ios
```

#### Run on Android device or [emulator](http://www.genymotion.com)
```
ionic platform add android
ionic build android
ionic run android
```
