/* eslint-disable quotes */
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongActivities(playlistId) {
    const query = {
      text: 'SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time FROM playlist_song_activities INNER JOIN users ON playlist_song_activities.user_id = users.id INNER JOIN songs ON playlist_song_activities.song_id = songs.id WHERE playlist_id = $1',
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw NotFoundError('Playlist tidak ditemukan');
    } else {
      return rows;
    }
  }

  async verifyPlaylistSongActivities(id, owner) {
    const query = {
      text: 'SELECT * FROM playlist_song_activities WHERE playlist_id = $1',
      values: [id],
    };
    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = rows[0];

    if (playlist.user_id !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistSongsService;
