'use strict';

/**
 * manage-app-id router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::manage-app-id.manage-app-id');
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/manage-app-id',
      handler: 'manage-app-id.create',
      policies: []
    },
    {
      method: 'GET',
      path: '/manage-app-id',
      handler: 'manage-app-id.find',
      policies: []
    },

    {
      method: 'GET',
      path: '/manage-app-id/:id',
      handler: 'manage-app-id.findOne',
      policies: []
    },
    {
      method: 'PUT',
      path: '/manage-app-id/:id',
      handler: 'manage-app-id.update',
      policies: []
    },

    {
      method: 'DELETE',
      path: '/manage-app-id/:id',
      handler: 'manage-app-id.delete',
      policies: []
    }
  ]
}
