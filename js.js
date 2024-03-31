var send = document.getElementById('send')
var print = document.getElementById('print')
var cardsprint = document.getElementById('cardsprint')
const URL1 = 'https://api.scryfall.com/cards/autocomplete?q='
const URL2 = 'https://api.scryfall.com/cards/named?exact='
const URL3_1 = 'https://api.scryfall.com/cards/search?q='
const URL3_2 = '+unique%3Aprints&unique=cards'
nameArray = []

print.addEventListener("click", loadDoc);

async function loadDoc() {
    const response = await fetch(`${URL1}${send.value}`);
    const jsonData = await response.json();
    nameArray.push(jsonData)
    generateimg()
}
async function generateimg(){
    cardsprint.innerHTML=``
    for ( objects of nameArray[0].data) {
    const response = await fetch(`${URL2}${objects}`);
    const cardData = await response.json();
    if ('card_faces' in cardData){
            const cards = document.createElement('div')
            cards.classList.add('card')
            cards.innerHTML=`<div class="doublefacedcard">
                <img class="frontFace" src=${cardData.card_faces[0].image_uris.normal}>
                <img class="backSide" src=${cardData.card_faces[1].image_uris.normal}>
            </div><button class="flipbtn">flip</button>`
            cardsprint.appendChild(cards)
        } else {
            const cards = document.createElement('div')
            cards.classList.add('card')
            cards.innerHTML=`<img src=${cardData.image_uris.normal}>`
            cardsprint.appendChild(cards)
        }
    }
    setflip()
    clearArray()
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

function clearArray(){
    nameArray.length = 0
}