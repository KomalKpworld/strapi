'use strict';
const path = require("path");
const fs = require("fs");

module.exports = {
    async subCategoryProductRecordDelete(id) {
        try {
            let query = `SELECT p.id as productid,c.id as category_id, s.id as sub_category_id FROM products p
            INNER JOIN products_category_id_links pdcid  ON pdcid.product_id = p.id 
            INNER JOIN categories c  ON c.id = pdcid.category_id
            INNER JOIN products_sub_category_id_links pdsid  ON pdsid.product_id = p.id 
            INNER JOIN sub_categories s  ON s.id = pdsid.sub_category_id where c.id= ${id}`
            let result = await strapi.db.connection.raw(query)
            for (let i = 0; i < result.rows.length; i++) {
                let query3 = `SELECT p.id as product_id, fid.related_id as fileReletedid, ffl.file_id as folder_file_link, fid.id as fileId  FROM products p
               INNER JOIN files_related_morphs  fid  ON fid.related_id = ${result.rows[i].productid}
               INNER JOIN files_folder_links ffl ON ffl.file_id = fid.file_id 
                INNER JOIN files f ON f.id = ffl.file_id   where p.id= ${result.rows[i].productid}`
                let result5 = await strapi.db.connection.raw(query3)
                if (result5.rows.length !== 0) {
                    let productFileDelete = `DELETE FROM files WHERE id= ${result5.rows[0].fileid}`
                    let productFileRealetedDataDelete = `DELETE FROM files_related_morphs  WHERE related_id= ${result.rows[i].productid}`
                    let productFileFolderDataDelete = `DELETE FROM files_folder_links WHERE file_id= ${result5.rows[0].folder_file_link}`
                    let productFileDeleteResult = await strapi.db.connection.raw(productFileDelete)
                    let productFolderyFileDeleteResult = await strapi.db.connection.raw(productFileFolderDataDelete)
                    let productFileRelatedDeleteResult = await strapi.db.connection.raw(productFileRealetedDataDelete)
                }
                let query = `DELETE FROM products WHERE id= ${result.rows[i].productid}`
                let data = await strapi.db.connection.raw(query)
                let query2 = `SELECT s.id as sub_categories_id, fid.related_id as fileReletedid, ffl.file_id as folder_file_link, fid.id as fileId  FROM sub_categories s
               INNER JOIN files_related_morphs  fid  ON fid.related_id = ${result.rows[i].sub_category_id}
               INNER JOIN files_folder_links ffl ON ffl.file_id = fid.file_id 
               INNER JOIN files f ON f.id = ffl.file_id   where s.id= ${result.rows[i].sub_category_id}`
                let result4 = await strapi.db.connection.raw(query2)
                if (result4.rows.length !== 0) {
                    let subCategoriesFileDelete = `DELETE FROM files WHERE id= ${result4.rows[0].fileid}`
                    let subCategoriesFileRealetedDataDelete = `DELETE FROM files_related_morphs  WHERE related_id= ${result.rows[i].sub_category_id}`
                    let subCategoriesFileFolderDataDelete = `DELETE FROM files_folder_links WHERE file_id= ${result4.rows[0].folder_file_link}`
                    let subCategoriesFileDeleteResult = await strapi.db.connection.raw(subCategoriesFileDelete)
                    let subCategoriesFolderyFileDeleteResult = await strapi.db.connection.raw(subCategoriesFileFolderDataDelete)
                    let subCategoriesFileRelatedDeleteResult = await strapi.db.connection.raw(subCategoriesFileRealetedDataDelete)
                }
                let deleteSubCategory = `DELETE FROM sub_categories WHERE id= ${result.rows[i].sub_category_id}`
                let data1 = await strapi.db.connection.raw(deleteSubCategory)
            }
            return { msg: "record delete successfully" }
        } catch (error) {
            return { err: "somthing went wrong" }
        }
    },
    async deleteCategoryFile(id) {
        try {
            let query2 = `SELECT c.id as category_id, fid.related_id as fileReletedid, ffl.file_id as folder_file_link, fid.id as fileId  FROM categories c
        INNER JOIN files_related_morphs  fid  ON fid.related_id = ${id}
        INNER JOIN files_folder_links ffl ON ffl.file_id = fid.file_id 
        INNER JOIN files f ON f.id = ffl.file_id   where c.id= ${id}`
            let result4 = await strapi.db.connection.raw(query2)
            if (result4.rows.length !== 0) {
                let caegoryFileDelete = `DELETE FROM files WHERE id= ${result4.rows[0].fileid}`
                let caegoryFileRealetedDataDelete = `DELETE FROM files_related_morphs  WHERE related_id= ${id}`
                let caegoryFileFolderDataDelete = `DELETE FROM files_folder_links WHERE file_id= ${result4.rows[0].folder_file_link}`
                let categoryFileDeleteResult = await strapi.db.connection.raw(caegoryFileDelete)
                let categorFolderyFileDeleteResult = await strapi.db.connection.raw(caegoryFileFolderDataDelete)
                let categoryFileRelatedDeleteResult = await strapi.db.connection.raw(caegoryFileRealetedDataDelete)
            }
            return { msg: "record delete successfully" }
        } catch (error) {
            return { err: "somthing went wrong" }
        }
    },
    async updateImageUrl(id) {
        try {
            const findUploadData = await strapi.entityService.findOne('api::category.category', id, {
                populate: { file: true },
            });
            console.log(findUploadData)
            let updateEtntry
            if (findUploadData.file[0]) {
                const dirPath = path.join('localhost:1337', findUploadData.file[0].url);
                updateEtntry = await strapi.entityService.update('api::category.category', id, {
                    data: {
                        category_image: dirPath,
                    }
                });
            }
            return { updateEtntry }
        } catch (error) {
            return { err: "somthing went wrong" }
        }
    },
    async deleteAllCategory() {
        try {
            let query2 = `SELECT c.id as category_id, fid.related_id as fileReletedid, ffl.file_id as folder_file_link, fid.id as fileId  FROM categories c
            INNER JOIN files_related_morphs  fid  ON fid.related_id = c.id
            INNER JOIN files_folder_links ffl ON ffl.file_id = fid.file_id 
            INNER JOIN files f ON f.id = ffl.file_id `
            let result4 = await strapi.db.connection.raw(query2)
            if (result4.rows.length !== 0) {
                let caegoryFileDelete = `DELETE FROM files WHERE id= ${result4.rows[0].fileid}`
                let caegoryFileFolderDataDelete = `DELETE FROM files_folder_links WHERE file_id= ${result4.rows[0].folder_file_link}`
                let categoryFileDeleteResult = await strapi.db.connection.raw(caegoryFileDelete)
                let categorFolderyFileDeleteResult = await strapi.db.connection.raw(caegoryFileFolderDataDelete)
            }
            let queryforDeleteCategory = `DELETE FROM categories`
            let queryForCategoryFIleDelete = `DELETE FROM files_related_morphs where related_type = 'api::category.category'`
            let deleteSubCategoryFiles = await strapi.db.connection.raw(queryForCategoryFIleDelete)
            let deleteSubCategory = await strapi.db.connection.raw(queryforDeleteCategory)
            return { message: `Deleted  records.` }
        } catch (error) {
            return { err: "Something went wrong" }
        }
    }
}