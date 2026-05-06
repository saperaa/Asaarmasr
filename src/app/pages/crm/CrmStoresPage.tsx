import { useState } from "react";
import { Plus, Pencil, Trash2, Store, ToggleLeft, ToggleRight, X, Check } from "lucide-react";
import { useCrm, type Store as StoreType } from "../../context/crm-context";
import { cn } from "../../components/ui/utils";

const EMPTY_FORM = {
  name_en: "",
  name_ar: "",
  address_en: "",
  address_ar: "",
  phone: "",
  city_en: "",
  city_ar: "",
  imageUrl: "",
  active: true,
};

type FormData = typeof EMPTY_FORM;

function StoreFormModal({
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

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name_en.trim()) e.name_en = "Required";
    if (!form.name_ar.trim()) e.name_ar = "Required";
    if (!form.address_en.trim()) e.address_en = "Required";
    if (!form.city_en.trim()) e.city_en = "Required";
    if (!form.phone.trim()) e.phone = "Required";
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

  const Field = ({
    label,
    field,
    placeholder,
    dir,
  }: {
    label: string;
    field: keyof FormData;
    placeholder?: string;
    dir?: "rtl";
  }) => (
    <div>
      <label className="block text-xs text-white/50 mb-1.5">{label}</label>
      <input
        type="text"
        dir={dir}
        placeholder={placeholder}
        value={form[field] as string}
        onChange={(e) => set(field, e.target.value)}
        className={inputClass(errors[field])}
      />
      {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-[#D4AF37]/20 bg-[#0d0d0d] shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-white font-semibold">{title}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Store Name (English)" field="name_en" placeholder="Cairo Gold Center" />
            <Field label="اسم المتجر (عربي)" field="name_ar" placeholder="مركز القاهرة للذهب" dir="rtl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City (English)" field="city_en" placeholder="Cairo" />
            <Field label="المدينة (عربي)" field="city_ar" placeholder="القاهرة" dir="rtl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Address (English)" field="address_en" placeholder="12 Tahrir Square" />
            <Field label="العنوان (عربي)" field="address_ar" placeholder="١٢ ميدان التحرير" dir="rtl" />
          </div>
          <Field label="Phone Number" field="phone" placeholder="+20 2 2345 6789" />
          <Field label="Image URL (optional)" field="imageUrl" placeholder="https://…" />

          {/* Active toggle */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-white/60">Store Active</span>
            <button
              type="button"
              onClick={() => set("active", !form.active)}
              className={cn(
                "transition-colors",
                form.active ? "text-green-400" : "text-white/30"
              )}
            >
              {form.active ? (
                <ToggleRight className="w-8 h-8" />
              ) : (
                <ToggleLeft className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-[0_4px_16px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)] transition-all"
            >
              Save Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CrmStoresPage() {
  const { stores, addStore, updateStore, deleteStore } = useCrm();
  const [showAdd, setShowAdd] = useState(false);
  const [editStore, setEditStore] = useState<StoreType | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAdd = async (data: FormData) => {
    try {
      await addStore(data);
      setShowAdd(false);
    } catch { /* error handled by context */ }
  };

  const handleEdit = async (data: FormData) => {
    if (editStore) {
      try {
        await updateStore(editStore.id, data);
        setEditStore(null);
      } catch { /* error handled by context */ }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStore(id);
      setConfirmDelete(null);
    } catch { /* error handled by context */ }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-heading text-2xl font-semibold">Stores</h1>
          <p className="text-white/40 text-sm mt-1">
            Manage store locations. Active stores appear on the main website.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] px-4 py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-[0_4px_16px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Store
        </button>
      </div>

      {/* Store grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stores.map((store) => (
          <div
            key={store.id}
            className="rounded-2xl border border-[#D4AF37]/15 bg-white/[0.03] backdrop-blur-sm p-5 hover:border-[#D4AF37]/25 transition-all"
          >
            {/* Store image placeholder */}
            <div className="w-full h-28 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-[#FFD700]/5 border border-[#D4AF37]/10 flex items-center justify-center mb-4 overflow-hidden">
              {store.imageUrl ? (
                <img
                  src={store.imageUrl}
                  alt={store.name_en}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <Store className="w-10 h-10 text-[#D4AF37]/30" />
              )}
            </div>

            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-white font-semibold text-sm">{store.name_en}</h3>
                <p className="text-white/40 text-xs" dir="rtl">
                  {store.name_ar}
                </p>
              </div>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full border shrink-0 ml-2",
                  store.active
                    ? "text-green-400 bg-green-400/10 border-green-400/20"
                    : "text-red-400 bg-red-400/10 border-red-400/20"
                )}
              >
                {store.active ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="text-white/50 text-xs mb-0.5">{store.city_en}</p>
            <p className="text-white/35 text-xs mb-0.5">{store.address_en}</p>
            <p className="text-white/35 text-xs mb-4">{store.phone}</p>

            <div className="flex items-center gap-2">
              <button
                onClick={async () => { try { await updateStore(store.id, { active: !store.active }); } catch {} }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 py-1.5 text-xs text-white/50 hover:text-white hover:border-white/20 transition-all"
              >
                {store.active ? (
                  <ToggleRight className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <ToggleLeft className="w-3.5 h-3.5" />
                )}
                {store.active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => setEditStore(store)}
                className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 transition-all"
                aria-label="Edit store"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setConfirmDelete(store.id)}
                className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/20 transition-all"
                aria-label="Delete store"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {stores.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-[#D4AF37]/15 p-12 text-center">
            <Store className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No stores yet. Add your first store.</p>
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <StoreFormModal
          title="Add New Store"
          initial={EMPTY_FORM}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Edit modal */}
      {editStore && (
        <StoreFormModal
          title="Edit Store"
          initial={{
            name_en: editStore.name_en,
            name_ar: editStore.name_ar,
            address_en: editStore.address_en,
            address_ar: editStore.address_ar,
            phone: editStore.phone,
            city_en: editStore.city_en,
            city_ar: editStore.city_ar,
            imageUrl: editStore.imageUrl,
            active: editStore.active,
          }}
          onSave={handleEdit}
          onClose={() => setEditStore(null)}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0d0d0d] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
            <h3 className="text-white font-semibold mb-2">Delete Store?</h3>
            <p className="text-white/50 text-sm mb-5">
              This will permanently remove the store. This action cannot be undone.
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
