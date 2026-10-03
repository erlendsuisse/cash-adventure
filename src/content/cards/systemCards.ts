import type { StoryCard } from '../../engine/types'

export const marketDayCard: StoryCard = {
  id: 'sys_market_day',
  title: 'Market Day',
  body: ['The exchange bell rings. Prices across the harbor shift with the tides of trade.'],
  choices: [{ id: 'ack_market_day', label: 'Continue', effects: [] }],
}
