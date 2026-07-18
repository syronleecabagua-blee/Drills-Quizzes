from models import books


def show_all_books():
    print("\n=== ALL BOOKS ===")
    for i, book in enumerate(books, start=1):
        status = "Borrowed" if book["borrowed"] else "Available"
        borrower = book["borrowed_by"] if book["borrowed"] else "-"
        print(f"{i}. {book['title']}")
        print(f"   Author: {book['author']}")
        print(f"   Status: {status}")
        print(f"   Borrowed By: {borrower}")
        print()


def show_available_books():
    print("\n=== AVAILABLE BOOKS ===")
    found = False
    for book in books:
        if not book["borrowed"]:
            print(f"- {book['title']} by {book['author']}")
            found = True

    if not found:
        print("No available books.")


def show_borrowed_books():
    print("\n=== BORROWED BOOKS ===")
    found = False
    for book in books:
        if book["borrowed"]:
            print(f"- {book['title']} (Borrowed by {book['borrowed_by']})")
            found = True

    if not found:
        print("No borrowed books.")


def borrow_book():
    title = input("Enter book title: ")

    for book in books:
        if book["title"].lower() == title.lower():
            if book["borrowed"]:
                print("Book is already borrowed.")
            else:
                student = input("Student name: ")
                book["borrowed"] = True
                book["borrowed_by"] = student
                print("Book borrowed successfully!")
            return

    print("Book not found.")


def return_book():
    borrowed_books = []

    for book in books:
        if book["borrowed"]:
            borrowed_books.append(book)

    if not borrowed_books:
        print("\nNo books are currently borrowed.")
        return

    print("\n=== BORROWED BOOKS ===")
    for i, book in enumerate(borrowed_books, start=1):
        print(f"{i}. {book['title']} - Borrowed by {book['borrowed_by']}")

    choice = input("\nEnter the book number to return: ")

    if not choice.isdigit():
        print("Invalid input.")
        return

    choice = int(choice)

    if 1 <= choice <= len(borrowed_books):
        book = borrowed_books[choice - 1]
        book["borrowed"] = False
        book["borrowed_by"] = ""
        print(f'"{book["title"]}" has been returned successfully!')
    else:
        print("Invalid book number.")