'use strict';

/**
 * product router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::product.product');

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/product',
      handler: 'product.createProduct',
    },
    {
      method: 'GET',
      path: '/product/:id',
      handler: 'product.findOne',
    },
    {
      method: 'GET',
      path: '/product',
      handler: 'product.find',
    },
    {
      method: 'PUT',
      path: '/product/:id',
      handler: 'product.update',
    },
    {
      method: 'DELETE',
      path: '/product/:id',
      handler: 'product.delete',
    }

  ]
}