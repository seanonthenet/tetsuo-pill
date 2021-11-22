import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const SceneComponent = () => {
  const [settings, setSettings] = useState({
    key_light: {
      name: "key_light",
      intensity: 0.8,
      color: 16777215,
      position: {
        x: -5,
        y: 5,
        z: 0,
      },
      active: true,
    },
    fill_light: {
      name: "fill_light",
      intensity: "0.1",
      color: 16777215,
      position: {
        x: "1",
        y: "1",
        z: 5,
      },
      active: true,
    },
    back_light: {
      name: "back_light",
      intensity: "0.1",
      color: 16777215,
      position: {
        x: "-5",
        y: "-2",
        z: "-5",
      },
      active: true,
    },
  });

  const [light_refs, setLightRefs] = useState({});

  useEffect(() => {
    let Scene = new THREE.Scene();

    Scene.background = new THREE.Color(0x000000);

    const widthFactor = (x) => (x / 10) * 8;

    const cameraZoom = 150;

    let Camera = new THREE.OrthographicCamera(
      widthFactor(window.innerWidth) / -cameraZoom,
      widthFactor(window.innerWidth) / cameraZoom,
      window.innerHeight / cameraZoom,
      window.innerHeight / -cameraZoom,
      0.1,
      1000
    );
    Camera.position.set(0, 0, 3);

    let Renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    Renderer.outputEncoding = THREE.sRGBEncoding;
    Renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("pill").appendChild(Renderer.domElement);

    //GLTF loader set up, for loading our object
    let loader = new GLTFLoader();
    let Pill; //A reference to the mesh in blender

    function Initialise() {
      loader.load("./pill.glb", function (GLTF) {
        Scene.add(GLTF.scene);
        Pill = GLTF.scene;
        Pill.position.set(-0.5, 0, -1);
        Pill.rotation.set(0, 0.8, 0);
      });

      const spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(0, 10, 0);
      spotLight.castShadow = true;
      Scene.add(spotLight);

      // LIGHT TARGET //
      const target = new THREE.Object3D();
      target.position.set(-0.5, 0, -1);
      Scene.add(target);

      // LIGHT SETUP //
      console.log("xxx");
      const lights = Object.values(settings).map((light) => {
        const light_object = new THREE.PointLight(light.color, light.intensity);
        light_object.position.set(
          light.position.x,
          light.position.y,
          light.position.z
        );

        return { [light.name]: light_object };
      });

      const light_objects = Object.assign({}, ...lights);
      setLightRefs(light_objects);
      Object.values(light_objects).forEach((light) => {
        Scene.add(light);
      });
    }

    function Update() {
      requestAnimationFrame(Update);
      Renderer.render(Scene, Camera);
      if (Pill) {
        // Pill.rotateY(0.012);
        Pill.rotateY(0.005);
      }
    }

    Initialise();
    Update();
  }, []);

  useEffect(() => {
    console.log(settings);
  }, [settings]);

  const updateLightPosition = (key, axis, value) => {
    let newSettings = { ...settings };
    newSettings[key].position[axis] = value;
    setSettings(newSettings);
    const position = light_refs[key].position;
    light_refs[key].position.set(position.x, position.y, position.z);
  };

  const toggleLight = (key) => {
    let newSettings = { ...settings };
    newSettings[key].active = !newSettings[key].active;
    setSettings(newSettings);
    light_refs[key].intensity = newSettings[key].active
      ? settings[key].intensity
      : 0;
  };

  const updateLightIntensity = (light, value) => {
    let newSettings = { ...settings };
    newSettings[light].intensity = value;
    setSettings(newSettings);
    light_refs[light].intensity = settings[light].active
      ? settings[light].intensity
      : 0;
  };

  return null;

  // <div style={{ width: "20%" }}>
  //   {Object.keys(settings).map((key) => {
  //     return (
  //       <div
  //         key={key}
  //         style={{ width: "180px", height: "220px", margin: "auto" }}
  //       >
  //         <h4>{key.toUpperCase()}</h4>
  //         <div
  //           style={{
  //             display: "flex",
  //             flexDirection: "column",
  //             justifyContent: "space-between",
  //           }}
  //         >
  //           <label htmlFor={`${key}-z`}>Intensity</label>
  //           <input
  //             type="number"
  //             id={`${key}-intensity`}
  //             value={settings[key].intensity}
  //             min="0"
  //             max="1"
  //             step="0.01"
  //             onChange={(e) => {
  //               let value = e.target.value;
  //               updateLightIntensity(key, value);
  //             }}
  //           />
  //           <label htmlFor={`${key}-x`}>X Position</label>
  //           <input
  //             type="number"
  //             id={`${key}-x`}
  //             value={settings[key].position.x}
  //             onChange={(e) => {
  //               let value = e.target.value;
  //               updateLightPosition(key, "x", value);
  //             }}
  //             min="-20"
  //             max="20"
  //             step="0.05"
  //           />
  //           <label htmlFor={`${key}-y`}>Y Position</label>
  //           <input
  //             type="number"
  //             id={`${key}-y`}
  //             value={settings[key].position.y}
  //             onChange={(e) => {
  //               let value = e.target.value;
  //               updateLightPosition(key, "y", value);
  //             }}
  //             min="-20"
  //             max="20"
  //             step="0.05"
  //           />
  //           <label htmlFor={`${key}-z`}>Z position</label>
  //           <input
  //             type="number"
  //             id={`${key}-z`}
  //             value={settings[key].position.z}
  //             onChange={(e) => {
  //               let value = e.target.value;
  //               updateLightPosition(key, "z", value);
  //             }}
  //             min="-20"
  //             max="20"
  //             step="0.05"
  //           />
  //           <label htmlFor={`${key}-toggle`}>{key} active?</label>
  //           <input
  //             type="checkbox"
  //             id={`${key}-toggle`}
  //             checked={settings[key].active}
  //             onChange={() => toggleLight(key)}
  //             min="-20"
  //             max="20"
  //             step="0.05"
  //           />
  //         </div>
  //       </div>
  //     );
  //   })}
  //   <button
  //     style={{ marginTop: "12px" }}
  //     onClick={() => console.log(settings)}
  //   >
  //     Log Settings
  //   </button>
  // </div>
};

export default SceneComponent;
