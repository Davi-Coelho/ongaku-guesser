require('dotenv').config()
const axios = require('axios')

module.exports.index = async (application, req, res) => {

    res.render('index')
}

module.exports.insertPlaylist = (application, req, res) => {

    const AccessTokenModel = application.db.AccessTokenModel
    AccessTokenModel.findOne({}).then(result => {
        const accessToken = result.token
        const playlistId = req.query.id

        axios.get(`https://api.spotify.com/v1/playlists/${playlistId}?market=BR`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(result => {
            const playlistName = result.data.name
            const allTracks = result.data.tracks.items
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
            console.log('err1:' + err)
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
                    }).then(result => {

                        const newToken = result.data.access_token
                        console.log(newToken)

                        AccessTokenModel.updateOne(
                            {
                                token: accessToken
                            },
                            {
                                $set: {
                                    token: newToken
                                }
                            }).then(result => {
                                console.log(result)
                                axios.get(`https://api.spotify.com/v1/playlists/${playlistId}?market=BR`, {
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${newToken}`
                                    }
                                }).then(result => {
                                    const playlistName = result.data.name
                                    const allTracks = result.data.tracks.items
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

module.exports.getSong = async (application, req, res) => {

    const today = req.query.date
    const TrackDAO = new application.app.models.TrackDAO(application.db.TrackModel)
    const trackData = await TrackDAO.getCurrentTrack(today)
    const data = {
        trackName: `${trackData.artist} - ${trackData.name}`,
        trackUrl: trackData.url
    }

    res.send(data)
}

module.exports.getAllTracks = async (application, req, res) => {

    const PlaylistDAO = new application.app.models.PlaylistDAO(application.db.PlaylistModel)
    const playlists = await PlaylistDAO.getPlaylists()
    const playlistTracks = playlists.map(el => el.tracks)
    let allTracks = []
    playlistTracks.forEach(el => allTracks = allTracks.concat(el))
    allTracks = allTracks.map(el => `${el.artist} - ${el.name}`)

    res.send(allTracks)
}

module.exports.updateSong = async (application, req, res) => {

    const today = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo'})
    const TrackDAO = new application.app.models.TrackDAO(application.db.TrackModel)
    const PlaylistDAO = new application.app.models.PlaylistDAO(application.db.PlaylistModel)

    const playlists = await PlaylistDAO.getPlaylists()
    const playlist = playlists[Math.floor(Math.random() * playlists.length)]
    const allRaffledTracks = await TrackDAO.getRaffledTracks()
    const tracks = playlist.tracks.filter(el1 => {
        return !allRaffledTracks.some(el2 => {
            return el1.id == el2.id;
        });
    });

    const track = tracks[Math.floor(Math.random() * tracks.length)]

    TrackDAO.insertNewTrack(track, today, () => {
        res.sendStatus(200)
    })
}
