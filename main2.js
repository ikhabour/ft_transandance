import * as THREE from 'three';
import { EffectComposer, OrbitControls, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { emissive, metalness, roughness } from 'three/tsl';


let scene, camera, renderer;
    let paddle1, paddle2, ball;
    let ballDirection = new THREE.Vector3(1, 0, 1).normalize();
    let ballSpeed = 0.1;
    let paddleSpeed = 0.2;
    let keys = {};

    init();
    animate();

    function init() {
        // Create scene
        scene = new THREE.Scene();

        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);

        // Create renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Create paddles
        const paddleGeometry = new THREE.BoxGeometry(1, 0.2, 3);
        const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

        paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
        paddle1.position.set(-5, 0, 0);
        // paddle1.rotateY(Math.PI / 2);
        scene.add(paddle1);

        paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial);
        paddle2.position.set(5, 0, 0);
        // paddle2.rotateY(Math.PI / 2);
        scene.add(paddle2);

        // Create ball
        const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.position.set(0, 0, 0);
        scene.add(ball);

        // Create walls
        const wallGeometry = new THREE.BoxGeometry(12, 0.2, 1);
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall1.position.set(0, 0, -5);
        scene.add(wall1);

        const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall2.position.set(0, 0, 5);
        scene.add(wall2);

        // Event listeners
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('keydown', onKeyDown, false);
        window.addEventListener('keyup', onKeyUp, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onKeyDown(event) {
        keys[event.code] = true;
    }

    function onKeyUp(event) {
        keys[event.code] = false;
    }

    function animate() {
        requestAnimationFrame(animate);

        // Move paddles
        if (keys['ArrowUp']) {
            paddle1.position.z -= paddleSpeed;
        }
        if (keys['ArrowDown']) {
            paddle1.position.z += paddleSpeed;
        }
        if (keys['KeyW']) {
            paddle2.position.z -= paddleSpeed;
        }
        if (keys['KeyS']) {
            paddle2.position.z += paddleSpeed;
        }

        // Move ball
        ball.position.add(ballDirection.clone().multiplyScalar(ballSpeed));

        // Collision detection with walls
        if (ball.position.z <= -4.8 || ball.position.z >= 4.8) {
            ballDirection.z *= -1;
        }

        // Collision detection with paddles
        if (ball.position.distanceTo(paddle1.position) < 1.5 && ball.position.x < -4.5) {
            ballDirection.x *= -1;
            let angle = (ball.position.z - paddle1.position.z) / 1.5;
            ballDirection.z = angle;
            ballDirection.normalize();
        }
        if (ball.position.distanceTo(paddle2.position) < 1.5 && ball.position.x > 4.5) {
            ballDirection.x *= -1;
            let angle = (ball.position.z - paddle2.position.z) / 1.5;
            ballDirection.z = angle;
            ballDirection.normalize();
        }

        // Render the scene
        renderer.render(scene, camera);
    }