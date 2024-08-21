import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader} from "three/addons";
import  { TextGeometry} from "three/addons";

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

const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace
/**
 * Fonts
 */

const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Corentin Charton',
            {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )
        // Center geometry (HARD WAY)
        //textGeometry.computeBoundingBox()
        //textGeometry.translate(
        //    -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //    -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //    -(textGeometry.boundingBox.max.z - 0.03) * 0.5

        //)

        // Center geometry (EZ WAY)
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        for (let i = 0; i < 250; i++) {
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)

            donut.position.set( (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
            donut.rotation.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, 0)

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)
            scene.add(donut)
        }
    }
)


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