import { useNavigate } from 'react-router-dom'

export default function Characters() {
  const navigate = useNavigate()

  const select = (character) => {
    localStorage.setItem('character', character)
    navigate('/name')
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex flex-col items-center justify-center px-5">

      <p className="text-[10px] tracking-widest text-[#d4758c] uppercase mb-8">잠깐, 너랑</p>
      <h2 className="text-xl font-light mb-2 text-center" style={{fontFamily: 'serif'}}>누구와 이야기할까요?</h2>
      <p className="text-[12px] text-[#5c5860] mb-10 text-center">오늘의 상대를 선택해줘요</p>

      <div className="w-full max-w-sm flex flex-col gap-4">

        <button
          onClick={() => select('seoa')}
          className="w-full bg-[#13131a] border border-[#d4758c33] rounded-2xl p-5 text-left hover:border-[#d4758c66] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c4788f] to-[#8a5a6e] flex items-center justify-center text-lg font-medium shrink-0">서</div>
            <div className="flex-1">
              <p className="text-[14px] font-medium mb-0.5">서아</p>
              <p className="text-[11px] text-[#5c5860]">차분하고 다정한 여사친</p>
            </div>
            <span className="text-[10px] text-[#d4758c] bg-[#d4758c11] px-2 py-0.5 rounded-full">호감도 쉬움</span>
          </div>
          <div className="flex gap-2 mt-4">
            {['위로', '안정감', '조용한 설렘'].map(tag => (
              <span key={tag} className="text-[10px] text-[#5c5860] bg-[#1a1a24] px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </button>

        <button
          onClick={() => select('hyejeong')}
          className="w-full bg-[#13131a] border border-[#4a6fa533] rounded-2xl p-5 text-left hover:border-[#4a6fa566] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4a6fa5] to-[#2d4a7a] flex items-center justify-center text-lg font-medium shrink-0">혜</div>
            <div className="flex-1">
              <p className="text-[14px] font-medium mb-0.5">혜정</p>
              <p className="text-[11px] text-[#5c5860]">독설가 여사친. 호감 얻기 매우 어려움</p>
            </div>
            <span className="text-[10px] text-[#4a6fa5] bg-[#4a6fa511] px-2 py-0.5 rounded-full">호감도 어려움</span>
          </div>
          <div className="flex gap-2 mt-4">
            {['독설', '까칠함', '숨겨진 빈틈'].map(tag => (
              <span key={tag} className="text-[10px] text-[#5c5860] bg-[#1a1a24] px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </button>

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