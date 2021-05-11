// Student Jan Kowalski pisze plik KowalskiJan.java. Jeżeli w Imieniu lub nazwisku studenta występuje "polska" litera proszę o zastąpienie jej literą łacińską (Łukasz Kółko -> KolkoLukasz). Rozwiązanie musi być jednym plikiem java. Proszę o samodzielne rozwiązanie zadania. Jeżeli zadanie będzie niepełne będę oceniał poszczególne zrealizowane etapy - zaczynając od poprawnie zrealizowanej obsługi parametrów)

// Program proszę dołączyć jako załącznik! (bo odpowiedź dopuszcza 40 linii max)

// Proszę napisać program porównujący dwa wskazane katalogi (mogące zawierać podkatalogi) i tworzący skrypt do synchronizacji drugiego do pierwszego katalogu.
// Katalogi wskazujemy podając je w parametrach wywołania (ścieżki mogą być wględne lub absolutne)

// Porównujemy na podstawie daty modyfikacji pliku. Proszę pamiętać że nazwy plików/ katalogów mogą zawierać dziwne znaki (np spacje). Pliki i katalogi mogą się pojawiać lub być kasowane.

// Program może brać 2 lub 3 parametry (jeżeli trzy, nie modyfikujemy katalogu 2 a robimy kopie zmodyfikowanych plików w katalogu 3)

// Przykłady (nie wszystkie) przydatnych funkcji:

// https://mkyong.com/java/how-to-get-the-file-last-modified-date-in-java/ (odczyt daty modyfikacji)
// https://mkyong.com/java/java-files-walk-examples/ (odczyt listy plików z podkatalogów)

// Wywołanie:

// java KowalskiJan.java <sciezka1> <sciezka2>

// czyli dla katalogów <sciezka1>
// <sciezka1>/p1.txt (2020-07-20T09:29:54.627222Z)
// <sciezka1>/p2.txt (2020-07-21T09:29:54.627222Z)

// <sciezka1>/sub/ (katalog)
// <sciezka1>/sub/p1.txt (2020-07-20T09:29:54.627222Z)

// oraz <sciezka2>:

// <sciezka2>/p1.txt (2020-07-21T09:29:54.627222Z)
// <sciezka2>/p2.txt (2020-07-20T09:29:54.627222Z)

// <sciezka2>/sub2/ (katalog)



// skrypt będzie wyglądał:

// mkdir "<sciezka2>/sub"
// cp "<sciezka1>/p2.txt" "<sciezka2>/p2.txt"
// cp "<sciezka1>/sub/p1.txt" "<sciezka2>/sub/p1.txt"
// rmdir "<sciezka2>/sub2"



// dla wywołania:

// java KowalskiJan.java <sciezka1> <sciezka2> <sciezka3>


// skrypt będzie wyglądał:

// mkdir "<sciezka2>/sub2"
// cp "<sciezka1>/p2.txt" "<sciezka3>/p2.txt"
// cp "<sciezka1>/sub/p1.txt" "<sciezka3>/sub/p1.txt"





// public class App //test
// {
//   int a, b;

//   public App(int appA, int appB)
//   {
//     a=appA;
//     b=appB;
//   }

//   int count()
//   {
//     int out=0;
//     for(int i=0; i<100; i++)
//     {
//       out+=a*b;
//     }
//     return out;
//   }

//   int count2()
//   {
//     for(int i=0; i<2; i++)
//     {
//       a=a*10;
//     }
//     int out=a+b;
//     return out;
//   }

//   public static void main( String[] args )
//   { 
//     App app1 = new App(21, 37);
//     System.out.println(app1.count());
//     System.out.println(app1.count2());

//     Book ksiazka = new Book("Ferdydurke", "Witold Gombrowicz", 300);
//     ksiazka.print();

//     testApp test = new testApp();
//     test.test_all();
//   }
// }

// class testApp
// {
//   App test1;

//   testApp()
//   {
//     test1 = new App(21, 37);
//   }

//   void test_all()
//   {
//     test_count();
//     test_count2();
//   }

//   void test_count()
//   {
//     assert test1.count() == 77700 : "Test failed!";
//   }

//   void test_count2()
//   {
//     assert test1.count2() == 2137 : "Test failed!";
//   }
// }

// class Book
// {
//   String title, author;
//   int pages;

//   Book(String bookTitle, String bookAuthor, int bookPages)
//   {
//     title=bookTitle;
//     author=bookAuthor;
//     pages=bookPages;
//   }

//   void setPages(int bookPages)
//   {
//     pages=bookPages;
//   }

//   int getPages()
//   {
//     return pages;
//   }

//   String getTitle()
//   {
//     return title;
//   }

//   String getAuthor()
//   {
//     return author;
//   }

//   void print()
//   {
//     String message="Book called '"+title+"' was written by "+author+" and it has "+pages+" pages.";
//     System.out.println(message);
//   }
// }
