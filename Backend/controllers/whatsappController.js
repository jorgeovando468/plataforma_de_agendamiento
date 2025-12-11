const whatsappService = require('../services/whatsappService');

function getStatus(req, res) {
  const status = whatsappService.getStatus();
  res.json({
    status: status.enabled ? (status.ready ? 'connected' : 'initializing') : 'disabled',
    ready: status.ready,
    enabled: status.enabled
  });
}

module.exports = { getStatus };
