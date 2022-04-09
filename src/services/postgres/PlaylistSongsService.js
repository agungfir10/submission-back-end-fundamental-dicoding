/* eslint-disable quotes */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongs(playlistId, songId) {
    const id = `playlist-songs-${nanoid(6)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING song_id',
      values: [id, playlistId, songId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Song gagal ditambahkan ke playlist');
    }

    return rows[0].song_id;
  }

  async deleteSongFromPlaylistById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(
        'Lagu gagal di hapus dari playlist. lagu tidak ditemukan'
      );
    }
  }

  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(
        'Playlist gagal di hapus dari playlist. playlist tidak ditemukan'
      );
    } else {
      const queryDeleteSongsWithPlaylistId = {
        text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 RETURNING id',
        values: [playlistId],
      };
      await this._pool.query(queryDeleteSongsWithPlaylistId);
    }
  }

  async deletePlaylistSongsByPlaylistId(playlistId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 RETURNING id',
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError(
        'Playlist songs gagal di hapus dari playlist. playlist songs tidak ditemukan'
      );
    }
  }

  async getSongsPlaylist(playlistId) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM playlist_songs LEFT JOIN songs ON playlist_songs.song_id = songs.id WHERE playlist_id = $1',
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw NotFoundError('Playlist tidak ditemukan');
    }

    return rows;
  }

  async checkSongExist(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, playlists.owner, users.username, collaborations.user_id FROM playlists LEFT JOIN users ON playlists.owner = users.id LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id WHERE playlists.id = $1 OR collaborations.user_id = $2',
      values: [id, owner],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = rows[0];

    if (playlist.owner !== owner) {
      if (playlist.user_id !== owner) {
        throw new AuthorizationError(
          'Anda tidak berhak mengakses resource ini'
        );
      }
    }

    return rows[0];
  }

  async verifyDeletePlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, playlists.owner, users.username, collaborations.user_id FROM playlists LEFT JOIN users ON playlists.owner = users.id LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id WHERE playlists.id = $1 OR collaborations.user_id = $2',
      values: [id, owner],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async checkSongAndPlaylistExist(playlistId, songId) {
    const query = {
      text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id =  $2',
      values: [playlistId, songId],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      throw new ClientError('Lagu sudah tersimpan di playlist');
    }
  }

  async addPlaylistSongActivities(playlistId, songId, userId, action) {
    const id = `playlist-song-activity-${nanoid(6)}`;
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5)',
      values: [id, playlistId, songId, userId, action],
    };
    await this._pool.query(query);
  }

  async deletePlaylistActivitiesById(playlistId) {
    const query = {
      text: 'DELETE FROM playlist_song_activities WHERE playlist_id = $1',
      values: [playlistId],
    };

    await this._pool.query(query);
  }
}

module.exports = PlaylistSongsService;
