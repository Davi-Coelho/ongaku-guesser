module.exports = (application) => {
    application.get('/', (req, res) => {
        application.app.controllers.index.index(application, req, res)
    })

    application.post('/playlist', (req, res) => {
        application.app.controllers.index.insertPlaylist(application, req, res)
    })
}