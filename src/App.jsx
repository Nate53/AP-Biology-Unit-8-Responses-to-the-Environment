import { useState, useEffect, useCallback, useRef } from 'react';
import { BookOpen, Trophy, ClipboardList, ChevronDown, ChevronUp, Check, X, Copy, RotateCcw, Sun, Droplets, ArrowDown, Hand, Play, Pause } from 'lucide-react';

// ─── Translations ────────────────────────────────────────────────────
const T = {
  appTitle: { en: 'Responses to the Environment', es: 'Respuestas al Medio Ambiente' },
  subtitle: { en: 'AP Biology — Unit 8: Ecology', es: 'Biología AP — Unidad 8: Ecología' },
  enterName: { en: 'Enter your name to begin', es: 'Ingresa tu nombre para comenzar' },
  namePlaceholder: { en: 'Your name...', es: 'Tu nombre...' },
  start: { en: 'Start Learning', es: 'Comenzar a Aprender' },
  learn: { en: 'Learn', es: 'Aprender' },
  challenge: { en: 'Challenge', es: 'Desafío' },
  compile: { en: 'Compile & Submit', es: 'Compilar y Enviar' },
  checkAnswer: { en: 'Check Answer', es: 'Verificar Respuesta' },
  correct: { en: 'Correct!', es: '¡Correcto!' },
  incorrect: { en: 'Incorrect.', es: 'Incorrecto.' },
  revealModel: { en: 'Reveal Model Answer', es: 'Mostrar Respuesta Modelo' },
  hideModel: { en: 'Hide Model Answer', es: 'Ocultar Respuesta Modelo' },
  compileBtn: { en: 'Compile Responses', es: 'Compilar Respuestas' },
  copyBtn: { en: 'Copy to Clipboard', es: 'Copiar al Portapapeles' },
  copied: { en: 'Copied!', es: '¡Copiado!' },
  reset: { en: 'Reset', es: 'Reiniciar' },
  textbookRef: { en: 'Textbook Reference', es: 'Referencia del Libro' },
  biozoneRef: { en: 'Biozone Activities 208–216', es: 'Actividades Biozone 208–216' },
  conceptCheck: { en: 'Concept Check', es: 'Verificación de Concepto' },
  points: { en: 'points', es: 'puntos' },
  yourResponse: { en: 'Your response...', es: 'Tu respuesta...' },
};

const t = (key, lang) => T[key]?.[lang] || T[key]?.en || key;

// ─── Rich Text (supports **bold**) ───────────────────────────────────
const RichText = ({ text, className = '' }) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
      )}
    </span>
  );
};

// ─── Concept Check MCQ ──────────────────────────────────────────────
const ConceptCheckMCQ = ({ question, options, correctIndex, explanation, lang }) => {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="concept-check-box">
      <p className="font-semibold text-amber-800 mb-3">{t('conceptCheck', lang)}</p>
      <p className="mb-3 text-gray-700">{question}</p>
      <div className="space-y-2 mb-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !revealed && setSelected(i)}
            className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all text-sm ${
              revealed
                ? i === correctIndex
                  ? 'bg-green-100 border-green-400 text-green-800 font-semibold'
                  : i === selected
                  ? 'bg-red-100 border-red-400 text-red-700'
                  : 'bg-white border-gray-200 text-gray-500'
                : i === selected
                ? 'bg-brand-100 border-brand-400 text-brand-800'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          disabled={selected === null}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold text-sm disabled:opacity-40 hover:bg-amber-600 transition-colors"
        >
          {t('checkAnswer', lang)}
        </button>
      )}
      {revealed && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${selected === correctIndex ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="font-semibold">{selected === correctIndex ? t('correct', lang) : t('incorrect', lang)}</p>
          <p className="mt-1">{explanation}</p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SECTION 1: INTRO — How Organisms Detect & Respond
// ═══════════════════════════════════════════════════════════════════════
const IntroSection = ({ lang }) => {
  const [activeCard, setActiveCard] = useState(null);

  const behaviorTypes = [
    {
      title: lang === 'es' ? 'Comportamientos de Orientación' : 'Orientation Behaviors',
      icon: '🧭',
      desc: lang === 'es'
        ? 'Posicionamiento en respuesta a un estímulo ambiental. Incluye kinesis (no direccional) y taxis (direccional).'
        : 'Positioning in response to an environmental stimulus. Includes kinesis (non-directional) and taxes (directional).',
      examples: lang === 'es'
        ? ['Kinesis: cochinillas aumentan velocidad en ambientes secos', 'Taxis: polillas vuelan hacia feromonas (+quimiotaxis)', 'Taxis: larvas se alejan de la luz (-fototaxis)']
        : ['Kinesis: woodlice increase speed in dry environments', 'Taxes: moths fly toward pheromones (+chemotaxis)', 'Taxes: maggots move away from light (-phototaxis)'],
      color: 'blue',
    },
    {
      title: lang === 'es' ? 'Comportamientos de Temporización' : 'Timing Behaviors',
      icon: '⏰',
      desc: lang === 'es'
        ? 'Respuestas predecibles a ritmos ambientales. Involucran un reloj biológico e incluyen ritmos diarios, lunares y anuales.'
        : 'Predictable responses to environmental rhythms. Involve a biological clock and include daily, lunar, and annual rhythms.',
      examples: lang === 'es'
        ? ['Los tulipanes muestran movimientos de sueño diarios', 'Fotoperiodismo: las plantas florecen según la duración de la noche', 'Ritmos circadianos: ciclos de sueño-vigilia de 24h']
        : ['Tulips show daily sleep movements', 'Photoperiodism: plants flower based on night length', 'Circadian rhythms: 24h sleep-wake cycles'],
      color: 'purple',
    },
    {
      title: lang === 'es' ? 'Comportamientos Innatos' : 'Innate Behaviors',
      icon: '🧬',
      desc: lang === 'es'
        ? 'Comportamientos programados genéticamente que no requieren aprendizaje. Son importantes para la supervivencia y se transmiten a la descendencia.'
        : 'Genetically programmed behaviors that do not require learning. They are important for survival and are passed to offspring.',
      examples: lang === 'es'
        ? ['Un gorrión recién nacido busca sombra instintivamente', 'La polilla busca refugio en grietas (tigmotaxis)', 'Las respuestas trópicas de las plantas son innatas']
        : ['A newly hatched maggot instinctively seeks shade', 'Spiny lobster seeks crevice shelter (thigmotaxis)', 'Plant tropism responses are innate'],
      color: 'green',
    },
    {
      title: lang === 'es' ? 'Comportamientos Adaptativos' : 'Adaptive Behaviors',
      icon: '🎯',
      desc: lang === 'es'
        ? 'Comportamientos que aumentan la aptitud del organismo. No son adaptativos si no persisten bajo selección natural.'
        : 'Behaviors that increase an organism\'s fitness. A behavior is adaptive because it increases fitness; non-adaptive behaviors would be selected against.',
      examples: lang === 'es'
        ? ['Los mosquitos usan gradientes de temperatura para encontrar hospedadores', 'Los nematodos detectan químicamente las fuentes de alimento', 'Los movimientos de sueño de las flores previenen el daño']
        : ['Mosquitoes use temperature gradients to locate hosts', 'Nematodes chemically detect food sources', 'Flower sleep movements prevent petal damage'],
      color: 'amber',
    },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-300', title: 'text-blue-800', dot: 'bg-blue-400' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-300', title: 'text-purple-800', dot: 'bg-purple-400' },
    green: { bg: 'bg-green-50', border: 'border-green-300', title: 'text-green-800', dot: 'bg-green-400' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-300', title: 'text-amber-800', dot: 'bg-amber-400' },
  };

  return (
    <div className="learn-chunk">
      <h2 className="text-xl font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">🔬</span>
        {lang === 'es' ? 'Cómo los Organismos Detectan y Responden' : 'How Organisms Detect & Respond'}
      </h2>
      <p className="text-gray-600 mb-4">
        <RichText text={lang === 'es'
          ? 'Todos los organismos deben **detectar y responder** a los cambios ambientales para sobrevivir. Una **respuesta** es la reacción de un organismo a un estímulo particular. Los comportamientos pueden ser **innatos** (genéticamente programados) o **aprendidos** (modificados por la experiencia). Los comportamientos adaptativos aumentan la **aptitud** — la capacidad de sobrevivir y reproducirse.'
          : 'All organisms must **detect and respond** to environmental changes to survive. A **behavior** is the response of an organism to a particular stimulus. Behaviors can be **innate** (genetically programmed) or **learned** (modified by experience). Adaptive behaviors increase **fitness** — the ability to survive and reproduce.'
        } />
      </p>

      {/* Signal Transduction Mini-Diagram */}
      <div className="interactive-box mb-5">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? 'Transducción de Señales — Visión General' : 'Signal Transduction — Overview'}
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
          {[
            { label: lang === 'es' ? 'Estímulo' : 'Stimulus', icon: '⚡', sub: lang === 'es' ? 'Señal ambiental' : 'Environmental signal' },
            { label: '→', icon: '', sub: '' },
            { label: lang === 'es' ? 'Receptor' : 'Receptor', icon: '📡', sub: lang === 'es' ? 'Detecta la señal' : 'Detects signal' },
            { label: '→', icon: '', sub: '' },
            { label: lang === 'es' ? 'Transducción' : 'Transduction', icon: '⚙️', sub: lang === 'es' ? 'Convierte la señal' : 'Converts signal' },
            { label: '→', icon: '', sub: '' },
            { label: lang === 'es' ? 'Respuesta' : 'Response', icon: '🎬', sub: lang === 'es' ? 'Cambio de comportamiento/crecimiento' : 'Behavior/growth change' },
          ].map((step, i) =>
            step.icon ? (
              <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-brand-100 flex-1 min-w-0">
                <div className="text-2xl mb-1">{step.icon}</div>
                <div className="font-semibold text-brand-700 text-sm">{step.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{step.sub}</div>
              </div>
            ) : (
              <div key={i} className="text-brand-400 font-bold text-xl hidden sm:block">→</div>
            )
          )}
        </div>
      </div>

      {/* Behavior Type Cards */}
      <h3 className="font-semibold text-gray-700 mb-3">
        {lang === 'es' ? 'Tipos de Comportamiento' : 'Types of Behavior'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {behaviorTypes.map((bt, i) => {
          const c = colorMap[bt.color];
          const isOpen = activeCard === i;
          return (
            <button
              key={i}
              onClick={() => setActiveCard(isOpen ? null : i)}
              className={`text-left ${c.bg} border ${c.border} rounded-xl p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{bt.icon}</span>
                  <span className={`font-semibold ${c.title}`}>{bt.title}</span>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <p className="text-sm text-gray-600">{bt.desc}</p>
              {isOpen && (
                <ul className="mt-3 space-y-1.5">
                  {bt.examples.map((ex, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`${c.dot} w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0`}></span>
                      {ex}
                    </li>
                  ))}
                </ul>
              )}
            </button>
          );
        })}
      </div>

      <ConceptCheckMCQ
        lang={lang}
        question={lang === 'es'
          ? 'Un cangrejo se mueve hacia el agua cuando se deshidrata, siguiendo un gradiente de humedad. Este comportamiento es un ejemplo de:'
          : 'A crab moves toward water when it is dehydrating, following a moisture gradient. This behavior is an example of:'}
        options={
          lang === 'es'
            ? ['Kinesis — movimiento aleatorio', 'Taxis positiva — movimiento direccional hacia un estímulo', 'Comportamiento aprendido', 'Fotoperiodismo']
            : ['Kinesis — random movement', 'Positive taxis — directional movement toward a stimulus', 'Learned behavior', 'Photoperiodism']
        }
        correctIndex={1}
        explanation={lang === 'es'
          ? 'Moverse direccionalmente hacia un estímulo (humedad) es una taxis positiva — específicamente, una higrotaxis positiva.'
          : 'Moving directionally toward a stimulus (moisture) is a positive taxis — specifically, positive hygrotaxis.'}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SECTION 2: PLANT TROPISMS SIMULATOR
// ═══════════════════════════════════════════════════════════════════════
const TropismSimulator = ({ lang }) => {
  const [tropism, setTropism] = useState('photo');
  const [lightAngle, setLightAngle] = useState(0); // 0=left, 1=above, 2=right
  const [showAuxin, setShowAuxin] = useState(true);
  const canvasRef = useRef(null);

  const tropisms = {
    photo: {
      name: lang === 'es' ? 'Fototropismo' : 'Phototropism',
      icon: <Sun size={18} />,
      stimulus: lang === 'es' ? 'Luz' : 'Light',
      hormone: lang === 'es' ? 'Auxina' : 'Auxin',
      desc: lang === 'es'
        ? 'Los brotes crecen **hacia** la luz (fototropismo positivo). La auxina migra al lado sombreado, causando elongación desigual que curva el tallo hacia la luz. Las raíces muestran fototropismo negativo.'
        : 'Shoots grow **toward** light (positive phototropism). Auxin migrates to the shaded side, causing unequal elongation that bends the stem toward light. Roots show negative phototropism.',
    },
    gravi: {
      name: lang === 'es' ? 'Gravitropismo' : 'Gravitropism',
      icon: <ArrowDown size={18} />,
      stimulus: lang === 'es' ? 'Gravedad' : 'Gravity',
      hormone: lang === 'es' ? 'Auxina' : 'Auxin',
      desc: lang === 'es'
        ? 'Las raíces crecen **hacia** la gravedad (gravitropismo positivo). Los brotes crecen **alejándose** de la gravedad (gravitropismo negativo). Los estatolitos (granos de almidón) se asientan en respuesta a la gravedad, redistribuyendo la auxina.'
        : 'Roots grow **toward** gravity (positive gravitropism). Shoots grow **away** from gravity (negative gravitropism). Statoliths (starch grains) settle in response to gravity, redistributing auxin.',
    },
    thigmo: {
      name: lang === 'es' ? 'Tigmotropismo' : 'Thigmotropism',
      icon: <Hand size={18} />,
      stimulus: lang === 'es' ? 'Contacto' : 'Touch',
      hormone: lang === 'es' ? 'Auxina / Etileno' : 'Auxin / Ethylene',
      desc: lang === 'es'
        ? 'Las plantas responden al contacto y la presión. Los zarcillos se enrollan alrededor de soportes (tigmotropismo positivo). Las enredaderas trepan usando ganchos y zarcillos. La Venus atrapamoscas es un ejemplo de tigmonastia (no direccional).'
        : 'Plants respond to touch and pressure. Tendrils coil around supports (positive thigmotropism). Climbing vines use hooks and tendrils. The Venus flytrap is an example of thigmonasty (non-directional).',
    },
    chemo: {
      name: lang === 'es' ? 'Quimiotropismo' : 'Chemotropism',
      icon: <Droplets size={18} />,
      stimulus: lang === 'es' ? 'Químicos' : 'Chemicals',
      hormone: lang === 'es' ? 'Señales químicas' : 'Chemical signals',
      desc: lang === 'es'
        ? 'Crecimiento en respuesta a un gradiente químico. El tubo polínico crece hacia el óvulo guiado por señales químicas (quimiotropismo positivo). Las raíces crecen hacia los nutrientes del suelo.'
        : 'Growth in response to a chemical gradient. The pollen tube grows toward the ovule guided by chemical signals (positive chemotropism). Roots grow toward soil nutrients.',
    },
  };

  const current = tropisms[tropism];

  // Draw tropism visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Ground
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
    ctx.fillStyle = '#6d5410';
    ctx.fillRect(0, h * 0.7, w, 3);

    if (tropism === 'photo') {
      // Light source
      const lightX = lightAngle === 0 ? 40 : lightAngle === 2 ? w - 40 : w / 2;
      const lightY = lightAngle === 1 ? 30 : 80;
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(lightX, lightY, 20, 0, Math.PI * 2);
      ctx.fill();
      // Rays
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 1.5;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(lightX + Math.cos(a) * 24, lightY + Math.sin(a) * 24);
        ctx.lineTo(lightX + Math.cos(a) * 34, lightY + Math.sin(a) * 34);
        ctx.stroke();
      }

      // Plant stem bending toward light
      const baseX = w / 2;
      const baseY = h * 0.7;
      const bendFactor = lightAngle === 0 ? -40 : lightAngle === 2 ? 40 : 0;
      const midX = baseX + bendFactor * 0.3;
      const midY = baseY - 60;
      const tipX = baseX + bendFactor;
      const tipY = baseY - 120;

      // Stem
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(midX, midY, tipX, tipY);
      ctx.stroke();

      // Leaves
      const drawLeaf = (x, y, angle, size) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = '#16A34A';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 2.5, size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      const leafPos1X = baseX + bendFactor * 0.15;
      const leafPos1Y = baseY - 30;
      drawLeaf(leafPos1X - 10, leafPos1Y, -0.5, 5);
      drawLeaf(leafPos1X + 10, leafPos1Y, 0.5, 5);
      const leafPos2X = baseX + bendFactor * 0.6;
      const leafPos2Y = baseY - 80;
      drawLeaf(leafPos2X - 8, leafPos2Y, -0.4, 4);
      drawLeaf(leafPos2X + 8, leafPos2Y, 0.4, 4);

      // Auxin distribution
      if (showAuxin) {
        const shadedSide = lightAngle === 0 ? 'right' : lightAngle === 2 ? 'left' : 'both';
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#7C3AED';
        if (shadedSide === 'right') {
          for (let i = 0; i < 8; i++) {
            const t2 = i / 8;
            const px = baseX + bendFactor * t2 + 12;
            const py = baseY - t2 * 120;
            ctx.fillText('●', px, py);
          }
          ctx.fillStyle = '#C4B5FD';
          for (let i = 0; i < 3; i++) {
            const t2 = i / 3;
            const px = baseX + bendFactor * t2 - 16;
            const py = baseY - t2 * 120;
            ctx.fillText('●', px, py);
          }
        } else if (shadedSide === 'left') {
          for (let i = 0; i < 8; i++) {
            const t2 = i / 8;
            const px = baseX + bendFactor * t2 - 16;
            const py = baseY - t2 * 120;
            ctx.fillText('●', px, py);
          }
          ctx.fillStyle = '#C4B5FD';
          for (let i = 0; i < 3; i++) {
            const t2 = i / 3;
            const px = baseX + bendFactor * t2 + 12;
            const py = baseY - t2 * 120;
            ctx.fillText('●', px, py);
          }
        } else {
          for (let i = 0; i < 5; i++) {
            const t2 = i / 5;
            ctx.fillText('●', baseX - 14, baseY - t2 * 120);
            ctx.fillText('●', baseX + 10, baseY - t2 * 120);
          }
        }
        // Legend
        ctx.fillStyle = '#7C3AED';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('● = ' + (lang === 'es' ? 'Alta auxina' : 'High auxin'), 10, h * 0.7 + 20);
        ctx.fillStyle = '#C4B5FD';
        ctx.fillText('● = ' + (lang === 'es' ? 'Baja auxina' : 'Low auxin'), 10, h * 0.7 + 35);
      }

      // Root (negative phototropism)
      ctx.strokeStyle = '#A78B5E';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(baseX - bendFactor * 0.2, baseY + 30, baseX - bendFactor * 0.3, baseY + 50);
      ctx.stroke();
    } else if (tropism === 'gravi') {
      const baseX = w / 2;
      const baseY = h * 0.7;

      // Seedling on its side -> showing gravitropic response
      // Stem curves upward (negative gravitropism)
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(baseX, baseY - 50, baseX, baseY - 110);
      ctx.stroke();

      // Leaves
      ctx.fillStyle = '#16A34A';
      ctx.beginPath();
      ctx.ellipse(baseX - 12, baseY - 60, 12, 5, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(baseX + 12, baseY - 60, 12, 5, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Roots going down (positive gravitropism)
      ctx.strokeStyle = '#A78B5E';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(baseX - 15, baseY + 25, baseX - 25, baseY + 55);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(baseX + 15, baseY + 25, baseX + 25, baseY + 55);
      ctx.stroke();

      // Gravity arrow
      ctx.fillStyle = '#EF4444';
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w - 50, 30);
      ctx.lineTo(w - 50, 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w - 58, 72);
      ctx.lineTo(w - 50, 85);
      ctx.lineTo(w - 42, 72);
      ctx.fill();
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(lang === 'es' ? 'Gravedad' : 'Gravity', w - 80, 25);

      // Auxin labels
      if (showAuxin) {
        ctx.fillStyle = '#7C3AED';
        ctx.font = '10px sans-serif';
        // More auxin on lower side of stem
        for (let i = 0; i < 5; i++) {
          ctx.fillText('●', baseX + 10, baseY - i * 20);
        }
        ctx.fillStyle = '#C4B5FD';
        for (let i = 0; i < 2; i++) {
          ctx.fillText('●', baseX - 16, baseY - i * 20 - 60);
        }
        ctx.fillStyle = '#7C3AED';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('● = ' + (lang === 'es' ? 'Alta auxina' : 'High auxin'), 10, h * 0.7 + 20);
        ctx.fillStyle = '#C4B5FD';
        ctx.fillText('● = ' + (lang === 'es' ? 'Baja auxina' : 'Low auxin'), 10, h * 0.7 + 35);

        // Statoliths
        ctx.fillStyle = '#F59E0B';
        ctx.font = '9px sans-serif';
        ctx.fillText('◆ ◆ ◆', baseX - 8, baseY + 48);
        ctx.fillStyle = '#92400E';
        ctx.font = '10px sans-serif';
        ctx.fillText(lang === 'es' ? '◆ Estatolitos' : '◆ Statoliths', 10, h * 0.7 + 50);
      }
    } else if (tropism === 'thigmo') {
      const baseX = w / 2 - 30;
      const baseY = h * 0.7;

      // Support pole
      ctx.strokeStyle = '#9CA3AF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w / 2 + 20, baseY);
      ctx.lineTo(w / 2 + 20, baseY - 140);
      ctx.stroke();

      // Vine wrapping around pole
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.bezierCurveTo(baseX, baseY - 30, w / 2 + 40, baseY - 40, w / 2 + 20, baseY - 55);
      ctx.bezierCurveTo(w / 2, baseY - 70, baseX - 5, baseY - 75, baseX + 5, baseY - 90);
      ctx.bezierCurveTo(baseX + 15, baseY - 105, w / 2 + 35, baseY - 110, w / 2 + 20, baseY - 125);
      ctx.stroke();

      // Tendrils
      ctx.strokeStyle = '#4ADE80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w / 2 + 20, baseY - 55);
      ctx.quadraticCurveTo(w / 2 + 40, baseY - 50, w / 2 + 35, baseY - 60);
      ctx.stroke();

      // Touch indicator
      ctx.fillStyle = '#F59E0B';
      ctx.font = '16px sans-serif';
      ctx.fillText('👆', w / 2 + 25, baseY - 50);

      ctx.fillStyle = '#374151';
      ctx.font = '11px sans-serif';
      ctx.fillText(lang === 'es' ? 'Zarcillo enrollándose' : 'Tendril coiling', 10, 25);
      ctx.fillText(lang === 'es' ? 'alrededor del soporte' : 'around support', 10, 40);
    } else if (tropism === 'chemo') {
      const baseX = w / 2 - 40;
      const baseY = h * 0.5;

      // Pollen grain
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(baseX, baseY, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#92400E';
      ctx.font = '9px sans-serif';
      ctx.fillText(lang === 'es' ? 'Grano de' : 'Pollen', baseX - 18, baseY - 20);
      ctx.fillText(lang === 'es' ? 'polen' : 'grain', baseX - 12, baseY - 10);

      // Pollen tube growing toward ovule
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(baseX + 15, baseY);
      ctx.bezierCurveTo(baseX + 40, baseY + 5, baseX + 80, baseY + 10, baseX + 110, baseY + 15);
      ctx.stroke();

      // Ovule
      ctx.fillStyle = '#F9A8D4';
      ctx.beginPath();
      ctx.ellipse(baseX + 130, baseY + 18, 18, 14, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#DB2777';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#9D174D';
      ctx.font = '9px sans-serif';
      ctx.fillText(lang === 'es' ? 'Óvulo' : 'Ovule', baseX + 118, baseY + 45);

      // Chemical gradient dots
      ctx.fillStyle = '#EC4899';
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 6; i++) {
        const gx = baseX + 60 + i * 12 + Math.random() * 8;
        const gy = baseY + 5 + Math.random() * 20;
        ctx.beginPath();
        ctx.arc(gx, gy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#374151';
      ctx.font = '11px sans-serif';
      ctx.fillText(lang === 'es' ? 'Gradiente químico' : 'Chemical gradient', baseX + 40, baseY - 20);
    }
  }, [tropism, lightAngle, showAuxin, lang]);

  return (
    <div className="learn-chunk">
      <h2 className="text-xl font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">🌱</span>
        {lang === 'es' ? 'Simulador de Tropismos Vegetales' : 'Plant Tropisms Simulator'}
      </h2>
      <p className="text-gray-600 mb-4">
        <RichText text={lang === 'es'
          ? 'Los **tropismos** son respuestas de crecimiento direccional de las plantas hacia o alejándose de un estímulo. Están controlados principalmente por la redistribución de **auxina**.'
          : '**Tropisms** are directional growth responses of plants toward or away from a stimulus. They are primarily controlled by the redistribution of **auxin**.'
        } />
      </p>

      <div className="interactive-box">
        {/* Tropism selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(tropisms).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setTropism(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                tropism === key
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-brand-50'
              }`}
            >
              {val.icon} {val.name}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-3 mb-4 border border-brand-100">
          <p className="text-sm text-gray-700">
            <RichText text={current.desc} />
          </p>
          <p className="text-xs text-gray-500 mt-2">
            <strong>{lang === 'es' ? 'Estímulo' : 'Stimulus'}:</strong> {current.stimulus} &nbsp;|&nbsp;
            <strong>{lang === 'es' ? 'Hormona' : 'Hormone'}:</strong> {current.hormone}
          </p>
        </div>

        {/* Canvas */}
        <div className="bg-gradient-to-b from-sky-100 to-sky-50 rounded-xl p-3 mb-3 flex justify-center">
          <canvas ref={canvasRef} width={300} height={250} className="rounded-lg" />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          {tropism === 'photo' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{lang === 'es' ? 'Dirección de la luz:' : 'Light direction:'}</span>
              {[
                { val: 0, label: '← ' + (lang === 'es' ? 'Izquierda' : 'Left') },
                { val: 1, label: '↑ ' + (lang === 'es' ? 'Arriba' : 'Above') },
                { val: 2, label: (lang === 'es' ? 'Derecha' : 'Right') + ' →' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setLightAngle(opt.val)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    lightAngle === opt.val
                      ? 'bg-yellow-400 text-yellow-900 shadow'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-yellow-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={showAuxin}
              onChange={e => setShowAuxin(e.target.checked)}
              className="accent-purple-600"
            />
            {lang === 'es' ? 'Mostrar auxina' : 'Show auxin distribution'}
          </label>
        </div>
      </div>

      {/* Positive vs Negative table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-brand-100">
              <th className="px-3 py-2 text-left text-brand-800">{lang === 'es' ? 'Tropismo' : 'Tropism'}</th>
              <th className="px-3 py-2 text-left text-brand-800">{lang === 'es' ? 'Brote (+/-)' : 'Shoot (+/-)'}</th>
              <th className="px-3 py-2 text-left text-brand-800">{lang === 'es' ? 'Raíz (+/-)' : 'Root (+/-)'}</th>
            </tr>
          </thead>
          <tbody>
            {[
              [lang === 'es' ? 'Fototropismo' : 'Phototropism', lang === 'es' ? '+ (hacia la luz)' : '+ (toward light)', lang === 'es' ? '- (lejos de la luz)' : '- (away from light)'],
              [lang === 'es' ? 'Gravitropismo' : 'Gravitropism', lang === 'es' ? '- (lejos de gravedad)' : '- (away from gravity)', lang === 'es' ? '+ (hacia gravedad)' : '+ (toward gravity)'],
              [lang === 'es' ? 'Tigmotropismo' : 'Thigmotropism', lang === 'es' ? '+ (zarcillos enrollan)' : '+ (tendrils coil)', '—'],
              [lang === 'es' ? 'Quimiotropismo' : 'Chemotropism', '—', lang === 'es' ? '+ (hacia nutrientes)' : '+ (toward nutrients)'],
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 border-t border-gray-100">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConceptCheckMCQ
        lang={lang}
        question={lang === 'es'
          ? 'Se coloca una plántula de lado en la oscuridad. La raíz crece hacia abajo y el brote crece hacia arriba. ¿Qué hormona es responsable y cuál es la respuesta?'
          : 'A seedling is placed on its side in the dark. The root grows downward and the shoot grows upward. Which hormone is responsible and what is the response?'}
        options={
          lang === 'es'
            ? ['Giberelina — fototropismo', 'Auxina — gravitropismo', 'Etileno — tigmotropismo', 'Citoquinina — quimiotropismo']
            : ['Gibberellin — phototropism', 'Auxin — gravitropism', 'Ethylene — thigmotropism', 'Cytokinin — chemotropism']
        }
        correctIndex={1}
        explanation={lang === 'es'
          ? 'La auxina se redistribuye por gravedad (los estatolitos se asientan). En las raíces, la alta concentración de auxina inhibe la elongación (las raíces crecen hacia abajo). En los brotes, la alta auxina promueve la elongación (los brotes crecen hacia arriba).'
          : 'Auxin redistributes by gravity (statoliths settle). In roots, high auxin concentration inhibits elongation (roots grow down). In shoots, high auxin promotes elongation (shoots grow up).'}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SECTION 3: PLANT HORMONES EXPLORER
// ═══════════════════════════════════════════════════════════════════════
const PlantHormonesExplorer = ({ lang }) => {
  const [activeHormone, setActiveHormone] = useState(0);

  const hormones = [
    {
      name: lang === 'es' ? 'Auxina (IAA)' : 'Auxin (IAA)',
      icon: '🌿',
      color: 'green',
      produced: lang === 'es' ? 'Ápice del brote, hojas jóvenes' : 'Shoot tip, young leaves',
      transport: lang === 'es' ? 'Transporte polar (basípeto en el tallo)' : 'Polar transport (basipetal in stem)',
      effects: lang === 'es'
        ? ['Promueve elongación celular en brotes', 'Dominancia apical — suprime brotes laterales', 'Fototropismo y gravitropismo', 'Altas concentraciones inhiben crecimiento de raíces', 'Estimula desarrollo de frutos']
        : ['Promotes cell elongation in shoots', 'Apical dominance — suppresses lateral buds', 'Phototropism and gravitropism', 'High concentrations inhibit root growth', 'Stimulates fruit development'],
      keyFact: lang === 'es'
        ? 'Cuando el ápice se elimina, las yemas laterales crecen — los jardineros "podan" para plantas más frondosas.'
        : 'When the apex is removed, lateral buds grow — gardeners "pinch" for bushier plants.',
    },
    {
      name: lang === 'es' ? 'Giberelinas (GA)' : 'Gibberellins (GA)',
      icon: '📏',
      color: 'blue',
      produced: lang === 'es' ? 'Raíces, hojas jóvenes, semillas' : 'Roots, young leaves, seeds',
      transport: lang === 'es' ? 'Xilema y floema' : 'Xylem and phloem',
      effects: lang === 'es'
        ? ['Elongación del tallo (entre nudos)', 'Germinación de semillas — activan amilasa', 'Rompen la dormancia', 'Promueven la floración en plantas de día largo', 'Desarrollo de frutos sin polinización']
        : ['Stem elongation (internodes)', 'Seed germination — activate amylase', 'Break dormancy', 'Promote flowering in long-day plants', 'Fruit development without pollination'],
      keyFact: lang === 'es'
        ? 'Las plantas enanas carecen de giberelina funcional — agregar GA restaura la altura normal.'
        : 'Dwarf plants lack functional gibberellin — adding GA restores normal height.',
    },
    {
      name: lang === 'es' ? 'Citoquininas (CK)' : 'Cytokinins (CK)',
      icon: '🔄',
      color: 'purple',
      produced: lang === 'es' ? 'Puntas de raíces, semillas en desarrollo' : 'Root tips, developing seeds',
      transport: lang === 'es' ? 'Xilema (desde las raíces hacia arriba)' : 'Xylem (from roots upward)',
      effects: lang === 'es'
        ? ['Promueven división celular (citocinesis)', 'Retrasan la senescencia (envejecimiento)', 'Promueven crecimiento de yemas laterales', 'Trabajan opuestas a la auxina en dominancia apical', 'Estimulan diferenciación de cloroplastos']
        : ['Promote cell division (cytokinesis)', 'Delay senescence (aging)', 'Promote lateral bud growth', 'Work opposite to auxin in apical dominance', 'Stimulate chloroplast differentiation'],
      keyFact: lang === 'es'
        ? 'La proporción auxina:citoquinina determina el destino celular — alta auxina = raíces, alta citoquinina = brotes.'
        : 'Auxin:cytokinin ratio determines cell fate — high auxin = roots, high cytokinin = shoots.',
    },
    {
      name: lang === 'es' ? 'Ácido Abscísico (ABA)' : 'Abscisic Acid (ABA)',
      icon: '⛔',
      color: 'red',
      produced: lang === 'es' ? 'Hojas maduras, caliptra' : 'Mature leaves, root cap',
      transport: lang === 'es' ? 'Xilema y floema' : 'Xylem and phloem',
      effects: lang === 'es'
        ? ['Promueve dormancia de semillas', 'Cierre estomático durante estrés hídrico', 'Inhibe crecimiento durante condiciones desfavorables', 'Promueve abscisión de hojas', 'Dormancia de yemas en otoño']
        : ['Promotes seed dormancy', 'Stomatal closure during water stress', 'Inhibits growth during unfavorable conditions', 'Promotes leaf abscission', 'Bud dormancy in autumn'],
      keyFact: lang === 'es'
        ? 'ABA es la "hormona del estrés" — cierra los estomas cuando las plantas están deshidratadas para conservar agua.'
        : 'ABA is the "stress hormone" — closes stomata when plants are dehydrated to conserve water.',
    },
    {
      name: lang === 'es' ? 'Etileno (C₂H₄)' : 'Ethylene (C₂H₄)',
      icon: '🍎',
      color: 'amber',
      produced: lang === 'es' ? 'Frutos maduros, tejidos envejecidos, nudos' : 'Ripening fruits, aging tissues, nodes',
      transport: lang === 'es' ? 'Gas — se difunde a través de los tejidos' : 'Gas — diffuses through tissues',
      effects: lang === 'es'
        ? ['Maduración de frutos (reacción en cadena)', 'Promueve caída de hojas (abscisión)', 'Promueve senescencia (envejecimiento)', 'Respuesta al estrés y daño', '"Triple respuesta" en plántulas']
        : ['Fruit ripening (chain reaction)', 'Promotes leaf drop (abscission)', 'Promotes senescence (aging)', 'Stress and damage response', '"Triple response" in seedlings'],
      keyFact: lang === 'es'
        ? '"Una manzana podrida pudre al barril" — el etileno de un fruto maduro desencadena la maduración en los vecinos.'
        : '"One bad apple spoils the barrel" — ethylene from one ripe fruit triggers ripening in neighbors.',
    },
  ];

  const colorStyles = {
    green: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', activeBg: 'bg-green-600', dot: 'bg-green-400' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', activeBg: 'bg-blue-600', dot: 'bg-blue-400' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700', activeBg: 'bg-purple-600', dot: 'bg-purple-400' },
    red: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', activeBg: 'bg-red-600', dot: 'bg-red-400' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', activeBg: 'bg-amber-600', dot: 'bg-amber-400' },
  };

  const h = hormones[activeHormone];
  const cs = colorStyles[h.color];

  // Apical dominance demo
  const [apexRemoved, setApexRemoved] = useState(false);

  return (
    <div className="learn-chunk">
      <h2 className="text-xl font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">🧪</span>
        {lang === 'es' ? 'Explorador de Hormonas Vegetales' : 'Plant Hormones Explorer'}
      </h2>
      <p className="text-gray-600 mb-4">
        <RichText text={lang === 'es'
          ? 'Las hormonas vegetales (fitohormonas) son **señales químicas** que coordinan el crecimiento, desarrollo y respuestas al ambiente. Conoce las "Cinco Grandes".'
          : 'Plant hormones (phytohormones) are **chemical signals** that coordinate growth, development, and environmental responses. Meet the "Big Five".'
        } />
      </p>

      <div className="interactive-box">
        {/* Hormone selector buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hormones.map((horm, i) => (
            <button
              key={i}
              onClick={() => setActiveHormone(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeHormone === i
                  ? `${colorStyles[horm.color].activeBg} text-white shadow-md`
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {horm.icon} {horm.name}
            </button>
          ))}
        </div>

        {/* Hormone detail card */}
        <div className={`${cs.bg} border ${cs.border} rounded-xl p-5`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{h.icon}</span>
            <h3 className={`text-lg font-bold ${cs.text}`}>{h.name}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{lang === 'es' ? 'Producida en' : 'Produced in'}</p>
              <p className="text-sm text-gray-700">{h.produced}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{lang === 'es' ? 'Transporte' : 'Transport'}</p>
              <p className="text-sm text-gray-700">{h.transport}</p>
            </div>
          </div>

          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{lang === 'es' ? 'Efectos principales' : 'Key effects'}</p>
          <ul className="space-y-1.5 mb-4">
            {h.effects.map((eff, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className={`${cs.dot} w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0`}></span>
                {eff}
              </li>
            ))}
          </ul>

          <div className="bg-white/70 rounded-lg p-3 border border-white/50">
            <p className="text-sm text-gray-700">
              <strong>💡 {lang === 'es' ? 'Dato clave' : 'Key fact'}:</strong> {h.keyFact}
            </p>
          </div>
        </div>

        {/* Apical Dominance Interactive Demo */}
        <div className="mt-5 bg-white rounded-xl p-4 border border-brand-100">
          <h4 className="font-semibold text-brand-700 mb-3">
            {lang === 'es' ? '🌳 Demo: Dominancia Apical' : '🌳 Demo: Apical Dominance'}
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            {lang === 'es'
              ? 'La yema apical produce auxina que suprime el crecimiento lateral. Haz clic para cortar el ápice.'
              : 'The apical bud produces auxin that suppresses lateral growth. Click to remove the apex.'}
          </p>
          <div className="flex items-end justify-center gap-8 mb-3 min-h-[160px]">
            {/* Intact plant */}
            <div className="text-center">
              <div className="relative inline-block">
                {/* Main stem */}
                <div className="w-3 bg-green-500 mx-auto rounded-sm" style={{ height: 120 }}></div>
                {/* Apical bud */}
                {!apexRemoved && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="w-5 h-5 bg-green-600 rounded-full border-2 border-green-700"></div>
                  </div>
                )}
                {apexRemoved && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                    <div className="w-4 h-1 bg-amber-700 rounded"></div>
                  </div>
                )}
                {/* Lateral buds */}
                <div className="absolute top-6 -left-3">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${apexRemoved ? 'bg-green-500 scale-[2] -translate-x-2' : 'bg-green-300 scale-100'}`}></div>
                </div>
                <div className="absolute top-6 -right-3">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${apexRemoved ? 'bg-green-500 scale-[2] translate-x-2' : 'bg-green-300 scale-100'}`}></div>
                </div>
                <div className="absolute top-16 -left-3">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${apexRemoved ? 'bg-green-500 scale-[2] -translate-x-2' : 'bg-green-300 scale-100'}`}></div>
                </div>
                <div className="absolute top-16 -right-3">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${apexRemoved ? 'bg-green-500 scale-[2] translate-x-2' : 'bg-green-300 scale-100'}`}></div>
                </div>
                {/* Auxin flow arrows */}
                {!apexRemoved && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2">
                    <div className="text-purple-500 text-xs font-bold animate-pulse">↓ ↓ ↓</div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                {apexRemoved
                  ? (lang === 'es' ? 'Ápice cortado — laterales crecen' : 'Apex cut — laterals grow')
                  : (lang === 'es' ? 'Ápice intacto — auxina suprime' : 'Apex intact — auxin suppresses')}
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setApexRemoved(!apexRemoved)}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              {apexRemoved
                ? (lang === 'es' ? '🌱 Restaurar ápice' : '🌱 Restore apex')
                : (lang === 'es' ? '✂️ Cortar ápice' : '✂️ Cut apex')}
            </button>
          </div>
        </div>
      </div>

      <ConceptCheckMCQ
        lang={lang}
        question={lang === 'es'
          ? '¿Qué hormona es un gas que promueve la maduración de frutos y puede desencadenar la maduración en frutos cercanos?'
          : 'Which hormone is a gas that promotes fruit ripening and can trigger ripening in nearby fruits?'}
        options={
          lang === 'es'
            ? ['Auxina', 'Giberelina', 'Ácido abscísico', 'Etileno']
            : ['Auxin', 'Gibberellin', 'Abscisic acid', 'Ethylene']
        }
        correctIndex={3}
        explanation={lang === 'es'
          ? 'El etileno es la única hormona vegetal gaseosa. Se difunde a frutos vecinos, desencadenando una reacción en cadena de maduración — por eso "una manzana podrida pudre al barril".'
          : 'Ethylene is the only gaseous plant hormone. It diffuses to neighboring fruits, triggering a chain reaction of ripening — that\'s why "one bad apple spoils the barrel".'}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SECTION 4: PHOTOPERIODISM & TIMING
// ═══════════════════════════════════════════════════════════════════════
const PhotoperiodismSection = ({ lang }) => {
  const [dayHours, setDayHours] = useState(14);
  const [showInterrupt, setShowInterrupt] = useState(false);
  const nightHours = 24 - dayHours;
  const criticalNight = 10; // hours

  const isLDP = nightHours < criticalNight;
  const isSDP = nightHours >= criticalNight;

  // With night interruption, SDP won't flower (night broken), LDP will
  const sdpFlowers = isSDP && !showInterrupt;
  const ldpFlowers = isLDP || showInterrupt;

  return (
    <div className="learn-chunk">
      <h2 className="text-xl font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">🌗</span>
        {lang === 'es' ? 'Fotoperiodismo y Temporización' : 'Photoperiodism & Timing'}
      </h2>
      <p className="text-gray-600 mb-4">
        <RichText text={lang === 'es'
          ? '**Fotoperiodismo** es la respuesta de un organismo al fotoperiodo (duración relativa de día y noche). ¡Críticamente, las plantas en realidad miden la **duración de la noche**, no la del día! El pigmento **fitocromo** actúa como el detector de luz.'
          : '**Photoperiodism** is an organism\'s response to the photoperiod (relative lengths of day and night). Critically, plants actually measure **night length**, not day length! The pigment **phytochrome** acts as the light detector.'
        } />
      </p>

      {/* Phytochrome explanation */}
      <div className="interactive-box mb-5">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? 'Interconversión del Fitocromo' : 'Phytochrome Interconversion'}
        </h3>
        <div className="bg-white rounded-xl p-4 border border-brand-100 mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="text-center bg-red-50 rounded-xl p-4 border border-red-200 flex-1">
              <div className="text-3xl mb-1">🔴</div>
              <p className="font-bold text-red-700">P<sub>r</sub></p>
              <p className="text-xs text-gray-600">{lang === 'es' ? 'Absorbe luz roja' : 'Absorbs red light'}</p>
              <p className="text-xs text-gray-500">(660nm)</p>
              <p className="text-xs text-gray-500 mt-1">{lang === 'es' ? 'Forma inactiva' : 'Inactive form'}</p>
            </div>
            <div className="flex flex-col items-center gap-1 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-red-500 font-semibold">{lang === 'es' ? 'Luz roja' : 'Red light'}</span>
                <span>→</span>
              </div>
              <div className="text-xs text-gray-400">⇌</div>
              <div className="flex items-center gap-1">
                <span>←</span>
                <span className="text-purple-500 font-semibold">{lang === 'es' ? 'Rojo lejano / Oscuridad' : 'Far-red / Darkness'}</span>
              </div>
            </div>
            <div className="text-center bg-purple-50 rounded-xl p-4 border border-purple-200 flex-1">
              <div className="text-3xl mb-1">🟣</div>
              <p className="font-bold text-purple-700">P<sub>fr</sub></p>
              <p className="text-xs text-gray-600">{lang === 'es' ? 'Absorbe rojo lejano' : 'Absorbs far-red light'}</p>
              <p className="text-xs text-gray-500">(730nm)</p>
              <p className="text-xs text-gray-500 mt-1">{lang === 'es' ? 'Forma activa' : 'Active form'}</p>
            </div>
          </div>
          <div className="mt-3 bg-purple-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              {lang === 'es'
                ? <><strong>P<sub>fr</sub> es la forma biológicamente activa.</strong> Durante la luz del día, P<sub>r</sub> se convierte rápidamente a P<sub>fr</sub>. En la oscuridad, P<sub>fr</sub> vuelve lentamente a P<sub>r</sub>. Las concentraciones relativas de P<sub>r</sub> y P<sub>fr</sub> le dan a la planta la capacidad de medir la duración de la noche.</>
                : <><strong>P<sub>fr</sub> is the biologically active form.</strong> During daylight, P<sub>r</sub> converts rapidly to P<sub>fr</sub>. In darkness, P<sub>fr</sub> slowly reverts to P<sub>r</sub>. The relative concentrations of P<sub>r</sub> and P<sub>fr</sub> give the plant the ability to measure night length.</>
              }
            </p>
          </div>
        </div>

        {/* Interactive day/night length slider */}
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? 'Duración Crítica de la Noche — Interactivo' : 'Critical Night Length — Interactive'}
        </h3>
        <div className="bg-white rounded-xl p-4 border border-brand-100">
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              {lang === 'es' ? 'Horas de luz del día' : 'Hours of daylight'}: {dayHours}h
              &nbsp;|&nbsp;
              {lang === 'es' ? 'Horas de noche' : 'Night hours'}: {nightHours}h
            </label>
            <input
              type="range"
              min={6}
              max={20}
              value={dayHours}
              onChange={e => setDayHours(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>6h {lang === 'es' ? 'luz' : 'light'}</span>
              <span>20h {lang === 'es' ? 'luz' : 'light'}</span>
            </div>
          </div>

          {/* Day/Night bar */}
          <div className="flex rounded-lg overflow-hidden h-10 mb-3 border border-gray-200">
            <div
              className="bg-yellow-300 flex items-center justify-center text-xs font-semibold text-yellow-800 transition-all"
              style={{ width: `${(dayHours / 24) * 100}%` }}
            >
              ☀️ {dayHours}h
            </div>
            <div
              className="bg-indigo-900 flex items-center justify-center text-xs font-semibold text-indigo-200 transition-all"
              style={{ width: `${(nightHours / 24) * 100}%` }}
            >
              🌙 {nightHours}h
            </div>
          </div>

          {/* Night interruption toggle */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={showInterrupt}
              onChange={e => setShowInterrupt(e.target.checked)}
              className="accent-yellow-500"
            />
            {lang === 'es' ? '💡 Interrumpir noche con flash de luz' : '💡 Interrupt night with light flash'}
          </label>

          {/* Critical night length line */}
          <div className="relative mb-4 bg-gray-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-xs text-gray-600">
                {lang === 'es' ? 'Duración crítica de la noche' : 'Critical night length'} = {criticalNight}h
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {nightHours >= criticalNight
                ? (lang === 'es' ? 'La noche EXCEDE la duración crítica' : 'Night EXCEEDS critical length')
                : (lang === 'es' ? 'La noche es MENOR que la duración crítica' : 'Night is SHORTER than critical length')}
              {showInterrupt && (lang === 'es' ? ' — ¡pero la interrupción rompe la noche!' : ' — but interruption breaks the night!')}
            </p>
          </div>

          {/* Plant responses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`rounded-xl p-4 border-2 transition-all ${sdpFlowers ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{sdpFlowers ? '🌸' : '🌿'}</span>
                <span className="font-semibold text-sm">
                  {lang === 'es' ? 'Planta de Día Corto' : 'Short-Day Plant'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">
                {lang === 'es' ? '(realmente "planta de noche larga")' : '(really a "long-night plant")'}
              </p>
              <p className={`text-sm font-bold ${sdpFlowers ? 'text-green-700' : 'text-gray-400'}`}>
                {sdpFlowers
                  ? (lang === 'es' ? '✅ Floreciendo' : '✅ Flowering')
                  : (lang === 'es' ? '❌ No florece' : '❌ Not flowering')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'es' ? 'Ej: crisantemo, fresa, poinsettia' : 'Ex: chrysanthemum, strawberry, poinsettia'}
              </p>
            </div>
            <div className={`rounded-xl p-4 border-2 transition-all ${ldpFlowers ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{ldpFlowers ? '🌸' : '🌿'}</span>
                <span className="font-semibold text-sm">
                  {lang === 'es' ? 'Planta de Día Largo' : 'Long-Day Plant'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">
                {lang === 'es' ? '(realmente "planta de noche corta")' : '(really a "short-night plant")'}
              </p>
              <p className={`text-sm font-bold ${ldpFlowers ? 'text-green-700' : 'text-gray-400'}`}>
                {ldpFlowers
                  ? (lang === 'es' ? '✅ Floreciendo' : '✅ Flowering')
                  : (lang === 'es' ? '❌ No florece' : '❌ Not flowering')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'es' ? 'Ej: espinaca, lechuga, clavel' : 'Ex: spinach, lettuce, carnation'}
              </p>
            </div>
          </div>

          {showInterrupt && (
            <div className="mt-3 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <p className="text-sm text-gray-700">
                <RichText text={lang === 'es'
                  ? '💡 **Interrupción de noche:** Un breve flash de luz roja durante la noche convierte P<sub>r</sub> → P<sub>fr</sub>, reiniciando el "reloj". Esto **rompe** la noche larga que las plantas de día corto necesitan, impidiéndoles florecer, mientras que las plantas de día largo florecerán.'
                  : '💡 **Night interruption:** A brief flash of red light during the night converts P<sub>r</sub> → P<sub>fr</sub>, resetting the "clock". This **breaks** the long night that short-day plants need, preventing them from flowering, while long-day plants will flower.'
                } />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stomata & Dormancy */}
      <div className="bg-brand-50 rounded-xl p-4 border border-brand-100 mb-4">
        <h3 className="font-semibold text-brand-700 mb-2">
          {lang === 'es' ? '🍂 Dormancia y Abscisión' : '🍂 Dormancy & Abscission'}
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          <RichText text={lang === 'es'
            ? 'La **dormancia** es un estado de crecimiento detenido durante condiciones desfavorables. El **ABA** promueve la dormancia. La **abscisión** es la caída de hojas — una capa de abscisión se forma en la base del pecíolo. Esto conserva agua y energía durante el invierno.'
            : '**Dormancy** is a state of arrested growth during unfavorable conditions. **ABA** promotes dormancy. **Abscission** is leaf drop — an abscission layer forms at the base of the petiole. This conserves water and energy during winter.'
          } />
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-white rounded-lg p-3 border border-brand-100">
            <p className="text-2xl mb-1">🥶</p>
            <p className="font-semibold text-brand-700">{lang === 'es' ? 'Dormancia' : 'Dormancy'}</p>
            <p className="text-xs text-gray-500">{lang === 'es' ? 'Crecimiento detenido' : 'Growth arrested'}</p>
            <p className="text-xs text-gray-500">ABA ↑</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-brand-100">
            <p className="text-2xl mb-1">🌡️</p>
            <p className="font-semibold text-brand-700">{lang === 'es' ? 'Vernalización' : 'Vernalization'}</p>
            <p className="text-xs text-gray-500">{lang === 'es' ? 'Exposición al frío' : 'Cold exposure'}</p>
            <p className="text-xs text-gray-500">{lang === 'es' ? 'Rompe dormancia' : 'Breaks dormancy'}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-brand-100">
            <p className="text-2xl mb-1">🌱</p>
            <p className="font-semibold text-brand-700">{lang === 'es' ? 'Germinación' : 'Germination'}</p>
            <p className="text-xs text-gray-500">GA ↑, ABA ↓</p>
            <p className="text-xs text-gray-500">{lang === 'es' ? 'Crecimiento reanuda' : 'Growth resumes'}</p>
          </div>
        </div>
      </div>

      <ConceptCheckMCQ
        lang={lang}
        question={lang === 'es'
          ? 'Una planta de día corto tiene una duración crítica de noche de 12 horas. ¿Cuál régimen de luz hará que florezca?'
          : 'A short-day plant has a critical night length of 12 hours. Which light regime will cause it to flower?'}
        options={
          lang === 'es'
            ? ['14h luz / 10h oscuridad', '10h luz / 14h oscuridad', '10h luz / 14h oscuridad con flash de luz a las 7h de oscuridad', '16h luz / 8h oscuridad']
            : ['14h light / 10h dark', '10h light / 14h dark', '10h light / 14h dark with light flash at 7h of darkness', '16h light / 8h dark']
        }
        correctIndex={1}
        explanation={lang === 'es'
          ? 'Las plantas de día corto necesitan una noche ininterrumpida que exceda su duración crítica. 14h de oscuridad > 12h críticas = floración. La opción C no funcionaría porque el flash de luz rompe la noche larga.'
          : 'Short-day plants need an uninterrupted night exceeding their critical length. 14h dark > 12h critical = flowering. Option C would not work because the light flash breaks the long night.'}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SECTION 5: ANIMAL BEHAVIOR — KINESES & TAXES + CHOICE CHAMBER
// ═══════════════════════════════════════════════════════════════════════
const AnimalBehaviorSection = ({ lang }) => {
  const [simRunning, setSimRunning] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [organisms, setOrganisms] = useState([]);
  const [chamberType, setChamberType] = useState('light'); // 'light' or 'temp'
  const [counts, setCounts] = useState({ left: 0, right: 0 });
  const animRef = useRef(null);
  const simRef = useRef({ running: false });

  const initOrganisms = useCallback(() => {
    const orgs = [];
    for (let i = 0; i < 10; i++) {
      orgs.push({
        x: 100 + Math.random() * 200,
        y: 40 + Math.random() * 120,
        angle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
        turnRate: Math.random() * 0.3,
      });
    }
    return orgs;
  }, []);

  const startSim = useCallback(() => {
    const orgs = initOrganisms();
    setOrganisms(orgs);
    setSimTime(0);
    setCounts({ left: 0, right: 0 });
    setSimRunning(true);
    simRef.current.running = true;
  }, [initOrganisms]);

  const stopSim = useCallback(() => {
    setSimRunning(false);
    simRef.current.running = false;
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    if (!simRunning) return;
    let lastTime = performance.now();

    const tick = (now) => {
      if (!simRef.current.running) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setSimTime(prev => prev + dt);
      setOrganisms(prev => {
        const next = prev.map(o => {
          let { x, y, angle, speed, turnRate } = o;
          const midX = 200;
          const isInPreferred = chamberType === 'light'
            ? x > midX // dark side (right = dark)
            : x > midX; // warm side (right = warm)

          // Kinesis: move faster + turn more in non-preferred area
          const currentSpeed = isInPreferred ? speed * 0.4 : speed * 1.5;
          const currentTurn = isInPreferred ? turnRate * 0.3 : turnRate * 2;

          angle += (Math.random() - 0.5) * currentTurn;
          x += Math.cos(angle) * currentSpeed;
          y += Math.sin(angle) * currentSpeed;

          // Boundary bouncing
          if (x < 10) { x = 10; angle = Math.PI - angle; }
          if (x > 390) { x = 390; angle = Math.PI - angle; }
          if (y < 10) { y = 10; angle = -angle; }
          if (y > 190) { y = 190; angle = -angle; }

          // Narrow passage in middle
          if (Math.abs(x - midX) < 15 && (y < 60 || y > 140)) {
            x = x < midX ? midX - 16 : midX + 16;
          }

          return { ...o, x, y, angle, speed, turnRate };
        });

        // Count per side
        const leftCount = next.filter(o => o.x < 200).length;
        setCounts({ left: leftCount, right: next.length - leftCount });

        return next;
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [simRunning, chamberType]);

  // Taxis classifier
  const [taxisAnswers, setTaxisAnswers] = useState({});
  const [taxisRevealed, setTaxisRevealed] = useState(false);

  const taxisExamples = [
    {
      organism: lang === 'es' ? 'Polilla macho vuela hacia feromonas femeninas' : 'Male moth flies toward female pheromones',
      correct: 'positive chemotaxis',
      correctEs: 'quimiotaxis positiva',
    },
    {
      organism: lang === 'es' ? 'Larvas se alejan de la luz' : 'Maggots move away from light',
      correct: 'negative phototaxis',
      correctEs: 'fototaxis negativa',
    },
    {
      organism: lang === 'es' ? 'Mosquito vuela hacia el calor corporal' : 'Mosquito flies toward body heat',
      correct: 'positive thermotaxis',
      correctEs: 'termotaxis positiva',
    },
    {
      organism: lang === 'es' ? 'Cangrejo de río retrocede hacia una grieta' : 'Spiny lobster backs into a crevice',
      correct: 'positive thigmotaxis',
      correctEs: 'tigmotaxis positiva',
    },
    {
      organism: lang === 'es' ? 'Cochinillas se mueven más rápido en ambientes secos' : 'Woodlice move faster in dry environments',
      correct: 'kinesis',
      correctEs: 'kinesis',
    },
  ];

  const taxisOptions = [
    { value: 'positive chemotaxis', label: lang === 'es' ? 'Quimiotaxis +' : 'Chemotaxis +' },
    { value: 'negative phototaxis', label: lang === 'es' ? 'Fototaxis -' : 'Phototaxis -' },
    { value: 'positive thermotaxis', label: lang === 'es' ? 'Termotaxis +' : 'Thermotaxis +' },
    { value: 'positive thigmotaxis', label: lang === 'es' ? 'Tigmotaxis +' : 'Thigmotaxis +' },
    { value: 'kinesis', label: lang === 'es' ? 'Kinesis' : 'Kinesis' },
  ];

  const taxisScore = Object.entries(taxisAnswers).filter(
    ([idx, val]) => val === taxisExamples[Number(idx)].correct
  ).length;

  return (
    <div className="learn-chunk">
      <h2 className="text-xl font-bold text-brand-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">🐛</span>
        {lang === 'es' ? 'Comportamiento Animal: Kinesis y Taxis' : 'Animal Behavior: Kineses & Taxes'}
      </h2>

      {/* Kinesis vs Taxis explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">
            {lang === 'es' ? '🔄 Kinesis' : '🔄 Kinesis'}
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            <RichText text={lang === 'es'
              ? 'Respuesta **no direccional** a un estímulo. El organismo cambia su **velocidad de movimiento** o **tasa de giro** pero NO se mueve directamente hacia o desde el estímulo.'
              : 'A **non-directional** response to a stimulus. The organism changes its **speed of movement** or **rate of turning** but does NOT move directly toward or away from the stimulus.'
            } />
          </p>
          <div className="bg-white rounded-lg p-2 text-xs text-gray-600">
            <p className="font-semibold mb-1">{lang === 'es' ? 'Tipos:' : 'Types:'}</p>
            <p><strong>{lang === 'es' ? 'Ortokinesis' : 'Orthokinesis'}:</strong> {lang === 'es' ? 'Cambia velocidad' : 'Changes speed'}</p>
            <p><strong>{lang === 'es' ? 'Clinokinesis' : 'Klinokinesis'}:</strong> {lang === 'es' ? 'Cambia tasa de giro' : 'Changes turning rate'}</p>
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <h3 className="font-bold text-green-800 mb-2">
            {lang === 'es' ? '➡️ Taxis' : '➡️ Taxis'}
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            <RichText text={lang === 'es'
              ? 'Respuesta **direccional** a un estímulo o gradiente. El organismo se mueve **hacia** (positiva) o **alejándose** (negativa) del estímulo.'
              : 'A **directional** response to a stimulus or gradient. The organism moves **toward** (positive) or **away from** (negative) the stimulus.'
            } />
          </p>
          <div className="bg-white rounded-lg p-2 text-xs text-gray-600">
            <p className="font-semibold mb-1">{lang === 'es' ? 'Ejemplos:' : 'Examples:'}</p>
            <p><strong>{lang === 'es' ? 'Fototaxis' : 'Phototaxis'}:</strong> {lang === 'es' ? 'Respuesta a luz' : 'Response to light'}</p>
            <p><strong>{lang === 'es' ? 'Quimiotaxis' : 'Chemotaxis'}:</strong> {lang === 'es' ? 'Respuesta a químicos' : 'Response to chemicals'}</p>
            <p><strong>{lang === 'es' ? 'Termotaxis' : 'Thermotaxis'}:</strong> {lang === 'es' ? 'Respuesta a temperatura' : 'Response to temperature'}</p>
          </div>
        </div>
      </div>

      {/* Choice Chamber Simulator */}
      <div className="interactive-box">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? '🧫 Simulador de Cámara de Elección' : '🧫 Choice Chamber Simulator'}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {lang === 'es'
            ? 'Observa cómo las cochinillas (woodlice) se distribuyen entre dos ambientes. Su comportamiento es kinesis — no se dirigen a un ambiente, sino que se mueven más lento en condiciones favorables y más rápido en condiciones desfavorables.'
            : 'Watch how woodlice distribute themselves between two environments. Their behavior is kinesis — they don\'t steer toward an environment, but move slower in favorable conditions and faster in unfavorable ones.'}
        </p>

        {/* Chamber type selector */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => { setChamberType('light'); stopSim(); }}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              chamberType === 'light' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {lang === 'es' ? '💡 Luz vs Oscuridad' : '💡 Light vs Dark'}
          </button>
          <button
            onClick={() => { setChamberType('temp'); stopSim(); }}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              chamberType === 'temp' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {lang === 'es' ? '🌡️ Cálido vs Frío' : '🌡️ Warm vs Cool'}
          </button>
        </div>

        {/* Chamber visualization */}
        <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-3" style={{ width: '100%', maxWidth: 400, height: 200, margin: '0 auto' }}>
          {/* Left half */}
          <div
            className={`absolute inset-y-0 left-0 w-1/2 ${
              chamberType === 'light' ? 'bg-yellow-100' : 'bg-orange-100'
            }`}
          >
            <div className="absolute bottom-2 left-2 text-xs font-semibold text-gray-600">
              {chamberType === 'light'
                ? (lang === 'es' ? '☀️ Luz' : '☀️ Light')
                : (lang === 'es' ? '🔥 Cálido (27°C)' : '🔥 Warm (27°C)')}
            </div>
          </div>
          {/* Right half (preferred) */}
          <div
            className={`absolute inset-y-0 right-0 w-1/2 ${
              chamberType === 'light' ? 'bg-gray-700' : 'bg-blue-100'
            }`}
          >
            <div className={`absolute bottom-2 right-2 text-xs font-semibold ${chamberType === 'light' ? 'text-gray-300' : 'text-gray-600'}`}>
              {chamberType === 'light'
                ? (lang === 'es' ? '🌑 Oscuro' : '🌑 Dark')
                : (lang === 'es' ? '❄️ Frío (14°C)' : '❄️ Cool (14°C)')}
            </div>
          </div>
          {/* Divider with passage */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[6px] bg-gray-400 z-10">
            <div className="absolute top-[60px] w-full h-[80px] bg-transparent" style={{ background: 'transparent' }}></div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[60px] w-[30px] h-[80px] bg-gray-100/80 z-[5] rounded"></div>

          {/* Organisms */}
          {organisms.map((o, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gray-500 border border-gray-600 z-20 transition-none"
              style={{
                left: `${(o.x / 400) * 100}%`,
                top: `${(o.y / 200) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              title={`Woodlouse ${i + 1}`}
            >
              <span className="text-[8px] absolute -top-0.5 left-1/2 -translate-x-1/2">🪲</span>
            </div>
          ))}
        </div>

        {/* Controls & Results */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex gap-2">
            <button
              onClick={simRunning ? stopSim : startSim}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              {simRunning ? <><Pause size={14} /> {lang === 'es' ? 'Pausar' : 'Pause'}</> : <><Play size={14} /> {lang === 'es' ? 'Iniciar' : 'Start'}</>}
            </button>
            <button
              onClick={() => { stopSim(); setOrganisms([]); setCounts({ left: 0, right: 0 }); setSimTime(0); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              <RotateCcw size={14} /> {t('reset', lang)}
            </button>
          </div>
          <div className="text-sm text-gray-600">
            {lang === 'es' ? 'Tiempo' : 'Time'}: {Math.floor(simTime)}s
          </div>
        </div>

        {/* Count display */}
        {organisms.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-lg p-3 text-center ${chamberType === 'light' ? 'bg-yellow-50 border border-yellow-200' : 'bg-orange-50 border border-orange-200'}`}>
              <p className="text-sm text-gray-600">
                {chamberType === 'light' ? (lang === 'es' ? 'Lado iluminado' : 'Light side') : (lang === 'es' ? 'Lado cálido' : 'Warm side')}
              </p>
              <p className="text-2xl font-bold text-gray-800">{counts.left}</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${chamberType === 'light' ? 'bg-gray-200 border border-gray-300' : 'bg-blue-50 border border-blue-200'}`}>
              <p className="text-sm text-gray-600">
                {chamberType === 'light' ? (lang === 'es' ? 'Lado oscuro' : 'Dark side') : (lang === 'es' ? 'Lado frío' : 'Cool side')}
              </p>
              <p className="text-2xl font-bold text-gray-800">{counts.right}</p>
            </div>
          </div>
        )}

        <div className="mt-3 bg-white rounded-lg p-3 border border-brand-100 text-sm text-gray-600">
          <RichText text={lang === 'es'
            ? '**Nota:** Las cochinillas no se mueven directamente hacia la oscuridad/frío. Se mueven **más lento** en condiciones favorables (oscuro/fresco/húmedo) y **más rápido** en condiciones desfavorables. Con el tiempo, esto resulta en más organismos acumulándose en el lado preferido — ¡esto es kinesis, no taxis!'
            : '**Note:** Woodlice do not steer directly toward the dark/cool side. They move **slower** in favorable conditions (dark/cool/moist) and **faster** in unfavorable conditions. Over time, this results in more organisms accumulating on the preferred side — this is kinesis, not taxis!'
          } />
        </div>
      </div>

      {/* Taxis Classifier Activity */}
      <div className="mt-5 bg-brand-50 rounded-xl p-4 border border-brand-100">
        <h3 className="font-semibold text-brand-700 mb-3">
          {lang === 'es' ? '🏷️ Clasifica el Comportamiento' : '🏷️ Classify the Behavior'}
        </h3>
        <div className="space-y-3">
          {taxisExamples.map((ex, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">{ex.organism}</p>
              <select
                value={taxisAnswers[i] || ''}
                onChange={e => setTaxisAnswers({ ...taxisAnswers, [i]: e.target.value })}
                disabled={taxisRevealed}
                className="w-full sm:w-auto px-3 py-1.5 rounded-md border border-gray-300 text-sm bg-white"
              >
                <option value="">{lang === 'es' ? '— Seleccionar —' : '— Select —'}</option>
                {taxisOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {taxisRevealed && (
                <span className={`ml-2 text-sm font-semibold ${taxisAnswers[i] === ex.correct ? 'text-green-600' : 'text-red-600'}`}>
                  {taxisAnswers[i] === ex.correct ? '✓' : `✗ → ${lang === 'es' ? ex.correctEs : ex.correct}`}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => setTaxisRevealed(true)}
            disabled={Object.keys(taxisAnswers).length < taxisExamples.length}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-brand-700 transition-colors"
          >
            {t('checkAnswer', lang)}
          </button>
          {taxisRevealed && (
            <span className="text-sm font-semibold text-brand-700">
              {lang === 'es' ? 'Puntuación' : 'Score'}: {taxisScore}/{taxisExamples.length}
            </span>
          )}
          {taxisRevealed && (
            <button
              onClick={() => { setTaxisAnswers({}); setTaxisRevealed(false); }}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
            >
              {t('reset', lang)}
            </button>
          )}
        </div>
      </div>

      <ConceptCheckMCQ
        lang={lang}
        question={lang === 'es'
          ? '¿Cuál es la diferencia clave entre kinesis y taxis?'
          : 'What is the key difference between kinesis and taxis?'}
        options={
          lang === 'es'
            ? ['La kinesis es más rápida que la taxis', 'La kinesis es no-direccional; la taxis es direccional', 'La kinesis solo ocurre en plantas; la taxis en animales', 'La kinesis es aprendida; la taxis es innata']
            : ['Kinesis is faster than taxis', 'Kinesis is non-directional; taxis is directional', 'Kinesis only occurs in plants; taxis in animals', 'Kinesis is learned; taxis is innate']
        }
        correctIndex={1}
        explanation={lang === 'es'
          ? 'La kinesis involucra cambios en velocidad o tasa de giro SIN dirección específica. La taxis es un movimiento directo hacia o desde un estímulo. Ambas son innatas y ambas ocurren en animales.'
          : 'Kinesis involves changes in speed or turning rate WITHOUT specific direction. Taxis is a direct movement toward or away from a stimulus. Both are innate and both occur in animals.'}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SECTION 6: AP REVIEW QUIZ (Challenge Questions)
// ═══════════════════════════════════════════════════════════════════════
const challengeQuestions = {
  en: [
    {
      id: 'q1',
      title: 'Plant Tropisms & Auxin',
      points: 4,
      text: '(a) Describe the role of auxin in phototropism. Include where auxin is produced, how it is redistributed, and the effect on cell elongation. (1pt)\n(b) Explain why a plant placed on its side shows opposite bending in the shoot vs. the root, even though auxin accumulates on the same (lower) side. (1pt)\n(c) A gardener removes the apical bud from a plant. Predict and explain the effect on lateral bud growth. (1pt)\n(d) Design an experiment to test whether auxin transport is polar (one-directional). Include your independent variable, dependent variable, and control. (1pt)',
      model: '(a) Auxin is produced in the shoot tip and young leaves. When light comes from one side, auxin migrates to the shaded side of the stem via lateral transport. Higher auxin concentration on the shaded side promotes cell elongation there, causing the stem to bend toward the light (positive phototropism).\n(b) Auxin accumulates on the lower side of both shoot and root. In the shoot, high auxin concentration promotes cell elongation, so the lower side elongates more and the shoot curves upward. In the root, high auxin inhibits cell elongation (roots are more sensitive), so the upper side elongates more and the root curves downward.\n(c) Removing the apical bud removes the source of auxin that was suppressing lateral buds (apical dominance). Without auxin flowing down from the apex, lateral buds are released from inhibition and begin to grow, producing a bushier plant.\n(d) Cut a stem segment and place an agar block containing auxin on one end. Place a plain agar block on the other end. After time, test whether auxin has moved into the receiver block. IV: Orientation of stem (apex-up vs apex-down). DV: Amount of auxin in receiver block. Control: Stem segment with plain agar on both ends.',
    },
    {
      id: 'q2',
      title: 'Photoperiodism & Phytochrome',
      points: 4,
      text: '(a) Explain why short-day plants are more accurately called "long-night plants." (1pt)\n(b) Describe how the phytochrome system allows plants to measure night length. Include the roles of Pr and Pfr. (1pt)\n(c) A researcher exposes a short-day plant (critical night length = 10h) to 8h light / 16h dark, but interrupts the dark period with a 5-minute red light flash at the 8th hour of darkness. Predict whether the plant will flower and explain why. (1pt)\n(d) If the researcher immediately follows the red light flash with a far-red light flash, would this change your prediction? Explain using phytochrome interconversion. (1pt)',
      model: '(a) Short-day plants actually require a continuous dark period that exceeds their critical night length to flower. They are measuring the length of the uninterrupted dark period, not the day length. A short day simply means a long night.\n(b) During the day, red light converts Pr (inactive) to Pfr (active form) — Pr absorbs at 660nm. During darkness, Pfr slowly reverts back to Pr. If the night is long enough, Pfr levels drop below the threshold needed to inhibit flowering in SDP (or maintain flowering in LDP). The ratio of Pr:Pfr tells the plant how long the night has been.\n(c) The plant will NOT flower. The red light flash converts Pr → Pfr during the dark period, effectively "breaking" the long night into two short nights (8h + 8h). Neither short night exceeds the 10h critical night length, so the short-day plant\'s flowering requirement is not met.\n(d) Yes, the plant would now flower. Far-red light immediately converts Pfr back to Pr, reversing the effect of the red flash. The plant "sees" the night as continuous again because Pfr levels remain low. The uninterrupted night effectively remains at 16h, exceeding the 10h critical length.',
    },
    {
      id: 'q3',
      title: 'Kinesis, Taxis & Choice Chambers',
      points: 4,
      text: '(a) Distinguish between kinesis and taxis using an example of each. (1pt)\n(b) Describe how a choice chamber experiment with woodlice demonstrates kinesis rather than taxis. Include the expected results and how you would interpret them. (1pt)\n(c) Explain the adaptive value of kinesis in woodlice. Why is this non-directional response beneficial for survival? (1pt)\n(d) A student investigates maggot phototaxis by placing a lamp 10 cm from maggots. The maggots initially move toward the light but then reverse direction. Explain the initial movement and reversal, and classify each response. (1pt)',
      model: '(a) Kinesis: A non-directional response — the organism changes speed or turning rate in relation to stimulus intensity (e.g., woodlice move faster in dry/light conditions). Taxis: A directional response — the organism moves toward or away from a stimulus (e.g., moths fly directly toward a pheromone source = positive chemotaxis).\n(b) In a choice chamber with light and dark halves, woodlice do not move directly toward the dark side. Instead, they move faster and turn more frequently in the light side, and slow down with fewer turns in the dark side. Over time, more woodlice accumulate on the dark side — not because they navigated there, but because they spend more time where movement is reduced. This random accumulation pattern (rather than directed movement) is characteristic of kinesis.\n(c) Woodlice are vulnerable to desiccation because they have a permeable exoskeleton. In unfavorable environments (dry, bright), faster movement and more turning increases the probability of randomly finding a more favorable (dark, moist) habitat. Once found, slower movement keeps them there longer. This is adaptive because it maximizes time in environments that reduce water loss without requiring complex sensory processing.\n(d) The initial movement toward the light may be random exploration or a brief positive response. The reversal and movement away from the light represents negative phototaxis — a directional movement away from the light stimulus. Maggots show negative phototaxis because light indicates exposed, dry conditions where they risk desiccation and predation. The rate of movement tends to be greater initially and then decreases with distance from the light source.',
    },
    {
      id: 'q4',
      title: 'Plant Hormones & Environmental Responses',
      points: 4,
      text: '(a) Compare the roles of ABA and gibberellin in seed dormancy and germination. Explain how these hormones act antagonistically. (1pt)\n(b) Explain the adaptive value of leaf abscission in deciduous plants during autumn. Include which hormones are involved. (1pt)\n(c) Ethylene is sometimes called a "positive feedback hormone." Explain what this means and provide an example. (1pt)\n(d) A greenhouse manager wants chrysanthemums (short-day plants) to flower for a holiday in December. The natural day length in December is 9 hours. Describe TWO strategies the manager could use to control flowering time, and explain the biological basis of each. (1pt)',
      model: '(a) ABA promotes seed dormancy by inhibiting germination — it keeps seeds in a dormant state during unfavorable conditions. Gibberellins break dormancy and promote germination by activating amylase enzymes that break down stored starch into sugars for growth. They are antagonistic: high ABA:GA ratio = dormancy; high GA:ABA ratio = germination. Environmental cues like cold stratification or water can shift this balance.\n(b) Leaf abscission conserves water during winter when frozen soil limits water uptake and cold temperatures would damage leaf tissue. Ethylene promotes the formation of an abscission layer at the base of the petiole. ABA also contributes by promoting senescence. Dropping leaves prevents frost damage and reduces water loss through transpiration, while nutrients are recycled back into the plant before the leaf falls.\n(c) Ethylene exhibits positive feedback because ripe fruits release ethylene gas, which triggers ripening in neighboring fruits, which then release more ethylene, amplifying the effect. Example: one ripe banana in a bunch triggers ripening of all others. This ensures synchronized ripening, which is adaptive for seed dispersal — animals are attracted to clusters of ripe fruit.\n(d) Strategy 1: Ensure natural dark periods remain uninterrupted. Since chrysanthemums are short-day (long-night) plants and December has 15h nights, they should flower naturally. The manager must avoid any artificial light at night that could break the dark period. Strategy 2: If the manager wants to TIME the flowering precisely (e.g., delay it), they could extend the day length with artificial lights to prevent flowering, then remove the lights at the right time before the desired bloom date, allowing the long nights to trigger flowering on schedule. The biological basis is that uninterrupted dark periods allow Pfr to revert to Pr, which triggers the flowering response in short-day plants.',
    },
  ],
  es: [
    {
      id: 'q1',
      title: 'Tropismos Vegetales y Auxina',
      points: 4,
      text: '(a) Describe el rol de la auxina en el fototropismo. Incluye dónde se produce, cómo se redistribuye y el efecto en la elongación celular. (1pt)\n(b) Explica por qué una planta colocada de lado muestra curvatura opuesta en el brote vs. la raíz, aunque la auxina se acumula en el mismo lado (inferior). (1pt)\n(c) Un jardinero remueve la yema apical de una planta. Predice y explica el efecto en el crecimiento de las yemas laterales. (1pt)\n(d) Diseña un experimento para probar si el transporte de auxina es polar (unidireccional). Incluye variable independiente, dependiente y control. (1pt)',
      model: '(a) La auxina se produce en el ápice del brote y hojas jóvenes. Cuando la luz viene de un lado, la auxina migra al lado sombreado por transporte lateral. Mayor concentración de auxina en el lado sombreado promueve la elongación celular allí, causando que el tallo se curve hacia la luz (fototropismo positivo).\n(b) La auxina se acumula en el lado inferior tanto del brote como de la raíz. En el brote, alta auxina promueve elongación, así que el lado inferior se alarga más y el brote se curva hacia arriba. En la raíz, alta auxina inhibe la elongación (las raíces son más sensibles), así que el lado superior se alarga más y la raíz se curva hacia abajo.\n(c) Remover la yema apical elimina la fuente de auxina que suprimía las yemas laterales (dominancia apical). Sin auxina fluyendo desde el ápice, las yemas laterales se liberan de la inhibición y comienzan a crecer, produciendo una planta más frondosa.\n(d) Cortar un segmento de tallo y colocar un bloque de agar con auxina en un extremo. Colocar agar simple en el otro. Después de un tiempo, evaluar si la auxina se movió al bloque receptor. VI: Orientación del tallo (ápice arriba vs abajo). VD: Cantidad de auxina en el bloque receptor. Control: Segmento con agar simple en ambos extremos.',
    },
    {
      id: 'q2',
      title: 'Fotoperiodismo y Fitocromo',
      points: 4,
      text: '(a) Explica por qué las plantas de día corto son más precisamente llamadas "plantas de noche larga." (1pt)\n(b) Describe cómo el sistema de fitocromo permite a las plantas medir la duración de la noche. Incluye los roles de Pr y Pfr. (1pt)\n(c) Un investigador expone una planta de día corto (noche crítica = 10h) a 8h luz / 16h oscuridad, pero interrumpe el período oscuro con un flash de luz roja de 5 min a la 8va hora. Predice si la planta florecerá y explica por qué. (1pt)\n(d) Si el investigador sigue inmediatamente el flash rojo con un flash de luz rojo-lejano, ¿cambiaría tu predicción? Explica usando la interconversión del fitocromo. (1pt)',
      model: '(a) Las plantas de día corto realmente requieren un período oscuro continuo que exceda su duración crítica de noche para florecer. Están midiendo la duración del período oscuro ininterrumpido, no la del día. Un día corto simplemente significa una noche larga.\n(b) Durante el día, la luz roja convierte Pr (inactivo) a Pfr (forma activa). En la oscuridad, Pfr revierte lentamente a Pr. Si la noche es suficientemente larga, los niveles de Pfr caen debajo del umbral necesario para inhibir la floración en PDP. La proporción Pr:Pfr le dice a la planta cuánto ha durado la noche.\n(c) La planta NO florecerá. El flash rojo convierte Pr → Pfr durante el período oscuro, efectivamente "rompiendo" la noche larga en dos noches cortas (8h + 8h). Ninguna excede las 10h críticas.\n(d) Sí, la planta ahora florecería. La luz rojo-lejano convierte Pfr de vuelta a Pr inmediatamente, revirtiendo el efecto del flash rojo. La planta "ve" la noche como continua porque los niveles de Pfr permanecen bajos.',
    },
    {
      id: 'q3',
      title: 'Kinesis, Taxis y Cámaras de Elección',
      points: 4,
      text: '(a) Distingue entre kinesis y taxis usando un ejemplo de cada una. (1pt)\n(b) Describe cómo un experimento de cámara de elección con cochinillas demuestra kinesis en vez de taxis. (1pt)\n(c) Explica el valor adaptativo de la kinesis en cochinillas. ¿Por qué es beneficiosa esta respuesta no-direccional? (1pt)\n(d) Un estudiante investiga la fototaxis de larvas colocando una lámpara a 10 cm. Las larvas inicialmente se mueven hacia la luz pero luego invierten dirección. Explica y clasifica cada respuesta. (1pt)',
      model: '(a) Kinesis: Respuesta no-direccional — el organismo cambia velocidad o tasa de giro (ej: cochinillas se mueven más rápido en condiciones secas/luminosas). Taxis: Respuesta direccional — el organismo se mueve hacia o desde un estímulo (ej: polillas vuelan directamente hacia feromonas = quimiotaxis positiva).\n(b) En una cámara con mitad luz y mitad oscuridad, las cochinillas no se dirigen directamente al lado oscuro. Se mueven más rápido en el lado iluminado y más lento en el oscuro. Con el tiempo, más cochinillas se acumulan en el lado oscuro — no porque navegaron allí, sino porque pasan más tiempo donde el movimiento es reducido.\n(c) Las cochinillas son vulnerables a la desecación. En ambientes desfavorables, movimiento más rápido aumenta la probabilidad de encontrar aleatoriamente un hábitat más favorable. Una vez encontrado, el movimiento más lento las mantiene allí. Esto maximiza el tiempo en ambientes que reducen la pérdida de agua.\n(d) El movimiento inicial hacia la luz puede ser exploración aleatoria. La reversión representa fototaxis negativa — movimiento direccional alejándose de la luz. Las larvas muestran fototaxis negativa porque la luz indica exposición y riesgo de desecación.',
    },
    {
      id: 'q4',
      title: 'Hormonas Vegetales y Respuestas Ambientales',
      points: 4,
      text: '(a) Compara los roles de ABA y giberelina en dormancia de semillas y germinación. (1pt)\n(b) Explica el valor adaptativo de la abscisión foliar en plantas deciduas durante el otoño. Incluye las hormonas involucradas. (1pt)\n(c) El etileno a veces se llama "hormona de retroalimentación positiva." Explica qué significa esto con un ejemplo. (1pt)\n(d) Un gerente de invernadero quiere que los crisantemos (plantas de día corto) florezcan para una festividad en diciembre. Describe DOS estrategias para controlar el tiempo de floración. (1pt)',
      model: '(a) ABA promueve la dormancia inhibiendo la germinación. Las giberelinas rompen la dormancia y promueven la germinación activando enzimas amilasa. Son antagónicas: alta proporción ABA:GA = dormancia; alta GA:ABA = germinación.\n(b) La abscisión conserva agua cuando el suelo congelado limita la absorción y el frío dañaría el tejido foliar. El etileno promueve la formación de la capa de abscisión. El ABA contribuye promoviendo la senescencia. Los nutrientes se reciclan antes de que la hoja caiga.\n(c) El etileno exhibe retroalimentación positiva porque los frutos maduros liberan etileno, que desencadena la maduración en frutos vecinos, que luego liberan más etileno. Ejemplo: un plátano maduro desencadena la maduración de todos los demás.\n(d) Estrategia 1: Asegurar que los períodos oscuros naturales permanezcan ininterrumpidos. Como son plantas de día corto y diciembre tiene noches largas, florecerán naturalmente si no se les expone a luz artificial nocturna. Estrategia 2: Para PROGRAMAR la floración, extender el día con luz artificial para prevenir la floración, luego remover las luces en el momento correcto antes de la fecha deseada.',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [started, setStarted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('learn');
  const [responses, setResponses] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [modelRevealed, setModelRevealed] = useState({ q1: false, q2: false, q3: false, q4: false });
  const [compiled, setCompiled] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const qs = challengeQuestions[lang] || challengeQuestions.en;

  const compileResponses = () => {
    const header = `Responses to the Environment — Challenge Responses\nStudent Name: ${studentName}\nDate: ${new Date().toLocaleDateString()}\n${'═'.repeat(50)}\n`;
    const body = qs.map((q, i) => {
      return `\nQuestion ${i + 1}: ${q.title} (${q.points} ${t('points', lang)})\n${q.text}\n\nMy Response:\n${responses[q.id] || '[No response entered]'}\n\nModel Answer:\n${q.model}\n${'─'.repeat(40)}`;
    }).join('\n');
    setCompiled(header + body);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compiled);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = compiled;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const LangToggle = () => (
    <div className="flex gap-1">
      <button onClick={() => setLang('en')} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'en' ? 'bg-brand-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>EN</button>
      <button onClick={() => setLang('es')} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'es' ? 'bg-brand-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>ES</button>
    </div>
  );

  // ─── Landing Page ──────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-coyote-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <img src="/laughing-coyote-logo.jpg" alt="Laughing Coyote Education" className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md object-cover" />
          <h1 className="text-2xl font-bold text-brand-800 mb-1">{t('appTitle', lang)}</h1>
          <p className="text-gray-500 text-sm mb-6">{t('subtitle', lang)}</p>
          <div className="flex justify-center mb-6">
            <LangToggle />
          </div>
          <label className="text-sm text-gray-600 block mb-2 text-left">{t('enterName', lang)}</label>
          <input
            type="text"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
            placeholder={t('namePlaceholder', lang)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
            onKeyDown={e => e.key === 'Enter' && studentName.trim() && setStarted(true)}
          />
          <button
            onClick={() => setStarted(true)}
            disabled={!studentName.trim()}
            className="w-full py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-40 transition-colors"
          >
            {t('start', lang)}
          </button>
        </div>
      </div>
    );
  }

  // ─── Main App ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/laughing-coyote-logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <h1 className="text-sm font-bold text-brand-800">{t('appTitle', lang)}</h1>
              <p className="text-xs text-gray-400">{studentName}</p>
            </div>
          </div>
          <LangToggle />
        </div>
        {/* Nav tabs */}
        <div className="max-w-5xl mx-auto px-4 pb-3 flex gap-2">
          {[
            { id: 'learn', label: t('learn', lang), icon: <BookOpen size={16} /> },
            { id: 'challenge', label: t('challenge', lang), icon: <Trophy size={16} /> },
            { id: 'compile', label: t('compile', lang), icon: <ClipboardList size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab flex items-center gap-1.5 ${activeTab === tab.id ? 'nav-tab-active' : 'nav-tab-inactive'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'learn' && (
          <>
            {/* Section Jump Nav */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {lang === 'es' ? 'Ir a la sección' : 'Jump to section'}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'section-intro', icon: '🔬', label: lang === 'es' ? 'Intro: Detectar y Responder' : 'Intro: Detect & Respond' },
                  { id: 'section-tropisms', icon: '🌱', label: lang === 'es' ? 'Tropismos Vegetales' : 'Plant Tropisms' },
                  { id: 'section-hormones', icon: '🧪', label: lang === 'es' ? 'Hormonas Vegetales' : 'Plant Hormones' },
                  { id: 'section-photoperiodism', icon: '🌗', label: lang === 'es' ? 'Fotoperiodismo' : 'Photoperiodism' },
                  { id: 'section-behavior', icon: '🐛', label: lang === 'es' ? 'Comportamiento Animal' : 'Animal Behavior' },
                ].map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      const el = document.getElementById(sec.id);
                      if (el) {
                        const yOffset = -120;
                        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 hover:shadow-sm transition-all"
                  >
                    <span>{sec.icon}</span> {sec.label}
                  </button>
                ))}
              </div>
            </div>

            <div id="section-intro"><IntroSection lang={lang} /></div>
            <div id="section-tropisms"><TropismSimulator lang={lang} /></div>
            <div id="section-hormones"><PlantHormonesExplorer lang={lang} /></div>
            <div id="section-photoperiodism"><PhotoperiodismSection lang={lang} /></div>
            <div id="section-behavior"><AnimalBehaviorSection lang={lang} /></div>
          </>
        )}

        {activeTab === 'challenge' && (
          <>
            {qs.map((q, i) => (
              <div key={q.id} className="challenge-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-brand-800">
                    {lang === 'es' ? 'Pregunta' : 'Question'} {i + 1}: {q.title}
                  </h3>
                  <span className="bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                    {q.points} {t('points', lang)}
                  </span>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 mb-4 font-sans">{q.text}</pre>
                <textarea
                  value={responses[q.id]}
                  onChange={e => setResponses({ ...responses, [q.id]: e.target.value })}
                  placeholder={t('yourResponse', lang)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-y"
                />
                <button
                  onClick={() => setModelRevealed({ ...modelRevealed, [q.id]: !modelRevealed[q.id] })}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  {modelRevealed[q.id] ? t('hideModel', lang) : t('revealModel', lang)}
                </button>
                {modelRevealed[q.id] && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-green-800 font-sans">{q.model}</pre>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {activeTab === 'compile' && (
          <div className="challenge-card">
            <h3 className="font-bold text-brand-800 mb-4">{t('compile', lang)}</h3>
            <button
              onClick={compileResponses}
              className="px-5 py-2.5 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors mb-4"
            >
              {t('compileBtn', lang)}
            </button>
            {compiled && (
              <>
                <pre className="whitespace-pre-wrap text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto mb-3 font-sans">
                  {compiled}
                </pre>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    copySuccess
                      ? 'bg-green-600 text-white'
                      : 'bg-coyote-500 text-white hover:bg-coyote-600'
                  }`}
                >
                  {copySuccess ? <><Check size={14} /> {t('copied', lang)}</> : <><Copy size={14} /> {t('copyBtn', lang)}</>}
                </button>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <img src="/laughing-coyote-logo.jpg" alt="Logo" className="w-5 h-5 rounded-full object-cover" />
            <span>Laughing Coyote Education</span>
          </div>
          <span>{t('biozoneRef', lang)}</span>
        </div>
      </footer>
    </div>
  );
}
