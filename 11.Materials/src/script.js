import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {DoubleSide} from "three";
import GUI from 'lil-gui'
import {RGBELoader} from "three/addons";

/**
 * Debug UI
 */

const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('./textures/matcaps/1.png')
const gradientTexture = textureLoader.load('./textures/gradients/3.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Scenes
 */
// MESH BASIC
//const meshMaterial = new THREE.MeshBasicMaterial({map: doorColorTexture, opacity: 0.5, transparent: true, side: DoubleSide})

// MESH NORMAL
//const meshMaterial = new THREE.MeshNormalMaterial({opacity: 0.5, transparent: true, side: DoubleSide})

// MESH MATCAP
//const meshMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture, opacity: 0.5, transparent: true, side: DoubleSide})

// MESH DEPTH
//const meshMaterial = new THREE.MeshDepthMaterial({opacity: 0.5, transparent: true, side: DoubleSide})

// MESH LAMBERT
//const meshMaterial = new THREE.MeshLambertMaterial({opacity: 0.5, transparent: true, side: DoubleSide})

// MESH PHONG
//const meshMaterial = new THREE.MeshPhongMaterial({opacity: 0.75, transparent: true, side: DoubleSide, shininess: 100, specular: 0x1100FF})

// MESH MESH TOON
//const meshMaterial = new THREE.MeshToonMaterial({gradientmap: gradientTexture, transparent: true, side: DoubleSide})
//gradientTexture.magFilter = THREE.NearestFilter
//gradientTexture.minFilter = THREE.NearestFilter
//gradientTexture.generateMipmaps = false
//meshMaterial.gradientMap = gradientTexture

// MESH STANDARD
//const meshMaterial = new THREE.MeshStandardMaterial({
//    side: DoubleSide, metalness: 1, roughness: 1, map: doorColorTexture, aoMap: doorAmbientOcclusionTexture, aoMapIntensity: 1,
//    displacementMap: doorHeightTexture, displacementScale: 0.05, metalnessMap: doorHeightTexture, roughnessMap: doorRoughnessTexture,
//    normalMap: doorNormalTexture})
//gui.add(meshMaterial, 'metalness').min(0).max(1).step(0.0001)
//gui.add(meshMaterial, 'roughness').min(0).max(1).step(0.0001)

// MESH PHYSICAL
const meshMaterial = new THREE.MeshPhysicalMaterial({
    side: DoubleSide, metalness: 1, roughness: 1, map: doorColorTexture, aoMap: doorAmbientOcclusionTexture, aoMapIntensity: 1,
    displacementMap: doorHeightTexture, displacementScale: 0.05, metalnessMap: doorHeightTexture, roughnessMap: doorRoughnessTexture,
    normalMap: doorNormalTexture, clearcoat: 0, clearcoatRoughness: 0, iridescence: 0, iridescenceIOR: 1, iridescenceThicknessRange: [100, 800]})

gui.add(meshMaterial, 'metalness').min(0).max(1).step(0.0001)
gui.add(meshMaterial, 'roughness').min(0).max(1).step(0.0001)
gui.add(meshMaterial, 'clearcoat').min(0).max(1).step(0.0001)
gui.add(meshMaterial, 'clearcoatRoughness').min(0).max(1).step(0.0001)
gui.add(meshMaterial, 'iridescence').min(0).max(1).step(0.0001)
gui.add(meshMaterial, 'iridescenceIOR').min(1).max(2.333).step(0.0001)
gui.add(meshMaterial.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
gui.add(meshMaterial.iridescenceThicknessRange, '1').min(1).max(1000).step(1)



const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64)
const sphereMesh = new THREE.Mesh(sphereGeometry, meshMaterial)
sphereMesh.position.set(-1.5,0, 0)

const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100)
const planeMesh = new THREE.Mesh(planeGeometry, meshMaterial)

const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 64, 128)
const torusMesh = new THREE.Mesh(torusGeometry, meshMaterial)
torusMesh.position.set(1.5, 0, 0)

scene.add(sphereMesh, planeMesh, torusMesh)

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
const pointLight= new THREE.PointLight(0xFFFFFF, 30)
pointLight.position.set(2, 3, 4)
scene.add(ambientLight, pointLight)

/**
 * Environement Map
 */

const rgbeLoader = new RGBELoader()
rgbeLoader.load('textures/environmentMap/2k.hdr', (environementMap) => {
    environementMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environementMap
    scene.environment = environementMap
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update Object
    sphereMesh.rotation.y = 0.1 * elapsedTime
    planeMesh.rotation.y = 0.1 * elapsedTime
    torusMesh.rotation.y = 0.1 * elapsedTime

    sphereMesh.rotation.x = 0.15 * elapsedTime
    planeMesh.rotation.x = 0.15 * elapsedTime
    torusMesh.rotation.x = 0.15 * elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()