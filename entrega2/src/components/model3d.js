import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { coef, contour, rad, coef2, coef3 } from "../data";
import { isEmpty } from "lodash";
import { Tween } from "tween.js";
import TWEEN from "tween.js";
//Subir este
const Model3D = () => {
  const mountRef = useRef(null);
  const [showSpheres, setShowSpheres] = useState(false);
  const [showHojas, setShowHojas] = useState(false);
  const [coefFix1, setCoefFix1] = useState();
  const [posTemp, setPosTemp] = useState();
  const [coefFix2, setCoefFix2] = useState();
  const [coefFix3, setCoefFix3] = useState();
  const [contourFix, setContourFix] = useState();

  const [refSpheres, setRefSpheres] = useState([]);
  const [refHojas, setRefHojas] = useState([]);

  const [laVelociti, setLaVelociti] = useState(1000);

  useEffect(() => {
    const newCoef1 = [];
    for (let i = 0; i < coef.length; i += 3) {
      // extraemos un grupo de 3 elementos del arreglo original
      const grupo = coef.slice(i, i + 3);
      // agregamos el grupo al arreglo de grupos
      newCoef1.push(grupo);
    }
    setCoefFix1(newCoef1);
    const newCoef2 = [];
    for (let i = 0; i < coef2.length; i += 3) {
      // extraemos un grupo de 3 elementos del arreglo original
      const grupo = coef2.slice(i, i + 3);
      // agregamos el grupo al arreglo de grupos
      newCoef2.push(grupo);
    }
    setCoefFix2(newCoef2);
    const newCoef3 = [];
    for (let i = 0; i < coef3.length; i += 3) {
      // extraemos un grupo de 3 elementos del arreglo original
      const grupo = coef3.slice(i, i + 3);
      // agregamos el grupo al arreglo de grupos
      newCoef3.push(grupo);
    }
    setCoefFix3(newCoef3);

    const hojas = [];

    for (let i = 0; i < contour.length; i += 1026) {
      // extraemos un grupo de 3 elementos del arreglo original
      const grupo = contour.slice(i, i + 1026);
      // agregamos el grupo al arreglo de grupos
      hojas.push(grupo);
    }
    setContourFix(hojas);
  }, []);

  const pintarHojas = (scene) => {
    const refHojasTemp = [];
    for (let i = 0; i < contourFix.length; i++) {
      const contour = contourFix[i];
      const hoja = [];
      const shape = new THREE.Shape();

      for (let x = 0; x < contour.length; x += 2) {
        // extraemos un grupo de 3 elementos del arreglo original
        const grupo = contour.slice(x, x + 2);
        // agregamos el grupo al arreglo de grupos
        hoja.push(grupo);
      }

      for (let y = 0; y < hoja.length; y++) {
        const hja = hoja[y];
        if (y === 0) {
          shape.moveTo(hja[0], hja[1]);
        } else {
          shape.lineTo(hja[0], hja[1]);
        }
      }
      const extrudeSettings = {
        depth: 0.1, // Grosor de la hoja
        bevelEnabled: false,
      };
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      // Creamos el material de la hoja
      const material = new THREE.MeshPhongMaterial({
        color: 0x560ff10, // Color de la hoja
        side: THREE.DoubleSide, // Renderizamos ambas caras de la hoja
      });

      const position = coefFix1[i];

      // Creamos la malla (mesh) de la hoja y la agregamos a la escena
      const leafMesh = new THREE.Mesh(geometry, material);
      if (!isEmpty(position)) {
        refHojasTemp.push(leafMesh);
        leafMesh.position.set(position[0], position[1], position[2]);
      }
      setRefHojas(refHojasTemp);
      scene.add(leafMesh);
    }
  };

  const pintarEsferas = (scene) => {
    const lenght = rad.length;

    const refSpheresTemp = [];
    for (let i = 0; i < lenght; i++) {
      const radTemp = rad[i];
      const position = coefFix1[i];

      var sphereGeometry = new THREE.SphereGeometry(radTemp * 0.2, 30, 30);
      var sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x4499ff,
        wireframe: true,
      });
      var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      if (!isEmpty(position)) {
        refSpheresTemp.push(sphere);
        sphere.position.set(position[0], position[1], position[2]);
      }
      scene.add(sphere);
    }
    setRefSpheres(refSpheresTemp);
  };

  const mover1 = (pos) => {
    mover(pos, refSpheres);
    mover(pos, refHojas);
  };

  const mover = (pos, tipo) => {
    if (!isEmpty(tipo) && pos !== posTemp) {
      let coefTemp = [];

      if (pos === 1) {
        coefTemp = coefFix1;
      } else if (pos === 2) {
        coefTemp = coefFix2;
      } else {
        coefTemp = coefFix3;
      }

      tipo.forEach((sphereRef, index) => {
        const sphereFinalPosition = { ...coefTemp[index] };

        const targetPosition = new THREE.Vector3(
          sphereFinalPosition[0],
          sphereFinalPosition[1],
          sphereFinalPosition[2]
        );

        const tween = new Tween(sphereRef.position)
          .to(targetPosition, laVelociti)
          .onUpdate(() => {
            sphereRef.position.x = sphereRef.position.x;
            sphereRef.position.y = sphereRef.position.y;
            sphereRef.position.z = sphereRef.position.z;
          });
        tween.start();
        animate();
      });
      setPosTemp(pos);
    }
  };

  const animate = () => {
    requestAnimationFrame(animate);
    TWEEN.update();
  };

  useEffect(() => {
    if (!isEmpty(coefFix1)) {
      const currentRef = mountRef.current;
      const { clientWidth: width, clientHeight: height } = currentRef;

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        25,
        width / height,
        0.01,
        10000
      );

      scene.add(camera);
      camera.position.z = 20;
      camera.position.x = 10;
      camera.position.y = 40;

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      currentRef.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      if (showHojas) {
        pintarHojas(scene);
      }

      if (showSpheres) {
        pintarEsferas(scene);
      }

      const ambientalLight = new THREE.AmbientLight(0x1c582b, 3);
      scene.add(ambientalLight);

      const light = new THREE.PointLight(0xa4a4a4, 4);
      light.position.set(8, 8, 8);
      scene.add(light);

      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();

      return () => {
        currentRef.removeChild(renderer.domElement);
      };
    }
  }, [coefFix1, showHojas, showSpheres]);

  return (
    <>
      <button onClick={() => mover1(1)}>posición 1</button>
      <button onClick={() => mover1(2)}>posición 2</button>
      <button onClick={() => mover1(3)}>posición 3</button>
      <input
        value={laVelociti}
        onChange={(e) => setLaVelociti(e.target.value)}
      />
      <button
        onClick={() => {
          if (showHojas) {
            setRefHojas([]);
          }
          setShowHojas(!showHojas);
        }}>
        {showHojas ? "Desactivar hojas" : "activar hojas"}{" "}
      </button>
      <button
        onClick={() => {
          if (showSpheres) {
            setRefSpheres([]);
          }
          setShowSpheres(!showSpheres);
        }}>
        {showSpheres ? "Desactivar esferas" : "activar esferas"}{" "}
      </button>
      <div ref={mountRef} style={{ width: "100%", height: "100vh" }}></div>
    </>
  );
};

export default Model3D;
