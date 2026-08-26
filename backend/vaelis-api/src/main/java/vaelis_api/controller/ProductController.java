package vaelis_api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import vaelis_api.entity.Product;
import vaelis_api.entity.ProductImage;

import vaelis_api.service.AdminAuthorizationService;
import vaelis_api.service.ProductService;

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

    private final AdminAuthorizationService
            adminAuthorizationService;

    public ProductController(
            ProductService productService,
            AdminAuthorizationService
                    adminAuthorizationService) {

        this.productService =
                productService;

        this.adminAuthorizationService =
                adminAuthorizationService;
    }

    // =========================================================
    // PUBLIC PRODUCTS
    // =========================================================
    //
    // Storefront endpoint.
    //
    // NO ADMIN PERMISSION REQUIRED.
    //
    // GET /api/products
    // =========================================================

    @GetMapping
    public List<Product> getAllProducts() {

        return productService
                .getAllProducts();
    }

    // =========================================================
    // PUBLIC PRODUCT BY SLUG
    // =========================================================
    //
    // Storefront endpoint.
    //
    // NO ADMIN PERMISSION REQUIRED.
    //
    // GET /api/products/{slug}
    // =========================================================

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

    // =========================================================
    // ADMIN PRODUCT LIST
    // PRODUCTS_VIEW
    // =========================================================
    //
    // GET /api/products/admin
    //
    // Separate from the public storefront endpoint.
    // =========================================================

    @GetMapping("/admin")
    public ResponseEntity<?> getAdminProducts(
            Authentication authentication) {

        if (!adminAuthorizationService.hasPermission(
                authentication,
                "PRODUCTS_VIEW"
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "PRODUCTS_VIEW permission required."
                    );
        }

        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }

    // =========================================================
    // ADMIN PRODUCT BY ID
    // PRODUCTS_VIEW
    // =========================================================
    //
    // GET /api/products/admin/{id}
    // =========================================================

    @GetMapping("/admin/{id}")
    public ResponseEntity<?> getAdminProduct(
            @PathVariable String id,
            Authentication authentication) {

        if (!adminAuthorizationService.hasPermission(
                authentication,
                "PRODUCTS_VIEW"
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "PRODUCTS_VIEW permission required."
                    );
        }

        return productService
                .getProductById(id)
                .map(product ->
                        ResponseEntity.ok(product)
                )
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // =========================================================
    // CREATE PRODUCT
    // PRODUCTS_MANAGE
    // =========================================================

    @PostMapping("/admin")
    public ResponseEntity<?> createProduct(
            @RequestBody Product product,
            Authentication authentication) {

        if (!adminAuthorizationService.hasPermission(
                authentication,
                "PRODUCTS_MANAGE"
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "PRODUCTS_MANAGE permission required."
                    );
        }

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

    // =========================================================
    // UPDATE PRODUCT
    // PRODUCTS_MANAGE
    // =========================================================

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable String id,
            @RequestBody Product product,
            Authentication authentication) {

        if (!adminAuthorizationService.hasPermission(
                authentication,
                "PRODUCTS_MANAGE"
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "PRODUCTS_MANAGE permission required."
                    );
        }

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

    // =========================================================
    // LEGACY STOCK TOGGLE
    // PRODUCTS_MANAGE
    // =========================================================

    @PatchMapping("/admin/{id}/stock")
    public ResponseEntity<?> updateStock(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> request,
            Authentication authentication) {

        if (!adminAuthorizationService.hasPermission(
                authentication,
                "PRODUCTS_MANAGE"
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "PRODUCTS_MANAGE permission required."
                    );
        }

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

    // =========================================================
    // UPDATE STOCK QUANTITY
    // PRODUCTS_MANAGE
    // =========================================================

    @PatchMapping(
            "/admin/{id}/stock-quantity"
    )
    public ResponseEntity<?> updateStockQuantity(
            @PathVariable String id,
            @RequestBody Map<String, Integer> request,
            Authentication authentication) {

        if (!adminAuthorizationService.hasPermission(
                authentication,
                "PRODUCTS_MANAGE"
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "PRODUCTS_MANAGE permission required."
                    );
        }

        try {

            Integer stockQuantity =
                    request.get("stockQuantity");

            if (stockQuantity == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "stockQuantity is required"
                                )
                        );
            }

            return ResponseEntity.ok(
                    productService.updateStockQuantity(
                            id,
                            stockQuantity
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

    // =========================================================
    // UPDATE LOW STOCK THRESHOLD
    // PRODUCTS_MANAGE
    // =========================================================

    @PatchMapping(
            "/admin/{id}/low-stock-threshold"
    )
    public ResponseEntity<?> updateLowStockThreshold(
            @PathVariable String id,
            @RequestBody Map<String, Integer> request,
            Authentication authentication) {

        if (!adminAuthorizationService.hasPermission(
                authentication,
                "PRODUCTS_MANAGE"
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "PRODUCTS_MANAGE permission required."
                    );
        }

        try {

            Integer lowStockThreshold =
                    request.get(
                            "lowStockThreshold"
                    );

            if (lowStockThreshold == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "lowStockThreshold is required"
                                )
                        );
            }

            return ResponseEntity.ok(
                    productService
                            .updateLowStockThreshold(
                                    id,
                                    lowStockThreshold
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

    // =========================================================
    // DELETE PRODUCT
    // PRODUCTS_MANAGE
    // =========================================================

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable String id,
            Authentication authentication) {

        if (!adminAuthorizationService.hasPermission(
                authentication,
                "PRODUCTS_MANAGE"
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "PRODUCTS_MANAGE permission required."
                    );
        }

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

    // =========================================================
    // PRODUCT IMAGE APIs
    // =========================================================

    // =========================================================
    // GET IMAGES
    // PUBLIC
    // =========================================================

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

    // =========================================================
    // ADD IMAGE
    // PRODUCTS_MANAGE
    // =========================================================

    @PostMapping(
            "/admin/{productId}/images"
    )
    public ResponseEntity<?> addProductImage(
            @PathVariable String productId,
            @RequestBody ProductImage image,
            Authentication authentication) {

        if (!adminAuthorizationService.hasPermission(
                authentication,
                "PRODUCTS_MANAGE"
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "PRODUCTS_MANAGE permission required."
                    );
        }

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

    // =========================================================
    // UPDATE IMAGE
    // PRODUCTS_MANAGE
    // =========================================================

    @PutMapping("/admin/images/{imageId}")
    public ResponseEntity<?> updateProductImage(
            @PathVariable Long imageId,
            @RequestBody ProductImage image,
            Authentication authentication) {

        if (!adminAuthorizationService.hasPermission(
                authentication,
                "PRODUCTS_MANAGE"
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "PRODUCTS_MANAGE permission required."
                    );
        }

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

    // =========================================================
    // SET PRIMARY IMAGE
    // PRODUCTS_MANAGE
    // =========================================================

    @PatchMapping(
            "/admin/images/{imageId}/primary"
    )
    public ResponseEntity<?> setPrimaryImage(
            @PathVariable Long imageId,
            Authentication authentication) {

        if (!adminAuthorizationService.hasPermission(
                authentication,
                "PRODUCTS_MANAGE"
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "PRODUCTS_MANAGE permission required."
                    );
        }

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

    // =========================================================
    // DELETE IMAGE
    // PRODUCTS_MANAGE
    // =========================================================

    @DeleteMapping(
            "/admin/images/{imageId}"
    )
    public ResponseEntity<?> deleteProductImage(
            @PathVariable Long imageId,
            Authentication authentication) {

        if (!adminAuthorizationService.hasPermission(
                authentication,
                "PRODUCTS_MANAGE"
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "PRODUCTS_MANAGE permission required."
                    );
        }

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