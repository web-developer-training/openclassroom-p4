// recherche dans url           
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
//prendre la variable dans url de ID
let idArticle = urlParams.get('id');

//prendre la variable dans url de page
let page = urlParams.get('page')

//variable produit
let product = [];

//varible panier
const panier = [];

let tableauId = [];


// appel API (promesse)
fetch('https://orinocouille.herokuapp.com/api/cameras')

// pour activer la promesse utilisez (then)
  .then(function(res) {   
    if (res.ok) {

      // mettre les element de api en .json  Fin de fonction 
      return res.json();
    }
  })
  //document dans Url
  .then(function(value) { 
    product=value;

 //voir les pages Url de la page
    switch (page) {

//affichage description
      case 'description':
       afficherDescription(value);
        break;

        //affichage panier
      case 'panier':
        afficherPanier()
        break;

      case 'confirmation':
        receptionConfirmationDeCommande()
        break;


        //affichage afficherArticle par default
      default:
       afficherArticle(value);

       
    }
    
    // fin de fonction
    return value
  
  })
  // si ya une erreur
  .catch(function(err) {
    console.log(err);
     // alert('la requette http introuvable')
  });

//affiche les article envoyer par l'API
  function afficherArticle(article){
    let contenueHtml= '';
    for(let i=0;i<article.length; i++){
      contenueHtml += `
    
    <div class="card">
    <img class="card-img-top img-marge" src=${article[i].imageUrl} alt="Card image cap">
    <div class="card-body card-alignement">
    <h5 class="card-title">${article[i].name}</h5>
    <p class="card-text">${article[i].price /100}€</p>
    <a href='produit.html?id=${article[i]._id}&page=description'> <button class="btn btn-outline-primary">Details</button></a>
    <button  class="background" onclick="ajouterPanier(${i},'${article[i]._id}')"><i class="fas fa-cart-arrow-down"></i></button>
  </div>
</div>
         `
    }
 
document.getElementById('productList').innerHTML = contenueHtml
  }




  //local storage panier
function ajouterPanier(position,id){
// je verifie que le localStorage existe
if (JSON.parse (localStorage.getItem("panierLocalStorage"))){
  //variable panier
  this.panier = JSON.parse (localStorage.getItem("panierLocalStorage"));
}
// sinon j'initialise la varible 
else {
  this.panier = []
}

for(let i=0;i<this.panier.length; i++){
  // si ya deja un article avec le meme ID alor quantité + 1
    if(id===this.panier[i]._id){
      console.log('tableau panier IF: ', this.panier[i])
      this.panier[i]['quantités']+=1;

      //cree panier localStarage
      localStorage.setItem("panierLocalStorage",JSON.stringify(this.panier));
     // alert('Article ajouter au panier');
      //selection element dont l'ID et (quantitesTableau)
      if(page==='panier'){
        let prixTotal=Number(document.getElementById('validePanier').textContent) ;
        prixTotal += this.panier[position].price /100
         //selection element dont l'ID et (validePanier)
         console.log(this.panier[position].price)
         console.log(this.panier[position]['quantités'])
        document.getElementById('validePanier').innerHTML = prixTotal;
     
      document.getElementById('quantitesTableau'+ position).innerHTML= this.panier[position]['quantités'] + 'Qts'
      }
      return;
    }

}

// si il y a pas d'article avec le meme Id alor cree la ligne article
let positionPush = this.panier.push (product[position]);

this.panier[positionPush-1]['quantités']=1;
  localStorage.setItem("panierLocalStorage",JSON.stringify(this.panier));
  //alert('Article ajouter au panier');
 
 //prix total
 if (page === 'panier'){
 let prixTotal=Number(document.getElementById('validePanier').textContent);
 prixTotal += this.panier[position].price*this.panier[position]['quantités']

  //selection element dont l'ID et (validePanier)
 document.getElementById('validePanier').innerHTML = prixTotal;
//alert('je suis la');
}
}


 //Supprimer panier
function supprimerPanier(position){
 
  let prixTotal=Number(document.getElementById('validePanier').textContent) ;
prixTotal -= this.panier[position].price /100

//si la quantités et = a 1 alors suprime la ligne
if(this.panier[position]['quantités']===1){
  this.panier.splice(position,1)
  document.getElementById('tableauArticle'+ position).remove()
  localStorage.setItem("panierLocalStorage",JSON.stringify(this.panier))
  afficherPanier();
}

else{
// reduction de la quantité de 1 a chaque click
this.panier[position]['quantités']-=1;
  console.log(this.panier)
  localStorage.setItem("panierLocalStorage",JSON.stringify(this.panier))
  document.getElementById('quantitesTableau'+ position).innerHTML= this.panier[position]['quantités'] + 'Qts'

//alert('Article supprimer');
//supprimer affichage de mon tableauArticle avec la position
}

 //selection element dont l'ID et (validePanier)
document.getElementById('validePanier').innerHTML = prixTotal;
}


//afficher panier
function afficherPanier(){ 
  if (JSON.parse (localStorage.getItem("panierLocalStorage"))){
    //variable panier
    this.panier = JSON.parse (localStorage.getItem("panierLocalStorage"));
  }
  // sinon j'initialise la varible 
  else {
    this.panier = []
  }
console.log('tableurpanier :',this.panier)
let listOfProducts = '';
let prixTotalPanier = 0;

this.tableauId = []
  for(let i=0;i<this.panier.length; i++){//parcour du tableau panier

    // ajout des prix
  prixTotalPanier += this.panier[i].price*this.panier[i]['quantités'] ;
    this.tableauId.push(this.panier[i]._id);
    listOfProducts += `
    <div id="tableauArticle${i}" class="card card-panier">
    <img class="card-img-top img-taille-panier" src=${this.panier[i].imageUrl} alt="Card image cap ">
    <div class="card-body">
    <h5 class="card-title">${this.panier[i].name}</h5>
    <p class="card-text">${this.panier[i].price / 100}€</p>
    <button  class="background" onclick="ajouterPanier(${i},'${this.panier[i]._id}')"><i class="fas fa-plus"></i></button>
    <span id="quantitesTableau${i}"> ${this.panier[i].quantités}Qts </span>
    <button  class="background" onclick="supprimerPanier(${i})"><i class="fas fa-minus"></i></button>
    <a href='produit.html?id=${this.panier[i]._id}&page=description'> <button class="btn btn-outline-primary">Details</button></a>
    
   
  </div>
</div>


`  

  } 
  console.log(this.tableauId)
  listOfProducts += `
<div class="card card-panier">
        <div class="d-inline-flex justify-content-center prixTotal"><p>Prix Total</p>
        </div>
        <div >Livraison Gratuit
        </div>
        <div>
        <div id="validePanier" class="d-inline-flex justify-content-center prixTotal">${prixTotalPanier / 100} 
        </div>€
        </div>
        <div> <img class="logo-carte" src="css/logo-carte-bleu.png" alt="">
        </div>

       

</div>

     
         `   
        
 //affiche productlist Html
  document.getElementById('productListPanier').innerHTML = listOfProducts
}
 

//fonction afficherDescription dans la page produit.html 
  function afficherDescription(article){
     let listOfProducts = '';
    for(let i=0; i<article.length; i++){
      console.log('boucle for ',idArticle)
      console.log(article[0])
      
      if(article[i]._id===idArticle){
        //html description
        listOfProducts += `
        <div id="tableauArticle${i}" class="card card-description">
        <img class="card-img-top" src=${article[i].imageUrl} alt="Card image cap">
        <div class="card-body card-alignement">
        <h5 class="card-title">${article[i].name}</h5>
        <p class="card-text">${article[i].price /100}€</p>
        <p class="card-text">${article[i].description}</p>
        <button  class="background" onclick="ajouterPanier(${i},'${article[i]._id}')"><i class="fas fa-cart-arrow-down"></i></button>
      </div>
    </div>

       <div class="form-floating ">
        <select class="butonLentilles form-select  " id="floatingSelect" aria-label="Floating label select example">`;

       for(let s=0; s<article[i].lenses.length; s++ ){
      
        listOfProducts +=`  
       <option value="${article[i].lenses[s]}">${article[i].lenses[s]}</option>
     
     `
       }
       listOfProducts+=`
       </select>
       <label for="floatingSelect">lentilles</label>
       </div>
     </div>`
      console.log(article[i].lenses)
     
      document.getElementById('productListDescription').innerHTML = listOfProducts
        }
      }
    }
    function Contact(firstName,lastName,address,city,email) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.address = address;
      this.city = city;
      this.email = email;

    }
function envoieApi(){
let products = this.tableauId;
let form = document.forms['formulaireApi']
let formulaireNom = form.elements['nom'].value ;
let formulairePrenom = form.elements['prenom'].value ;
let formulaireAdress = form.elements['adress'].value ;
let formulaireVille = form.elements['ville'].value ;
let formulaireEmail = form.elements['email'].value ;
let erreurChamps = false
let contact = new Contact(formulaireNom, formulairePrenom, formulaireAdress, formulaireVille, formulaireEmail );
 console.log(products);
 console.log(contact);
 
 if(formulaireNom === ""){
  erreurChamps = true
  document.getElementById('messageErreurNom').innerHTML = `<i class="fas fa-exclamation-triangle"></i> Remplir Nom `
}
 if(formulairePrenom === ""){
   erreurChamps = true
   document.getElementById('messageErreurPrenom').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Remplir Prénom'
 }
 if(formulaireAdress === ""){
   erreurChamps = true
   document.getElementById('messageErreurAdresse').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Remplir Adresse'
  }
 if(formulaireVille ===""){
   erreurChamps = true
   document.getElementById('messageErreurVille').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Remplir Ville'
  }
 if(formulaireEmail===""){
   erreurChamps = true
   document.getElementById('messageErreurEmail').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Remplir Email'
 }
 if(erreurChamps ===false){
    fetch('https://orinocouille.herokuapp.com/api/cameras/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contact, products })
    })
      .then(response => 
        response.json()
      )
      .then((data) => {
        console.log(data.orderId)
        localStorage.setItem("order", JSON.stringify(data.orderId));
        document.location.href = "confirmationDeCommande.html?page=confirmation";
      })
      .catch(err => {
        console.log(err)
      })
    
  
   

    }
  }


    function receptionConfirmationDeCommande(){
      this.panier= JSON.parse (localStorage.getItem('panierLocalStorage'));
      let prixTotalPanier = 0
     for (let i = 0; i<this.panier.length ; i++ )
     {
      prixTotalPanier += this.panier[i].price*this.panier[i]['quantités'] ;
    
     }
     
    let order = JSON.parse (localStorage.getItem("order"))
      listOfProducts=`
     <div class='valideLogo' ><p>Commande Validé</p>
      <i class="fas fa-check-circle text-success confirmationPlacement" aria-hidden="true"></i></div>
      <p class='confirmationPlacement'>
      Numéro de Commande: 
      <br>${order}
      </p>
      <p class='confirmationPlacement'>
      Prix de la commande: <br>
      ${prixTotalPanier/100}€
      </p>
      
      

      
      `
      document.getElementById('confirmationDeCommande').innerHTML = listOfProducts;

    }

  

  

