'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { deleteProductFile, updateImageUrl } = require("../services/product")
module.exports = createCoreController('api::product.product', ({ strapi }) => ({

    async createProduct(ctx) {
        try {
            let data = ctx.request.body
            const user = ctx.state.user.id;
            let category_id = Number(data.category_id)
            let sub_category_id = Number(data.sub_category_id)
            if (!data.frame_type) return "frame_typr is required"
            const entry = await strapi.entityService.create('api::product.product', {
                data: {
                    category_id: category_id,
                    sub_category_id: sub_category_id,
                    frame_type: data.frame_type,
                    created_by_id: user
                },
                files: {
                    file: ctx.request.files['file']
                }
            });
            let id = entry.id         
                let update = await updateImageUrl(id)
                if(update.err){
                    return update.err
                }
                return update.updateEtntry

        } catch (error) {
            return error
        }
    },

    async update(ctx) {
        try {
            const data = ctx.request.body
            const user = ctx.state.user.id;
            const id = ctx.request.params.id
            let category_id = Number(data.category_id)
            let sub_category_id = Number(data.sub_category_id)
            if (ctx.request.files['file']) { const deleteFile = await deleteProductFile(id) }
            const entry = await strapi.entityService.update('api::product.product', id, {
                data: {
                    category_id: category_id,
                    sub_category_id: sub_category_id,
                    frame_type: data.frame_type,
                    updated_by_id: user
                },
                files: {
                    file: ctx.request.files['file']
                },
            });
            let update = await updateImageUrl(id)
                if(update.err){
                    return update.err
                }
                return update.updateEtntry

        } catch (error) {
            return error
        }
    },

    async find(ctx) {
        try {
            const findData = await strapi.entityService.findMany('api::product.product', {
                populate: { file: true, category_id: true, sub_category_id: true, createdBy: true, updatedBy: true }
            });
            return (findData)
        } catch (error) {
            return error
        }
    },
    async findOne(ctx) {
        try {
            const id = ctx.request.params.id
            const entity = await strapi.entityService.findOne('api::product.product', id, { populate: { file: true, category_id: true, sub_category_id: true, createdBy: true, updatedBy: true } });
            return entity
        } catch (error) {
            return error
        }
    },

    async delete(ctx) {
        try {
            const id = ctx.request.params.id
            const deleteFile = await deleteProductFile(id)
            for (let i = 0; i < result.rows.length; i++) {
                let query = `DELETE FROM products WHERE id= ${result.rows[i].productid}`
                let data = await strapi.db.connection.raw(query)
            }
            return 'data deleted successfully'
        } catch (error) {
            return error
        }
    }
}))
