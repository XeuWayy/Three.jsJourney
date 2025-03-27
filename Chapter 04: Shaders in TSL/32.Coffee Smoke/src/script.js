import * as THREE from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Pane } from "tweakpane";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import {Fn, positionLocal, texture, uv, vec4, vec2, assign, time, smoothstep, oneMinus, rotate, uniform, pow} from "three/tsl";

/**
 * Base
 */
// Debug
const pane = new Pane({title: '☕️ Three.js Journey - Coffee Smoke ☕️'})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 8
camera.position.y = 10
camera.position.z = 12
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGPURenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor('#000')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Model
 */
gltfLoader.load(
    './bakedModel.glb',
    (gltf) =>
    {
        gltf.scene.getObjectByName('baked').material.map.anisotropy = 8
        scene.add(gltf.scene)
    }
)

// Coffee smoke

const geometry = new THREE.PlaneGeometry(1, 1, 64, 64)
geometry.translate(0, 0.5, 0)
geometry.scale(1.5, 6, 1.5)

// Perlin Noise
const perlinTex = textureLoader.load('./perlin.png')
perlinTex.wrapS = THREE.RepeatWrapping
perlinTex.wrapT = THREE.RepeatWrapping

// Material
const material = new THREE.MeshBasicNodeMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false
})

// Smoke Vertex


const smokeVertex = Fn(([perlinTex]) => {
    const position = positionLocal.toVar()

    const twistPerlin = texture(perlinTex, vec2(0.5, uv().y.mul(0.2).sub(time.mul(0.005)))).r
    const angle = twistPerlin.mulAssign(10)

    position.xz.assign(rotate(position.xz, angle))

    const windOffset = vec2(
        texture(perlinTex, vec2(0.25, time.mul(0.01))).r.sub(0.5),
        texture(perlinTex, vec2(0.75, time.mul(0.01))).r.sub(0.5))
    windOffset.mulAssign(pow(uv().y, 2).mul(10))

    position.xz.addAssign(windOffset)

    return position
})

material.positionNode = smokeVertex([perlinTex])

// Smoke Color
const smokeFragment = Fn(([perlinTex]) => {

    let modifiedUv = uv().toVar()

    modifiedUv.x.mulAssign(0.5)
    modifiedUv.y.mulAssign(0.3)
    modifiedUv.y.subAssign(time.mul(0.03))

    const perlin = texture(perlinTex, modifiedUv).r.toVar()

    perlin.assign(smoothstep(0.45, 1.0, perlin))

    perlin.mulAssign(smoothstep(0.0, 0.1, uv().x))
    perlin.mulAssign(smoothstep(1.0, 0.9, uv().x))

    perlin.mulAssign(smoothstep(0.0, 0.1, uv().y))
    perlin.mulAssign(smoothstep(1.0, 0.4, uv().y))

    return vec4(0.6, 0.3, 0.2, perlin)
})

material.colorNode = smokeFragment([perlinTex])

const mesh = new THREE.Mesh(geometry, material)
mesh.position.y = 1.83
scene.add(mesh)


/**
 * Tweakpane
 */

pane.addBinding(material, 'wireframe', { label: 'Smoke wireframe' })


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.renderAsync(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()