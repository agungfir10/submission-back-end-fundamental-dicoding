exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
    },
    user_id: {
      type: 'VARCHAR(50)',
    },
  });

  pgm.addConstraint('collaborations', 'FK_Collaboration_Playlists', {
    foreignKeys: {
      columns: ['playlist_id'],
      references: 'playlists(id)',
    },
  });

  pgm.addConstraint('collaborations', 'FK_Collaboration_Users', {
    foreignKeys: {
      columns: ['user_id'],
      references: 'users(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');

  pgm.dropConstraint('collaborations', 'FK_Collaboration_Playlists');

  pgm.dropConstraint('collaborations', 'FK_Collaboration_Users');
};
