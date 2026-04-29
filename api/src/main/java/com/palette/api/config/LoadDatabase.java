package com.palette.api.config;

import com.palette.api.model.*;
import com.palette.api.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.ZoneId;
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

    @Value("${admin.password}")
    private String adminPassword;

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
            PalletSort epalEuropaletteSort = new PalletSort("epal_euro_pallet");
            palletSortRepository.save(epalEuropaletteSort);

            Pallet epalEuropaletteNew = new Pallet(
                    epalEuropaletteSort,
                    11,
                    78,
                    9,
                    800,
                    1200,
                    144,
                    "epal_euro_pallet",
                    1500,
                    25,
                    "new",
                    "https://www.epal-pallets.org/fileadmin/img/02_01_EPAL1/Content/01_01_Produkbild_LO_EPAL_Europalette-Diagonal.jpg"
            );
            palletRepository.save(epalEuropaletteNew);

            Pallet epalEuropaletteA = new Pallet(
                    epalEuropaletteSort,
                    11,
                    78,
                    9,
                    800,
                    1200,
                    144,
                    "epal_euro_pallet",
                    1500,
                    25,
                    "class_a",
                    "https://freiheit-moebelstudio.de/media/86/0f/b7/1619012322/europalette-palette-vollholz-vollholzkloetze-epal-moebelpalette-diy-gehobelt-freiheit-home.jpg"
            );
            palletRepository.save(epalEuropaletteA);


            Pallet epalEuropaletteB = new Pallet(
                    epalEuropaletteSort,
                    11,
                    78,
                    9,
                    800,
                    1200,
                    144,
                    "epal_euro_pallet",
                    1500,
                    25,
                    "class_b",
                    "https://freiheit-moebelstudio.de/media/a8/da/86/1622640720/paletten_2te-wahl_vollholzkloetze-epal-palettenservice-moebelbau-diy-freiheit-palettenmoebel-seitlich-2040.jpg"
            );
            palletRepository.save(epalEuropaletteB);


            Pallet epalEuropaletteC = new Pallet(
                    epalEuropaletteSort,
                    11,
                    78,
                    9,
                    800,
                    1200,
                    144,
                    "epal_euro_pallet",
                    1500,
                    25,
                    "class_c",
                    "https://palettenlogistik.ch/wp-content/uploads/2024/01/EPAL_Europalette_Klasse_C.jpg"
            );

            palletRepository.save(epalEuropaletteC);





// Add EPAL 2
            PalletSort epal2Sort = new PalletSort("epal_2_pallet");
            palletSortRepository.save(epal2Sort);

            Pallet epal2New = new Pallet(
                    epal2Sort,
                    17,
                    133,
                    9,
                    1000,
                    1200,
                    162,
                    "epal_2_pallet",
                    1250,
                    35,
                    "new",
                    "https://www.epal-pallets.org/fileadmin/_processed_/6/b/csm_01_01_Produkbild_EPAL_industrial_pallet_2_diagonal_2c5d895a98.jpg"
            );
            palletRepository.save(epal2New);

            Pallet epal2A = new Pallet(
                    epal2Sort,
                    17,
                    133,
                    9,
                    1000,
                    1200,
                    162,
                    "epal_2_pallet",
                    1250,
                    35,
                    "class_a",
                    "https://p.turbosquid.com/ts-thumb/Qx/ULrc9H/itmornDO/pallet_eur2_turntable/png/1568205317/1920x1080/turn_fit_q99/52e620265ac4b85e740df9b95736f9232f4ba913/pallet_eur2_turntable-1.jpg"
            );
            palletRepository.save(epal2A);

            Pallet epal2B = new Pallet(
                    epal2Sort,
                    17,
                    133,
                    9,
                    1000,
                    1200,
                    162,
                    "epal_2_pallet",
                    1250,
                    35,
                    "class_b",
                    "https://dnssolution.vn/wp-content/uploads/2023/08/PALLET-EPAL-2-01.png"
            );
            palletRepository.save(epal2B);

            Pallet epal2C = new Pallet(
                    epal2Sort,
                    17,
                    133,
                    9,
                    1000,
                    1200,
                    162,
                    "epal_2_pallet",
                    1250,
                    35,
                    "class_c",
                    "https://to-ma.rs/media/catalog/product/cache/0dccd0f9956fe856d91bb5c73731e19d/t/o/toma_paete_epal_1200.jpg"
            );
            palletRepository.save(epal2C);

// Add EPAL 3
            PalletSort epal3Sort = new PalletSort("epal_3_pallet");
            palletSortRepository.save(epal3Sort);

            Pallet epal3New = new Pallet(
                    epal3Sort,
                    13,
                    84,
                    9,
                    1200,
                    1000,
                    144,
                    "epal_3_pallet",
                    1500,
                    30,
                    "new",
                    "https://www.epal-pallets.org/fileadmin/user_upload/ntg_package/images/mediathek/Bilder/Ladungstraeger/EPAL_3_022017.jpg"
            );
            palletRepository.save(epal3New);

            Pallet epal3A = new Pallet(
                    epal3Sort,
                    13,
                    84,
                    9,
                    1200,
                    1000,
                    144,
                    "epal_3_pallet",
                    1500,
                    30,
                    "class_a",
                    "https://freiheit-moebelstudio.de/media/44/28/00/1621239362/palette-epal3-ispm15-ippc-industriepalette-100x120-palettenmoebel-freiheit-seite-0990.jpg"
            );
            palletRepository.save(epal3A);

            Pallet epal3B = new Pallet(
                    epal3Sort,
                    13,
                    84,
                    9,
                    1200,
                    1000,
                    144,
                    "epal_3_pallet",
                    1500,
                    30,
                    "class_b",
                    "https://www.krenzer-paletten.de/files/produkte/euro-paletten/technische-zeichnungen/Epal-Palette%20Euro3%20ohne%203%20klein.jpg"
            );
            palletRepository.save(epal3B);

            Pallet epal3C = new Pallet(
                    epal3Sort,
                    13,
                    84,
                    9,
                    1200,
                    1000,
                    144,
                    "epal_3_pallet",
                    1500,
                    30,
                    "class_c",
                    "https://jaywoodindustry.com/images/epal/epal3/EPAL_3_2.jpg"
            );
            palletRepository.save(epal3C);

// Add EPAL 6
            PalletSort epal6Sort = new PalletSort("epal_6_half_pallet");
            palletSortRepository.save(epal6Sort);

            Pallet epal6New = new Pallet(
                    epal6Sort,
                    13,
                    69,
                    9,
                    600,
                    800,
                    144,
                    "epal_6_half_pallet",
                    750,
                    9.5,
                    "new",
                    "https://www.epal-pallets.org/fileadmin/user_upload/ntg_package/images/01_01_Produkbild_EPAL_Euro_pallet_6.jpg"
            );
            palletRepository.save(epal6New);

            Pallet epal6A = new Pallet(
                    epal6Sort,
                    13,
                    69,
                    9,
                    600,
                    800,
                    144,
                    "epal_6_half_pallet",
                    750,
                    9.5,
                    "class_a",
                    "https://www.mypalletsonline.com/241-large_default/holzpaletten-800-x-600-1-2-epal6.jpg"
            );
            palletRepository.save(epal6A);

            Pallet epal6B = new Pallet(
                    epal6Sort,
                    13,
                    69,
                    9,
                    600,
                    800,
                    144,
                    "epal_6_half_pallet",
                    750,
                    9.5,
                    "class_b",
                    "https://www.neetwk.com/wp-content/uploads/2018/12/EPAL-6-half-pallets.jpg"
            );
            palletRepository.save(epal6B);

            Pallet epal6C = new Pallet(
                    epal6Sort,
                    13,
                    69,
                    9,
                    600,
                    800,
                    144,
                    "epal_6_half_pallet",
                    750,
                    9.5,
                    "class_c",
                    "https://gerso-shop.de/media/images/org/euro-palette-epal-v.jpg"
            );
            palletRepository.save(epal6C);

// Add EPAL 7
            String epal7Url = "https://www.epal-pallets.org/fileadmin/_processed_/a/3/csm_190809_EPAL7_half_pallet_2019_d27959d38e.jpg";

            PalletSort epal7Sort = new PalletSort("epal_7_half_pallet");
            palletSortRepository.save(epal7Sort);

            Pallet epal7New = new Pallet(
                    epal7Sort,
                    13,
                    42,
                    3,
                    600,
                    800,
                    163,
                    "epal_7_half_pallet",
                    500,
                    9.5,
                    "new",
                    epal7Url
            );
            palletRepository.save(epal7New);

            Pallet epal7A = new Pallet(
                    epal7Sort,
                    13,
                    42,
                    3,
                    600,
                    800,
                    163,
                    "epal_7_half_pallet",
                    500,
                    9.5,
                    "class_a",
                    epal7Url
            );
            palletRepository.save(epal7A);

            Pallet epal7B = new Pallet(
                    epal7Sort,
                    13,
                    42,
                    3,
                    600,
                    800,
                    163,
                    "epal_7_half_pallet",
                    500,
                    9.5,
                    "class_b",
                    epal7Url
            );
            palletRepository.save(epal7B);

            Pallet epal7C = new Pallet(
                    epal7Sort,
                    13,
                    42,
                    3,
                    600,
                    800,
                    163,
                    "epal_7_half_pallet",
                    500,
                    9.5,
                    "class_c",
                    epal7Url
            );
            palletRepository.save(epal7C);

// Add EPAL Gitterbox
            String gitterboxUrl = "https://www.epal-pallets.org/fileadmin/_processed_/3/d/csm_01_01_Produkbild_EPAL_box_pallet_diagonal_7cec70fd38.jpg";

            PalletSort epalGitterboxSort = new PalletSort("epal_box_pallet");
            palletSortRepository.save(epalGitterboxSort);

            Pallet gitterboxNew = new Pallet(
                    epalGitterboxSort,
                    4,
                    0,          // no nails → using 0
                    0,          // no blocks → using 0
                    800,
                    1200,
                    970,
                    "epal_box_pallet",
                    1500,
                    70,
                    "new",
                    gitterboxUrl
            );
            palletRepository.save(gitterboxNew);

            Pallet gitterboxA = new Pallet(
                    epalGitterboxSort,
                    4,
                    0,
                    0,
                    800,
                    1200,
                    970,
                    "epal_box_pallet",
                    1500,
                    70,
                    "class_a",
                    gitterboxUrl
            );
            palletRepository.save(gitterboxA);

            Pallet gitterboxB = new Pallet(
                    epalGitterboxSort,
                    4,
                    0,
                    0,
                    800,
                    1200,
                    970,
                    "epal_box_pallet",
                    1500,
                    70,
                    "class_b",
                    gitterboxUrl
            );
            palletRepository.save(gitterboxB);

            Pallet gitterboxC = new Pallet(
                    epalGitterboxSort,
                    4,
                    0,
                    0,
                    800,
                    1200,
                    970,
                    "epal_box_pallet",
                    1500,
                    70,
                    "class_c",
                    gitterboxUrl
            );
            palletRepository.save(gitterboxC);
//            epalGitterboxSort.setPallets(palletsepalGitterboxSort);
            epalGitterboxSort = palletSortRepository.save(epalGitterboxSort);

// Add EPAL CP1-CP9 Palette
            PalletSort epalCpPalletsSort = new PalletSort("epal_cp_pallets");
            palletSortRepository.save(epalCpPalletsSort);

            String cp1Url = "https://www.epal-pallets.org/fileadmin/_processed_/f/6/csm_Epal_23.10.1727729_9d96a805c8.jpg";
            String cp2Url = "https://www.epal-pallets.org/fileadmin/_processed_/7/1/csm_Epal_23.10.1727735_173c2bed6b.jpg";
            String cp3Url = "https://www.epal-pallets.org/fileadmin/_processed_/5/7/csm_Epal_23.10.1727758_ce60b4cbb0.jpg";
            String cp4Url = "https://www.epal-pallets.org/fileadmin/_processed_/6/7/csm_Epal_23.10.1727747_402965843d.jpg";
            String cp5Url = "https://www.epal-pallets.org/fileadmin/_processed_/0/6/csm_Epal_23.10.1727738_3ab8bb1e39.jpg";
            String cp6Url = "https://www.epal-pallets.org/fileadmin/_processed_/d/a/csm_Epal_23.10.1727761_1835de7432.jpg";
            String cp7Url = "https://www.epal-pallets.org/fileadmin/_processed_/d/0/csm_Epal_23.10.1727756_67d3173d15.jpg";
            String cp8Url = "https://www.epal-pallets.org/fileadmin/_processed_/7/9/csm_Epal_23.10.1727764_f57d38e241.jpg";
            String cp9Url = "https://www.epal-pallets.org/fileadmin/_processed_/4/d/csm_Epal_23.10.1727740_2962ec05c7.jpg";

            String[] conditions = {"new", "class_a", "class_b", "class_c"};

            for (String condition : conditions) {
                palletRepository.save(new Pallet(epalCpPalletsSort, 0, 0, 0, 1000, 1200, 138, "epal_cp1", 0, 0, condition, cp1Url));
                palletRepository.save(new Pallet(epalCpPalletsSort, 0, 0, 0, 800, 1200, 138, "epal_cp2", 0, 0, condition, cp2Url));
                palletRepository.save(new Pallet(epalCpPalletsSort, 0, 0, 0, 1140, 1140, 138, "epal_cp3", 0, 0, condition, cp3Url));
                palletRepository.save(new Pallet(epalCpPalletsSort, 0, 0, 0, 1100, 1300, 138, "epal_cp4", 0, 0, condition, cp4Url));
                palletRepository.save(new Pallet(epalCpPalletsSort, 0, 0, 0, 760, 1140, 138, "epal_cp5", 0, 0, condition, cp5Url));
                palletRepository.save(new Pallet(epalCpPalletsSort, 0, 0, 0, 1200, 1000, 156, "epal_cp6", 0, 0, condition, cp6Url));
                palletRepository.save(new Pallet(epalCpPalletsSort, 0, 0, 0, 1300, 1100, 156, "epal_cp7", 0, 0, condition, cp7Url));
                palletRepository.save(new Pallet(epalCpPalletsSort, 0, 0, 0, 1140, 1140, 156, "epal_cp8", 0, 0, condition, cp8Url));
                palletRepository.save(new Pallet(epalCpPalletsSort, 0, 0, 0, 1140, 1140, 156, "epal_cp9", 0, 0, condition, cp9Url));
            }


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

            Employee admin = new Employee();
            admin.setUsername("admin");
            admin.setEmail("admin@palette365.de");
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setAdmin(true);
            employeeRepository.save(admin);


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
            e3.setPreferredLanguage("GB");
            employeeRepository.save(e3);

            Query q1 = new Query();
            q1.setBuyer(c1);
            q1.setIsClosed(false);
            q1.setDeadline(ZonedDateTime.of(2027,01,01,00,00,00,00, ZoneId.of("UTC")));
            queryRepository.save(q1);

            QuerySeller query1Seller2 = new QuerySeller();
            query1Seller2.setQuery(q1);
            query1Seller2.setSeller(c2);
            querySellerRepository.save(query1Seller2);


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
            q2.setIsClosed(false);
            q2.setDeadline(ZonedDateTime.of(2026,07,01,0,0,0,0,ZoneId.of("UTC")));

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
            q3.setIsClosed(true);
            q3.setDeadline(ZonedDateTime.of(2025,1,1,0,0,0,0, ZoneId.of("UTC")));

            queryRepository.save(q3);

            QuerySeller query3Seller2 = new QuerySeller();
            query3Seller2.setQuery(q3);
            query3Seller2.setSeller(c2);
            querySellerRepository.save(query3Seller2);

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
            stock3.setPallet(epalEuropaletteB);
            stock3.setQuantity(5000);

            stockRepository.save(stock3);

            Stock stock4 = new Stock();
            stock4.setQuantity(2500);
            stock4.setCompany(c3);
            stock4.setPrice(3);
            stock4.setPallet(epal6A);
            photo8.setStock(stock4);
            stock4.getPhotos().add(photo8);

            stockRepository.save(stock4);

            Stock stock5 = new Stock();
            stock5.setQuantity(6000);
            stock5.setCompany(c3);
            stock5.setPrice(4.99);
            stock5.setPallet(epal7New);
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
            stock7.setPallet(gitterboxNew);
            photo13.setStock(stock7);
            stock7.getPhotos().add(photo13);

            stockRepository.save(stock7);




            log.info("Loaded {} queries with various states and negotiations", queryRepository.count());
            log.info("Loaded {} query pallets with prices and rounds", queryPalletRepository.count());





        };
    }
}
