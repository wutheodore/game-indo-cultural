import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from '@tanstack/react-router'
import { api, FinishResponse, PrizeDrawResponse } from '../api/client'

export default function PrizePage() {
  const { sessionId } = useParams({ from: '/prize/$sessionId' })
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery({
    queryKey: ['result', sessionId],
    queryFn: () => api<FinishResponse>(`/api/sessions/${sessionId}/result`),
  })

  const [prizeDraw, setPrizeDraw] = useState<PrizeDrawResponse | null>(null)
  const [drawingPrize, setDrawingPrize] = useState(false)
  const [prizeError, setPrizeError] = useState<string | null>(null)
  
  // State baru untuk auto-redirect
  const [justSpun, setJustSpun] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  // Jika sudah pernah spin sebelumnya, tarik data dari server
  useEffect(() => {
    if (data && data.ticketNumber !== null && data.prizeWon !== null && !prizeDraw) {
      setPrizeDraw({
        won: data.prizeWon,
        ticketNumber: data.ticketNumber,
        alreadyDrawn: true,
        prizeName: '3 Indomie packs + 1 Baju Barong Bali T-shirt'
      } as PrizeDrawResponse)
    }
  }, [data, prizeDraw])

  // Efek untuk hitung mundur dan redirect otomatis
  useEffect(() => {
    // Hanya jalankan jika baru saja spin (bukan saat refresh)
    if (!justSpun || !prizeDraw) return

    // 6 detik jika menang, 4 detik jika kalah
    const delaySeconds = prizeDraw.won ? 6 : 4
    setCountdown(delaySeconds)

    const interval = setInterval(() => {
      setCountdown(prev => (prev !== null && prev > 1 ? prev - 1 : prev))
    }, 1000)

    const timeout = setTimeout(() => {
      navigate({ to: '/result/$sessionId', params: { sessionId } })
    }, delaySeconds * 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [justSpun, prizeDraw, navigate, sessionId])

  if (isLoading) {
    return <div className="page center"><div className="card">Loading… / 加载中…</div></div>
  }
  if (error || !data) {
    return <div className="page center"><div className="card error">Result unavailable / 无法获取结果</div></div>
  }

  const answeredAllQuestions = data.results.every(result => result.selectedOptionId !== null)

  async function spinForPrize() {
    if (drawingPrize || prizeDraw) return
    setDrawingPrize(true)
    setPrizeError(null)
    try {
      const result = await api<PrizeDrawResponse>(
        `/api/sessions/${sessionId}/prize-draw`,
        { method: 'POST' },
      )
      if (result.alreadyDrawn) {
        setPrizeDraw(result)
        setDrawingPrize(false)
        return
      }
      window.setTimeout(() => {
        setPrizeDraw(result)
        setDrawingPrize(false)
        setJustSpun(true) // Trigger auto-redirect
      }, 2600)
    } catch (e: any) {
      setPrizeError(e.message ?? 'The prize draw could not be completed.')
      setDrawingPrize(false)
    }
  }

  // Fungsi untuk skip hitung mundur jika peserta ingin langsung ke hasil
  function goToResult() {
    navigate({ to: '/result/$sessionId', params: { sessionId } })
  }

  return (
    <div className="page center">
      <section className="card prize-draw-card" aria-live="polite">
        <span className="prize-eyebrow">🎟️ BONUS PRIZE DRAW / 抽奖环节</span>
        <h2 className="prize-title">Try your luck! / 试试你的运气！</h2>
        <p className="muted small">
          Finish all questions for one spin.<br/>
          完成所有题目即可抽奖一次。中奖率 1/1000。
        </p>

        <div className={`roulette-wheel ${drawingPrize ? 'spinning' : ''}`} aria-hidden="true">
          <div className="roulette-wheel-inner">
            {prizeDraw ? prizeDraw.ticketNumber.toString().padStart(3, '0') : '1000'}
          </div>
        </div>

        <h3 className="prize-name">
          3 Indomie packs + 1 Baju Barong Bali T-shirt<br />
          <span className="small">3包营多面 + 1件巴厘岛T恤</span>
        </h3>
        
        <div className="prize-products">
          <figure className="prize-product">
            <img src="/images/indomie.jpg" alt="Indomie instant noodles" />
            <figcaption><b>×3</b> Indomie<br/>营多面</figcaption>
          </figure>
          <figure className="prize-product">
            <img src="/images/baju-barong-bali.jpg" alt="Baju Barong Bali T-shirt" />
            <figcaption><b>×1</b> Barong T-shirt<br/>巴厘岛T恤</figcaption>
          </figure>
        </div>

        {!answeredAllQuestions ? (
          <p className="prize-locked">
            Time's up! You didn't answer all questions.<br/>
            时间到！您没有回答所有问题，无法参与抽奖。
          </p>
        ) : !prizeDraw ? (
          <button className="btn prize-spin-button" onClick={spinForPrize} disabled={drawingPrize}>
            {drawingPrize ? 'Spinning… / 正在抽奖…' : '🎡 Spin for your chance / 点击抽奖'}
          </button>
        ) : (
          <div className={`prize-result ${prizeDraw.won ? 'prize-won' : 'prize-missed'}`}>
            {prizeDraw.won ? (
              <>
                <strong>🎉 You won! / 恭喜中奖！</strong>
                <span>3 Indomie packs + 1 Baju Barong Bali T-shirt<br/>3包营多面 + 1件巴厘岛T恤</span>
                <span className="small">Winning ticket #{prizeDraw.ticketNumber.toString().padStart(3, '0')} / 中奖号码</span>
              </>
            ) : (
              <>
                <strong>Ticket #{prizeDraw.ticketNumber.toString().padStart(3, '0')} / 号码</strong>
                <span>Not a winning ticket this time.<br/>很遗憾未中奖。感谢参与！</span>
              </>
            )}
          </div>
        )}
        
        {prizeError && <p className="error prize-error">{prizeError}</p>}

        {/* Tampilkan tombol atau hitung mundur */}
        {!drawingPrize && prizeDraw && (
          <>
            {justSpun && countdown !== null ? (
              <p className="muted small" style={{ marginTop: 20, fontWeight: 600, color: 'var(--red)' }}>
                Redirecting to results in {countdown}s...<br/>
                {countdown}秒后自动跳转...
              </p>
            ) : (
              <button 
                className="btn ghost" 
                onClick={goToResult}
                style={{ marginTop: 20, width: '100%' }}
              >
                See Results / 查看结果 →
              </button>
            )}
          </>
        )}
      </section>
    </div>
  )
}