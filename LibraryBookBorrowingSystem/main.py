from views import (
    show_all_books,
    borrow_book,
    return_book,
    show_available_books,
    show_borrowed_books
)

while True:
    print("\n===== LIBRARY BOOK BORROWING SYSTEM =====")
    print("1. Show All Books")
    print("2. Borrow Book")
    print("3. Return Book")
    print("4. Show Available Books")
    print("5. Show Borrowed Books")
    print("6. Exit")

    choice = input("Enter your choice: ")

    if choice == "1":
        show_all_books()
    elif choice == "2":
        borrow_book()
    elif choice == "3":
        return_book()
    elif choice == "4":
        show_available_books()
    elif choice == "5":
        show_borrowed_books()
    elif choice == "6":
        print("Thank you for using the Library Book Borrowing System.")
        break
    else:
        print("Invalid choice. Please try again.")