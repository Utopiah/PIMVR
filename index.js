var socket = new WebSocket("ws://vatelier.net:9876");

// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
// Only enable it if you actually need to.
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
var scene = new THREE.Scene();

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
var reticle = vreticle.Reticle(camera);
scene.add(camera);

// load Wiki graph
arr=MyWiki; //imported before as .js file
var dictionary = arr.Nodes;
var keys = [];
keys = Object.keys(dictionary);
var firstkey = keys[0];

var pagesize = 1;

// functions assumed a scene nammed "scene"

requirejs(['pimvr'], function(pimvr){
	console.log('Module loaded');
	PIMVR.PositionPagesAsSphere(dictionary, 0, 5);
	//using optional starting page and limit parameters
	//PositionPagesAsSphere(dictionary);
});

// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// boundary sphere
var geometry = new THREE.SphereGeometry(24, 12, 8);
var sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xFFFFFF, transparent: true, opacity: 0.5, wireframe: true}));
scene.add(sphere);

// Create a VR manager helper to enter and exit VR mode.
var manager = new WebVRManager(renderer, effect, {hideButton: false});

// Request animation frame loop function
function animate(timestamp) {

  // Update VR headset position and apply to camera.
  controls.update();

  // Render the scene through the manager.
  manager.render(scene, camera, timestamp);

  TWEEN.update();
  reticle.reticle_loop();
  requestAnimationFrame(animate);
}

// Kick off animation loop
animate();

// Reset the position sensor when 'z' pressed.
function onKey(event) {
  if (event.keyCode == 90) { // z
    controls.resetSensor();
  }
}

window.addEventListener('keydown', onKey, true);

var lookedAtPage = false;
var lastKeyPressed = []

socket.onopen = function(){
        //socket.send(JSON.stringify({uuid: playerUuid, color: playerColor, position: camera.position}));
        socket.send(JSON.stringify({action:"Viewer connected"}));
};
socket.onmessage = function(msg){
        console.log('data:', msg.data);

        if (msg.data == "down button pressed "){
		lastKeyPressed.push({time: Date.now(), key: "down"});
                camera.position.x += 0.2;
        }
        if (msg.data == "up button pressed "){
		lastKeyPressed.push({time: Date.now(), key: "up"});
                camera.position.x -= 0.2;
        }
        if (msg.data == "select button pressed "){
		//camera.position.z += 0.2;
		lastKeyPressed.push({time: Date.now(), key: "select"});
		console.log('Selecting page ', lookedAtPage);
		if (lookedAtPage){
			console.log('Selecting page ', lookedAtPage);
		}
        }
        if (msg.data.indexOf("Tap event") !=-1) {
                camera.position.z -= 0.5;
        }
        if (msg.data.indexOf("ViewUpate") != -1) {
		// assume JSON
		json = JSON.parse(msg.data);
		pagename = json.ViewUpdate;
		views = json.value;
		console.log(pagename, views);
		//page = dictionary[pagename]... TODO
		//scale the Y length of the viewindicator of the page updated
        }
};

window.onunload = function (){ socket.send(JSON.stringify({action:"Viewer disconnected"})); };

