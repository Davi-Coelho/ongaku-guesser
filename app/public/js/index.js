let trackName = ''
let allTracks = []
let guesses = 1

const guess = document.querySelector('#guess')
const guessForm = document.querySelector('#guess-form')
const playButton = document.querySelector('.play-button')
const skipButton = document.querySelector('#skip-button')
const music = document.querySelector('#music')
const progressBar = document.getElementById('progress-bar')
const audio = document.querySelector('#music')
const finished = document.querySelector('#finished')
const player = document.querySelector('#player')
const guessesDiv = document.querySelector('#guesses')
const rightAnswer = document.querySelector('#right-answer')
const wrongAnswer = document.querySelector('#wrong-answer')

playButton.onclick = playPause
skipButton.onclick = skipTime
music.ontimeupdate = progressBarUpdate
guess.onkeyup = tryGuess

function tryGuess(e) {

    if (guess.value.length > 5) {
        if (e.keyCode === 13) {

            const guessesSpan = document.querySelector(`#guess-${guesses}`)

            if (guess.value === trackName) {
                guesses = 6
                playPause()
                guessesSpan.style.color = 'green'
                guessesSpan.innerHTML = '<i class="fas fa-check"></i> ' + guess.value
                const result = document.createElement('div')
                result.classList.add('result')
                result.innerHTML = `<p>Parabéns, você acertou!!! </p>
                                    <p>Música: ${trackName}</p>`
                finished.insertBefore(result, finished.firstChild)
                rightAnswer.style.display = 'block'
                finished.style.display = 'block'
                guessForm.style.display = 'none'
                player.style.display = 'none'
                localStorage.setItem('answer', true)
                localStorage.setItem('guessed', `${new Date().toLocaleDateString('pt-BR')}`)
            }
            else {
                guessesSpan.style.color = 'red'
                guessesSpan.innerHTML = '<i class="fas fa-times"></i> ' + guess.value
                guess.value = ''
                guesses++

                if (guesses === 7) {
                    const result = document.createElement('div')
                    result.classList.add('result')
                    result.innerHTML = `<p>Você errou! :( </p>
                                        <p>Música: ${trackName}</p>`
                    finished.insertBefore(result, finished.firstChild)
                    wrongAnswer.style.display = 'block'
                    finished.style.display = 'block'
                    guessForm.style.display = 'none'
                    player.style.display = 'none'
                    localStorage.setItem('answer', false)
                    localStorage.setItem('guessed', `${new Date().toLocaleDateString('pt-BR')}`)
                }
            }
        }
    }
}

function playPause() {
    music.currentTime = 0
    if (music.paused) {
        music.play()
    }
    else {
        music.pause()
    }
}

function skipTime() {
    if (guesses < 6) {
        const skipSpan = document.querySelector(`#guess-${guesses}`)
        skipSpan.style.color = 'red'
        skipSpan.innerHTML = '<i class="fas fa-times"></i> SKIPPED '
        guesses++
        playPause()
    }
}

function progressBarUpdate() {

    progressBar.style.width = (music.currentTime / (music.duration - 15)) * 450 + 'px'

    if (Math.floor(music.currentTime) === 1 && guesses === 1) {
        playPause()
    }
    else if (Math.floor(music.currentTime) === 2 && guesses === 2) {
        playPause()
    }
    else if (Math.floor(music.currentTime) === 4 && guesses === 3) {
        playPause()
    }
    else if (Math.floor(music.currentTime) === 6 && guesses === 4) {
        playPause()
    }
    else if (Math.floor(music.currentTime) === 10 && guesses === 5) {
        playPause()
    }
    else if (Math.floor(music.currentTime) === 15 && guesses === 6) {
        playPause()
    }
}

window.onload = () => {
    const today = new Date().toLocaleDateString('pt-BR')
    const guessed = localStorage.getItem('guessed')

    if (guessed && guessed === today) {
        const answer = localStorage.getItem('answer')
        const el = document.createElement('span')

        if (answer === 'true') {
            el.innerHTML = 'Você acertou a música de hoje!'
            rightAnswer.style.display = 'block'
        }
        else {
            el.innerHTML = 'Você errou a música de hoje!'
            wrongAnswer.style.display = 'block'
        }

        el.classList.add('finished-result')
        finished.insertBefore(el, finished.firstChild)
        finished.style.display = 'flex'
        guessForm.style.display = 'none'
        guessesDiv.style.display = 'none'
        player.style.display = 'none'
    }
    else {
        music.volume = 0.7
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
}