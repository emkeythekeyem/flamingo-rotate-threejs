import * as THREE from "three";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

import flamingoTexture from "../img/models/flamingo/flamingopink.jpg";
import flamingoOBJ from "../img/models/flamingo/PinkFlamingo_V1.obj";

var container;

var camera, scene, renderer;

var mouseX = 0,
  mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var flamingo;

var mouseDown = false;

var rad = 0;

var radIncrement = 1;



window.addEventListener('DOMContentLoaded', (event) => {
  init();
  animate();
});



function init() {
  container = document.querySelector(".flamingo-canvas");
  

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.z = 250;

  // scene

  scene = new THREE.Scene();

  var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  var pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  // manager

  function loadModel() {
    flamingo.traverse(function (child) {
      if (child.isMesh) child.material.map = texture;
    });

    flamingo.rotation.z = 180;
    flamingo.rotation.x = 105.5;
    flamingo.position.y = -40
    flamingo.position.x = 70
    flamingo.getWorldDirection();
    flamingo.matrix.scale(0.2);
    console.log(flamingo);
    scene.add(flamingo);
  }

  var manager = new THREE.LoadingManager(loadModel);

  manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
  };

  // texture

  var textureLoader = new THREE.TextureLoader(manager);

  var texture = textureLoader.load(flamingoTexture);

  // model

  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
    }
  }

  function onError() {}

  var loader = new OBJLoader(manager);

  loader.load(
    flamingoOBJ,
    function (obj) {
      flamingo = obj;
    },
    onProgress,
    onError
  );

  //

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  //
  window.addEventListener("mousedown", onMouseDown, false);
  window.addEventListener("mouseup", onMouseUp, false);
  window.addEventListener("mousemove", onMouseMove, false);

  window.addEventListener("resize", onWindowResize, false);
}

function onMouseUp() {
  mouseDown = false;
}

function onMouseDown() {
  mouseDown = true;
}

//you need to store this to know how far the mouse has moved
var lastMPos = {};

//this function is called when the mouse is moved
function onMouseMove(event) {
  console.log("mouse down and moving", mouseDown);
  if (mouseDown) {
    //you can only calculate the distance if therer already was a mouse event
    if (typeof lastMPos.x != "undefined") {
      //calculate how far the mouse has moved
      var deltaX = lastMPos.x - event.clientX,
        deltaY = lastMPos.y - event.clientY;

      //rotate your object accordingly

      //declared once at the top of your code
      var axis = new THREE.Vector3(0, 0, 10).normalize(); //tilted a bit on x and y - feel free to plug your different axis here
      //in your update/draw function
      console.log(rad);
      rad += radIncrement;
      flamingo.rotateOnAxis(axis, 0.1);

      //flamingo.rotation.y += deltaX  *.005;
    }

    //save current mouse Position for next time
    lastMPos = {
      x: event.clientX,
      y: event.clientY,
    };
  }
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

