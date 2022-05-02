let guesses = 0

const playPauseButton = document.querySelector('#play-pause-button')
const music = document.querySelector('#music')
const progressBar = document.getElementById('progress-bar')

playPauseButton.onclick = playPause
music.ontimeupdate = progressBarUpdate

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

    if (Math.floor(music.currentTime) === 1 && guesses === 0) {
        console.log('1')
        playPause()
    }
    else if (Math.floor(music.currentTime) === 2 && guesses === 1) {
        console.log('2')
        playPause()
    }
    else if (Math.floor(music.currentTime) === 4 && guesses === 2) {
        console.log('4')
        playPause()
    }
    else if (Math.floor(music.currentTime) === 6 && guesses === 3) {
        console.log('6')
        playPause()
    }
    else if (Math.floor(music.currentTime) === 10 && guesses === 4) {
        console.log('10')
        playPause()
    }
    else if (Math.floor(music.currentTime) === 15 && guesses === 5) {
        console.log('15')
        playPause()
    }
}