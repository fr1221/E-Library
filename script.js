document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  const library = document.getElementById("library");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const pagination = document.getElementById("pagination");
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  let books = JSON.parse(localStorage.getItem("books")) || [];
  let currentPage = 1;
  const booksPerPage = 5;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.classList.add(savedTheme);
    themeToggle.innerText =
      savedTheme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode";
  }

  themeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark")) {
      body.classList.remove("dark");
      localStorage.setItem("theme", "light");
      themeToggle.innerText = "🌙 Dark Mode";
    } else {
      body.classList.add("dark");
      localStorage.setItem("theme", "dark");
      themeToggle.innerText = "🌞 Light Mode";
    }
  });

  function displayBooks(filteredBooks = books, page = 1) {
    library.innerHTML = "";
    const start = (page - 1) * booksPerPage;
    const end = start + booksPerPage;
    const paginatedBooks = filteredBooks.slice(start, end);

    paginatedBooks.forEach((book, index) => {
      const bookDiv = document.createElement("div");
      bookDiv.className = "book";
      bookDiv.innerHTML = `
                <div>
                    <h3>${book.title}</h3>
                    <p>Penulis: ${book.author}</p>
                    <p>Kategori: ${book.category}</p>
                    <a href="${book.fileUrl}" download="${book.fileName}" class="download-btn">Download</a>
                </div>
                <div class="book-actions">
                    <button onclick="editBook(${index})">Edit</button>
                    <button onclick="deleteBook(${index})">Hapus</button>
                </div>
            `;
      library.appendChild(bookDiv);
    });

    displayPagination(filteredBooks.length);
  }

  function displayPagination(totalBooks) {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(totalBooks / booksPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.className = "pagination-button";
      button.innerText = i;
      button.addEventListener("click", () => {
        currentPage = i;
        displayBooks(books, currentPage);
      });
      pagination.appendChild(button);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const category = document.getElementById("category").value;
    const fileInput = document.getElementById("fileInput");

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileUrl = URL.createObjectURL(file);
      const fileName = file.name;

      const newBook = {
        title,
        author,
        category,
        fileUrl,
        fileName,
      };

      books.push(newBook);
      localStorage.setItem("books", JSON.stringify(books));
      displayBooks();
      form.reset();
      showNotification("Buku berhasil ditambahkan!", "success");
    }
  });

  window.deleteBook = function (index) {
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
    showNotification("Buku berhasil dihapus!", "success");
  };

  window.editBook = function (index) {
    const book = books[index];
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("category").value = book.category;

    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
    showNotification("Buku siap diedit!", "success");
  };

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
    );
    displayBooks(filteredBooks);
  });

  sortSelect.addEventListener("change", () => {
    const sortBy = sortSelect.value;
    books.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    displayBooks();
  });

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerText = message;
    document.body.prepend(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  displayBooks();
});
