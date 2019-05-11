/**
 * Classe de gestion de la modal de chargement
 */
class Loader{

    constructor () {
        this.div = document.getElementById('loading-modal');
        this.img = document.getElementById('loading-img');
    }

    show() {
        this.div.style.display = "block";
        this.img.style.display = "block";
        this.img.style.top = window.innerHeight /2 - this.img.height /2 + "px";
        this.img.style.left = window.innerWidth /2 - this.img.width /2 + "px";
    }

    hide(){
        this.div.style.display = "none";
        this.img.style.display = "none";
    }

}