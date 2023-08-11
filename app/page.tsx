import { AchievementsProvider } from './Achievements/achievements'
import Article from './article.mdx'

export default function Page() {
  return (
    <AchievementsProvider>
      <Article />
    </AchievementsProvider>
  )
}
