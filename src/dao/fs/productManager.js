import fs from "fs";
import __dirname from "../../config/dirname.js";
import { v4 as uuidv4 } from "uuid";

export default class ProductManager {
  constructor() {
    this.products = [];
    this.path = `${__dirname}/../db/products.json`;
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      console.log(error);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products),
        "utf-8"
      );
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products;
    }
  }

  async addProduct(product) {
    const { title, description, price, code, stock, category, thumbnail } =
      product;
    const id = uuidv4();
    const products = await this.getProducts();
    console.log(products);
    if (!title || !description || !price || !code || !stock || !category) {
      throw new Error("Missing data");
    } else {
      const valCode = products.some((product) => product.code === code);
      if (valCode) {
        throw new Error("Already exist");
      } else {
        try {
          const product = {
            id: id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status: true,
            category,
          };
          products.push(product);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(products),
            "utf-8"
          );
          return product;
        } catch (error) {
          console.log("error: " + error);
          throw new Error("Couldn't be created");
        }
      }
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const findProduct = products.find((product) => product.id == id);

    if (!findProduct) {
      console.log("No se encuentra el producto");
      throw new Error("Product Not found");
    } else {
      return findProduct;
    }
  }

  async updateProduct(id, product) {
    try {
      const products = await this.getProducts();
      const updProduct = await this.getProductById(id);
      if (updProduct) {
        !product.title ? updProduct.title : (updProduct.title = product.title);
        !product.description
          ? updProduct.description
          : (updProduct.description = product.description);
        !product.price ? updProduct.price : (updProduct.price = product.price);
        !product.thumbnail
          ? updProduct.thumbnail
          : (updProduct.thumbnail = product.thumbnail);
        !product.code ? updProduct.code : (updProduct.code = product.code);
        !product.stock ? updProduct.stock : (updProduct.stock = product.stock);
        !product.category
          ? updProduct.category
          : (updProduct.category = product.category);
        !product.status
          ? updProduct.status
          : (updProduct.status = product.status);
        const newProducts = products.filter((product) => product.id != id);
        newProducts.push(updProduct);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(newProducts),
          "utf-8"
        );
        return updProduct;
      }
    } catch (error) {
      console.log("Error: " + error);
      throw new Error("Not found");
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const delProduct = await this.getProductById(id);
      if (delProduct) {
        const newProduct = products.filter((product) => product.id != id);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(newProduct),
          "utf-8"
        );
        return delProduct;
      }
    } catch (error) {
      console.log("Error: " + error);
      throw new Error("Not found");
    }
  }
}
