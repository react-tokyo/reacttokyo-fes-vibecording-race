import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface PostComposerProps {
  onPost: (content: string) => Promise<void>;
}

const MAX_CHARS = 280;

export function PostComposer({ onPost }: PostComposerProps) {
  const { currentUser } = useApp();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const remaining = MAX_CHARS - content.length;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining <= 20;
  const canPost = content.trim().length > 0 && !isOverLimit && !isSubmitting;

  const handleSubmit = async () => {
    if (!canPost) return;
    setIsSubmitting(true);
    try {
      await onPost(content);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="composer">
      <div className="composer-inner">
        <span className="avatar large">{currentUser?.avatar ?? '🧑‍💻'}</span>
        <div className="composer-right">
          <textarea
            className="composer-textarea"
            placeholder="무슨 일이 일어나고 있나요?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          <div className="composer-actions">
            <div className="composer-tools">
              <button className="tool-btn" title="이미지">🖼️</button>
              <button className="tool-btn" title="GIF">GIF</button>
              <button className="tool-btn" title="이모지">😊</button>
            </div>
            <div className="composer-right-actions">
              {content.length > 0 && (
                <span
                  className={`char-count ${isNearLimit ? 'near-limit' : ''} ${isOverLimit ? 'over-limit' : ''}`}
                >
                  {remaining}
                </span>
              )}
              <button className="submit-btn" onClick={handleSubmit} disabled={!canPost}>
                {isSubmitting ? '전송 중...' : '포스트'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
