"use strict";

const {
  deleteSubCategoryFile,
  validedData,
  productFileDelete,
  updateImageUrl,
} = require("../services/sub-category");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::sub-category.sub-category",
  ({ strapi }) => ({
    async createSubCategory(ctx) {
      try {
        let data = ctx.request.body;
        const valid = await validedData(data);
        if (valid.err) {
          return ctx.badRequest(valid.err);
        }
        const user = ctx.state.user.id;
        const entry = await strapi.entityService.create(
          "api::sub-category.sub-category",
          {
            data: {
              category_id: data.category_id,
              sub_category_name: data.sub_category_name,
              display_date: data.display_date,
              status: data.status,
              move: data.move,
              url: data.url,
              is_new: data.is_new,
              slider: data.slider,
              created_by_user: user,
            },
            files: {
              file: ctx.request.files["file"],
            },
          }
        );
        let id = entry.id;
        let update = await updateImageUrl(id);
        return update.updateEtntry;
      } catch (error) {
        return error;
      }
    },

    async update(ctx) {
      try {
        const data = ctx.request.body;
        const user = ctx.state.user.id;
        const id = ctx.request.params.id;
        const valid = await validedData(data);
        if (valid.err) return ctx.badRequest(valid.err);
        if (ctx.request.files["file"]) {
          await deleteSubCategoryFile(id);
        }
        const entry = await strapi.entityService.update(
          "api::sub-category.sub-category",
          id,
          {
            data: {
              category_id: data.category_id,
              sub_category_name: data.sub_category_name,
              display_date: data.display_date,
              status: data.status,
              move: data.move,
              url: data.url,
              is_new: data.is_new,
              slider: data.slider,
              updated_by_user: user,
            },
            files: {
              file: ctx.request.files["file"],
            },
          }
        );
        let update = await updateImageUrl(id);
        return update.updateEtntry;
      } catch (error) {
        return error;
      }
    },

    async find(ctx) {
      try {
        ctx.query = { ...ctx.query, local: "en" };
        const findData = await strapi.entityService.findMany(
          "api::sub-category.sub-category",
          {
            populate: {
              file: true,
              category_id: true,
              created_by_user: true,
              updated_by_user: true,
            },
          }
        );
        return findData;
      } catch (error) {
        return error;
      }
    },

    async findOne(ctx) {
      try {
        const id = ctx.request.params.id;
        const findData = await strapi.entityService.findOne(
          "api::sub-category.sub-category",
          id,
          {
            populate: {
              file: true,
              category_id: true,
              created_by_user: true,
              updated_by_user: true,
            },
          }
        );
        return findData;
      } catch (error) {
        return error;
      }
    },

    async deleteSubCategory(ctx) {
      try {
        let id = ctx.request.params.id;
        let deleteProductFile = await productFileDelete(id);
        let subCategoryFileDelete = await deleteSubCategoryFile(id);
        let subcategoryDelete = `DELETE FROM sub_categories WHERE id= ${id}`;
        let result3 = await strapi.db.connection.raw(subcategoryDelete);
        return "data deleted successfully";
      } catch (error) {
        return error;
      }
    },
  })
);
