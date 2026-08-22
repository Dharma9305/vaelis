package vaelis_api.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @Column(nullable = false, length = 100)
    private String id;

    @Column(nullable = false, unique = true, length = 150)
    private String slug;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(length = 500)
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    private Double originalPrice;

    @Column(nullable = false, length = 10)
    private String currency;

    @Column(length = 100)
    private String badge;

    private Double rating;

    private Integer reviewCount;

    // =========================
    // INVENTORY
    // =========================

    @Column(nullable = false)
    private Boolean inStock = false;

    @Column(nullable = false)
    private Integer stockQuantity = 0;

    @Column(nullable = false)
    private Integer lowStockThreshold = 5;

    // =========================
    // COLORS
    // =========================

    @ElementCollection
    @CollectionTable(
            name = "product_colors",
            joinColumns = @JoinColumn(
                    name = "product_id"
            )
    )
    @Column(name = "color")
    private List<String> colors =
            new ArrayList<>();

    // =========================
    // FEATURES
    // =========================

    @ElementCollection
    @CollectionTable(
            name = "product_features",
            joinColumns = @JoinColumn(
                    name = "product_id"
            )
    )
    @Column(
            name = "feature",
            columnDefinition = "TEXT"
    )
    private List<String> features =
            new ArrayList<>();

    // =========================
    // SPECIFICATIONS
    // =========================

    @ElementCollection
    @CollectionTable(
            name = "product_specifications",
            joinColumns = @JoinColumn(
                    name = "product_id"
            )
    )
    private List<ProductSpecification> specifications =
            new ArrayList<>();

    // =========================
    // PRODUCT IMAGES
    // =========================

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    @JsonManagedReference
    private List<ProductImage> images =
            new ArrayList<>();

    // =========================
    // CONSTRUCTOR
    // =========================

    public Product() {
    }

    // =========================
    // GETTERS / SETTERS
    // =========================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(
            String shortDescription) {

        this.shortDescription =
                shortDescription;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(
            String description) {

        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(
            Double originalPrice) {

        this.originalPrice =
                originalPrice;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(
            Integer reviewCount) {

        this.reviewCount =
                reviewCount;
    }

    // =========================
    // INVENTORY GETTERS / SETTERS
    // =========================

    public Boolean getInStock() {
        return inStock;
    }

    public void setInStock(Boolean inStock) {
        this.inStock = inStock;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(
            Integer stockQuantity) {

        this.stockQuantity =
                stockQuantity;
    }

    public Integer getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(
            Integer lowStockThreshold) {

        this.lowStockThreshold =
                lowStockThreshold;
    }

    // =========================
    // COLLECTION GETTERS / SETTERS
    // =========================

    public List<String> getColors() {
        return colors;
    }

    public void setColors(
            List<String> colors) {

        this.colors = colors;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(
            List<String> features) {

        this.features = features;
    }

    public List<ProductSpecification>
    getSpecifications() {

        return specifications;
    }

    public void setSpecifications(
            List<ProductSpecification>
                    specifications) {

        this.specifications =
                specifications;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(
            List<ProductImage> images) {

        this.images = images;
    }

    // =========================
    // IMAGE HELPER
    // =========================

    public void addImage(
            ProductImage image) {

        images.add(image);
        image.setProduct(this);
    }

    public void removeImage(
            ProductImage image) {

        images.remove(image);
        image.setProduct(null);
    }
}