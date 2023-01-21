require('dotenv').config()
const mongoose = require('mongoose')

const {
    DB,
    DB_USER,
    DB_PASS
} = process.env

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

async function initDatabase() {
    try {
        await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@mongo:27017/${DB}?authSource=admin`)
        console.log('Conectado ao banco de dados!')
    } catch (err) {
        console.log(`mongoConnectError: ${err}`)
    }
}

initDatabase()

module.exports = { PlaylistModel, TrackModel, AccessTokenModel }