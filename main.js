import * as THREE from 'three';
import { EffectComposer, Lensflare, LensflareElement, OrbitControls, RenderPass } from 'three/examples/jsm/Addons.js';
import { emissive, metalness, roughness, shininess } from 'three/tsl';
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { CubeTextureLoader } from 'three/src/Three.Core.js';
// import { cameraPosition } from 'three/tsl';

class Paddle{
    constructor(color = 0xffffff, xpos = 0, Scene)
    {
        this.geometry = new THREE.BoxGeometry(0.33, 2, 0.35, 32, 32, 32);
        this.material = new THREE.MeshStandardMaterial({color, roughness: 0.3});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        Scene.add(this.mesh);
        this.mesh.position.set(xpos, 0.15, 0);
        this.mesh.rotateX(Math.PI / 2);
    }
}


class Wall{
    constructor(color = 0xffffff, zpos = 0, Scene)
    {
        this.geometry = new THREE.BoxGeometry(18, 0.35, 0.35, 32, 32, 32);
        this.material = new THREE.MeshStandardMaterial({color, roughness: 0.3, metalness: 0.1});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        Scene.add(this.mesh);
        this.mesh.position.set(0, 0, zpos);
        this.mesh.rotateX(Math.PI / 2);
    }
}


class ConstructTerrain{
    constructor()
    {
        this.wall = new Wall(0x8f8d8d, 5.5, scene);
        this.wall1 = new Wall(0x8f8d8d, -5.5, scene);
    }
}

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
        antialias: true, // Enables anti-aliasing
        powerPreference: "high-performance", // Optimizes rendering performance
      });
    renderer.setPixelRatio(window.devicePixelRatio); // Matches screen resolution
    renderer.shadowMap.enabled = true;
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
    const controls = new OrbitControls(camera, renderer.domElement);

    
    camera.position.set(-9, 6.7, 13);
    camera.lookAt(0, 0, 0);


    const plane = new THREE.PlaneGeometry(35, 35, 35, 35);
    const planematerial  = new THREE.MeshStandardMaterial({color : 0x5b5b5b, roughness: 3, metalness: 0.3});


    const planemesh = new THREE.Mesh(plane, planematerial);
    planemesh.position.y = -0.190;
    planemesh.rotateX(-(Math.PI / 2));
    scene.add(planemesh);
    


    const paddle1 = new Paddle(0x229EED, 7.75, scene);
    const paddle = new Paddle(0x00ff00, -7.75, scene);


    const wall = new Wall(0x8f8d8d, 5.5, scene);
    const wall1 = new Wall(0x8f8d8d, -5.5, scene);
    const mgeo = new THREE.BoxGeometry(10.65, 0.06, 0.06, 32, 32, 32);
    const mmat  = new THREE.MeshStandardMaterial({
        color: 0xf90082,
        emissive: 0xf90082,
        emissiveIntensity: 2.5,
        roughness: 0.5,
        // metalness: 0.1
    });
    const mmesh  = new THREE.Mesh(mgeo, mmat);
    mmesh.rotateY(Math.PI / 2);
    mmesh.position.set(0, -0.19, 0);
    scene.add(mmesh);

    // scene.add(ball);


    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement );
    const speed = 0.095;

    const keymap = {
        'w': false,
        's': false,
        'ArrowUp': false,
        'ArrowLeft': false,
        '8': false,
        '2': false,
        '4': false,
        '6': false,
    };

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    const lighthelper = new THREE.DirectionalLightHelper(light2, 5, 0xffffff);
    light2.position.set(0, 10, 0);
    scene.add(light2);
    scene.add(lighthelper);



    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);


    const ballgeometry = new THREE.SphereGeometry(0.195, 64, 64);
    const material1 = new THREE.MeshStandardMaterial( { color: 0x229EED, emissive: 0x229EED, emissiveIntensity: 3.5, roughness: 0.2, metalness: 0.1} );
    const ball = new THREE.Mesh(ballgeometry, material1);
    ball.castShadow = true;
    ball.receiveShadow = true;
    ball.position.set(0, 0, 0);

    const light = new THREE.PointLight(0x229EED, 0.5, 50, 2);
    light.position.set(0, 0, 0);
    light.castShadow = true;

    // const ballWithDecorations = new THREE.Group();
    // ballWithDecorations.add(ball);   
    // ballWithDecorations.add(pointsGroup);

    // ballWithDecorations.position.set(0, 0, 0);
    // scene.add(ballWithDecorations);
    
        const ballwithLight = new THREE.Group();
        ballwithLight.add(ball);
        ballwithLight.add(light);
        ballwithLight.position.set(0, 0.15, 0);
        scene.add(ballwithLight);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);

    composer.addPass(renderPass);

    const BloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth / window.innerHeight),  1, 0.5, 0.84);

    composer.addPass(BloomPass);

    const cubeloader = new THREE.CubeTextureLoader();

    const map = cubeloader.load([
        'map/0/px.png',
        'map/0/nx.png',
        'map/0/py.png',
        'map/0/ny.png',
        'map/0/pz.png',
        'map/0/nz.png'
    ])

    scene.background = map;




window.addEventListener('keydown', (event) =>
{
    if (event.key === 'w')
        keymap['w'] = true;
    if (event.key === 's')
        keymap['s'] = true;

    if (event.key === 'ArrowUp')
        keymap['ArrowUp'] = true;
    if (event.key === 'ArrowDown')
        keymap['ArrowDown'] = true;


    //Ball Movement

    if (event.key === '8')
        keymap['8'] = true;
    if (event.key === '2')
        keymap['2'] = true;
    if (event.key === '4')
        keymap['4'] = true;
    if (event.key === '6')
        keymap['6'] = true;

});

window.addEventListener('keyup', (event) =>
    {
        if (event.key === 'w')
            keymap['w'] = false;
        if (event.key === 's')
            keymap['s'] = false;

        if (event.key === 'ArrowUp')
            keymap['ArrowUp'] = false;
        if (event.key === 'ArrowDown')
            keymap['ArrowDown'] = false;

        // Ball movement

        if (event.key === '8')
            keymap['8'] = false;
        if (event.key === '2')
            keymap['2'] = false;
        if (event.key === '4')
            keymap['4'] = false;
        if (event.key === '6')
            keymap['6'] = false;

});

function moveball()
{
    if (keymap['8'])
        ballwithLight.position.z -= speed;
    if (keymap['2'])
        ballwithLight.position.z += speed;
    if (keymap['4'])
        ballwithLight.position.x -= speed;
    if (keymap['6'])
        ballwithLight.position.x += speed;
}


function movepaddles()
{
    if (keymap['w'] && (paddle.mesh.position.z - 1.25 > wall1.mesh.position.z))
        paddle.mesh.position.z -= speed
    if (keymap['s'] && (paddle.mesh.position.z + 1.25 < wall.mesh.position.z))
        paddle.mesh.position.z += speed;
    if (keymap['ArrowUp'] &&  (paddle1.mesh.position.z - 1.25 > wall1.mesh.position.z))
        paddle1.mesh.position.z -= speed;
    if (keymap['ArrowDown'] && (paddle1.mesh.position.z + 1.25 < wall.mesh.position.z))
        paddle1.mesh.position.z += speed;
}


function animate() {
    requestAnimationFrame(animate)
    // renderer.render( scene, camera );
    composer.render();
    movepaddles();
    moveball();
    
    // ballwithLight.position.x = Math.sin(Date.now() * 0.001) * 5;
}

animate();


