let trackName = ''
let allTracks = []
let guesses = 1

const guess = document.querySelector('#guess')
const guessForm = document.querySelector('#guess-form')
const playPauseButton = document.querySelector('#play-pause-button')
const music = document.querySelector('#music')
const progressBar = document.getElementById('progress-bar')
const modal = document.querySelector('#myModal')
const modalSpan = document.querySelector('.close')
const audio = document.querySelector('#music')

playPauseButton.onclick = playPause
music.ontimeupdate = progressBarUpdate
guess.onkeyup = tryGuess
modalSpan.onclick = () => {
    modal.style.display = 'none'
}

window.onclick = (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
    }
}

function tryGuess(e) {

    if (guess.value.length > 5) {
        if (e.keyCode === 13) {

            if (guess.value === trackName) {
                console.log('Acertou')
                modal.style.display = 'block'
            }
            else {
                document.querySelector(`#guess-${guesses}`).innerHTML = guess.value
                guess.value = ''
                guesses++
            }
        }
    }
}

function playPause() {
    music.currentTime = 0
    if (music.paused) {
        playPauseButton.innerHTML = 'Pause'
        music.play()
    }
    else {
        playPauseButton.innerHTML = 'Play'
        music.pause()
    }
}

function progressBarUpdate() {

    progressBar.style.width = (music.currentTime / (music.duration - 15)) * 100 + '%'

    if (Math.floor(music.currentTime) === 1 && guesses === 1) {
        console.log('1')
        playPause()
    }
    else if (Math.floor(music.currentTime) === 2 && guesses === 2) {
        console.log('2')
        playPause()
    }
    else if (Math.floor(music.currentTime) === 4 && guesses === 3) {
        console.log('4')
        playPause()
    }
    else if (Math.floor(music.currentTime) === 6 && guesses === 4) {
        console.log('6')
        playPause()
    }
    else if (Math.floor(music.currentTime) === 10 && guesses === 5) {
        console.log('10')
        playPause()
    }
    else if (Math.floor(music.currentTime) === 15 && guesses === 6) {
        console.log('15')
        playPause()
    }
}


window.onload = () => {
    console.log(localStorage.getItem('guessed'))
    fetch(`/currentsong?date=${new Date().toLocaleDateString('pt-BR')}`)
        .then(response => response.text())
        .then(response => JSON.parse(response))
        .then(data => {
            trackName = data.trackName
            trackUrl = data.trackUrl
            const trackSource = document.createElement('source')
            trackSource.setAttribute('src', trackUrl)
            music.appendChild(trackSource)
        })
    fetch('/alltracks').then(response => response.text())
        .then(data => { 
            allTracks = JSON.parse(data)
            autocomplete(guess, allTracks);
        })
}