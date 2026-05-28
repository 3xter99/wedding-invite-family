import { useState } from 'react';
import { rsvpOptions } from '../data/content';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { Animate } from './Animate';
import { SectionDivider } from './Icons';

const initialForm = {
  fullName: '',
  attendance: rsvpOptions.attendance[0],
  drinks: [],
};

export default function RsvpForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDrinkChange = (drink) => {
    setForm((prev) => ({
      ...prev,
      drinks: prev.drinks.includes(drink)
        ? prev.drinks.filter((d) => d !== drink)
        : [...prev.drinks, drink],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      if (!isSupabaseConfigured) {
        throw new Error('База данных не настроена. Проверьте файл .env и перезапустите сервер.');
      }

      const { error } = await supabase.from('rsvp_responses').insert({
        full_name: form.fullName.trim(),
        attendance: form.attendance,
        drinks: form.drinks,
        source_site: import.meta.env.VITE_SITE_ID || 'unknown',
      });

      if (error) throw error;

      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Не удалось отправить. Попробуйте ещё раз.');
    }
  };

  return (
    <section className="rsvp section">
      <Animate>
        <SectionDivider heartPosition="left" />
      </Animate>

      <Animate delay={100}>
        <h2 className="section-heading">АНКЕТА</h2>
      </Animate>

      <Animate delay={200}>
        <form className="rsvp__form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Напишите, пожалуйста, Ваши ФИО</span>
            <input
              className="field__input"
              type="text"
              placeholder="Ваши ФИО"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </label>

          <fieldset className="field">
            <legend className="field__label">Сможете ли присутствовать на нашем торжестве?</legend>
            <div className="field__options">
              {rsvpOptions.attendance.map((option) => (
                <label key={option} className="option">
                  <input
                    type="radio"
                    name="attendance"
                    value={option}
                    checked={form.attendance === option}
                    onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field">
            <legend className="field__label">Что предпочитаете из напитков?</legend>
            <div className="field__options">
              {rsvpOptions.drinks.map((drink) => (
                <label key={drink} className="option">
                  <input
                    type="checkbox"
                    checked={form.drinks.includes(drink)}
                    onChange={() => handleDrinkChange(drink)}
                  />
                  <span>{drink}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button className="btn-submit" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Отправка…' : 'Отправить'}
          </button>

          {status === 'success' && <p className="rsvp__msg">Спасибо! Мы получили ваш ответ.</p>}
          {status === 'error' && (
            <p className="rsvp__msg rsvp__msg--error">{errorMessage || 'Не удалось отправить.'}</p>
          )}
        </form>
      </Animate>
    </section>
  );
}
