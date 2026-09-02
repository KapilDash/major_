import { useEffect, useState } from 'react';

export default function StatCard({ icon: Icon, label, value, suffix = '', accentColor = 'var(--gold)', delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = parseInt(value) || 0;

  useEffect(() => {
    if (numericValue === 0) return;
    const duration = 1200;
    const startTime = Date.now();
    const timer = setTimeout(() => {
      const animate = () => {
        const elapsed = Date.now() - startTime - delay;
        if (elapsed < 0) { requestAnimationFrame(animate); return; }
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(eased * numericValue));
        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    }, delay);
    return () => clearTimeout(timer);
  }, [numericValue, delay]);

  return (
    <div className="glass-card animate-fade-in-up" style={{
      padding: 24,
      animationDelay: `${delay}ms`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--ink-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}>
          {label}
        </span>
        {Icon && (
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-sm)',
            background: `${accentColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={16} color={accentColor} />
          </div>
        )}
      </div>
      <div style={{
        fontSize: 32,
        fontWeight: 800,
        fontFamily: 'var(--font-heading)',
        color: 'var(--ink)',
        lineHeight: 1
      }}>
        {displayValue.toLocaleString()}{suffix}
      </div>
    </div>
  );
}
