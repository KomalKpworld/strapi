'use strict';

const { subCategoryProductRecordDelete, updateImageUrl, deleteCategoryFile } = require('../services/category')
/**
 * category controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::category.category', ({ strapi }) => ({

    async createCategory(ctx) {
        try {
            const data = ctx.request.body;
            const user = ctx.state.user.id;
            const entry = await strapi.entityService.create('api::category.category', {
                data: {
                    category_name: data.category_name,
                    move: data.move,
                    created_by_user: user
                },
                files: {
                    file: ctx.request.files['file']
                },
            });
            let id = entry.id
            let update = await updateImageUrl(id)
            return update.updateEtntry
        } catch (error) {
            return   "something went wrong"
        }
    },
    async update(ctx) {
        try {
            const data = ctx.request.body
            const id = ctx.request.params.id
            const user = ctx.state.user.id;
            if (ctx.request.files['file']) {
                let fileDelete = await deleteCategoryFile(id)
                if (fileDelete.err) return ctx.send(fileDelete.err)       
            }
            const entry = await strapi.entityService.update('api::category.category', id, {
                data: {
                    category_name: data.category_name,
                    move: data.move,
                    updated_by_user:user 
                },
                files: {
                    file: ctx.request.files['file']
                },
            });
            let update = await updateImageUrl(id)
            return update.updateEtntry
        } catch (error) {
            return   "something went wrong"
        }
    },
    async find(ctx) {
        try {
            ctx.query = { ...ctx.query, local: 'en' }
            const findData = await strapi.entityService.findMany('api::category.category', {  populate: { file: true, created_by_user:true, updated_by_user:true  }});
            return findData
        } catch (error) {
            return   "something went wrong"
        }
    },

    async findOne(ctx) {
        try {
            const id = ctx.request.params.id
            const entity = await strapi.entityService.findOne('api::category.category', id, {
                populate: { file: true, created_by_user:true, updated_by_user:true },
            });
        
            return  entity 
        } catch (error) {
            return   "something went wrong"
        }
    },

    async findCategoryWithName(ctx) {
        try {
            let query = `SELECT category_name , id FROM categories`
            let result = await strapi.db.connection.raw(query)
            console.log(result.rows)
            return result.rows
        } catch (error) {
            return   "something went wrong"
        }
    },

    async findSubCategoryWithName(ctx) {
        try {
            let categoryId = ctx.request.params.categoryId
            let query = `SELECT s.sub_category_name FROM sub_categories_category_id_links scid INNER JOIN sub_categories s  ON s.id = scid.sub_category_id WHERE scid.category_id = ${categoryId}`
            let result = await strapi.db.connection.raw(query)
            return result.rows
        } catch (error) {
            return   "something went wrong"
        }
    },

    async deleteCategory(ctx) {
        try {
            const id = ctx.request.params.id
            let productAndSubCategoryRecordDelete = await subCategoryProductRecordDelete(id)
            if (productAndSubCategoryRecordDelete.err) { return ctx.send(productAndSubCategoryRecordDelete.err) }
            let fileDelete = await deleteCategoryFile(id)
            if (fileDelete.err) { return ctx.send(fileDelete.err) }
            let categoryDelete = `DELETE FROM categories WHERE id= ${id}`
            let result3 = await strapi.db.connection.raw(categoryDelete)
            return 'data deleted successfully'
        } catch (error) {
            return   "something went wrong"
        }
    }
}));
