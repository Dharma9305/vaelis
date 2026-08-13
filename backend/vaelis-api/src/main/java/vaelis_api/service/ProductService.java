package vaelis_api.service;

import vaelis_api.entity.Product;
import vaelis_api.entity.ProductImage;
import vaelis_api.repository.ProductImageRepository;
import vaelis_api.repository.ProductRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    private final ProductImageRepository
            productImageRepository;

    public ProductService(
            ProductRepository productRepository,
            ProductImageRepository
                    productImageRepository) {

        this.productRepository =
                productRepository;

        this.productImageRepository =
                productImageRepository;
    }

    // =========================
    // GET ALL PRODUCTS
    // =========================

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }

    // =========================
    // GET PRODUCT BY SLUG
    // =========================

    @Transactional(readOnly = true)
    public Optional<Product> getProductBySlug(
            String slug) {

        return productRepository
                .findBySlug(slug);
    }

    // =========================
    // CREATE PRODUCT
    // =========================

    @Transactional
    public Product createProduct(
            Product product) {

        if (productRepository.existsById(
                product.getId())) {

            throw new IllegalArgumentException(
                    "Product ID already exists: "
                            + product.getId()
            );
        }

        if (productRepository
                .findBySlug(product.getSlug())
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Product slug already exists: "
                            + product.getSlug()
            );
        }

        prepareProductImages(product);

        return productRepository.save(product);
    }

    // =========================
    // UPDATE PRODUCT
    // =========================

    @Transactional
    public Product updateProduct(
            String id,
            Product updatedProduct) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found: "
                                                + id
                                )
                        );

        product.setSlug(
                updatedProduct.getSlug()
        );

        product.setName(
                updatedProduct.getName()
        );

        product.setCategory(
                updatedProduct.getCategory()
        );

        product.setShortDescription(
                updatedProduct
                        .getShortDescription()
        );

        product.setDescription(
                updatedProduct.getDescription()
        );

        product.setPrice(
                updatedProduct.getPrice()
        );

        product.setOriginalPrice(
                updatedProduct
                        .getOriginalPrice()
        );

        product.setCurrency(
                updatedProduct.getCurrency()
        );

        product.setBadge(
                updatedProduct.getBadge()
        );

        product.setRating(
                updatedProduct.getRating()
        );

        product.setReviewCount(
                updatedProduct
                        .getReviewCount()
        );

        product.setInStock(
                updatedProduct.getInStock()
        );

        product.setColors(
                updatedProduct.getColors()
        );

        product.setFeatures(
                updatedProduct.getFeatures()
        );

        product.setSpecifications(
                updatedProduct
                        .getSpecifications()
        );

        // Replace images safely
        product.getImages().clear();

        if (updatedProduct.getImages()
                != null) {

            for (ProductImage image :
                    updatedProduct.getImages()) {

                image.setId(null);

                image.setProduct(product);

                product.getImages()
                        .add(image);
            }
        }

        prepareProductImages(product);

        return productRepository.save(product);
    }

    // =========================
    // UPDATE STOCK
    // =========================

    @Transactional
    public Product updateStock(
            String id,
            Boolean inStock) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found: "
                                                + id
                                )
                        );

        product.setInStock(inStock);

        return productRepository.save(product);
    }

    // =========================
    // DELETE PRODUCT
    // =========================

    @Transactional
    public void deleteProduct(
            String id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found: "
                                                + id
                                )
                        );

        productRepository.delete(product);
    }

    // =========================
    // GET PRODUCT IMAGES
    // =========================

    @Transactional(readOnly = true)
    public List<ProductImage>
    getProductImages(String productId) {

        if (!productRepository.existsById(
                productId)) {

            throw new RuntimeException(
                    "Product not found: "
                            + productId
            );
        }

        return productImageRepository
                .findByProductIdOrderBySortOrderAsc(
                        productId
                );
    }

    // =========================
    // ADD IMAGE
    // =========================

    @Transactional
    public ProductImage addProductImage(
            String productId,
            ProductImage image) {

        Product product =
                productRepository.findById(
                        productId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Product not found: "
                                        + productId
                        )
                );

        if (image.getImageUrl() == null ||
                image.getImageUrl()
                        .trim()
                        .isEmpty()) {

            throw new IllegalArgumentException(
                    "Image URL is required"
            );
        }

        image.setId(null);

        image.setProduct(product);

        if (image.getSortOrder() == null) {
            image.setSortOrder(
                    product.getImages().size()
            );
        }

        if (image.getPrimaryImage() == null) {
            image.setPrimaryImage(false);
        }

        // If this image is primary,
        // remove primary flag from others.
        if (Boolean.TRUE.equals(
                image.getPrimaryImage())) {

            clearPrimaryImage(productId);
        }

        ProductImage saved =
                productImageRepository.save(
                        image
                );

        product.getImages().add(saved);

        return saved;
    }

    // =========================
    // UPDATE IMAGE
    // =========================

    @Transactional
    public ProductImage updateProductImage(
            Long imageId,
            ProductImage updatedImage) {

        ProductImage image =
                productImageRepository
                        .findById(imageId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Image not found: "
                                                + imageId
                                )
                        );

        image.setImageUrl(
                updatedImage.getImageUrl()
        );

        image.setAltText(
                updatedImage.getAltText()
        );

        image.setSortOrder(
                updatedImage.getSortOrder()
        );

        if (Boolean.TRUE.equals(
                updatedImage.getPrimaryImage())) {

            clearPrimaryImage(
                    image.getProduct()
                            .getId()
            );

            image.setPrimaryImage(true);

        } else {

            image.setPrimaryImage(false);
        }

        return productImageRepository.save(
                image
        );
    }

    // =========================
    // DELETE IMAGE
    // =========================

    @Transactional
    public void deleteProductImage(
            Long imageId) {

        ProductImage image =
                productImageRepository
                        .findById(imageId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Image not found: "
                                                + imageId
                                )
                        );

        productImageRepository.delete(
                image
        );
    }

    // =========================
    // SET PRIMARY IMAGE
    // =========================

    @Transactional
    public ProductImage setPrimaryImage(
            Long imageId) {

        ProductImage image =
                productImageRepository
                        .findById(imageId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Image not found: "
                                                + imageId
                                )
                        );

        clearPrimaryImage(
                image.getProduct()
                        .getId()
        );

        image.setPrimaryImage(true);

        return productImageRepository.save(
                image
        );
    }

    // =========================
    // CLEAR PRIMARY IMAGE
    // =========================

    private void clearPrimaryImage(
            String productId) {

        List<ProductImage> images =
                productImageRepository
                        .findByProductIdOrderBySortOrderAsc(
                                productId
                        );

        for (ProductImage image :
                images) {

            image.setPrimaryImage(false);
        }

        productImageRepository.saveAll(
                images
        );
    }

    // =========================
    // PREPARE IMAGES
    // =========================

    private void prepareProductImages(
            Product product) {

        if (product.getImages() == null) {
            return;
        }

        int order = 0;

        boolean primaryFound = false;

        for (ProductImage image :
                product.getImages()) {

            image.setProduct(product);

            if (image.getSortOrder()
                    == null) {

                image.setSortOrder(order);
            }

            if (Boolean.TRUE.equals(
                    image.getPrimaryImage())) {

                if (primaryFound) {
                    image.setPrimaryImage(false);
                } else {
                    primaryFound = true;
                }
            }

            order++;
        }
    }
}