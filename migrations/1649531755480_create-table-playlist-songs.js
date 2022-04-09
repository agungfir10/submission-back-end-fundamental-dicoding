exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
    },
    song_id: {
      type: 'VARCHAR(50)',
    },
  });

  pgm.addConstraint('playlist_songs', 'FK_PlaylistSong_Playlists', {
    foreignKeys: {
      columns: ['playlist_id'],
      references: 'playlists(id)',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('playlist_songs', 'FK_PlaylistSong_Songs', {
    foreignKeys: {
      columns: ['song_id'],
      references: 'songs(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');

  pgm.dropConstraint('playlist_songs', 'FK_PlaylistSong_Playlists');

  pgm.dropConstraint('playlist_songs', 'FK_PlaylistSong_Songs');
};
