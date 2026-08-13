package vaelis_api.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String imageUrl;

    @Column(length = 255)
    private String altText;

    @Column(nullable = false)
    private Integer sortOrder = 0;

    @Column(nullable = false)
    private Boolean primaryImage = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "product_id",
            nullable = false
    )
    @JsonBackReference
    private Product product;

    public ProductImage() {
    }

    // =========================
    // GET ID
    // =========================

    public Long getId() {
        return id;
    }

    // =========================
    // SET ID
    // =========================

    public void setId(Long id) {
        this.id = id;
    }

    // =========================
    // IMAGE URL
    // =========================

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(
            String imageUrl) {

        this.imageUrl = imageUrl;
    }

    // =========================
    // ALT TEXT
    // =========================

    public String getAltText() {
        return altText;
    }

    public void setAltText(
            String altText) {

        this.altText = altText;
    }

    // =========================
    // SORT ORDER
    // =========================

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(
            Integer sortOrder) {

        this.sortOrder = sortOrder;
    }

    // =========================
    // PRIMARY IMAGE
    // =========================

    public Boolean getPrimaryImage() {
        return primaryImage;
    }

    public void setPrimaryImage(
            Boolean primaryImage) {

        this.primaryImage = primaryImage;
    }

    // =========================
    // PRODUCT
    // =========================

    public Product getProduct() {
        return product;
    }

    public void setProduct(
            Product product) {

        this.product = product;
    }
}