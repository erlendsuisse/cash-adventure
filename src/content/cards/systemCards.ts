import type { StoryCard } from '../../engine/types'

export const marketDayCard: StoryCard = {
  id: 'sys_market_day',
  title: 'Market Day',
  body: ['Clang, clang! The exchange bell rings across the harbour. Market day! Prices shift with the tides of trade.'],
  choices: [{ id: 'ack_market_day', label: 'See the new prices', effects: [] }],
}
