class CurrentTrackDAO {
    constructor(CurrentTrackModel) {
        this._CurrentTrackModel = CurrentTrackModel
    }

    getCurrentTrack = async () => {
        const currenTrack = await this._CurrentTrackModel.find({})
        return currenTrack[0]
    }

    updateCurrentTrack = (track, callback) => {
        this._CurrentTrackModel.find({}).then(result => {
            if (result.length !== 0) {
                this._CurrentTrackModel.updateOne({
                    id: result[0].id
                }, 
                {
                    $set: {
                        id: track.id,
                        name: track.name,
                        artist: track.artist,
                        url: track.url
                    }
                }).then(result => {
                    console.log(result)
                    callback()
                })
            }
            else {
                this._CurrentTrackModel.create({
                    id: track.id,
                    name: track.name,
                    artist: track.artist,
                    url: track.url
                }).then(result => {
                    console.log(result)
                    callback()
                })
            }
        })
    }

}

module.exports = () => {
    return CurrentTrackDAO
}