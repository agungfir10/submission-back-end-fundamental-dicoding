class CollaborationsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationByPlaylistIdHandler =
      this.deleteCollaborationByPlaylistIdHandler.bind(this);
  }

  async postCollaborationHandler({ payload, auth }, h) {
    this._validator.validateCollaborationsPayload(payload);
    const { id: credentialId } = auth.credentials;
    const { playlistId, userId } = payload;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.checkUserCollaborationExist(userId);
    const collaborationId = await this._service.addCollaborations(payload);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCollaborationByPlaylistIdHandler({ payload, auth }, h) {
    this._validator.validateCollaborationsPayload(payload);
    const { id: credentialId } = auth.credentials;
    const { playlistId, userId } = payload;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.checkUserCollaborationExist(userId);
    await this._service.deleteCollaborationByPlaylistIdUserId(
      playlistId,
      userId
    );

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });

    response.code(200);
    return response;
  }
}

module.exports = CollaborationsHandler;
