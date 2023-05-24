'use strict';

/**
 * manage-app service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::manage-app.manage-app');
