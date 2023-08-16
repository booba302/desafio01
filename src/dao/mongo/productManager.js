import mongoose from "mongoose";
import ProductModel from "../models/products.schema.js";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const products = await ProductModel.find().lean();
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(product) {
    try {
      const producto = await ProductModel.insertMany([product]);
      return producto;
    } catch (error) {
      console.log({
        error,
        msg: "Hubo un error al ingresar el producto",
      });
    }
  }

  async getProductById(id) {
    try {
      const findProduct = await ProductModel.findById(id);
      if (!findProduct) {
        console.log("No se encuentra el producto");
        throw new Error("Product Not found");
      } else {
        return findProduct;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, product) {
    try {
      const updProduct = await ProductModel.findById(id);
      if (updProduct) {
        const productData = updProduct._doc;
        const newProduct = {
          ...productData,
          ...product,
        };
        await ProductModel.updateOne(
          {
            _id: id,
          },
          newProduct
        );
        return {
          status: 200,
          msg: "Producto actualizado.",
        };
      } else {
        return {
          status: 404,
          msg: "Producto no encontrado.",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const delProduct = await ProductModel.findByIdAndDelete(id);
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
