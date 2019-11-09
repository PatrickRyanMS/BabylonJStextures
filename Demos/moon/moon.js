var createScene = function() {
    // camera for scene
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("cam", 1.75, Math.PI / 2.5, 4.448, BABYLON.Vector3.Zero());
    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    camera.wheelDeltaPercentage = 0.01;
    camera.attachControl(canvas, true);

    // variables for light and camera rotation
    var bRotateCam = true;
    var lightLastRotation = 0;

    // analytical light and rotation parent
    var lightParent = new BABYLON.AbstractMesh("lightParent", scene);
    lightParent.position = new BABYLON.Vector3(0, 0, 0);

    var dirLight1 = new BABYLON.DirectionalLight("dirLight1", new BABYLON.Vector3(0, 0, 0), scene);
    dirLight1.direction = new BABYLON.Vector3(-1, -1, -0.5);
    dirLight1.intensity = 1.5;
    dirLight1.diffuse = new BABYLON.Color3(0.8431372549019608, 0.8431372549019608, 0.8431372549019608);
    dirLight1.specular = new BABYLON.Color3(0.7568627450980392, 0.7568627450980392, 0.7568627450980392);
    dirLight1.parent = lightParent;
               
    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var button = BABYLON.GUI.Button.CreateSimpleButton("OpenColorDialog", "Rotating Camera");
    button.height = "60px";
    button.width = "200px";
    button.top = "-50px";
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    // button style
    var buttonDefaultColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    var buttonHoverColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    var buttonClickColor = new BABYLON.Color3(0.7, 0.7, 0.7);
    var buttonDisabledColor = new BABYLON.Color3(0.65, 0.65, 0.65);
    button.thickness = 0;
    button.fontsize = 16;
    button.color = "White";
    button.background = buttonDefaultColor.toHexString();

    // add button to GUI
    advancedTexture.addControl(button);   

    // set menu button to clickable
    var buttonEnabled = true;

    // button animation states
    button.pointerEnterAnimation = () => { 
        if (buttonEnabled) { button.background = buttonHoverColor.toHexString(); } 
    };
    button.pointerOutAnimation = (() => { 
        if (buttonEnabled) { button.background = buttonDefaultColor.toHexString(); } 
    });
    button.pointerDownAnimation = () => {
        if (buttonEnabled) {
            button.background = buttonClickColor.toHexString();
        }
    };
    button.pointerUpAnimation = () => {
        if (buttonEnabled) {
            button.background = buttonDisabledColor.toHexString();
            bRotateCam = !bRotateCam;
            if (bRotateCam) {
                button.textBlock.text = "Rotating Camera";
            }
            else {
                button.textBlock.text = "Rotating Light";
            }
        }
    };  

    // create new node material and compile it
    var nodeMaterial = new BABYLON.NodeMaterial("nodeMat", scene, { emitComments: true });
    nodeMaterial.loadAsync("assets/moon.json").then(() => {
        nodeMaterial.build(true);
        nodeMaterial.needDepthPrePass = true;
        nodeMaterial.backFaceCulling = false;

        function assignMat(submesh) {
            submesh.material = nodeMaterial;
        }

        // load the sphere glTF model and assign nodematerial to mesh
        Promise.all([
            BABYLON.SceneLoader.AppendAsync("assets/moon_pbrmr.glb")
        ]).then(function() {
            scene.meshes.forEach(assignMat);
        });

        // show inspector and select node material
        scene.debugLayer.show();
        scene.debugLayer.select(dirLight1);

        // display loading screen while loading assets
        engine.displayLoadingUI();  
        scene.executeWhenReady(function() {
            engine.hideLoadingUI();
        });

        // set rotation of camera and light every frame
        scene.registerBeforeRender(function () {
            var rotateLighting;
            if (bRotateCam) {
                cameraLastRotation = camera.alpha;
                cameraLockAlpha = camera.alpha;
                cameraLockBeta = camera.beta;
            }
            else {
                if (camera.alpha != cameraLastRotation) {
                    rotateLighting = (camera.alpha - cameraLastRotation); 
                    lightParent.rotate(new BABYLON.Vector3.Up(), lightLastRotation + rotateLighting);
                    lightLastRotation += rotateLighting;
                }
                cameraLastRotation = camera.alpha;
                camera.alpha = cameraLockAlpha;
                camera.beta = cameraLockBeta;
            }
        });
    });
    return scene;
};

