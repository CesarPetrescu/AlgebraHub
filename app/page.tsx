'use client';

import { useMemo, useRef, useState, useSyncExternalStore } from 'react';

type Seminar = {
  no: number;
  title: string;
  desc: string;
  category: 'algebră' | 'geometrie' | 'ecuații';
  href?: string;
};

const seminars: Seminar[] = [
  { no: 1, title: 'Matrici și sisteme', desc: 'Determinanți, inverse, rang și metoda Gauss.', category: 'algebră', href: '/seminare/seminar1.pdf' },
  { no: 2, title: 'Vectori în spațiu', desc: 'Baze, coordonate, drepte și plane în R³.', category: 'geometrie', href: '/seminare/seminar2.pdf' },
  { no: 3, title: 'Spații vectoriale', desc: 'Independență liniară, baze și subspații.', category: 'algebră', href: '/seminare/seminar3.pdf' },
  { no: 4, title: 'Aplicații liniare', desc: 'Matricea aplicației, nucleu, imagine și schimbări de bază.', category: 'algebră', href: '/seminare/seminar4.pdf' },
  { no: 5, title: 'Spații euclidiene', desc: 'Produse scalare și procedeul Gram–Schmidt.', category: 'algebră', href: '/seminare/seminar5.pdf' },
  { no: 6, title: 'Coduri și RSA', desc: 'Coduri liniare, criptare și aritmetică modulară.', category: 'algebră', href: '/seminare/seminar6.pdf' },
  { no: 7, title: 'Valori proprii', desc: 'Diagonalizare, Cayley–Hamilton și puteri de matrici.', category: 'algebră', href: '/seminare/seminar7.pdf' },
  { no: 8, title: 'Operatori adjuncți', desc: 'Adjunct, operatori autoadjuncți și proprietăți spectrale.', category: 'algebră', href: '/seminare/seminar8.pdf' },
  { no: 9, title: 'Ortodiagonalizare', desc: 'Matrici simetrice, baze ortonormate și transformări ortogonale.', category: 'algebră' },
  { no: 10, title: 'Forme pătratice', desc: 'Forma canonică prin metoda Gauss și tipul formei.', category: 'algebră', href: '/seminare/seminar10.pdf' },
  { no: 11, title: 'Conice', desc: 'Ecuații reduse, axe, focare și tangente.', category: 'geometrie', href: '/seminare/seminar11.pdf' },
  { no: 12, title: 'Cuadrice', desc: 'Plane tangente, normale și suprafețe în spațiu.', category: 'geometrie', href: '/seminare/seminar12.pdf' },
  { no: 13, title: 'Ecuații diferențiale I', desc: 'Probleme Cauchy și ecuații de ordinul întâi.', category: 'ecuații', href: '/seminare/seminar13.pdf' },
  { no: 14, title: 'Ecuații diferențiale II', desc: 'Ecuații liniare de ordin superior.', category: 'ecuații', href: '/seminare/seminar14.pdf' },
  { no: 15, title: 'Sisteme diferențiale', desc: 'Sisteme liniare și metoda valorilor proprii.', category: 'ecuații', href: '/seminare/seminar15.pdf' },
];

const steps = [
  { short: 'A', title: 'Construiește matricea simetrică' },
  { short: 'λ', title: 'Calculează valorile proprii' },
  { short: 'w', title: 'Găsește și normalizează vectorii' },
  { short: 'C', title: 'Pune vectorii pe coloane' },
  { short: 'D', title: 'Citește forma canonică' },
];

type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explain: string;
};

const quizQuestions: QuizQuestion[] = [
  {
    question: 'Unde pui vectorii w₁, w₂, w₃ în matricea C?',
    options: ['Pe linii', 'Pe coloane', 'Doar pe diagonală'],
    correct: 1,
    explain: 'Corect. C = [w₁ w₂ w₃], deci vectorii bazei sunt coloanele.',
  },
  {
    question: 'În q(x) = x₁² − x₂² + 4x₁x₃ + 4x₂x₃, cât este a₁₃ în matricea simetrică?',
    options: ['4', '2', '1'],
    correct: 1,
    explain: 'Termenul mixt se împarte la 2: 4x₁x₃ dă a₁₃ = a₃₁ = 2.',
  },
  {
    question: 'Valorile proprii ale unei matrici simetrice reale sunt întotdeauna…',
    options: ['Numere reale', 'Numere complexe nereale', 'Egale cu zero'],
    correct: 0,
    explain: 'Orice matrice simetrică reală are spectrul real și este ortodiagonalizabilă.',
  },
  {
    question: 'Dacă C este ortogonală, atunci C⁻¹ este…',
    options: ['C', 'Matricea identitate', 'Cᵀ (transpusa)'],
    correct: 2,
    explain: 'Pentru coloane ortonormate, CᵀC = I, deci C⁻¹ = Cᵀ.',
  },
  {
    question: 'Forma q(y) = 3y₁² − 3y₂² este…',
    options: ['Pozitiv definită', 'Nedefinită', 'Negativ definită'],
    correct: 1,
    explain: 'Are un semn + și unul − (tip (1, 1)), deci ia și valori pozitive, și negative: este nedefinită.',
  },
];

const matrixA = [
  ['1', '0', '2'],
  ['0', '-1', '2'],
  ['2', '2', '0'],
];

const matrixD = [
  ['3', '0', '0'],
  ['0', '-3', '0'],
  ['0', '0', '0'],
];

const STORAGE_KEY = 'algebrahub-done-v1';
const DONE_EVENT = 'algebrahub-done-changed';

function subscribeToDone(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(DONE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(DONE_EVENT, onChange);
  };
}

function getDoneSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? '[]';
  } catch {
    return '[]';
  }
}

function getServerDoneSnapshot() {
  return '[]';
}

function writeDone(next: number[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — progress just won't persist
  }
  window.dispatchEvent(new Event(DONE_EVENT));
}

function normalizeText(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function Matrix({ values, label }: { values: string[][]; label: string }) {
  return (
    <div className="matrix-wrap" aria-label={label}>
      <span className="matrix-bracket left" aria-hidden="true" />
      <div className="matrix-grid">
        {values.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => (
            <span key={`${rowIndex}-${colIndex}`}>{value}</span>
          )),
        )}
      </div>
      <span className="matrix-bracket right" aria-hidden="true" />
    </div>
  );
}

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [filter, setFilter] = useState<'toate' | Seminar['category']>('toate');
  const [query, setQuery] = useState('');
  const doneRaw = useSyncExternalStore(subscribeToDone, getDoneSnapshot, getServerDoneSnapshot);
  const done = useMemo<number[]>(() => {
    try {
      const parsed: unknown = JSON.parse(doneRaw);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is number => typeof item === 'number' && seminars.some((s) => s.no === item))
        : [];
    } catch {
      return [];
    }
  }, [doneRaw]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const stepRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const filteredSeminars = useMemo(() => {
    const needle = normalizeText(query.trim());
    return seminars.filter((item) => {
      if (filter !== 'toate' && item.category !== filter) return false;
      if (!needle) return true;
      return normalizeText(`${item.title} ${item.desc} ${item.category} seminar ${item.no}`).includes(needle);
    });
  }, [filter, query]);

  const progressPercent = Math.round((done.length / seminars.length) * 100);
  const nextUndone = seminars.find((item) => !done.includes(item.no));

  function toggleDone(no: number) {
    writeDone(done.includes(no) ? done.filter((item) => item !== no) : [...done, no]);
  }

  const quiz = quizQuestions[quizIndex];
  const quizIsCorrect = quizSelected !== null && quizSelected === quiz.correct;

  function nextQuiz() {
    if (quizSelected === null) return;
    const score = quizScore + (quizIsCorrect ? 1 : 0);
    if (quizIndex === quizQuestions.length - 1) {
      setQuizScore(score);
      setQuizFinished(true);
    } else {
      setQuizScore(score);
      setQuizIndex(quizIndex + 1);
      setQuizSelected(null);
    }
  }

  function restartQuiz() {
    setQuizIndex(0);
    setQuizSelected(null);
    setQuizScore(0);
    setQuizFinished(false);
  }

  function onStepKeyDown(event: React.KeyboardEvent, index: number) {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % steps.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + steps.length) % steps.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = steps.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    setActiveStep(nextIndex);
    stepRefs.current[nextIndex]?.focus();
  }

  return (
    <main id="main">
      <a className="skip-link" href="#seminare">Sari la seminare</a>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AlgebraHub, acasă">
          <span className="brand-mark">A</span>
          <span>AlgebraHub</span>
        </a>
        <nav aria-label="Navigație principală">
          <a href="#lectie">Lecția de azi</a>
          <a href="#metoda">Metodă</a>
          <a href="#seminare">Seminare</a>
          <a href="#examene">Examene</a>
        </nav>
        <a className="outline-button" href="#rezolvare">Începe exercițiul <span>↗</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>10</span> Forme pătratice · diagonalizare</p>
          <h1>Vezi matricea.<br />Rotește baza.<br /><em>Dispar termenii micști.</em></h1>
          <p className="hero-lead">
            Învață transformările ortogonale pe exemplul tău, de la matricea asociată până la forma canonică.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#metoda">Rezolvă pas cu pas <span>↓</span></a>
            {done.length > 0 ? (
              <a className="time-note progress-note" href="#seminare"><strong>{done.length} / {seminars.length} seminare parcurse</strong>continuă parcursul</a>
            ) : (
              <span className="time-note"><strong>8 min</strong> pentru recapitulare</span>
            )}
          </div>
        </div>

        <div className="equation-stage" aria-label="Transformarea matricei A în matricea diagonală D">
          <div className="stage-topline"><span>PROBLEMA TA</span><span>FORMA CANONICĂ</span></div>
          <div className="matrix-flow">
            <div className="matrix-card">
              <span className="matrix-name">A =</span>
              <Matrix values={matrixA} label="Matricea A" />
            </div>
            <div className="flow-arrow">
              <span>C<sup>T</sup>AC</span>
              <i>→</i>
            </div>
            <div className="matrix-card result">
              <span className="matrix-name">D =</span>
              <Matrix values={matrixD} label="Matricea diagonală D" />
            </div>
          </div>
          <div className="canonical-form">q = <b>3y₁²</b> − <b>3y₂²</b></div>
          <div className="stage-caption">
            <span><i className="dot positive" /> o valoare pozitivă</span>
            <span><i className="dot negative" /> una negativă</span>
            <span><i className="dot zero" /> una nulă</span>
          </div>
        </div>
      </section>

      <section className="lesson-strip" id="lectie">
        <p>Ținta lecției</p>
        <h2>Nu memora rezultatul.<br />Înțelege traseul.</h2>
        <div className="lesson-points">
          <span><b>01</b>Matrice simetrică</span>
          <span><b>02</b>Valori proprii</span>
          <span><b>03</b>Bază ortonormată</span>
          <span><b>04</b>Forma canonică</span>
        </div>
      </section>

      <section className="method-preview" id="metoda">
        <div className="section-heading">
          <p className="eyebrow"><span>01</span> Primul reflex corect</p>
          <h2>Vectorii proprii merg pe <em>coloane.</em></h2>
        </div>
        <div className="column-demo">
          <div className="demo-copy">
            <p>Pentru fiecare valoare proprie găsești un vector, îl normalizezi, apoi construiești:</p>
            <div className="formula-line">C = [ w₁&nbsp;&nbsp; w₂&nbsp;&nbsp; w₃ ]</div>
            <p className="note">Ordinea coloanelor stabilește ordinea valorilor de pe diagonala lui D.</p>
          </div>
          <div className="vector-columns" aria-label="Matricea C construită din vectorii proprii pe coloane">
            <div className="vector-labels"><span>w₁</span><span>w₂</span><span>w₃</span></div>
            <div className="c-matrix">
              <span>2/3</span><span>1/3</span><span>−2/3</span>
              <span>1/3</span><span>2/3</span><span>2/3</span>
              <span>2/3</span><span>−2/3</span><span>1/3</span>
            </div>
            <div className="column-guides" aria-hidden="true"><i /><i /><i /></div>
          </div>
        </div>
      </section>

      <section className="solver-section" id="rezolvare">
        <div className="solver-intro">
          <p className="eyebrow light"><span>02</span> Rezolvarea ta completă</p>
          <h2>Un singur traseu.<br /><em>Cinci pași clari.</em></h2>
          <p>Apasă pe fiecare etapă — sau folosește săgețile ← → când o etapă e selectată. Exemplul rămâne același, iar tu vezi exact ce se schimbă.</p>
        </div>
        <div className="solver-shell">
          <div className="step-list" role="tablist" aria-label="Pașii diagonalizării">
            {steps.map((step, index) => (
              <button
                key={step.short}
                ref={(el) => { stepRefs.current[index] = el; }}
                id={`step-tab-${index}`}
                className={activeStep === index ? 'active' : ''}
                onClick={() => setActiveStep(index)}
                onKeyDown={(event) => onStepKeyDown(event, index)}
                role="tab"
                aria-selected={activeStep === index}
                aria-controls="step-panel"
                tabIndex={activeStep === index ? 0 : -1}
              >
                <b>{String(index + 1).padStart(2, '0')}</b>
                <span>{step.title}</span>
                <i>{activeStep === index ? '●' : '○'}</i>
              </button>
            ))}
          </div>

          <div className="step-content" role="tabpanel" id="step-panel" aria-labelledby={`step-tab-${activeStep}`}>
            <div className="step-number">PASUL {String(activeStep + 1).padStart(2, '0')} / 05</div>
            {activeStep === 0 && (
              <div className="step-panel-grid">
                <div>
                  <h3>Coeficientul mixt se împarte la 2.</h3>
                  <p>În matrice, termenul <strong>4x₁x₃</strong> produce două elemente egale: a₁₃ = a₃₁ = 2.</p>
                  <div className="formula-box">q(x) = x₁² − x₂² + 4x₁x₃ + 4x₂x₃</div>
                </div>
                <div className="large-matrix"><span>A =</span><Matrix values={matrixA} label="Matricea simetrică asociată formei" /></div>
              </div>
            )}
            {activeStep === 1 && (
              <div className="step-panel-grid">
                <div>
                  <h3>Spectrul îți spune ce va apărea în D.</h3>
                  <p>Rezolvi ecuația caracteristică și păstrezi ordinea aleasă pentru valorile proprii.</p>
                  <div className="formula-box">det(A − λI) = −λ(λ − 3)(λ + 3)</div>
                </div>
                <div className="eigen-row"><span>λ₁<strong>3</strong></span><span>λ₂<strong>−3</strong></span><span>λ₃<strong>0</strong></span></div>
              </div>
            )}
            {activeStep === 2 && (
              <div>
                <h3>Trei direcții proprii, deja ortogonale.</h3>
                <p>Pentru o matrice simetrică, vectorii proprii corespunzători valorilor distincte sunt ortogonali. Aici fiecare are norma 3.</p>
                <div className="vector-row">
                  <span><b>λ = 3</b>w₁ = (2/3, 1/3, 2/3)</span>
                  <span><b>λ = −3</b>w₂ = (1/3, 2/3, −2/3)</span>
                  <span><b>λ = 0</b>w₃ = (−2/3, 2/3, 1/3)</span>
                </div>
              </div>
            )}
            {activeStep === 3 && (
              <div className="step-panel-grid">
                <div>
                  <h3>Coloane, nu linii.</h3>
                  <p>C = [w₁ w₂ w₃]. Pentru că vectorii sunt ortonormați, matricea este ortogonală și C⁻¹ = Cᵀ.</p>
                  <div className="check-line"><span>✓</span> CᵀC = I</div>
                </div>
                <div className="matrix-c-readout">
                  <div className="vector-labels"><span>w₁</span><span>w₂</span><span>w₃</span></div>
                  <div className="c-matrix"><span>2/3</span><span>1/3</span><span>−2/3</span><span>1/3</span><span>2/3</span><span>2/3</span><span>2/3</span><span>−2/3</span><span>1/3</span></div>
                </div>
              </div>
            )}
            {activeStep === 4 && (
              <div className="step-panel-grid final-step">
                <div>
                  <h3>Diagonala este chiar spectrul.</h3>
                  <div className="formula-box">D = CᵀAC = diag(3, −3, 0)</div>
                  <div className="canonical-answer">q(y) = 3y₁² − 3y₂²</div>
                </div>
                <div className="classification">
                  <span><b>Tip</b>(1, 1)</span>
                  <span><b>Semn</b>Nedefinită</span>
                  <span><b>Rang</b>2 · degenerată</span>
                </div>
              </div>
            )}
            <div className="step-controls">
              <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}>← Înapoi</button>
              <button className="next" onClick={() => setActiveStep(Math.min(4, activeStep + 1))} disabled={activeStep === 4}>Pasul următor →</button>
            </div>
          </div>
        </div>
      </section>

      <section className="quiz-section" id="verificare">
        <div>
          <p className="eyebrow"><span>03</span> Verificare rapidă</p>
          <h2>Verifică ce ai <em>reținut.</em></h2>
          <p className="quiz-intro">{quizQuestions.length} întrebări din lecția de azi. Primești explicația imediat, nu doar verdictul.</p>
        </div>
        <div className="quiz-card">
          {quizFinished ? (
            <div className="quiz-done" aria-live="polite">
              <p className="quiz-progress">Rezultat final</p>
              <p className="quiz-score">{quizScore} / {quizQuestions.length}</p>
              <p>{quizScore === quizQuestions.length ? 'Perfect. Ai reflexele corecte pentru diagonalizare.' : quizScore >= 3 ? 'Solid. Reia pașii la care ai ezitat și mai încearcă o dată.' : 'Reia rezolvarea pas cu pas, apoi revino aici — întrebările sunt exact pașii ei.'}</p>
              <div className="quiz-actions">
                <button type="button" className="quiz-next" onClick={restartQuiz}>Reia verificarea ↺</button>
                <a className="quiz-review" href="#rezolvare">Revezi pașii ↑</a>
              </div>
            </div>
          ) : (
            <>
              <div className="quiz-top">
                <span>Întrebarea {quizIndex + 1} / {quizQuestions.length}</span>
                <span>Scor: {quizScore}</span>
              </div>
              <div className="quiz-bar" role="progressbar" aria-valuemin={0} aria-valuemax={quizQuestions.length} aria-valuenow={quizIndex} aria-label="Progres verificare">
                <i style={{ width: `${(quizIndex / quizQuestions.length) * 100}%` }} />
              </div>
              <h3 className="quiz-question">{quiz.question}</h3>
              <div role="group" aria-label="Variante de răspuns">
                {quiz.options.map((answer, optionIndex) => {
                  const isSelected = quizSelected === optionIndex;
                  const stateClass = isSelected ? (optionIndex === quiz.correct ? 'correct' : 'wrong') : '';
                  return (
                    <button
                      key={answer}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setQuizSelected(optionIndex)}
                      className={stateClass}
                    >
                      <span>{answer}</span><i>{isSelected ? (optionIndex === quiz.correct ? '✓' : '×') : '○'}</i>
                    </button>
                  );
                })}
              </div>
              <div aria-live="polite">
                {quizSelected !== null && (
                  <p className={quizIsCorrect ? 'quiz-success' : 'quiz-error'}>
                    {quizIsCorrect ? quiz.explain : `Nu chiar. ${quiz.explain}`}
                  </p>
                )}
              </div>
              <button type="button" className="quiz-next" onClick={nextQuiz} disabled={quizSelected === null}>
                {quizIndex === quizQuestions.length - 1 ? 'Vezi rezultatul →' : 'Întrebarea următoare →'}
              </button>
            </>
          )}
        </div>
      </section>

      <section className="seminars-section" id="seminare">
        <div className="seminars-heading">
          <div>
            <p className="eyebrow light"><span>15</span> Seminare organizate</p>
            <h2>Tot parcursul,<br /><em>într-un singur loc.</em></h2>
          </div>
          <p>Fișele tale de seminar au fost ordonate într-o hartă de învățare. Deschide PDF-ul sau continuă direct cu lecția interactivă.</p>
        </div>

        <div className="progress-panel">
          <div className="progress-copy">
            <span>Progresul tău</span>
            <strong>{done.length} din {seminars.length} seminare parcurse · {progressPercent}%</strong>
            <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={seminars.length} aria-valuenow={done.length} aria-label="Seminare parcurse">
              <i style={{ width: `${progressPercent}%` }} />
            </div>
            <small>Se salvează automat pe acest dispozitiv.</small>
          </div>
          <div className="progress-actions">
            {nextUndone ? (
              <a href={`#seminar-${nextUndone.no}`}>Continuă cu S{String(nextUndone.no).padStart(2, '0')} · {nextUndone.title} →</a>
            ) : (
              <span className="progress-complete">✓ Ai parcurs tot traseul. Succes la examen!</span>
            )}
            {done.length > 0 && (
              <button type="button" className="progress-reset" onClick={() => writeDone([])}>Resetează progresul</button>
            )}
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-buttons" aria-label="Filtre seminare">
            {(['toate', 'algebră', 'geometrie', 'ecuații'] as const).map((item) => (
              <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className={filter === item ? 'active' : ''}>{item}</button>
            ))}
          </div>
          <label className="search-box">
            <span className="visually-hidden">Caută seminare după titlu sau concept</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Caută: valori proprii, conice, Gauss…"
            />
          </label>
        </div>
        <p className="results-count" aria-live="polite">
          {filteredSeminars.length === seminars.length
            ? `${seminars.length} seminare`
            : `${filteredSeminars.length} ${filteredSeminars.length === 1 ? 'seminar găsit' : 'seminare găsite'}`}
        </p>

        {filteredSeminars.length === 0 ? (
          <div className="empty-state">
            <h3>Niciun seminar nu se potrivește.</h3>
            <p>Încearcă un concept mai scurt — de pildă „proprii”, „conice” sau „Gauss” — sau șterge filtrele.</p>
            <button type="button" onClick={() => { setQuery(''); setFilter('toate'); }}>Șterge căutarea și filtrele</button>
          </div>
        ) : (
          <div className="seminar-grid">
            {filteredSeminars.map((item) => {
              const isDone = done.includes(item.no);
              return (
                <article key={item.no} id={`seminar-${item.no}`} className={`${item.no === 10 ? 'featured-seminar' : ''} ${isDone ? 'is-done' : ''}`}>
                  <div className="seminar-meta"><span>S{String(item.no).padStart(2, '0')}</span><span>{isDone ? '✓ parcurs' : item.category}</span></div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <div className="seminar-actions">
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer" aria-label={`Deschide fișa PDF pentru ${item.title}`}>Fișă PDF <span>↗</span></a>
                    ) : (
                      <a href="#rezolvare">Lecția interactivă <span>→</span></a>
                    )}
                    <button
                      type="button"
                      className={`done-toggle ${isDone ? 'is-done' : ''}`}
                      aria-pressed={isDone}
                      onClick={() => toggleDone(item.no)}
                    >
                      {isDone ? '✓ Parcurs' : 'Marchează parcurs'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="exam-section" id="examene">
        <div className="exam-copy">
          <p className="eyebrow"><span>04</span> Antrenament de examen</p>
          <h2>Patru variante.<br /><em>Aceeași logică.</em></h2>
          <p>Fiecare variantă combină forme pătratice, conice, cuadrice, ecuații diferențiale și operatori liniari.</p>
        </div>
        <div className="exam-list">
          {[
            ['01', 'Metoda Gauss', '/examene/final-1.pdf'],
            ['02', 'Metoda Jacobi', '/examene/final-2.pdf'],
            ['03', 'Transformări ortogonale', '/examene/final-3.pdf'],
            ['04', 'Metoda Gauss', '/examene/final-4.pdf'],
          ].map(([no, method, href]) => (
            <a key={no} href={href} target="_blank" rel="noreferrer" aria-label={`Deschide varianta de examen ${no}, ${method} (PDF)`}><b>Varianta {no}</b><span>{method}</span><i>↗</i></a>
          ))}
        </div>
      </section>

      <footer>
        <a className="brand" href="#top"><span className="brand-mark">A</span><span>AlgebraHub</span></a>
        <p>Din notițe împrăștiate într-un traseu care are sens.</p>
        <a href="#top">Înapoi sus ↑</a>
      </footer>
    </main>
  );
}