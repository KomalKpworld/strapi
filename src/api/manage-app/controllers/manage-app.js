'use strict';

/**
 * manage-app controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::manage-app.manage-app', ({ strapi }) => ({
    async create(ctx) {
        const response = await super.create(ctx);
        return response;
    },
    async find(ctx) {
        ctx.query = { ...ctx.query, local: 'en' }
        const { data, meta } = await super.find(ctx);
        meta.date = Date.now();
        return { data, meta };
    },
    async findOne(ctx) {
        const { id } = ctx.params;
        const { query } = ctx;
        const entity = await strapi.service('api::manage-app.manage-app').findOne(id, query);
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

        return this.transformResponse(sanitizedEntity);
    },
    async findMany(ctx) {
        // some logic
        const entries = await strapi.entityService.findMany('api::manage-app.manage-app', {
            fields: ['id', 'AppName'],
        })
        return entries
    },
    async update(ctx) {

        const response = await super.update(ctx);
        return response;
    },
    async delete(ctx) {

        const response = await super.delete(ctx);
        return response;
    }

}));