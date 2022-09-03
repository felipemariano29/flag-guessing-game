window.addEventListener('DOMContentLoaded', countries())

const   flag                =   document.getElementById('flag'),
        gameScreen          =   document.getElementById('game'),
        gameOverScreen      =   document.getElementById('gameOver'),
        victoryScreen       =   document.getElementById('victory'),
        menuScreen          =   document.getElementById('menu'),
        closeModalBtn       =   document.getElementById('closeModal'),
        startBtn            =   document.getElementById('start'),
        submitBtn           =   document.getElementById('submit'),
        playAgainBtn        =   document.getElementById('playAgain'),
        startOverBtn        =   document.getElementById('startOver'),
        errorModal          =   document.getElementById('errorModal'),
        blur                =   document.getElementById('blur'),
        answers             =   document.querySelectorAll('.answer'),
        rightAnswers        =   document.querySelector('.rightAnswers'),
        img                 =   document.createElement('img')
let     randomNumber        ,
        randomCountry       ,
        randomFlag          ,
        randomArr           ,
        sameRegion          ,
        countriesSameRegion ,
        answer              ,
        correct      = 0    ,
        allCountries = []   ,
        Data         = []

async function countries() {
    const   results = await fetch('https://restcountries.com/v3.1/all'),
            data    = await results.json()
    gamePrepare(data)
}

function gamePrepare(data) {
    if(Data.length < 1) {
        Data.push(data)
        Data = Data[0]
    }
    try {
        randomNumber = getRandomNumber(Data)
        randomCountry = Data[randomNumber].name.common
        if(!allCountries.includes(randomCountry)) {
            game(Data)
            allCountries.push(randomCountry)
        } else {
            gamePrepare(data)
        }
    } catch {
        view(gameScreen, 'none')
        view(victoryScreen, 'flex')
        correct = 0
    }
    
}

function game(data) {
    randomFlag          = data[randomNumber].flags.png
    sameRegion          = data[randomNumber].region
    countriesSameRegion = (getCountriesSameRegion(sameRegion, data)).sort(() => Math.random() - 0.5)

    prepareAnswers()

    for(let z = 0; z < answers.length - 1; z++) answers[randomArr[z]].innerHTML = countriesSameRegion[z]

    answers[empty(answers)].innerHTML = data[randomNumber].name.common
}

function getCountriesSameRegion(region, data) {
    let countriesArr = []
    for(j in data) {
        if(data[j].region === region && data[j].name.common != randomCountry) {
            countriesArr.push(data[j].name.common)
        }
    }
    return countriesArr
}

function prepareAnswers() {
    randomArr = (Object.keys(answers)).sort(() => Math.random() - 0.5)
    answers.forEach(a => {
        a.addEventListener('click', (e) => {
            let clicked = e.target
            answers.forEach((innerE) => {
                if(innerE === clicked) {
                    innerE.classList.add('selected')
                } else {
                    innerE.classList.remove('selected')
                }
            })
            answer = clicked.innerHTML
        })
    })
    changeFlag(randomFlag)
}

function changeFlag(newFlag) {
    img.src = newFlag
    flag.appendChild(img)
}

function getRandomNumber(arr) {
    return Math.floor(Math.random() * arr.length)
}

function empty(arr) {
    for(let j = 0; j < arr.length; j++) {
        if(arr[j].innerHTML === '') {
            return j
        }
    }
}

function next() {
    view(gameOverScreen, 'none')
    view(errorModal, 'none')
    answers.forEach((a) => {
        a.classList.remove('selected')
        a.innerHTML = ''
    })
    gamePrepare(Data)
}

function view(tela, modo) {
    return tela.style.display = modo
}

startBtn.addEventListener('click', () => {
    answer = ''
    view(submit, 'block')
    view(gameScreen, 'flex')
    view(menuScreen, 'none')
    view(start, 'none')
    view(errorModal, 'none')
})

submitBtn.addEventListener('click', () => {
    if(answer != '') {
        if(randomCountry === answer) {
            correct++
            next()
        } else {
            allCountries = []
            if(correct === 1) {
                rightAnswers.innerHTML = `You got ${correct} right question!`
            } else {
                rightAnswers.innerHTML = `You got ${correct} right questions!`
            }
            
            view(gameScreen, 'none')
            view(gameOverScreen, 'flex')
        }
        answer = ''
    } else {
        view(blur, 'block')
        view(errorModal, 'block')
    }
})

playAgainBtn.addEventListener('click', () => {
    view(gameScreen, 'flex')
    correct = 0
    next()
})

startOverBtn.addEventListener('click', () => document.location.reload())

closeModalBtn.addEventListener('click', () => {
    view(blur, 'none')
    view(errorModal, 'none')
})