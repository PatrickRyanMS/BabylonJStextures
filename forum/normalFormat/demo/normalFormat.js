var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // Async loading list
    var promises = [];

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", BABYLON.Tools.ToRadians(-270), BABYLON.Tools.ToRadians(75), 110, new BABYLON.Vector3(0,1.5,0), scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    // Create node materials
    var swordNodeMat = new BABYLON.NodeMaterial("swordNodeMat", scene, { emitComments: false });
    var gemNodeMat = new BABYLON.NodeMaterial("gemNodeMat", scene, { emitComments: false });

    // Lights
    var dirLight1 = new BABYLON.DirectionalLight("dirLight1", new BABYLON.Vector3(0, 0, 0), scene);
    dirLight1.direction = new BABYLON.Vector3(0.5, -0.75, -0.4);
    dirLight1.intensity = 0.95;
    dirLight1.diffuse = new BABYLON.Color3(0.8431372549019608, 0.8431372549019608, 0.8431372549019608);
    dirLight1.specular = new BABYLON.Color3(0.7568627450980392, 0.7568627450980392, 0.7568627450980392);

    // Load assets 
    // promises.push(BABYLON.SceneLoader.AppendAsync("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/Demos/treeScene/treeScene.glb"));
    promises.push(BABYLON.SceneLoader.AppendAsync("assets/sword_noMat.glb"));
    promises.push(gemNodeMat.loadAsync("assets/gemNodeShader.json"));
    promises.push(swordNodeMat.loadAsync("assets/swordNodeShader.json"));

    // Callback when assets are loaded
    Promise.all(promises).then(function() {

        // Meshes
        swordMesh = scene.getMeshByName("sword_low");
        gemMesh = scene.getMeshByName("handleGem_low");
        
        //Build and assign node materials
        swordNodeMat.build(true);
        swordMesh.material = swordNodeMat;

        gemNodeMat.build(true);
        gemMesh.material = gemNodeMat;
    });

    scene.debugLayer.show();

    // lock camera beta angle
    scene.registerBeforeRender(function () {
    });

    return scene;
};