export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  colors: string[];
  features: string[];
  specifications: {
    label: string;
    value: string;
  }[];
};

export const products: Product[] = [
  {
    id: "vaelis-air",
    slug: "vaelis-air",
    name: "VAELIS Air",
    category: "Audio",
    shortDescription: "Immersive sound. Refined.",
    description:
      "VAELIS Air delivers rich, detailed sound in a refined wireless design created for modern everyday listening.",
    price: 2999,
    currency: "INR",
    badge: "New",
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    colors: ["Obsidian Black", "Pearl White"],
    features: [
      "Active Noise Cancellation",
      "AI-Enhanced ENC Calling",
      "Bluetooth 5.4",
      "Up to 40 hours battery",
      "USB-C fast charging",
      "Low latency gaming mode",
      "IPX5 water resistance",
    ],
    specifications: [
      { label: "Bluetooth", value: "5.4" },
      { label: "Battery", value: "Up to 40 hours" },
      { label: "Charging", value: "USB-C" },
      { label: "Noise Cancellation", value: "Active ANC" },
      { label: "Water Resistance", value: "IPX5" },
      { label: "Warranty", value: "1 Year" },
    ],
  },

  {
    id: "vaelis-air-pro",
    slug: "vaelis-air-pro",
    name: "VAELIS Air Pro",
    category: "Audio",
    shortDescription: "Silence the world. Hear more.",
    description:
      "VAELIS Air Pro combines immersive audio, advanced noise cancellation and premium craftsmanship for an elevated listening experience.",
    price: 4999,
    currency: "INR",
    badge: "Premium",
    rating: 4.9,
    reviewCount: 86,
    inStock: true,
    colors: ["Titanium Black", "Champagne Gold"],
    features: [
      "Adaptive Active Noise Cancellation",
      "AI ENC crystal-clear calls",
      "Bluetooth 5.4",
      "Up to 45 hours battery",
      "Wireless charging",
      "Gaming low latency mode",
      "IPX5 water resistance",
    ],
    specifications: [
      { label: "Bluetooth", value: "5.4" },
      { label: "Battery", value: "Up to 45 hours" },
      { label: "Charging", value: "USB-C + Wireless" },
      { label: "Noise Cancellation", value: "Adaptive ANC" },
      { label: "Water Resistance", value: "IPX5" },
      { label: "Warranty", value: "1 Year" },
    ],
  },

  {
    id: "vaelis-charge-65",
    slug: "vaelis-charge-65",
    name: "VAELIS Charge 65W",
    category: "Power",
    shortDescription: "Power, beautifully engineered.",
    description:
      "A compact 65W fast charger designed to power your everyday devices with speed and efficiency.",
    price: 2499,
    currency: "INR",
    badge: "Fast Charge",
    rating: 4.7,
    reviewCount: 51,
    inStock: true,
    colors: ["Midnight Black"],
    features: [
      "65W fast charging",
      "GaN technology",
      "USB-C Power Delivery",
      "Multi-device charging",
      "Over-voltage protection",
      "Temperature protection",
    ],
    specifications: [
      { label: "Power", value: "65W" },
      { label: "Technology", value: "GaN" },
      { label: "Port", value: "USB-C" },
      { label: "Input", value: "100-240V" },
      { label: "Warranty", value: "1 Year" },
    ],
  },

  {
    id: "vaelis-power-20k",
    slug: "vaelis-power-20k",
    name: "VAELIS Power 20K",
    category: "Power",
    shortDescription: "Power that travels with you.",
    description:
      "A high-capacity 20,000mAh power bank designed for reliable power throughout your day.",
    price: 2999,
    currency: "INR",
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 73,
    inStock: true,
    colors: ["Graphite Black"],
    features: [
      "20,000mAh capacity",
      "22.5W fast charging",
      "USB-C input/output",
      "Dual USB output",
      "LED battery indicator",
      "Multiple safety protections",
    ],
    specifications: [
      { label: "Capacity", value: "20,000mAh" },
      { label: "Output", value: "22.5W" },
      { label: "Input", value: "USB-C" },
      { label: "Outputs", value: "USB-C + USB-A" },
      { label: "Warranty", value: "1 Year" },
    ],
  },

  {
    id: "vaelis-sound-one",
    slug: "vaelis-sound-one",
    name: "VAELIS Sound One",
    category: "Audio",
    shortDescription: "Sound that fills the room.",
    description:
      "A premium wireless speaker designed to deliver powerful sound with an elegant, minimal form.",
    price: 3999,
    currency: "INR",
    badge: "New",
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
    colors: ["Obsidian Black", "Stone White"],
    features: [
      "360° immersive sound",
      "Bluetooth 5.3",
      "Up to 20 hours battery",
      "Stereo pairing",
      "IPX6 water resistance",
      "USB-C charging",
    ],
    specifications: [
      { label: "Bluetooth", value: "5.3" },
      { label: "Battery", value: "Up to 20 hours" },
      { label: "Charging", value: "USB-C" },
      { label: "Water Resistance", value: "IPX6" },
      { label: "Warranty", value: "1 Year" },
    ],
  },

  {
    id: "vaelis-watch-one",
    slug: "vaelis-watch-one",
    name: "VAELIS Watch One",
    category: "Wearables",
    shortDescription: "Intelligence on your wrist.",
    description:
      "A sophisticated smartwatch concept combining a premium display, intelligent features and everyday wellness tracking.",
    price: 5999,
    currency: "INR",
    badge: "Coming Soon",
    rating: 4.9,
    reviewCount: 0,
    inStock: false,
    colors: ["Titanium Black", "Silver"],
    features: [
      "Premium AMOLED display",
      "Bluetooth calling",
      "Activity tracking",
      "Heart-rate monitoring",
      "Sleep tracking",
      "IP68 water resistance",
    ],
    specifications: [
      { label: "Display", value: "AMOLED" },
      { label: "Calling", value: "Bluetooth Calling" },
      { label: "Water Resistance", value: "IP68" },
      { label: "Charging", value: "Magnetic" },
      { label: "Warranty", value: "1 Year" },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase(),
  );
}