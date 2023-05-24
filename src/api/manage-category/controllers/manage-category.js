'use strict';
const qs = require('qs');
/**
 * manage-category controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::manage-category.manage-category', ({ strapi }) => ({
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
        const entity = await strapi.service('api::manage-category.manage-category').findOne(id, query);
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

        return this.transformResponse(sanitizedEntity);
    },
    async findMany(ctx) {
        let findCategory = strapi.query('api::manage-category.manage-category').findMany(
            {
                select: ['id', 'CatName'],

            }
        );

        return findCategory
    },
    async fetchAll(ctx) {
        let findCategory = strapi.query('api::manage-category.manage-category').findMany(
            {
                select: ['id', 'CatName'],
                populate: {
                    AppId: {
                        select: ['id']
                    },
                    Logo: {
                        select: ['url'],
                    }
                }
            }
        );

        return findCategory
    },
    async update(ctx) {

        const response = await super.update(ctx);
        return response;
    },
    async delete(ctx) {
        const response = await super.delete(ctx);
        return response;
    },

}))