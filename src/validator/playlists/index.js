const { PlaylistPayloadSchema } = require('./schema');
const ClientError = require('../../exceptions/ClientError');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
