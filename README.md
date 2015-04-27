Compare JS frameworks
=====================

[Angular](https://angularjs.org/), 
[Backbone](http://backbonejs.org/), 
[Ember](http://emberjs.com/),
[Polymer](https://www.polymer-project.org/) 
using [Google Maps API](https://developers.google.com/maps/web/). 

### Need [Bower](http://bower.io/)
``` run:
cd polymer
bower update
cd ..
```

```
python -m SimpleHTTPServer
```

### See in a browser
```
http://localhost:8000/angular
http://localhost:8000/backbone
http://localhost:8000/ember
```
### Need [nodejs](https://nodejs.org/)
``` run:
sudo npm install -g ios-sim
sudo npm install -g ionic cordova
cd ionic
bower update  
```

#### iOS emulator
```
ionic platform add ios
ionic build ios
ionic emulate ios
```

#### Android device or [Genymotion](http://www.genymotion.com)
```
ionic platform add android
ionic build android
ionic run android
```
