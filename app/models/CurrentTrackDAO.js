class CurrentTrackDAO {
    constructor(CurrentTrackModel) {
        this._CurrentTrackModel = CurrentTrackModel
    }

    getCurrentTrack = async () => {
        const currenTrack = await this._CurrentTrackModel.find({})
        return currenTrack[0]
    }

}

module.exports = () => {
    return CurrentTrackDAO
}