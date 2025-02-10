document.addEventListener('DOMContentLoaded', function() {
  const submitBook = document.getElementById('bookForm');
  const completedBookList = document.getElementById('completeBookList');
  const uncompletedBookList = document.getElementById('incompleteBookList');
  const searchBookForm = document.getElementById('searchBook');
  const searchBookTitle = document.getElementById('searchBookTitle');

  if (books === 0) {
      completedBookList.style.diplay = 'none';
      uncompletedBookList.style.none = 'none';
  }
  else {
      document.dispatchEvent(new Event(RENDER_EVENT));
  }

  submitBook.addEventListener('submit', function(event) {
      event.preventDefault();
      addBook();
  });

  searchBookForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const search = searchBookTitle.value.toLowerCase();

    const filteredBooks = books.filter((book) => 
      book.title.toLowerCase().includes(search)
    );

    if (filteredBooks.length === 0) {
      alert('Buku tidak ditemukan');
      renderFilteredBooks(books);
    }
    else {
      alert(`Ditemukan ${filteredBooks.length} buku.`);
      renderFilteredBooks(books);
    }
  });
});

function renderFilteredBooks(filteredBooks) {
  const uncompletedBookList = document.getElementById('incompleteBookList');
  uncompletedBookList.innerHTML = '';

  const completedBookList = document.getElementById('completeBookList');
  completedBookList.innerHTML = '';

  for (const book of filteredBooks) {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completedBookList.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
}

function saveBooksToLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books))
}

function addBook() {
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const newBook = {
      id: +new Date(),
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
  };

  books.push(newBook);
  saveBooksToLocalStorage();

  document.dispatchEvent(new Event(RENDER_EVENT));
}

const RENDER_EVENT = 'render-event';
let books = JSON.parse(localStorage.getItem('books')) || [];

document.addEventListener(RENDER_EVENT, function() {
  const uncompletedBookList = document.getElementById('incompleteBookList');
  uncompletedBookList.innerHTML = '';

  const completedBookList = document.getElementById('completeBookList');
  completedBookList.innerHTML = '';

  for(const book of books) {
      const bookElement = createBookElement(book);

      if(book.isComplete) {
          completedBookList.append(bookElement);
      }
      else {
          uncompletedBookList.append(bookElement);
      }
  }   
});

function createBookElement(book) {
  const bookItem = document.createElement('div');
  bookItem.setAttribute('data-bookId', book.id);
  bookItem.setAttribute('data-testid', 'bookItem');

  const bookTitle = document.createElement('h3');
  bookTitle.setAttribute('data-testid', 'bookItemTitle');
  bookTitle.innerText = book.title;

  const bookAuthor = document.createElement('p');
  bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
  bookAuthor.innerText = `Penulis: ${book.author}`;

  const bookYear = document.createElement('p');
  bookYear.setAttribute('data-testid', 'bookItemYear');
  bookYear.innerText = `Tahun: ${book.year}`;

  const buttonContainer = document.createElement('div');

  const completeButton = document.createElement('button');
  completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  if(book.isComplete) {
      completeButton.innerText = 'Belum selesai dibaca';
  }
  else {
      completeButton.innerText =  'Selesai dibaca';
  }
  
  completeButton.addEventListener('click', () => toggleCompleteStatus(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.innerText = 'Hapus buku';
  deleteButton.addEventListener('click', () => handleDeleteButton(book.id));

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.innerText = 'Edit buku';
  editButton.addEventListener('click', () => handleEditButton(book.id));

  buttonContainer.append(completeButton, deleteButton, editButton);
  bookItem.append(bookTitle, bookAuthor, bookYear, buttonContainer);

  return bookItem;
}


function toggleCompleteStatus(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function handleDeleteButton(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveBooksToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function handleEditButton(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
      const newTitle = prompt('Edit judul buku:', book.title );
      const newAuthor = prompt('Edit penulis buku:', book.author);
      const newYear = prompt('Edit tahun buku:', book.year);

      if (newTitle && newAuthor && newYear) {
          book.title = newTitle;
          book.author = newAuthor;
          book.year = newYear;
          saveBooksToLocalStorage();
          document.dispatchEvent(new Event(RENDER_EVENT));
      }
  }
}