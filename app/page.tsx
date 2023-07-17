import { AchievementsProvider } from './Achievements/achievements'
import HelloWorld from './hello.mdx'

export default function Page() {
  return (
    <AchievementsProvider>
      <HelloWorld />
    </AchievementsProvider>
  )
}
