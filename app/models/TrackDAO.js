class TrackDAO {
    constructor(TrackModel) {
        this._TrackModel = TrackModel
    }

    getCurrentTrack = async (date) => {
        const currenTrack = await this._TrackModel.find({ date: date })
        return currenTrack[0]
    }

    insertNewTrack = (track, callback) => {
        this._TrackModel.create({
            id: track.id,
            name: track.name,
            artist: track.artist,
            url: track.url,
            date: new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        }).then(result => {
            console.log(result)
            callback()
        })
    }

}

module.exports = () => {
    return TrackDAO
}