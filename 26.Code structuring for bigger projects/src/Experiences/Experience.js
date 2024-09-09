import * as THREE from 'three'

import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import Ressources from "./Utils/Ressources.js";
import sources from "./sources.js";
import Debug from "./Utils/Debug.js";

let instance

class Experience {
    constructor(canvas) {
        // Global access
        window.experience = this

        if (instance) {
            return instance
        }
        instance = this

        this.canvas = canvas

        // Class instantiation
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.ressources = new Ressources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        // Resize event listener
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Tick event listener
        this.time.on ('tick', () => {
            this.update()
        })
    }

    resize () {
        this.camera.resize()
        this.renderer.resize()
    }

    update () {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy (){
        this.sizes.off('resize')
        this.time.off('tick')

        // Dispose of every elements
        this.scene.traverse((child) => {

            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                for (const key in child.material) {
                    const value = child.material[key]

                    if (value && value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })
        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active) {
            this.debug.gui.destroy()
        }
    }

}

export default Experience