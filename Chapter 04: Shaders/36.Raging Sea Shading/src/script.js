import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {Sky} from "three/addons";
import GUI from 'lil-gui'
import Stats from "three/addons/libs/stats.module.js";

import perlinNoise from './shaders/includes/perlinNoise.glsl'
import vertexSea from './shaders/raging_sea/vertex.glsl'
import fragmentSea from './shaders/raging_sea/fragment.glsl'

/**
 * Base
 */

// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
/*
const axesHelper = new THREE.AxesHelper()
axesHelper.position.setY = 0.25
scene.add(axesHelper)
*/

/**
 * Water
 */

// Geometry
const waterGeometry = new THREE.PlaneGeometry(25, 25, 2048, 2048)
waterGeometry.deleteAttribute('normal') // freeing gpu memory + small perf up
waterGeometry.deleteAttribute('uv')
// Color
debugObject.depthColor = '#ff4000'
debugObject.surfaceColor = '#151c37'
debugObject.fogColor = '#000000'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: perlinNoise + vertexSea,
    fragmentShader: fragmentSea,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
        uTime: {value: 0},

        uBigWavesElevation : {value: 0.2},
        uBigWavesFrequency: {value: new THREE.Vector2(4, 1.5)},
        uBigWavesSpeed: {value: 0.75},

        uSmallWavesElevation: {value: 0.15},
        uSmallWavesFrequency: {value: 3},
        uSmallWavesSpeed: {value: 0.2},
        uSmallWavesIteration: {value: 4},

        uDepthColor : {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor : {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset : {value: 0.925},
        uColorMultiplier : {value: 1},

        uFogColor: {value: new THREE.Color(debugObject.fogColor)},
        uFogNear: {value: 3},
        uFogFar: {value: 14},

        uLightningIntensity: {value: 0}
    }
})
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.01).name('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(20).step(1).name('uBigWavesFrequency X')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(20).step(1).name('uBigWavesFrequency Y')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(2).step(0.01).name('uBigWavesSpeed')

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.01).name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(20).step(1).name('uSmallWavesFrequency')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.01).name('uSmallWavesSpeed')
gui.add(waterMaterial.uniforms.uSmallWavesIteration, 'value').min(0).max(5).step(1).name('uSmallWavesIteration')


gui.addColor(debugObject, 'depthColor').name('depthColor').onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
})
gui.addColor(debugObject, 'surfaceColor').name('SurfaceColor').onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
})
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.01).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(20).step(1).name('uColorMultiplier')

gui.addColor(debugObject, 'fogColor').name('FogColor').onChange(() => {
    waterMaterial.uniforms.uFogColor.value.set(debugObject.fogColor)
})
gui.add(waterMaterial.uniforms.uFogNear, 'value').min(0).max(20).step(1).name('uFogNear')
gui.add(waterMaterial.uniforms.uFogFar, 'value').min(0).max(40).step(1).name('uFogFar')


// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
camera.position.set(2.5, 1, 1)
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
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.75

/**
 * Sky
 */

const sky = new Sky()
sky.material.uniforms['turbidity'].value = 15
sky.material.uniforms['rayleigh'].value = 2
sky.material.uniforms['mieCoefficient'].value = 0.05
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.1, -0.95)
sky.scale.set(100, 100, 100)
scene.add(sky)

/**
 * Fog
 */
scene.fog = new THREE.Fog(debugObject.fogColor, waterMaterial.uniforms.uFogNear, waterMaterial.uniforms.uFogFar)

const lightning = new THREE.PointLight(0xffffff, 0, 100);
lightning.position.set(0, 10, 0);
scene.add(lightning);

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    stats.begin()
    const elapsedTime = clock.getElapsedTime()

    // Lightning
    if (Math.random() > 0.995) {
        waterMaterial.uniforms.uLightningIntensity.value = Math.random() * 0.4 ;

        sky.material.uniforms['turbidity'].value = THREE.MathUtils.lerp(sky.material.uniforms['turbidity'].value, 10, 0.1);
        sky.material.uniforms['rayleigh'].value = THREE.MathUtils.lerp(sky.material.uniforms['rayleigh'].value, 2.2, 0.1);
        sky.material.uniforms['mieCoefficient'].value = THREE.MathUtils.lerp(sky.material.uniforms['mieCoefficient'].value, 0.07, 0.1);
        sky.material.uniforms['sunPosition'].value.set(
            THREE.MathUtils.lerp(sky.material.uniforms['sunPosition'].value.x, Math.random() * 1000, 0.1),
            THREE.MathUtils.lerp(sky.material.uniforms['sunPosition'].value.y, 5 + Math.random() * 10, 0.1),
            THREE.MathUtils.lerp(sky.material.uniforms['sunPosition'].value.z, Math.random() * 1000, 0.1)
        );
    } else {
        waterMaterial.uniforms.uLightningIntensity.value *= 0.9;

        sky.material.uniforms['turbidity'].value = THREE.MathUtils.lerp(sky.material.uniforms['turbidity'].value, 15, 0.1);
        sky.material.uniforms['rayleigh'].value = THREE.MathUtils.lerp(sky.material.uniforms['rayleigh'].value, 2, 0.1);
        sky.material.uniforms['mieCoefficient'].value = THREE.MathUtils.lerp(sky.material.uniforms['mieCoefficient'].value, 0.05, 0.1);
        sky.material.uniforms['sunPosition'].value.set(
            THREE.MathUtils.lerp(sky.material.uniforms['sunPosition'].value.x, 0.3, 0.1),
            THREE.MathUtils.lerp(sky.material.uniforms['sunPosition'].value.y, -0.1, 0.1),
            THREE.MathUtils.lerp(sky.material.uniforms['sunPosition'].value.z, -0.95, 0.1)
        );
    }

    // Update Water
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    stats.end()
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()