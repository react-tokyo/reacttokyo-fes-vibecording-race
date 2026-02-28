const skills = [
  {
    category: '코어 기술',
    color: '#1d9bf0',
    items: [
      {
        name: 'React 18',
        icon: '⚛️',
        description: 'Concurrent Features, useTransition, useDeferredValue',
        badge: 'v18.3.1',
      },
      {
        name: 'TypeScript',
        icon: '🔷',
        description: '정적 타입 시스템으로 안전한 코드 작성',
        badge: 'v5.6',
      },
      {
        name: 'Vite',
        icon: '⚡',
        description: '초고속 개발 서버 & 빌드 도구',
        badge: 'v6',
      },
    ],
  },
  {
    category: 'React 18 주요 기능',
    color: '#00ba7c',
    items: [
      {
        name: 'useTransition',
        icon: '🔄',
        description: '비긴급 상태 업데이트를 표시하여 UI 반응성 향상. 포스트 작성/좋아요/리트윗에 사용',
        badge: 'Concurrent',
      },
      {
        name: 'createRoot',
        icon: '🌱',
        description: 'React 18의 새로운 루트 API로 Concurrent 모드 활성화',
        badge: 'New API',
      },
      {
        name: 'Automatic Batching',
        icon: '📦',
        description: '여러 상태 업데이트를 자동으로 일괄 처리하여 리렌더링 최소화',
        badge: 'Auto',
      },
    ],
  },
  {
    category: 'React 패턴',
    color: '#ff7a00',
    items: [
      {
        name: 'Custom Hooks',
        icon: '🪝',
        description: 'usePosts 훅으로 포스트 상태 로직 분리 및 재사용',
        badge: 'usePosts',
      },
      {
        name: 'useCallback',
        icon: '🎯',
        description: '함수 메모이제이션으로 불필요한 리렌더링 방지',
        badge: 'Memo',
      },
      {
        name: 'useState',
        icon: '📊',
        description: '로컬 컴포넌트 상태 관리',
        badge: 'State',
      },
    ],
  },
];

export function SkillsPage() {
  return (
    <main className="feed">
      <div className="feed-header">
        <h2>사용 기술 ⚡</h2>
      </div>

      <div className="skills-container">
        <div className="skills-hero">
          <div className="skills-hero-icon">⚛️</div>
          <h1>React 18 X 클론</h1>
          <p>React Tokyo フェス Vibecording Race 출품작</p>
          <div className="skills-badges">
            <span className="badge react">React 18</span>
            <span className="badge ts">TypeScript</span>
            <span className="badge vite">Vite</span>
          </div>
        </div>

        {skills.map(category => (
          <section key={category.category} className="skills-section">
            <h3 className="skills-category-title" style={{ color: category.color }}>
              {category.category}
            </h3>
            <div className="skills-grid">
              {category.items.map(skill => (
                <div key={skill.name} className="skill-card">
                  <div className="skill-card-header">
                    <span className="skill-icon">{skill.icon}</span>
                    <span className="skill-badge" style={{ backgroundColor: category.color }}>
                      {skill.badge}
                    </span>
                  </div>
                  <h4 className="skill-name">{skill.name}</h4>
                  <p className="skill-desc">{skill.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="skills-footer">
          <p>🏆 이 앱은 React 18의 Concurrent 기능을 활용하여</p>
          <p>더 나은 사용자 경험을 제공합니다</p>
        </div>
      </div>
    </main>
  );
}
