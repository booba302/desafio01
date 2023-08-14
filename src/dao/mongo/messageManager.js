import messageModel from "../models/messages.schema.js";

export default class MessageManager {
  constructor() {
    this.messageModel = messageModel;
  }

  async addMessage(user, message) {
    try {
      const messages = await this.messageModel.create({
        user,
        message,
      });
      return messages;
    } catch (error) {
      throw new Error("No se puedo agregar el mensaje");
    }
  }

  async getMessage() {
    try {
      const messages = await this.messageModel.find().lean();
      return messages;
    } catch (error) {
      throw new Error("No se puedo obtener el mensaje");
    }
  }
}
