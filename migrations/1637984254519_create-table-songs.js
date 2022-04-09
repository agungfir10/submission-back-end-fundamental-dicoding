exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    title: {
      type: 'varchar(255)',
      nontNull: true,
    },
    year: {
      type: 'integer',
      nontNull: true,
    },
    performer: {
      type: 'varchar(255)',
      nontNull: true,
    },
    genre: {
      type: 'varchar(255)',
      nontNull: true,
    },
    duration: {
      type: 'integer',
      nontNull: true,
    },
    inserted_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
