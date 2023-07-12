'use client'

import {
  ReactNode,
  useState,
  createContext,
  useContext,
  useEffect,
} from 'react'

export type Achievements = Record<string, boolean>

interface AchievementsContextType {
  achievements: Achievements
  setAchievement: (id: string, achieved: boolean) => void
}

const AchievementsContext = createContext<AchievementsContextType>({
  achievements: {},
  setAchievement: () => {},
})

export interface AchievementsProviderProps {
  children: ReactNode
}

const LOCALSTORAGE_KEY = 'achievements'

export function AchievementsProvider({ children }: AchievementsProviderProps) {
  const [achievements, setAchievements] = useState<Achievements>({})

  useEffect(() => {
    const storedAchievements = window.localStorage.getItem(LOCALSTORAGE_KEY)
    if (storedAchievements != null) {
      setAchievements(JSON.parse(storedAchievements))
    }
  }, [])

  const setAchievement = (id: string, achieved: boolean) => {
    const newAchievements = {
      ...achievements,
      [id]: achieved,
    }
    setAchievements(newAchievements)
    window.localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify(newAchievements)
    )
  }

  return (
    <AchievementsContext.Provider value={{ achievements: achievements, setAchievement: setAchievement }}>
      {children}
    </AchievementsContext.Provider>
  )
}

export function useAchievement(id: string) {
  const { achievements, setAchievement } = useContext(AchievementsContext)

  const achieved = achievements[id]
  const set = (achieved: boolean) => setAchievement(id, achieved)

  return [achieved, set] as const
}
