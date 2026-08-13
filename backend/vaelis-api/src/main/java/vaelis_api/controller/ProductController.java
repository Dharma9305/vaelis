package vaelis_api.controller;

import vaelis_api.entity.Product;
import vaelis_api.entity.ProductImage;
import vaelis_api.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.PATCH,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
public class ProductController {

    private final ProductService productService;

    public ProductController(
            ProductService productService) {

        this.productService =
                productService;
    }

    // =========================
    // PUBLIC PRODUCTS
    // =========================

    @GetMapping
    public List<Product> getAllProducts() {

        return productService
                .getAllProducts();
    }

    // =========================
    // PUBLIC PRODUCT BY SLUG
    // =========================

    @GetMapping("/{slug}")
    public ResponseEntity<Product>
    getProductBySlug(
            @PathVariable String slug) {

        return productService
                .getProductBySlug(slug)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // =========================
    // CREATE PRODUCT
    // =========================

    @PostMapping("/admin")
    public ResponseEntity<?> createProduct(
            @RequestBody Product product) {

        try {

            return ResponseEntity.ok(
                    productService
                            .createProduct(product)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================
    // UPDATE PRODUCT
    // =========================

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable String id,
            @RequestBody Product product) {

        try {

            return ResponseEntity.ok(
                    productService.updateProduct(
                            id,
                            product
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // =========================
    // STOCK
    // =========================

    @PatchMapping("/admin/{id}/stock")
    public ResponseEntity<?> updateStock(
            @PathVariable String id,
            @RequestBody Map<String, Boolean>
                    request) {

        try {

            Boolean inStock =
                    request.get("inStock");

            if (inStock == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "inStock is required"
                                )
                        );
            }

            return ResponseEntity.ok(
                    productService.updateStock(
                            id,
                            inStock
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // =========================
    // DELETE PRODUCT
    // =========================

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable String id) {

        try {

            productService.deleteProduct(id);

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // ==================================================
    // PRODUCT IMAGE APIs
    // ==================================================

    // =========================
    // GET IMAGES
    // =========================

    @GetMapping("/{productId}/images")
    public ResponseEntity<?> getProductImages(
            @PathVariable String productId) {

        try {

            return ResponseEntity.ok(
                    productService
                            .getProductImages(
                                    productId
                            )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // =========================
    // ADD IMAGE
    // =========================

    @PostMapping("/admin/{productId}/images")
    public ResponseEntity<?> addProductImage(
            @PathVariable String productId,
            @RequestBody ProductImage image) {

        try {

            return ResponseEntity.ok(
                    productService
                            .addProductImage(
                                    productId,
                                    image
                            )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // =========================
    // UPDATE IMAGE
    // =========================

    @PutMapping("/admin/images/{imageId}")
    public ResponseEntity<?> updateProductImage(
            @PathVariable Long imageId,
            @RequestBody ProductImage image) {

        try {

            return ResponseEntity.ok(
                    productService
                            .updateProductImage(
                                    imageId,
                                    image
                            )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // =========================
    // SET PRIMARY IMAGE
    // =========================

    @PatchMapping(
            "/admin/images/{imageId}/primary"
    )
    public ResponseEntity<?> setPrimaryImage(
            @PathVariable Long imageId) {

        try {

            return ResponseEntity.ok(
                    productService
                            .setPrimaryImage(
                                    imageId
                            )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // =========================
    // DELETE IMAGE
    // =========================

    @DeleteMapping(
            "/admin/images/{imageId}"
    )
    public ResponseEntity<?> deleteProductImage(
            @PathVariable Long imageId) {

        try {

            productService
                    .deleteProductImage(
                            imageId
                    );

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }
}