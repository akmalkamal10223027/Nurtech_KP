const prisma = require('../config/db');
const { sendResponse } = require('../utils/formatter');

const getFAQs = async (req, res, next) => {
  try {
    const items = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' }
    });

    const formatted = items.map(item => ({
      id: item.id,
      documentId: item.documentId,
      question: item.question,
      answer: item.answer,
      category: item.category || 'Umum',
      order: item.order,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      publishedAt: item.publishedAt.toISOString()
    }));

    return sendResponse(res, formatted);
  } catch (err) {
    next(err);
  }
};

const createFAQ = async (req, res, next) => {
  try {
    const { question, answer, category, order } = req.body;
    const item = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: category || 'Umum',
        order: Number(order) || 0
      }
    });
    return res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
};

const updateFAQ = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { question, answer, category, order } = req.body;

    const dataToUpdate = {};
    if (question !== undefined) dataToUpdate.question = question;
    if (answer !== undefined) dataToUpdate.answer = answer;
    if (category !== undefined) dataToUpdate.category = category;
    if (order !== undefined) dataToUpdate.order = Number(order);

    const item = await prisma.fAQ.update({
      where: { id },
      data: dataToUpdate
    });
    return res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

const deleteFAQ = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.fAQ.delete({ where: { id } });
    return res.json({ message: 'FAQ berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
};
