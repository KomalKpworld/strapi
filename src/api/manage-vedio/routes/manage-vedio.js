'use strict';

/**
 * manage-vedio router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::manage-vedio.manage-vedio');
module.exports = {
    routes: [
      { 
        method: 'POST',
        path: '/manage-vedio', 
        handler: 'manage-vedio.create',
        policies: []
      },
      { 
        method: 'GET',
        path: '/manage-vedio', 
        handler: 'manage-vedio.find',
        policies: []
      },
      {
        method: 'GET',
        path: '/manage-vedio/:id', 
        handler: 'manage-vedio.findOne',
        policies: []
      },
      { 
        method: 'PUT',
        path: '/manage-vedio/:id', 
        handler: 'manage-vedio.update',
        policies: []
      },
      { 
        method: 'DELETE',
        path: '/manage-vedio/:id', 
        handler: 'manage-vedio.delete',
        policies: []
      },

    // find with SelectedField
      { 
        method: 'GET',
        path: '/common-vedio',
        handler: 'manage-vedio.findMany',
        policies: []
    },

    // Dashboard API 
    { 
      method: 'GET',
      path: '/dash-board-status', 
      handler: 'manage-vedio.dashBoardStatus',
      policies: []
    },
    { 
      method: 'POST',
      path: '/manage-vedio/dash-board-by-date-and-app', 
      handler: 'manage-vedio.dashboardByDateAndApp',
      policies: []
    },
    { 
      method: 'POST',
      path: '/manage-vedio/dash-board-by-date', 
      handler: 'manage-vedio.dashboardByDate',
      policies: []
    },
   
    ]
  }
  