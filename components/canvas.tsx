"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface CanvasProps {
  htmlContent: string
  selectedElement: HTMLElement | null
  onSelectElement: (element: HTMLElement | null) => void
  onStateChange?: () => void
}

export function Canvas({ htmlContent, selectedElement, onSelectElement, onStateChange }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

  useEffect(() => {
    if (!canvasRef.current) return

    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, "text/html")

    canvasRef.current.innerHTML = ""

    Array.from(doc.body.children).forEach((child) => {
      const cloned = child.cloneNode(true) as HTMLElement
      canvasRef.current?.appendChild(cloned)
    })

    const addClickHandlers = (element: HTMLElement) => {
      element.addEventListener("click", (e) => {
        e.stopPropagation()
        onSelectElement(element)
      })

      Array.from(element.children).forEach((child) => {
        addClickHandlers(child as HTMLElement)
      })
    }

    Array.from(canvasRef.current.children).forEach((child) => {
      addClickHandlers(child as HTMLElement)
    })
  }, [htmlContent, onSelectElement])

  useEffect(() => {
    if (!selectedElement || !canvasRef.current) return

    canvasRef.current.querySelectorAll("[data-selected]").forEach((el) => {
      el.removeAttribute("data-selected")
    })

    selectedElement.setAttribute("data-selected", "true")
    selectedElement.style.outline = "3px solid #06b6d4"
    selectedElement.style.outlineOffset = "2px"
    selectedElement.style.boxShadow = "0 0 0 1px rgba(6, 182, 212, 0.2)"
  }, [selectedElement])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedElement || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top

    const elementRect = selectedElement.getBoundingClientRect()
    const elementCanvasX = elementRect.left - rect.left
    const elementCanvasY = elementRect.top - rect.top
    const elementWidth = elementRect.width
    const elementHeight = elementRect.height

    const handleSize = 12
    if (
      canvasX > elementCanvasX + elementWidth - handleSize &&
      canvasX < elementCanvasX + elementWidth + 4 &&
      canvasY > elementCanvasY + elementHeight - handleSize &&
      canvasY < elementCanvasY + elementHeight + 4
    ) {
      setIsResizing(true)
      setResizeStart({
        x: canvasX,
        y: canvasY,
        width: elementWidth,
        height: elementHeight,
      })
      e.preventDefault()
      return
    }

    setIsDragging(true)
    setDragOffset({
      x: canvasX - elementCanvasX,
      y: canvasY - elementCanvasY,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current || !selectedElement) return

    const rect = canvasRef.current.getBoundingClientRect()
    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top

    if (isResizing) {
      const deltaX = canvasX - resizeStart.x
      const deltaY = canvasY - resizeStart.y
      const newWidth = Math.max(50, resizeStart.width + deltaX)
      const newHeight = Math.max(50, resizeStart.height + deltaY)

      selectedElement.style.width = `${newWidth}px`
      selectedElement.style.height = `${newHeight}px`
    } else if (isDragging) {
      selectedElement.style.position = "absolute"
      selectedElement.style.left = `${canvasX - dragOffset.x}px`
      selectedElement.style.top = `${canvasY - dragOffset.y}px`
    }
  }

  const handleMouseUp = () => {
    if ((isDragging || isResizing) && onStateChange) {
      onStateChange()
    }
    setIsDragging(false)
    setIsResizing(false)
  }

  return (
    <div
      ref={canvasRef}
      data-canvas
      className={cn(
        "relative w-full max-w-[720px] aspect-square bg-black border-2 border-border overflow-hidden",
        "shadow-2xl cursor-pointer rounded-xl transition-all",
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ userSelect: "none" }}
    />
  )
}
