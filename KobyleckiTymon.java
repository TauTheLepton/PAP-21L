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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import javal.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class KobyleckiTymon
{
  public KobyleckiTymon(String path1, String path2, String path3)
  {
    try
    {
      boolean three = false;
      Path cat1 = Paths.get(path1);
      Path cat2 = Paths.get(path2);
      if(path3 != "0")
      {
        Path cat3 = Paths.get(path3);
        three = true;
      }
      else
      {
        Path cat3 = 0;
      }
      
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
  }
  public boolean compare()
  {
    return (this.cat1.lastModifiedTime() == this.cat2.lastModifiedTime());
  }
  public String getScript()
  {
    if(!this.three)
    {
      List<Path> files1;
      List<Path> files2;
      try (Stream<Path> walk = files.walk(this.cat1))
      {
        files1 = walk.collect(Collectors.toList());
      }
      try (Stream<Path> walk = files.walk(this.cat2))
      {
        files2 = walk.collect(Collectors.toList());
      }
      for (var i: files1)
      {
        for (var j: files2)
        {
          
        }
      }
    }
    return out;
  }
  public void main(String[] args)
  {
    if(args.length == 2)
    {
      args = Arrays.copyOf(args, args.length+1);
      args[2] = "0";
    }
    KobyleckiTymon(args);
    if(!this.compare())
    {
      System.out.println(this.getScript());
    }
  }
}