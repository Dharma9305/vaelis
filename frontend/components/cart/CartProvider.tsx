"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import API_BASE_URL from "@/lib/api";

import { Product } from "../../data/products";

type ProductImage = {
  id?: number;
  imageUrl: string;
  altText?: string | null;
  sortOrder?: number;
  primaryImage?: boolean;
};

// =========================================================
// INVENTORY FIELDS
// =========================================================

type InventoryFields = {
  stockQuantity?: number;
  lowStockThreshold?: number;
};

type CartProduct = Product &
  InventoryFields & {
    images?: ProductImage[];
  };

export type CartItem = {
  product: CartProduct;
  quantity: number;
  color: string;
  imageUrl: string;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;

  addToCart: (
    product: CartProduct,
    quantity?: number,
    color?: string,
  ) => void;

  removeFromCart: (
    productId: string,
    color: string,
  ) => void;

  updateQuantity: (
    productId: string,
    color: string,
    quantity: number,
  ) => void;

  clearCart: () => void;
};

const CartContext =
  createContext<CartContextType | undefined>(
    undefined,
  );

const CART_STORAGE_KEY =
  "vaelis-cart";

// =========================================================
// IMAGE HELPER
// =========================================================

function getProductImage(
  product: CartProduct,
): string {
  const images =
    product.images ?? [];

  const primaryImage =
    images.find(
      (image) =>
        image.primaryImage === true,
    );

  return (
    primaryImage?.imageUrl ??
    images[0]?.imageUrl ??
    ""
  );
}

// =========================================================
// STOCK HELPER
// =========================================================

function getStockQuantity(
  product: CartProduct,
): number | null {
  if (
    typeof product.stockQuantity !==
    "number"
  ) {
    return null;
  }

  return Math.max(
    0,
    product.stockQuantity,
  );
}

// =========================================================
// CART PROVIDER
// =========================================================

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] =
    useState<CartItem[]>([]);

  const [hydrated, setHydrated] =
    useState(false);

  // =======================================================
  // STOCK NOTIFICATION
  // =======================================================

  const [
    stockNotification,
    setStockNotification,
  ] = useState("");

  // =======================================================
  // LOAD CART
  // =======================================================

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(
          CART_STORAGE_KEY,
        );

      if (savedCart) {
        const parsedCart =
          JSON.parse(savedCart);

        const normalizedCart: CartItem[] =
          Array.isArray(parsedCart)
            ? parsedCart.map(
                (
                  item: CartItem,
                ) => {
                  const product =
                    item.product;

                  const normalizedProduct:
                    CartProduct = {
                    ...product,

                    stockQuantity:
                      typeof product.stockQuantity ===
                      "number"
                        ? product.stockQuantity
                        : undefined,

                    lowStockThreshold:
                      typeof product.lowStockThreshold ===
                      "number"
                        ? product.lowStockThreshold
                        : undefined,
                  };

                  return {
                    ...item,

                    product:
                      normalizedProduct,

                    imageUrl:
                      item.imageUrl ||
                      getProductImage(
                        normalizedProduct,
                      ),
                  };
                },
              )
            : [];

        setItems(
          normalizedCart,
        );
      }
    } catch (error) {
      console.error(
        "Unable to load VAELIS cart:",
        error,
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  // =======================================================
  // SAVE CART
  // =======================================================

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items),
      );
    } catch (error) {
      console.error(
        "Unable to save VAELIS cart:",
        error,
      );
    }
  }, [
    items,
    hydrated,
  ]);

  // =======================================================
  // AUTO-HIDE STOCK NOTIFICATION
  // =======================================================

  useEffect(() => {
    if (!stockNotification) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        setStockNotification("");
      }, 5000);

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    stockNotification,
  ]);

  // =======================================================
  // LIVE STOCK REFRESH
  // =======================================================

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (items.length === 0) {
      return;
    }

    let cancelled = false;

    const refreshCartStock =
      async () => {
        try {
          const response =
            await fetch(
              `${API_BASE_URL}/api/products`,
              {
                method: "GET",
                cache: "no-store",
              },
            );

          if (!response.ok) {
            return;
          }

          const products =
            await response.json();

          if (
            cancelled ||
            !Array.isArray(
              products,
            )
          ) {
            return;
          }

          // -------------------------------------------------
          // PRODUCT MAP
          // -------------------------------------------------

          const productMap =
            new Map<
              string,
              Product & InventoryFields
            >();

          products.forEach(
            (
              product: Product &
                InventoryFields,
            ) => {
              if (product?.id) {
                productMap.set(
                  product.id,
                  product,
                );
              }
            },
          );

          // -------------------------------------------------
          // UPDATE CART
          // -------------------------------------------------

          setItems(
            (
              currentItems,
            ) => {
              let changed =
                false;

              let notification =
                "";

              const updatedItems =
                currentItems.map(
                  (item) => {
                    const latestProduct =
                      productMap.get(
                        item.product.id,
                      );

                    if (
                      !latestProduct
                    ) {
                      return item;
                    }

                    const latestStock =
                      typeof latestProduct.stockQuantity ===
                      "number"
                        ? Math.max(
                            0,
                            latestProduct.stockQuantity,
                          )
                        : undefined;

                    let newQuantity =
                      item.quantity;

                    // -----------------------------------------
                    // STOCK REDUCED
                    // -----------------------------------------

                    if (
                      typeof latestStock ===
                        "number" &&
                      newQuantity >
                        latestStock
                    ) {
                      newQuantity =
                        latestStock;

                      changed = true;

                      // ---------------------------------------
                      // CUSTOMER NOTIFICATION
                      // ---------------------------------------

                      if (
                        latestStock ===
                        0
                      ) {
                        notification =
                          `${item.product.name} is now out of stock. Your cart quantity was adjusted automatically.`;
                      } else {
                        notification =
                          `Only ${latestStock} ${
                            latestStock ===
                            1
                              ? "unit"
                              : "units"
                          } of ${item.product.name} are available. Your cart quantity was adjusted automatically.`;
                      }
                    }

                    // -----------------------------------------
                    // INVENTORY DATA CHANGED
                    // -----------------------------------------

                    const inventoryChanged =
                      latestProduct.stockQuantity !==
                        item.product.stockQuantity ||
                      latestProduct.lowStockThreshold !==
                        item.product.lowStockThreshold ||
                      latestProduct.inStock !==
                        item.product.inStock;

                    if (
                      inventoryChanged ||
                      newQuantity !==
                        item.quantity
                    ) {
                      changed = true;

                      return {
                        ...item,

                        quantity:
                          newQuantity,

                        product: {
                          ...item.product,

                          stockQuantity:
                            latestStock,

                          lowStockThreshold:
                            latestProduct.lowStockThreshold,

                          inStock:
                            typeof latestStock ===
                            "number"
                              ? latestStock >
                                0
                              : latestProduct.inStock,
                        },
                      };
                    }

                    return item;
                  },
                );

              // -------------------------------------------------
              // SHOW NOTIFICATION AFTER STOCK CHANGE
              // -------------------------------------------------

              if (
                notification &&
                !cancelled
              ) {
                setStockNotification(
                  notification,
                );
              }

              return changed
                ? updatedItems
                : currentItems;
            },
          );
        } catch (error) {
          console.error(
            "Unable to refresh VAELIS cart stock:",
            error,
          );
        }
      };

    // Initial stock refresh
    refreshCartStock();

    // Refresh every 10 seconds
    const interval =
      window.setInterval(
        refreshCartStock,
        10000,
      );

    return () => {
      cancelled = true;

      window.clearInterval(
        interval,
      );
    };
  }, [
    hydrated,
    items.length,
  ]);

  // =======================================================
  // ADD TO CART
  // =======================================================

  const addToCart = (
    product: CartProduct,
    quantity = 1,
    color =
      product.colors?.[0] ?? "",
  ) => {
    if (quantity <= 0) {
      return;
    }

    const availableStock =
      getStockQuantity(
        product,
      );

    // -----------------------------------------------------
    // OUT OF STOCK
    // -----------------------------------------------------

    if (
      availableStock === 0
    ) {
      setStockNotification(
        `${product.name} is currently out of stock.`,
      );

      return;
    }

    let requestedQuantity =
      quantity;

    // -----------------------------------------------------
    // LIMIT TO AVAILABLE STOCK
    // -----------------------------------------------------

    if (
      availableStock !== null &&
      requestedQuantity >
        availableStock
    ) {
      requestedQuantity =
        availableStock;

      setStockNotification(
        `Only ${availableStock} ${
          availableStock ===
          1
            ? "unit"
            : "units"
        } of ${product.name} are available.`,
      );
    }

    if (
      requestedQuantity <= 0
    ) {
      return;
    }

    const imageUrl =
      getProductImage(
        product,
      );

    setItems(
      (currentItems) => {
        const existingItem =
          currentItems.find(
            (item) =>
              item.product.id ===
                product.id &&
              item.color ===
                color,
          );

        // =================================================
        // EXISTING ITEM
        // =================================================

        if (existingItem) {
          const existingQuantity =
            existingItem.quantity;

          let newQuantity =
            existingQuantity +
            requestedQuantity;

          if (
            availableStock !==
            null
          ) {
            newQuantity =
              Math.min(
                newQuantity,
                availableStock,
              );
          }

          if (
            newQuantity ===
            existingQuantity
          ) {
            setStockNotification(
              `You already have the maximum available quantity of ${product.name} in your cart.`,
            );

            return currentItems;
          }

          return currentItems.map(
            (item) =>
              item.product.id ===
                product.id &&
              item.color ===
                color
                ? {
                    ...item,

                    quantity:
                      newQuantity,

                    imageUrl:
                      imageUrl ||
                      item.imageUrl,

                    product,
                  }
                : item,
          );
        }

        // =================================================
        // NEW ITEM
        // =================================================

        return [
          ...currentItems,

          {
            product,

            quantity:
              requestedQuantity,

            color,

            imageUrl,
          },
        ];
      },
    );
  };

  // =======================================================
  // REMOVE
  // =======================================================

  const removeFromCart = (
    productId: string,
    color: string,
  ) => {
    setItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            !(
              item.product.id ===
                productId &&
              item.color ===
                color
            ),
        ),
    );
  };

  // =======================================================
  // UPDATE QUANTITY
  // =======================================================

  const updateQuantity = (
    productId: string,
    color: string,
    quantity: number,
  ) => {
    if (
      quantity <= 0
    ) {
      removeFromCart(
        productId,
        color,
      );

      return;
    }

    setItems(
      (currentItems) =>
        currentItems.map(
          (item) => {
            if (
              item.product.id !==
                productId ||
              item.color !==
                color
            ) {
              return item;
            }

            const stock =
              getStockQuantity(
                item.product,
              );

            let safeQuantity =
              quantity;

            // ------------------------------------------------
            // RESPECT CURRENT STOCK
            // ------------------------------------------------

            if (
              stock !== null
            ) {
              if (
                stock === 0
              ) {
                setStockNotification(
                  `${item.product.name} is currently out of stock.`,
                );

                return {
                  ...item,

                  quantity: 0,

                  product: {
                    ...item.product,

                    inStock:
                      false,

                    stockQuantity:
                      0,
                  },
                };
              }

              if (
                quantity >
                stock
              ) {
                safeQuantity =
                  stock;

                setStockNotification(
                  `Only ${stock} ${
                    stock === 1
                      ? "unit"
                      : "units"
                  } of ${item.product.name} are available.`,
                );
              }
            }

            return {
              ...item,

              quantity:
                safeQuantity,
            };
          },
        ),
    );
  };

  // =======================================================
  // CLEAR CART
  // =======================================================

  const clearCart = () => {
    setItems([]);

    setStockNotification("");
  };

  // =======================================================
  // ITEM COUNT
  // =======================================================

  const itemCount =
    useMemo(
      () =>
        items.reduce(
          (
            total,
            item,
          ) =>
            total +
            Math.max(
              0,
              item.quantity,
            ),
          0,
        ),
      [items],
    );

  // =======================================================
  // SUBTOTAL
  // =======================================================

  const subtotal =
    useMemo(
      () =>
        items.reduce(
          (
            total,
            item,
          ) =>
            total +
            item.product.price *
              Math.max(
                0,
                item.quantity,
              ),
          0,
        ),
      [items],
    );

  // =======================================================
  // CONTEXT VALUE
  // =======================================================

  const value: CartContextType = {
    items,
    itemCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider
      value={value}
    >
      {children}

      {/* ===================================================
          VAELIS STOCK TOAST
          =================================================== */}

      {stockNotification && (
        <div className="fixed bottom-6 right-6 z-[9999] w-[calc(100%-3rem)] max-w-md">

          <div className="rounded-2xl border border-[#c9a227]/30 bg-[#111111] px-5 py-4 shadow-2xl shadow-black/50">

            <div className="flex items-start gap-3">

              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c9a227]/10">

                <span className="text-sm text-[#c9a227]">
                  !
                </span>

              </div>

              <div className="min-w-0 flex-1">

                <p className="text-xs font-medium tracking-[0.15em] text-[#c9a227]">
                  VAELIS STOCK UPDATE
                </p>

                <p className="mt-1 text-sm leading-5 text-white/75">
                  {stockNotification}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setStockNotification(
                    "",
                  )
                }
                className="shrink-0 text-lg leading-none text-white/30 transition hover:text-white"
                aria-label="Close notification"
              >
                ×
              </button>

            </div>

          </div>

        </div>
      )}
    </CartContext.Provider>
  );
}

// =========================================================
// USE CART
// =========================================================

export function useCart() {
  const context =
    useContext(
      CartContext,
    );

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}