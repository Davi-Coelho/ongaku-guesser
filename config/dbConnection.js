const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/ongakuguesser')
    .then(() => console.log('Conectado ao banco de dados!'))
    .catch(() => console.log('Erro ao se conectar com o banco de dados!'))

const PlaylistSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    tracks: [
        {
            id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            artist: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            image_url: {
                type: String
            }
        }
    ]
})

const TrackSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

const AccessTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    }
})

const PlaylistModel = mongoose.model('playlists', PlaylistSchema)
const TrackModel = mongoose.model('tracks', TrackSchema)
const AccessTokenModel = mongoose.model('accesstoken', AccessTokenSchema)

module.exports = { PlaylistModel, TrackModel, AccessTokenModel }