/**
 * Seamless destination banner shown under the hero. The translated string is a
 * list of places separated by "◆"; we split it into words and render two
 * identical groups so the CSS translateX(-50%) loop is perfectly seamless.
 * The diamond separators are drawn in CSS (brand colour) rather than glyphs.
 */
export default function Marquee({ text }: { text: string }) {
  const words = text
    .split('◆')
    .map((w) => w.trim())
    .filter(Boolean);

  if (words.length === 0) return null;

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {words.map((word, i) => (
              <span className="marquee-item" key={i}>
                <span className="marquee-word">{word}</span>
                <i className="marquee-sep" aria-hidden="true" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
