public class App //test
{
  int a, b;

  public App(int appA, int appB)
  {
    a=appA;
    b=appB;
  }

  int count()
  {
    int out=0;
    for(int i=0; i<100; i++)
    {
      out+=a*b;
    }
    return out;
  }

  int count2()
  {
    for(int i=0; i<2; i++)
    {
      a=a*10;
    }
    int out=a+b;
    return out;
  }

  public static void main( String[] args )
  { 
    App app1 = new App(21, 37);
    System.out.println(app1.count());
    System.out.println(app1.count2());

    Book ksiazka = new Book("Ferdydurke", "Witold Gombrowicz", 300);
    ksiazka.print();

    testApp test = new testApp();
    test.test_all();
  }
}

class testApp
{
  App test1;

  testApp()
  {
    test1 = new App(21, 37);
  }

  void test_all()
  {
    test_count();
    test_count2();
  }

  void test_count()
  {
    assert test1.count() == 77700 : "Test failed!";
  }

  void test_count2()
  {
    assert test1.count2() == 2137 : "Test failed!";
  }
}

class Book
{
  String title, author;
  int pages;

  Book(String bookTitle, String bookAuthor, int bookPages)
  {
    title=bookTitle;
    author=bookAuthor;
    pages=bookPages;
  }

  void setPages(int bookPages)
  {
    pages=bookPages;
  }

  int getPages()
  {
    return pages;
  }

  String getTitle()
  {
    return title;
  }

  String getAuthor()
  {
    return author;
  }

  void print()
  {
    String message="Book called '"+title+"' was written by "+author+" and it has "+pages+" pages.";
    System.out.println(message);
  }
}
