exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(200)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
    },
  });

  pgm.addConstraint('playlists', 'FK_Playlists_Users', {
    foreignKeys: {
      columns: ['owner'],
      references: 'users(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');

  pgm.dropConstraint('playlists', 'FK_Playlists_Users');
};
