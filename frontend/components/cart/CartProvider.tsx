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

export type CartItem = {
  product: Product;
  quantity: number;
  color: string;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (
    product: Product,
    quantity?: number,
    color?: string,
  ) => void;
  removeFromCart: (productId: string, color: string) => void;
  updateQuantity: (
    productId: string,
    color: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

const CART_STORAGE_KEY = "vaelis-cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from browser storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Unable to load VAELIS cart:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save cart to browser storage
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items),
      );
    } catch (error) {
      console.error("Unable to save VAELIS cart:", error);
    }
  }, [items, hydrated]);

  const addToCart = (
    product: Product,
    quantity = 1,
    color = product.colors[0] ?? "",
  ) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.product.id === product.id &&
          item.color === color,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id &&
          item.color === color
            ? {
                ...item,
                quantity: item.quantity + quantity,
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
        },
      ];
    });
  };

  const removeFromCart = (
    productId: string,
    color: string,
  ) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.color === color
          ),
      ),
    );
  };

  const updateQuantity = (
    productId: string,
    color: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId &&
        item.color === color
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.product.price * item.quantity,
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

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}