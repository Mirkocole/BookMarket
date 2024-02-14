// https://striveschool-api.herokuapp.com/books
const urlAPI = 'https://striveschool-api.herokuapp.com/books';
const containerHome = document.getElementById('homeResults');
const iconCart = document.getElementById('iconCart');
const notify = document.getElementById('notify');
const inputSearch = document.getElementById('inputSearch');
const containerTotalCart = document.getElementById('totalCart');
const bottoneSvuota = document.getElementById('btn-svuota');
let totalpriceCart = 0;
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
    let divButtons = document.createElement('div');
    let buttonCard = document.createElement('button');
    let buttonHide = document.createElement('button');
    let buttonDetail = document.createElement('button');


    // Stilizzazione nodi
    col.classList.add('col');
    subCol.classList=['p-1 p-lg-3'];
    card.classList = ['card position-relative shadow border border-none'];
    card.id = book.asin;
    imageCard.classList.add('card-img-top');
    cardBody.classList.add('card-body');
    titleCard.classList.add('card-title');
    titleCard.style.fontWeight = 'bold';
    categoryCard.classList.add('card-text');
    priceCard.classList = ['position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger fs-6'];
    divButtons.classList = ['d-grid gap-2'];
    buttonCard.classList = ['btn btn-primary'];
    buttonHide.classList = ['btn btn-outline-danger'];
    buttonDetail.classList = ['btn btn-outline-dark'];

    // Inserimento valori
    imageCard.src = img;
    imageCard.alt = title;
    titleCard.innerText = title;
    categoryCard.innerText = `Category: ${category}`;
    priceCard.innerText = `${price.toFixed(2)} €`;
    buttonCard.innerText = `Aggiungi al Carrello`;
    buttonHide.innerText = 'Salta';
    buttonDetail.innerText = 'Dettagli';

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

    // Funzione SALTA libro
    buttonHide.addEventListener('click',()=>{
        col.classList.add('d-none');
    })

    // Logica pulsante dettagli
    buttonDetail.addEventListener('click',()=>{
        window.location.href='/dettagli.html?id='+book.asin;
    })

    // Combinazione dei Nodi
    divButtons.append(buttonCard,buttonHide,buttonDetail);
    cardBody.append(titleCard,categoryCard,priceCard,divButtons);
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

    resetCart();
    resetListCartItems();
    // Recupero il contenitore del carrello
    const resultsCart = document.getElementById('resultsCart');

    // Creo gli elementi del DOM
    const lista = document.createElement('ul');
    lista.classList.add('list-group');

    // Creo lista riepilogo carrello
    let listItems = document.createElement('ul');
    listItems.classList = ['p-1']
    
    cart.forEach(element =>{
        let ele = cartCards(element);
        let li = listCartItem(element);
        listItems.appendChild(li);
        resultsCart.appendChild(ele);
    })

    containerTotalCart.appendChild(listItems);

    let totalPrice = document.querySelector('#title-total');
    getTotalPriceCart();
    totalPrice.innerText = 'Total '+totalpriceCart.toFixed(2)+'€';

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


    // console.log(element);
    // Funzione del click che elimina l'elemento dal carrello
    buttonClose.addEventListener('click',()=>{
        cart.splice(cart.indexOf(element), 1);
        restyleBookSelected(element);
        eventCart();
        resetCart();
        resetListCartItems();
        cartItems();
        getTotalPriceCart();
    })

    return item;

}

function listCartItem({title, price, count}){

    
    // Creo i nodi per la lista degli elementi 
    let item = document.createElement('li');
    let name = document.createElement('h6');
    let prezzo = document.createElement('span');
    let quantita = document.createElement('span');

    // Stilizzazione nodi
    item.classList = ['d-flex border p-2 rounded my-3 justify-content-between align-items-center position-relative'];
    quantita.classList = ['position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger'];
    prezzo.classList.add('price-span');
    name.classList = ['me-3']

    // Valorizzo gli elementi
    name.innerText = title;
    prezzo.innerText = count == 1 ? price+'€' : (price*count)+'€'; 
    quantita.innerText = count > 1 ? count : '';

    item.append(name,prezzo,quantita);

    return item;


}

function resetCart(){
    const lista = document.querySelectorAll('#resultsCart li');
    lista.forEach(el => el.remove())
} 

function resetListCartItems(){
    let listItemsCart = document.querySelectorAll('#totalCart > ul > li');
    listItemsCart.forEach(el => el.remove());
}

function restyleBookSelected({asin}){
    let cardRestyle = document.getElementById(asin);
    cardRestyle.classList.remove('border-danger');
}

function getTotalPriceCart(){
    totalpriceCart = 0;
    cart.forEach(el =>{
        console.log(el)
        totalpriceCart += el.price * el.count;
        console.log(totalpriceCart)
    })
}

// Logica svuota carrello
bottoneSvuota.addEventListener('click',()=>{
    svuotaCarrello();
})


function svuotaCarrello(){
    cart = [];
    totalpriceCart = 0;
    resetCart();
    resetListCartItems();

    let cards = document.querySelectorAll('#homeResults .card');
    cards.forEach(el => {
        el.classList.remove('border-danger');
    })

    let totalPrice = document.querySelector('#title-total');
    totalPrice.innerText = 'Total '+totalpriceCart.toFixed(2)+'€';

    eventCart();
}