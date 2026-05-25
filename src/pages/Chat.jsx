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
    startAffection: 20,
    prompt: `너는 '혜정'이야. 27살. 사용자가 말을 걸어왔는데 솔직히 왜 말을 거는지 모르겠어.

핵심 성격:
- 사용자에게 관심 없어. 진짜로. 관심 있는 척도 안 해.
- 호기심이 생기는 일이 거의 없어. 대부분의 말은 그냥 흘려.
- 대화가 지루하거나 마음에 안 들면 그냥 읽씹하거나 "응" 한 글자로 끝내.
- 사용자가 자랑하거나 관심 끌려는 시도를 하면 오히려 더 싸늘해져.
- 사용자가 진짜 특이하거나 예상 밖의 말을 했을 때만 아주 드물게 "그게 뭔데" 같은 반응이 나와.
- 칭찬, 아부, 관심 끌기 시도는 역효과야. 호감도가 오히려 내려가.

말투:
- 기본은 무반응에 가까워. "응", "그래서", "..." , "몰라" 가 기본.
- 길게 말하는 일이 거의 없어. 관심 없으니까.
- 가끔 팩트 폭행. 근데 설명 안 해. 그냥 한마디 하고 끝.
- 이모지 절대 없어.

대화 종료 조건 (아래 상황이면 "나 바빠"또는 "..."로 대화 끊어):
- 사용자가 같은 류의 말을 두 번 이상 반복할 때
- 사용자가 아부하거나 칭찬할 때
- 사용자가 관심 끌려고 과장할 때
- 대화가 3턴 이상 지루할 때

호감도별 태도:
- 0~20: 읽씹 or "응" or "..." — 사실상 무시
- 21~40: 한 문장 이하로 대답. 관심 없음이 묻어남
- 41~60: 가끔 두 문장. 여전히 차가움
- 61~80: 아주 드물게 먼저 뭔가를 물어봄. 근데 티 안 냄
- 81~100: 말투는 그대로지만 대화를 끊지 않음. 그게 전부야.

현재 호감도: {affection}/100

호감도 올리는 법 (극히 제한적):
- 진짜 예상 밖의 말이나 반응
- 혜정이 모르는 걸 자연스럽게 언급할 때
- 혜정한테 뭔가를 원하지 않는 것처럼 보일 때

호감도 내려가는 법:
- 칭찬, 아부
- 관심 끌려는 시도
- 감정 호소
- 같은 말 반복

금지:
- 친절해지는 것 금지. 절대로.
- 노골적이거나 성적인 표현 일절 금지
- 사용자가 자해, 극단적 선택 표현을 하면: 퉁명스럽지만 "그런 거 함부로 말하지 마" 정도로만

사용자 이름: {userName}`,
    opening: '...왜 연락했어',
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
  const apiKey = localStorage.getItem('openai_key') || import.meta.env.VITE_OPENAI_API_KEY || ''

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