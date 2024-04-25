var send = document.getElementById('send')
var print = document.getElementById('print')
var cardsprint = document.getElementById('cardsprint')
const URL1 = 'https://api.scryfall.com/cards/autocomplete?q='
const URL2 = 'https://api.scryfall.com/cards/named?exact='
const URL3_1 = 'https://api.scryfall.com/cards/search?q="'
const URL3_2 = '"+unique%3Aprints&unique=cards'


print.addEventListener("click", loadDoc);

async function loadDoc() {
    const response = await fetch(`${URL1}${send.value}`);
    const jsonData = await response.json();
    generateimg(jsonData)
}
async function generateimg(Data){
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
                    cards.classList.add('card')
                    if (cardData.layout == "split"){
                        cards.setAttribute("id", cardData.name);
                        cards.innerHTML=`<img src=${cardData.image_uris.normal}>`
                    }else{
                        cards.innerHTML=`<div class="doublefacedcard" id="${cardData.name}">
                            <img class="frontFace" src=${cardData.card_faces[0].image_uris.normal}>
                            <img class="backSide" src=${cardData.card_faces[1].image_uris.normal}>
                        </div><button class="flipbtn">flip</button>`  
                    }
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
            console.log(card)
            if(card.classList.contains('flip')){
                card.classList.remove('flip')
            }else{
                card.classList.add('flip')
            }
        })
    })

}

async function CreateInfoPage(cardData){
    const response = await fetch(`${URL3_1}${cardData.name}${URL3_2}`);
    const jsonData = await response.json();

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
    const generateTextBoxHTML = (i) => {
        return`<h1>${cardData.card_faces[i].name}</h1>
        <p>${cardData.card_faces[i].type_line}</p>
        <div>
            <p>${cardData.card_faces[i].oracle_text}</p>
        </div>
        <div class="flavorBox" id="${i}">
        ${'flavor_text' in cardData.card_faces[i] ?`
            <p class="flavortext">${cardData.card_faces[i].flavor_text}</p>
        `:``}
        </div>
        ${'power' in cardData ?`
        <p>${cardData.card_faces[i].power}/${cardData.card_faces[i].toughness}</p>
        `:``}`
    }
    var Info = document.createElement('section')
    Info.id = "cardInfo"
        Info.innerHTML=`
            ${'card_faces' in cardData ? `
            <section id="cardbox">${'split' == cardData.layout ? `
            <img id="singlecard" src=${cardData.image_uris.normal}>
        `:`<div class="doublefacedcard" id="singlecard">
                    <img class="overlayfrontFace" src=${cardData.card_faces[0].image_uris.normal}>
                    <img class="overlaybackSide" src=${cardData.card_faces[1].image_uris.normal}>
                </div>
                <button class="flipbtn">flip</button>
            `}
            </section>
            <section id="textbox">
                <div id="frontFaceText">
                    ${generateTextBoxHTML(0)}
                </div>
                <div id="backSideText">
                    ${generateTextBoxHTML(1)}
                </div>
                <p id="artist">Illustrated by ${cardData.artist}</p>
            </section>
        `:`
            <section id="cardbox">
            <img id="singlecard" src=${cardData.image_uris.normal}>
            </section>
            <section id="textbox">
                <h1>${cardData.name}</h1>
                <p>${cardData.type_line}</p>
                <div>
                    <p>${cardData.oracle_text}</p>
                </div>
                <div class="flavorBox">
                ${'flavor_text' in cardData ?`
                    <p class="flavortext">${cardData.flavor_text}</p>
                `:``}
                </div>
                ${'power' in cardData ?`
                    <p>${cardData.power}/${cardData.toughness}</p>
                `:``}
            <p id="artist">Illustrated by ${cardData.artist}</p>
            </section>
            `}
        <section id="altbox">
            ${jsonData.data.map((card) => `<button id="${card.id}">${card.set_name} #${card.collector_number}</button>`).join('')}
        </section>
        `
        modal.append(Info)
        setflip()

        for (let object of jsonData.data){
            switchinfo = document.getElementById(object.id)
            switchinfo.addEventListener('mouseover', function(){

            })
            switchinfo.addEventListener('click', function(){
                changeinfo(object)
            })
        }
        function changeinfo(obj){
            var cardart = document.getElementById('singlecard')
            var artistName = document.getElementById('artist')
            var flavorBox = document.querySelectorAll('.flavorBox')


            if(cardart.hasChildNodes()){
                cardart.innerHTML = `
                <img class="overlayfrontFace" src=${obj.card_faces[0].image_uris.normal}>
                <img class="overlaybackSide" src=${obj.card_faces[1].image_uris.normal}>
                `
            }else{
                cardart.setAttribute('src', obj.image_uris.normal,)
            }
            
            artistName.innerText=`Illustrated by ${obj.artist}`

            if(flavorBox.length > 1){
                flavorBox.forEach(box => {
                    var flavorText = box.querySelector('.flavortext');
                    if (!obj.card_faces[box.id].flavor_text) {
                        if(flavorText){
                            flavorText.innerHTML = ''; // Clear flavor text if it doesn't exist
                        }
                    }else{
                        if(flavorText){
                            flavorText.innerHTML = `${obj.card_faces[box.id].flavor_text}`;
                        }else{
                            flavorText = document.createElement('p');
                            flavorText.classList.add('flavortext');
                            flavorText.setAttribute('id', `${box.id}`)
                            flavorText.innerHTML=`${obj.card_faces[box.id].flavor_text}`
                            box.appendChild(flavorText);
                        }
                    }
                })
            } else {
                flavorBox.forEach(box => {
                    var flavorText = box.querySelector('.flavortext');
                    if (!obj.flavor_text) {
                        if(flavorText){
                            flavorText.innerHTML = ''; // Clear flavor text if it doesn't exist
                        }
                    }else {
                        if(flavorText){
                            flavorText.innerHTML = `${obj.flavor_text}`;
                        }else{
                            flavorText = document.createElement('p');
                            flavorText.classList.add('flavortext');
                            flavorText.innerHTML=`${obj.flavor_text}`
                            box.appendChild(flavorText);
                        }
                    }
                });
            }
    }
}
