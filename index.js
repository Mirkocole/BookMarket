// https://striveschool-api.herokuapp.com/books
const urlAPI = 'https://striveschool-api.herokuapp.com/books';
const containerHome = document.getElementById('homeResults');
const iconCart = document.getElementById('iconCart');
const notify = document.getElementById('notify');
const inputSearch = document.getElementById('inputSearch');
let cart = [];
let itemCart=[];

// Funzione per ricevere tutti i libri
function getBooks(query){
    resetResults();
    fetch(urlAPI)
    .then(res => res.json())
    .then(json => {

        // Creazione delle Card su tutti i libri
        let filterCards = [...json];
        let cards = [];

        
        if (query!== '') {
            filterCards = filterCards.filter((ele) => ele.title.toLowerCase().includes(query.toLowerCase()));
        }

        filterCards.forEach(data => {
          cards.push(createCard(data));
        })
        
            containerHome.append(...cards);
        




    })
    .catch(err => console.log(err));
}

// Funzione per la creazione della Card
function createCard(book){
    const {title,category,img,price} = book;
    // Inizializzazione delle variabili / nodi
    let col = document.createElement('div');
    let subCol = document.createElement('div');
    let card = document.createElement('div');
    let imageCard = document.createElement('img');
    let cardBody = document.createElement('div');
    let titleCard = document.createElement('span');
    let categoryCard = document.createElement('p');
    let priceCard = document.createElement('span');
    let buttonCard = document.createElement('button');


    // Stilizzazione nodi
    col.classList.add('col');
    subCol.classList=['p-1 p-lg-3'];
    card.classList = ['card position-relative shadow border border-none'];
    imageCard.classList.add('card-img-top');
    cardBody.classList.add('card-body');
    titleCard.classList.add('card-title');
    titleCard.style.fontWeight = 'bold';
    categoryCard.classList.add('card-text');
    priceCard.classList = ['position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger fs-6'];
    buttonCard.classList = ['btn btn-primary'];

    // Inserimento valori
    imageCard.src = img;
    imageCard.alt = title;
    titleCard.innerText = title;
    categoryCard.innerText = `Category: ${category}`;
    priceCard.innerText = `${price.toFixed(2)} €`;
    buttonCard.innerText = `Aggiungi al Carrello`;

    // Controllo se è già presente nel carrello per inserire il bordo rosso
    if (cart) {
        cart.forEach(el =>{
            if (el.asin.includes(book.asin)) {
                card.classList.add('border','border-danger');
            }
        })
    }

    // Aggiunta al carrello sul click
    buttonCard.addEventListener('click',()=>{
        let tempCart = cart.filter((el) => el.asin === book.asin);
        if (tempCart.length) {
            let index = cart.findIndex(el => el.asin == book.asin);
            cart[index].count++;
        } else {
            
            cart.push({...book, 'count': 1});
        }
        eventCart();
        card.classList.add('border','border-danger');
    })

    // Combinazione dei Nodi
    cardBody.append(titleCard,categoryCard,priceCard,buttonCard);
    card.append(imageCard,cardBody);
    subCol.appendChild(card);
    col.appendChild(subCol);


    // Ritorno della Card Completa
    return col;
}


// Gestione visibilità numero prodotti sull'icona
function eventCart(){
    let quantity = 0;
    
    if (cart.length > 0) {
        cart.forEach(element => {
            quantity = quantity + element.count;
        });
        notify.innerText = quantity;
        notify.classList.remove('d-none');
    } else {
        notify.classList.add('d-none');
        
    }
}


getBooks('');

// Funzione reset DOM per le ricerche
function resetResults(){
    const results = document.querySelectorAll('#homeResults .col');
    results.forEach(ele => ele.remove());
}

// Funzione che attiva la ricerca dopo tre lettere digitate
inputSearch.addEventListener('keyup',()=>{
    if (inputSearch.value.length >2) {
        
        getBooks(inputSearch.value);
    }

    if (inputSearch.value.length == 0) {
        getBooks('');
    }
})


// Funzione cambio pagina Home/Carrello
function chagePage(event){
    const homepage = document.getElementById('homepage');
    const cartPage = document.getElementById('cartPage');

    if (event.target.innerText === 'Home') {
        
        cartPage.classList.add('d-none');
        homepage.classList.remove('d-none');
    }else{
        cartPage.classList.remove('d-none');
        homepage.classList.add('d-none');
        cartItems();

    }
}



function cartItems(){
    // Recupero il contenitore del carrello
    const resultsCart = document.getElementById('resultsCart');

    // Creo gli elementi del DOM
    const lista = document.createElement('ul');
    lista.classList.add('list-group');

    
    cart.forEach(element =>{
        let ele = cartCards(element);
        resultsCart.appendChild(ele);
    })

    // resultsCart.appendChild(lista);

}

function cartCards(element){
    // Creao gli elementi
    const item = document.createElement('li');
    const image = document.createElement('img');
    const div = document.createElement('div');
    const titleCard = document.createElement('h4');
    const description = document.createElement('span');
    const buttonClose = document.createElement('button');
    const count = document.createElement('span');


    // Stilizzazione elementi
    item.classList = 'list-group-item d-flex flex-column flex-lg-row justify-content-between align-items-center position-relative my-5 rounded p-3 shadow';
    image.style.height = '300px';
    div.classList = 'col p-5 d-flex flex-column';
    buttonClose.classList = 'btn btn-danger position-absolute top-0 end-0 m-2';
    count.classList = element.count > 1 ? 'badge bg-primary rounded-pill' :'badge bg-primary rounded-pill d-none';

    count.innerText = element.count;



    // Valorizzo gli elementi
    image.src = element.img;
    image.alt = element.title;
    titleCard.innerText = element.title;
    description.innerHTML = `Category: ${element.category} Price: <b class='text-danger'>${element.price}€</b>`;
    buttonClose.innerText = 'x';

    div.append(titleCard,description,buttonClose);
    item.append(image,div,count);

    return item;

}