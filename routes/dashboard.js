const token = localStorage.getItem('token');

async function fetchBooks() {
  try {
    const res = await fetch('http://localhost:5000/viewBooks', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    data.books.forEach(book => {
      const card = document.createElement('div');
      card.className = 'book-card';
      card.innerHTML = `
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Price:</strong> $${book.price}</p>
        <p><strong>Genre:</strong> ${book.genre || 'N/A'}</p>
        <p><strong>Year:</strong> ${book.year || 'N/A'}</p>
        <p>${book.description}</p>
        <button class="buy-btn" data-id="${book._id}" ${book.status === 'sold' ? 'disabled' : ''}>
          ${book.status === 'sold' ? 'Sold' : 'Buy'}
        </button>
      `;

      const buyBtn = card.querySelector('.buy-btn');
      buyBtn.addEventListener('click', async () => {
        const bookId = buyBtn.getAttribute('data-id');
        try {
          const res = await fetch(`http://localhost:5000/purchase/${bookId}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const result = await res.json();
          alert(result.message);
          fetchBooks();
        } catch (err) {
          alert('Failed to buy book.');
        }
      });

      bookList.appendChild(card);
    });
  } catch (err) {
    console.error('Error fetching books:', err);
  }
}

const addBookModal = document.getElementById('addBookModal');
const openModalBtn = document.getElementById('openAddBookModal');
const closeModalBtn = document.getElementById('closeModal');

openModalBtn.addEventListener('click', () => {
  addBookModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
  addBookModal.style.display = 'none';
});

const addBookForm = document.getElementById('addBookForm');
addBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addBookForm);
  const bookData = {};
  formData.forEach((value, key) => {
    bookData[key] = value;
  });

  try {
    const res = await fetch('http://localhost:5000/addBook', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    });
    const result = await res.json();
    alert(result.message);
    if (res.ok) {
      addBookModal.style.display = 'none';
      addBookForm.reset();
      fetchBooks();
    }
  } catch (err) {
    alert('Failed to add book.');
  }
});

document.addEventListener('DOMContentLoaded', fetchBooks);
