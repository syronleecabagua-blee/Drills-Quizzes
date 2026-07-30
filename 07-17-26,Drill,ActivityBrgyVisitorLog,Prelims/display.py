def display_visitors(visitors):
    print("\n=== BARANGAY VISITOR LOG ===")

    for i, visitor in enumerate(visitors, start=1):
        print(f"{i}. Name: {visitor[0]} | Purpose: {visitor[1]}")

    print(f"\nTotal number of visitors: {len(visitors)}")