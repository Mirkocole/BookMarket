const urlAPI = 'https://striveschool-api.herokuapp.com/books/';
const container = document.getElementById('content-details');
const params = new URLSearchParams(location.search);
const idBook = params.get('id');

console.log(idBook)

function detailsBook(id) {

    fetch(`${urlAPI}${id}`)
        .then(res => res.json())
        .then(data => {

            console.log(data);
            createDetail(data);
            // 


        })
        .catch(error => console.log(error));
}


function createDetail(infoBook) {

    // <div class="container px-4 text-center" id="content-details">
    //     
    //         <div class="col-12 col-lg-4">
    //             <div class="p-3 mt-5">
    //                 <img src="https://images-na.ssl-images-amazon.com/images/I/91xrEMcvmQL.jpg" class="rounded"
    //                     alt="..." style="height: 500px; width: auto;">
    //             </div>
    //         </div>
    //         <div class="col-12 col-lg-8 shadow rounded">
    //             <div class="p-3 mt-5">
    //                 <h3>Titolo</h3>
    //                 <span>Descrizione del libro</span>
    //                 <span>Categoria</span>

    //             </div>
    //         </div>
    //     
    // </div>


    
    let col1 = document.createElement('div');
    let col2 = document.createElement('div');
    let containerImage = document.createElement('div');
    let containerText = document.createElement('div');
    let imageBook = document.createElement('img');
    let title = document.createElement('h3');
    let description = document.createElement('span');
    let category = document.createElement('span');


    // Stilizzazione nodi
    col1.classList =[ 'col-12 col-lg-4'];
    col2.classList = ['col-12 col-lg-8'];
    containerImage.classList = ['p-3 mt-5'];
    containerText.classList = ['p-3 mt-5'];
    imageBook.classList = ['rounded image-detail'];
    description.classList.add('d-block', 'fs-3', 'fw-5','text-danger');
    category.classList.add('d-block', 'fs-5');

    // Valorizzo i nodi
    imageBook.src = infoBook.img;
    imageBook.alt = 'Image Book '+infoBook.title;
    title.innerText = infoBook.title;
    description.innerText = `${infoBook.price}€`;
    category.innerText = `Categoria: ${infoBook.category}`;

    // Unisco i nodi
    containerText.append(title,description,category);
    col2.appendChild(containerText);
    containerImage.appendChild(imageBook);
    col1.appendChild(containerImage);

    container.append(col1,col2);


}

detailsBook(idBook);