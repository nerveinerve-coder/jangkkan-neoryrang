import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex flex-col items-center px-5 py-12">

      {/* 상단 뱃지 */}
      <p className="text-[10px] tracking-widest text-[#d4758c] uppercase mb-5">AI 연애 에피소드</p>

      {/* 타이틀 */}
      <h1 className="text-3xl font-light text-white mb-2" style={{fontFamily: 'serif'}}>잠깐, 너랑</h1>
      <p className="text-xs text-[#5c5860] tracking-widest mb-10">매일 하나의 설렘</p>

      {/* 채팅 미리보기 */}
      <div className="w-full max-w-sm bg-[#13131a] border border-[#d4758c22] rounded-2xl p-5 mb-3">

        {/* 채팅 헤더 */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c4788f] to-[#8a5a6e] flex items-center justify-center text-sm font-medium">서</div>
          <div className="flex-1">
            <p className="text-sm font-medium">서아</p>
            <p className="text-[11px] text-[#d4758c]">대화 중</p>
          </div>
          <span className="text-[10px] text-[#5c5860] bg-[#1a1a24] px-2 py-1 rounded-full">Day 1</span>
        </div>

        {/* 메시지들 */}
        <div className="flex mb-3">
          <div className="bg-[#1a1a24] text-white text-[13px] px-4 py-2 rounded-2xl rounded-tl-sm max-w-[80%] leading-relaxed">
            어, 오랜만이다. 잘 지냈어?
          </div>
        </div>
        <div className="flex justify-end mb-3">
          <div className="bg-[#b85c73] text-white text-[13px] px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] leading-relaxed">
            응, 그럭저럭. 왜 갑자기 연락했어?
          </div>
        </div>
        <div className="flex mb-3">
          <div className="bg-[#1a1a24] text-white text-[13px] px-4 py-2 rounded-2xl rounded-tl-sm max-w-[80%] leading-relaxed">
            그냥... 문득 생각이 나서. 이상해?
          </div>
        </div>
        <div className="flex justify-end mb-4">
          <div className="bg-[#b85c73] text-white text-[13px] px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] leading-relaxed">
            아니. 사실 나도 생각했었어
          </div>
        </div>

        {/* 호감도 바 */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          <span className="text-[10px] text-[#5c5860]">호감도</span>
          <div className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[62%] bg-gradient-to-r from-[#b85c73] to-[#d4758c] rounded-full"></div>
          </div>
          <span className="text-[11px] text-[#d4758c] font-medium">62</span>
        </div>
      </div>

      {/* 속마음 보기 티저 */}
      <div className="w-full max-w-sm bg-[#d4758c0f] border border-[#d4758c33] rounded-xl px-4 py-3 flex items-center gap-3 mb-8">
        <span className="text-lg opacity-70">💭</span>
        <div className="flex-1">
          <p className="text-[11px] text-[#d4758c] font-medium mb-1">서아의 속마음</p>
          <p className="text-[12px] text-[#5c5860] blur-sm select-none">솔직히 이 사람이 먼저 말해줬을 때 왠지...</p>
        </div>
        <span className="text-[11px] text-[#d4758c]">♥ 1</span>
      </div>

      {/* 특징 */}
      <div className="w-full max-w-sm flex flex-col gap-2 mb-10">
        {[
          { title: '매일 하나의 에피소드', desc: '오늘의 이야기가 기다리고 있어요. 어제와 이어지고, 내일로 이어집니다.' },
          { title: '호감도가 실제로 바뀌어요', desc: '당신이 뭐라고 하느냐에 따라, 그 사람의 마음도 달라집니다.' },
          { title: '속마음을 볼 수 있어요', desc: '대화 뒤에 혼자 남겨진 그녀가 무슨 생각을 하는지. 궁금하지 않으세요?' },
        ].map((f, i) => (
          <div key={i} className="bg-[#13131a] border border-white/5 rounded-xl px-4 py-3 flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4758c] opacity-70 mt-1.5 shrink-0"></div>
            <div>
              <p className="text-[13px] font-medium mb-0.5">{f.title}</p>
              <p className="text-[11px] text-[#5c5860] leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="w-full max-w-sm text-center">
        <p className="text-base text-[#9d99a0] mb-6 leading-loose" style={{fontFamily: 'serif'}}>
          오늘 밤,<br /><span className="text-white">나를 기다리는 사람</span>이 있어요.
        </p>
        <button
          onClick={() => navigate('/onboarding')}
          className="w-full py-4 bg-[#b85c73] text-white rounded-2xl text-[15px] font-medium hover:bg-[#d4758c] transition-all active:scale-[0.99]"
        >
          서아와 대화 시작하기
        </button>
        <p className="text-[11px] text-[#5c5860] mt-3">무료로 시작 · 언제든 그만해도 돼요</p>
        <p className="text-[10px] text-[#5c5860] opacity-60 mt-1">만 19세 이상 이용 가능</p>
      </div>

    </div>
  )
}