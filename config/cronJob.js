require('dotenv').config()
const cron = require('node-cron')
const { CurrentTrackModel } = require('../config/dbConnection')
const CurrentTrack = require('../app/models/CurrentTrackDAO')()
const { PlaylistModel } = require('../config/dbConnection')
const Playlist = require('../app/models/PlaylistDAO')()

cron.schedule('0 0 * * *', updateMusic, {
    scheduled: true,
    timezone: 'America/Sao_Paulo'
})

async function updateMusic() {

    console.log('Updating...')

    const CurrentTrackDAO = new CurrentTrack(CurrentTrackModel)
    const PlaylistDAO = new Playlist(PlaylistModel)
    const playlists = await PlaylistDAO.getPlaylists()
    const playlist = playlists[Math.floor(Math.random() * playlists.length)]
    const tracks = playlist.tracks
    const track = tracks[Math.floor(Math.random() * tracks.length)]

    CurrentTrackDAO.updateCurrentTrack(track, (result) => {
        console.log('Current Song updated!')
    })
}   