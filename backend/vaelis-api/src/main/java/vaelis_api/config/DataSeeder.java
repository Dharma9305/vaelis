package vaelis_api.config;

import vaelis_api.entity.Product;
import vaelis_api.entity.ProductSpecification;
import vaelis_api.repository.ProductRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedProducts(ProductRepository repository) {

        return args -> {

            if (repository.count() > 0) {
                return;
            }

            Product air = new Product();
            air.setId("vaelis-air");
            air.setSlug("vaelis-air");
            air.setName("VAELIS Air");
            air.setCategory("Audio");
            air.setShortDescription("Immersive sound. Refined.");
            air.setDescription(
                "VAELIS Air delivers rich, detailed sound in a refined wireless design created for modern everyday listening."
            );
            air.setPrice(2999.0);
            air.setCurrency("INR");
            air.setBadge("New");
            air.setRating(4.8);
            air.setReviewCount(124);
            air.setInStock(true);

            air.setColors(List.of(
                "Obsidian Black",
                "Pearl White"
            ));

            air.setFeatures(List.of(
                "Active Noise Cancellation",
                "AI-Enhanced ENC Calling",
                "Bluetooth 5.4",
                "Up to 40 hours battery",
                "USB-C fast charging",
                "Low latency gaming mode",
                "IPX5 water resistance"
            ));

            air.setSpecifications(List.of(
                new ProductSpecification("Bluetooth", "5.4"),
                new ProductSpecification("Battery", "Up to 40 hours"),
                new ProductSpecification("Charging", "USB-C"),
                new ProductSpecification("Noise Cancellation", "Active ANC"),
                new ProductSpecification("Water Resistance", "IPX5"),
                new ProductSpecification("Warranty", "1 Year")
            ));


            Product airPro = new Product();
            airPro.setId("vaelis-air-pro");
            airPro.setSlug("vaelis-air-pro");
            airPro.setName("VAELIS Air Pro");
            airPro.setCategory("Audio");
            airPro.setShortDescription("Silence the world. Hear more.");
            airPro.setDescription(
                "VAELIS Air Pro combines immersive audio, advanced noise cancellation and premium craftsmanship for an elevated listening experience."
            );
            airPro.setPrice(4999.0);
            airPro.setCurrency("INR");
            airPro.setBadge("Premium");
            airPro.setRating(4.9);
            airPro.setReviewCount(86);
            airPro.setInStock(true);

            airPro.setColors(List.of(
                "Titanium Black",
                "Champagne Gold"
            ));

            airPro.setFeatures(List.of(
                "Adaptive Active Noise Cancellation",
                "AI ENC crystal-clear calls",
                "Bluetooth 5.4",
                "Up to 45 hours battery",
                "Wireless charging",
                "Gaming low latency mode",
                "IPX5 water resistance"
            ));

            airPro.setSpecifications(List.of(
                new ProductSpecification("Bluetooth", "5.4"),
                new ProductSpecification("Battery", "Up to 45 hours"),
                new ProductSpecification("Charging", "USB-C + Wireless"),
                new ProductSpecification("Noise Cancellation", "Adaptive ANC"),
                new ProductSpecification("Water Resistance", "IPX5"),
                new ProductSpecification("Warranty", "1 Year")
            ));


            Product charge65 = new Product();
            charge65.setId("vaelis-charge-65");
            charge65.setSlug("vaelis-charge-65");
            charge65.setName("VAELIS Charge 65W");
            charge65.setCategory("Power");
            charge65.setShortDescription("Power, beautifully engineered.");
            charge65.setDescription(
                "A compact 65W fast charger designed to power your everyday devices with speed and efficiency."
            );
            charge65.setPrice(2499.0);
            charge65.setCurrency("INR");
            charge65.setBadge("Fast Charge");
            charge65.setRating(4.7);
            charge65.setReviewCount(51);
            charge65.setInStock(true);

            charge65.setColors(List.of("Midnight Black"));

            charge65.setFeatures(List.of(
                "65W fast charging",
                "GaN technology",
                "USB-C Power Delivery",
                "Multi-device charging",
                "Over-voltage protection",
                "Temperature protection"
            ));

            charge65.setSpecifications(List.of(
                new ProductSpecification("Power", "65W"),
                new ProductSpecification("Technology", "GaN"),
                new ProductSpecification("Port", "USB-C"),
                new ProductSpecification("Input", "100-240V"),
                new ProductSpecification("Warranty", "1 Year")
            ));


            Product power20k = new Product();
            power20k.setId("vaelis-power-20k");
            power20k.setSlug("vaelis-power-20k");
            power20k.setName("VAELIS Power 20K");
            power20k.setCategory("Power");
            power20k.setShortDescription("Power that travels with you.");
            power20k.setDescription(
                "A high-capacity 20,000mAh power bank designed for reliable power throughout your day."
            );
            power20k.setPrice(2999.0);
            power20k.setCurrency("INR");
            power20k.setBadge("Best Seller");
            power20k.setRating(4.8);
            power20k.setReviewCount(73);
            power20k.setInStock(true);

            power20k.setColors(List.of("Graphite Black"));

            power20k.setFeatures(List.of(
                "20,000mAh capacity",
                "22.5W fast charging",
                "USB-C input/output",
                "Dual USB output",
                "LED battery indicator",
                "Multiple safety protections"
            ));

            power20k.setSpecifications(List.of(
                new ProductSpecification("Capacity", "20,000mAh"),
                new ProductSpecification("Output", "22.5W"),
                new ProductSpecification("Input", "USB-C"),
                new ProductSpecification("Outputs", "USB-C + USB-A"),
                new ProductSpecification("Warranty", "1 Year")
            ));


            Product soundOne = new Product();
            soundOne.setId("vaelis-sound-one");
            soundOne.setSlug("vaelis-sound-one");
            soundOne.setName("VAELIS Sound One");
            soundOne.setCategory("Audio");
            soundOne.setShortDescription("Sound that fills the room.");
            soundOne.setDescription(
                "A premium wireless speaker designed to deliver powerful sound with an elegant, minimal form."
            );
            soundOne.setPrice(3999.0);
            soundOne.setCurrency("INR");
            soundOne.setBadge("New");
            soundOne.setRating(4.8);
            soundOne.setReviewCount(42);
            soundOne.setInStock(true);

            soundOne.setColors(List.of(
                "Obsidian Black",
                "Stone White"
            ));

            soundOne.setFeatures(List.of(
                "360° immersive sound",
                "Bluetooth 5.3",
                "Up to 20 hours battery",
                "Stereo pairing",
                "IPX6 water resistance",
                "USB-C charging"
            ));

            soundOne.setSpecifications(List.of(
                new ProductSpecification("Bluetooth", "5.3"),
                new ProductSpecification("Battery", "Up to 20 hours"),
                new ProductSpecification("Charging", "USB-C"),
                new ProductSpecification("Water Resistance", "IPX6"),
                new ProductSpecification("Warranty", "1 Year")
            ));


            Product watchOne = new Product();
            watchOne.setId("vaelis-watch-one");
            watchOne.setSlug("vaelis-watch-one");
            watchOne.setName("VAELIS Watch One");
            watchOne.setCategory("Wearables");
            watchOne.setShortDescription("Intelligence on your wrist.");
            watchOne.setDescription(
                "A sophisticated smartwatch concept combining a premium display, intelligent features and everyday wellness tracking."
            );
            watchOne.setPrice(5999.0);
            watchOne.setCurrency("INR");
            watchOne.setBadge("Coming Soon");
            watchOne.setRating(4.9);
            watchOne.setReviewCount(0);
            watchOne.setInStock(false);

            watchOne.setColors(List.of(
                "Titanium Black",
                "Silver"
            ));

            watchOne.setFeatures(List.of(
                "Premium AMOLED display",
                "Bluetooth calling",
                "Activity tracking",
                "Heart-rate monitoring",
                "Sleep tracking",
                "IP68 water resistance"
            ));

            watchOne.setSpecifications(List.of(
                new ProductSpecification("Display", "AMOLED"),
                new ProductSpecification("Calling", "Bluetooth Calling"),
                new ProductSpecification("Water Resistance", "IP68"),
                new ProductSpecification("Charging", "Magnetic"),
                new ProductSpecification("Warranty", "1 Year")
            ));


            repository.saveAll(List.of(
                air,
                airPro,
                charge65,
                power20k,
                soundOne,
                watchOne
            ));

            System.out.println("======================================");
            System.out.println("VAELIS PRODUCTS SEEDED SUCCESSFULLY");
            System.out.println("Products added: 6");
            System.out.println("======================================");
        };
    }
}