import * as THREE from 'three';
import { EffectComposer, FontLoader, GLTFLoader, OrbitControls, RenderPass, TextGeometry, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { div, emissive, log, metalness, roughness } from 'three/tsl';

class BuildTerrain{
    constructor(Scene)
    {

      // Walls

      this.wallgeo = new THREE.BoxGeometry(14, 0.4, 0.4, 32, 32, 32);
      this.wallmaterial = new THREE.MeshStandardMaterial({
        color: 0x8f8d8d,
        roughness: 0.3,
        metalness: 0.1
      });
      this.wallmesh = new THREE.Mesh(this.wallgeo, this.wallmaterial);
      this.wallmesh1 = new THREE.Mesh(this.wallgeo, this.wallmaterial);


      this.wallmesh.position.set(0, 0, -4.3);
      this.wallmesh1.position.set(0, 0, 4.3);

      this.wallmesh.visible = false;
      this.wallmesh1.visible = false;

      // Paddles

      this.paddlegeo = new THREE.CapsuleGeometry(0.13, 1.45, 32, 32);
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

      this.paddlemesh.position.set(-6.35, 0, 0);
      this.paddlemesh1.position.set(6.35, 0, 0);


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

      this.ballmesh = new THREE.Mesh(this.ballgeo, this.ballmaterial);

      this.ballmesh.position.set(0, 0, 0);

        // Loaders

        this.loader = new GLTFLoader();

        this.loader.load(
                'models/Game Play.gltf',
                 (gltf) => {
                    // Model loaded successfully

                    const model = gltf.scene;
                    
                    const ballmodel = model.getObjectByName('Ball');
                    const paddle1model = model.getObjectByName('Player');
                    const paddle2model = model.getObjectByName('PlayerTwo');
                    const arena = model.getObjectByName('ArenaModel');
                    
                    // Paddles Models

                    paddle1model.position.copy(this.paddlemesh.position);
                    paddle1model.rotateY(Math.PI / 2);
                    paddle1model.scale.set(0.35 , 0.35 , 0.35 );

                    paddle2model.position.copy(this.paddlemesh1.position);
                    paddle2model.rotateY(Math.PI / 2);
                    paddle2model.scale.set(0.35, 0.35, 0.35);

                    // Arena model

                    arena.rotateX(Math.PI / 2);
                    arena.position.set(0, -0.25, 0);
                    arena.scale.set(0.005, 0.005, 0.005);

                    // Ball Model
              
                    ballmodel.position.copy(this.ballmesh.position);
                    ballmodel.scale.set(0.0033, 0.0033, 0.0033);

                    // Replace the existing meshes

                    this.paddlemesh.parent.remove(this.paddlemesh);
                    this.paddlemesh = paddle1model;

                    this.paddlemesh1.parent.remove(this.paddlemesh1);
                    this.paddlemesh1 = paddle2model;

                    this.ballmesh.parent.remove(this.ballmesh);
                    this.ballmesh = ballmodel;

                    // Adding the new Meshes to the scene

                    Scene.add(this.ballmesh);
                    Scene.add(this.paddlemesh);
                    Scene.add(this.paddlemesh1);
                    Scene.add(arena);

                },
                function (xhr) {
                    // Loading progress
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    // Error occurred
                    console.error('An error occurred loading the model:', error);
                }
            );


      // Adding Objects to the Scene

      this.paddlemesh.visible = false;
      this.paddlemesh1.visible = false;
      this.ballmesh.visible = false;


      Scene.add(this.wallmesh);
      Scene.add(this.wallmesh1);
      Scene.add(this.paddlemesh);
      Scene.add(this.paddlemesh1);
      Scene.add(this.ballmesh);


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
        size: 1,
        depth: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    };


  const textMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x56EEFB,
    metalness: 0.3,
    roughness: 0.4,
    // emissive: 0x56EEFB,
    emissiveIntensity: 0
  });

  const scoreGeometry = new TextGeometry('0', textOptions);

  p1ScoreMesh = new THREE.Mesh(scoreGeometry, textMaterial);
  p2ScoreMesh = new THREE.Mesh(scoreGeometry, textMaterial);

  p1ScoreMesh.position.set(-1.5, 1.55, -3.8);
  p1ScoreMesh.rotateX(-1.1);
  p2ScoreMesh.position.set(0.75, 1.55, -3.8);
  p2ScoreMesh.rotateX(-1.1);
  Scene.add(p1ScoreMesh);
  Scene.add(p2ScoreMesh);

  });
}

function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function restartGame(Terrain)
{
  // Return the ball and the paddles to their starting positions
  // Ball : 0, 0, 0
  // P1 : -6.35, 0, 0
  // P2 : 6.35, 0, 0
  Terrain.ballmesh.position.set(0, 0, 0);
  Terrain.paddlemesh.position.set(-6.35, 0, 0);
  Terrain.paddlemesh1.position.set(6.35, 0, 0);

}

const updateScore = (Scene, player, Terrain)=>
{
    if (player === 1)
    p1Score++;
  else
    p2Score++;
  if (p1Score === 5 || p2Score === 5)
  {
      dispatchEvent(new CustomEvent('game-result', {detail : {winner : p1Score > p2Score ? "Player 1" : 'Player 2'}}))
      gamePaused = true;
      p1Score = 0;
      p2Score = 0;
  }
  if (p1ScoreMesh && p2ScoreMesh)
  {
    Scene.remove(p1ScoreMesh);
    Scene.remove(p2ScoreMesh);


      const textMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x56EEFB,
        metalness: 0.3,
        roughness: 0.4,
        // emissive: 0x56EEFB,
        emissiveIntensity: 0
      });

      const p1Geometry = new TextGeometry(p1Score.toString(), textOptions);
      const p2Geometry = new TextGeometry(p2Score.toString(), textOptions);

      p1ScoreMesh = new THREE.Mesh(p1Geometry, textMaterial);
      p2ScoreMesh = new THREE.Mesh(p2Geometry, textMaterial);

      p1ScoreMesh.position.set(-1.5, 1.55, -3.8);
      p1ScoreMesh.rotateX(-1.1);
      p2ScoreMesh.position.set(0.75, 1.55, -3.8);
      p2ScoreMesh.rotateX(-1.1);
      Scene.add(p1ScoreMesh);
      Scene.add(p2ScoreMesh);

    };
}


const ballSpeed = 0.07;
let ballVelocity = new THREE.Vector3(ballSpeed, 0, ballSpeed);

function updateBall(ball, paddles, Terrain, Scene) {
    // Update ball position
    ball.position.add(ballVelocity);

    // Wall collisions
    if (ball.position.z <= Terrain.wallmesh.position.z + 0.5 || 
        ball.position.z >= Terrain.wallmesh1.position.z - 0.5) {
        ballVelocity.z *= -1; // Reverse Z direction
    }

    // Check for scoring
    if (ball.position.x <= -7.5 || ball.position.x >= 7.5) {
      if (ball.position.x < 0)
        updateScore(Scene, 2, Terrain);
      else
      updateScore(Scene, 1, Terrain);
      // Reset ball position
      ball.position.set(0, 0.13, 0);
      ballVelocity = new THREE.Vector3(ballSpeed * (Math.random() > 0.5 ? 1 : -1), 0, ballSpeed * (Math.random() > 0.5 ? 1 : -1));
    }

    // Paddle collision detection
    paddles.forEach(paddle => {
        // Calculate the bounds of the paddle
        const paddleLeft = paddle.position.x - 0.150; // Half of paddle depth
        const paddleRight = paddle.position.x + 0.150;
        const paddleTop = paddle.position.z - 0.95; // Half of paddle height
        const paddleBottom = paddle.position.z + 0.95;

        // ball.rotation.x += ballVelocity.x;
        ball.rotation.y += ballVelocity.x;

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
renderer.domElement.setAttribute('tabindex', '0');
renderer.domElement.focus();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Matches screen resolution
renderer.shadowMap.enabled = true;
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
const controls = new OrbitControls(camera, renderer.domElement);

// camera.position.set(-4.55, 7.75, 10.21);
camera.position.set(0, 8.5, 6);
camera.lookAt(0, 0, 0);
scene.add(camera);

const light1 = new THREE.AmbientLight(0xffffff, 2);

const light = new THREE.DirectionalLight(0xffffff, 1);
const lightHelper = new THREE.DirectionalLightHelper(light, 2, 0xfffffff);
scene.add(lightHelper);

light.position.set(0, 5, 0);
light.castShadow = true;


const keyState = {};



let useComposer = false;

renderer.domElement.addEventListener('keydown', (event) => {
  if (event.code === 'Numpad0')
      singlePlayerMode();
  if (event.code === 'ShiftRight')
      useComposer = !useComposer;
  if (event.code === 'Enter')
  {
      gamestart = !gamestart;
      dispatchEvent(new CustomEvent('game-pause'))
      return ;
  }
  keyState[event.code] = true;
});

renderer.domElement.addEventListener('keyup', (event) => {
  keyState[event.code] = false;
});

const speed = 0.09;

function Playermovements(Terrain, event)
{
  if (!singlePlayer)
  {
    if (keyState['ArrowUp'] && Terrain.paddlemesh1.position.z - 1.25 > Terrain.wallmesh.position.z) {
      Terrain.paddlemesh1.position.z -= speed;
    }
    if (keyState['ArrowDown'] && Terrain.paddlemesh1.position.z + 1.25 < Terrain.wallmesh1.position.z) {
      Terrain.paddlemesh1.position.z += speed;
    }
  }
  // else
  // {
  //   if ((Terrain.ballmesh.position.z > 0 && Terrain.paddlemesh1.position.z <= Terrain.ballmesh.position.z) && Terrain.paddlemesh1.position.z + 1.25 < Terrain.wallmesh1.position.z)
  //   {
  //       Terrain.paddlemesh1.position.z += speed;
  //   }
  //   else if ((Terrain.ballmesh.position.z < 0 && Terrain.paddlemesh1.position.z >= Terrain.ballmesh.position.z) && Terrain.paddlemesh1.position.z - 1.25 > Terrain.wallmesh.position.z)
  //     Terrain.paddlemesh1.position.z -= speed;
  // }
  if (keyState['KeyW'] && Terrain.paddlemesh.position.z - 1.25  > Terrain.wallmesh.position.z){
    Terrain.paddlemesh.position.z -= speed; 
  }
  if (keyState['KeyS'] && Terrain.paddlemesh.position.z + 1.25 < Terrain.wallmesh1.position.z) {
    Terrain.paddlemesh.position.z += speed;
  }
}


function singlePlayerMode()
{
  singlePlayer = !singlePlayer;
}



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
let gamestart = true;
let gamePaused = false;
let singlePlayer = false;


const animate = async() =>{

  if (gamePaused)
  {
    await sleep(2)
    document.querySelector('#winner').remove()
    restartGame(Terrain);
    gamePaused = false;
  }
  requestAnimationFrame(animate);
  if (useComposer)
    composer.render();
  else
    renderer.render(scene, camera);

  if (gamestart)
  {
    Playermovements(Terrain);
    updateBall(Terrain.ballmesh, [Terrain.paddlemesh1, Terrain.paddlemesh], Terrain, scene);
  }
}


animate();



addEventListener("game-result", async (e) => {
  const { winner } = e.detail
  const view = document.createElement('div')
  view.id = 'winner'
  view.className = 'absolute w-full min-h-screen top-0 left-0 z-50 flex justify-center items-center text-white text-2xl bg-black/40'
  view.textContent = winner
  document.body.appendChild(view)
})


addEventListener("game-pause", async () => {
  if (gamestart)
  {
    document.getElementById("pause").remove()
    return
  }
  const view = document.createElement('div')
  view.id = 'pause'
  view.className = 'absolute w-full min-h-screen top-0 left-0 z-50 flex justify-center items-center text-white text-2xl bg-black/40'
  view.textContent = 'Paused'
  document.body.appendChild(view)
})
