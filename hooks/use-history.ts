"use client"

import { useState, useCallback } from "react"

export function useHistory() {
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const push = useCallback(
    (state: string) => {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), state])
      setHistoryIndex((prev) => prev + 1)
    },
    [historyIndex],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      return history[historyIndex - 1]
    }
    return null
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      return history[historyIndex + 1]
    }
    return null
  }, [history, historyIndex])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return { push, undo, redo, canUndo, canRedo }
}
