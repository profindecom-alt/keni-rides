'use client';

import { useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import { CONFIG } from '@/lib/config';

type FieldErrors = Record<string, string>;

export default function ContactForm() {
  const t = useTranslations('contactForm');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [statusMessage, setStatusMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage('');

    const data = new FormData(e.currentTarget);
    const nextErrors: FieldErrors = {};

    const required = ['fullName', 'email', 'subject', 'message'];
    required.forEach((name) => {
      const value = String(data.get(name) || '').trim();
      if (!value) nextErrors[name] = t('errors.required');
    });

    const email = String(data.get('email') || '');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = t('errors.email');
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      type: 'contact',
      fullName: String(data.get('fullName') || '').trim(),
      email: email.trim(),
      phone: String(data.get('phone') || '').trim(),
      subject: String(data.get('subject') || '').trim(),
      message: String(data.get('message') || '').trim(),
      page: typeof window !== 'undefined' ? window.location.href : '',
      submittedAt: new Date().toISOString(),
    };

    const url = CONFIG.webhooks.contact;
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
        <div className={`field${errors.fullName ? ' invalid' : ''}`}>
          <label htmlFor="c-name">{t('fullName')} <span className="req" aria-hidden="true">*</span></label>
          <input id="c-name" name="fullName" type="text" autoComplete="name" placeholder={t('fullName')} />
          <p className="error-msg" role="alert">{errors.fullName}</p>
        </div>
        <div className={`field${errors.email ? ' invalid' : ''}`}>
          <label htmlFor="c-email">{t('email')} <span className="req" aria-hidden="true">*</span></label>
          <input id="c-email" name="email" type="email" autoComplete="email" placeholder="you@email.com" />
          <p className="error-msg" role="alert">{errors.email}</p>
        </div>
        <div className="field">
          <label htmlFor="c-phone">{t('phone')}</label>
          <input id="c-phone" name="phone" type="tel" autoComplete="tel" placeholder="+33 6 12 34 56 78" />
        </div>
        <div className={`field${errors.subject ? ' invalid' : ''}`}>
          <label htmlFor="c-subject">{t('subject')} <span className="req" aria-hidden="true">*</span></label>
          <select id="c-subject" name="subject" defaultValue="">
            <option value="" disabled>{t('subject')}</option>
            <option>{t('subjectOptions.booking')}</option>
            <option>{t('subjectOptions.quote')}</option>
            <option>{t('subjectOptions.delivery')}</option>
            <option>{t('subjectOptions.route')}</option>
            <option>{t('subjectOptions.partnership')}</option>
            <option>{t('subjectOptions.other')}</option>
          </select>
          <p className="error-msg" role="alert">{errors.subject}</p>
        </div>
        <div className={`field full${errors.message ? ' invalid' : ''}`}>
          <label htmlFor="c-message">{t('message')} <span className="req" aria-hidden="true">*</span></label>
          <textarea id="c-message" name="message" placeholder={t('messagePlaceholder')} />
          <p className="error-msg" role="alert">{errors.message}</p>
        </div>
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
            </>
          )}
        </button>
      </div>
      {statusMessage && <p className="form-status error" role="alert">{statusMessage}</p>}
    </form>
  );
}
