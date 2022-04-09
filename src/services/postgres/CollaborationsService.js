/* eslint-disable quotes */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaborations({ playlistId, userId }) {
    const id = `collaboration-${nanoid(6)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Collaborations gagal ditambahkan ke playlist');
    }

    return rows[0].id;
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deleteCollaborationByPlaylistIdUserId(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Collaboration tidak ditemukan');
    }
  }

  async checkUserCollaborationExist(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };
    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('User collaboration tidak ditemukan');
    }
  }
}

module.exports = CollaborationsService;
