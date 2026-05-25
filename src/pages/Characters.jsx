import { useNavigate } from 'react-router-dom'

export default function Characters() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex flex-col items-center justify-center px-5">

      <p className="text-[10px] tracking-widest text-[#d4758c] uppercase mb-8">캐릭터 선택</p>
      <h2 className="text-xl font-light mb-2 text-center" style={{fontFamily: 'serif'}}>누구와 이야기할까요?</h2>
      <p className="text-[12px] text-[#5c5860] mb-10 text-center">오늘의 상대를 선택해줘요</p>

      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* 서아 — 활성 */}
        <button
          onClick={() => navigate('/chat')}
          className="w-full bg-[#13131a] border border-[#d4758c33] rounded-2xl p-5 text-left hover:border-[#d4758c66] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c4788f] to-[#8a5a6e] flex items-center justify-center text-lg font-medium shrink-0">서</div>
            <div className="flex-1">
              <p className="text-[14px] font-medium mb-0.5">서아</p>
              <p className="text-[11px] text-[#5c5860]">차분하고 다정한 동갑 친구</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-[#d4758c] bg-[#d4758c11] px-2 py-0.5 rounded-full">Day 1</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {['위로', '안정감', '조용한 설렘'].map(tag => (
              <span key={tag} className="text-[10px] text-[#5c5860] bg-[#1a1a24] px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </button>

        {/* 하린 — 준비 중 */}
        <div className="w-full bg-[#13131a] border border-white/5 rounded-2xl p-5 opacity-40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1a1a24] flex items-center justify-center text-lg">🔒</div>
            <div className="flex-1">
              <p className="text-[14px] font-medium mb-0.5">하린</p>
              <p className="text-[11px] text-[#5c5860]">장난기 많은 직장 동료</p>
            </div>
            <span className="text-[10px] text-[#5c5860] bg-[#1a1a24] px-2 py-0.5 rounded-full">준비 중</span>
          </div>
        </div>

        {/* 유나 — 준비 중 */}
        <div className="w-full bg-[#13131a] border border-white/5 rounded-2xl p-5 opacity-40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1a1a24] flex items-center justify-center text-lg">🔒</div>
            <div className="flex-1">
              <p className="text-[14px] font-medium mb-0.5">유나</p>
              <p className="text-[11px] text-[#5c5860]">무심하지만 은근히 챙기는 선배</p>
            </div>
            <span className="text-[10px] text-[#5c5860] bg-[#1a1a24] px-2 py-0.5 rounded-full">준비 중</span>
          </div>
        </div>

      </div>
    </div>
  )
}