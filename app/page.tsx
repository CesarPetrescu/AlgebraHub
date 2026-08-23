'use client';

import { useState } from 'react';

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
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const filteredSeminars = filter === 'toate' ? seminars : seminars.filter((item) => item.category === filter);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AlgebraHub, acasă">
          <span className="brand-mark">A</span>
          <span>AlgebraHub</span>
        </a>
        <nav aria-label="Navigație principală">
          <a href="#lectie">Lecția de azi</a>
          <a href="#metoda">Metodă</a>
          <a href="#seminare">Seminare</a>
        </nav>
        <a className="outline-button" href="#metoda">Începe exercițiul <span>↗</span></a>
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
            <span className="time-note"><strong>8 min</strong> pentru recapitulare</span>
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
          <p>Apasă pe fiecare etapă. Exemplul rămâne același, iar tu vezi exact ce se schimbă.</p>
        </div>
        <div className="solver-shell">
          <div className="step-list" role="tablist" aria-label="Pașii diagonalizării">
            {steps.map((step, index) => (
              <button
                key={step.short}
                className={activeStep === index ? 'active' : ''}
                onClick={() => setActiveStep(index)}
                role="tab"
                aria-selected={activeStep === index}
              >
                <b>{String(index + 1).padStart(2, '0')}</b>
                <span>{step.title}</span>
                <i>{activeStep === index ? '●' : '○'}</i>
              </button>
            ))}
          </div>

          <div className="step-content" role="tabpanel">
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

      <section className="quiz-section">
        <div>
          <p className="eyebrow"><span>03</span> Verificare rapidă</p>
          <h2>Unde pui vectorii <em>w₁, w₂, w₃</em> în matricea C?</h2>
        </div>
        <div className="quiz-card">
          {['Pe linii', 'Pe coloane', 'Doar pe diagonală'].map((answer) => (
            <button
              key={answer}
              onClick={() => setQuizAnswer(answer)}
              className={quizAnswer === answer ? (answer === 'Pe coloane' ? 'correct' : 'wrong') : ''}
            >
              <span>{answer}</span><i>{quizAnswer === answer ? (answer === 'Pe coloane' ? '✓' : '×') : '○'}</i>
            </button>
          ))}
          {quizAnswer && <p className={quizAnswer === 'Pe coloane' ? 'quiz-success' : 'quiz-error'}>{quizAnswer === 'Pe coloane' ? 'Corect. C = [w₁ w₂ w₃], deci vectorii bazei sunt coloanele.' : 'Mai încearcă: coordonata întâi multiplică primul vector al bazei.'}</p>}
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
        <div className="filter-row" aria-label="Filtre seminare">
          {(['toate', 'algebră', 'geometrie', 'ecuații'] as const).map((item) => (
            <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'active' : ''}>{item}</button>
          ))}
        </div>
        <div className="seminar-grid">
          {filteredSeminars.map((item) => (
            <article key={item.no} className={item.no === 9 ? 'featured-seminar' : ''}>
              <div className="seminar-meta"><span>S{String(item.no).padStart(2, '0')}</span><span>{item.category}</span></div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              {item.href ? <a href={item.href} target="_blank" rel="noreferrer">Deschide fișa <span>↗</span></a> : <a href="#rezolvare">Lecția interactivă <span>→</span></a>}
            </article>
          ))}
        </div>
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
            <a key={no} href={href} target="_blank" rel="noreferrer"><b>Varianta {no}</b><span>{method}</span><i>↗</i></a>
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
