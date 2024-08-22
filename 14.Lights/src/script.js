import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
const debugObj = {}
const gui = new GUI()

const minimalCostFolder  = gui.addFolder('Minimal Cost').close();
const ambientLightGui = minimalCostFolder.addFolder('Ambient Light Settings').close()
const hemisphereLightGui = minimalCostFolder.addFolder('Hemisphere Light Settings').close()

const mediumCostFolder = gui.addFolder('Medium Cost').close();
const directionalLightGui = mediumCostFolder.addFolder('Directional Light Settings').close()
const pointLightGui = mediumCostFolder.addFolder('Point Light Settings').close()

const highCostFolder = gui.addFolder('High Cost').close();
const spotLightGui = highCostFolder.addFolder('SpotLight Settings').close()
const reactAreaLightGui = highCostFolder.addFolder('React Area Light Settings').close()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */

// AMBIENT LIGHT

debugObj.ambientLightColor = 0xffffff
const ambientLight = new THREE.AmbientLight(debugObj.ambientLightColor, 1.5)
ambientLightGui.add(ambientLight, 'visible').name('Light Enable')
ambientLightGui.addColor(debugObj, 'ambientLightColor').onChange(() => {
    ambientLight.color.set(debugObj.ambientLightColor)
}).name('Light Color')
ambientLightGui.add(ambientLight, 'intensity').min(0).max(5).step(0.001).name('Intensity')
scene.add(ambientLight)

// DIRECTIONAL LIGHT

debugObj.directionalLightColor = 0x00FFFC
const directionalLight = new  THREE.DirectionalLight(debugObj.directionalLightColor, 0.9, { visible: false})
directionalLight.visible = false
directionalLightGui.add(directionalLight, 'visible').name('Light Enable')
directionalLightGui.addColor(debugObj, 'directionalLightColor').onChange(() => {
    directionalLight.color.set(debugObj.directionalLightColor)
}).name('Light Color')
directionalLightGui.add(directionalLight, 'intensity').min(0).max(5).step(0.001).name('Intensity')
directionalLightGui.add(directionalLight.position, 'x').min(-15).max(15).step(0.25).name('Pos X')
directionalLightGui.add(directionalLight.position, 'y').min(-15).max(15).step(0.25).name('Pos Y')
directionalLightGui.add(directionalLight.position, 'z').min(-15).max(15).step(0.25).name('Pos Z')
scene.add(directionalLight)

// HEMISPHERE LIGHT

debugObj.hemisphereLightSkyColor = 0xFF0000
debugObj.hemisphereLightGroundColor = 0x00FF00
const hemisphereLight = new THREE.HemisphereLight(debugObj.hemisphereLightSkyColor, debugObj.hemisphereLightGroundColor, 0.9)
hemisphereLight.visible = false
hemisphereLightGui.add(hemisphereLight, 'visible').name('Light Enable')
hemisphereLightGui.addColor(debugObj, 'hemisphereLightSkyColor').onChange(() => {
    hemisphereLight.color.set(debugObj.hemisphereLightSkyColor)
}).name('Sky Color')
hemisphereLightGui.addColor(debugObj, 'hemisphereLightGroundColor').onChange(() => {
    hemisphereLight.color.set(debugObj.hemisphereLightGroundColor)
}).name('Ground Color')
hemisphereLightGui.add(hemisphereLight.position, 'x').min(-15).max(15).step(0.25).name('Pos X')
hemisphereLightGui.add(hemisphereLight.position, 'y').min(-15).max(15).step(0.25).name('Pos Y')
hemisphereLightGui.add(hemisphereLight.position, 'z').min(-15).max(15).step(0.25).name('Pos Z')
scene.add(hemisphereLight)
hemisphereLightGui.add(hemisphereLight, 'intensity').min(0).max(5).step(0.001).name('Intensity')

// POINT LIGHT

debugObj.pointLightColor = 0xFF9000;
const pointLight = new THREE.PointLight(debugObj.pointLightColor, 0.9)
pointLight.visible = false
pointLightGui.add(pointLight, 'visible').name('Light Enable')
pointLightGui.addColor(debugObj, 'pointLightColor').onChange(() => {
    pointLight.color.set(debugObj.pointLightColor)
}).name('Light Color')
pointLightGui.add(pointLight, 'intensity').min(0).max(5).step(0.001).name('Intensity')
pointLightGui.add(pointLight, 'distance').min(0).max(5).step(0.001).name('Distance')
pointLightGui.add(pointLight, 'decay').min(0).max(5).step(0.001).name('Decay')
pointLightGui.add(pointLight.position, 'x').min(-15).max(15).step(0.25).name('Pos X')
pointLightGui.add(pointLight.position, 'y').min(-15).max(15).step(0.25).name('Pos Y')
pointLightGui.add(pointLight.position, 'z').min(-15).max(15).step(0.25).name('Pos Z')
scene.add(pointLight)

// REACT AREA LIGHT

debugObj.rectAreaLightColor = 0x4E00FF
const rectAreaLight = new THREE.RectAreaLight(debugObj.rectAreaLightColor, 0.9);
rectAreaLight.visible = false
reactAreaLightGui.add(rectAreaLight, 'visible').name('Light Enable')
reactAreaLightGui.addColor(debugObj, 'rectAreaLightColor').onChange(() => {
    rectAreaLight.color.set(debugObj.rectAreaLightColor)
}).name('Light Color')
reactAreaLightGui.add(rectAreaLight, 'intensity').min(0).max(5).step(0.001).name('Intensity')
reactAreaLightGui.add(rectAreaLight, 'width').min(-15).max(15).step(0.001).name('Width')
reactAreaLightGui.add(rectAreaLight, 'height').min(-15).max(15).step(0.001).name('Height')
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight);

// SPOTLIGHT

debugObj.spotLightColor = 0x70FF00
const spotLight = new THREE.SpotLight(debugObj.spotLightColor,0.9, 8)
spotLight.visible = false
spotLightGui.add(spotLight, 'visible').name('Light Enable')
spotLightGui.addColor(debugObj, 'spotLightColor').onChange(() => {
    spotLight.color.set(debugObj.spotLightColor)
}).name('Light Color')
spotLightGui.add(spotLight, 'intensity').min(0).max(5).step(0.001).name('Intensity')
spotLightGui.add(spotLight, 'distance').min(-15).max(15).step(0.25).name('Distance')
spotLightGui.add(spotLight.position, 'x').min(-15).max(15).step(0.25).name('Pos X')
spotLightGui.add(spotLight.position, 'y').min(-15).max(15).step(0.25).name('Pos Y')
spotLightGui.add(spotLight.position, 'z').min(-15).max(15).step(0.25).name('Pos Z')
scene.add(spotLight)

/**
 * Helpers
 */

debugObj.hemisphereLightHelperColor = 0xFFFFFF
debugObj.hemisphereLightHelperSize = 0.1
let hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, debugObj.hemisphereLightHelperSize, debugObj.hemisphereLightHelperColor)
hemisphereLightHelper.visible = false
hemisphereLightGui.add(hemisphereLightHelper, 'visible').name('Helper Enable')
hemisphereLightGui.addColor(debugObj, 'hemisphereLightHelperColor').onChange(() => {
    scene.remove(hemisphereLightHelper)
    hemisphereLightHelper.dispose()
    hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, debugObj.hemisphereLightHelperSize, debugObj.hemisphereLightHelperColor)
    scene.add(hemisphereLightHelper)
}).name('Helper Color')
scene.add(hemisphereLightHelper)

debugObj.directionalLightHelperColor = 0xFFFFFF
debugObj.directionalLightHelperSize = 0.1
let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, debugObj.directionalLightHelperSize, debugObj.directionalLightHelperColor)
directionalLightHelper.visible = false
directionalLightGui.add(directionalLightHelper, 'visible').name('Helper Enable')
directionalLightGui.addColor(debugObj, 'directionalLightHelperColor').onChange(() => {
    scene.remove(directionalLightHelper)
    directionalLightHelper.dispose()
    directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, debugObj.directionalLightHelperSize, debugObj.directionalLightHelperColor)
    scene.add(directionalLightHelper)
}).name('Helper Color')
scene.add(directionalLightHelper)

console.log(THREE.REVISION);


debugObj.pointLightHelperColor = 0xFFFFFF
debugObj.pointLightHelperSize = 0.1
let pointLightHelper = new THREE.PointLightHelper(pointLight, debugObj.pointLightHelperSize, debugObj.pointLightHelperColor)
pointLightHelper.visible = false
pointLightGui.add(pointLightHelper, 'visible').name('Helper Enable')
pointLightGui.addColor(debugObj, 'pointLightHelperColor').onChange(() => {
    scene.remove(pointLightHelper)
    pointLightHelper.dispose()
    pointLightHelper = new THREE.PointLightHelper(pointLight, debugObj.pointLightHelperSize, debugObj.pointLightHelperColor)
    scene.add(pointLightHelper)
}).name('Helper Color')
scene.add(pointLightHelper)

debugObj.rectAreaLightHelperColor = 0xFFFFFF
let rectAreaLightHelper= new RectAreaLightHelper(rectAreaLight, debugObj.rectAreaLightHelperColor)
rectAreaLightHelper.visible = false
reactAreaLightGui.add(rectAreaLightHelper, 'visible').name('Helper Enable')
reactAreaLightGui.addColor(debugObj, 'rectAreaLightHelperColor').onChange(() => {
    scene.remove(rectAreaLightHelper)
    rectAreaLightHelper.dispose()
    rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight, debugObj.rectAreaLightHelperColor)
    scene.add(rectAreaLightHelper)
}).name('Helper Color')
scene.add(rectAreaLightHelper)


debugObj.spotLightHelperColor = 0xFFFFFF
let spotLightHelper = new THREE.SpotLightHelper(spotLight, debugObj.spotLightHelperColor)
spotLightHelper.visible = false
spotLightGui.add(spotLightHelper, 'visible').name('Helper Enable')
spotLightGui.addColor(debugObj, 'spotLightHelperColor').onChange(() => {
    scene.remove(spotLightHelper)
    spotLightHelper.dispose()
    spotLightHelper = new THREE.SpotLightHelper(spotLight, debugObj.spotLightHelperColor)
    scene.add(spotLightHelper)
}).name('Helper Color')
scene.add(spotLightHelper)

/**
 * Objects
 */

// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()