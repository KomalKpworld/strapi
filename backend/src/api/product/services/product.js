'use strict';
const path = require("path");
const fs = require("fs");

module.exports = {

    async deleteProductFile(id) {
        try {
            let query2 = `SELECT p.id as product_id, fid.related_id as fileReletedid, ffl.file_id as folder_file_link, fid.id as fileId  FROM products p
        INNER JOIN files_related_morphs  fid  ON fid.related_id = p.id
        INNER JOIN files_folder_links ffl ON ffl.file_id = fid.file_id 
        INNER JOIN files f ON f.id = ffl.file_id   where p.id= ${id}`
            let result4 = await strapi.db.connection.raw(query2)
            if (result4.rows.length !== 0) {
                let productFileDelete = `DELETE FROM files WHERE id= ${result4.rows[0].fileid}`
                let productFileRealetedDataDelete = `DELETE FROM files_related_morphs  WHERE related_id= ${id}`
                let productFileFolderDataDelete = `DELETE FROM files_folder_links WHERE file_id= ${result4.rows[0].folder_file_link}`
                let productFileDeleteResult = await strapi.db.connection.raw(productFileDelete)
                let productFolderyFileDeleteResult = await strapi.db.connection.raw(productFileFolderDataDelete)
                let productFileRelatedDeleteResult = await strapi.db.connection.raw(productFileRealetedDataDelete)
            }
        } catch (err) {
            return { err: "Something went wrong" }
        }
    },
    async updateImageUrl(id) {
        try {
            console.log(":ajo")
            const findUploadData = await strapi.entityService.findOne('api::product.product', id, {
                populate: { file: true },
            });
            let updateEtntry
            if (findUploadData.file[0]) {
                const dirPath = path.join('localhost:1337', findUploadData.file[0].url);
                updateEtntry = await strapi.entityService.update('api::product.product', id, {
                    data: {
                        image: dirPath,
                    }
                });
            }
            return { updateEtntry }
        }
        catch (err) {
            return { err: "Something went wrong" }
        }
    },
    async deleteAllProducts() {
        try {

            let query2 = `SELECT p.id as product_id, fid.related_id as fileReletedid, ffl.file_id as folder_file_link, fid.id as fileId  FROM products p
        INNER JOIN files_related_morphs  fid  ON fid.related_id = p.id
        INNER JOIN files_folder_links ffl ON ffl.file_id = fid.file_id
        INNER JOIN files f ON f.id = ffl.file_id `
            let result4 = await strapi.db.connection.raw(query2)
            if (result4.rows.length !== 0) {
                let productFileDelete = `DELETE FROM files WHERE id= ${result4.rows[0].fileid}`
                let productFileFolderDataDelete = `DELETE FROM files_folder_links WHERE file_id= ${result4.rows[0].folder_file_link}`
                let productFileDeleteResult = await strapi.db.connection.raw(productFileDelete)
                let productFolderyFileDeleteResult = await strapi.db.connection.raw(productFileFolderDataDelete)
            }
            let query = `DELETE FROM products`
            let queryForFIleDelete = `DELETE FROM files_related_morphs where related_type = 'api::product.product'`
            let deleteProductsFiles = await strapi.db.connection.raw(queryForFIleDelete)
            let deleteProducts = await strapi.db.connection.raw(query)
            return { message: `Deleted  records.` }
        } catch (error) {
            return { err: "Something went wrong" }
        }
    }
}