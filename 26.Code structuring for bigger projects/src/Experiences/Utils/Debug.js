import GUI from 'lil-gui'

class Debug {
    constructor() {
        this.active = window.location.hash === '#debug'

        if (this.active) {
            this.gui = new GUI()
        }
    }
}

export default Debug