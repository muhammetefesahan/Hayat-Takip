import React, { useEffect, useState, useRef } from 'react';

function readStorageJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function normalizeStars(raw) {
  if (!raw || typeof raw !== 'object') {
    return { reading: 0, water: 0, total: 0 };
  }

  const reading = Number(raw.reading) || 0;
  const water = Number(raw.water) || 0;
  const total = Number(raw.total) || 0;

  return {
    reading: Math.max(0, reading),
    water: Math.max(0, water),
    total: Math.max(0, total),
  };
}

function makeTaskId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function Header({ starsTotal, onReset }) {
  return (
    <header className="header">
      <div className="logo">
        <div className="icon">SH</div>
        <div>
          <div className="title">Sweet Habits</div>
          <div className="subtitle">Okuma & Su Takibi</div>
        </div>
      </div>
      <div className="meta">
        <div>Toplam: <strong>{starsTotal}</strong> <span className="stars">⭐</span></div>
        <button className="link" onClick={onReset}>Sıfırla</button>
      </div>
    </header>
  );
}

function Card({ title, children }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Confetti({ show }) {
  if (!show) return null;
  return (
    <div className="confetti-wrap">
      <div className="confetti c1" />
      <div className="confetti c2" />
      <div className="confetti c3" />
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = readStorageJson('tasks', []);
    return Array.isArray(saved) ? saved.filter(task => task && typeof task.text === 'string') : [];
  });
  const [pageInput, setPageInput] = useState('');
  const [waterInput, setWaterInput] = useState('');
  const [stars, setStars] = useState(() => normalizeStars(readStorageJson('stars', { reading: 0, water: 0, total: 0 })));
  const [confetti, setConfetti] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch {
      // storage may be unavailable or quota exceeded
    }
  }, [tasks]);

  useEffect(() => {
    try {
      window.localStorage.setItem('stars', JSON.stringify(normalizeStars(stars)));
    } catch {
      // storage may be unavailable or quota exceeded
    }
  }, [stars]);

  function showToast(text) {
    if (!toastRef.current) return;
    toastRef.current.textContent = text;
    toastRef.current.classList.add('show');
    setTimeout(() => toastRef.current && toastRef.current.classList.remove('show'), 2000);
  }

  function addTask(text) {
    const cleanText = String(text || '').trim();
    if (!cleanText || cleanText.length > 200) {
      showToast('Görev 1-200 karakter arasında olmalı.');
      return;
    }

    const t = { id: makeTaskId(), text: cleanText, done: false };
    setTasks(s => [t, ...s]);
    showToast('Görev eklendi 🎉');
  }
  function toggleTask(id) {
    setTasks(s => s.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }
  function removeTask(id) {
    setTasks(s => s.filter(t => t.id !== id));
    showToast('Görev silindi');
  }

  function calcStarsForPages(p) {
    if (p >= 30) return 5;
    if (p >= 15) return 3;
    if (p >= 5) return 1;
    return 0;
  }
  function calcStarsForWater(ml) {
    if (ml >= 1000) return 5;
    if (ml >= 500) return 3;
    if (ml >= 200) return 1;
    return 0;
  }
  function triggerConfetti() {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1800);
  }

  function logReading() {
    const p = Number.parseInt(pageInput, 10);
    if (!Number.isFinite(p) || p <= 0) { showToast('Geçerli sayfa gir.'); return; }
    const s = calcStarsForPages(p);
    setStars(st => ({ ...normalizeStars(st), reading: normalizeStars(st).reading + s, total: normalizeStars(st).total + s }));
    setPageInput('');
    showToast(`Okuma kaydedildi +${s} ⭐`);
    if (s > 0) triggerConfetti();
  }
  function logWater() {
    const w = Number.parseInt(waterInput, 10);
    if (!Number.isFinite(w) || w <= 0) { showToast('Geçerli ml gir.'); return; }
    const s = calcStarsForWater(w);
    setStars(st => ({ ...normalizeStars(st), water: normalizeStars(st).water + s, total: normalizeStars(st).total + s }));
    setWaterInput('');
    showToast(`Su kaydedildi +${s} ⭐`);
    if (s > 0) triggerConfetti();
  }

  function redeem(cost) {
    const price = Number(cost);
    if (!Number.isFinite(price) || price <= 0) {
      showToast('Geçersiz ödül fiyatı.');
      return;
    }

    if (stars.total >= price) {
      setStars(s => ({ ...normalizeStars(s), total: Math.max(0, normalizeStars(s).total - price) }));
      showToast('Ödül kullanıldı 🎁');
    } else {
      showToast('Yeterli yıldız yok.');
    }
  }

  function resetAll() {
    if (!window.confirm('Tüm veriler sıfırlansın mı?')) return;
    setTasks([]);
    setStars({ reading: 0, water: 0, total: 0 });
    try {
      window.localStorage.removeItem('tasks');
      window.localStorage.removeItem('stars');
    } catch {
      // ignore storage issues
    }
    showToast('Sıfırlandı');
  }

  return (
    <div className="app">
      <div className="container">
        <Header starsTotal={stars.total} onReset={resetAll} />

        <main>
          <Card title="Okuma Kaydı">
            <p className="muted">Okuduğun sayfa sayısını gir. Daha fazla okursan daha çok yıldız kazanırsın.</p>
            <div className="row">
              <input type="number" value={pageInput} onChange={e => setPageInput(e.target.value)} placeholder="Sayfa sayısı" />
              <button className="btn" onClick={logReading}>Kaydet</button>
            </div>
            <div className="small">Okuma Yıldızları: <strong>{stars.reading}</strong></div>
            <div className="progress"><div style={{width: `${Math.min(100, (stars.reading % 50) * 2)}%`}} className="progress-fill" /></div>
          </Card>

          <Card title="Su Kaydı">
            <p className="muted">İçtiğin su miktarını ml gir. Hedef ~2000ml/gün.</p>
            <div className="row">
              <input type="number" value={waterInput} onChange={e => setWaterInput(e.target.value)} placeholder="ml" />
              <button className="btn alt" onClick={logWater}>Kaydet</button>
            </div>
            <div className="small">Su Yıldızları: <strong>{stars.water}</strong></div>
            <div className="progress"><div style={{width: `${Math.min(100, (stars.water % 50) * 2)}%`}} className="progress-fill alt" /></div>
          </Card>

          <Card title="Günlük Görevler">
            <TaskEditor onAdd={addTask} />
            <TaskList tasks={tasks} onToggle={toggleTask} onRemove={removeTask} />
          </Card>

          <Card title="Ödül Mağazası">
            <div className="reward-grid">
              <div className="reward">
                <div>Küçük Atıştırmalık</div>
                <div className="muted">Maliyet: 10 <span className="stars">⭐</span></div>
                <button className="btn" onClick={() => redeem(10)}>Kullan</button>
              </div>
              <div className="reward">
                <div>Favori Çikolata</div>
                <div className="muted">Maliyet: 50 <span className="stars">⭐</span></div>
                <button className="btn" onClick={() => redeem(50)}>Kullan</button>
              </div>
            </div>
          </Card>
        </main>
      </div>

      <Confetti show={confetti} />
      <div ref={toastRef} className="toast" />
    </div>
  );
}

// Small components used inside
function TaskEditor({ onAdd }) {
  const [val, setVal] = useState('');
  return (
    <div className="task-editor">
      <input placeholder="Yeni görev" value={val} onChange={e => setVal(e.target.value)} />
      <button className="btn success" onClick={() => { onAdd(val); setVal(''); }}>Ekle</button>
    </div>
  );
}

function TaskList({ tasks, onToggle, onRemove }) {
  if (tasks.length === 0) return <div className="muted">Görev yok</div>;
  return (
    <ul className="task-list">
      {tasks.map(t => (
        <li key={t.id} className={t.done ? 'done' : ''}>
          <label>
            <input type="checkbox" checked={t.done} onChange={() => onToggle(t.id)} />
            <span>{t.text}</span>
          </label>
          <button className="x" onClick={() => onRemove(t.id)}>Sil</button>
        </li>
      ))}
    </ul>
  );
}
