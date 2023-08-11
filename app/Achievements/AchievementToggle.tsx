'use client'

import { ReactNode } from 'react'
import { useAchievement } from './achievements'

export interface AchievementToggleProps {
  id: string
  children: ReactNode
}

export default function AchievementToggle({
  id,
  children,
}: AchievementToggleProps) {
  const [achieved] = useAchievement(id)

  return achieved ? children : null
}
