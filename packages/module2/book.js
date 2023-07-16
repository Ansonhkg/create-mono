// @ts-check

/**
 * Represents a book.
 * @typedef {Object} Book
 * @property {string} title - The title of the book.
 * @property {string} author - The author of the book.
 * @property {number} year - The year the book was published.
 */

/**
 * Display information about a book.
 * @param {Book} book The book to display information about.
 */
export function displayBookInfo(book) {
  console.log(
    `${book.title} was written by ${book.author} and published in ${book.year}.`
  );
}
