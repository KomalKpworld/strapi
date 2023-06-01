'use strict';
const path = require("path");
const fs = require("fs");

const { createCoreService } = require("@strapi/strapi").factories;
// module.exports = createCoreService("api::sub-category.sub-category")
module.exports = {
    async deleteSubCategoryFile(id) {
        try {
            let query2 = `SELECT s.id as sub_categories_id, fid.related_id as fileReletedid, ffl.file_id as folder_file_link, fid.id as fileId  FROM sub_categories s
    INNER JOIN files_related_morphs  fid  ON fid.related_id = ${id}
    INNER JOIN files_folder_links ffl ON ffl.file_id = fid.file_id 
    INNER JOIN files f ON f.id = ffl.file_id   where s.id= ${id}`;
            let result4 = await strapi.db.connection.raw(query2);
            if (result4.rows.length !== 0) {
                let subCategoriesFileDelete = `DELETE FROM files WHERE id= ${result4.rows[0].fileid}`;
                let subCategoriesFileRealetedDataDelete = `DELETE FROM files_related_morphs  WHERE related_id= ${id}`;
                let subCategoriesFileFolderDataDelete = `DELETE FROM files_folder_links WHERE file_id= ${result4.rows[0].folder_file_link}`;
                let subCategoriesFileDeleteResult = await strapi.db.connection.raw(subCategoriesFileDelete);
                let subCategoriesFolderyFileDeleteResult = await strapi.db.connection.raw(subCategoriesFileFolderDataDelete);
                let subCategoriesFileRelatedDeleteResult = await strapi.db.connection.raw(subCategoriesFileRealetedDataDelete);
            }
            return { msg: "record delete successfully" }
        } catch (error) {
            return { err: "somthing went wrong" }
        }
    },
    async validedData(data) {
        try {
            if (!data.sub_category_name) { return { err: "sub_category_name is required" } }
            if (!data.display_date) { return { err: "display_date is required" } }
            if (!data.status) { return { err: "status is required" } }
            if (!data.move) { return { err: "move is required" } }
            if (!data.url) { return { err: "url is required" } }
            if (!data.is_new) { return { err: "is_new is required" } }
            if (!data.slider) { return { err: "slider is required" } }

            return { msg: "valid data" }
        } catch (error) {
            return { err: "somthing went wrong" }
        }
    },
    async productFileDelete(id) {
        try {
            let query = `SELECT p.id as productId,s.id as sub_category_id FROM products p      
                         INNER JOIN products_sub_category_id_links pdsid  ON pdsid.product_id = p.id 
                         INNER JOIN sub_categories s  ON s.id = pdsid.sub_category_id where s.id= ${id}`;
            let result = await strapi.db.connection.raw(query);
            for (let i = 0; i < result.rows.length; i++) {
                let query2 = `SELECT p.id as product_id, fid.related_id as fileReletedid, ffl.file_id as folder_file_link, fid.id as fileId  FROM products p
                              INNER JOIN files_related_morphs  fid  ON fid.related_id = p.id
                              INNER JOIN files_folder_links ffl ON ffl.file_id = fid.file_id 
                              INNER JOIN files f ON f.id = ffl.file_id   where p.id= ${id}`;
                let result4 = await strapi.db.connection.raw(query2);
                if (result4.rows.length !== 0) {
                    let productFileDelete = `DELETE FROM files WHERE id= ${result4.rows[0].fileid}`;
                    let productFileRealetedDataDelete = `DELETE FROM files_related_morphs  WHERE related_id= ${result.rows[i].productid}`;
                    let productFileFolderDataDelete = `DELETE FROM files_folder_links WHERE file_id= ${result4.rows[0].folder_file_link}`;
                    let productFileDeleteResult = await strapi.db.connection.raw(productFileDelete);
                    let productFolderyFileDeleteResult = await strapi.db.connection.raw(productFileFolderDataDelete);
                    let productFileRelatedDeleteResult = await strapi.db.connection.raw(productFileRealetedDataDelete);
                }
                let query = `DELETE FROM products WHERE id= ${result.rows[i].productid}`;
                let data = await strapi.db.connection.raw(query);
                return { msg: "record delete successfully" }
            }
        } catch (error) {
            return { err: "somthing went wrong" }
        }
    },

    async updateImageUrl(id) {
        try {
            let findUploadData = await strapi.entityService.findOne("api::sub-category.sub-category", id, {
                populate: { file: true },
            });
            let updateEtntry
            if (findUploadData.file[0]) {
                const dirPath = path.join('localhost:1337', findUploadData.file[0].url);;
                updateEtntry = await strapi.entityService.update("api::sub-category.sub-category", id, {
                    data: {
                        sub_category_image: dirPath,
                    }
                })
            }
            return { updateEtntry }
        }
        catch (err) {
            return { err: "Something went wrong" }
        }
    },
    async deleteAllSubCategory() {
        try {
            let query2 = `SELECT s.id as sub_categories_id, fid.related_id as fileReletedid, ffl.file_id as folder_file_link, fid.id as fileId  FROM sub_categories s
            INNER JOIN files_related_morphs  fid  ON fid.related_id = s.id
            INNER JOIN files_folder_links ffl ON ffl.file_id = fid.file_id 
            INNER JOIN files f ON f.id = ffl.file_id `;
            let result4 = await strapi.db.connection.raw(query2);
            if (result4.rows.length !== 0) {
                let subCategoriesFileDelete = `DELETE FROM files WHERE id= ${result4.rows[0].fileid}`;
                let subCategoriesFileFolderDataDelete = `DELETE FROM files_folder_links WHERE file_id= ${result4.rows[0].folder_file_link}`;
                let subCategoriesFileDeleteResult = await strapi.db.connection.raw(subCategoriesFileDelete);
                let subCategoriesFolderyFileDeleteResult = await strapi.db.connection.raw(subCategoriesFileFolderDataDelete);
            }
            let queryforDeletSubCategory = `DELETE FROM sub_categories`
            let queryForSubCategoryFIleDelete = `DELETE FROM files_related_morphs where related_type = 'api::sub-category.sub-category'`
            let deleteSubCategoryFiles = await strapi.db.connection.raw(queryForSubCategoryFIleDelete)
            let deleteSubCategory = await strapi.db.connection.raw(queryforDeletSubCategory)
            return { message: `Deleted  records.` }
        } catch (error) {
            return { err: "Something went wrong" }
        }
    }
}


