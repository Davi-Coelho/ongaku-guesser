require('dotenv').config()
const axios = require('axios')

module.exports.index = async (application, req, res) => {

    const PlaylistDAO = new application.app.models.PlaylistDAO(application.db.PlaylistModel)
    const playlists = await PlaylistDAO.getPlaylists()
    const playlistTracks = playlists.map(el => el.tracks)
    let allTracks = []
    playlistTracks.forEach(el => allTracks = allTracks.concat(el))
    allTracks = allTracks.map(el => `${el.artist} - ${el.name}`)
    const CurrentTrackDAO = new application.app.models.CurrentTrackDAO(application.db.CurrentTrackModel)
    const trackData = await CurrentTrackDAO.getCurrentTrack()
    const trackUrl = trackData.url
    const trackName = `${trackData.artist} - ${trackData.name}`

    res.render('index', { trackName, trackUrl, allTracks })
}

module.exports.insertPlaylist = (application, req, res) => {

    const AccessTokenModel = application.db.AccessTokenModel
    AccessTokenModel.findOne({}).then(response => {
        const accessToken = response.token
        const playlistId = req.query.id
    
        axios.get(`https://api.spotify.com/v1/playlists/${playlistId}?market=BR`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(response => {
            const playlistName = response.data.name
            const allTracks = response.data.tracks.items
            const tracksWithPreview = allTracks.filter(el => el.track.preview_url !== null)
            const tracks = tracksWithPreview.map(el => {
                return {
                    id: el.track.id,
                    name: el.track.name,
                    artist: el.track.artists[0].name,
                    url: el.track.preview_url
                }
            })
            const PlaylistDAO = new application.app.models.PlaylistDAO(application.db.PlaylistModel)
            PlaylistDAO.insertPlaylist(playlistId, playlistName, tracks)
        }).catch(err => {
            console.log('err1: ' + err)
            if (err.response.status === 401) {

                const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
                const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
                const body = new URLSearchParams()
                body.append('grant_type', 'client_credentials')

                axios.post('https://accounts.spotify.com/api/token', body,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
                    }
                }).then(response => {

                    const newToken = response.data.access_token
                    console.log(newToken)
                    
                    AccessTokenModel.updateOne(
                    {
                        token: accessToken 
                    }, 
                    {
                        $set: {
                            token: newToken
                        }
                    }).then(response => {
                        console.log(response)
                        axios.get(`https://api.spotify.com/v1/playlists/${playlistId}?market=BR`, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${newToken}`
                            }
                        }).then(response => {
                            const playlistName = response.data.name
                            const allTracks = response.data.tracks.items
                            const tracksWithPreview = allTracks.filter(el => el.track.preview_url !== null)
                            const tracks = tracksWithPreview.map(el => {
                                return {
                                    id: el.track.id,
                                    name: el.track.name,
                                    artist: el.track.artists[0].name,
                                    url: el.track.preview_url
                                }
                            })
                            const PlaylistDAO = new application.app.models.PlaylistDAO(application.db.PlaylistModel)
                            PlaylistDAO.insertPlaylist(playlistId, playlistName, tracks)
                        }).catch(err => {
                            console.log(err)
                        })
                    })
                }).catch(err => {
                    console.log('err2: ' + err)
                })
            }
        })
        res.sendStatus(200)
    })
}