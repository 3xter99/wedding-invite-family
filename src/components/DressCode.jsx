import { wedding } from '../data/content';
import { Animate, AnimateGroup } from './Animate';

export default function DressCode() {
  return (
    <section className="dresscode section">
      <Animate>
        <h2 className="section-heading">ДРЕСС-КОД</h2>
      </Animate>

      <Animate delay={150}>
        <p className="dresscode__text">{wedding.dressCode.text}</p>
      </Animate>

      {wedding.dressCode.colors.length > 0 && (
        <AnimateGroup className="dresscode__swatches">
          {wedding.dressCode.colors.map((color, index) => (
            <span
              key={color}
              className="dresscode__swatch dresscode__swatch--animated"
              style={{ backgroundColor: color, '--i': index }}
            />
          ))}
        </AnimateGroup>
      )}
    </section>
  );
}
