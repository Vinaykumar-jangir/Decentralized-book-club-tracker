// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BookClubTracker {

    struct Book {
        string title;
        string author;
        string genre;
        uint256 yearPublished;
        bool isRead;
    }

    address public owner;
    mapping(address => Book[]) public userBooks;

    event BookAdded(address indexed user, string title, string author);
    event BookStatusUpdated(address indexed user, string title, bool isRead);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier validBook(string memory title) {
        require(bytes(title).length > 0, "Book title cannot be empty");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addBook(
        string memory _title,
        string memory _author,
        string memory _genre,
        uint256 _yearPublished
    ) public validBook(_title) {
        Book memory newBook = Book({
            title: _title,
            author: _author,
            genre: _genre,
            yearPublished: _yearPublished,
            isRead: false
        });

        userBooks[msg.sender].push(newBook);
        emit BookAdded(msg.sender, _title, _author);
    }

    function markBookAsRead(string memory _title) public validBook(_title) {
        bool bookFound = false;
        for (uint i = 0; i < userBooks[msg.sender].length; i++) {
            if (keccak256(bytes(userBooks[msg.sender][i].title)) == keccak256(bytes(_title)) && !userBooks[msg.sender][i].isRead) {
                userBooks[msg.sender][i].isRead = true;
                emit BookStatusUpdated(msg.sender, _title, true);
                bookFound = true;
                break;
            }
        }
        require(bookFound, "Book not found or already marked as read");
    }

    function getBooks() public view returns (Book[] memory) {
        return userBooks[msg.sender];
    }

    function getBookCount() public view returns (uint256) {
        return userBooks[msg.sender].length;
    }

    function removeBook(string memory _title) public validBook(_title) {
        for (uint i = 0; i < userBooks[msg.sender].length; i++) {
            if (keccak256(bytes(userBooks[msg.sender][i].title)) == keccak256(bytes(_title))) {
                delete userBooks[msg.sender][i];
                break;
            }
        }
    }
}
