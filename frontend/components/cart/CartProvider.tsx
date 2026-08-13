"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Product } from "../../data/products";

type ProductImage = {
  id?: number;
  imageUrl: string;
  altText?: string | null;
  sortOrder?: number;
  primaryImage?: boolean;
};

type CartProduct = Product & {
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

const CART_STORAGE_KEY = "vaelis-cart";

function getProductImage(
  product: CartProduct,
): string {
  const images = product.images ?? [];

  const primaryImage = images.find(
    (image) => image.primaryImage === true,
  );

  return (
    primaryImage?.imageUrl ??
    images[0]?.imageUrl ??
    ""
  );
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>(
    [],
  );

  const [hydrated, setHydrated] =
    useState(false);

  // =========================
  // LOAD CART
  // =========================

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(
          CART_STORAGE_KEY,
        );

      if (savedCart) {
        const parsedCart =
          JSON.parse(savedCart);

        // Backward compatibility:
        // Add imageUrl if an older cart
        // doesn't have it.
        const normalizedCart =
          Array.isArray(parsedCart)
            ? parsedCart.map(
                (item: CartItem) => ({
                  ...item,
                  imageUrl:
                    item.imageUrl ||
                    getProductImage(
                      item.product,
                    ),
                }),
              )
            : [];

        setItems(normalizedCart);
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

  // =========================
  // SAVE CART
  // =========================

  useEffect(() => {
    if (!hydrated) return;

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
  }, [items, hydrated]);

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (
    product: CartProduct,
    quantity = 1,
    color = product.colors?.[0] ?? "",
  ) => {
    const imageUrl =
      getProductImage(product);

    setItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            item.product.id ===
              product.id &&
            item.color === color,
        );

      if (existingItem) {
        return currentItems.map(
          (item) =>
            item.product.id ===
              product.id &&
            item.color === color
              ? {
                  ...item,
                  quantity:
                    item.quantity +
                    quantity,
                  imageUrl:
                    imageUrl ||
                    item.imageUrl,
                }
              : item,
        );
      }

      return [
        ...currentItems,
        {
          product,
          quantity,
          color,
          imageUrl,
        },
      ];
    });
  };

  // =========================
  // REMOVE
  // =========================

  const removeFromCart = (
    productId: string,
    color: string,
  ) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.product.id ===
              productId &&
            item.color === color
          ),
      ),
    );
  };

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = (
    productId: string,
    color: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(
        productId,
        color,
      );

      return;
    }

    setItems((currentItems) =>
      currentItems.map(
        (item) =>
          item.product.id ===
            productId &&
          item.color === color
            ? {
                ...item,
                quantity,
              }
            : item,
      ),
    );
  };

  // =========================
  // CLEAR CART
  // =========================

  const clearCart = () => {
    setItems([]);
  };

  // =========================
  // ITEM COUNT
  // =========================

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      ),
    [items],
  );

  // =========================
  // SUBTOTAL
  // =========================

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          item.product.price *
            item.quantity,
        0,
      ),
    [items],
  );

  const value = {
    items,
    itemCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// =========================
// USE CART
// =========================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}