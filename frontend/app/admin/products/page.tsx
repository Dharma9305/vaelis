"use client";
import API_BASE_URL from "@/lib/api";
import { useEffect, useState } from "react";
import {
  getAdminCredentials,
  clearAdminCredentials,
} from "@/lib/adminAuth";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Package,
  CheckCircle2,
  XCircle,
  IndianRupee,
  X,
  Image as ImageIcon,
  Star,
} from "lucide-react";

type ProductSpecification = {
  label: string;
  value: string;
};

type ProductImage = {
  id?: number;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  primaryImage: boolean;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string | null;
  description: string | null;
  price: number;
  originalPrice: number | null;
  currency: string;
  badge: string | null;
  rating: number | null;
  reviewCount: number | null;
  inStock: boolean;
  colors: string[];
  features: string[];
  specifications: ProductSpecification[];
  images: ProductImage[];
};

const emptyProduct: Product = {
  id: "",
  slug: "",
  name: "",
  category: "",
  shortDescription: "",
  description: "",
  price: 0,
  originalPrice: null,
  currency: "INR",
  badge: "",
  rating: null,
  reviewCount: null,
  inStock: true,
  colors: [],
  features: [],
  specifications: [],
  images: [],
};

export default function AdminProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [form, setForm] =
    useState<Product>(emptyProduct);

  const [saving, setSaving] =
    useState(false);

  const [newColor, setNewColor] =
    useState("");

  const [newFeature, setNewFeature] =
    useState("");

  const [newSpecLabel, setNewSpecLabel] =
    useState("");

  const [newSpecValue, setNewSpecValue] =
    useState("");

  const [newImageUrl, setNewImageUrl] =
    useState("");

  const [newImageAlt, setNewImageAlt] =
    useState("");

  const [uploadingImages, setUploadingImages] =
    useState(false);

  const [uploadStatus, setUploadStatus] =
    useState("");

  // =========================
  // FORMAT AMOUNT
  // =========================

  function formatAmount(
    amount: number
  ) {
    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  }

  // =========================
  // FETCH PRODUCTS
  // =========================

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_BASE_URL}/api/products`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Unable to fetch products."
        );
      }

      const data =
        await response.json();

      setProducts(
        data.map(
          (product: Product) => ({
            ...product,

            colors:
              product.colors || [],

            features:
              product.features || [],

            specifications:
              product.specifications || [],

            images:
              product.images || [],
          })
        )
      );

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to fetch products."
      );

    } finally {
      setLoading(false);
    }
  }

  // =========================
  // LOAD
  // =========================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredProducts =
    products.filter(
      (product) => {
        const value =
          search
            .toLowerCase()
            .trim();

        if (!value) {
          return true;
        }

        return (
          product.name
            .toLowerCase()
            .includes(value) ||

          product.id
            .toLowerCase()
            .includes(value) ||

          product.slug
            .toLowerCase()
            .includes(value) ||

          product.category
            .toLowerCase()
            .includes(value)
        );
      }
    );

  // =========================
  // OPEN ADD
  // =========================

  function openAddProduct() {
    setEditingProduct(null);

    setForm({
      ...emptyProduct,
      colors: [],
      features: [],
      specifications: [],
      images: [],
    });

    setNewColor("");
    setNewFeature("");
    setNewSpecLabel("");
    setNewSpecValue("");
    setNewImageUrl("");
    setNewImageAlt("");

    setShowForm(true);
  }

  // =========================
  // OPEN EDIT
  // =========================

  function openEditProduct(
    product: Product
  ) {
    setEditingProduct(product);

    setForm({
      ...product,

      colors:
        product.colors || [],

      features:
        product.features || [],

      specifications:
        product.specifications || [],

      images:
        product.images || [],
    });

    setNewColor("");
    setNewFeature("");
    setNewSpecLabel("");
    setNewSpecValue("");
    setNewImageUrl("");
    setNewImageAlt("");

    setShowForm(true);
  }

  // =========================
  // CLOSE FORM
  // =========================

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingProduct(null);
  }

  // =========================
  // FORM CHANGE
  // =========================

  function updateField(
    field: keyof Product,
    value: unknown
  ) {
    setForm(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  }

  // =========================
  // ADD COLOR
  // =========================

  function addColor() {
    const color =
      newColor.trim();

    if (!color) {
      return;
    }

    if (
      form.colors.some(
        (item) =>
          item.toLowerCase() ===
          color.toLowerCase()
      )
    ) {
      setNewColor("");
      return;
    }

    setForm(
      (previous) => ({
        ...previous,

        colors: [
          ...previous.colors,
          color,
        ],
      })
    );

    setNewColor("");
  }

  // =========================
  // REMOVE COLOR
  // =========================

  function removeColor(
    index: number
  ) {
    setForm(
      (previous) => ({
        ...previous,

        colors:
          previous.colors.filter(
            (_, itemIndex) =>
              itemIndex !== index
          ),
      })
    );
  }

  // =========================
  // ADD FEATURE
  // =========================

  function addFeature() {
    const feature =
      newFeature.trim();

    if (!feature) {
      return;
    }

    if (
      form.features.some(
        (item) =>
          item.toLowerCase() ===
          feature.toLowerCase()
      )
    ) {
      setNewFeature("");
      return;
    }

    setForm(
      (previous) => ({
        ...previous,

        features: [
          ...previous.features,
          feature,
        ],
      })
    );

    setNewFeature("");
  }

  // =========================
  // REMOVE FEATURE
  // =========================

  function removeFeature(
    index: number
  ) {
    setForm(
      (previous) => ({
        ...previous,

        features:
          previous.features.filter(
            (_, itemIndex) =>
              itemIndex !== index
          ),
      })
    );
  }

  // =========================
  // ADD SPECIFICATION
  // =========================

    function addSpecification() {
  const label =
    newSpecLabel.trim();

  const value =
    newSpecValue.trim();

  if (!label || !value) {
    return;
  }

  if (label.length > 100) {
    return;
  }

    setForm(
      (previous) => ({
        ...previous,

        specifications: [
          ...previous.specifications,
          {
            label,
            value,
          },
        ],
      })
    );

    setNewSpecLabel("");
    setNewSpecValue("");
  }

  // =========================
  // REMOVE SPECIFICATION
  // =========================

  function removeSpecification(
    index: number
  ) {
    setForm(
      (previous) => ({
        ...previous,

        specifications:
          previous.specifications.filter(
            (_, itemIndex) =>
              itemIndex !== index
          ),
      })
    );
  }

  // =========================
  // ADD IMAGE
  // =========================

  function addImage() {
    const imageUrl =
      newImageUrl.trim();

    const altText =
      newImageAlt.trim();

    if (!imageUrl) {
      return;
    }

    const newImage: ProductImage = {
      imageUrl,
      altText: altText || null,
      sortOrder:
        form.images.length,
      primaryImage:
        form.images.length === 0,
    };

    setForm(
      (previous) => ({
        ...previous,

        images: [
          ...previous.images,
          newImage,
        ],
      })
    );

    setNewImageUrl("");
    setNewImageAlt("");
  }

  // =========================
  // UPLOAD IMAGES TO CLOUDINARY
  // =========================

  async function uploadImages(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const uploadPreset =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError(
        "Cloudinary is not configured. Check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local."
      );
      event.target.value = "";
      return;
    }

    try {
      setUploadingImages(true);
      setError("");
      setUploadStatus(`Preparing ${files.length} image${files.length === 1 ? "" : "s"}...`);

      const uploadedImages: ProductImage[] = [];

      for (const file of Array.from(files)) {
        setUploadStatus(`Uploading ${file.name}...`);

        if (!file.type.startsWith("image/")) {
          throw new Error(
            `${file.name} is not an image file.`
          );
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", "vaelis/products");

        const uploadUrl =
          `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`;

        console.log("Cloudinary upload URL:", uploadUrl);
        console.log("Cloudinary upload preset:", uploadPreset);
        console.log("Uploading file:", file.name, file.type, file.size);

        const response = await fetch(
          uploadUrl,
          {
            method: "POST",
            body: formData,
          }
        );

        const rawResponse = await response.text();
        let data: any = {};

        try {
          data = JSON.parse(rawResponse);
        } catch {
          data = { raw: rawResponse };
        }

        console.log("Cloudinary response:", response.status, data);

        if (!response.ok || !data.secure_url) {
          throw new Error(
            data?.error?.message ||
              data?.raw ||
              `Cloudinary upload failed for ${file.name} (HTTP ${response.status}).`
          );
        }

        uploadedImages.push({
          imageUrl: data.secure_url,
          altText: file.name.replace(/\.[^/.]+$/, ""),
          sortOrder: form.images.length + uploadedImages.length,
          primaryImage:
            form.images.length === 0 &&
            uploadedImages.length === 0,
        });
      }

      setForm((previous) => ({
        ...previous,
        images: [
          ...previous.images,
          ...uploadedImages,
        ],
      }));

      setUploadStatus(
        `${uploadedImages.length} image${uploadedImages.length === 1 ? "" : "s"} uploaded successfully.`
      );
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Unable to upload image(s).";
      setError(message);
      setUploadStatus("");
      window.alert(message);
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  }

  // =========================
  // REMOVE IMAGE
  // =========================

  function removeImage(
    index: number
  ) {
    setForm(
      (previous) => {

        const images =
          previous.images.filter(
            (_, itemIndex) =>
              itemIndex !== index
          );

        const hasPrimary =
          images.some(
            (image) =>
              image.primaryImage
          );

        if (
          images.length > 0 &&
          !hasPrimary
        ) {
          images[0] = {
            ...images[0],
            primaryImage: true,
          };
        }

        return {
          ...previous,
          images,
        };
      }
    );
  }

  // =========================
  // SET PRIMARY IMAGE
  // =========================

  function setPrimaryImage(
    index: number
  ) {
    setForm(
      (previous) => ({
        ...previous,

        images:
          previous.images.map(
            (image, imageIndex) => ({
              ...image,

              primaryImage:
                imageIndex === index,
            })
          ),
      })
    );
  }

  // =========================
  // MOVE IMAGE UP
  // =========================

  function moveImageUp(
    index: number
  ) {
    if (index === 0) {
      return;
    }

    setForm(
      (previous) => {

        const images =
          [...previous.images];

        const temp =
          images[index - 1];

        images[index - 1] =
          images[index];

        images[index] =
          temp;

        return {
          ...previous,

          images:
            images.map(
              (
                image,
                imageIndex
              ) => ({
                ...image,

                sortOrder:
                  imageIndex,
              })
            ),
        };
      }
    );
  }

  // =========================
  // MOVE IMAGE DOWN
  // =========================

  function moveImageDown(
    index: number
  ) {
    if (
      index >=
      form.images.length - 1
    ) {
      return;
    }

    setForm(
      (previous) => {

        const images =
          [...previous.images];

        const temp =
          images[index + 1];

        images[index + 1] =
          images[index];

        images[index] =
          temp;

        return {
          ...previous,

          images:
            images.map(
              (
                image,
                imageIndex
              ) => ({
                ...image,

                sortOrder:
                  imageIndex,
              })
            ),
        };
      }
    );
  }

  // =========================
  // SAVE PRODUCT
  // =========================

  async function saveProduct(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const credentials =
        getAdminCredentials();

      if (!credentials) {
        return;
      }

      const url =
        editingProduct
          ? `${API_BASE_URL}/api/products/admin/${editingProduct.id}`
          :`${API_BASE_URL}/api/products/admin`;

      const method =
        editingProduct
          ? "PUT"
          : "POST";

      const payload: Product = {
        ...form,

        images:
          form.images.map(
            (
              image,
              index
            ) => ({
              ...image,
              id: undefined,
              sortOrder: index,
            })
          ),
      };

      const response =
        await fetch(
          url,
          {
            method,

            headers: {
              Authorization:
                `Basic ${credentials}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

      if (response.status === 401) {
       clearAdminCredentials();

        window.location.href =
          "/admin/login";

        return;
      }

      let data = null;

      try {
        data =
          await response.json();
      } catch {
        // Empty response.
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
          "Unable to save product."
        );
      }

      setShowForm(false);
      setEditingProduct(null);

      await fetchProducts();

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save product."
      );

    } finally {
      setSaving(false);
    }
  }

  // =========================
  // STOCK TOGGLE
  // =========================

  async function toggleStock(
    product: Product
  ) {
    try {
      setError("");

      const credentials =
        getAdminCredentials();

      if (!credentials) {
        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/products/admin/${product.id}/stock`,
          {
            method: "PATCH",

            headers: {
              Authorization:
                `Basic ${credentials}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              inStock:
                !product.inStock,
            }),
          }
        );

      if (response.status === 401) {
        localStorage.removeItem(
          "vaelis_admin_auth"
        );

        window.location.href =
          "/admin/login";

        return;
      }

      let data = null;

      try {
        data =
          await response.json();
      } catch {
        // Empty response.
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
          "Unable to update stock."
        );
      }

      await fetchProducts();

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update stock."
      );
    }
  }

  // =========================
  // DELETE PRODUCT
  // =========================

  async function deleteProduct(
    product: Product
  ) {
    const confirmed =
      window.confirm(
        `Delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const credentials =
        getAdminCredentials();

      if (!credentials) {
        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/products/admin/${product.id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Basic ${credentials}`,
            },
          }
        );

      if (response.status === 401) {
        localStorage.removeItem(
          "vaelis_admin_auth"
        );

        window.location.href =
          "/admin/login";

        return;
      }

      if (!response.ok) {
        let message =
          "Unable to delete product.";

        try {
          const data =
            await response.json();

          message =
            data?.error ||
            message;
        } catch {
          // Ignore.
        }

        throw new Error(message);
      }

      await fetchProducts();

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete product."
      );
    }
  }

  // =========================
  // PAGE
  // =========================

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* HEADER */}

      <section className="mx-auto max-w-7xl px-6 pt-10">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-medium">
              Products
            </h1>

            <p className="mt-1 text-sm text-white/40">
              Manage VAELIS products and inventory
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={
                fetchProducts
              }
              disabled={loading}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 disabled:opacity-40"
            >

              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>

            <button
              onClick={
                openAddProduct
              }
              className="flex items-center gap-2 rounded-full bg-[#c9a227] px-5 py-2 text-sm font-medium text-black transition hover:bg-[#d8b43b]"
            >

              <Plus size={17} />

              Add Product

            </button>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* SEARCH */}

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search by product name, ID, slug or category..."
              className="w-full rounded-2xl border border-white/10 bg-black px-12 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/20"
            />

          </div>

        </div>

        {/* SUMMARY */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

            <p className="text-sm text-white/40">
              Total Products
            </p>

            <p className="mt-3 text-2xl font-medium">
              {products.length}
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

            <p className="text-sm text-white/40">
              In Stock
            </p>

            <p className="mt-3 text-2xl font-medium text-green-400">
              {
                products.filter(
                  (product) =>
                    product.inStock
                ).length
              }
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

            <p className="text-sm text-white/40">
              Out of Stock
            </p>

            <p className="mt-3 text-2xl font-medium text-red-400">
              {
                products.filter(
                  (product) =>
                    !product.inStock
                ).length
              }
            </p>

          </div>

        </div>

        {/* PRODUCTS */}

        <section className="rounded-3xl border border-white/10 bg-white/[0.03]">

          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

            <div>

              <h2 className="text-lg font-medium">
                Product Inventory
              </h2>

              <p className="mt-1 text-sm text-white/30">
                {filteredProducts.length} product
                {filteredProducts.length === 1
                  ? ""
                  : "s"}
              </p>

            </div>

            <Package
              size={20}
              className="text-white/30"
            />

          </div>

          {loading ? (

            <div className="p-12 text-center text-white/40">
              Loading products...
            </div>

          ) : filteredProducts.length === 0 ? (

            <div className="p-12 text-center">

              <Package
                size={36}
                className="mx-auto text-white/20"
              />

              <p className="mt-4 text-white/40">
                No products found.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="border-b border-white/10">

                  <tr className="text-xs uppercase tracking-wider text-white/30">

                    <th className="px-5 py-4">
                      Product
                    </th>

                    <th className="px-5 py-4">
                      Images
                    </th>

                    <th className="px-5 py-4">
                      Category
                    </th>

                    <th className="px-5 py-4">
                      Price
                    </th>

                    <th className="px-5 py-4">
                      Stock
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-white/10">

                  {filteredProducts.map(
                    (product) => (

                      <tr
                        key={product.id}
                        className="transition hover:bg-white/[0.02]"
                      >

                        <td className="px-5 py-5">

                          <p className="font-medium">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-white/30">
                            {product.id}
                          </p>

                        </td>

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2">

                            {product.images &&
                            product.images.length >
                              0 ? (

                              <>

                                <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-black">

                                  <img
                                    src={
                                      product.images.find(
                                        (image) =>
                                          image.primaryImage
                                      )?.imageUrl ||
                                      product.images[0]
                                        .imageUrl
                                    }
                                    alt={
                                      product.name
                                    }
                                    className="h-full w-full object-cover"
                                  />

                                </div>

                                <span className="text-xs text-white/40">
                                  {
                                    product
                                      .images
                                      .length
                                  }
                                </span>

                              </>

                            ) : (

                              <span className="text-xs text-white/25">
                                No images
                              </span>

                            )}

                          </div>

                        </td>

                        <td className="px-5 py-5 text-sm text-white/60">
                          {product.category}
                        </td>

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-1">

                            <IndianRupee
                              size={14}
                              className="text-[#c9a227]"
                            />

                            <span>
                              {product.price.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          </div>

                          {product.originalPrice &&
                            product.originalPrice >
                              product.price && (

                            <p className="mt-1 text-xs text-white/30 line-through">
                              {formatAmount(
                                product.originalPrice
                              )}
                            </p>

                          )}

                        </td>

                        <td className="px-5 py-5">

                          <button
                            onClick={() =>
                              toggleStock(
                                product
                              )
                            }
                            className={`rounded-full px-3 py-1 text-xs transition ${
                              product.inStock
                                ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            }`}
                          >

                            {product.inStock
                              ? "In Stock"
                              : "Out of Stock"}

                          </button>

                        </td>

                        <td className="px-5 py-5">

                          {product.inStock ? (

                            <span className="flex w-fit items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">

                              <CheckCircle2
                                size={13}
                              />

                              Available

                            </span>

                          ) : (

                            <span className="flex w-fit items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">

                              <XCircle
                                size={13}
                              />

                              Out of Stock

                            </span>

                          )}

                        </td>

                        <td className="px-5 py-5">

                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() =>
                                openEditProduct(
                                  product
                                )
                              }
                              className="rounded-xl border border-white/10 p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
                              title="Edit product"
                            >

                              <Pencil
                                size={16}
                              />

                            </button>

                            <button
                              onClick={() =>
                                deleteProduct(
                                  product
                                )
                              }
                              className="rounded-xl border border-red-500/10 p-2 text-red-400/60 transition hover:bg-red-500/10 hover:text-red-400"
                              title="Delete product"
                            >

                              <Trash2
                                size={16}
                              />

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </section>

      {/* PRODUCT FORM MODAL */}

      {showForm && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 px-4 py-8 backdrop-blur-sm">

          <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>

                <h2 className="text-xl font-medium">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-white/30">
                  Manage complete VAELIS product information
                </p>

              </div>

              <button
                onClick={
                  closeForm
                }
                disabled={saving}
                className="rounded-xl p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
              >

                <X size={20} />

              </button>

            </div>

            <form
              onSubmit={
                saveProduct
              }
              className="space-y-7 p-6"
            >

              {/* BASIC INFORMATION */}

              <section>

                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/50">
                  Basic Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm text-white/50">
                      Product ID
                    </label>

                    <input
                      value={form.id}
                      onChange={(e) =>
                        updateField(
                          "id",
                          e.target.value
                        )
                      }
                      disabled={
                        Boolean(
                          editingProduct
                        )
                      }
                      required
                      placeholder="vaelis-air"
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30 disabled:opacity-40"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm text-white/50">
                      Slug
                    </label>

                    <input
                      value={
                        form.slug
                      }
                      onChange={(e) =>
                        updateField(
                          "slug",
                          e.target.value
                        )
                      }
                      required
                      placeholder="vaelis-air"
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm text-white/50">
                      Product Name
                    </label>

                    <input
                      value={
                        form.name
                      }
                      onChange={(e) =>
                        updateField(
                          "name",
                          e.target.value
                        )
                      }
                      required
                      placeholder="VAELIS Air"
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm text-white/50">
                      Category
                    </label>

                    <input
                      value={
                        form.category
                      }
                      onChange={(e) =>
                        updateField(
                          "category",
                          e.target.value
                        )
                      }
                      required
                      placeholder="Earbuds"
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm text-white/50">
                      Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.price
                      }
                      onChange={(e) =>
                        updateField(
                          "price",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      required
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm text-white/50">
                      Original Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.originalPrice ??
                        ""
                      }
                      onChange={(e) =>
                        updateField(
                          "originalPrice",
                          e.target.value ===
                            ""
                            ? null
                            : Number(
                                e.target.value
                              )
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm text-white/50">
                      Currency
                    </label>

                    <input
                      value={
                        form.currency
                      }
                      onChange={(e) =>
                        updateField(
                          "currency",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm text-white/50">
                      Badge
                    </label>

                    <input
                      value={
                        form.badge ??
                        ""
                      }
                      onChange={(e) =>
                        updateField(
                          "badge",
                          e.target.value
                        )
                      }
                      placeholder="NEW"
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm text-white/50">
                      Rating
                    </label>

                    <div className="relative">

                      <Star
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a227]"
                      />

                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={
                          form.rating ??
                          ""
                        }
                        onChange={(e) =>
                          updateField(
                            "rating",
                            e.target.value ===
                              ""
                              ? null
                              : Number(
                                  e.target.value
                                )
                          )
                        }
                        placeholder="4.8"
                        className="w-full rounded-xl border border-white/10 bg-black py-3 pl-11 pr-4 text-sm outline-none focus:border-white/30"
                      />

                    </div>

                  </div>

                  <div>

                    <label className="mb-2 block text-sm text-white/50">
                      Review Count
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        form.reviewCount ??
                        ""
                      }
                      onChange={(e) =>
                        updateField(
                          "reviewCount",
                          e.target.value ===
                            ""
                            ? null
                            : Number(
                                e.target.value
                              )
                        )
                      }
                      placeholder="125"
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
                    />

                  </div>

                </div>

              </section>

              {/* DESCRIPTION */}

              <section>

                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/50">
                  Description
                </h3>

                <div className="space-y-5">

                  <div>

                    <label className="mb-2 block text-sm text-white/50">
                      Short Description
                    </label>

                    <textarea
                      value={
                        form.shortDescription ??
                        ""
                      }
                      onChange={(e) =>
                        updateField(
                          "shortDescription",
                          e.target.value
                        )
                      }
                      rows={2}
                      className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm text-white/50">
                      Description
                    </label>

                    <textarea
                      value={
                        form.description ??
                        ""
                      }
                      onChange={(e) =>
                        updateField(
                          "description",
                          e.target.value
                        )
                      }
                      rows={5}
                      className="w-full resize-y rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
                    />

                  </div>

                </div>

              </section>

              {/* IMAGES */}

              <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a227]/10 text-[#c9a227]">

                    <ImageIcon
                      size={19}
                    />

                  </div>

                  <div>

                    <h3 className="text-sm font-medium uppercase tracking-wider text-white/60">
                      Product Images
                    </h3>

                    <p className="mt-1 text-xs text-white/30">
                      Add image URLs and choose the primary product image.
                    </p>

                  </div>

                </div>

                {/* UPLOAD FROM COMPUTER */}

                <div className="mb-5 rounded-2xl border border-dashed border-[#c9a227]/30 bg-[#c9a227]/[0.03] p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-sm font-medium text-white/80">
                        Upload from your computer
                      </p>
                      <p className="mt-1 text-xs text-white/30">
                        JPG, PNG, WEBP and other image formats are uploaded to Cloudinary.
                      </p>
                    </div>

                    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#c9a227] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#d8b43b] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
                      <ImageIcon size={16} className="mr-2" />
                      {uploadingImages ? "Uploading..." : "Choose Images"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={uploadImages}
                        disabled={uploadingImages}
                        className="hidden"
                      />
                    </label>

                  </div>

                  {uploadStatus && (
                    <p className="mt-3 text-xs text-[#c9a227]">
                      {uploadStatus}
                    </p>
                  )}

                </div>

                {/* ADD IMAGE URL */}

                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/30">
                  Or add image by URL
                </div>

                <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_auto]">

                  <input
                    value={newImageUrl}
                    onChange={(e) =>
                      setNewImageUrl(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addImage();
                      }
                    }}
                    placeholder="https://example.com/product-image.jpg"
                    className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
                  />

                  <input
                    value={newImageAlt}
                    onChange={(e) =>
                      setNewImageAlt(e.target.value)
                    }
                    placeholder="Alt text"
                    className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
                  />

                  <button
                    type="button"
                    onClick={addImage}
                    className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    <Plus size={16} className="mr-2 inline" />
                    Add URL
                  </button>

                </div>

                {/* IMAGE LIST */}

                {form.images.length >
                  0 ? (

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {form.images.map(
                      (
                        image,
                        index
                      ) => (

                        <div
                          key={`${image.imageUrl}-${index}`}
                          className="overflow-hidden rounded-2xl border border-white/10 bg-black"
                        >

                          {/* PREVIEW */}

                          <div className="relative aspect-square bg-white/[0.03]">

                            <img
                              src={
                                image.imageUrl
                              }
                              alt={
                                image.altText ||
                                form.name
                              }
                              className="h-full w-full object-cover"
                              onError={(
                                event
                              ) => {
                                event.currentTarget.style.opacity =
                                  "0.25";
                              }}
                            />

                            {image.primaryImage && (

                              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#c9a227] px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-black">

                                <Star
                                  size={11}
                                  fill="currentColor"
                                />

                                Primary

                              </div>

                            )}

                            <div className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white/70 backdrop-blur">
                              #{index + 1}
                            </div>

                          </div>

                          {/* IMAGE INFO */}

                          <div className="p-4">

                            <p className="truncate text-xs text-white/50">
                              {image.altText ||
                                "No alt text"}
                            </p>

                            <p className="mt-1 truncate text-[11px] text-white/20">
                              {image.imageUrl}
                            </p>

                            {/* CONTROLS */}

                            <div className="mt-4 flex flex-wrap gap-2">

                              {!image.primaryImage && (

                                <button
                                  type="button"
                                  onClick={() =>
                                    setPrimaryImage(
                                      index
                                    )
                                  }
                                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
                                >
                                  <Star
                                    size={13}
                                    className="mr-1 inline"
                                  />
                                  Primary
                                </button>

                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  moveImageUp(
                                    index
                                  )
                                }
                                disabled={
                                  index ===
                                  0
                                }
                                className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50 disabled:opacity-20"
                              >
                                ↑
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  moveImageDown(
                                    index
                                  )
                                }
                                disabled={
                                  index ===
                                  form
                                    .images
                                    .length -
                                    1
                                }
                                className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50 disabled:opacity-20"
                              >
                                ↓
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  removeImage(
                                    index
                                  )
                                }
                                className="rounded-lg border border-red-500/10 px-3 py-2 text-xs text-red-400/70 transition hover:bg-red-500/10 hover:text-red-400"
                              >
                                <Trash2
                                  size={13}
                                  className="mr-1 inline"
                                />
                                Delete
                              </button>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-8 text-center">

                    <ImageIcon
                      size={30}
                      className="mx-auto text-white/20"
                    />

                    <p className="mt-3 text-sm text-white/30">
                      No product images added yet.
                    </p>

                  </div>

                )}

              </section>

              {/* COLORS */}

              <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/50">
                  Colors
                </h3>

                <div className="flex flex-col gap-3 sm:flex-row">

                  <input
                    value={
                      newColor
                    }
                    onChange={(e) =>
                      setNewColor(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "Enter"
                      ) {
                        e.preventDefault();
                        addColor();
                      }
                    }}
                    placeholder="e.g. Obsidian Black"
                    className="flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
                  />

                  <button
                    type="button"
                    onClick={
                      addColor
                    }
                    className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/70 hover:bg-white/5"
                  >
                    <Plus
                      size={16}
                      className="mr-2 inline"
                    />
                    Add Color
                  </button>

                </div>

                {form.colors.length >
                  0 && (

                  <div className="mt-4 flex flex-wrap gap-2">

                    {form.colors.map(
                      (
                        color,
                        index
                      ) => (

                        <div
                          key={`${color}-${index}`}
                          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/70"
                        >

                          {color}

                          <button
                            type="button"
                            onClick={() =>
                              removeColor(
                                index
                              )
                            }
                            className="text-white/30 hover:text-red-400"
                          >
                            <X
                              size={14}
                            />
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

              {/* FEATURES */}

              <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/50">
                  Features
                </h3>

                <div className="flex flex-col gap-3 sm:flex-row">

                  <input
                    value={
                      newFeature
                    }
                    onChange={(e) =>
                      setNewFeature(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "Enter"
                      ) {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    placeholder="e.g. Active Noise Cancellation"
                    className="flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
                  />

                  <button
                    type="button"
                    onClick={
                      addFeature
                    }
                    className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/70 hover:bg-white/5"
                  >
                    <Plus
                      size={16}
                      className="mr-2 inline"
                    />
                    Add Feature
                  </button>

                </div>

                {form.features.length >
                  0 && (

                  <div className="mt-4 space-y-2">

                    {form.features.map(
                      (
                        feature,
                        index
                      ) => (

                        <div
                          key={`${feature}-${index}`}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3"
                        >

                          <span className="text-sm text-white/70">
                            {feature}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeFeature(
                                index
                              )
                            }
                            className="text-white/30 hover:text-red-400"
                          >
                            <X
                              size={16}
                            />
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

              {/* SPECIFICATIONS */}

              <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/50">
                  Specifications
                </h3>

                <div className="grid gap-3 sm:grid-cols-[1fr_1.5fr_auto]">

                 <input
  value={newSpecLabel}
  onChange={(e) =>
    setNewSpecLabel(e.target.value)
  }
  maxLength={100}
  placeholder="Label (max 100 characters)"
  className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
/>

                  <input
                    value={
                      newSpecValue
                    }
                    onChange={(e) =>
                      setNewSpecValue(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "Enter"
                      ) {
                        e.preventDefault();
                        addSpecification();
                      }
                    }}
                    placeholder="Value"
                    className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
                  />

                  <button
                    type="button"
                    onClick={
                      addSpecification
                    }
                    className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/70 hover:bg-white/5"
                  >
                    <Plus
                      size={16}
                      className="mr-2 inline"
                    />
                    Add
                  </button>

                </div>

                {form.specifications.length >
                  0 && (

                  <div className="mt-5 overflow-hidden rounded-xl border border-white/10">

                    {form.specifications.map(
                      (
                        specification,
                        index
                      ) => (

                        <div
                          key={`${specification.label}-${index}`}
                          className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 last:border-b-0"
                        >

                          <div className="grid flex-1 grid-cols-2 gap-4">

                            <span className="text-sm text-white/50">
                              {
                                specification.label
                              }
                            </span>

                            <span className="text-sm text-white/80">
                              {
                                specification.value
                              }
                            </span>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeSpecification(
                                index
                              )
                            }
                            className="text-white/30 hover:text-red-400"
                          >
                            <X
                              size={16}
                            />
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

              {/* INVENTORY */}

              <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/50">
                  Inventory
                </h3>

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    checked={
                      form.inStock
                    }
                    onChange={(e) =>
                      updateField(
                        "inStock",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm text-white/70">
                    Product is currently in stock
                  </span>

                </label>

              </section>

              {/* ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/60 hover:bg-white/5 disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#c9a227] px-6 py-3 text-sm font-medium text-black hover:bg-[#d8b43b] disabled:opacity-50"
                >

                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Create Product"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}