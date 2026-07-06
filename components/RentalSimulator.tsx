'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LONG_TERM_MIN_DAYS, dailyRate } from '@/lib/bikes';
import { ACCESSORY_PRICE_PER_DAY } from '@/lib/accessories';

const MIN_DAYS = 2;
const MAX_DAYS = 21;
const DEPOSIT_RATE = 0.2;

/** Interactive rental estimate: pick a duration and see the tier-adjusted daily
 * rate, any chosen accessories, the total, the 20% booking deposit (acompte),
 * the balance due at pickup and the refundable security deposit for this bike.
 * Rentals of 6+ days get the lower long-term rate. `accessoryCount` is the
 * number of add-ons selected in the booking form (€15/day each). */
export default function RentalSimulator({
  price,
  priceShort,
  securityDeposit,
  accessoryCount = 0,
}: {
  price: number;
  priceShort: number;
  securityDeposit: number;
  accessoryCount?: number;
}) {
  const t = useTranslations('motorcycleDetail.simulator');
  const [days, setDays] = useState(4);

  const perDay = dailyRate({ price, priceShort }, days);
  const bikeTotal = perDay * days;
  const accessoriesSubtotal = accessoryCount * ACCESSORY_PRICE_PER_DAY * days;
  const total = bikeTotal + accessoriesSubtotal;
  const deposit = Math.round(total * DEPOSIT_RATE);
  const balance = total - deposit;
  const daysToLongTerm = LONG_TERM_MIN_DAYS - days;

  const clamp = (d: number) => Math.min(MAX_DAYS, Math.max(MIN_DAYS, d));

  return (
    <div className="rental-sim">
      <div className="rental-sim-days">
        <div>
          <span className="rental-sim-label">{t('duration')}</span>
          <strong>{t('days', { count: days })}</strong>
        </div>
        <div className="rental-sim-stepper">
          <button
            type="button"
            onClick={() => setDays((d) => clamp(d - 1))}
            disabled={days <= MIN_DAYS}
            aria-label={t('decrease')}
          >
            −
          </button>
          <span aria-live="polite">{days}</span>
          <button
            type="button"
            onClick={() => setDays((d) => clamp(d + 1))}
            disabled={days >= MAX_DAYS}
            aria-label={t('increase')}
          >
            +
          </button>
        </div>
      </div>
      <input
        type="range"
        className="rental-sim-range"
        min={MIN_DAYS}
        max={MAX_DAYS}
        value={days}
        onChange={(e) => setDays(clamp(Number(e.target.value)))}
        aria-label={t('duration')}
      />
      <dl className="rental-sim-rows">
        <div>
          <dt>{t('perDay')}</dt>
          <dd>€{perDay}</dd>
        </div>
        {accessoryCount > 0 && (
          <div>
            <dt>{t('accessories', { count: accessoryCount, price: ACCESSORY_PRICE_PER_DAY })}</dt>
            <dd>€{accessoriesSubtotal}</dd>
          </div>
        )}
        <div className="total">
          <dt>{t('total')}</dt>
          <dd>€{total}</dd>
        </div>
        <div className="deposit">
          <dt>{t('deposit')}</dt>
          <dd>€{deposit}</dd>
        </div>
        <div>
          <dt>{t('balance')}</dt>
          <dd>€{balance}</dd>
        </div>
        <div className="security-deposit">
          <dt>{t('securityDeposit')}</dt>
          <dd>€{securityDeposit}</dd>
        </div>
      </dl>
      {daysToLongTerm > 0 && priceShort !== price && (
        <p className="rental-sim-tier">{t('tierHint', { days: daysToLongTerm, rate: price })}</p>
      )}
      <p className="rental-sim-note">{t('note')}</p>
    </div>
  );
}
