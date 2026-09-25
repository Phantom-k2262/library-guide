import books from "../data/books.json";

export type BookRecord = {
  id: number;
  spotId: number;
  title: string;
  author: string;
};

export function booksForSpot(spotId: number): BookRecord[] {
  return (books as BookRecord[]).filter((book) => book.spotId === spotId);
}
