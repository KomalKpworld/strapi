'use strict';

/**
 * manage-category router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::manage-category.manage-category');
module.exports = {
    routes: [

        { // Path defined with an URL parameter
            method: 'POST',
            path: '/manage-category',
            handler: 'manage-category.create',
            policies: []
        },
        { // Path defined with a regular expression
            method: 'GET',
            path: '/manage-category',
            handler: 'manage-category.find',
            policies: []
        },

        { // Path defined with a regular expression
            method: 'GET',
            path: '/manage-category/:id',
            handler: 'manage-category.findOne',
            policies: []
        }, { // Path defined with a regular expression
            method: 'PUT',
            path: '/manage-category/:id',
            handler: 'manage-category.update',
            policies: []
        },

        { // Path defined with a regular expression
            method: 'DELETE',
            path: '/manage-category/:id',
            handler: 'manage-category.delete',
            policies: []
        },
        { // Path defined with an URL parameter
            method: 'GET',
            path: '/categorySelected',
            handler: 'manage-category.fetchAll',
            policies: []
        },
        { // Path defined with an URL parameter
            method: 'GET',
            path: '/commonCategory',
            handler: 'manage-category.findMany',
            policies: []
        },
    ]
}