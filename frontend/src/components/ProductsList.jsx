
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trash,
  Star,
  Pencil,
  Check,
  X,
  Tag,
} from "lucide-react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

import { useProductStore } from "../stores/useProductStore";

const money = (value) =>
  `N$${Number(value ?? 0).toLocaleString("en-NA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ProductsList = () => {
  const {
    products,
    deleteProduct,
    toggleFeaturedProduct,
    updateProductStock,
    updateProductDetails,
  } = useProductStore();

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    regularPrice: "",
    salePrice: "",
    inventoryQuantity: "",
  });

  const startEditing = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      regularPrice: String(
        product.originalPrice ?? product.price
      ),
      salePrice:
        product.originalPrice > product.price
          ? String(product.price)
          : "",
      inventoryQuantity: String(
        product.inventoryQuantity ?? 0
      ),
    });
  };

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const regular = Number(form.regularPrice);
  const sale = Number(form.salePrice);

  const hasSale = form.salePrice.trim() !== "";

  const previewDiscount =
    hasSale &&
    Number.isFinite(regular) &&
    Number.isFinite(sale) &&
    regular > 0 &&
    sale >= 0 &&
    sale < regular
      ? Math.round(((regular - sale) / regular) * 100)
      : 0;

  const saveChanges = async (product) => {
    const stock = Number(form.inventoryQuantity);

    if (!form.name.trim()) {
      toast.error("Product name cannot be empty");
      return;
    }

    if (
      form.regularPrice.trim() === "" ||
      !Number.isFinite(regular) ||
      regular < 0
    ) {
      toast.error("Enter a valid regular price");
      return;
    }

    if (
      hasSale &&
      (!Number.isFinite(sale) || sale < 0 || sale >= regular)
    ) {
      toast.error(
        "Sale price must be lower than regular price"
      );
      return;
    }

    if (
      form.inventoryQuantity.trim() === "" ||
      !Number.isSafeInteger(stock) ||
      stock < 0
    ) {
      toast.error("Enter a valid stock quantity");
      return;
    }

    setSaving(true);

    try {
      const detailsSaved = await updateProductDetails(
        product._id,
        {
          name: form.name.trim(),
          regularPrice: form.regularPrice,
          salePrice: hasSale ? form.salePrice : null,
        }
      );

      if (!detailsSaved) return;

      const oldStock = Number(
        product.inventoryQuantity ?? 0
      );

      if (stock !== oldStock) {
        const stockSaved = await updateProductStock(
          product._id,
          stock
        );

        if (!stockSaved) {
          toast.error(
            "Pricing saved, but stock was not updated"
          );
          return;
        }
      }

      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="mx-auto w-full max-w-7xl overflow-hidden rounded-xl border border-[#69404b] bg-[#21151f] shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between border-b border-[#69404b] bg-[#351823] px-4 py-3">
        <h2 className="font-bold text-red-300">
          Inventory Management
        </h2>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[920px] table-fixed text-left">
          <colgroup>
            <col className="w-[25%]" />
            <col className="w-[13%]" />
            <col className="w-[11%]" />
            <col className="w-[13%]" />
            <col className="w-[17%]" />
            <col className="w-[9%]" />
            <col className="w-[12%]" />
          </colgroup>

          <thead className="border-b border-[#69404b] bg-[#2b1a26] text-[11px] uppercase tracking-wide text-gray-400">
            <tr>
              <th className="px-3 py-3">Product</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Discount</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-2 py-3">Featured</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#51303d]">
            {products.map((product) => (
              <tr
                key={product._id}
                className="align-top transition-colors hover:bg-red-950/20"
              >
                <td className="px-3 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 shrink-0 rounded-md border border-red-400/20 object-cover"
                    />

                    <span
                      title={product.name}
                      className="min-w-0 truncate text-xs font-semibold text-gray-200"
                    >
                      {product.name}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-3">
                  <span className="text-xs font-medium text-gray-200">
                    {money(product.price)}
                  </span>

                  {product.originalPrice > product.price && (
                    <span className="mt-1 block text-[10px] text-gray-500 line-through">
                      {money(product.originalPrice)}
                    </span>
                  )}
                </td>

                <td className="px-3 py-3">
                  {product.discountPercentage > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-950/60 px-2 py-1 text-[10px] font-bold text-red-300">
                      <Tag size={11} />
                      {product.discountPercentage}% OFF
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      —
                    </span>
                  )}
                </td>

                <td className="px-3 py-3">
                  <span className="block text-xs text-gray-200">
                    {product.inventoryQuantity} units
                  </span>

                  <span
                    className={`mt-1 block text-[10px] font-semibold ${
                      product.inventoryQuantity === 0
                        ? "text-red-400"
                        : product.inventoryQuantity <= 5
                          ? "text-amber-400"
                          : "text-emerald-400"
                    }`}
                  >
                    {product.inventoryQuantity === 0
                      ? "Sold Out"
                      : product.inventoryQuantity <= 5
                        ? "Low Stock"
                        : "In Stock"}
                  </span>
                </td>

                <td className="px-3 py-3 text-xs text-gray-300">
                  <span className="block truncate">
                    {product.category?.name ?? "Uncategorized"}
                  </span>
                </td>

                <td className="px-2 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      toggleFeaturedProduct(product._id)
                    }
                    aria-label="Toggle featured product"
                    aria-pressed={Boolean(product.isFeatured)}
                    className={`rounded-md p-2 ${
                      product.isFeatured
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-gray-800 text-gray-400 hover:text-amber-400"
                    }`}
                  >
                    <Star
                      size={16}
                      className={
                        product.isFeatured ? "fill-amber-400" : ""
                      }
                    />
                  </button>
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        editingId === product._id
                          ? setEditingId(null)
                          : startEditing(product)
                      }
                      title="Edit product"
                      className="rounded-md bg-gray-800 p-2 text-gray-200 hover:text-red-400"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete "${product.name}" permanently?`
                          )
                        ) {
                          deleteProduct(product._id);
                        }
                      }}
                      title="Delete product"
                      className="rounded-md bg-gray-800 p-2 text-red-400 hover:bg-red-950/40"
                    >
                      <Trash size={15} />
                    </button>
                  </div>

                </td>

                {editingId === product._id && (
                  <td
                  
                  />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
{/* Centered product editor modal */}
{editingId &&
  createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) {
          setEditingId(null);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-artifact-title"
        className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-2xl border border-[#805360] bg-[#21151f] p-5 text-white shadow-[0_0_45px_rgba(127,29,29,0.25)] sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id="edit-artifact-title"
              className="text-xl font-bold text-red-300"
            >
              Edit Artifact
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Update product details and pricing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditingId(null)}
            disabled={saving}
            aria-label="Close editor"
            className="rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-gray-300">
              Product Name
            </span>

            <input
              type="text"
              maxLength={200}
              value={form.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
              className="w-full rounded-lg border border-[#805360] bg-[#170f16] px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-gray-300">
                Regular Price (NAD)
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.regularPrice}
                onChange={(e) =>
                  updateField("regularPrice", e.target.value)
                }
                className="w-full rounded-lg border border-[#805360] bg-[#170f16] px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-gray-300">
                Sale Price (NAD)
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.salePrice}
                onChange={(e) =>
                  updateField("salePrice", e.target.value)
                }
                placeholder="Optional"
                className="w-full rounded-lg border border-[#805360] bg-[#170f16] px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
              />
            </label>
          </div>

          <p className="text-xs text-gray-500">
            Leave the sale price empty to remove the discount.
          </p>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-gray-300">
              Stock Quantity
            </span>

            <input
              type="number"
              min="0"
              step="1"
              value={form.inventoryQuantity}
              onChange={(e) =>
                updateField("inventoryQuantity", e.target.value)
              }
              className="w-full rounded-lg border border-[#805360] bg-[#170f16] px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
            />
          </label>
        </div>

        <div className="mt-5 rounded-lg border border-[#69404b] bg-[#170f16] p-3">
          {previewDiscount > 0 ? (
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center rounded-md border border-red-400/50 bg-red-950/70 px-2.5 py-1 text-xs font-bold text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.30)] backdrop-blur-sm">
                {previewDiscount}% OFF
              </span>

              <span className="text-xs text-gray-400">
                Discount calculated automatically
              </span>
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              No active discount.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-[#69404b] pt-4">
          <button
            type="button"
            onClick={() => setEditingId(null)}
            disabled={saving}
            className="rounded-lg border border-[#805360] px-4 py-2 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              const product = products.find(
                (item) => item._id === editingId
              );

              if (product) saveChanges(product);
            }}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-[#922638] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            <Check size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}


      {products.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="font-semibold text-red-300">
            The vault is empty.
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Add your first cursed artifact to begin.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ProductsList;
