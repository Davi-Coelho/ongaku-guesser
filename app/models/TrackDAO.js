class TrackDAO {
    constructor(TrackModel) {
        this._TrackModel = TrackModel
    }

    getCurrentTrack = async (date) => {
        return await this._TrackModel.findOne({ date: date })
    }

    getRaffledTracks = async () => {
        return await this._TrackModel.find({})
    }

    insertNewTrack = (track, today, callback) => {
        this._TrackModel.findOne({ date: today }).then(result => {
            
            if (result) {
                this._TrackModel.updateOne({
                    id: result.id
                }, 
                {
                    $set: {
                        id: track.id,
                        name: track.name,
                        artist: track.artist,
                        url: track.url,
                        date: today
                    }
                }).then(result => {
                    console.log(result)
                    callback()
                })
            }
            else {
                this._TrackModel.create({
                    id: track.id,
                    name: track.name,
                    artist: track.artist,
                    url: track.url,
                    date: today
                }).then(result => {
                    console.log(result)
                    callback()
                })
            }
        })
    }

}

module.exports = () => {
    return TrackDAO
}