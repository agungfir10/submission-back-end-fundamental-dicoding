exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
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
    user_id: {
      type: 'VARCHAR(50)',
    },
    action: {
      type: 'VARCHAR(50)',
    },
    time: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint(
    'playlist_song_activities',
    'FK_PlaylistSongActivities_Playlist',
    {
      foreignKeys: {
        columns: ['playlist_id'],
        references: 'playlists(id)',
        onDelete: 'cascade',
      },
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');

  pgm.dropConstraint(
    'playlist_song_activities',
    'FK_PlaylistSongActivities_Playlist'
  );
};
