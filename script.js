// // ===== Handle Login and Open Login Modal =====
// document.getElementById("login-btn").addEventListener("click", function () {
//     document.getElementById("login-modal").classList.remove("hidden");
// });

// // ===== Handle Signup and Open Signup Modal =====
// document.getElementById("signup-btn").addEventListener("click", function () {
//     document.getElementById("signup-modal").classList.remove("hidden");
// });

// // ===== Close Modals =====
// document.getElementById("close-login").addEventListener("click", function () {
//     document.getElementById("login-modal").classList.add("hidden");
// });

// document.getElementById("close-signup").addEventListener("click", function () {
//     document.getElementById("signup-modal").classList.add("hidden");
// });

// // ===== Handle Login Form Submission =====
// document.getElementById('login-form').addEventListener('submit', function (event) {
//     event.preventDefault(); // Prevent the default form submission

//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     // Perform login by sending request to the server
//     fetch('/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password })
//     })
//         .then(response => response.json())
//         .then(data => {
//             // Check if login is successful
//             if (data.message === 'Login successful') {
//                 // Store the token in localStorage
//                 localStorage.setItem('token', data.token); // Store JWT token

//                 // Redirect based on role
//                 if (data.role === 'seller') {
//                     window.location.href = '/dashboard.html'; // Redirect to seller dashboard
//                 } else {
//                     window.location.href = '/buyer.html'; // Redirect to buyer page
//                 }
//             } else {
//                 alert(data.message);  // Show error message if login fails
//             }
//         })
//         .catch(err => console.error('Login error:', err));
// });

// // ===== Handle Signup Form Submission =====
// document.getElementById('signup-form').addEventListener('submit', function (event) {
//     event.preventDefault(); // Prevent the default form submission

//     const fullName = document.querySelector('input[name="fullName"]').value;
//     const email = document.querySelector('input[name="email"]').value;
//     const password = document.querySelector('input[name="password"]').value;
//     const location = document.querySelector('input[name="location"]').value;
//     const role = document.querySelector('select[name="role"]').value; // Capture role

//     // Perform signup by sending request to the server
//     fetch('/signup', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name: fullName, email, password, location, role })
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.message === 'User registered successfully') {
//                 alert('Signup successful! Please log in.');
//                 document.getElementById('signup-modal').classList.add('hidden'); // Close the signup modal
//             } else {
//                 alert(data.message);  // Show error message if signup fails
//             }
//         })
//         .catch(err => console.error('Signup error:', err));
// });

// // ===== Fetch Books for the Logged-in User =====
// function fetchUserBooks() {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         alert('You need to login first!');
//         return;
//     }

//     fetch('/myBooks', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`, // Pass JWT token in Authorization header
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.books) {
//                 displayBooks(data.books);
//             }
//         })
//         .catch(err => console.error('Error fetching books:', err));
// }

// function displayBooks(books) {
//     const bookList = document.getElementById('book-list');
//     bookList.innerHTML = ''; // Clear previous content

//     books.forEach(book => {
//         const bookCard = document.createElement('div');
//         bookCard.classList.add('listing-card');
//         bookCard.innerHTML = `
//             <h4>${book.title}</h4>
//             <p>${book.author}</p>
//             <p>${book.genre}</p>
//             <button class="small-btn">View More</button>
//         `;
//         bookList.appendChild(bookCard);
//     });
// }

// fetchUserBooks();