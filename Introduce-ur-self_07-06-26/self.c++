#include <iostream>
using namespace std;

void displayHeader() {
    cout << "==================================================" << endl;
    cout << "               GET TO KNOW ME PROGRAM" << endl;
    cout << "==================================================" << endl;
}

void displayProfile() {
    cout << "Name       : Syron Lee Cabagua / Sy" << endl;
    cout << "Dog Person 🐶" << endl;
    cout << "Birthday   : 09/02/2006" << endl;
    cout << "Address    : Agta, Leon" << endl;
    cout << "Fav Song   : Hell Mary" << endl;
    cout << "Motivation : Allowance" << endl;
    cout << "Support    : Friends" << endl;
}

void displayFooter() {
    cout << "==================================================" << endl;
    cout << "          Thank you for getting to know me!" << endl;
    cout << "==================================================" << endl;
}

int main() {
    displayHeader();
    displayProfile();
    displayFooter();

    return 0;
}