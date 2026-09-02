export default function PageHeader({ icon: Icon, title, description, accentColor = 'var(--gold)', children }) {
  return (
    <div className="animate-fade-in" style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 8 }}>
        {Icon && (
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon size={22} color="#fff" />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: 4
          }}>
            {title}
          </h1>
          {description && (
            <p style={{
              fontSize: 15,
              color: 'var(--ink-muted)',
              lineHeight: 1.5
            }}>
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, var(--border), transparent)',
        marginTop: 20
      }} />
    </div>
  );
}
