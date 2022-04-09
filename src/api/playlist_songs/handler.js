class PlaylistSongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistSongsHandler = this.postPlaylistSongsHandler.bind(this);
    this.getSongsPlaylistHandler = this.getSongsPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistByIdHandler =
      this.deleteSongFromPlaylistByIdHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
  }

  async postPlaylistSongsHandler({ payload, params, auth }, h) {
    this._validator.validatePlaylistSongsPayload(payload);
    const { id: credentialId } = auth.credentials;
    const { id: playlistId } = params;
    const { songId } = payload;

    await this._service.checkSongExist(songId);
    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.checkSongAndPlaylistExist(playlistId, songId);

    const songIdPlaylist = await this._service.addPlaylistSongs(
      playlistId,
      songId
    );

    await this._service.addPlaylistSongActivities(
      playlistId,
      songId,
      credentialId,
      'add'
    );
    const response = h.response({
      status: 'success',
      message: 'Playlist songs berhasil ditambahkan',
      data: {
        songId: songIdPlaylist,
      },
    });

    response.code(201);
    return response;
  }

  async getSongsPlaylistHandler({ params, auth }, h) {
    const { id: playlistId } = params;
    const { id: credentialId } = auth.credentials;

    const playlist = await this._service.verifyPlaylistOwner(
      playlistId,
      credentialId
    );
    playlist.songs = await this._service.getSongsPlaylist(playlistId);
    const response = h.response({
      status: 'success',
      message: 'Playlist songs berhasil ditambahkan',
      data: {
        playlist,
      },
    });

    response.code(200);
    return response;
  }

  async deleteSongFromPlaylistByIdHandler({ payload, params, auth }, h) {
    this._validator.validatePlaylistSongsPayload(payload);
    const { id: playlistId } = params;
    const { id: credentialId } = auth.credentials;
    const { songId } = payload;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteSongFromPlaylistById(playlistId, songId);
    await this._service.addPlaylistSongActivities(
      playlistId,
      songId,
      credentialId,
      'delete'
    );

    const response = h.response({
      status: 'success',
      message: 'Lagu dihapus dari playlist',
    });

    response.code(200);
    return response;
  }

  async deletePlaylistByIdHandler({ params, auth }, h) {
    const { id: credenttialId } = auth.credentials;
    const { id: playlistId } = params;

    await this._service.verifyDeletePlaylistOwner(playlistId, credenttialId);
    await this._service.deletePlaylistById(playlistId);
    await this._service.deletePlaylistActivitiesById(playlistId);

    const response = h.response({
      status: 'success',
      message: 'Playlist dihapus',
    });

    response.code(200);
    return response;
  }
}

module.exports = PlaylistSongsHandler;
