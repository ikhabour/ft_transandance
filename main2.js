import * as THREE from 'three';
import { EffectComposer, FontLoader, GLTFLoader, OrbitControls, RenderPass, TextGeometry, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { emissive, metalness, roughness } from 'three/tsl';

class BuildTerrain{
    constructor(Scene)
    {

      // Plane

      this.planegeo = new THREE.PlaneGeometry(20, 15, 32, 32);
      this.planematerial = new THREE.MeshStandardMaterial({
        color: 0x5b5b5b,
        roughness: 3,
        metalness: 0.3,
        side: THREE.DoubleSide  
      });
      this.plane = new THREE.Mesh(this.planegeo, this.planematerial);
      this.plane.rotateX(-(Math.PI / 2));
      this.plane.position.set(0, -0.2, 0);
      this.plane.receiveShadow = true;
      // this.plane.castShadow = true;

      // Walls

      this.wallgeo = new THREE.BoxGeometry(14, 0.4, 0.4, 32, 32, 32);
      this.wallmaterial = new THREE.MeshStandardMaterial({
        color: 0x8f8d8d,
        roughness: 0.3,
        metalness: 0.1
      });
      this.wallmesh = new THREE.Mesh(this.wallgeo, this.wallmaterial);
      this.wallmesh1 = new THREE.Mesh(this.wallgeo, this.wallmaterial);


      this.wallmesh.position.set(0, 0, -4);
      this.wallmesh1.position.set(0, 0, 4);



      // Paddles

      this.paddlegeo = new THREE.CapsuleGeometry(0.12, 1.25, 32, 32);
      this.paddlematerial = new THREE.MeshStandardMaterial({
        color: 0x00cf2b,
        emissive: 0x00cf2b,
        emissiveIntensity: 0.9,
        roughness: 0.3
      });

      this.paddlemesh = new THREE.Mesh(this.paddlegeo, this.paddlematerial);
      this.paddlemesh1 = new THREE.Mesh(this.paddlegeo, this.paddlematerial);

      this.paddlemesh.rotateX(Math.PI / 2);
      this.paddlemesh1.rotateX(Math.PI / 2);

      this.paddlemesh.position.set(-6.35, 0.13, 0);
      this.paddlemesh1.position.set(6.35, 0.13, 0);


      this.paddlemesh.castShadow = true;
      this.paddlemesh1.castShadow = true;

      this.paddlemesh.receiveShadow = true;
      this.paddlemesh1.receiveShadow = true;

      // Ball

      this.ballgeo = new THREE.SphereGeometry(0.075, 64, 64);
      this.ballmaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        emissive: 0xFFFFFF,
        emissiveIntensity: 3,
        roughness: 0.2,
        metalness: 0.1
      });

      // this.ball_light = new THREE.PointLight(0x229EED, 1, 5);
      this.ballmesh = new THREE.Mesh(this.ballgeo, this.ballmaterial);

      this.ballmesh.position.set(0, 0.13, 0);

      // Decorations

      this.mlinegeo = new THREE.BoxGeometry(7.9, 0.05, 0.05);
      this.mlinematerial = new THREE.MeshStandardMaterial({
        color: 0x00cf2b,
        emissive: 0x00cf2b,
        emissiveIntensity: 0.8  ,
        roughness: 0.5
      });

      this.mlinemesh = new THREE.Mesh(this.mlinegeo, this.mlinematerial);
      this.mlinemesh.position.set(0, -0.2, 0);
      this.mlinemesh.rotateY(Math.PI / 2);


      // Adding Objects to the Scene

      Scene.add(this.plane);
      Scene.add(this.wallmesh);
      Scene.add(this.wallmesh1);
      Scene.add(this.paddlemesh);
      Scene.add(this.paddlemesh1);
      Scene.add(this.ballmesh);
      Scene.add(this.mlinemesh);


      // Setting the scene background

       this.cubeloader = new THREE.CubeTextureLoader();

       this.background = this.cubeloader.load([
          'map/0/px.png',
          'map/0/nx.png',
          'map/0/py.png',
          'map/0/ny.png',
          'map/0/pz.png',
          'map/0/nz.png',
       ])

       Scene.background = this.background;  

    }
}

const keyState = {};

window.addEventListener('keydown', (event) => {
  keyState[event.code] = true;
});

window.addEventListener('keyup', (event) => {
  keyState[event.code] = false;
});

const speed = 0.09;

function Playermovements(Terrain)
{
  if (keyState['ArrowUp'] && Terrain.paddlemesh1.position.z - 1 > Terrain.wallmesh.position.z) {
    Terrain.paddlemesh1.position.z -= speed;
  }
  if (keyState['ArrowDown'] && Terrain.paddlemesh1.position.z + 1 < Terrain.wallmesh1.position.z) {
    Terrain.paddlemesh1.position.z += speed;
  }
  if (keyState['KeyW'] && Terrain.paddlemesh.position.z - 1  > Terrain.wallmesh.position.z){
    Terrain.paddlemesh.position.z -= speed; 
  }
  if (keyState['KeyS'] && Terrain.paddlemesh.position.z + 1 < Terrain.wallmesh1.position.z) {
    Terrain.paddlemesh.position.z += speed;
  }
}

let p1Score = 0;
let p2Score = 0;
let p1ScoreMesh;
let p2ScoreMesh;

let textOptions;




function createScore(Scene)
{
  const fontLoader = new FontLoader();
  fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    // Create text geometry configuration
      textOptions = {
        font: font,
        size: 1.5,
        depth: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    };


  const textMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00ff00,
    metalness: 0.3,
    roughness: 0.4,
    // emissive: 0x00ff00,
    // emissiveIntensity: 0.5
  });

  const scoreGeometry = new TextGeometry('0', textOptions);

  p1ScoreMesh = new THREE.Mesh(scoreGeometry, textMaterial);
  p2ScoreMesh = new THREE.Mesh(scoreGeometry, textMaterial);

  p1ScoreMesh.position.set(4, 1, -5);
  p2ScoreMesh.position.set(-6, 1, -5);
  Scene.add(p1ScoreMesh);
  Scene.add(p2ScoreMesh);

  });
}

function updateScore(Scene, player)
{

  if (player === 1)
    p1Score++;
  else
    p2Score++;
  if (p1ScoreMesh && p2ScoreMesh)
  {
    Scene.remove(p1ScoreMesh);
    Scene.remove(p2ScoreMesh);


      const textMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00,
        // metalness: 0.3,
        // roughness: 0.4,
        // emissive: 0x00ff00,
        // emissiveIntensity: 0.5
      });

      const p1Geometry = new TextGeometry(p1Score.toString(), textOptions);
      const p2Geometry = new TextGeometry(p2Score.toString(), textOptions);

      p1ScoreMesh = new THREE.Mesh(p1Geometry, textMaterial);
      p2ScoreMesh = new THREE.Mesh(p2Geometry, textMaterial);

      p1ScoreMesh.position.set(4, 1, -5);
      p2ScoreMesh.position.set(-6, 1, -5);
      Scene.add(p1ScoreMesh);
      Scene.add(p2ScoreMesh);

    };
}


let ingame = true;
const ballSpeed = 0.07;
let ballVelocity = new THREE.Vector3(ballSpeed, 0, ballSpeed);

function updateBall(ball, paddles, Terrain, Scene) {
    // Update ball position
    ball.position.add(ballVelocity);

    // Wall collisions
    if (ball.position.z <= Terrain.wallmesh.position.z + 0.35 || 
        ball.position.z >= Terrain.wallmesh1.position.z - 0.35) {
        ballVelocity.z *= -1; // Reverse Z direction
    }

    // Check for scoring
    if (ball.position.x <= -6.65 || ball.position.x >= 6.65) {
      if (ball.position.x < 0)
        updateScore(Scene, 1);
      else
      updateScore(Scene, 2);
      // Reset ball position
      ball.position.set(0, 0.13, 0);
      ballVelocity = new THREE.Vector3(ballSpeed * (Math.random() > 0.5 ? 1 : -1), 0, ballSpeed * (Math.random() > 0.5 ? 1 : -1));
    }

    // Paddle collision detection
    paddles.forEach(paddle => {
        // Calculate the bounds of the paddle
        const paddleLeft = paddle.position.x - 0.125; // Half of paddle depth
        const paddleRight = paddle.position.x + 0.125;
        const paddleTop = paddle.position.z - 0.75; // Half of paddle height
        const paddleBottom = paddle.position.z + 0.75;

        // Check if ball is within paddle bounds
        if (ball.position.x >= paddleLeft && 
            ball.position.x <= paddleRight && 
            ball.position.z >= paddleTop && 
            ball.position.z <= paddleBottom) {
            
            // Calculate where on the paddle the ball hit
            const hitPosition = (ball.position.z - paddle.position.z) / 0.75; // Normalized hit position (-1 to 1)
            
            // Reverse X direction
            ballVelocity.x *= -1;
            
            // Apply different angles based on where the ball hits the paddle
            if (hitPosition < -0.33) {
                // Top third of paddle - bounce upward
                ballVelocity.z = -Math.abs(ballVelocity.z) * 1.5;
            } else if (hitPosition > 0.33) {
                // Bottom third of paddle - bounce downward
                ballVelocity.z = Math.abs(ballVelocity.z) * 1.5;
            } else {
                // Middle third of paddle - straight bounce
                ballVelocity.z *= 0.5; // Reduce vertical movement
            }

            // Ensure the ball doesn't get stuck in the paddle
            if (paddle.position.x < 0) {
                ball.position.x = paddleRight + 0.1;
            } else {
                ball.position.x = paddleLeft - 0.1;
            }
            
            // Slightly increase ball speed with each hit
            const currentSpeed = ballVelocity.length(); 
            ballVelocity.normalize().multiplyScalar(Math.min(currentSpeed * 1.2, 0.2));
        }
    });
}

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
    antialias: true, // Enables anti-aliasing
    powerPreference: "high-performance", // Optimizes rendering performance
  });
document.body.appendChild( renderer.domElement );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Matches screen resolution
renderer.shadowMap.enabled = true;
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
const controls = new OrbitControls(camera, renderer.domElement);

// camera.position.set(-4.55, 7.75, 10.21);
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);
scene.add(camera);

const light1 = new THREE.AmbientLight(0xffffff, 1);

const light = new THREE.DirectionalLight(0xffffff, 1);
const lightHelper = new THREE.DirectionalLightHelper(light, 2, 0xfffffff);
scene.add(lightHelper);

light.position.set(0, 5, 0);
light.castShadow = true;



const Terrain = new BuildTerrain(scene);
createScore(scene);


// Composer Effects

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);

composer.addPass(renderPass);

const BloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth / window.innerHeight),  1, 0.5, 0.84);

composer.addPass(BloomPass);


scene.add(light);
scene.add(light1);


function animate() {
  if (!ingame) return;
  requestAnimationFrame(animate);

  composer.render();
  // renderer.render(scene, camera);

  // Paddle Movements

  Playermovements(Terrain);

  // Ball Movements

  updateBall(Terrain.ballmesh, [Terrain.paddlemesh1, Terrain.paddlemesh], Terrain, scene);
  // console.log("Ball Z Position : ", Terrain.ballmesh.position.z);
}

animate();