import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Setup() {
  const navigate = useNavigate()
  const [key, setKey] = useState(localStorage.getItem('openai_key') || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('openai_key', key.trim())
    setSaved(true)
    setTimeout(() => navigate('/'), 1000)
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex flex-col items-center justify-center px-5">
      <p className="text-[10px] tracking-widest text-[#d4758c] uppercase mb-8">설정</p>
      <h2 className="text-xl font-light mb-2 text-center" style={{fontFamily: 'serif'}}>API 키 입력</h2>
      <p className="text-[12px] text-[#5c5860] mb-8 text-center">OpenAI API 키를 입력해줘요</p>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-..."
          className="w-full bg-[#13131a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#5c5860] outline-none focus:border-[#d4758c] transition-all"
        />
        <button
          onClick={handleSave}
          disabled={!key.trim()}
          className="w-full py-4 bg-[#b85c73] text-white rounded-2xl text-[15px] font-medium disabled:opacity-30 hover:bg-[#d4758c] transition-all"
        >
          {saved ? '저장됐어 ✓' : '저장하기'}
        </button>
        <p className="text-[11px] text-[#5c5860] text-center">키는 내 브라우저에만 저장돼. 서버로 전송되지 않아.</p>
      </div>
    </div>
  )
}