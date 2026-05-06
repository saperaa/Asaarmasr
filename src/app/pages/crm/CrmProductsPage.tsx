import { useState } from "react";
import { Plus, Pencil, Trash2, Package, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useCrm, type Product, type GoldKarat } from "../../context/crm-context";
import { cn } from "../../components/ui/utils";

const KARATS: GoldKarat[] = ["24K", "22K", "21K", "18K", "14K"];

const KARAT_COLORS: Record<GoldKarat, string> = {
  "24K": "text-yellow-300 bg-yellow-300/10 border-yellow-300/25",
  "22K": "text-yellow-400 bg-yellow-400/10 border-yellow-400/25",
  "21K": "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/25",
  "18K": "text-amber-400 bg-amber-400/10 border-amber-400/25",
  "14K": "text-orange-400 bg-orange-400/10 border-orange-400/25",
};

const EMPTY_FORM = {
  name_en: "",
  name_ar: "",
  karat: "21K" as GoldKarat,
  description_en: "",
  description_ar: "",
  imageUrl: "",
  active: true,
};

type FormData = typeof EMPTY_FORM;

function ProductFormModal({
  initial,
  onSave,
  onClose,
  title,
}: {
  initial: FormData;
  onSave: (data: FormData) => void | Promise<void>;
  onClose: () => void;
  title: string;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name_en.trim()) e.name_en = "Required";
    if (!form.name_ar.trim()) e.name_ar = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  const inputClass = (err?: string) =>
    cn(
      "w-full rounded-xl border bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all focus:bg-white/[0.06]",
      err
        ? "border-red-500/40 focus:border-red-500/60"
        : "border-[#D4AF37]/15 focus:border-[#D4AF37]/40"
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-[#D4AF37]/20 bg-[#0d0d0d] shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-white font-semibold">{title}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Product Name (English)</label>
              <input
                type="text"
                placeholder="Gold Bars"
                value={form.name_en}
                onChange={(e) => set("name_en", e.target.value)}
                className={inputClass(errors.name_en)}
              />
              {errors.name_en && <p className="text-red-400 text-xs mt-1">{errors.name_en}</p>}
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">اسم المنتج (عربي)</label>
              <input
                type="text"
                dir="rtl"
                placeholder="سبائك ذهب"
                value={form.name_ar}
                onChange={(e) => set("name_ar", e.target.value)}
                className={inputClass(errors.name_ar)}
              />
              {errors.name_ar && <p className="text-red-400 text-xs mt-1">{errors.name_ar}</p>}
            </div>
          </div>

          {/* Karat */}
          <div>
            <label className="block text-xs text-white/50 mb-2">Karat</label>
            <div className="flex gap-2 flex-wrap">
              {KARATS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => set("karat", k)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all",
                    form.karat === k
                      ? KARAT_COLORS[k]
                      : "border-white/10 text-white/40 hover:border-white/20"
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Description (English)</label>
            <textarea
              rows={2}
              placeholder="Investment-grade pure gold bars…"
              value={form.description_en}
              onChange={(e) => set("description_en", e.target.value)}
              className={cn(inputClass(), "resize-none")}
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">الوصف (عربي)</label>
            <textarea
              rows={2}
              dir="rtl"
              placeholder="سبائك ذهب خالص معتمدة دولياً…"
              value={form.description_ar}
              onChange={(e) => set("description_ar", e.target.value)}
              className={cn(inputClass(), "resize-none")}
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Image URL (optional)</label>
            <input
              type="text"
              placeholder="https://…"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              className={inputClass()}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-white/60">Product Active</span>
            <button
              type="button"
              onClick={() => set("active", !form.active)}
              className={cn("transition-colors", form.active ? "text-green-400" : "text-white/30")}
            >
              {form.active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </button>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-all"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CrmProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useCrm();
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAdd = async (data: FormData) => {
    try {
      await addProduct(data);
      setShowAdd(false);
    } catch {}
  };

  const handleEdit = async (data: FormData) => {
    if (!editProduct) return;
    try {
      await updateProduct(editProduct.id, data);
      setEditProduct(null);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setConfirmDelete(null);
    } catch {}
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-heading text-2xl font-semibold">Products</h1>
          <p className="text-white/40 text-sm mt-1">
            Manage gold products shown on the Buy Gold page.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] px-4 py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-[0_4px_16px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-[#D4AF37]/15 bg-white/[0.03] backdrop-blur-sm p-5 hover:border-[#D4AF37]/25 transition-all"
          >
            {/* Image */}
            <div className="w-full h-28 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-[#FFD700]/5 border border-[#D4AF37]/10 flex items-center justify-center mb-4 overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name_en}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <Package className="w-10 h-10 text-[#D4AF37]/30" />
              )}
            </div>

            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">{product.name_en}</h3>
                <p className="text-white/40 text-xs truncate" dir="rtl">{product.name_ar}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                <span className={cn("text-xs px-2 py-0.5 rounded-full border font-semibold", KARAT_COLORS[product.karat])}>
                  {product.karat}
                </span>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full border",
                  product.active
                    ? "text-green-400 bg-green-400/10 border-green-400/20"
                    : "text-red-400 bg-red-400/10 border-red-400/20"
                )}>
                  {product.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {product.description_en && (
              <p className="text-white/35 text-xs mb-4 line-clamp-2">{product.description_en}</p>
            )}

            <div className="flex items-center gap-2 mt-auto">
              <button
                onClick={() => { void updateProduct(product.id, { active: !product.active }); }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 py-1.5 text-xs text-white/50 hover:text-white hover:border-white/20 transition-all"
              >
                {product.active
                  ? <><ToggleRight className="w-3.5 h-3.5 text-green-400" /> Deactivate</>
                  : <><ToggleLeft className="w-3.5 h-3.5" /> Activate</>}
              </button>
              <button
                onClick={() => setEditProduct(product)}
                className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 transition-all"
                aria-label="Edit product"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setConfirmDelete(product.id)}
                className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/20 transition-all"
                aria-label="Delete product"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-[#D4AF37]/15 p-12 text-center">
            <Package className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No products yet. Add your first product.</p>
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <ProductFormModal
          title="Add New Product"
          initial={EMPTY_FORM}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Edit modal */}
      {editProduct && (
        <ProductFormModal
          title="Edit Product"
          initial={{
            name_en: editProduct.name_en,
            name_ar: editProduct.name_ar,
            karat: editProduct.karat,
            description_en: editProduct.description_en,
            description_ar: editProduct.description_ar,
            imageUrl: editProduct.imageUrl,
            active: editProduct.active,
          }}
          onSave={handleEdit}
          onClose={() => setEditProduct(null)}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0d0d0d] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
            <h3 className="text-white font-semibold mb-2">Delete Product?</h3>
            <p className="text-white/50 text-sm mb-5">
              This will permanently remove the product from the store.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 rounded-xl bg-red-500/80 hover:bg-red-500 py-2.5 text-sm font-semibold text-white transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
