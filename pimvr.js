var PIMVR = (function(){

// adding a page from the graph to the 3D scene
function PositionPage(dictionary, PIMPage, position, tweening){
	if (!position) {
		var boundary = -5;
		var position = new THREE.Vector3(Math.random() * 2 * (-boundary) + boundary,
				Math.random() * 2 * (-boundary) + boundary,
				Math.random() * 2 * (-boundary) + boundary);
	}
	var mygeometry = new THREE.CubeGeometry(pagesize, pagesize, pagesize * PIMPage.Rev / 100);
	var textureUrl = "./MyRenderedPages/fabien.benetou.fr_" + PIMPage.Id.replace(".", "_") + ".png";
	var mytexture = THREE.ImageUtils.loadTexture(textureUrl);
	// consider instead http://threejs.org/docs/#Reference/Loaders/TextureLoader
	var mymaterial = new THREE.MeshBasicMaterial({map: mytexture, transparent: false, opacity: 0.2, });
	newpage = new THREE.Mesh( mygeometry, mymaterial );
	newpage.lookAt(camera.position);
	if (!tweening){
		newpage.position.copy(position);
	} else {
		var pageInitialTweenPosition = new TWEEN.Tween(newpage.position).to(position, 5*1000).start();
	}
	scene.add(newpage);
	PIMPage.ThreeD = newpage;
	newpage.ongazeover = function(){
		PIMPage.ThreeD.lookAt(camera.position);
		//socket.onopen = function(e) {
		if (socket.readyState === 1) {
			socket.send(JSON.stringify({"name" : PIMPage.Id,
						"x" : PIMPage.ThreeD.position.x,
						"y" : PIMPage.ThreeD.position.y,
						"z" : PIMPage.ThreeD.position.z }));
		}
		if (lastKeyPressed.length>0){
			//console.log(lastKeyPressed);
			lasttiming = lastKeyPressed[lastKeyPressed.length-1].time;
			console.log(lasttiming,'was it recent or not?');
			now = Date.now();
			if ((now - lasttiming) < 5000){
				console.log(lastKeyPressed[lastKeyPressed.length-1].key, 'pressed less than 5 seconds ago');
			}
		}
	}
	newpage.ongazeout = function() {
	}
        reticle.add_collider(newpage);
	return dictionary;
}

// add a button on the top right corner of a positionned page
function PositionPageJumpButton(dictionary, PIMPage) {
	var pageproportion = pagesize/5;
	var geometry = new THREE.CubeGeometry(pageproportion, pageproportion, pageproportion); 
	var material = new THREE.MeshBasicMaterial({color: 0x00FFFF, transparent: true, opacity: 0.5 });
	var jumpbutton = new THREE.Mesh(geometry, material);
	jumpbutton.position = PIMPage.ThreeD.position;
	jumpbutton.position.setX(pagesize/2 + pagesize/10);
	jumpbutton.position.setY(pagesize/2 - pagesize/10);
	PIMPage.ThreeD.add(jumpbutton);
	
        jumpbutton.ongazelong = function() {
		PositionPageTargets(dictionary, PIMPage);
        }
        jumpbutton.ongazeover = function() {
		jumpbutton.scale.set(2,2,2);
        }
        jumpbutton.ongazeout = function() {
		jumpbutton.scale.set(1,1,1);
        }
        reticle.add_collider(jumpbutton);
	return PIMPage;
}

// add a button on the top right corner of a positionned page
function PositionPageMoveButtons(dictionary, PIMPage) {
	var pageproportion = pagesize/5;
	var geometry = new THREE.CylinderGeometry(pageproportion, pageproportion/5, pageproportion, 32); 
	var material = new THREE.MeshBasicMaterial({color: 0x00FFFF, transparent: true, opacity: 0.8 });
	
	var moveleftbutton = new THREE.Mesh(geometry, material);
	moveleftbutton.position = PIMPage.ThreeD.position;
	moveleftbutton.position.setX(pagesize/2 + pagesize/10);
	moveleftbutton.position.setY( - pagesize/2 - pagesize/10);
	moveleftbutton.position.x -= 0.2;
	PIMPage.ThreeD.add(moveleftbutton);
	moveleftbutton.rotateZ(-Math.PI/2);
        moveleftbutton.ongazelong = function() { PIMPage.ThreeD.position.x += 0.1 }
        moveleftbutton.ongazeover = function() { moveleftbutton.scale.set(1.2,1.2,1.2); }
        moveleftbutton.ongazeout = function() { moveleftbutton.scale.set(1,1,1); }
        reticle.add_collider(moveleftbutton);

	var moverightbutton = new THREE.Mesh(geometry, material);
	moverightbutton.position = PIMPage.ThreeD.position;
	moverightbutton.position.setX(pagesize/2 + pagesize/10);
	moverightbutton.position.setY( - pagesize/2 - pagesize/10);
	moverightbutton.position.x += 0.2;
	PIMPage.ThreeD.add(moverightbutton);
	moverightbutton.rotateZ(Math.PI/2);
        moverightbutton.ongazelong = function() { PIMPage.ThreeD.position.x -= 0.1 }
        moverightbutton.ongazeover = function() { moverightbutton.scale.set(1.2,1.2,1.2); }
        moverightbutton.ongazeout = function() { moverightbutton.scale.set(1,1,1); }
        reticle.add_collider(moverightbutton);

	var moveupbutton = new THREE.Mesh(geometry, material);
	moveupbutton.position = PIMPage.ThreeD.position;
	moveupbutton.position.setX(pagesize/2 + pagesize/10);
	moveupbutton.position.setY( - pagesize/2 - pagesize/10);
	moveupbutton.position.y += 0.2;
	PIMPage.ThreeD.add(moveupbutton);
	moveupbutton.rotateZ(Math.PI);
        moveupbutton.ongazelong = function() { PIMPage.ThreeD.position.y += 0.1 }
        moveupbutton.ongazeover = function() { moveupbutton.scale.set(1.2,1.2,1.2); }
        moveupbutton.ongazeout = function() { moveupbutton.scale.set(1,1,1); }
        reticle.add_collider(moveupbutton);

	var movedownbutton = new THREE.Mesh(geometry, material);
	movedownbutton.position = PIMPage.ThreeD.position;
	movedownbutton.position.setX(pagesize/2 + pagesize/10);
	movedownbutton.position.setY( - pagesize/2 - pagesize/10);
	movedownbutton.position.y -= 0.2;
	PIMPage.ThreeD.add(movedownbutton);
        movedownbutton.ongazelong = function() { PIMPage.ThreeD.position.y -= 0.1 }
        movedownbutton.ongazeover = function() { movedownbutton.scale.set(1.2,1.2,1.2); }
        movedownbutton.ongazeout = function() { movedownbutton.scale.set(1,1,1); }
        reticle.add_collider(movedownbutton);

	return PIMPage;
}

// Display an indicator representing the number of views
function PositionPageViewIndicator(dictionary, PIMPage) {
	var pageviews = 1; // PIMPage.pageviews
	var pageproportion = pagesize/5;
	var geometry = new THREE.CubeGeometry(pageproportion/5, pageproportion*pageviews, pageproportion); 
	var material = new THREE.MeshBasicMaterial({color: 0x00DDDD, transparent: true, opacity: 0.5 });
	var pageviewindicator = new THREE.Mesh(geometry, material);
	pageviewindicator.position = PIMPage.ThreeD.position;
	pageviewindicator.position.setX(-pagesize/2 - pagesize/10);
	pageviewindicator.position.setY(pagesize/2 - pagesize/10);
	PIMPage.ThreeD.add(pageviewindicator);
	return PIMPage;
}

// Display the targets of a page (linked item)
function PositionPageTargets(dictionary, PIMPage){
	var backgroundPosition = new THREE.Vector3();
	backgroundPosition.copy(PIMPage.ThreeD.position);
	backgroundPosition.z = -5;
	var maxDisplayedTargets = 5;
	var displayedTargets = 0;
	for (targetPage in PIMPage.Targets){
		var targetPageObj = dictionary[keys[targetPage]];
		// can display a lot, in fact enough to crash the browser
		if (displayedTargets < maxDisplayedTargets) {
			PositionPage(dictionary, targetPageObj, backgroundPosition);
			PositionPageJumpButton(dictionary, targetPageObj);
			backgroundPosition.y += pagesize + pagesize/10;	
			displayedTargets++;
		}
	}
	return dictionary;
}

function PositionPagesAsSphere(dictionary, startingkey, limit){
	// Display the first pages (no specific order)
	if (!limit){
		var limit = 5;
	}
	if (!startingkey){
		var startingkey = 0;
	}
	for (var i=startingkey;i<startingkey+limit;i++){
		var PIMPage = dictionary[keys[i]];
		var radius = 3;
		var x = Math.random() - 0.5;
		var y = Math.random() - 0.5;
		var z = Math.random() - 0.5;
		var pageposition = new THREE.Vector3(x,y,z);
		pageposition.normalize();
		pageposition.multiplyScalar( radius );
		//PositionPage(dictionary, PIMPage, pageposition);
		PositionPage(dictionary, PIMPage, pageposition, true);
		PositionPageJumpButton(dictionary, PIMPage);
		PositionPageViewIndicator(dictionary, PIMPage);
		PositionPageMoveButtons(dictionary, PIMPage);
	}
}

var publicAPI = {
	PositionPage : function (dictionary, PIMPage, position, tweening) { PositionPage(dictionary, PIMPage, position, tweening); },
	PositionPageJumpButton : function (dictionary, PIMPage) { 	PositionPageJumpButton(dictionary, PIMPage); },
	PositionPageTargets : function (dictionary, PIMPage) { 	PositionPageTargets(dictionary, PIMPage); },
	PositionPagesAsSphere : function (dictionary, startingkey, limit) { 	PositionPagesAsSphere(dictionary, startingkey, limit); }
};

return publicAPI;

})();
