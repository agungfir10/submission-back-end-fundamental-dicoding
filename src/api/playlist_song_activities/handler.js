class PlaylistSongActivitiesHandler {
  constructor(service) {
    this._service = service;

    this.getPlaylistSongActivitiesHandler =
      this.getPlaylistSongActivitiesHandler.bind(this);
  }

  async getPlaylistSongActivitiesHandler({ params, auth }) {
    const { id } = params;
    const { id: credentialId } = auth.credentials;

    await this._service.verifyPlaylistSongActivities(id, credentialId);
    const playlistSongActivities =
      await this._service.getPlaylistSongActivities(id);

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities: playlistSongActivities,
      },
    };
  }
}

module.exports = PlaylistSongActivitiesHandler;
