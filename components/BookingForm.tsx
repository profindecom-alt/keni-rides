'use client';

import { useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import { CONFIG } from '@/lib/config';
import type { Bike } from '@/lib/bikes';
import { ACCESSORY_SLUGS, ACCESSORY_PRICE_PER_DAY } from '@/lib/accessories';

function isoDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return isoDate(d);
}

type FieldErrors = Record<string, string>;

export default function BookingForm({
  bike,
  accessories,
  onAccessoriesChange,
}: {
  bike: Bike;
  accessories: string[];
  onAccessoriesChange: (next: string[]) => void;
}) {
  const t = useTranslations('bookingForm');
  const tAcc = useTranslations('accessories');
  const [pickupDate, setPickupDate] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [statusMessage, setStatusMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const minPickup = todayPlus(2);
  const minReturn = pickupDate ? isoDate(new Date(new Date(pickupDate).getTime() + 2 * 86400000)) : todayPlus(4);

  function toggleAccessory(slug: string) {
    onAccessoriesChange(
      accessories.includes(slug)
        ? accessories.filter((s) => s !== slug)
        : [...accessories, slug]
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage('');

    const form = e.currentTarget;
    const data = new FormData(form);
    const nextErrors: FieldErrors = {};

    const required = ['fullName', 'email', 'phone', 'country', 'riders', 'pickupLocation', 'returnLocation', 'pickupDate', 'returnDate'];
    required.forEach((name) => {
      const value = String(data.get(name) || '').trim();
      if (!value) nextErrors[name] = t('errors.required');
    });

    const email = String(data.get('email') || '');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = t('errors.email');
    }

    const pickup = String(data.get('pickupDate') || '');
    const ret = String(data.get('returnDate') || '');
    if (pickup && ret) {
      const days = Math.round((new Date(ret).getTime() - new Date(pickup).getTime()) / 86400000);
      if (days < 2) nextErrors.returnDate = t('errors.minRental');
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      type: 'booking',
      motorcycle: bike.name,
      motorcycleSlug: bike.slug,
      pricePerDayEUR: String(bike.price),
      fullName: String(data.get('fullName') || '').trim(),
      email: email.trim(),
      phone: String(data.get('phone') || '').trim(),
      country: String(data.get('country') || '').trim(),
      riders: String(data.get('riders') || '').trim(),
      pickupLocation: String(data.get('pickupLocation') || '').trim(),
      returnLocation: String(data.get('returnLocation') || '').trim(),
      pickupDate: pickup,
      returnDate: ret,
      accessories: accessories.map((slug) => tAcc(`items.${slug}`)),
      accessoryPricePerDayEUR: String(ACCESSORY_PRICE_PER_DAY),
      message: String(data.get('message') || '').trim(),
      page: typeof window !== 'undefined' ? window.location.href : '',
      submittedAt: new Date().toISOString(),
    };

    const url = CONFIG.webhooks.booking;
    if (!url || url.includes('YOUR-N8N-INSTANCE')) {
      setStatusMessage(t('errors.webhookMissing'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Webhook responded with ${res.status}`);
      setSubmitted(true);
    } catch {
      setStatusMessage(t('errors.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="form-success" role="status">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <h3>{t('successTitle')}</h3>
        <p>{t('successMessage')}</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className={`field full${errors.fullName ? ' invalid' : ''}`}>
          <label htmlFor="b-name">{t('fullName')} <span className="req" aria-hidden="true">*</span></label>
          <input id="b-name" name="fullName" type="text" autoComplete="name" placeholder={t('fullName')} />
          <p className="error-msg" role="alert">{errors.fullName}</p>
        </div>
        <div className={`field${errors.email ? ' invalid' : ''}`}>
          <label htmlFor="b-email">{t('email')} <span className="req" aria-hidden="true">*</span></label>
          <input id="b-email" name="email" type="email" autoComplete="email" placeholder="you@email.com" />
          <p className="error-msg" role="alert">{errors.email}</p>
        </div>
        <div className={`field${errors.phone ? ' invalid' : ''}`}>
          <label htmlFor="b-phone">{t('phone')} <span className="req" aria-hidden="true">*</span></label>
          <input id="b-phone" name="phone" type="tel" autoComplete="tel" placeholder="+33 6 12 34 56 78" />
          <p className="error-msg" role="alert">{errors.phone}</p>
        </div>
        <div className={`field${errors.country ? ' invalid' : ''}`}>
          <label htmlFor="b-country">{t('country')} <span className="req" aria-hidden="true">*</span></label>
          <input id="b-country" name="country" type="text" autoComplete="country-name" placeholder={t('country')} />
          <p className="error-msg" role="alert">{errors.country}</p>
        </div>
        <div className={`field${errors.riders ? ' invalid' : ''}`}>
          <label htmlFor="b-riders">{t('riders')} <span className="req" aria-hidden="true">*</span></label>
          <select id="b-riders" name="riders" defaultValue="">
            <option value="" disabled>{t('select')}</option>
            <option>1</option><option>2</option><option>3</option><option>4</option>
            <option>5</option><option>6+</option>
          </select>
          <p className="error-msg" role="alert">{errors.riders}</p>
        </div>
        <div className={`field${errors.pickupLocation ? ' invalid' : ''}`}>
          <label htmlFor="b-pickup-loc">{t('pickupLocation')} <span className="req" aria-hidden="true">*</span></label>
          <select id="b-pickup-loc" name="pickupLocation" defaultValue="">
            <option value="" disabled>{t('select')}</option>
            <option>{t('locations.marrakech')}</option>
            <option>{t('locations.casablanca')}</option>
            <option>{t('locations.tangier')}</option>
            <option>{t('locations.fez')}</option>
            <option>{t('locations.other')}</option>
          </select>
          <p className="error-msg" role="alert">{errors.pickupLocation}</p>
        </div>
        <div className={`field${errors.returnLocation ? ' invalid' : ''}`}>
          <label htmlFor="b-return-loc">{t('returnLocation')} <span className="req" aria-hidden="true">*</span></label>
          <select id="b-return-loc" name="returnLocation" defaultValue="">
            <option value="" disabled>{t('select')}</option>
            <option>{t('locations.marrakech')}</option>
            <option>{t('locations.casablanca')}</option>
            <option>{t('locations.tangier')}</option>
            <option>{t('locations.fez')}</option>
            <option>{t('locations.other')}</option>
          </select>
          <p className="error-msg" role="alert">{errors.returnLocation}</p>
        </div>
        <div className={`field${errors.pickupDate ? ' invalid' : ''}`}>
          <label htmlFor="b-pickup-date">{t('pickupDate')} <span className="req" aria-hidden="true">*</span></label>
          <input
            id="b-pickup-date"
            name="pickupDate"
            type="date"
            min={minPickup}
            onChange={(e) => setPickupDate(e.target.value)}
          />
          <p className="hint">{t('pickupHint')}</p>
          <p className="error-msg" role="alert">{errors.pickupDate}</p>
        </div>
        <div className={`field${errors.returnDate ? ' invalid' : ''}`}>
          <label htmlFor="b-return-date">{t('returnDate')} <span className="req" aria-hidden="true">*</span></label>
          <input id="b-return-date" name="returnDate" type="date" min={minReturn} />
          <p className="hint">{t('returnHint')}</p>
          <p className="error-msg" role="alert">{errors.returnDate}</p>
        </div>
        <div className="field full">
          <label htmlFor="b-message">{t('message')}</label>
          <textarea id="b-message" name="message" placeholder={t('messagePlaceholder')} />
        </div>
        <fieldset className="field full accessory-picker">
          <legend>
            {tAcc('title')} <span className="accessory-price">{tAcc('perDay')}</span>
          </legend>
          <div className="accessory-grid">
            {ACCESSORY_SLUGS.map((slug) => {
              const checked = accessories.includes(slug);
              return (
                <label key={slug} className={`accessory-option${checked ? ' checked' : ''}`}>
                  <input
                    type="checkbox"
                    name="accessories"
                    value={slug}
                    checked={checked}
                    onChange={() => toggleAccessory(slug)}
                  />
                  <span className="accessory-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                  <span className="accessory-label">{tAcc(`items.${slug}`)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>
      <div style={{ marginTop: '1.4rem' }}>
        <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner" aria-hidden="true" /> {t('sending')}
            </>
          ) : (
            <>
              {t('submit')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </>
          )}
        </button>
        <p style={{ marginTop: '0.8rem', fontSize: '0.82rem', color: 'var(--text-3)', textAlign: 'center' }}>
          {t('noOnlinePayment')}
        </p>
      </div>
      {statusMessage && <p className="form-status error" role="alert">{statusMessage}</p>}
    </form>
  );
}
