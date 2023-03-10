import { useRef, useEffect } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

const Model = () => {
    const mountRef = useRef(null)

    useEffect(() => {
        //Creacion de la escena
        const currentRef = mountRef.current;
        const { clientWidth: width, clientHeight: height } = currentRef;
        const scene = new THREE.Scene();

        //camara y sus propiedades
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
        camera.position.z = 250;
        camera.position.x = -25;
        camera.position.y = -250;
        scene.add(camera);

        //renderizamos el escenario
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(width, height)
        currentRef.appendChild(renderer.domElement)

        // creamos la animacion de mover al tocar
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        //creamos el objeto
        var loader = new STLLoader();
        loader.load('/image/WHOMPER.stl', (geometry) => {
            console.log(geometry);
            var material = new THREE.MeshPhongMaterial({
                color: 0x4499ff,
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            mesh.position.y = -150
            mesh.position.x = -250
            mesh.position.Z = -3000
            //camera.lookAt(mesh);

        });

        //Luces
        //luz ambiental
        /* const ambientalLight = new THREE.AmbientLight(0x1C582B, );
        ambientalLight.position.z = -30;
        scene.add(ambientalLight); */

        //luz especifica
        const light = new THREE.PointLight(0x4499ff, 2);
        light.position.set(50, -50, -18);
        const lightbehind = new THREE.PointLight(0x4499ff, 2);
        lightbehind.position.set(50, 1000, -18);
        scene.add(light);
        scene.add(lightbehind);

        renderer.render(scene, camera);
        /*  const animate = () => {
 
             controls.update();
             renderer.render(scene, camera)
             requestAnimationFrame(animate)
         }
 
         animate(); */
        return () => {
            currentRef.removeChild(renderer.domElement);
        }

    }, [])
    return (
        <>
            <div ref={mountRef} style={{ width: '100%', height: '100vh' }}></div>
        </>
    )

}

export default Model;