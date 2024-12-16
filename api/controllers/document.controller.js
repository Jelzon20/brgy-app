import Document from "../models/document.model.js";

export const test = (req, res) => {
    res.json({message: 'API is working'});
}

export const addDocument = async (req, res, next) => {

    const { title, description, files } = req.body;

    const newDocument = new Document({
      ...req.body,
    });
    try {
      await newDocument.save();
      res.json('New document has been added successfully.');
    } catch (error) {
      next(error);
    }
  };