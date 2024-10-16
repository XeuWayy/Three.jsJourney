import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

import EventEmitter from "./EventEmitter.js";

class Ressources extends EventEmitter{
    constructor(sources) {
        super()

        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoader()
        this.startLoading()
    }

    setLoader () {
        this.loader =  {}
        this.loader.gltfLoader = new GLTFLoader()
        this.loader.textureLoader = new THREE.TextureLoader()
        this.loader.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    startLoading () {
        // Load all sources
        for (const source of this.sources) {
            switch (source.type) {
                case 'gltfModel':
                    this.loader.gltfLoader.load(source.path, (file) => {
                        this.sourceLoaded(source, file)
                    })
                    break
                case 'texture':
                    this.loader.textureLoader.load(source.path, (file) => {
                        this.sourceLoaded(source, file)
                    })
                    break
                case 'cubeTexture':
                    this.loader.cubeTextureLoader.load(source.path, (file) => {
                        this.sourceLoaded(source, file)
                    })
                    break
            }
        }
    }

    sourceLoaded (source, file) {
        this.items[source.name] = file

        this.loaded++

        if (this.loaded === this.toLoad) {
            this.trigger('loaded')
        }
    }
}

export default Ressources