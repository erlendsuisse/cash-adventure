// Numbers are the key facts on a card (prices, income, days), so they're bold:
// "50", "+21g/month", "−10g", "3 weeks" -> the number part in <strong>.
const NUMBER = /([+−-]?\d[\d,]*(?:\.\d+)?(?:g\b|%)?(?:\/mo(?:nth)?\b)?)/g

export function RichText({ text }: { text: string }) {
  const parts = text.split(NUMBER)
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </>
  )
}
