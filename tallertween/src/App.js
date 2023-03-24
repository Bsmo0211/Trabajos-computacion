import { useEffect } from 'react';

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import Model from './components/Model';

function App() {
  useEffect(() => {
    const test = new Model('myThreeJsCanvas');
    test.initialize();
    test.animate();

    // part 0 - add axis helper
    const axesHelper = new THREE.AxesHelper(1);
    test.scene.add(axesHelper);

    // part 0 - add box mesh which will be tweened
    const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    test.scene.add(boxMesh);

    // part 0 - add ground mesh for reference
    /*  const groundGeometry = new THREE.BoxGeometry(24, 1, 24);
     const groundMaterial = new THREE.MeshNormalMaterial();
     const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
     groundMesh.position.y = -4;
     test.scene.add(groundMesh); */

    // part 0 - ensure that tween.js is running
    const animate = (t) => {
      TWEEN.update(t);
      window.requestAnimationFrame(animate);
    };
    animate();


    // part 3 - chaining tweens together
    const tween1 = new TWEEN.Tween({ x: 0, y: 0, xRotation: 0 })
      .to({ x: 5, y: 8, xRotation: Math.PI / 2 }, 2000)
      .onUpdate((coords) => {
        boxMesh.position.x = coords.x;
        boxMesh.position.y = coords.y;
        boxMesh.rotation.x = coords.xRotation;
      })
      .easing(TWEEN.Easing.Exponential.InOut)
      .delay(100);
    const tween2 = new TWEEN.Tween({ x: 5, y: 8, xRotation: Math.PI / 2 })
      .to({ x: 0, y: 0, xRotation: 0 }, 2000)
      .onUpdate((coords) => {
        boxMesh.position.x = coords.x;
        boxMesh.position.y = coords.y;
        boxMesh.rotation.x = coords.xRotation;
      })
      .easing(TWEEN.Easing.Linear.None)
      .delay(100);
    tween1.chain(tween2);
    tween2.chain(tween1);
    tween1.start();
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;