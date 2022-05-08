require('dotenv').config()
const cron = require('node-cron')
const { TrackModel } = require('../config/dbConnection')
const Track = require('../app/models/TrackDAO')()
const { PlaylistModel } = require('../config/dbConnection')
const Playlist = require('../app/models/PlaylistDAO')()

cron.schedule('0 0 * * *', updateMusic, {
    scheduled: true,
    timezone: 'America/Sao_Paulo'
})

async function updateMusic() {

    console.log('Updating...')

    const TrackDAO = new Track(TrackModel)
    const PlaylistDAO = new Playlist(PlaylistModel)
    const playlists = await PlaylistDAO.getPlaylists()
    const playlist = playlists[Math.floor(Math.random() * playlists.length)]
    const tracks = playlist.tracks
    const track = tracks[Math.floor(Math.random() * tracks.length)]

    TrackDAO.insertNewTrack(track, (result) => {
        console.log('Current Song updated!')
    })
}   