'use strict';

/**
 * video-status service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::video-status.video-status');
