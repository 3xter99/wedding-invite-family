import { wedding } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Animate } from './Animate';

function ProgramItem({ item, index }) {
  const { ref, visible } = useScrollReveal(0.12);

  return (
    <li
      ref={ref}
      className={`program-item ${visible ? 'program-item--visible' : ''}`}
      style={{ '--i': index }}
    >
      <span className="program-item__dot" aria-hidden="true" />
      <time className="program-item__time">{item.time}</time>
      <div className="program-item__body">
        <p className="program-item__title">{item.title}</p>
        <p className="program-item__text">{item.text}</p>
      </div>
    </li>
  );
}

function DayBlock({ day, dayIndex }) {
  const { ref, visible } = useScrollReveal(0.08);

  return (
    <article
      ref={ref}
      className={`program-day ${visible ? 'program-day--visible' : ''}`}
      style={{ '--day': dayIndex }}
    >
      <Animate delay={dayIndex * 120}>
        <header className="program-day__header">
          <span className="program-day__line" aria-hidden="true" />
          <h3 className="program-day__title">{day.dayLabel}</h3>
          <span className="program-day__line" aria-hidden="true" />
        </header>
      </Animate>

      <ul className="program-day__list">
        {day.events.map((item, index) => (
          <ProgramItem key={`${day.dayLabel}-${item.time}`} item={item} index={index} />
        ))}
      </ul>
    </article>
  );
}

export default function Schedule() {
  return (
    <section className="schedule section">
      <Animate>
        <h2 className="schedule__heading">
          ПРОГРАММА
          <br />
          ТОРЖЕСТВА
        </h2>
      </Animate>

      <div className="program">
        {wedding.schedule.map((day, index) => (
          <DayBlock key={day.dayLabel} day={day} dayIndex={index} />
        ))}
      </div>
    </section>
  );
}
