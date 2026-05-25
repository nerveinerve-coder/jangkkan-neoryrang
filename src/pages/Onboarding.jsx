import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [tone, setTone] = useState('')

  const tones = [
    { id: 'casual', label: '편한 말투', desc: '친구처럼 편하게' },
    { id: 'sweet', label: '달달한 말투', desc: '조금 더 가깝게' },
    { id: 'formal', label: '격식 있는 말투', desc: '차분하고 정중하게' },
  ]

  const handleStart = () => {
    localStorage.setItem('user_name', name)
    localStorage.setItem('user_tone', tone)
    navigate('/characters')
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex flex-col items-center justify-center px-5">

      {/* 상단 */}
      <p className="text-[10px] tracking-widest text-[#d4758c] uppercase mb-8">잠깐, 너랑</p>

      {step === 1 && (
        <div className="w-full max-w-sm flex flex-col items-center">
          <h2 className="text-xl font-light mb-2 text-center" style={{fontFamily: 'serif'}}>어떻게 불러드릴까요?</h2>
          <p className="text-[12px] text-[#5c5860] mb-8 text-center">서아가 당신을 부를 이름이에요</p>

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="이름을 입력해줘"
            maxLength={10}
            className="w-full bg-[#13131a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#5c5860] outline-none focus:border-[#d4758c] transition-all mb-6"
          />

          <button
            onClick={() => setStep(2)}
            disabled={!name.trim()}
            className="w-full py-4 bg-[#b85c73] text-white rounded-2xl text-[15px] font-medium disabled:opacity-30 hover:bg-[#d4758c] transition-all"
          >
            다음
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-sm flex flex-col items-center">
          <h2 className="text-xl font-light mb-2 text-center" style={{fontFamily: 'serif'}}>어떤 분위기를 원하세요?</h2>
          <p className="text-[12px] text-[#5c5860] mb-8 text-center">서아의 말투를 선택해줘요</p>

          <div className="w-full flex flex-col gap-3 mb-8">
            {tones.map(t => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`w-full px-4 py-4 rounded-xl border text-left transition-all ${
                  tone === t.id
                    ? 'border-[#d4758c] bg-[#d4758c11]'
                    : 'border-white/10 bg-[#13131a]'
                }`}
              >
                <p className={`text-[13px] font-medium mb-0.5 ${tone === t.id ? 'text-[#d4758c]' : 'text-white'}`}>{t.label}</p>
                <p className="text-[11px] text-[#5c5860]">{t.desc}</p>
              </button>
            ))}
          </div>

          <button
            onClick={handleStart}
            disabled={!tone}
            className="w-full py-4 bg-[#b85c73] text-white rounded-2xl text-[15px] font-medium disabled:opacity-30 hover:bg-[#d4758c] transition-all"
          >
            시작하기
          </button>
        </div>
      )}

    </div>
  )
}