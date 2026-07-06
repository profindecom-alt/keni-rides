'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import BookingForm from './BookingForm';
import RentalSimulator from './RentalSimulator';
import type { Bike } from '@/lib/bikes';

/** Sticky buy-box for a bike page. Owns the accessory selection so the booking
 * form (where the rider chooses add-ons) and the rental estimate (which prices
 * them at €15/day each) stay in sync, and the choice is sent with the request. */
export default function BookingPanel({ bike }: { bike: Bike }) {
  const t = useTranslations('motorcycleDetail');
  const [accessories, setAccessories] = useState<string[]>([]);

  return (
    <>
      <Reveal as="div" className="form-card" direction="right">
        <div className="form-card-head">
          <h2 style={{ textTransform: 'none', fontSize: '1.25rem' }}>{t('bookThe', { name: bike.short })}</h2>
          <p className="price"><small>{t('specs.from')}</small><strong>€{bike.price} <em>/ day</em></strong></p>
        </div>
        <BookingForm bike={bike} accessories={accessories} onAccessoriesChange={setAccessories} />
      </Reveal>

      <Reveal as="div" className="rental-sim-card" delay={0.05}>
        <p className="eyebrow">{t('simulator.eyebrow')}</p>
        <h3 style={{ textTransform: 'none', fontSize: 'clamp(1.15rem, 2vw, 1.4rem)', marginBottom: '1.1rem' }}>{t('simulator.title')}</h3>
        <RentalSimulator
          price={bike.price}
          priceShort={bike.priceShort}
          securityDeposit={bike.deposit}
          accessoryCount={accessories.length}
        />
      </Reveal>
    </>
  );
}
