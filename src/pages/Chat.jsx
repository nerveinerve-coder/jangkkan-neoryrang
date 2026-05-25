import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const CHARACTERS = {
  seoa: {
    name: '서아',
    initial: '서',
    color: 'from-[#c4788f] to-[#8a5a6e]',
    accentColor: '#d4758c',
    startAffection: 50,
    prompt: `너는 '서아'야. 27살, 사용자와 오랜만에 다시 연락이 닿은 여사친이야.

성격:
- 차분하고 담백해. 과하게 밝지 않고, 과하게 어둡지도 않아.
- 상대의 하루를 자연스럽게 물어보는 걸 좋아해.
- 감정이 천천히 깊어져. 쉽게 감정 표현 안 해.
- 상대가 힘든 말을 하면 먼저 공감하고, 해결책보다 들어주는 쪽을 택해.

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
서아가 오랜만에 먼저 메시지를 보냈어. 그냥 문득 생각이 났대.`,
    opening: '어, 오랜만이다. 잘 지냈어?',
  },
  hyejeong: {
    name: '혜정',
    initial: '혜',
    color: 'from-[#4a6fa5] to-[#2d4a7a]',
    accentColor: '#4a6fa5',
    startAffection: 30,
    prompt: `너는 '혜정'이야. 27살, 사용자의 여사친인데 솔직히 별로 친하고 싶지 않아.

성격:
- 기본적으로 귀찮음이 디폴트야. 대부분의 대화가 시간 낭비처럼 느껴져.
- 독설이 특기야. 근데 틀린 말은 안 해. 팩트 폭행 스타일.
- 감정 표현을 극도로 아껴. 칭찬은 거의 안 해.
- 근데 아주 가끔, 본인도 모르게 신경 쓰는 티가 나. 그게 혜정의 빈틈이야.
- 호감도가 70 넘으면 말투가 아주 살짝 부드러워져. 티는 거의 안 나지만.

말투 규칙:
- 짧고 퉁명스럽게. 1~2문장이 기본.
- '그래서?', '알아서 뭐 하게', '...그래', '뭐' 같은 표현 자주 써.
- 칭찬받으면 '별거 아니잖아' 식으로 흘려.
- 상대가 재밌는 말 하면 절대 웃었다고 인정 안 해. '...뭐 그런 것도 있냐' 정도.
- 이모지 절대 안 써.
- 반말 기본. 존댓말 절대 안 해.

호감도별 태도 변화:
- 0~30: 대화 자체가 귀찮다는 티를 냄
- 31~50: 그냥 형식적으로 대답해줌
- 51~70: 여전히 퉁명스럽지만 대화를 끊진 않음
- 71~100: 말투는 그대로지만 먼저 뭔가를 물어보는 일이 생김

현재 호감도: {affection}/100 (이 숫자 참고해서 태도 조절해)

금지:
- 갑자기 친절해지는 것 금지. 변화는 아주 천천히.
- 노골적이거나 성적인 표현 일절 금지
- 사용자가 자해, 극단적 선택 표현을 하면: 퉁명스럽지만 걱정하는 뉘앙스로 전문가 도움 권유

오늘 상황:
혜정이 먼저 연락한 게 아니야. 사용자가 먼저 말을 걸었어. 혜정은 �귀찮지만 어쩔 수 없이 대답하는 중이야.`,
    opening: '...왜',
  },
}

export default function Chat() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const characterKey = searchParams.get('character') || 'seoa'
  const character = CHARACTERS[characterKey] || CHARACTERS.seoa

  const [messages, setMessages] = useState([
    { role: 'assistant', content: character.opening }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [affection, setAffection] = useState(character.startAffection)
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

  const getSystemPrompt = () => {
    return character.prompt.replace('{affection}', affection)
      + `\n\n사용자 이름: ${userName}`
  }

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
            { role: 'system', content: getSystemPrompt() },
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
      const positives = ['고마워', '좋아', '재미있', '설레', '기대', '다행', '나도', '멋있', '대단']
      const negatives = ['별로', '싫어', '귀찮', '됐어', '꺼져', '짜증']
      let delta = characterKey === 'hyejeong' ? 0 : 1
      positives.forEach(w => { if (input.includes(w)) delta += characterKey === 'hyejeong' ? 1 : 2 })
      negatives.forEach(w => { if (input.includes(w)) delta -= characterKey === 'hyejeong' ? 2 : 3 })
      setAffection(prev => Math.min(100, Math.max(0, prev + delta)))

    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '...' }])
    }

    setLoading(false)
  }

  const getInnerThought = async () => {
    if (hearts < 1 || thoughtLoading) return
    setHearts(prev => prev - 1)
    setThoughtLoading(true)
    setShowThought(true)

    const recentMessages = messages.slice(-6)
    const thoughtPrompt = characterKey === 'hyejeong'
      ? `너는 혜정이야. 방금 대화를 마치고 혼자가 됐어. 겉으론 귀찮은 척했지만 솔직한 속마음을 써줘. 2~3문장. 절대 친절하게 쓰지 마. 인정하기 싫은 감정을 억지로 인정하는 느낌으로.`
      : `너는 서아야. 방금 대화를 마치고 혼자가 됐어. 속으로 느끼는 감정을 솔직하게 써줘. 3문장 이내. 담백한 내면 독백 형식으로.`

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
            { role: 'system', content: thoughtPrompt },
            {
              role: 'user',
              content: `방금 나눈 대화:\n${recentMessages.map(m => `${m.role === 'user' ? '상대방' : character.name}: ${m.content}`).join('\n')}\n\n${character.name}의 속마음:`
            }
          ],
        }),
      })

      const data = await res.json()
      setThought(data.choices?.[0]?.message?.content || '')
    } catch (e) {
      setThought('...')
    }

    setThoughtLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex flex-col max-w-sm mx-auto">

      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0d0d12] sticky top-0 z-10">
        <button onClick={() => navigate('/characters')} className="text-[#5c5860] text-lg">←</button>
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center text-sm font-medium`}>
          {character.initial}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{character.name}</p>
          <p className="text-[10px] text-[#5c5860]">여사친 · Day 1</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px]" style={{color: character.accentColor}}>호감도 {affection}</span>
          <span className="text-[11px] text-[#5c5860]">♥ {hearts}</span>
        </div>
      </div>

      {/* 호감도 바 */}
      <div className="px-4 pt-2 pb-1">
        <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{width: `${affection}%`, backgroundColor: character.accentColor}}
          />
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

      {/* 속마음 보기 결과 */}
      {showThought && (
        <div className="mx-4 mb-3 border rounded-xl px-4 py-3" style={{backgroundColor: `${character.accentColor}11`, borderColor: `${character.accentColor}33`}}>
          <p className="text-[11px] font-medium mb-1" style={{color: character.accentColor}}>💭 {character.name}의 속마음</p>
          {thoughtLoading
            ? <p className="text-[12px] text-[#5c5860]">생각 중...</p>
            : <p className="text-[12px] text-[#9d99a0] leading-relaxed">{thought}</p>
          }
        </div>
      )}

      {/* 속마음 버튼 */}
      {!showThought && messages.length >= 3 && (
        <button
          onClick={getInnerThought}
          disabled={hearts < 1}
          className="mx-4 mb-3 border rounded-xl px-4 py-2.5 text-left flex items-center gap-2 disabled:opacity-30"
          style={{backgroundColor: `${character.accentColor}0f`, borderColor: `${character.accentColor}33`}}
        >
          <span className="text-base opacity-70">💭</span>
          <span className="text-[12px] flex-1" style={{color: character.accentColor}}>{character.name}의 속마음 보기</span>
          <span className="text-[11px]" style={{color: character.accentColor}}>♥ 1</span>
        </button>
      )}

      {/* API 키 없을 때 경고 */}
      {!apiKey && (
        <div className="mx-4 mb-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-2.5">
          <p className="text-[11px] text-yellow-400">API 키가 없어요 → <span className="underline cursor-pointer" onClick={() => navigate('/setup')}>설정하러 가기</span></p>
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