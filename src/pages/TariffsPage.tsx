import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, CreditCard, Loader2, Coins } from 'lucide-react';
import { adminPlansApi } from '@/lib/admin-api';
import type { SubscriptionPlan, SubscriptionPlanWrite } from '@/types';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import './TariffsPage.css';

const emptyForm: SubscriptionPlanWrite = {
  code: '',
  name: '',
  description: '',
  price_uzs: 0,
  duration_days: 30,
  included_coins: 0,
  is_unlimited_reading: false,
  is_unlimited_listening: false,
  is_unlimited_vocab: true,
  daily_vocab_limit: null,
  is_active: true,
};

const formatUzs = (value: number) =>
  new Intl.NumberFormat('uz-UZ').format(value) + " so'm";

export default function TariffsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // null = creating, number = editing that plan id
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SubscriptionPlanWrite>(emptyForm);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setFetchLoading(true);
      const res = await adminPlansApi.list();
      if (res.success) {
        setPlans(res.data);
      } else {
        toast.error(res.error || 'Tariflarni yuklashda xatolik');
        setPlans([]);
      }
    } catch {
      toast.error('Tariflarni yuklashda xatolik yuz berdi');
      setPlans([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const updateField = <K extends keyof SubscriptionPlanWrite>(
    key: K,
    value: SubscriptionPlanWrite[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setEditingId(plan.id);
    setForm({
      code: plan.code,
      name: plan.name,
      description: plan.description ?? '',
      price_uzs: plan.price_uzs,
      duration_days: plan.duration_days,
      included_coins: plan.included_coins,
      is_unlimited_reading: plan.is_unlimited_reading,
      is_unlimited_listening: plan.is_unlimited_listening,
      is_unlimited_vocab: plan.is_unlimited_vocab,
      daily_vocab_limit: plan.daily_vocab_limit,
      is_active: plan.is_active,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    if (!form.code.trim()) {
      toast.error('Kod kiriting!');
      return;
    }
    if (!form.name.trim()) {
      toast.error('Nom kiriting!');
      return;
    }
    if (form.price_uzs <= 0) {
      toast.error("Narx 0 dan katta bo'lishi kerak!");
      return;
    }
    if (form.duration_days <= 0) {
      toast.error("Davomiylik kamida 1 kun bo'lishi kerak!");
      return;
    }
    // Biznes qoida: cheklangan vocab -> daily_vocab_limit majburiy
    if (!form.is_unlimited_vocab && !form.daily_vocab_limit) {
      toast.error('Cheklangan vocab uchun kunlik limit kiriting!');
      return;
    }

    const payload: SubscriptionPlanWrite = {
      ...form,
      code: form.code.trim(),
      name: form.name.trim(),
      description: form.description?.trim() || null,
      daily_vocab_limit: form.is_unlimited_vocab ? null : form.daily_vocab_limit,
    };

    setSaving(true);
    try {
      if (editingId === null) {
        const res = await adminPlansApi.create(payload);
        if (res.success && res.data) {
          setPlans((prev) => [...prev, res.data as SubscriptionPlan]);
          toast.success('Tarif qoʻshildi!');
          closeForm();
        } else {
          toast.error(res.error || 'Qoʻshishda xatolik');
        }
      } else {
        const res = await adminPlansApi.update(editingId, payload);
        if (res.success && res.data) {
          setPlans((prev) =>
            prev.map((p) => (p.id === editingId ? (res.data as SubscriptionPlan) : p)),
          );
          toast.success('Tarif yangilandi!');
          closeForm();
        } else {
          toast.error(res.error || 'Yangilashda xatolik');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (plan: SubscriptionPlan) => {
    setDeleteTarget({ id: plan.id, name: plan.name });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminPlansApi.remove(deleteTarget.id);
      if (res.success) {
        setPlans((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        toast.success('Tarif oʻchirildi!');
        setDeleteModalOpen(false);
      } else {
        toast.error(res.error || "Oʻchirishda xatolik");
      }
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="tariffs-manager-page">
      <div className="page-title-section">
        <div className="page-title-content">
          <CreditCard className="page-title-icon" />
          <div>
            <h1 className="page-title">Tariflar</h1>
            <p className="page-subtitle">Obuna tariflarini qoʻshish, tahrirlash va oʻchirish</p>
          </div>
        </div>
        <Button className="add-plan-button" onClick={openCreate}>
          <Plus className="upload-icon" />
          Yangi tarif
        </Button>
      </div>

      {showForm && (
        <Card className="tariff-form-card">
          <h2 className="section-title">
            {editingId === null ? 'Yangi tarif qoʻshish' : 'Tarifni tahrirlash'}
          </h2>
          <div className="tariff-form">
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Kod *</label>
                <Input
                  placeholder="weekly"
                  value={form.code}
                  onChange={(e) => updateField('code', e.target.value)}
                  className="form-input"
                  disabled={saving}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Nom *</label>
                <Input
                  placeholder="IELTSify Weekly"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="form-input"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Tavsif</label>
              <textarea
                className="form-textarea"
                placeholder="Tarif haqida qisqacha maʼlumot"
                value={form.description ?? ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={2}
                disabled={saving}
              />
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Narx (soʻm) *</label>
                <Input
                  type="number"
                  min={0}
                  value={form.price_uzs}
                  onChange={(e) => updateField('price_uzs', Number(e.target.value))}
                  className="form-input"
                  disabled={saving}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Davomiylik (kun) *</label>
                <Input
                  type="number"
                  min={1}
                  value={form.duration_days}
                  onChange={(e) => updateField('duration_days', Number(e.target.value))}
                  className="form-input"
                  disabled={saving}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Bonus coin</label>
                <Input
                  type="number"
                  min={0}
                  value={form.included_coins}
                  onChange={(e) => updateField('included_coins', Number(e.target.value))}
                  className="form-input"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-toggles">
              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={form.is_unlimited_reading}
                  onChange={(e) => updateField('is_unlimited_reading', e.target.checked)}
                  disabled={saving}
                />
                <span>Cheksiz Reading</span>
              </label>
              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={form.is_unlimited_listening}
                  onChange={(e) => updateField('is_unlimited_listening', e.target.checked)}
                  disabled={saving}
                />
                <span>Cheksiz Listening</span>
              </label>
              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={form.is_unlimited_vocab}
                  onChange={(e) => updateField('is_unlimited_vocab', e.target.checked)}
                  disabled={saving}
                />
                <span>Cheksiz Vocab</span>
              </label>
              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                  disabled={saving}
                />
                <span>Faol</span>
              </label>
            </div>

            {!form.is_unlimited_vocab && (
              <div className="form-field">
                <label className="form-label">Kunlik vocab limiti *</label>
                <Input
                  type="number"
                  min={1}
                  value={form.daily_vocab_limit ?? ''}
                  onChange={(e) =>
                    updateField(
                      'daily_vocab_limit',
                      e.target.value === '' ? null : Number(e.target.value),
                    )
                  }
                  className="form-input"
                  disabled={saving}
                />
              </div>
            )}

            <div className="form-actions">
              <Button variant="outline" onClick={closeForm} disabled={saving}>
                Bekor qilish
              </Button>
              <Button className="submit-button" onClick={handleSubmit} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="upload-icon animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : editingId === null ? (
                  "Qoʻshish"
                ) : (
                  'Saqlash'
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="tariffs-section">
        <h2 className="section-title">Mavjud tariflar ({plans.length})</h2>

        {fetchLoading ? (
          <div className="empty-state">
            <Loader2 className="empty-icon animate-spin" />
            <p className="empty-text">Yuklanmoqda...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="empty-state">
            <CreditCard className="empty-icon" />
            <p className="empty-text">Hali tariflar yoʻq</p>
          </div>
        ) : (
          <div className="tariffs-grid">
            {plans.map((plan) => (
              <div key={plan.id} className="tariff-card">
                <div className="tariff-card-head">
                  <div>
                    <h3 className="tariff-name">{plan.name}</h3>
                    <span className="tariff-code">{plan.code}</span>
                  </div>
                  <span className={plan.is_active ? 'status-active' : 'status-inactive'}>
                    {plan.is_active ? 'Faol' : 'Nofaol'}
                  </span>
                </div>

                <div className="tariff-price">{formatUzs(plan.price_uzs)}</div>
                <div className="tariff-meta">
                  <span>{plan.duration_label || `${plan.duration_days} kun`}</span>
                  {plan.included_coins > 0 && (
                    <span className="tariff-coins">
                      <Coins className="tariff-coins-icon" />
                      {plan.included_coins}
                    </span>
                  )}
                </div>

                {plan.description && (
                  <p className="tariff-description">{plan.description}</p>
                )}

                <div className="tariff-flags">
                  {plan.is_unlimited_reading && <span className="tariff-flag">∞ Reading</span>}
                  {plan.is_unlimited_listening && <span className="tariff-flag">∞ Listening</span>}
                  {plan.is_unlimited_vocab && <span className="tariff-flag">∞ Vocab</span>}
                </div>

                <div className="tariff-actions">
                  <Button variant="outline" size="sm" onClick={() => openEdit(plan)}>
                    <Pencil className="action-icon" />
                    Tahrirlash
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteClick(plan)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Tarifni oʻchirish"
        description={`"${deleteTarget?.name}" tarifini oʻchirmoqchimisiz? Bu amalni qaytarib boʻlmaydi.`}
        confirmText={deleting ? "Oʻchirilmoqda..." : "Oʻchirish"}
        cancelText="Bekor qilish"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
