var send = document.getElementById('send')
var print = document.getElementById('print')
var cardsprint = document.getElementById('cardsprint')
const URL1 = 'https://api.scryfall.com/cards/autocomplete?q='
const URL2 = 'https://api.scryfall.com/cards/named?exact='
const URL3_1 = 'https://api.scryfall.com/cards/search?q='
const URL3_2 = '+unique%3Aprints&unique=cards'


print.addEventListener("click", loadDoc);

async function loadDoc() {
    const response = await fetch(`${URL1}${send.value}`);
    const jsonData = await response.json();
    generateimg(jsonData)
}
async function generateimg(Data){
    console.log(Data)
    cardsprint.innerHTML=``
    if(Data.data.length == 1){
        const response = await fetch(`${URL2}${Data.data[0]}`);
        const cardData = await response.json();
        CreateInfoPage(cardData)
    }else{
        for ( objects of Data.data) {
            const response = await fetch(`${URL2}${objects}`);
            const cardData = await response.json();
            if ('card_faces' in cardData){
                    const cards = document.createElement('div')
                    cards.innerHTML=`<div class="card doublefacedcard" id="${cardData.name}">
                        <img class="frontFace" src=${cardData.card_faces[0].image_uris.normal}>
                        <img class="backSide" src=${cardData.card_faces[1].image_uris.normal}>
                    </div><button class="flipbtn">flip</button>`
                    cardsprint.appendChild(cards)
        
                } else {
                    const cards = document.createElement('div')
                    cards.classList.add('card')
                    cards.setAttribute("id", cardData.name);
                    cards.innerHTML=`<img src=${cardData.image_uris.normal}>`
                    cardsprint.appendChild(cards)
                }
                cardinfo = document.getElementById(cardData.name)
                cardinfo.addEventListener('click', function(){
                    CreateInfoPage(cardData)
            })
        }
            setflip()
    }
}

function setflip(){
    var flipButtons = document.querySelectorAll('.flipbtn')
    flipButtons.forEach(btn=>{
        btn.addEventListener('click',function(){
            card = btn.parentElement.childNodes[0]
            if(card.classList.contains('flip')){
                card.classList.remove('flip')
            }else{
                card.classList.add('flip')
            }
        })
    })

}

function CreateInfoPage(cardData){
    let overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.prepend(overlay);

    // Modal div
    let modal = document.createElement('div');
    modal.classList.add('modal');
    overlay.append(modal);

    // Close operator info button
    let closeBtn = document.createElement('button');
    closeBtn.innerText = "X";
    modal.append(closeBtn);
    closeBtn.addEventListener('click', (e) => {
        e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
    })
}
