/**
 * Classe du client de l'API
 */
class Client {

    constructor(url){
        this.url = url;
    }

    getAllProducts() {
        return fetch(this.url).then(function(response){
            return response.json()
        });
    }

    getProductsByType(type) {
        return fetch(this.url + "?type=" + type).then(function(response){
            return response.json()
        });
    }

    getProductById(id) {
        return fetch(this.url + "?product=" + id).then(function(response){
            return response.json()
        });
    }

    addProduct(data) {
        return fetch(this.url, {method: "POST", body: data}).then(function(response){
            return response.json()
        });
    }

    deleteProduct(id){
        //return fetch(this.url + "?id="+ id, {method: "DELETE"}).then(function(response){
        return fetch(this.url + "?delete="+ id, {method: "GET"}).then(function(response){
            return response.json()
        });
    }

}
