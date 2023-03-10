import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { coef, contour, rad } from "./result";

const Model = () => {
    const mountRef = useRef(null);
    const [verEsferas, setVerEsferas] = useState(true);
    const [verHojas, setverHojas] = useState(false);



    useEffect(() => {
        const currentRef = mountRef.current;
        const { clientWidth: width, clientHeight: height } = currentRef;
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(25, width / height, 0.01, 10000);
        camera.position.z = 20;
        camera.position.x = 10;
        camera.position.y = 40;
        scene.add(camera);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        currentRef.appendChild(renderer.domElement);

        // creamos la animacion de mover al tocar
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        //Creamos las esferas
        if (verEsferas) {
            const lenght = rad.length;
            const newCoef = [];
            for (let i = 0; i < coef.length; i += 3) {
                // extraemos un grupo de 3 elementos del arreglo original
                const grupo = coef.slice(i, i + 3);
                // agregamos el grupo al arreglo de grupos
                newCoef.push(grupo);
            }
            //se hace un recorrido para asignar los datos a la variable radio y posicion 
            for (let i = 0; i < lenght; i++) {
                const radTemp = rad[i];
                const position = newCoef[i];

                var esfera = new THREE.SphereGeometry(radTemp, 30, 30);
                var material = new THREE.MeshBasicMaterial({
                    color: 0x4499ff,
                    wireframe: true,
                });
                var mallaEsfera = new THREE.Mesh(esfera, material);

                mallaEsfera.position.set(position[0], position[1], position[2]);
                scene.add(mallaEsfera);
            }
        }
        if (verHojas) {
            const newCoef = [];
            for (let i = 0; i < coef.length; i += 3) {
                // extraemos un grupo de 3 elementos del arreglo original
                const grupo = coef.slice(i, i + 3);
                // agregamos el grupo al arreglo de grupos
                newCoef.push(grupo);
            }
            const hojas = [];

            //hacemos la division del array por cant hojas (120)
            for (let i = 0; i < contour.length; i += 1026) {

                const grupo = contour.slice(i, i + 1026);

                hojas.push(grupo);
            }

            //recorrido de asignacion 
            for (let i = 0; i < hojas.length; i++) {
                const contour = hojas[i];
                const hoja = [];
                //pinta geometrias
                const shape = new THREE.Shape();
                // se divide para quedar con los 513 puntos
                for (let x = 0; x < contour.length; x += 2) {
                    const grupo = contour.slice(x, x + 2);
                    hoja.push(grupo);
                }

                //validacion hoja en diferente espacio
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
                };
                const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

                // Creamos el material de la hoja
                const material = new THREE.MeshPhongMaterial({
                    color: 0x560ff10, // Color de la hoja
                    side: THREE.DoubleSide, // Renderizamos ambas caras de la hoja
                });

                const position = newCoef[i];

                // Creamos la malla (mesh) de la hoja y la agregamos a la escena
                const mallaHoja = new THREE.Mesh(geometry, material);
                mallaHoja.position.set(position[0], position[1], position[2]);

                scene.add(mallaHoja);
            }
        }

        //Luz ambiental
        const ambientalLight = new THREE.AmbientLight(0x1c582b, 3);
        scene.add(ambientalLight);

        //luz arriba
        const lightUp = new THREE.PointLight(0xa4a4a4, 4);
        lightUp.position.set(50, -50, -18);
        scene.add(lightUp);

        //luz abajo
        const lightDown = new THREE.PointLight(0xa4a4a4, 4);
        lightDown.position.set(-100, -50, 0);
        scene.add(lightDown);

        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        }
        window.addEventListener('resize', onWindowResize);
        animate();

        return () => {
            currentRef.removeChild(renderer.domElement);
        };

    }, [verEsferas, verHojas]);

    return (
        <>

            <div ref={mountRef} style={{ width: "100%", height: "100vh" }}>
                <button style={{ backgroundColor: "burlywood", paddingLeft: 10, paddingRight: 10 }} onClick={() => setVerEsferas(!verEsferas)}>
                    {verEsferas ? "Desactivar esferas" : "Activar esferas"}{" "}
                </button>

                <button style={{ backgroundColor: "burlywood", paddingLeft: 10, paddingRight: 10 }} onClick={() => setverHojas(!verHojas)}>
                    {verHojas ? "Desactivar hojas" : "Activar hojas"}{" "}
                </button>
            </div>
        </>
    );
};

export default Model;
