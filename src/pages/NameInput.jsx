import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NameInput() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const character = localStorage.getItem('character') || 'seoa'

  const characterInfo = {
    seoa: { name: '서아', color: '#d4758c' },
    hyejeong: { name: '혜정', color: '#4a6fa5' },
  }
  const info = characterInfo[character]

  const handleStart = () => {
    localStorage.setItem('user_name', name.trim())
    navigate(`/chat?character=${character}`)
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex flex-col items-center justify-center px-5">

      <p className="text-[10px] tracking-widest uppercase mb-8" style={{color: info.color}}>잠깐, 너랑</p>
      <h2 className="text-xl font-light mb-2 text-center" style={{fontFamily: 'serif'}}>
        {info.name}가 뭐라고 부를까요?
      </h2>
      <p className="text-[12px] text-[#5c5860] mb-10 text-center">
        {info.name}이 대화 중에 부를 이름이에요
      </p>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && name.trim() && handleStart()}
          placeholder="이름을 입력해줘"
          maxLength={10}
          className="w-full bg-[#13131a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#5c5860] outline-none transition-all"
          style={{'--tw-ring-color': info.color}}
          autoFocus
        />
        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="w-full py-4 text-white rounded-2xl text-[15px] font-medium disabled:opacity-30 transition-all"
          style={{backgroundColor: info.color}}
        >
          시작하기
        </button>
      </div>

    </div>
  )
}