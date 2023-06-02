"use strict";

/**
 * category router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::category.category");

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/category",
      handler: "category.createCategory",
    },
    {
      method: "GET",
      path: "/category",
      handler: "category.find",
    },
    {
      method: "GET",
      path: "/category/:id",
      handler: "category.findOne",
    },
    {
      method: "PUT",
      path: "/category/:id",
      handler: "category.update",
    },
    {
      method: "GET",
      path: "/category-with-name",
      handler: "category.findCategoryWithName",
    },
    {
      method: "GET",
      path: "/subcategory/:categoryId",
      handler: "category.findSubCategoryWithName",
    },
    {
      method: "DELETE",
      path: "/category/:id",
      handler: "category.deleteCategory",
    },
  ],
};
