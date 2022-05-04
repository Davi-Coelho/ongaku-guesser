require('dotenv').config()
const cron = require('node-cron')
const { PlaylistModel } = require('../config/dbConnection')
const Playlist = require('../app/models/PlaylistDAO')()
const { CurrentTrackModel } = require('../config/dbConnection')

cron.schedule('0 0 * * *', updateMusic, {
    scheduled: true,
    timezone: 'America/Sao_Paulo'
})

async function updateMusic() {

    console.log('Updating...')
    const PlaylistDAO = new Playlist(PlaylistModel)
    const playlists = await PlaylistDAO.getPlaylists()
    const playlist = playlists[Math.floor(Math.random() * playlists.length)]
    const tracks = playlist.tracks
    const track = tracks[Math.floor(Math.random() * tracks.length)]
    
    CurrentTrackModel.find({}).then(response => {
        if (response.length !== 0) {
            CurrentTrackModel.updateOne({
                id: response[0].id
            }, 
            {
                $set: {
                    id: track.id,
                    name: track.name,
                    artist: track.artist,
                    url: track.url
                }
            }).then(response => {
                console.log(response)
            })
        }
        else {
            CurrentTrackModel.create({
                id: track.id,
                name: track.name,
                artist: track.artist,
                url: track.url
            }).then(response => {
                console.log(response)
            })
        }
    })
}   