'use strict';

/**
 * manage-app-id controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::manage-app-id.manage-app-id', ({ strapi }) => ({
    async create(ctx) {
        const response = await super.create(ctx);
        return response;
    },
    async find(ctx) {
        ctx.query = { ...ctx.query, local: 'en' }
        const { data, meta } = await super.find(ctx);

        return { data, meta };
    },
    async findOne(ctx) {
        const { id } = ctx.params;
        const { query } = ctx;
        const entity = await strapi.service('api::manage-app-id.manage-app-id').findOne(id, query);
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

        return this.transformResponse(sanitizedEntity);
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