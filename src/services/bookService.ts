import { Book, IBook } from "../models/Book";

const getAllBooks = async (): Promise<IBook[]> => {
  const books = await Book.find({});
  return books;
};

const bookService = {
  getAllBooks,
};

export default bookService;
