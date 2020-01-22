/// <reference path="..\\..\\Babylon_d_ts\\babylon.d.ts" />

var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () { 
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () { 
        engine.resize();
});    