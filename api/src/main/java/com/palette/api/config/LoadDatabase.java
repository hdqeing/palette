package com.palette.api.config;

import com.palette.api.model.*;
import com.palette.api.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
@Profile("local")
public class LoadDatabase {
    private  static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private StockRepository stockRepository;

    @Bean
    CommandLineRunner initDatabase(
            PalletRepository palletRepository,
            PalletSortRepository palletSortRepository,
            CompanyRepository companyRepository,
            EmployeeRepository employeeRepository,
            QueryRepository queryRepository,
            QueryPalletRepository queryPalletRepository,
            QuerySellerRepository querySellerRepository,
            QueryPalletPriceRepository queryPalletPriceRepository){
        return args -> {
//          Add EPAL Europalette
            PalletSort epalEuropaletteSort = new PalletSort("EPAL Europalette", 800, 1200, 144);
            palletSortRepository.save(epalEuropaletteSort);


            List<Pallet> palletsepalEuropaletteSort = new ArrayList<>();

            Pallet epalEuropaletteNew = new Pallet(epalEuropaletteSort, "NEW", "https://www.epal-pallets.org/fileadmin/_processed_/9/0/csm_01_01_Produkbild_LO_EPAL_Europalette-Diagonal_krop_ec96a1b1b2.jpg");
            palletRepository.save(epalEuropaletteNew);
            palletsepalEuropaletteSort.add(epalEuropaletteNew);

            Pallet epalEuropaletteA = new Pallet(epalEuropaletteSort, "CLASS A", "https://freiheit-moebelstudio.de/media/86/0f/b7/1619012322/europalette-palette-vollholz-vollholzkloetze-epal-moebelpalette-diy-gehobelt-freiheit-home.jpg");
            palletRepository.save(epalEuropaletteA);
            palletsepalEuropaletteSort.add(epalEuropaletteA);


            Pallet epalEuropaletteB = new Pallet(epalEuropaletteSort, "CLASS B", "https://freiheit-moebelstudio.de/media/a8/da/86/1622640720/paletten_2te-wahl_vollholzkloetze-epal-palettenservice-moebelbau-diy-freiheit-palettenmoebel-seitlich-2040.jpg");
            palletRepository.save(epalEuropaletteB);
            palletsepalEuropaletteSort.add(epalEuropaletteB);


            Pallet epalEuropaletteC = new Pallet(epalEuropaletteSort, "CLASS C", "https://palettenlogistik.ch/wp-content/uploads/2024/01/EPAL_Europalette_Klasse_C.jpg");
            palletRepository.save(epalEuropaletteC);
            palletsepalEuropaletteSort.add(epalEuropaletteC);


//            epalEuropaletteSort.setPallets(palletsepalEuropaletteSort);
            epalEuropaletteSort = palletSortRepository.save(epalEuropaletteSort);



// Add EPAL 2
            PalletSort epal2Sort = new PalletSort("EPAL 2", 1200, 1000, 162);
            palletSortRepository.save(epal2Sort);

            List<Pallet> palletsepal2Sort = new ArrayList<>();

            Pallet epal2New = new Pallet(epal2Sort, "NEW", "https://www.epal-pallets.org/fileadmin/_processed_/6/b/csm_01_01_Produkbild_EPAL_industrial_pallet_2_diagonal_2c5d895a98.jpg");
            palletRepository.save(epal2New);
            palletsepal2Sort.add(epal2New);

            Pallet epal2A = new Pallet(epal2Sort, "CLASS A", "https://p.turbosquid.com/ts-thumb/Qx/ULrc9H/itmornDO/pallet_eur2_turntable/png/1568205317/1920x1080/turn_fit_q99/52e620265ac4b85e740df9b95736f9232f4ba913/pallet_eur2_turntable-1.jpg");
            palletRepository.save(epal2A);
            palletsepal2Sort.add(epal2A);

            Pallet epal2B = new Pallet(epal2Sort, "CLASS B", "https://dnssolution.vn/wp-content/uploads/2023/08/PALLET-EPAL-2-01.png");
            palletRepository.save(epal2B);
            palletsepal2Sort.add(epal2B);

            Pallet epal2C = new Pallet(epal2Sort, "CLASS C", "https://to-ma.rs/media/catalog/product/cache/0dccd0f9956fe856d91bb5c73731e19d/t/o/toma_paete_epal_1200.jpg");
            palletRepository.save(epal2C);
            palletsepal2Sort.add(epal2C);

//            epal2Sort.setPallets(palletsepal2Sort);
            epal2Sort = palletSortRepository.save(epal2Sort);

// Add EPAL 3
            PalletSort epal3Sort = new PalletSort("EPAL 3", 1200, 1000, 162);
            palletSortRepository.save(epal3Sort);

            List<Pallet> palletsepal3Sort = new ArrayList<>();

            Pallet epal3New = new Pallet(epal3Sort, "NEW", "https://www.epal-pallets.org/fileadmin/user_upload/ntg_package/images/mediathek/Bilder/Ladungstraeger/EPAL_3_022017.jpg");
            palletRepository.save(epal3New);
            palletsepal3Sort.add(epal3New);

            Pallet epal3A = new Pallet(epal3Sort, "CLASS A", "https://freiheit-moebelstudio.de/media/44/28/00/1621239362/palette-epal3-ispm15-ippc-industriepalette-100x120-palettenmoebel-freiheit-seite-0990.jpg");
            palletRepository.save(epal3A);
            palletsepal3Sort.add(epal3A);

            Pallet epal3B = new Pallet(epal3Sort, "CLASS B", "https://www.krenzer-paletten.de/files/produkte/euro-paletten/technische-zeichnungen/Epal-Palette%20Euro3%20ohne%203%20klein.jpg");
            palletRepository.save(epal3B);
            palletsepal3Sort.add(epal3B);

            Pallet epal3C = new Pallet(epal3Sort, "CLASS C", "https://jaywoodindustry.com/images/epal/epal3/EPAL_3_2.jpg");
            palletRepository.save(epal3C);
            palletsepal3Sort.add(epal3C);

//            epal3Sort.setPallets(palletsepal3Sort);
            epal3Sort = palletSortRepository.save(epal3Sort);

// Add EPAL 6
            PalletSort epal6Sort = new PalletSort("EPAL 6 Halbpalette", 800, 600, 144);
            palletSortRepository.save(epal6Sort);

            List<Pallet> palletsepal6Sort = new ArrayList<>();

            Pallet epal6New = new Pallet(epal6Sort, "NEW", "https://www.epal-pallets.org/fileadmin/user_upload/ntg_package/images/01_01_Produkbild_EPAL_Euro_pallet_6.jpg");
            palletRepository.save(epal6New);
            palletsepal6Sort.add(epal6New);

            Pallet epal6A = new Pallet(epal6Sort, "CLASS A", "https://www.mypalletsonline.com/241-large_default/holzpaletten-800-x-600-1-2-epal6.jpg");
            palletRepository.save(epal6A);
            palletsepal6Sort.add(epal6A);

            Pallet epal6B = new Pallet(epal6Sort, "CLASS B", "https://www.neetwk.com/wp-content/uploads/2018/12/EPAL-6-half-pallets.jpg");
            palletRepository.save(epal6B);
            palletsepal6Sort.add(epal6B);

            Pallet epal6C = new Pallet(epal6Sort, "CLASS C", "https://gerso-shop.de/media/images/org/euro-palette-epal-v.jpg");
            palletRepository.save(epal6C);
            palletsepal6Sort.add(epal6C);

//            epal6Sort.setPallets(palletsepal6Sort);
            epal6Sort = palletSortRepository.save(epal6Sort);

// Add EPAL 7
            PalletSort epal7Sort = new PalletSort("EPAL 7", 900, 600, 163);
            palletSortRepository.save(epal7Sort);

            List<Pallet> palletsepal7Sort = new ArrayList<>();

            String epal7Url = "https://www.epal-pallets.org/fileadmin/_processed_/a/3/csm_190809_EPAL7_half_pallet_2019_d27959d38e.jpg";

            Pallet epal7New = new Pallet(epal7Sort, "NEW", epal7Url);
            palletRepository.save(epal7New);
            palletsepal7Sort.add(epal7New);

            Pallet epal7A = new Pallet(epal7Sort, "CLASS A", epal7Url);
            palletRepository.save(epal7A);
            palletsepal7Sort.add(epal7A);

            Pallet epal7B = new Pallet(epal7Sort, "CLASS B", epal7Url);
            palletRepository.save(epal7B);
            palletsepal7Sort.add(epal7B);

            Pallet epal7C = new Pallet(epal7Sort, "CLASS C", epal7Url);
            palletRepository.save(epal7C);
            palletsepal7Sort.add(epal7C);

//            epal7Sort.setPallets(palletsepal7Sort);
            epal7Sort = palletSortRepository.save(epal7Sort);

// Add EPAL Gitterbox
            PalletSort epalGitterboxSort = new PalletSort("EPAL Gitterbox", 800, 1200, 970);
            palletSortRepository.save(epalGitterboxSort);

            List<Pallet> palletsepalGitterboxSort = new ArrayList<>();

            String gitterboxUrl = "https://www.epal-pallets.org/fileadmin/_processed_/3/d/csm_01_01_Produkbild_EPAL_box_pallet_diagonal_7cec70fd38.jpg";

            Pallet gitterboxNew = new Pallet(epalGitterboxSort, "NEW", gitterboxUrl);
            palletRepository.save(gitterboxNew);
            palletsepalGitterboxSort.add(gitterboxNew);

            Pallet gitterboxA = new Pallet(epalGitterboxSort, "CLASS A", gitterboxUrl);
            palletRepository.save(gitterboxA);
            palletsepalGitterboxSort.add(gitterboxA);

            Pallet gitterboxB = new Pallet(epalGitterboxSort, "CLASS B", gitterboxUrl);
            palletRepository.save(gitterboxB);
            palletsepalGitterboxSort.add(gitterboxB);

            Pallet gitterboxC = new Pallet(epalGitterboxSort, "CLASS C", gitterboxUrl);
            palletRepository.save(gitterboxC);
            palletsepalGitterboxSort.add(gitterboxC);

//            epalGitterboxSort.setPallets(palletsepalGitterboxSort);
            epalGitterboxSort = palletSortRepository.save(epalGitterboxSort);

// Add EPAL CP1 Palette
            PalletSort cp1Sort = new PalletSort("EPAL CP1", 1000, 1200, 138);
            palletSortRepository.save(cp1Sort);

            List<Pallet> palletscp1Sort = new ArrayList<>();

            String cp1Url = "https://www.epal-pallets.org/fileadmin/_processed_/f/6/csm_Epal_23.10.1727729_9d96a805c8.jpg";

            Pallet cp1New = new Pallet(cp1Sort, "NEW", cp1Url);
            palletRepository.save(cp1New);
            palletscp1Sort.add(cp1New);

            Pallet cp1A = new Pallet(cp1Sort, "CLASS A", cp1Url);
            palletRepository.save(cp1A);
            palletscp1Sort.add(cp1A);

            Pallet cp1B = new Pallet(cp1Sort, "CLASS B", cp1Url);
            palletRepository.save(cp1B);
            palletscp1Sort.add(cp1B);

            Pallet cp1C = new Pallet(cp1Sort, "CLASS C", cp1Url);
            palletRepository.save(cp1C);
            palletscp1Sort.add(cp1C);

//            cp1Sort.setPallets(palletscp1Sort);
            cp1Sort = palletSortRepository.save(cp1Sort);

// Add EPAL CP2 Palette
            PalletSort cp2Sort = new PalletSort("EPAL CP2", 800, 1200, 138);
            palletSortRepository.save(cp2Sort);

            List<Pallet> palletscp2Sort = new ArrayList<>();

            String cp2Url = "https://www.epal-pallets.org/fileadmin/_processed_/7/1/csm_Epal_23.10.1727735_173c2bed6b.jpg";

            Pallet cp2New = new Pallet(cp2Sort, "NEW", cp2Url);
            palletRepository.save(cp2New);
            palletscp2Sort.add(cp2New);

            Pallet cp2A = new Pallet(cp2Sort, "CLASS A", cp2Url);
            palletRepository.save(cp2A);
            palletscp2Sort.add(cp2A);

            Pallet cp2B = new Pallet(cp2Sort, "CLASS B", cp2Url);
            palletRepository.save(cp2B);
            palletscp2Sort.add(cp2B);

            Pallet cp2C = new Pallet(cp2Sort, "CLASS C", cp2Url);
            palletRepository.save(cp2C);
            palletscp2Sort.add(cp2C);

//            cp2Sort.setPallets(palletscp2Sort);
            cp2Sort = palletSortRepository.save(cp2Sort);

// Add EPAL CP3 Palette
            PalletSort cp3Sort = new PalletSort("EPAL CP3", 1140, 1140, 138);
            palletSortRepository.save(cp3Sort);

            List<Pallet> palletscp3Sort = new ArrayList<>();

            String cp3Url = "https://www.epal-pallets.org/fileadmin/_processed_/5/7/csm_Epal_23.10.1727758_ce60b4cbb0.jpg";

            Pallet cp3New = new Pallet(cp3Sort, "NEW", cp3Url);
            palletRepository.save(cp3New);
            palletscp3Sort.add(cp3New);

            Pallet cp3A = new Pallet(cp3Sort, "CLASS A", cp3Url);
            palletRepository.save(cp3A);
            palletscp3Sort.add(cp3A);

            Pallet cp3B = new Pallet(cp3Sort, "CLASS B", cp3Url);
            palletRepository.save(cp3B);
            palletscp3Sort.add(cp3B);

            Pallet cp3C = new Pallet(cp3Sort, "CLASS C", cp3Url);
            palletRepository.save(cp3C);
            palletscp3Sort.add(cp3C);

//            cp3Sort.setPallets(palletscp3Sort);
            cp3Sort = palletSortRepository.save(cp3Sort);

// Add EPAL CP4 Palette
            PalletSort cp4Sort = new PalletSort("EPAL CP4", 1100, 1300, 138);
            palletSortRepository.save(cp4Sort);

            List<Pallet> palletscp4Sort = new ArrayList<>();

            String cp4Url = "https://www.epal-pallets.org/fileadmin/_processed_/6/7/csm_Epal_23.10.1727747_402965843d.jpg";

            Pallet cp4New = new Pallet(cp4Sort, "NEW", cp4Url);
            palletRepository.save(cp4New);
            palletscp4Sort.add(cp4New);

            Pallet cp4A = new Pallet(cp4Sort, "CLASS A", cp4Url);
            palletRepository.save(cp4A);
            palletscp4Sort.add(cp4A);

            Pallet cp4B = new Pallet(cp4Sort, "CLASS B", cp4Url);
            palletRepository.save(cp4B);
            palletscp4Sort.add(cp4B);

            Pallet cp4C = new Pallet(cp4Sort, "CLASS C", cp4Url);
            palletRepository.save(cp4C);
            palletscp4Sort.add(cp4C);

//            cp4Sort.setPallets(palletscp4Sort);
            cp4Sort = palletSortRepository.save(cp4Sort);

// Add EPAL CP5 Palette
            PalletSort cp5Sort = new PalletSort("EPAL CP5", 760, 1140, 138);
            palletSortRepository.save(cp5Sort);

            List<Pallet> palletscp5Sort = new ArrayList<>();

            String cp5Url = "https://www.epal-pallets.org/fileadmin/_processed_/0/6/csm_Epal_23.10.1727738_3ab8bb1e39.jpg";

            Pallet cp5New = new Pallet(cp5Sort, "NEW", cp5Url);
            palletRepository.save(cp5New);
            palletscp5Sort.add(cp5New);

            Pallet cp5A = new Pallet(cp5Sort, "CLASS A", cp5Url);
            palletRepository.save(cp5A);
            palletscp5Sort.add(cp5A);

            Pallet cp5B = new Pallet(cp5Sort, "CLASS B", cp5Url);
            palletRepository.save(cp5B);
            palletscp5Sort.add(cp5B);

            Pallet cp5C = new Pallet(cp5Sort, "CLASS C", cp5Url);
            palletRepository.save(cp5C);
            palletscp5Sort.add(cp5C);

//            cp5Sort.setPallets(palletscp5Sort);
            cp5Sort = palletSortRepository.save(cp5Sort);

// Add EPAL CP6 Palette
            PalletSort cp6Sort = new PalletSort("EPAL CP6", 1200, 1000, 156);
            palletSortRepository.save(cp6Sort);

            List<Pallet> palletscp6Sort = new ArrayList<>();

            String cp6Url = "https://www.epal-pallets.org/fileadmin/_processed_/d/a/csm_Epal_23.10.1727761_1835de7432.jpg";

            Pallet cp6New = new Pallet(cp6Sort, "NEW", cp6Url);
            palletRepository.save(cp6New);
            palletscp6Sort.add(cp6New);

            Pallet cp6A = new Pallet(cp6Sort, "CLASS A", cp6Url);
            palletRepository.save(cp6A);
            palletscp6Sort.add(cp6A);

            Pallet cp6B = new Pallet(cp6Sort, "CLASS B", cp6Url);
            palletRepository.save(cp6B);
            palletscp6Sort.add(cp6B);

            Pallet cp6C = new Pallet(cp6Sort, "CLASS C", cp6Url);
            palletRepository.save(cp6C);
            palletscp6Sort.add(cp6C);

//            cp6Sort.setPallets(palletscp6Sort);
            cp6Sort = palletSortRepository.save(cp6Sort);

// Add EPAL CP7 Palette
            PalletSort cp7Sort = new PalletSort("EPAL CP7", 1300, 1100, 156);
            palletSortRepository.save(cp7Sort);

            List<Pallet> palletscp7Sort = new ArrayList<>();

            String cp7Url = "https://www.epal-pallets.org/fileadmin/_processed_/d/0/csm_Epal_23.10.1727756_67d3173d15.jpg";

            Pallet cp7New = new Pallet(cp7Sort, "NEW", cp7Url);
            palletRepository.save(cp7New);
            palletscp7Sort.add(cp7New);

            Pallet cp7A = new Pallet(cp7Sort, "CLASS A", cp7Url);
            palletRepository.save(cp7A);
            palletscp7Sort.add(cp7A);

            Pallet cp7B = new Pallet(cp7Sort, "CLASS B", cp7Url);
            palletRepository.save(cp7B);
            palletscp7Sort.add(cp7B);

            Pallet cp7C = new Pallet(cp7Sort, "CLASS C", cp7Url);
            palletRepository.save(cp7C);
            palletscp7Sort.add(cp7C);

//            cp7Sort.setPallets(palletscp7Sort);
            cp7Sort = palletSortRepository.save(cp7Sort);

// Add EPAL CP8 Palette
            PalletSort cp8Sort = new PalletSort("EPAL CP8", 1140, 1140, 156);
            palletSortRepository.save(cp8Sort);

            List<Pallet> palletscp8Sort = new ArrayList<>();

            String cp8Url = "https://www.epal-pallets.org/fileadmin/_processed_/7/9/csm_Epal_23.10.1727764_f57d38e241.jpg";

            Pallet cp8New = new Pallet(cp8Sort, "NEW", cp8Url);
            palletRepository.save(cp8New);
            palletscp8Sort.add(cp8New);

            Pallet cp8A = new Pallet(cp8Sort, "CLASS A", cp8Url);
            palletRepository.save(cp8A);
            palletscp8Sort.add(cp8A);

            Pallet cp8B = new Pallet(cp8Sort, "CLASS B", cp8Url);
            palletRepository.save(cp8B);
            palletscp8Sort.add(cp8B);

            Pallet cp8C = new Pallet(cp8Sort, "CLASS C", cp8Url);
            palletRepository.save(cp8C);
            palletscp8Sort.add(cp8C);

//            cp8Sort.setPallets(palletscp8Sort);
            cp8Sort = palletSortRepository.save(cp8Sort);

// Add EPAL CP9 Palette
            PalletSort cp9Sort = new PalletSort("EPAL CP9", 1140, 1140, 156);
            palletSortRepository.save(cp9Sort);

            List<Pallet> palletscp9Sort = new ArrayList<>();

            String cp9Url = "https://www.epal-pallets.org/fileadmin/_processed_/4/d/csm_Epal_23.10.1727740_2962ec05c7.jpg";

            Pallet cp9New = new Pallet(cp9Sort, "NEW", cp9Url);
            palletRepository.save(cp9New);
            palletscp9Sort.add(cp9New);

            Pallet cp9A = new Pallet(cp9Sort, "CLASS A", cp9Url);
            palletRepository.save(cp9A);
            palletscp9Sort.add(cp9A);

            Pallet cp9B = new Pallet(cp9Sort, "CLASS B", cp9Url);
            palletRepository.save(cp9B);
            palletscp9Sort.add(cp9B);

            Pallet cp9C = new Pallet(cp9Sort, "CLASS C", cp9Url);
            palletRepository.save(cp9C);
            palletscp9Sort.add(cp9C);

//            cp9Sort.setPallets(palletscp9Sort);
            cp9Sort = palletSortRepository.save(cp9Sort);

            // Add Company
            Company c1 = new Company();
            c1.setTitle("Schäfer Transport GmbH");
            c1.setStreet("Werner-von-Siemens-Str.");
            c1.setHouseNumber("5");
            c1.setPostalCode("37603");
            c1.setCity("Holzminden");
            c1.setHomepage("http://www.schaefer-transport.de/");
            c1.setVat("DE116008461");
            c1.setGermanyPickUp(false);
            c1.setEuPickUp(false);
            c1.setGermanyDeliver(false);
            companyRepository.save(c1);

            Employee e1 = new Employee();
            e1.setEmail("dingqing.he@web.de");
            e1.setCompany(c1);
            e1.setPassword(passwordEncoder.encode("123456"));
            e1.setFirstName("Jens");
            e1.setLastName("Groß");
            e1.setPreferredLanguage("DE");
            employeeRepository.save(e1);

            Company c2 = new Company();
            c2.setTitle("Alpha Paletten & Boxen GmbH & Co. KG");
            c2.setStreet("Dorfstraße");
            c2.setHouseNumber("79");
            c2.setPostalCode("49849");
            c2.setCity("Wilsum");
            c2.setHomepage("https://www.alpha-paletten.de/");
            c2.setVat("DE370160257");
            c2.setVerified(true);
            c2.setSeller(true);
            companyRepository.save(c2);

            Employee e2 = new Employee();
            e2.setEmail("stupidpaypil@web.de");
            e2.setCompany(c2);
            e2.setPassword(passwordEncoder.encode("123456"));
            e2.setFirstName("Johann-Heinrich");
            e2.setLastName("Ensink");
            e2.setPreferredLanguage("DE");
            employeeRepository.save(e2);

            Company c3 = new Company();
            c3.setTitle("Bremer Paletten-Kontor GmbH");
            c3.setStreet("Gutenbergstraße");
            c3.setHouseNumber("5A");
            c3.setPostalCode("28816");
            c3.setCity("Stuhr");
            c3.setHomepage("https://www.bremer-palettenkontor.de/");
            c3.setVat("DE811921533");
            c3.setSeller(true);
            companyRepository.save(c3);

/*
            CompanyPallet companyPallet1 = new CompanyPallet();
            companyPallet1.setCompany(c3);
            companyPallet1.setPallet(epalEuropaletteNew);
            companyPallet1.setDescription("Europaletten nach EPAL Standard");
            companyPallet1.setQuantity(500L);
            companyPalletRepository.save(companyPallet1);


            CompanyPallet companyPallet2 = new CompanyPallet();
            companyPallet2.setCompany(c3);
            companyPallet2.setPallet(gitterboxA);
            companyPallet2.setDescription("Gitterbox nach EPAL Standard Class A");
            companyPallet2.setQuantity(100L);
            companyPalletRepository.save(companyPallet2);

            CompanyPallet companyPallet3 = new CompanyPallet();
            companyPallet3.setCompany(c3);
            companyPallet3.setPallet(epal2B);
            companyPallet3.setDescription("Europaletten 2 nach EPAL Standard Class B");
            companyPallet3.setQuantity(200L);
            companyPalletRepository.save(companyPallet3);

            CompanyPallet companyPallet4 = new CompanyPallet();
            companyPallet4.setCompany(c3);
            companyPallet4.setPallet(epal3C);
            companyPallet4.setDescription("Europaletten 3 nach EPAL Standard Class C");
            companyPallet4.setQuantity(300L);
            companyPalletRepository.save(companyPallet4);



*/
            Employee e3 = new Employee();
            e3.setEmail("hdqeing@gmail.com");
            e3.setCompany(c3);
            e3.setPassword(passwordEncoder.encode("123456"));
            e3.setFirstName("Nina");
            e3.setLastName("Monsig");
            e3.setPreferredLanguage("EN");
            employeeRepository.save(e3);

            Query q1 = new Query();
            q1.setBuyer(c1);
            queryRepository.save(q1);

            QueryPallet queryPallet1 = new QueryPallet();
            queryPallet1.setQuery(q1);
            queryPallet1.setPallet(epalEuropaletteNew);
            queryPallet1.setQuantity(100);
            queryPalletRepository.save(queryPallet1);

            QueryPallet queryPallet2 = new QueryPallet();
            queryPallet2.setQuery(q1);
            queryPallet2.setPallet(gitterboxA);
            queryPallet2.setQuantity(50);
            queryPalletRepository.save(queryPallet2);


            Query q2 = new Query();
            q2.setBuyer(c1);

            queryRepository.save(q2);

            QuerySeller querySeller1 = new QuerySeller();
            querySeller1.setQuery(q2);
            querySeller1.setSeller(c3);
            querySellerRepository.save(querySeller1);

            QueryPallet queryPallet3 = new QueryPallet();
            queryPallet3.setQuery(q2);
            queryPallet3.setPallet(epalEuropaletteNew);
            queryPallet3.setQuantity(100);
            queryPalletRepository.save(queryPallet3);

            QueryPallet queryPallet4 = new QueryPallet();
            queryPallet4.setQuery(q2);
            queryPallet4.setPallet(gitterboxA);
            queryPallet4.setQuantity(50);
            queryPalletRepository.save(queryPallet4);

            Query q3 = new Query();
            q3.setBuyer(c1);

            queryRepository.save(q3);

            QueryPallet queryPallet5 = new QueryPallet();
            queryPallet5.setQuery(q3);
            queryPallet5.setPallet(epalEuropaletteB);
            queryPallet5.setQuantity(500);
            queryPalletRepository.save(queryPallet5);

            //Add data for stocks

            Photo photo1 = new Photo("1.jpg");
            Photo photo2 = new Photo("2.jpg");
            Photo photo3 = new Photo("3.jpg");
            Photo photo4 = new Photo("4.jpg");
            Photo photo5 = new Photo("5.jpg");
            Photo photo6 = new Photo("6.jpg");
            Photo photo7 = new Photo("7.jpg");
            Photo photo8 = new Photo("8.jpg");
            Photo photo9 = new Photo("9.jpg");
            Photo photo10 = new Photo("10.jpg");
            Photo photo11 = new Photo("11.jpg");
            Photo photo12 = new Photo("12.jpg");
            Photo photo13 = new Photo("13.jpg");

            Stock stock1 = new Stock();
            stock1.setCompany(c3);
            stock1.setPallet(epalEuropaletteNew);
            stock1.setPrice(10);
            stock1.setQuantity(5000);
            photo1.setStock(stock1);
            stock1.getPhotos().add(photo1);

            photo2.setStock(stock1);
            stock1.getPhotos().add(photo2);

            photo3.setStock(stock1);
            stock1.getPhotos().add(photo3);

            photo4.setStock(stock1);
            stock1.getPhotos().add(photo4);

            photo5.setStock(stock1);
            stock1.getPhotos().add(photo5);

            stockRepository.save(stock1);

            Stock stock2 = new Stock();
            stock2.setCompany(c3);
            stock2.setPrice(5.99);
            stock2.setQuantity(2000);
            stock2.setPallet(epal6A);

            photo6.setStock(stock2);
            stock2.getPhotos().add(photo6);

            photo7.setStock(stock2);
            stock2.getPhotos().add(photo7);

            stockRepository.save(stock2);

            Stock stock3 = new Stock();
            stock3.setCompany(c3);
            stock3.setPrice(7.99);
            stock3.setPallet(cp1New);
            stock3.setQuantity(5000);

            stockRepository.save(stock3);

            Stock stock4 = new Stock();
            stock4.setQuantity(2500);
            stock4.setCompany(c3);
            stock4.setPrice(3);
            stock4.setPallet(cp9C);
            photo8.setStock(stock4);
            stock4.getPhotos().add(photo8);

            stockRepository.save(stock4);

            Stock stock5 = new Stock();
            stock5.setQuantity(6000);
            stock5.setCompany(c3);
            stock5.setPrice(4.99);
            stock5.setPallet(cp2B);
            photo9.setStock(stock5);
            stock5.getPhotos().add(photo9);

            stockRepository.save(stock5);

            Stock stock6 = new Stock();
            stock6.setQuantity(500);
            stock6.setCompany(c3);
            stock6.setPrice(4.99);
            stock6.setPallet(gitterboxC);

            photo10.setStock(stock6);
            stock6.getPhotos().add(photo10);

            photo11.setStock(stock6);
            stock6.getPhotos().add(photo11);

            photo12.setStock(stock6);
            stock6.getPhotos().add(photo12);

            stockRepository.save(stock6);

            Stock stock7 = new Stock();
            stock7.setQuantity(1000);
            stock7.setCompany(c3);
            stock7.setPrice(20);
            stock7.setPallet(cp6A);
            photo13.setStock(stock7);
            stock7.getPhotos().add(photo13);

            stockRepository.save(stock7);




            log.info("Loaded {} queries with various states and negotiations", queryRepository.count());
            log.info("Loaded {} query pallets with prices and rounds", queryPalletRepository.count());





        };
    }
}
