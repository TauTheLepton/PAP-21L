// package tst;

// public class App {
//     public static void main(String[] args) throws Exception {
//         System.out.println("Hello, World!");
//     }
// }


// package tst;
// import java.awt.event.ActionEvent;
// import java.awt.event.ActionListener;
// import javax.swing.JButton;
// import javax.swing.JFrame;
// import javax.swing.SwingUtilities;
// public class App {
//     public static void main(String[] args) {
//         SwingUtilities.invokeLater(() -> {
//         JFrame frame = new JFrame("Pierwszy Przycisk");
//         frame.setBounds(100, 100, 450, 300); // nadaje rozmiar oknu
//         // zakoncz aplikacje po zamknieciu okna
//         frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//         JButton closeButton = new JButton("jeszcze nie nacisnieto");
//         closeButton.addActionListener(e->((JButton)e.getSource()).setText("nacisnieto"));
//         frame.getContentPane().add(closeButton);
//         frame.setVisible(true); // pokaz okno
//         });
//     }
// }

// SimpleSwing.main();

// import static org.junit.Assert.*

public class App 
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
    test.test_count2();
  }
}

class testApp
{
  App test1;

  testApp()
  {
    test1 = new App(21, 37);
  }

  void test_count2()
  {
    int test = test1.count2();
    assert test == 2137 : "Error: test niezaliczony";
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
