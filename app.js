// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {

    static displayBooks() {

        const books = Store.getBooks();

        //hardcoding
        // const StoredBooks = [
        //     {
        //         title: 'Book One',
        //         author: 'Sanskar Tiwari',
        //         isbn: '3243434'
        //     },
        //     {
        //         title: "Books Two",
        //         author: "Sanskar Tiwari",
        //         isbn: "23434343"
        //     }
        // ];

        //const books = StoredBooks;

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        // to use variables inside the string we use backquotes
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className} mt-3`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() =>
            document.querySelector('.alert').remove(), 3000);

    }

    static clearFields() {
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = "";

    }
}

// Store Class: Handle Strorage 

class Store {
    static getBooks() {
        let books;

        //checking if there is any item called books
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books

document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book

document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent default action
    e.preventDefault();

    // Get form vaues

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate 
    if (title === '' || author === '' || isbn === '') {
        //alert('Please fill in all fields')
        UI.showAlert('Please fill in all fields', 'danger')
    } else {
        // Instantiate book
        const book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);
        //console.log(book)

        // Add Book to Storage
        Store.addBook(book);

        // Clear fields
        UI.clearFields();

        // show success message
        UI.showAlert('Book Added Succesfully', 'success')
    }



});

// Event: Remove a Book

document.querySelector('#book-list').addEventListener('click', (e) => {
    //console.log(e.target)
    UI.deleteBook(e.target);

    // Remove book from the store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // remove alert message
    UI.showAlert('Book Removed', 'danger')

});

