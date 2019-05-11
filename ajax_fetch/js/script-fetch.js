const APIURL = "http://localhost/humanbooster/php/javascript/index.php";
const CLIENT = new Client(APIURL);
var loader = new Loader();

document.addEventListener('DOMContentLoaded',function() {
    var message = document.getElementById('message');

    var afficherProduits = function (tabProduits) {
        var tabBody = document.getElementById('produitsBody');
        tabBody.innerHTML = "";
        for (var i = 0; i < tabProduits.length; i++) {
            var produit = tabProduits[i];
            var tr = document.createElement("tr");
            var tdName = document.createElement("td");
            var tdType = document.createElement("td");
            var tdPrice = document.createElement("td");
            var tdDelete = document.createElement("td");

            tdName.innerHTML = produit.name;
            tdType.appendChild(document.createTextNode(produit.type));
            tdPrice.appendChild(document.createTextNode(produit.price));
            var button = document.createElement('button');
            button.innerHTML = "Supprimer";
            tdDelete.appendChild(button);

            button.setAttribute('idProduit', produit.id);
            button.addEventListener('click', function(event){
                event.stopPropagation();

                CLIENT.deleteProduct(this.getAttribute('idProduit')).then(function(){
                    CLIENT.getAllProducts().then(afficherProduits);
                    document.getElementById('message').innerHTML = "<div class='alert alert-warning'>Produit supprimé</div>";
                    setTimeout(function(){
                        document.getElementById('message').innerHTML = "";
                    }, 3000);
                })

            })

            tr.appendChild(tdName);
            tr.appendChild(tdType);
            tr.appendChild(tdPrice);
            tr.appendChild(tdDelete);

            tr.setAttribute('idProduit', produit.id);
            tr.addEventListener('click', function(){
                loader.show();
                CLIENT.getProductById(this.getAttribute('idProduit')).then(function(produit){
                    document.getElementById('description').innerHTML = "<strong>"+produit.name+"</strong><br/>"+produit.description;
                    loader.hide();
                })
            });

            tabBody.appendChild(tr);
        }

    }

    loader.show();
    CLIENT.getAllProducts().then(function(produits){
        loader.hide();
        afficherProduits(produits);
    });

    var type = document.getElementById('type');
    type.addEventListener('change', function () {
        var value = this.value;

        if (value == 'all') {
            CLIENT.getAllProducts().then(afficherProduits);
        } else {
            CLIENT.getProductsByType(value).then(afficherProduits);
        }
    });

    var form = document.getElementById('form-produit');
    form.addEventListener('submit', function(event){
        event.preventDefault();
        var data = new FormData(form);
        CLIENT.addProduct(data).then(function(){
            document.getElementById('message').innerHTML = "<div class='alert alert-success'>Produit ajouté</div>";
            CLIENT.getAllProducts().then(afficherProduits);
        })
    })
});




