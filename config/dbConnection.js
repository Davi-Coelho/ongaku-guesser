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

const CurrentTrackSchema = mongoose.Schema({
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
    }
})

const AccessTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    }
})

const PlaylistModel = mongoose.model('playlists', PlaylistSchema)
const CurrentTrackModel = mongoose.model('currenttrack', CurrentTrackSchema)
const AccessTokenModel = mongoose.model('accesstoken', AccessTokenSchema)

module.exports = { PlaylistModel, CurrentTrackModel, AccessTokenModel }