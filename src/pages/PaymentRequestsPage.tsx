import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminPaymentsApi } from "@/lib/admin-api";
import { getErrorMessage } from "@/types";
import type { PaymentRequest } from "@/types";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Search,
  Image,
  MessageSquare,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface PaymentCounts {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}
import { toast } from "sonner";
import "./PaymentsPage.css";

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function PaymentRequestsPage() {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("pending");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    paymentId: string;
  }>({ open: false, paymentId: "" });
  const [rejectReason, setRejectReason] = useState("");
  const [imageModal, setImageModal] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [counts, setCounts] = useState<PaymentCounts>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminPaymentsApi.list({
        page,
        limit: 20,
        status: filter !== "all" ? filter : undefined,
      });
      if (response.success) {
        setPayments(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.total_pages);
        }
        if (response.counts) {
          setCounts((prev) => ({ ...prev, ...response.counts }));
        }
      } else {
        setError(response.error || "To'lovlarni yuklashda xatolik");
      }
    } catch (err) {
      const message = getErrorMessage(err, "To'lovlarni yuklashda xatolik");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleApprove = async (paymentId: string) => {
    try {
      setProcessingId(paymentId);
      const response = await adminPaymentsApi.approve(paymentId);
      if (response.success) {
        toast.success("To'lov tasdiqlandi! Coinlar qo'shildi.");
        fetchPayments();
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Tasdiqlashda xatolik"));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.paymentId) return;
    try {
      setProcessingId(rejectModal.paymentId);
      const response = await adminPaymentsApi.reject(
        rejectModal.paymentId,
        rejectReason,
      );
      if (response.success) {
        toast.success("To'lov rad etildi");
        setRejectModal({ open: false, paymentId: "" });
        setRejectReason("");
        fetchPayments();
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Rad etishda xatolik"));
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "status-pending",
      approved: "status-approved",
      rejected: "status-rejected",
    };
    const labels = {
      pending: "Kutilmoqda",
      approved: "Tasdiqlangan",
      rejected: "Rad etilgan",
    };
    return (
      <span
        className={`status-badge ${styles[status as keyof typeof styles] || ""}`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const filterTabs: { key: FilterStatus; label: string }[] = [
    { key: "pending", label: `Kutilayotgan (${counts.pending})` },
    { key: "approved", label: `Tasdiqlangan (${counts.approved})` },
    { key: "rejected", label: `Rad etilgan (${counts.rejected})` },
    { key: "all", label: `Barchasi (${counts.total})` },
  ];

  return (
    <div className="payments-page">
      <div className="page-title-section">
        <div className="page-title-content">
          <DollarSign className="page-title-icon" />
          <div>
            <h1 className="page-title">To'lov So'rovlari</h1>
            <p className="page-subtitle">
              Foydalanuvchilarning to'lovlarini boshqarish
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            className={`filter-tab ${filter === tab.key ? "active" : ""}`}
            onClick={() => {
              setFilter(tab.key);
              setPage(1);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={18} />
        <Input
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchPayments()}
        />
      </div>

      {/* Payments List */}
      <Card>
        {loading ? (
          <div className="loading-state">
            <Loader2 className="animate-spin" size={32} />
            <p>Yuklanmoqda...</p>
          </div>
        ) : error ? (
          <div className="page-error-state">
            <AlertCircle size={40} />
            <h2>Yuklab bo'lmadi</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchPayments}>
              <RefreshCw size={16} /> Qayta urinish
            </button>
          </div>
        ) : payments.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={48} />
            <p>To'lov so'rovlari topilmadi</p>
          </div>
        ) : (
          <div className="payments-table">
            <div className="payments-header">
              <span className="col-user">Foydalanuvchi</span>
              <span className="col-amount">Miqdor</span>
              <span className="col-type">Turi</span>
              <span className="col-status">Holati</span>
              <span className="col-date">Sana</span>
              <span className="col-actions">Amallar</span>
            </div>
            {payments.map((payment) => (
              <div key={payment.id} className="payment-row">
                <div className="col-user">
                  <strong>{payment.profiles?.full_name || "Noma'lum"}</strong>
                  <span className="user-email">{payment.profiles?.email}</span>
                </div>
                <div className="col-amount">
                  <strong>{payment.amount.toLocaleString()}</strong>
                  <span className="currency">{payment.currency}</span>
                </div>
                <div className="col-type">
                  <span className="payment-type-badge">
                    {payment.payment_type === "coin_purchase"
                      ? "Coin xarid"
                      : payment.payment_type === "subscription"
                        ? "Obuna"
                        : "Boshqa"}
                  </span>
                </div>
                <div className="col-status">
                  {getStatusBadge(payment.status)}
                </div>
                <div className="col-date">{formatDate(payment.created_at)}</div>
                <div className="col-actions">
                  {payment.receipt_image_url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setImageModal(payment.receipt_image_url!)}
                      title="Chekni ko'rish"
                    >
                      <Image size={16} />
                    </Button>
                  )}
                  {payment.status === "pending" && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        className="btn-approve"
                        onClick={() => handleApprove(payment.id)}
                        disabled={processingId === payment.id}
                      >
                        {processingId === payment.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        Tasdiqlash
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setRejectModal({ open: true, paymentId: payment.id })
                        }
                        disabled={processingId === payment.id}
                      >
                        <XCircle size={14} />
                        Rad etish
                      </Button>
                    </>
                  )}
                  {payment.status !== "pending" && (
                    <span className="processed-by">
                      {payment.admin_note && (
                        <span className="admin-note" title={payment.admin_note}>
                          <MessageSquare size={14} />
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <Button
            variant="ghost"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Oldingi
          </Button>
          <span>
            {page} / {totalPages}
          </span>
          <Button
            variant="ghost"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Keyingi
          </Button>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div
          className="modal-overlay"
          onClick={() => setRejectModal({ open: false, paymentId: "" })}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>To'lovni rad etish</h3>
            <p>Rad etish sababini kiriting:</p>
            <textarea
              className="modal-textarea"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Sababni yozing..."
              rows={3}
            />
            <div className="modal-actions">
              <Button
                variant="ghost"
                onClick={() => setRejectModal({ open: false, paymentId: "" })}
              >
                Bekor qilish
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={processingId === rejectModal.paymentId}
              >
                {processingId === rejectModal.paymentId
                  ? "Jarayonda..."
                  : "Rad etish"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModal && (
        <div className="modal-overlay" onClick={() => setImageModal(null)}>
          <div
            className="modal-content image-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              className="modal-close"
              onClick={() => setImageModal(null)}
            >
              <XCircle size={24} />
            </Button>
            <img
              src={imageModal}
              alt="To'lov cheki"
              className="receipt-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}
