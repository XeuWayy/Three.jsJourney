import * as THREE from 'three'

import Experience from "../Experience.js";

class Environment {
    constructor() {
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.ressources = this.experience.ressources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.gui.addFolder('environment')
        }

        // Light
        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight () {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.sunLight)

        // Debug
        if (this.debug.active) {
            this.debugFolder.add(this.sunLight, 'intensity').min(0).max(10).step(0.01).name('SunLightIntensity')
            this.debugFolder.add(this.sunLight.position, 'x').min(-10).max(10).step(0.01).name('SunLightPos X')
            this.debugFolder.add(this.sunLight.position, 'y').min(-10).max(10).step(0.01).name('SunLightPos Y')
            this.debugFolder.add(this.sunLight.position, 'z').min(-10).max(10).step(0.01).name('SunLightPos Z')


        }
    }

    setEnvironmentMap () {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.ressources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterial = () => {
            this.scene.traverse((child) => {
                if (child instanceof  THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterial()

        // Debug
        if (this.debug.active) {
            this.debugFolder.add(this.environmentMap, 'intensity').min(0).max(10).step(0.01).name('envMapIntensity').onChange(this.environmentMap.updateMaterial)
        }
    }
}

export default Environment