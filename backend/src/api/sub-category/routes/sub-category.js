'use strict';

/**
 * sub-category router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::sub-category.sub-category');
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/sub-category',
      handler: 'sub-category.createSubCategory',
    },
    {
      method: 'GET',
      path: '/sub-category/:id',
      handler: 'sub-category.findOne',
    },
    {
      method: 'GET',
      path: '/sub-category',
      handler: 'sub-category.find',
    },
    {
      method: 'PUT',
      path: '/sub-category/:id',
      handler: 'sub-category.update',
    },
    {
      method: 'DELETE',
      path: '/sub-category/delete-all',
      handler: 'sub-category.deleteAll'
    },
    {
      method: 'DELETE',
      path: '/sub-category/:id',
      handler: 'sub-category.deleteSubCategory'
    }

  ]
}