import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from "three/addons";

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
 * Object loader
 */

const gltfLoader = new GLTFLoader()
let duck
gltfLoader.load('./models/Duck/glTF-Binary/Duck.glb', (gltf) => {
    duck = gltf.scene
    duck.position.y = - 2
    scene.add(duck)
})

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster()
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
 * Mouse
 */

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 -1
    mouse.y = -(event.clientY / sizes.height * 2 - 1)
})

window.addEventListener('click', () => {
    if (currentIntersect) {
        console.log('click click')
    }
})

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight('#FFFFFF', 2.5);

const directionalLight = new THREE.DirectionalLight('#FFFFFF', 3.5)
directionalLight.position.set(1, 2, 3)
scene.add(ambientLight, directionalLight)

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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


let currentIntersect

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate object
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.cos(elapsedTime * 0.3) * 1.7
    object3.position.y = Math.sin(elapsedTime * 0.3) * 1.3

    // Cast a ray

    // Test on each frame if ray touch sphere.
    /*
    const rayOrigin = new THREE.Vector3(- 3, 0, 0)
    const rayDirection = new THREE.Vector3(1, 0, 0)
    rayDirection.normalize()

    raycaster.set(rayOrigin, rayDirection)

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    for (const object of objectsToTest) {
        object.material.color.set('#FF0000')
    }

    for (const intersect of intersects) {
        intersect.object.material.color.set('#FFFFFF')
    }
    */

    raycaster.setFromCamera(mouse, camera)
    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    for (const object of objectsToTest) {
        object.material.color.set('#FF0000')
    }

    for (const intersect of intersects) {
        intersect.object.material.color.set('#FFFFFF')
    }

    if (intersects.length) {
        if (!currentIntersect) {
            console.log('mouse enter')
        }
        currentIntersect = intersects[0]
    } else {
        if(currentIntersect) {
            console.log('mouse leave')
        }
        currentIntersect = null
    }

    // Duck hover
    if(duck)
    {
        const modelIntersects = raycaster.intersectObject(duck)

        if(modelIntersects.length)
        {
            duck.scale.set(1.2, 1.2, 1.2)
        }
        else
        {
            duck.scale.set(1, 1, 1)
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()