import { useState, useRef } from 'react'

interface ComposeFormProps {
  /** 投稿ボタン押下時のコールバック（内容を引数で受け取る） */
  onPost: (content: string) => void
}

/**
 * 新規投稿フォームコンポーネント
 * 空欄時はボタンを無効化し、投稿後は入力欄をクリアする
 */
export default function ComposeForm({ onPost }: ComposeFormProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  /** 投稿実行: コンテンツを親に渡してフォームをリセット */
  function handleSubmit() {
    const trimmed = content.trim()
    if (!trimmed) return
    onPost(trimmed)
    setContent('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  /** textarea の高さをコンテンツに合わせて自動調整 */
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)
    // 高さリセット後に scrollHeight を適用してオートリサイズ
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  const isEmpty = content.trim().length === 0

  return (
    <div className="flex gap-3 bg-bg-card border-b border-border-subtle px-4 py-4">
      {/* アバター */}
      <div className="w-10 h-10 rounded-full bg-accent-blue-light flex items-center justify-center text-accent-blue font-semibold text-sm shrink-0">
        田
      </div>

      {/* 入力エリア */}
      <div className="flex-1 min-w-0">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder="いまどうしてる？"
          rows={2}
          className="w-full text-[18px] text-text-primary placeholder-text-tertiary border-none outline-none resize-none bg-transparent leading-relaxed min-h-[60px]"
        />

        {/* 投稿ボタン（右寄せ） */}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSubmit}
            disabled={isEmpty}
            className={`px-8 py-3 rounded-full text-[16px] font-bold transition-all ${
              isEmpty
                ? 'bg-accent-blue/40 text-white cursor-not-allowed'
                : 'bg-accent-blue text-white hover:bg-accent-blue/90'
            }`}
          >
            投稿する
          </button>
        </div>
      </div>
    </div>
  )
}
