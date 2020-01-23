var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // Async loading list
    var promises = [];

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", BABYLON.Tools.ToRadians(-270), BABYLON.Tools.ToRadians(90), 10, new BABYLON.Vector3(0,0,0), scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    // Create node materials
    var directXMat = new BABYLON.NodeMaterial("directXMat", scene, { emitComments: false });

    // Lights
    var dirLight1 = new BABYLON.DirectionalLight("dirLight1", new BABYLON.Vector3(0, 0, 0), scene);
    dirLight1.direction = new BABYLON.Vector3(0.5, -0.75, -0.4);
    dirLight1.intensity = 1.0;

    // Load assets 
    promises.push(BABYLON.SceneLoader.AppendAsync("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/forum/normalFormat/normalFormatTest.glb"));
    promises.push(BABYLON.SceneLoader.AppendAsync("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/forum/normalFormat/normalFormatTest.babylon"));
    promises.push(directXMat.loadAsync("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/forum/normalFormat/directXnodeMat.json"));

    // Callback when assets are loaded
    Promise.all(promises).then(function() {

        // Meshes
        var directXMesh = scene.getMeshByName("directX");
        var babylonDXMesh = scene.getMeshByName("directX1_babylon");

        //Build and assign node materials
        directXMat.build(true);
        directXMesh.material = directXMat;
        babylonDXMesh.material = directXMat;

        // display loading screen while loading assets
        engine.displayLoadingUI();  
        scene.executeWhenReady(function() {
            engine.hideLoadingUI();
        });
    });

    scene.debugLayer.show();

    return scene;
};

