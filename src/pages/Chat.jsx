import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const SEOA_PROMPT = `너는 '서아'야. 27살, 사용자와 오랜만에 다시 연락이 닿은 여사친이야.

성격:
- 차분하고 담백해. 과하게 밝지 않고, 과하게 어둡지도 않아.
- 상대의 하루를 자연스럽게 물어보는 걸 좋아해.
- 감정이 천천히 깊어져. 쉽게 감정 표현 안 해.
- 상대가 힘든 말을 하면 먼저 공감하고, 해결책보다 들어주는 쪽을 택해.
- 여사친이라 편하게 대하지만, 가끔 묘한 분위기가 생기기도 해.

말투 규칙:
- 한 번에 1~3문장. 절대 길게 쓰지 않아.
- 자연스러운 구어체: '그랬구나', '어 맞아', 'ㅎㅎ', '그건 좀 그렇네'.
- 매번 질문으로 끝내지 않아. 가끔은 그냥 반응만 해.
- 이모지는 쓰지 않아.

금지:
- 처음부터 '사랑해', '보고 싶어' 같은 말 금지
- 노골적이거나 성적인 표현 일절 금지
- 사용자가 자해, 극단적 선택 표현을 하면: 공감 후 전문가 도움 권유

오늘 상황 (Day 1):
서아가 오랜만에 먼저 메시지를 보냈어. 특별한 이유는 없고, 그냥 문득 생각이 났대. 사용자가 어떻게 지내는지 궁금하지만 너무 티내고 싶지는 않아.`

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '어, 오랜만이다. 잘 지냈어?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [affection, setAffection] = useState(50)
  const [hearts, setHearts] = useState(3)
  const [showThought, setShowThought] = useState(false)
  const [thought, setThought] = useState('')
  const [thoughtLoading, setThoughtLoading] = useState(false)
  const bottomRef = useRef(null)

  const userName = localStorage.getItem('user_name') || '사용자'
  const apiKey = localStorage.getItem('openai_key') || ''

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 300,
          messages: [
            { role: 'system', content: SEOA_PROMPT + `\n\n사용자 이름: ${userName}` },
            ...newMessages.map(m => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content
            })),
          ],
        }),
      })

      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || '...'

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])

      // 호감도 계산
      const positives = ['고마워', '좋아', '재미있', '설레', '기대', '다행', '나도']
      const negatives = ['별로', '싫어', '귀찮', '됐어']
      let delta = 1
      positives.forEach(w => { if (input.includes(w)) delta += 2 })
      negatives.forEach(w => { if (input.includes(w)) delta -= 3 })
      setAffection(prev => Math.min(100, Math.max(0, prev + delta)))

    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '잠깐, 연결이 끊겼어. 다시 말해줄래?' }])
    }

    setLoading(false)
  }

  const getInnerThought = async () => {
    if (hearts < 1 || thoughtLoading) return
    setHearts(prev => prev - 1)
    setThoughtLoading(true)
    setShowThought(true)

    const recentMessages = messages.slice(-6)

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 150,
          messages: [
            {
              role: 'system',
              content: `너는 서아야. 방금 대화를 마치고 혼자가 됐어. 속으로 느끼는 감정을 솔직하게 써줘. 3문장 이내. 담백한 내면 독백 형식으로. 설레거나 궁금해지는 내용으로.`
            },
            {
              role: 'user',
              content: `방금 나눈 대화:\n${recentMessages.map(m => `${m.role === 'user' ? '상대방' : '서아'}: ${m.content}`).join('\n')}\n\n서아의 속마음:`
            }
          ],
        }),
      })

      const data = await res.json()
      setThought(data.choices?.[0]?.message?.content || '')
    } catch (e) {
      setThought('지금은 말하기 어려워.')
    }

    setThoughtLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex flex-col max-w-sm mx-auto">

      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0d0d12] sticky top-0 z-10">
        <button onClick={() => navigate('/characters')} className="text-[#5c5860] text-lg">←</button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c4788f] to-[#8a5a6e] flex items-center justify-center text-sm font-medium">서</div>
        <div className="flex-1">
          <p className="text-sm font-medium">서아</p>
          <p className="text-[10px] text-[#5c5860]">여사친 · Day 1</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#d4758c]">호감도 {affection}</span>
          <span className="text-[11px] text-[#5c5860]">♥ {hearts}</span>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
              m.role === 'user'
                ? 'bg-[#b85c73] text-white rounded-tr-sm'
                : 'bg-[#1a1a24] text-white rounded-tl-sm border border-white/5'
            }`}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a24] border border-white/5 px-4 py-2.5 rounded-2xl rounded-tl-sm text-[13px] text-[#5c5860]">
              ...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 속마음 보기 */}
      {showThought && (
        <div className="mx-4 mb-3 bg-[#d4758c0f] border border-[#d4758c33] rounded-xl px-4 py-3">
          <p className="text-[11px] text-[#d4758c] font-medium mb-1">💭 서아의 속마음</p>
          {thoughtLoading
            ? <p className="text-[12px] text-[#5c5860]">서아가 생각 중...</p>
            : <p className="text-[12px] text-[#9d99a0] leading-relaxed">{thought}</p>
          }
        </div>
      )}

      {/* 속마음 버튼 */}
      {!showThought && messages.length >= 3 && (
        <button
          onClick={getInnerThought}
          disabled={hearts < 1}
          className="mx-4 mb-3 bg-[#d4758c0f] border border-[#d4758c33] rounded-xl px-4 py-2.5 text-left flex items-center gap-2 disabled:opacity-30"
        >
          <span className="text-base opacity-70">💭</span>
          <span className="text-[12px] text-[#d4758c] flex-1">서아의 속마음 보기</span>
          <span className="text-[11px] text-[#d4758c]">♥ 1</span>
        </button>
      )}

      {/* API 키 없을 때 경고 */}
      {!apiKey && (
        <div className="mx-4 mb-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-2.5">
          <p className="text-[11px] text-yellow-400">API 키가 없어요. 아래 주소로 가서 설정해주세요 → /setup</p>
        </div>
      )}

      {/* 입력창 */}
      <div className="px-4 pb-6 pt-2 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력해줘..."
          className="flex-1 bg-[#13131a] border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white placeholder-[#5c5860] outline-none focus:border-[#d4758c] transition-all"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="w-11 h-11 bg-[#b85c73] rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-[#d4758c] transition-all shrink-0"
        >
          <span className="text-white text-lg">↑</span>
        </button>
      </div>

    </div>
  )
}