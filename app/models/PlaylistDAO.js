class PlaylistDAO {
    constructor(PlaylistModel) {
        this._PlaylistModel = PlaylistModel
    }

    insertPlaylist = (id, name, tracks) => {
        this._PlaylistModel.create({
            id: id,
            name: name,
            tracks: tracks
        })
    }

    getPlaylists = async () => {
        return await this._PlaylistModel.find({})
    }

}

module.exports = () => {
    return PlaylistDAO
}