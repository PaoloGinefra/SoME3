"use client"
import { useEffect } from 'react'
import { AchievementsProvider } from './Achievements/achievements'
import Article from './article.mdx'
import { clarity } from 'react-microsoft-clarity'




export default function Page() {
  useEffect(() => {
    clarity.init("ieoz788qcd")
  })

  return <Article />
}
