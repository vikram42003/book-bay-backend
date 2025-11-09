import { Book } from "./models/Book";
import { closeDB, connectDB } from "./config/mongodb";

const SEED_COUNT = 10;

// docs - https://developers.google.com/books/docs/v1/reference/volumes/list
async function seedBooks() {
  try {
    await connectDB();

    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=${SEED_COUNT}`);
    const data: any = await res.json();

    console.log(`API endpoint returned ${data.items.length} items`);

    const books = data.items.map((item: any) => ({
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || "Unknown",
      image: item.volumeInfo.imageLinks?.thumbnail || "https://picsum.photos/200",
      price: Math.floor(Math.random() * 10) * 100,
    }));

    await Book.deleteMany({});

    await Book.insertMany(books);

    console.log(`Seeded ${data.items.length} books`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding books:", err);
  } finally {
    await closeDB();
  }
}

seedBooks();
