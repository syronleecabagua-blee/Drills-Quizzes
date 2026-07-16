from visitor import add_visitor
from display import display_visitors

visitors = []

while True:
    add_visitor(visitors)

    again = input("Add another visitor? (yes/no): ").lower()

    if again != "yes":
        break

display_visitors(visitors)