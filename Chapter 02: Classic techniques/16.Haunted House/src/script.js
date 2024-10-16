import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from "three/addons";
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

// FLOOR

const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')
const floorTerrainTexture= textureLoader.load('./floor/rocky_terrain_diff_1k.jpg')
const floorTerrainDispTexture = textureLoader.load('./floor/rocky_terrain_disp_1k.jpg')
const floorTerrainArmTexture = textureLoader.load('./floor/rocky_terrain_arm_1k.jpg')
const floorTerrainNorGLTexture = textureLoader.load('./floor/rocky_terrain_nor_gl_1k.png')

floorTerrainTexture.colorSpace = THREE.SRGBColorSpace
floorTerrainTexture.repeat.set(8, 8)
floorTerrainTexture.wrapS = THREE.RepeatWrapping
floorTerrainTexture.wrapT = THREE.RepeatWrapping

floorTerrainDispTexture.repeat.set(8, 8)
floorTerrainDispTexture.wrapS = THREE.RepeatWrapping
floorTerrainDispTexture.wrapT = THREE.RepeatWrapping

floorTerrainArmTexture.repeat.set(8, 8)
floorTerrainArmTexture.wrapS = THREE.RepeatWrapping
floorTerrainArmTexture.wrapT = THREE.RepeatWrapping

floorTerrainNorGLTexture.repeat.set(8, 8)
floorTerrainNorGLTexture.wrapS = THREE.RepeatWrapping
floorTerrainNorGLTexture.wrapT = THREE.RepeatWrapping

// WALL

const wallDiffTexture = textureLoader.load('././wall/castle_brick_broken_06_diff_1k.jpg')
const wallArmTexture = textureLoader.load('././wall/castle_brick_broken_06_arm_1k.png')
const wallNorGLTexture = textureLoader.load('././wall/castle_brick_broken_06_nor_gl_1k.png')

wallDiffTexture.colorSpace = THREE.SRGBColorSpace

// ROOF

const roofDiffTexture = textureLoader.load('./roof/thatch_roof_angled_diff_1k.jpg')
const roofArmTexture = textureLoader.load('./roof/thatch_roof_angled_arm_1k.png')
const roofNorGLTexture = textureLoader.load('./roof/thatch_roof_angled_nor_gl_1k.png')

roofDiffTexture.colorSpace = THREE.SRGBColorSpace

roofDiffTexture.repeat.set(3, 1)
roofArmTexture.repeat.set(3, 1)
roofNorGLTexture.repeat.set(3, 1)

roofDiffTexture.wrapS = THREE.RepeatWrapping
roofArmTexture.wrapS = THREE.RepeatWrapping
roofNorGLTexture.wrapS = THREE.RepeatWrapping

// BUSHES

const bushDiffTexture = textureLoader.load('./bush/forest_leaves_04_diff_1k.jpg')
const bushArmTexture = textureLoader.load('./bush/forest_leaves_04_arm_1k.png')
const bushNorGLTexture = textureLoader.load('./bush/forest_leaves_04_nor_gl_1k.png')

bushDiffTexture.colorSpace = THREE.SRGBColorSpace
bushDiffTexture.repeat.set(2, 1)
bushArmTexture.repeat.set(2, 1)
bushNorGLTexture.repeat.set(2, 1)

bushDiffTexture.wrapS = THREE.RepeatWrapping
bushArmTexture.wrapS = THREE.RepeatWrapping
bushNorGLTexture.wrapS = THREE.RepeatWrapping

// GRAVES

const gravesDiffTexture = textureLoader.load('./graves/gravel_embedded_concrete_diff_1k.jpg')
const gravesArmTexture = textureLoader.load('./graves/gravel_embedded_concrete_arm_1k.png')
const gravesNorGLTexture = textureLoader.load('./graves/gravel_embedded_concrete_nor_gl_1k.png')

gravesDiffTexture.colorSpace = THREE.SRGBColorSpace

gravesDiffTexture.repeat.set(0.3, 0.4)
gravesArmTexture.repeat.set(0.3, 0.4)
gravesNorGLTexture.repeat.set(0.3, 0.4)

gravesDiffTexture.wrapS = THREE.RepeatWrapping
gravesArmTexture.wrapS = THREE.RepeatWrapping
gravesNorGLTexture.wrapS = THREE.RepeatWrapping

// DOOR

const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * House
 */

// FLOOR
const floor = new  THREE.Mesh(
    new THREE.PlaneGeometry(25, 25, 100, 100),
    new THREE.MeshStandardMaterial({
        map: floorTerrainTexture,
        displacementMap: floorTerrainDispTexture,
        displacementScale: 0.05,
        displacementBias: 0,
        aoMap: floorTerrainArmTexture,
        aoMapIntensity: 1,
        roughnessMap: floorTerrainArmTexture,
        metalnessMap: floorTerrainArmTexture,
        normalMap: floorTerrainNorGLTexture,
        alphaMap: floorAlphaTexture,
        transparent: true})
)
floor.rotation.x = -Math.PI * 0.5
gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('Floor Scale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('Floor Bias')

// HOUSE

const house = new THREE.Group()

const walls= new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallDiffTexture,
        aoMap: wallArmTexture,
        roughnessMap: wallArmTexture,
        metalnessMap: wallArmTexture,
        normalMap: wallNorGLTexture
    })
)
walls.position.y += 1.25

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofDiffTexture,
        aoMap: roofArmTexture,
        roughnessMap: roofArmTexture,
        metalnessMap: roofArmTexture,
        normalMap: roofNorGLTexture
    })
)
roof.position.y += 3.25
roof.rotation.y  = Math.PI * 0.25

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture
    })
)
door.position.y += 1.075
door.position.z += 2.001

// BUSHES

const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: 0x53bb6c,
    map: bushDiffTexture,
    aoMap: bushArmTexture,
    roughnessMap: bushArmTexture,
    metalnessMap: bushArmTexture,
    normalMap: bushNorGLTexture
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.51)
bush1.rotation.x = -1

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.3)
bush2.rotation.x = -1

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.4)
bush3.rotation.x = -1

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.8)
bush4.rotation.x = -1

house.add(walls, roof, door, bush1, bush2, bush3, bush4)

// GRAVES
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    color: 0x6b6b6b,
    map: gravesDiffTexture,
    aoMap: gravesArmTexture,
    roughnessMap: gravesArmTexture,
    metalnessMap: gravesArmTexture,
    normalMap: gravesNorGLTexture
})

const graves = new THREE.Group()

for (let i = 0; i < 30; i++) {
    const grave =  new THREE.Mesh(graveGeometry, graveMaterial)
    const angle = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 4
    grave.position.set(Math.sin(angle) * radius, Math.random() * 0.4, Math.cos(angle) * radius)
    grave.rotation.set((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4)
    graves.add(grave)
}

scene.add(floor, house, graves)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86CDFF', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86CDFF', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door light
const doorLight = new THREE.PointLight(0xFF7D46, 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

/**
 * Ghost Light
 */

const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)

/**
 * Shadows
 */

// Cast and receive
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

for(const grave of graves.children)
{
    grave.castShadow = true
    grave.receiveShadow = true
}

// Mapping

directionalLight.shadow.mapSize = new THREE.Vector2(256,256)
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize = new THREE.Vector2(256,256)
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize = new THREE.Vector2(256,256)
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize = new THREE.Vector2(256,256)
ghost3.shadow.camera.far = 10

/**
 * Sky
 */

const sky = new Sky()
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)
sky.scale.set(100, 100, 100)
scene.add(sky)

/**
 * Fog
 */

scene.fog = new THREE.FogExp2(0x02343F, 0.1)

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Ghost Animation

    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.set(Math.cos(ghost1Angle) * 4, Math.sin(ghost1Angle * Math.sin(ghost1Angle * 2.34)  * Math.sin(ghost1Angle * 3.45)) , Math.sin(ghost1Angle) * 4)

    const ghost2Angle = elapsedTime * 0.63
    ghost2.position.set(Math.cos(ghost2Angle) * 6, Math.sin(ghost2Angle * Math.sin(ghost2Angle * 2.34)  * Math.sin(ghost2Angle * 3.45)) , Math.sin(ghost2Angle) * 5)

    const ghost3Angle = elapsedTime * 0.21
    ghost3.position.set(Math.cos(ghost3Angle) * 4, Math.sin(ghost3Angle * Math.sin(ghost3Angle * 2.34)  * Math.sin(ghost3Angle * 3.45)) , Math.sin(ghost3Angle) * 4)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()