import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

/**
 * DEBUG GUI
 */
const gui = new GUI({
    width: 340,
    title: "Cool Debug UI"
})
gui.hide()
window.addEventListener('keydown', (event) => {
    if (event.key === 'g') {
        gui.show(gui._hidden)
    }
})
const cubeTweak = gui.addFolder("Cube Properties")
const debugObj= {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
debugObj.color = '#FFABCD'
debugObj.subdivision = 2
const geometry = new THREE.BoxGeometry(1, 1, 1, debugObj.subdivision, debugObj.subdivision, debugObj.subdivision)
const material = new THREE.MeshBasicMaterial({ color: debugObj.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

cubeTweak.add(mesh.position, 'x', -2, 2, 0.2)
cubeTweak.add(mesh.position, 'y', -2, 2, 0.2)
cubeTweak.add(mesh, 'visible')
cubeTweak.add(material, 'wireframe')
cubeTweak.addColor(debugObj, 'color').onChange((value) => {
    material.color.set(debugObj.color)
})

debugObj.spin = () => {
    const duration = 600;
    const targetRotation = mesh.rotation.y + Math.PI * 2;
    const startRotation = mesh.rotation.y;
    const startTime = performance.now();

    function animate(time) {
        const elapsedTime = time - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        mesh.rotation.y = startRotation + (targetRotation - startRotation) * progress;
        renderer.render(scene, camera);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);

    //The OG animation using GSAP
    //gsap.to(mesh.rotation, {y: mesh.rotation.y + Math.PI * 2})
}
cubeTweak.add(debugObj, 'spin')

cubeTweak.add(debugObj, 'subdivision', 1, 20, 1).onFinishChange(() => {
    mesh.geometry.dispose()
    mesh.geometry = new THREE.BoxGeometry(1, 1, 1, debugObj.subdivision, debugObj.subdivision, debugObj.subdivision)
})

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()