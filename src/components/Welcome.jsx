import { wedding } from '../data/content';
import { Animate } from './Animate';
import { SectionDivider } from './Icons';

const WEEKDAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

function buildCalendar(year, month, weddingDays) {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

  return { cells, weddingDays };
}

export default function Welcome() {
  const { cells, weddingDays } = buildCalendar(
    wedding.calendar.year,
    7,
    wedding.calendar.weddingDays,
  );

  return (
    <section className="welcome section">
      <Animate delay={0}>
        <SectionDivider />
      </Animate>

      <Animate delay={120}>
        <h2 className="welcome__heading">{wedding.welcome.heading}</h2>
      </Animate>

      <Animate delay={240}>
        <p className="welcome__text">{wedding.welcome.text}</p>
      </Animate>

      <Animate delay={360}>
        <div className="calendar">
          <p className="calendar__title">
            {wedding.calendar.month} {wedding.calendar.year}
          </p>
          <div className="calendar__weekdays">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar__grid">
            {cells.map((day, index) => (
              <span
                key={day ?? `empty-${index}`}
                className={`calendar__day ${day && weddingDays.includes(day) ? 'calendar__day--wedding' : ''}`}
              >
                {day && weddingDays.includes(day) && (
                  <svg className="calendar__heart" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                )}
                {day ?? ''}
              </span>
            ))}
          </div>
        </div>
      </Animate>
    </section>
  );
}
