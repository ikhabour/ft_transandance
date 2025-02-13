import * as THREE from 'three';
import { EffectComposer, OrbitControls, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { emissive, metalness, roughness } from 'three/tsl';

class BuildTerrain{
    constructor(Scene)
    {

      // Plane

      this.planegeo = new THREE.PlaneGeometry(200, 150, 250);
      this.planematerial = new THREE.MeshStandardMaterial({
        color: 0x5b5b5b,
        roughness: 3,
        metalness: 0.3,
        side: THREE.DoubleSide  
      });
      this.plane = new THREE.Mesh(this.planegeo, this.planematerial);
      this.plane.rotateX(-(Math.PI / 2));
      this.plane.position.set(0, -2, 0);
      this.plane.receiveShadow = true;
      // this.plane.castShadow = true;

      // Walls

      this.wallgeo = new THREE.BoxGeometry(125, 4, 4, 32, 32, 32);
      this.wallmaterial = new THREE.MeshStandardMaterial({
        color: 0x8f8d8d,
        roughness: 0.3,
        metalness: 0.1
      });
      this.wallmesh = new THREE.Mesh(this.wallgeo, this.wallmaterial);
      this.wallmesh1 = new THREE.Mesh(this.wallgeo, this.wallmaterial);
      this.backwall = new THREE.Mesh(this.wallgeo, this.wallmaterial);
      this.backwall1 = new THREE.Mesh(this.wallgeo, this.wallmaterial);


      this.wallmesh.position.set(0, 0, -40);
      this.wallmesh1.position.set(0, 0, 40);

      // Back walls

      this.backwall.position.set(-54.5, 0, 0);
      this.backwall1.position.set(54.5, 0, 0);
      this.backwall.rotateY(Math.PI / 2);
      this.backwall1.rotateY(Math.PI / 2);



      // Paddles

      this.paddlegeo = new THREE.BoxGeometry(15, 2.5, 2.5, 32, 32, 32);
      this.paddlematerial = new THREE.MeshStandardMaterial({
        color: 0x7145e2,
        roughness: 0.3
      });

      this.paddlemesh = new THREE.Mesh(this.paddlegeo, this.paddlematerial);
      this.paddlemesh1 = new THREE.Mesh(this.paddlegeo, this.paddlematerial);

      this.paddlemesh.rotateY(Math.PI / 2);
      this.paddlemesh1.rotateY(Math.PI / 2);

      this.paddlemesh.position.set(-50, 1.3, 0);
      this.paddlemesh1.position.set(50, 1.3, 0);


      this.paddlemesh.castShadow = true;
      this.paddlemesh1.castShadow = true;

      this.paddlemesh.receiveShadow = true;
      this.paddlemesh1.receiveShadow = true;

      // Ball

      this.ballgeo = new THREE.SphereGeometry(1.45, 64, 64);
      this.ballmaterial = new THREE.MeshStandardMaterial({
        color: 0x229EED,
        emissive: 0x229EED,
        emissiveIntensity: 3,
        roughness: 0.2,
        metalness: 0.1
      });

      // this.ball_light = new THREE.PointLight(0x229EED, 1, 5);
      this.ballmesh = new THREE.Mesh(this.ballgeo, this.ballmaterial);

      this.ballmesh.position.set(0, 1.3, 0);
      // this.ball_light.position.set(0, 0.13, 0);

      // this.ballwithlight = new THREE.Group();

      // this.ballwithlight.add(this.ballmesh);
      // this.ballwithlight.add(this.ball_light);

      // Decorations

      this.mlinegeo = new THREE.BoxGeometry(79, 0.5, 0.5);
      this.mlinematerial = new THREE.MeshStandardMaterial({
        color: 0xff0085,
        emissive: 0xff0085,
        emissiveIntensity: 1,
        roughness: 0.5
      });

      this.mlinemesh = new THREE.Mesh(this.mlinegeo, this.mlinematerial);
      this.mlinemesh.position.set(0, -2, 0);
      this.mlinemesh.rotateY(Math.PI / 2);



      // Adding Objects to the Scene

      Scene.add(this.plane);
      Scene.add(this.wallmesh);
      Scene.add(this.wallmesh1);
      Scene.add(this.paddlemesh);
      Scene.add(this.paddlemesh1);
      Scene.add(this.ballmesh);
      Scene.add(this.mlinemesh);
      Scene.add(this.backwall);
      Scene.add(this.backwall1);

      this.backwall.visible = false;
      this.backwall1.visible = false;


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

const speed = 0.75;

function Playermovements(Terrain)
{
  if (keyState['ArrowUp'] && Terrain.paddlemesh1.position.z - 10 > Terrain.wallmesh.position.z) {
    Terrain.paddlemesh1.position.z -= speed;
  }
  if (keyState['ArrowDown'] && Terrain.paddlemesh1.position.z + 10 < Terrain.wallmesh1.position.z) {
    Terrain.paddlemesh1.position.z += speed;
  }
  if (keyState['KeyW'] && Terrain.paddlemesh.position.z - 10 > Terrain.wallmesh.position.z){
    Terrain.paddlemesh.position.z -= speed;
  }
  if (keyState['KeyS'] && Terrain.paddlemesh.position.z + 10 < Terrain.wallmesh1.position.z) {
    Terrain.paddlemesh.position.z += speed;
  }
}

let ingame = true;


// Add velocity to the ball
let ballVelocity = new THREE.Vector3(0.7, 0, 0.7); // x, y, z speed

function checkCollision(ball, paddle, ballRadius, paddleHeight, paddleWidth)
{
  const ballLeft = ball.position.x - ballRadius;
  const ballRight = ball.position.x + ballRadius;
  const ballTop = ball.position.z + ballRadius;
  const ballBottom = ball.position.z - ballRadius
  
  
  const paddleLeft = paddle.position.x - paddleWidth / 2;
  const paddleRight = paddle.position.x + paddleWidth / 2;
  const paddleTop = paddle.position.z + paddleHeight / 2;
  const paddleBottom = paddle.position.z - paddleHeight / 2;

  return (
    ballRight > paddleLeft &&
    ballLeft < paddleRight &&
    ballTop > paddleBottom &&
    ballBottom < paddleTop
  );
}

function reflectBall(ball, paddle, paddleHeight)
{
  console.log("Ball position (Z):", ball.position.z);
  console.log("Paddle position (Z):", paddle.position.z);
  console.log("Paddle height:", paddleHeight);

  // Calculate the relative intersection point on the paddle (-0.5 to 0.5)
  let intersectZ = (ball.position.z - paddle.position.z) / (paddleHeight / 2);
  intersectZ = Math.max(-0.5, Math.min(0.5, intersectZ));
  console.log("Intersection point (Z):", intersectZ);


    // Set the new direction based on the intersection point
    const maxAngle = Math.PI / 5; // Maximum reflection angle (60 degrees)
    const angle = intersectZ * maxAngle;

    // Update ball velocity
    ballVelocity.x = -ballVelocity.x; // Reverse X direction
    ballVelocity.z = Math.sin(angle); // Set Z direction based on angle 
}

function resetBall(ball, Terrain)
{
    let random = Math.random();
    let randomAngleX = (Math.random() * 0.4) + 0.3;
    let randomAngleZ = (Math.random() * 0.4) + 0.3;
      ball.position.set(0, 1.3, 0);
      if (random < 0.25)
      {
        ballVelocity.x = randomAngleX;
        ballVelocity.z = randomAngleZ;
      }
      else if (random > 0.25 && random < 0.5)
      {
        ballVelocity.x = randomAngleX * -1;
        ballVelocity.z = randomAngleZ * -1;
      }
      else if (random > 0.5 && random < 0.75)
      {
        ballVelocity.x = randomAngleX * -1;
        ballVelocity.z = randomAngleZ;
      }
      else
      {
        ballVelocity.x = randomAngleX;
        ballVelocity.z = randomAngleZ * -1;
      }
}




function updateBall(ball, paddles, Terrain) {

  ball.position.add(ballVelocity);

  paddles.forEach(paddle => {
      if (checkCollision(ball, paddle, 1.45, 2.5, 15, Terrain))
          reflectBall(ball, paddle, 2.5);
    });
      if (ball.position.z >= 35 || ball.position.z <= -35) {
        ballVelocity.z = -ballVelocity.z; // Reverse Z direction
    }

      if (ball.position.x >= 51.5 || ball.position.x <= -51.5)
          resetBall(ball, Terrain);
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

camera.position.set(-45.5, 77.5, 102.1);
camera.lookAt(0, 0, 0);
scene.add(camera);

const light1 = new THREE.AmbientLight(0xffffff, 1.5);

const light = new THREE.DirectionalLight(0xffffff, 1.5);
const lightHelper = new THREE.DirectionalLightHelper(light, 2, 0xfffffff);
scene.add(lightHelper);

light.position.set(0, 5, 0);
// light.rotateZ(-5);
light.castShadow = true;



const Terrain = new BuildTerrain(scene);


// Composer Effects

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);

composer.addPass(renderPass);

const BloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth / window.innerHeight),  1, 0.5, 0.84);

composer.addPass(BloomPass);


scene.add(light);
scene.add(light1);


function animate()
{
  if (!ingame) return;
  requestAnimationFrame(animate);

  // renderer.render(scene, camera);
  composer.render();

  // Paddle Movements

  Playermovements(Terrain);

  updateBall(Terrain.ballmesh, [Terrain.paddlemesh1, Terrain.paddlemesh], Terrain);
  // console.log(Terrain.ballmesh.position.x);

}


animate();