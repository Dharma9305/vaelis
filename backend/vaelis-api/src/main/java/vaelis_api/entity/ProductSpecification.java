package vaelis_api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ProductSpecification {

    @Column(nullable = false, length = 100)
    private String label;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String value;

    public ProductSpecification() {
    }

    public ProductSpecification(String label, String value) {
        this.label = label;
        this.value = value;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}