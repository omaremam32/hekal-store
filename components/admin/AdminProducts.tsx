"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  CheckCircle2,
  ChevronDown,
  ImageIcon,
  Package,
  Plus,
  Save,
  Search,
  Star,
  Upload,
  X,
} from "lucide-react";

export interface AdminProductVariant {
  id?: string;
  product_id?: string;
  size: string;
  color_en: string;
  color_ar: string;
  sku: string | null;
  stock: number | "";
}

export interface AdminProduct {
  id: string;
  slug: string;
  manufacturer_name: string;
  label_name_en: string;
  label_name_ar: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  price_egp: number;
  compare_at_price_egp: number | null;
  fabric_en: string | null;
  fabric_ar: string | null;
  image_url: string | null;
  category_en: string | null;
  category_ar: string | null;
  featured: boolean;
  is_active: boolean;
  created_at: string;
  variants: AdminProductVariant[];
}

interface ProductForm {
  id?: string;
  slug: string;
  manufacturer_name: string;
  label_name_en: string;
  label_name_ar: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  price_egp: number | "";
  compare_at_price_egp: number | "" | null;
  fabric_en: string | null;
  fabric_ar: string | null;
  image_url: string | null;
  category_en: string | null;
  category_ar: string | null;
  featured: boolean;
  is_active: boolean;
}

const emptyProductForm: ProductForm = {
  slug: "",
  manufacturer_name: "Hekal",
  label_name_en: "",
  label_name_ar: "",
  name_en: "",
  name_ar: "",
  description_en: "",
  description_ar: "",
  price_egp: 0,
  compare_at_price_egp: null,
  fabric_en: "",
  fabric_ar: "",
  image_url: "",
  category_en: "Shirts",
  category_ar: "قمصان",
  featured: false,
  is_active: true,
};

const defaultSizes = ["39", "40", "41", "42", "43", "44"];

function defaultVariants(): AdminProductVariant[] {
  return defaultSizes.map((size) => ({
    size,
    color_en: "Default",
    color_ar: "افتراضي",
    sku: "",
    stock: 0,
  }));
}

function productToForm(product: AdminProduct): ProductForm {
  return {
    id: product.id,
    slug: product.slug,
    manufacturer_name: product.manufacturer_name,
    label_name_en: product.label_name_en,
    label_name_ar: product.label_name_ar,
    name_en: product.name_en,
    name_ar: product.name_ar,
    description_en: product.description_en ?? "",
    description_ar: product.description_ar ?? "",
    price_egp: product.price_egp,
    compare_at_price_egp: product.compare_at_price_egp,
    fabric_en: product.fabric_en ?? "",
    fabric_ar: product.fabric_ar ?? "",
    image_url: product.image_url ?? "",
    category_en: product.category_en ?? "",
    category_ar: product.category_ar ?? "",
    featured: product.featured,
    is_active: product.is_active,
  };
}

export default function AdminProducts({
  initialProducts,
}: {
  initialProducts: AdminProduct[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [openProductId, setOpenProductId] = useState<string | null>(
    initialProducts[0]?.id ?? null
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingImageKey, setUploadingImageKey] = useState<string | null>(
    null
  );

  const [newProduct, setNewProduct] = useState<ProductForm>(emptyProductForm);
  const [newVariants, setNewVariants] =
    useState<AdminProductVariant[]>(defaultVariants);

  const [editForms, setEditForms] = useState<Record<string, ProductForm>>(() => {
    const initial: Record<string, ProductForm> = {};

    initialProducts.forEach((product) => {
      initial[product.id] = productToForm(product);
    });

    return initial;
  });

  const [editVariants, setEditVariants] = useState<
    Record<string, AdminProductVariant[]>
  >(() => {
    const initial: Record<string, AdminProductVariant[]> = {};

    initialProducts.forEach((product) => {
      initial[product.id] =
        product.variants.length > 0 ? product.variants : defaultVariants();
    });

    return initial;
  });

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      if (!normalizedQuery) return true;

      const text = [
        product.slug,
        product.manufacturer_name,
        product.label_name_en,
        product.label_name_ar,
        product.name_en,
        product.name_ar,
        product.category_en,
        product.category_ar,
        product.fabric_en,
        product.fabric_ar,
        product.price_egp,
        product.featured ? "featured" : "",
        product.is_active ? "active" : "inactive",
        ...product.variants.flatMap((variant) => [
          variant.size,
          variant.color_en,
          variant.color_ar,
          variant.sku,
          variant.stock,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(normalizedQuery);
    });
  }, [products, query]);

  const stats = useMemo(() => {
    const active = products.filter((product) => product.is_active).length;
    const inactive = products.filter((product) => !product.is_active).length;
    const featured = products.filter((product) => product.featured).length;
    const totalStock = products.reduce(
      (sum, product) =>
        sum +
        product.variants.reduce(
          (variantSum, variant) => variantSum + Number(variant.stock || 0),
          0
        ),
      0
    );

    return {
      total: products.length,
      active,
      inactive,
      featured,
      totalStock,
    };
  }, [products]);

  const updateNewField = (
    field: keyof ProductForm,
    value: string | number | boolean | null
  ) => {
    setNewProduct((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateEditField = (
    productId: string,
    field: keyof ProductForm,
    value: string | number | boolean | null
  ) => {
    setEditForms((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [field]: value,
      },
    }));
  };

  const updateNewVariant = (
    index: number,
    field: keyof AdminProductVariant,
    value: string | number | null
  ) => {
    setNewVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const updateEditVariant = (
    productId: string,
    index: number,
    field: keyof AdminProductVariant,
    value: string | number | null
  ) => {
    setEditVariants((current) => ({
      ...current,
      [productId]: current[productId].map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const addNewVariantRow = () => {
    setNewVariants((current) => [
      ...current,
      {
        size: "",
        color_en: "Default",
        color_ar: "افتراضي",
        sku: "",
        stock: 0,
      },
    ]);
  };

  const addEditVariantRow = (productId: string) => {
    setEditVariants((current) => ({
      ...current,
      [productId]: [
        ...(current[productId] ?? []),
        {
          size: "",
          color_en: "Default",
          color_ar: "افتراضي",
          sku: "",
          stock: 0,
        },
      ],
    }));
  };

  const uploadProductImage = async (
    file: File,
    slug: string,
    imageKey: string,
    onDone: (url: string) => void
  ) => {
    setUploadingImageKey(imageKey);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("slug", slug || "product");

      const response = await fetch("/api/admin/product-image", {
        method: "POST",
        body: formData,
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body.error || "Image upload failed.");
      }

      if (!body.publicUrl || typeof body.publicUrl !== "string") {
        throw new Error("Image uploaded, but no public URL was returned.");
      }

      onDone(body.publicUrl);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setUploadingImageKey(null);
    }
  };

  const createProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSavingId("new");

    try {
      const response = await fetch("/api/admin/product-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          product: newProduct,
          variants: newVariants,
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body.error || "Could not create product.");
      }

      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSavingId(null);
    }
  };

  const saveProduct = async (productId: string) => {
    setSavingId(productId);

    try {
      const response = await fetch("/api/admin/product-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update",
          product: editForms[productId],
          variants: editVariants[productId],
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body.error || "Could not save product.");
      }

      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSavingId(null);
    }
  };

  const toggleActive = async (product: AdminProduct) => {
    setSavingId(product.id);

    try {
      const response = await fetch("/api/admin/product-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "toggle-active",
          productId: product.id,
          value: !product.is_active,
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body.error || "Could not update product.");
      }

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                is_active: !item.is_active,
              }
            : item
        )
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSavingId(null);
    }
  };

  const toggleFeatured = async (product: AdminProduct) => {
    setSavingId(product.id);

    try {
      const response = await fetch("/api/admin/product-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "toggle-featured",
          productId: product.id,
          value: !product.featured,
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body.error || "Could not update product.");
      }

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                featured: !item.featured,
              }
            : item
        )
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.28em] text-thread">
            Hekal Admin
          </p>

          <h1 className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl">
            Product Manager
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-charcoal/60">
            Add products, upload images, edit product details, manage sizes,
            colors, stock, and visibility.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/orders"
            className="rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
          >
            Orders
          </Link>

          <button
            type="button"
            onClick={() => setShowCreate((current) => !current)}
            className="inline-flex items-center gap-2 rounded-full bg-thread px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-bone transition hover:bg-ink"
          >
            {showCreate ? <X size={15} /> : <Plus size={15} />}
            {showCreate ? "Close" : "Add product"}
          </button>

          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
            >
              Logout
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Products" value={String(stats.total)} />
        <StatCard title="Active" value={String(stats.active)} />
        <StatCard title="Inactive" value={String(stats.inactive)} />
        <StatCard title="Featured" value={String(stats.featured)} />
        <StatCard title="Stock" value={String(stats.totalStock)} />
      </div>

      <div className="mt-8 rounded-[2rem] border border-ink/10 bg-bone p-5 shadow-sm">
        <label className="relative block">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50"
          />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product, label, slug, category, size, color..."
            className="w-full rounded-full border border-ink/10 bg-white/60 py-4 pl-12 pr-5 text-sm text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
          />
        </label>

        <p className="mt-4 text-sm text-charcoal/60">
          Showing{" "}
          <span className="font-bold text-ink">{filteredProducts.length}</span>{" "}
          of <span className="font-bold text-ink">{products.length}</span>{" "}
          products.
        </p>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: 24, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -16, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={createProduct}
              className="mt-8 rounded-[2rem] border border-ink/10 bg-bone p-5 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
                    New Product
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-ink">
                    Add product
                  </h2>
                </div>

                <button
                  type="submit"
                  disabled={savingId === "new"}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-bone transition hover:bg-thread disabled:opacity-50"
                >
                  <Save size={15} />
                  {savingId === "new" ? "Saving..." : "Create"}
                </button>
              </div>

              <ProductFormFields
                form={newProduct}
                isUploadingImage={uploadingImageKey === "new"}
                onUploadImage={(file) =>
                  uploadProductImage(
                    file,
                    newProduct.slug || newProduct.name_en || "new-product",
                    "new",
                    (url) => updateNewField("image_url", url)
                  )
                }
                onChange={updateNewField}
              />

              <VariantEditor
                variants={newVariants}
                onChange={updateNewVariant}
                onAddRow={addNewVariantRow}
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 space-y-5">
        {filteredProducts.length === 0 ? (
          <div className="rounded-[2rem] border border-ink/10 bg-bone p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-seam text-ink">
              <Package size={36} />
            </div>

            <h2 className="text-2xl font-bold text-ink">No products found</h2>

            <p className="mt-2 text-sm text-charcoal/60">
              Try another search or add a new product.
            </p>
          </div>
        ) : (
          filteredProducts.map((product, index) => {
            const open = openProductId === product.id;
            const stock = product.variants.reduce(
              (sum, variant) => sum + Number(variant.stock || 0),
              0
            );

            return (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="overflow-hidden rounded-[2rem] border border-ink/10 bg-bone shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenProductId(open ? null : product.id)}
                  className="flex w-full flex-col gap-5 p-5 text-left lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-seam">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image_url}
                          alt={product.name_en}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-center text-ink/40">
                          <ImageIcon size={28} />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge
                          text={product.is_active ? "active" : "inactive"}
                        />

                        {product.featured && <StatusBadge text="featured" />}
                      </div>

                      <p className="mt-2 font-tag text-xs uppercase tracking-[0.2em] text-thread">
                        {product.label_name_en || "Hekal"}
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-ink">
                        {product.name_en}
                      </h2>

                      <p className="mt-1 text-xs text-charcoal/60">
                        {product.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 lg:justify-end">
                    <div className="text-left lg:text-right">
                      <p className="font-mono text-xl font-bold text-ink">
                        {product.price_egp.toFixed(0)} EGP
                      </p>

                      <p className="mt-1 text-xs text-charcoal/60">
                        Stock: {stock} · Variants: {product.variants.length}
                      </p>
                    </div>

                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink"
                    >
                      <ChevronDown size={18} />
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-ink/10"
                    >
                      <div className="p-5">
                        <div className="mb-6 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => saveProduct(product.id)}
                            disabled={savingId === product.id}
                            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-bone transition hover:bg-thread disabled:opacity-50"
                          >
                            <Save size={15} />
                            {savingId === product.id ? "Saving..." : "Save"}
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleFeatured(product)}
                            disabled={savingId === product.id}
                            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass disabled:opacity-50"
                          >
                            <Star size={15} />
                            {product.featured ? "Unfeature" : "Feature"}
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleActive(product)}
                            disabled={savingId === product.id}
                            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread disabled:opacity-50"
                          >
                            {product.is_active ? (
                              <Archive size={15} />
                            ) : (
                              <CheckCircle2 size={15} />
                            )}
                            {product.is_active ? "Deactivate" : "Activate"}
                          </button>

                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass"
                          >
                            View product
                          </Link>
                        </div>

                        <ProductFormFields
                          form={editForms[product.id]}
                          isUploadingImage={uploadingImageKey === product.id}
                          onUploadImage={(file) =>
                            uploadProductImage(
                              file,
                              editForms[product.id]?.slug ||
                                product.slug ||
                                "product",
                              product.id,
                              (url) =>
                                updateEditField(product.id, "image_url", url)
                            )
                          }
                          onChange={(field, value) =>
                            updateEditField(product.id, field, value)
                          }
                        />

                        <VariantEditor
                          variants={editVariants[product.id] ?? []}
                          onChange={(variantIndex, field, value) =>
                            updateEditVariant(
                              product.id,
                              variantIndex,
                              field,
                              value
                            )
                          }
                          onAddRow={() => addEditVariantRow(product.id)}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })
        )}
      </div>
    </main>
  );
}

function ProductFormFields({
  form,
  onChange,
  onUploadImage,
  isUploadingImage,
}: {
  form: ProductForm;
  onChange: (
    field: keyof ProductForm,
    value: string | number | boolean | null
  ) => void;
  onUploadImage: (file: File) => Promise<void>;
  isUploadingImage: boolean;
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <Field
          label="Slug"
          value={form.slug}
          onChange={(value) => onChange("slug", value)}
          required
        />

        <Field
          label="Manufacturer"
          value={form.manufacturer_name}
          onChange={(value) => onChange("manufacturer_name", value)}
          required
        />

        <ImageUrlField
          value={form.image_url ?? ""}
          isUploading={isUploadingImage}
          onChange={(value) => onChange("image_url", value)}
          onUpload={onUploadImage}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Label EN"
          value={form.label_name_en}
          onChange={(value) => onChange("label_name_en", value)}
          required
        />

        <Field
          label="Label AR"
          value={form.label_name_ar}
          onChange={(value) => onChange("label_name_ar", value)}
          required
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Name EN"
          value={form.name_en}
          onChange={(value) => onChange("name_en", value)}
          required
        />

        <Field
          label="Name AR"
          value={form.name_ar}
          onChange={(value) => onChange("name_ar", value)}
          required
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextAreaField
          label="Description EN"
          value={form.description_en ?? ""}
          onChange={(value) => onChange("description_en", value)}
        />

        <TextAreaField
          label="Description AR"
          value={form.description_ar ?? ""}
          onChange={(value) => onChange("description_ar", value)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <NumberField
          label="Price EGP"
          value={form.price_egp}
          onChange={(value) => onChange("price_egp", value)}
          required
        />

        <NumberField
          label="Compare Price EGP"
          value={form.compare_at_price_egp ?? ""}
          onChange={(value) =>
            onChange("compare_at_price_egp", value === "" ? null : value)
          }
        />

        <Field
          label="Category EN"
          value={form.category_en ?? ""}
          onChange={(value) => onChange("category_en", value)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Field
          label="Category AR"
          value={form.category_ar ?? ""}
          onChange={(value) => onChange("category_ar", value)}
        />

        <Field
          label="Fabric EN"
          value={form.fabric_en ?? ""}
          onChange={(value) => onChange("fabric_en", value)}
        />

        <Field
          label="Fabric AR"
          value={form.fabric_ar ?? ""}
          onChange={(value) => onChange("fabric_ar", value)}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <CheckField
          label="Active"
          checked={form.is_active}
          onChange={(value) => onChange("is_active", value)}
        />

        <CheckField
          label="Featured"
          checked={form.featured}
          onChange={(value) => onChange("featured", value)}
        />
      </div>
    </div>
  );
}

function ImageUrlField({
  value,
  onChange,
  onUpload,
  isUploading,
}: {
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}) {
  return (
    <div className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-charcoal/50">
        Image
      </span>

      <div className="rounded-2xl border border-ink/15 bg-white/60 p-3">
        {value ? (
          <div className="mb-3 flex gap-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-seam">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Product"
                className="h-full w-full object-cover"
              />
            </div>

            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-ink/10 bg-bone px-3 py-2 text-xs text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
            />
          </div>
        ) : (
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Upload image or paste image URL"
            className="mb-3 w-full rounded-xl border border-ink/10 bg-bone px-3 py-2 text-xs text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
          />
        )}

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-bone transition hover:bg-thread">
          <Upload size={14} />
          {isUploading ? "Uploading..." : "Upload image"}

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={isUploading}
            className="hidden"
            onChange={async (event: ChangeEvent<HTMLInputElement>) => {
              const input = event.currentTarget;
              const file = input.files?.[0];

              if (!file) return;

              await onUpload(file);

              input.value = "";
            }}
          />
        </label>

        <p className="mt-2 text-xs leading-5 text-charcoal/50">
          JPG, PNG, or WEBP. After upload, press Save/Create.
        </p>
      </div>
    </div>
  );
}

function VariantEditor({
  variants,
  onChange,
  onAddRow,
}: {
  variants: AdminProductVariant[];
  onChange: (
    index: number,
    field: keyof AdminProductVariant,
    value: string | number | null
  ) => void;
  onAddRow: () => void;
}) {
  return (
    <div className="mt-8 rounded-[1.5rem] border border-ink/10 bg-white/40 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            Variants
          </p>

          <p className="mt-1 text-sm text-charcoal/60">
            Manage sizes, colors, SKU, and stock.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddRow}
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink transition hover:border-brass hover:text-brass"
        >
          <Plus size={14} />
          Row
        </button>
      </div>

      <div className="grid gap-3">
        {variants.map((variant, index) => (
          <div
            key={variant.id ?? index}
            className="grid gap-3 rounded-2xl border border-ink/10 bg-bone p-3 lg:grid-cols-[0.7fr_1fr_1fr_1fr_0.7fr]"
          >
            <Field
              label="Size"
              value={variant.size}
              onChange={(value) => onChange(index, "size", value)}
            />

            <Field
              label="Color EN"
              value={variant.color_en}
              onChange={(value) => onChange(index, "color_en", value)}
            />

            <Field
              label="Color AR"
              value={variant.color_ar}
              onChange={(value) => onChange(index, "color_ar", value)}
            />

            <Field
              label="SKU"
              value={variant.sku ?? ""}
              onChange={(value) => onChange(index, "sku", value)}
            />

            <NumberField
              label="Stock"
              value={variant.stock}
              onChange={(value) => onChange(index, "stock", value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-charcoal/50">
        {label}
        {required && <span className="text-thread"> *</span>}
      </span>

      <input
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        required={required}
        className="w-full rounded-2xl border border-ink/15 bg-white/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: number | string;
  onChange: (value: number | "") => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-charcoal/50">
        {label}
        {required && <span className="text-thread"> *</span>}
      </span>

      <input
        type="number"
        value={value}
        min={0}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const nextValue = event.target.value;
          onChange(nextValue === "" ? "" : Number(nextValue));
        }}
        required={required}
        className="w-full rounded-2xl border border-ink/15 bg-white/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-charcoal/50">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(event.target.value)
        }
        rows={4}
        className="w-full resize-none rounded-2xl border border-ink/15 bg-white/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
      />
    </label>
  );
}

function CheckField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-ink/10 bg-white/50 px-4 py-3 text-sm font-semibold text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.checked)
        }
      />
      {label}
    </label>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-bone p-5 shadow-sm">
      <p className="font-tag text-xs uppercase tracking-[0.22em] text-thread">
        {title}
      </p>

      <p className="mt-3 font-mono text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function StatusBadge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-seam px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
      {text}
    </span>
  );
}