class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
  }

  async postPlaylistHandler({ payload, auth }, h) {
    this._validator.validatePlaylistPayload(payload);
    const { id: credentialId } = auth.credentials;
    const { name } = payload;

    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlists berhasil ditambahkan',
      data: {
        playlistId,
      },
    });

    response.code(201);
    return response;
  }

  async getPlaylistsHandler({ auth }) {
    const { id: owner } = auth.credentials;
    const playlists = await this._service.getPlaylists(owner);
    return {
      status: 'success',
      data: { playlists },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
