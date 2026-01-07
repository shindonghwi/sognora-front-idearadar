'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/core/stores';
import { clearTokens, clearAccountStatus } from '@/core/utils/token';
import { ROUTES } from '@/core/routes';
import { Sidebar } from '@/features/dashboard/components/sidebar';
import {
  PLANS,
  MOCK_SUBSCRIPTION,
  MOCK_PAYMENT_METHODS,
  MOCK_INVOICES,
  getPlanById,
  formatCardBrand,
  type Plan,
  type PaymentMethod,
  type Subscription,
} from './mock-data';
import styles from './payment-page.module.css';

type ModalType = 'upgrade' | 'downgrade' | 'cancel' | 'addCard' | 'editCard' | 'deleteCard' | null;

export function PaymentPage() {
  const router = useRouter();
  const { logout, profile } = useAuthStore();

  // State
  const [subscription, setSubscription] = useState<Subscription>(MOCK_SUBSCRIPTION);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedCard, setSelectedCard] = useState<PaymentMethod | null>(null);

  const currentPlan = getPlanById(subscription.plan);

  const handleLogout = () => {
    clearTokens();
    clearAccountStatus();
    logout();
    router.push(ROUTES.HOME);
  };

  // Plan change handlers
  const handlePlanClick = (plan: Plan) => {
    if (plan.id === subscription.plan) return;

    setSelectedPlan(plan);
    if (plan.price > (currentPlan?.price || 0)) {
      setModalType('upgrade');
    } else {
      setModalType('downgrade');
    }
  };

  const handleConfirmPlanChange = () => {
    if (!selectedPlan) return;

    // Mock plan change
    setSubscription((prev) => ({
      ...prev,
      plan: selectedPlan.id,
      price: selectedPlan.price,
      usage: {
        ...prev.usage,
        ideasLimit: selectedPlan.ideas === -1 ? 999999 : selectedPlan.ideas,
        reportsLimit: selectedPlan.reports === -1 ? 999999 : selectedPlan.reports,
      },
    }));

    setModalType(null);
    setSelectedPlan(null);
  };

  // Payment method handlers
  const handleAddCard = () => {
    setSelectedCard(null);
    setModalType('addCard');
  };

  const handleEditCard = (card: PaymentMethod) => {
    setSelectedCard(card);
    setModalType('editCard');
  };

  const handleDeleteCard = (card: PaymentMethod) => {
    setSelectedCard(card);
    setModalType('deleteCard');
  };

  const handleSetDefaultCard = (cardId: string) => {
    setPaymentMethods((prev) =>
      prev.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
  };

  const handleConfirmAddCard = () => {
    // Mock add card
    const newCard: PaymentMethod = {
      id: String(Date.now()),
      brand: 'visa',
      last4: '1234',
      expMonth: 12,
      expYear: 2028,
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods((prev) => [...prev, newCard]);
    setModalType(null);
  };

  const handleConfirmDeleteCard = () => {
    if (!selectedCard) return;

    setPaymentMethods((prev) => {
      const filtered = prev.filter((card) => card.id !== selectedCard.id);
      // If deleted card was default, make first remaining card default
      if (selectedCard.isDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });

    setModalType(null);
    setSelectedCard(null);
  };

  // Cancel subscription handler
  const handleCancelSubscription = () => {
    setModalType('cancel');
  };

  const handleConfirmCancel = () => {
    setSubscription((prev) => ({
      ...prev,
      cancelAtPeriodEnd: true,
    }));
    setModalType(null);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPlan(null);
    setSelectedCard(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.layout}>
      <Sidebar onLogout={handleLogout} userEmail={profile?.email} />

      <main className={styles.main}>
        <div className={styles.content}>
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className={styles.pageTitle}>Payment & Billing</h1>
            <p className={styles.pageDescription}>
              Manage your subscription, payment methods, and invoices.
            </p>
          </motion.div>

          {/* Section 1: Current Plan */}
          <motion.section
            className={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className={styles.sectionTitle}>Your Plan</h2>

            <div className={styles.planHeader}>
              <div className={styles.planInfo}>
                <span className={`${styles.planBadge} ${styles[subscription.plan]}`}>
                  {currentPlan?.name}
                </span>
                <span className={styles.planPrice}>
                  ${subscription.price}<span>/month</span>
                </span>
              </div>
              <span className={styles.renewalDate}>
                {subscription.cancelAtPeriodEnd
                  ? `Cancels on ${formatDate(subscription.nextBillingDate)}`
                  : `Renews ${formatDate(subscription.nextBillingDate)}`}
              </span>
            </div>

            <div className={styles.usageGrid}>
              <div className={styles.usageItem}>
                <div className={styles.usageHeader}>
                  <span className={styles.usageLabel}>Ideas</span>
                  <span className={styles.usageCount}>
                    {subscription.usage.ideasUsed} / {subscription.usage.ideasLimit === 999999 ? 'Unlimited' : subscription.usage.ideasLimit}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${Math.min((subscription.usage.ideasUsed / subscription.usage.ideasLimit) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className={styles.usageItem}>
                <div className={styles.usageHeader}>
                  <span className={styles.usageLabel}>Reports</span>
                  <span className={styles.usageCount}>
                    {subscription.usage.reportsUsed} / {subscription.usage.reportsLimit === 999999 ? 'Unlimited' : subscription.usage.reportsLimit}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${Math.min((subscription.usage.reportsUsed / subscription.usage.reportsLimit) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Change Plan */}
          <motion.section
            className={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className={styles.sectionTitle}>Change Plan</h2>

            <div className={styles.planGrid}>
              {PLANS.map((plan) => {
                const isCurrent = plan.id === subscription.plan;
                const isUpgrade = plan.price > (currentPlan?.price || 0);

                return (
                  <div
                    key={plan.id}
                    className={`${styles.planCard} ${isCurrent ? styles.current : ''} ${plan.popular ? styles.popular : ''}`}
                    onClick={() => !isCurrent && handlePlanClick(plan)}
                  >
                    {plan.popular && !isCurrent && (
                      <span className={styles.popularBadge}>Most Popular</span>
                    )}
                    <div className={styles.planCardName}>{plan.name}</div>
                    <div className={styles.planCardPrice}>
                      ${plan.price}<span>/mo</span>
                    </div>
                    <div className={styles.planCardFeatures}>
                      {plan.ideas === -1 ? 'Unlimited' : plan.ideas} ideas/month
                      <br />
                      {plan.reports === -1 ? 'Unlimited' : plan.reports} reports/month
                    </div>
                    <button
                      className={`${styles.planCardButton} ${
                        isCurrent ? styles.current : isUpgrade ? styles.upgrade : styles.downgrade
                      }`}
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Current Plan' : isUpgrade ? 'Upgrade' : 'Downgrade'}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Section 3: Payment Methods */}
          <motion.section
            className={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h2 className={styles.sectionTitle}>Payment Methods</h2>

            <div className={styles.paymentMethodsList}>
              {paymentMethods.map((card) => (
                <div key={card.id} className={styles.paymentMethodCard}>
                  <div className={styles.paymentMethodInfo}>
                    <span className={styles.cardIcon}>
                      {card.brand === 'visa' && '💳'}
                      {card.brand === 'mastercard' && '💳'}
                      {card.brand === 'amex' && '💳'}
                      {card.brand === 'discover' && '💳'}
                    </span>
                    <div className={styles.cardDetails}>
                      <span className={styles.cardNumber}>
                        {formatCardBrand(card.brand)} •••• {card.last4}
                      </span>
                      <span className={styles.cardExpiry}>
                        Expires {card.expMonth.toString().padStart(2, '0')}/{card.expYear}
                      </span>
                    </div>
                    <div className={styles.cardBadges}>
                      {card.isDefault && <span className={styles.defaultBadge}>Default</span>}
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    {!card.isDefault && (
                      <button
                        className={styles.cardActionBtn}
                        onClick={() => handleSetDefaultCard(card.id)}
                      >
                        Set Default
                      </button>
                    )}
                    <button className={styles.cardActionBtn} onClick={() => handleEditCard(card)}>
                      Edit
                    </button>
                    <button
                      className={`${styles.cardActionBtn} ${styles.delete}`}
                      onClick={() => handleDeleteCard(card)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className={styles.addPaymentBtn} onClick={handleAddCard}>
              + Add Payment Method
            </button>
          </motion.section>

          {/* Section 4: Invoice History */}
          <motion.section
            className={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h2 className={styles.sectionTitle}>Invoice History</h2>

            <table className={styles.invoiceTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {MOCK_INVOICES.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{formatDate(invoice.date)}</td>
                    <td>{invoice.description}</td>
                    <td>${invoice.amount.toFixed(2)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[invoice.status]}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className={styles.downloadBtn}>PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.section>

          {/* Section 5: Danger Zone */}
          <motion.section
            className={`${styles.section} ${styles.dangerZone}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <h2 className={styles.sectionTitle}>Danger Zone</h2>

            <div className={styles.dangerContent}>
              <p className={styles.dangerText}>
                {subscription.cancelAtPeriodEnd
                  ? `Your subscription is scheduled to cancel on ${formatDate(subscription.nextBillingDate)}. You'll be downgraded to the Lite plan.`
                  : `Cancel your subscription. You'll keep access until ${formatDate(subscription.nextBillingDate)}, then be downgraded to the Lite plan.`}
              </p>
              {!subscription.cancelAtPeriodEnd && (
                <button className={styles.cancelBtn} onClick={handleCancelSubscription}>
                  Cancel Subscription
                </button>
              )}
            </div>
          </motion.section>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {modalType && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Upgrade Modal */}
              {modalType === 'upgrade' && selectedPlan && (
                <>
                  <h3 className={styles.modalTitle}>Upgrade to {selectedPlan.name}</h3>
                  <p className={styles.modalDescription}>
                    You&apos;ll be charged ${selectedPlan.price}/month starting today. Your new limits
                    will take effect immediately.
                  </p>
                  <div className={styles.modalActions}>
                    <button className={`${styles.modalBtn} ${styles.cancel}`} onClick={closeModal}>
                      Cancel
                    </button>
                    <button
                      className={`${styles.modalBtn} ${styles.confirm}`}
                      onClick={handleConfirmPlanChange}
                    >
                      Confirm Upgrade
                    </button>
                  </div>
                </>
              )}

              {/* Downgrade Modal */}
              {modalType === 'downgrade' && selectedPlan && (
                <>
                  <h3 className={styles.modalTitle}>Downgrade to {selectedPlan.name}</h3>
                  <p className={styles.modalDescription}>
                    Your plan will change to {selectedPlan.name} at the end of your current billing
                    period ({formatDate(subscription.nextBillingDate)}). You&apos;ll lose access to
                    premium features.
                  </p>
                  <div className={styles.modalActions}>
                    <button className={`${styles.modalBtn} ${styles.cancel}`} onClick={closeModal}>
                      Keep Current Plan
                    </button>
                    <button
                      className={`${styles.modalBtn} ${styles.confirm}`}
                      onClick={handleConfirmPlanChange}
                    >
                      Confirm Downgrade
                    </button>
                  </div>
                </>
              )}

              {/* Add Card Modal */}
              {modalType === 'addCard' && (
                <>
                  <h3 className={styles.modalTitle}>Add Payment Method</h3>
                  <p className={styles.modalDescription}>
                    Enter your card details to add a new payment method.
                  </p>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Card Number</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Expiry</label>
                      <input type="text" className={styles.formInput} placeholder="MM/YY" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>CVC</label>
                      <input type="text" className={styles.formInput} placeholder="123" />
                    </div>
                  </div>
                  <div className={styles.modalActions}>
                    <button className={`${styles.modalBtn} ${styles.cancel}`} onClick={closeModal}>
                      Cancel
                    </button>
                    <button
                      className={`${styles.modalBtn} ${styles.confirm}`}
                      onClick={handleConfirmAddCard}
                    >
                      Add Card
                    </button>
                  </div>
                </>
              )}

              {/* Edit Card Modal */}
              {modalType === 'editCard' && selectedCard && (
                <>
                  <h3 className={styles.modalTitle}>Edit Payment Method</h3>
                  <p className={styles.modalDescription}>
                    Update the expiry date for your {formatCardBrand(selectedCard.brand)} ending in{' '}
                    {selectedCard.last4}.
                  </p>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Expiry</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="MM/YY"
                        defaultValue={`${selectedCard.expMonth.toString().padStart(2, '0')}/${selectedCard.expYear.toString().slice(-2)}`}
                      />
                    </div>
                  </div>
                  <div className={styles.modalActions}>
                    <button className={`${styles.modalBtn} ${styles.cancel}`} onClick={closeModal}>
                      Cancel
                    </button>
                    <button className={`${styles.modalBtn} ${styles.confirm}`} onClick={closeModal}>
                      Save Changes
                    </button>
                  </div>
                </>
              )}

              {/* Delete Card Modal */}
              {modalType === 'deleteCard' && selectedCard && (
                <>
                  <h3 className={styles.modalTitle}>Delete Payment Method</h3>
                  <p className={styles.modalDescription}>
                    Are you sure you want to remove the {formatCardBrand(selectedCard.brand)} ending
                    in {selectedCard.last4}? This action cannot be undone.
                  </p>
                  <div className={styles.modalActions}>
                    <button className={`${styles.modalBtn} ${styles.cancel}`} onClick={closeModal}>
                      Cancel
                    </button>
                    <button
                      className={`${styles.modalBtn} ${styles.danger}`}
                      onClick={handleConfirmDeleteCard}
                    >
                      Delete Card
                    </button>
                  </div>
                </>
              )}

              {/* Cancel Subscription Modal */}
              {modalType === 'cancel' && (
                <>
                  <h3 className={styles.modalTitle}>Cancel Subscription</h3>
                  <p className={styles.modalDescription}>
                    Are you sure you want to cancel your subscription? You&apos;ll keep access to{' '}
                    {currentPlan?.name} features until {formatDate(subscription.nextBillingDate)},
                    then be downgraded to the Lite plan.
                  </p>
                  <div className={styles.modalActions}>
                    <button className={`${styles.modalBtn} ${styles.cancel}`} onClick={closeModal}>
                      Keep Subscription
                    </button>
                    <button
                      className={`${styles.modalBtn} ${styles.danger}`}
                      onClick={handleConfirmCancel}
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
