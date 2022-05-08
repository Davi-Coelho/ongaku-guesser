module.exports = (application) => {
    application.get('/', (req, res) => {
        application.app.controllers.index.index(application, req, res)
    })

    application.get('/currentsong', (req, res) => {
        application.app.controllers.index.getSong(application, req, res)
    })

    application.get('/alltracks', (req, res) => {
        application.app.controllers.index.getAllTracks(application, req, res)
    })

    application.post('/playlist', (req, res) => {
        application.app.controllers.index.insertPlaylist(application, req, res)
    })

    application.put('/currentsong', (req, res) => {
        application.app.controllers.index.updateSong(application, req, res)
    })
}