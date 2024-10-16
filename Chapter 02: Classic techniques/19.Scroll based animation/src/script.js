import * as THREE from 'three'
import GUI from 'lil-gui'
import {materialColor, objectGroup, viewport} from "three/nodes"
import gsap from 'gsap'
/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#8577EE'
}

gui.addColor(parameters, 'materialColor').onChange(() => {
    material.color.set(parameters.materialColor)
    particlesMaterial.color.set(parameters.materialColor)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('./textures/gradients/5.jpg')
gradientTexture.magFilter = THREE.NearestFilter
const particleTexture = textureLoader.load('./textures/particles/10.png')
/**
 * Mesh
 */
const material = new THREE.MeshToonMaterial( {
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

const objectDistance = 4

const object1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.8, 0.4,16, 60),
    material
)

const object2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2,32),
    material
)

const object3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 100, 100),
    material
)

object2.position.y = -objectDistance
object3.position.y = -objectDistance * 2

object1.position.x = 2
object2.position.x = - 2
object3.position.x = 2

scene.add(object1, object2, object3)
const sectionObjects = [object1, object2, object3]

/**
 * Particles
 */

parameters.particlesCount = 200
let particlesGeometry
let particlesMaterial
let particles
function generateParticle () {

    if(!!particles) {
        particlesGeometry.dispose()
        particlesMaterial.dispose()
        scene.remove(particles)
    }

    const positions = new Float32Array(parameters.particlesCount * 3)

    for(let i = 0; i < parameters.particlesCount; i++) {
        const i3 = i * 3
        positions[i3] = (Math.random() - 0.5) * 10
        positions[i3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionObjects.length
        positions[i3 + 2] = (Math.random() - 0.5) * 10
    }
    particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )
    particlesMaterial = new THREE.PointsMaterial({
        alphaMap : particleTexture,
        color: parameters.materialColor,
        sizeAttenuation: true,
        size: 0.42,
        transparent: true,
        depthWrite: true,
        blending: THREE.AdditiveBlending,
        alphaTest: 0.001
    })

    particles =  new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)
}
generateParticle()

gui.add(parameters, 'particlesCount').min(0).max(10000).name('Particles Count').onChange(
    generateParticle
)
/**
 * Light
 */

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

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

// Camera Group

const cameraGroup = new THREE.Group()

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)
scene.add(cameraGroup)

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animations
 */

// Fonction d'easing similaire à power2.inOut de GSAP
function easeInOutPower2(t) {
    if (t < 0.5) {
        return 2 * t * t
    } else {
        return 1 - Math.pow(-2 * t + 2, 2) / 2
    }
}

function animateTo(object, deltaRotation, duration) {
    const startTime = performance.now()
    const initialRotationX = object.rotation.x
    const initialRotationY = object.rotation.y

    function update() {
        const currentTime = performance.now()
        const elapsedTime = (currentTime - startTime) / 1000
        const progress = Math.min(elapsedTime / duration, 1)

        const easedProgress = easeInOutPower2(progress)

        object.rotation.x = initialRotationX + deltaRotation.x * easedProgress
        object.rotation.y = initialRotationY + deltaRotation.y * easedProgress

        if (progress < 1) {
            requestAnimationFrame(update)
        }
    }
    requestAnimationFrame(update)
}

/**
 * Scroll
 */

let scroolY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scroolY = window.scrollY
    const newSection =  Math.round(scroolY / sizes.height)
    if (newSection !== currentSection) {
        currentSection = newSection

        // GSAP Animation
        /*
         gsap.to(
            sectionObjects[currentSection].rotation, {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+= 6',
                y: '+= 3'
        })
        */

        // Reproduce Vanilla JS

        const deltaRotation = {
            x: 6,
            y: 3
        }

        animateTo(sectionObjects[currentSection], deltaRotation, 1.5)
    }
})

/**
 * Cursor
 */

const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */

const clock = new THREE.Clock()
let previousTime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = (- scroolY / sizes.height) * objectDistance

    const parrallaxX = cursor.x * 0.5
    const parrallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parrallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parrallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate object

    for(const object of sectionObjects) {
        object.rotation.x += deltaTime * 0.1
        object.rotation.y += deltaTime * 0.105
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()