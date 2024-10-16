import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Fox from "./Fox.js";

class World {
    constructor() {
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.ressources = this.experience.ressources

        // Wait for textures to be loaded
        this.ressources.on('loaded', () => {
            // Setup
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
        })
    }

    update() {
        if (this.fox) {
            this.fox.update()
        }
    }
}

export default World