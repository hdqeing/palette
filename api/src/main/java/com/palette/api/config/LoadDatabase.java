package com.palette.api.config;

import com.palette.api.model.Pallet;
import com.palette.api.model.PalletCategory;
import com.palette.api.model.PalletSort;
import com.palette.api.repository.PalletCategoryRepository;
import com.palette.api.repository.PalletRepository;
import com.palette.api.repository.PalletSortRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class LoadDatabase {
    private  static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

    @Bean
    CommandLineRunner initDatabase(PalletRepository palletRepository, PalletCategoryRepository palletCategoryRepository, PalletSortRepository palletSortRepository){
        return args -> {
            PalletCategory palletCategoryEpalEuropalette = new PalletCategory("EPAL Europalette");
            palletCategoryRepository.save(palletCategoryEpalEuropalette);
            PalletCategory palletCategoryEpal2 = new PalletCategory("EPAL 2");
            palletCategoryRepository.save(palletCategoryEpal2);
            PalletCategory palletCategoryEpal3 = new PalletCategory("EPAL 3");
            palletCategoryRepository.save(palletCategoryEpal3);
            PalletCategory palletCategoryEpal6 = new PalletCategory("EPAL 6 Halbpalette");
            palletCategoryRepository.save(palletCategoryEpal6);
            PalletCategory palletCategoryEpal7 = new PalletCategory("EPAL 7 Halbpalette");
            palletCategoryRepository.save(palletCategoryEpal7);
            PalletCategory palletCategoryEpalGitterbox = new PalletCategory("EPAL Gitterbox");
            palletCategoryRepository.save(palletCategoryEpalGitterbox);
            PalletCategory palletCategoryEpalCpPalette = new PalletCategory("EPAL CP-Palette");
            palletCategoryRepository.save(palletCategoryEpalCpPalette);

            List<PalletSort> palletSorts = new ArrayList<>();
            List<Pallet> pallets = new ArrayList<>();

//          Add EPAL Europalette
            PalletSort epalEuropaletteSort = new PalletSort("EPAL Europalette", 800, 1200, 144, palletCategoryEpalEuropalette);
            palletSorts.add(epalEuropaletteSort);

            Pallet epalEuropaletteNew = new Pallet(epalEuropaletteSort, "NEW", "https://www.epal-pallets.org/fileadmin/_processed_/9/0/csm_01_01_Produkbild_LO_EPAL_Europalette-Diagonal_krop_ec96a1b1b2.jpg");
            pallets.add(epalEuropaletteNew);

            Pallet epalEuropaletteA = new Pallet(epalEuropaletteSort, "CLASS A", "https://freiheit-moebelstudio.de/media/86/0f/b7/1619012322/europalette-palette-vollholz-vollholzkloetze-epal-moebelpalette-diy-gehobelt-freiheit-home.jpg");
            pallets.add(epalEuropaletteA);

            Pallet epalEuropaletteB = new Pallet(epalEuropaletteSort, "CLASS B", "https://freiheit-moebelstudio.de/media/a8/da/86/1622640720/paletten_2te-wahl_vollholzkloetze-epal-palettenservice-moebelbau-diy-freiheit-palettenmoebel-seitlich-2040.jpg");
            pallets.add(epalEuropaletteB);

            Pallet epalEuropaletteC = new Pallet(epalEuropaletteSort, "CLASS C", "https://palettenlogistik.ch/wp-content/uploads/2024/01/EPAL_Europalette_Klasse_C.jpg");
            pallets.add(epalEuropaletteC);


//          Add EPAL 2
            PalletSort epal2Sort = new PalletSort("EPAL 2", 1200, 1000, 162, palletCategoryEpal2);
            palletSorts.add(epal2Sort);

            Pallet epal2New = new Pallet(epal2Sort, "NEW", "https://www.epal-pallets.org/fileadmin/_processed_/6/b/csm_01_01_Produkbild_EPAL_industrial_pallet_2_diagonal_2c5d895a98.jpg");
            pallets.add(epal2New);

            Pallet epal2A = new Pallet(epal2Sort, "CLASS A", "https://p.turbosquid.com/ts-thumb/Qx/ULrc9H/itmornDO/pallet_eur2_turntable/png/1568205317/1920x1080/turn_fit_q99/52e620265ac4b85e740df9b95736f9232f4ba913/pallet_eur2_turntable-1.jpg");
            pallets.add(epal2A);

            Pallet epal2B = new Pallet(epal2Sort, "CLASS B", "https://dnssolution.vn/wp-content/uploads/2023/08/PALLET-EPAL-2-01.png");
            pallets.add(epal2B);

            Pallet epal2C = new Pallet(epal2Sort, "CLASS C", "https://to-ma.rs/media/catalog/product/cache/0dccd0f9956fe856d91bb5c73731e19d/t/o/toma_paete_epal_1200.jpg");
            pallets.add(epal2C);

//          Add EPAL 3
            PalletSort epal3Sort = new PalletSort("EPAL 3", 1200, 1000, 162, palletCategoryEpal3);
            palletSorts.add(epal3Sort);

            Pallet epal3New = new Pallet(epal3Sort, "NEW", "https://www.epal-pallets.org/fileadmin/user_upload/ntg_package/images/mediathek/Bilder/Ladungstraeger/EPAL_3_022017.jpg");
            pallets.add(epal3New);

            Pallet epal3A = new Pallet(epal3Sort, "CLASS A", "https://freiheit-moebelstudio.de/media/44/28/00/1621239362/palette-epal3-ispm15-ippc-industriepalette-100x120-palettenmoebel-freiheit-seite-0990.jpg");
            pallets.add(epal3A);

            Pallet epal3B = new Pallet(epal3Sort, "CLASS B", "https://www.krenzer-paletten.de/files/produkte/euro-paletten/technische-zeichnungen/Epal-Palette%20Euro3%20ohne%203%20klein.jpg");
            pallets.add(epal3B);

            Pallet epal3C = new Pallet(epal3Sort, "CLASS C", "https://jaywoodindustry.com/images/epal/epal3/EPAL_3_2.jpg");
            pallets.add(epal3C);

// Add EPAL 6
            PalletSort epal6Sort = new PalletSort("EPAL 6 Halbpalette", 800, 600, 144, palletCategoryEpal6);
            palletSorts.add(epal6Sort);

            Pallet epal6New = new Pallet(epal6Sort, "NEW", "https://www.epal-pallets.org/fileadmin/user_upload/ntg_package/images/01_01_Produkbild_EPAL_Euro_pallet_6.jpg");
            pallets.add(epal6New);

            Pallet epal6A = new Pallet(epal6Sort, "CLASS A", "https://www.mypalletsonline.com/241-large_default/holzpaletten-800-x-600-1-2-epal6.jpg");
            pallets.add(epal6A);

            Pallet epal6B = new Pallet(epal6Sort, "CLASS B", "https://www.neetwk.com/wp-content/uploads/2018/12/EPAL-6-half-pallets.jpg");
            pallets.add(epal6B);

            Pallet epal6C = new Pallet(epal6Sort, "CLASS C", "https://gerso-shop.de/media/images/org/euro-palette-epal-v.jpg");
            pallets.add(epal6C);


// Add EPAL 7
            PalletSort epal7Sort = new PalletSort("EPAL 7", 900, 600, 163, palletCategoryEpal7);
            palletSorts.add(epal7Sort);

            String epal7Url = "https://www.epal-pallets.org/fileadmin/_processed_/a/3/csm_190809_EPAL7_half_pallet_2019_d27959d38e.jpg";
            pallets.add(new Pallet(epal7Sort, "NEW", epal7Url));
            pallets.add(new Pallet(epal7Sort, "CLASS A", epal7Url));
            pallets.add(new Pallet(epal7Sort, "CLASS B", epal7Url));
            pallets.add(new Pallet(epal7Sort, "CLASS C", epal7Url));

// Add EPAL Gitterbox
            PalletSort epalGitterboxSort = new PalletSort("EPAL Gitterbox", 800, 1200, 970, palletCategoryEpalGitterbox);
            palletSorts.add(epalGitterboxSort);

            String gitterboxUrl = "https://www.epal-pallets.org/fileadmin/_processed_/3/d/csm_01_01_Produkbild_EPAL_box_pallet_diagonal_7cec70fd38.jpg";
            pallets.add(new Pallet(epalGitterboxSort, "NEW", gitterboxUrl));
            pallets.add(new Pallet(epalGitterboxSort, "CLASS A", gitterboxUrl));
            pallets.add(new Pallet(epalGitterboxSort, "CLASS B", gitterboxUrl));
            pallets.add(new Pallet(epalGitterboxSort, "CLASS C", gitterboxUrl));

// Add EPAL CP1 Palette
            PalletSort cp1Sort = new PalletSort("EPAL CP1", 1000, 1200, 138, palletCategoryEpalCpPalette);
            palletSorts.add(cp1Sort);

            String cp1Url = "https://www.epal-pallets.org/fileadmin/_processed_/f/6/csm_Epal_23.10.1727729_9d96a805c8.jpg";
            pallets.add(new Pallet(cp1Sort, "NEW", cp1Url));
            pallets.add(new Pallet(cp1Sort, "CLASS A", cp1Url));
            pallets.add(new Pallet(cp1Sort, "CLASS B", cp1Url));
            pallets.add(new Pallet(cp1Sort, "CLASS C", cp1Url));

// Add EPAL CP2 Palette
            PalletSort cp2Sort = new PalletSort("EPAL CP2", 800, 1200, 138, palletCategoryEpalCpPalette);
            palletSorts.add(cp2Sort);

            String cp2Url = "https://www.epal-pallets.org/fileadmin/_processed_/7/1/csm_Epal_23.10.1727735_173c2bed6b.jpg";
            pallets.add(new Pallet(cp2Sort, "NEW", cp2Url));
            pallets.add(new Pallet(cp2Sort, "CLASS A", cp2Url));
            pallets.add(new Pallet(cp2Sort, "CLASS B", cp2Url));
            pallets.add(new Pallet(cp2Sort, "CLASS C", cp2Url));

// Add EPAL CP3 Palette
            PalletSort cp3Sort = new PalletSort("EPAL CP3", 1140, 1140, 138, palletCategoryEpalCpPalette);
            palletSorts.add(cp3Sort);

            String cp3Url = "https://www.epal-pallets.org/fileadmin/_processed_/5/7/csm_Epal_23.10.1727758_ce60b4cbb0.jpg";
            pallets.add(new Pallet(cp3Sort, "NEW", cp3Url));
            pallets.add(new Pallet(cp3Sort, "CLASS A", cp3Url));
            pallets.add(new Pallet(cp3Sort, "CLASS B", cp3Url));
            pallets.add(new Pallet(cp3Sort, "CLASS C", cp3Url));

// Add EPAL CP4 Palette
            PalletSort cp4Sort = new PalletSort("EPAL CP4", 1100, 1300, 138, palletCategoryEpalCpPalette);
            palletSorts.add(cp4Sort);

            String cp4Url = "https://www.epal-pallets.org/fileadmin/_processed_/6/7/csm_Epal_23.10.1727747_402965843d.jpg";
            pallets.add(new Pallet(cp4Sort, "NEW", cp4Url));
            pallets.add(new Pallet(cp4Sort, "CLASS A", cp4Url));
            pallets.add(new Pallet(cp4Sort, "CLASS B", cp4Url));
            pallets.add(new Pallet(cp4Sort, "CLASS C", cp4Url));

// Add EPAL CP5 Palette
            PalletSort cp5Sort = new PalletSort("EPAL CP5", 760, 1140, 138, palletCategoryEpalCpPalette);
            palletSorts.add(cp5Sort);

            String cp5Url = "https://www.epal-pallets.org/fileadmin/_processed_/0/6/csm_Epal_23.10.1727738_3ab8bb1e39.jpg";
            pallets.add(new Pallet(cp5Sort, "NEW", cp5Url));
            pallets.add(new Pallet(cp5Sort, "CLASS A", cp5Url));
            pallets.add(new Pallet(cp5Sort, "CLASS B", cp5Url));
            pallets.add(new Pallet(cp5Sort, "CLASS C", cp5Url));

// Add EPAL CP6 Palette
            PalletSort cp6Sort = new PalletSort("EPAL CP6", 1200, 1000, 156, palletCategoryEpalCpPalette);
            palletSorts.add(cp6Sort);

            String cp6Url = "https://www.epal-pallets.org/fileadmin/_processed_/d/a/csm_Epal_23.10.1727761_1835de7432.jpg";
            pallets.add(new Pallet(cp6Sort, "NEW", cp6Url));
            pallets.add(new Pallet(cp6Sort, "CLASS A", cp6Url));
            pallets.add(new Pallet(cp6Sort, "CLASS B", cp6Url));
            pallets.add(new Pallet(cp6Sort, "CLASS C", cp6Url));

// Add EPAL CP7 Palette
            PalletSort cp7Sort = new PalletSort("EPAL CP7", 1300, 1100, 156, palletCategoryEpalCpPalette);
            palletSorts.add(cp7Sort);

            String cp7Url = "https://www.epal-pallets.org/fileadmin/_processed_/d/0/csm_Epal_23.10.1727756_67d3173d15.jpg";
            pallets.add(new Pallet(cp7Sort, "NEW", cp7Url));
            pallets.add(new Pallet(cp7Sort, "CLASS A", cp7Url));
            pallets.add(new Pallet(cp7Sort, "CLASS B", cp7Url));
            pallets.add(new Pallet(cp7Sort, "CLASS C", cp7Url));

// Add EPAL CP8 Palette
            PalletSort cp8Sort = new PalletSort("EPAL CP8", 1140, 1140, 156, palletCategoryEpalCpPalette);
            palletSorts.add(cp8Sort);

            String cp8Url = "https://www.epal-pallets.org/fileadmin/_processed_/7/9/csm_Epal_23.10.1727764_f57d38e241.jpg";
            pallets.add(new Pallet(cp8Sort, "NEW", cp8Url));
            pallets.add(new Pallet(cp8Sort, "CLASS A", cp8Url));
            pallets.add(new Pallet(cp8Sort, "CLASS B", cp8Url));
            pallets.add(new Pallet(cp8Sort, "CLASS C", cp8Url));

// Add EPAL CP9 Palette
            PalletSort cp9Sort = new PalletSort("EPAL CP9", 1140, 1140, 156, palletCategoryEpalCpPalette);
            palletSorts.add(cp9Sort);

            String cp9Url = "https://www.epal-pallets.org/fileadmin/_processed_/4/d/csm_Epal_23.10.1727740_2962ec05c7.jpg";
            pallets.add(new Pallet(cp9Sort, "NEW", cp9Url));
            pallets.add(new Pallet(cp9Sort, "CLASS A", cp9Url));
            pallets.add(new Pallet(cp9Sort, "CLASS B", cp9Url));
            pallets.add(new Pallet(cp9Sort, "CLASS C", cp9Url));

            for (PalletSort palletSort: palletSorts){
                palletSortRepository.save(palletSort);
            }

            for (Pallet pallet : pallets){
                palletRepository.save(pallet);
            }






        };
    }
}
