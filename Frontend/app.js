// Initialize Web3
let web3;
let contract;
const contractAddress = '0x5223Ab296089B99E2Cf5fdD32DCE14E70286D748';  // Replace with your contract's address
const contractABI = [
    // [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_author",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_genre",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_yearPublished",
				"type": "uint256"
			}
		],
		"name": "addBook",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "author",
				"type": "string"
			}
		],
		"name": "BookAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isRead",
				"type": "bool"
			}
		],
		"name": "BookStatusUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			}
		],
		"name": "markBookAsRead",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			}
		],
		"name": "removeBook",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBookCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBooks",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "author",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "genre",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "yearPublished",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isRead",
						"type": "bool"
					}
				],
				"internalType": "struct BookClubTracker.Book[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userBooks",
		"outputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "author",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "genre",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "yearPublished",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isRead",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
];

window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        // Initialize contract
        contract = new web3.eth.Contract(contractABI, contractAddress);

        // Load books from blockchain
        loadBooks();
    } else {
        alert('Please install MetaMask or another Web3 provider');
    }
});

const addBookForm = document.getElementById('add-book-form');
addBookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const yearPublished = document.getElementById('yearPublished').value;

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    try {
        await contract.methods.addBook(title, author, genre, yearPublished).send({ from: account });
        alert('Book added successfully');
        loadBooks();
    } catch (error) {
        console.error(error);
        alert('Error adding book');
    }
});

document.getElementById('mark-read-btn').addEventListener('click', async () => {
    const bookTitle = document.getElementById('book-title-to-mark').value;

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    try {
        await contract.methods.markBookAsRead(bookTitle).send({ from: account });
        alert('Book marked as read');
        loadBooks();
    } catch (error) {
        console.error(error);
        alert('Error marking book as read');
    }
});

async function loadBooks() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    try {
        const books = await contract.methods.getBooks().call({ from: account });
        displayBooks(books);
    } catch (error) {
        console.error(error);
        alert('Error loading books');
    }
}

function displayBooks(books) {
    const bookListElement = document.getElementById('book-list');
    bookListElement.innerHTML = '';

    books.forEach((book) => {
        const li = document.createElement('li');
        li.classList.add(book.isRead ? 'read' : '');
        li.innerHTML = `
            <span>${book.title}</span> by ${book.author} (${book.yearPublished}) - Genre: ${book.genre}
        `;
        bookListElement.appendChild(li);
    });
}
