import { Router, IRouter } from "express";
import { Request, Response } from "express";
import bookService from "../services/bookService";

const bookRouter: IRouter = Router();

// GET /api/books - get all books
bookRouter.get("/", async (req: Request, res: Response) => {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    const str = "Encountered an error While fetching books";
    console.error(str, "\n", error);
    res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

export default bookRouter;
