const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    let query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, title, year, performer, genre, duration],
    };

    if (albumId) {
      query = {
        text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7) RETURNING id',
        values: [id, title, year, performer, genre, duration, albumId],
      };
    }

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(query) {
    const title = query.title ? query.title : '';
    const performer = query.performer ? query.performer : '';
    const { rows } = await this._pool.query(
      `SELECT id, title, performer FROM songs WHERE title ILIKE '%${title}%' AND performer ILIKE '%${performer}%'`
    );
    return rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, performer, genre, duration, inserted_at AS "insertedAt", updated_at AS "updatedAt" FROM songs WHERE id=$1',
      values: [id],
    };
    const { rowCount, rows } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return rows[0];
  }

  async editSongById(id, { title, year, performer, genre, duration }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = NOW() WHERE id=$6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Lagu gagal diperbarui');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
