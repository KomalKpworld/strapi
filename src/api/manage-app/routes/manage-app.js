'use strict';

/**
 * manage-app router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::manage-app.manage-app');
module.exports = {
    routes: [
        { // Path defined with an URL parameter
            method: 'POST',
            path: '/manage-app', 
            handler: 'manage-app.create',
            policies: []
          },
          { // Path defined with a regular expression
            method: 'GET',
            path: '/manage-app', 
            handler: 'manage-app.find',
            policies: []
          },
          
          { // Path defined with a regular expression
            method: 'GET',
            path: '/manage-app/:id', 
            handler: 'manage-app.findOne',
            policies: []
          },{ // Path defined with a regular expression
            method: 'PUT',
            path: '/manage-app/:id', 
            handler: 'manage-app.update',
            policies: []
          },
    
          { // Path defined with a regular expression
            method: 'DELETE',
            path: '/manage-app/:id', 
            handler: 'manage-app.delete',
            policies: []
          },
    { // Path defined with an URL parameter
        method: 'GET',
        path: '/commonApp',
        handler: 'manage-app.findMany',
        policies: []
    },
]
}