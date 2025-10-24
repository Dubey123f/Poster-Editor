"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Copy, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface PropertiesPanelProps {
  element: HTMLElement | null
  onUpdate: () => void
}

export function PropertiesPanel({ element, onUpdate }: PropertiesPanelProps) {
  const [textContent, setTextContent] = useState("")
  const [fontSize, setFontSize] = useState("16")
  const [fontFamily, setFontFamily] = useState("Arial")
  const [fontWeight, setFontWeight] = useState("400")
  const [color, setColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("transparent")
  const [imageSrc, setImageSrc] = useState("")
  const [width, setWidth] = useState("100")
  const [height, setHeight] = useState("100")
  const [opacity, setOpacity] = useState("1")
  const [textAlign, setTextAlign] = useState("left")
  const [padding, setPadding] = useState("0")
  const [borderRadius, setBorderRadius] = useState("0")

  useEffect(() => {
    if (!element) return

    const styles = window.getComputedStyle(element)

    if (element.tagName === "IMG") {
      setImageSrc(element.getAttribute("src") || "")
    } else {
      setTextContent(element.textContent || "")
    }

    setFontSize(styles.fontSize.replace("px", ""))
    setFontFamily(styles.fontFamily.split(",")[0].replace(/['"]/g, ""))
    setFontWeight(styles.fontWeight)
    setColor(rgbToHex(styles.color))
    setBgColor(styles.backgroundColor === "rgba(0, 0, 0, 0)" ? "transparent" : rgbToHex(styles.backgroundColor))
    setWidth(element.style.width ? element.style.width.replace("px", "") : styles.width.replace("px", ""))
    setHeight(element.style.height ? element.style.height.replace("px", "") : styles.height.replace("px", ""))
    setOpacity(styles.opacity)
    setTextAlign(styles.textAlign)
    setPadding(styles.padding.replace("px", "").split(" ")[0])
    setBorderRadius(styles.borderRadius.replace("px", ""))
  }, [element])

  const rgbToHex = (rgb: string): string => {
    const match = rgb.match(/^rgb$$(\d+),\s*(\d+),\s*(\d+)$$$/)
    if (!match) return "#000000"
    const r = Number.parseInt(match[1]).toString(16).padStart(2, "0")
    const g = Number.parseInt(match[2]).toString(16).padStart(2, "0")
    const b = Number.parseInt(match[3]).toString(16).padStart(2, "0")
    return `#${r}${g}${b}`
  }

  const handleTextChange = (value: string) => {
    setTextContent(value)
    if (element && element.tagName !== "IMG") {
      element.textContent = value
    }
  }

  const handleFontSizeChange = (value: string) => {
    setFontSize(value)
    if (element) {
      element.style.fontSize = `${value}px`
    }
  }

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value)
    if (element) {
      element.style.fontFamily = value
    }
  }

  const handleFontWeightChange = (value: string) => {
    setFontWeight(value)
    if (element) {
      element.style.fontWeight = value
    }
  }

  const handleColorChange = (value: string) => {
    setColor(value)
    if (element) {
      element.style.color = value
    }
  }

  const handleBgColorChange = (value: string) => {
    setBgColor(value)
    if (element) {
      element.style.backgroundColor = value === "transparent" ? "transparent" : value
    }
  }

  const handleImageSrcChange = (value: string) => {
    setImageSrc(value)
    if (element && element.tagName === "IMG") {
      element.setAttribute("src", value)
    }
  }

  const handleWidthChange = (value: string) => {
    setWidth(value)
    if (element) {
      element.style.width = `${value}px`
    }
  }

  const handleHeightChange = (value: string) => {
    setHeight(value)
    if (element) {
      element.style.height = `${value}px`
    }
  }

  const handleOpacityChange = (value: string) => {
    setOpacity(value)
    if (element) {
      element.style.opacity = value
    }
  }

  const handleTextAlignChange = (align: string) => {
    setTextAlign(align)
    if (element) {
      element.style.textAlign = align
    }
  }

  const handlePaddingChange = (value: string) => {
    setPadding(value)
    if (element) {
      element.style.padding = `${value}px`
    }
  }

  const handleBorderRadiusChange = (value: string) => {
    setBorderRadius(value)
    if (element) {
      element.style.borderRadius = `${value}px`
    }
  }

  const handleDelete = () => {
    if (element) {
      element.remove()
    }
  }

  const handleDuplicate = () => {
    if (element) {
      const cloned = element.cloneNode(true) as HTMLElement
      cloned.style.left = `${Number.parseInt(element.style.left || "0") + 20}px`
      cloned.style.top = `${Number.parseInt(element.style.top || "0") + 20}px`
      element.parentElement?.appendChild(cloned)
    }
  }

  if (!element) return null

  return (
    <div className="space-y-5">
      <div className="pb-3 border-b border-border/50">
        <p className="text-xs font-bold text-secondary uppercase tracking-widest">{element.tagName}</p>
      </div>

      {/* Size Section */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide opacity-70">Dimensions</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">Width</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => handleWidthChange(e.target.value)}
              className="mt-1.5 bg-input border-border text-foreground"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">Height</label>
            <Input
              type="number"
              value={height}
              onChange={(e) => handleHeightChange(e.target.value)}
              className="mt-1.5 bg-input border-border text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Image Section */}
      {element.tagName === "IMG" ? (
        <div>
          <label className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide opacity-70 block">
            Image Source
          </label>
          <Input
            type="text"
            value={imageSrc}
            onChange={(e) => handleImageSrcChange(e.target.value)}
            placeholder="Enter image URL"
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      ) : (
        <>
          {/* Text Content */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide opacity-70 block">
              Text Content
            </label>
            <Textarea
              value={textContent}
              onChange={(e) => handleTextChange(e.target.value)}
              className="min-h-20 bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Text Alignment */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide opacity-70 block">
              Alignment
            </label>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant={textAlign === "left" ? "default" : "outline"}
                onClick={() => handleTextAlignChange("left")}
                className="flex-1"
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={textAlign === "center" ? "default" : "outline"}
                onClick={() => handleTextAlignChange("center")}
                className="flex-1"
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={textAlign === "right" ? "default" : "outline"}
                onClick={() => handleTextAlignChange("right")}
                className="flex-1"
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Font Properties */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide opacity-70">Typography</p>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase">Font Size</label>
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(e.target.value)}
                className="mt-1.5 bg-input border-border text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => handleFontFamilyChange(e.target.value)}
                className="w-full mt-1.5 px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm"
              >
                <option>Arial</option>
                <option>Georgia</option>
                <option>Times New Roman</option>
                <option>Courier New</option>
                <option>Verdana</option>
                <option>Comic Sans MS</option>
                <option>Impact</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase">Font Weight</label>
              <select
                value={fontWeight}
                onChange={(e) => handleFontWeightChange(e.target.value)}
                className="w-full mt-1.5 px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm"
              >
                <option value="400">Normal</option>
                <option value="600">Semi-Bold</option>
                <option value="700">Bold</option>
                <option value="900">Extra Bold</option>
              </select>
            </div>
          </div>

          {/* Text Color */}
          <div className="pt-2 border-t border-border/50">
            <label className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide opacity-70 block">
              Text Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-10 rounded border border-border cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1 bg-input border-border text-foreground"
              />
            </div>
          </div>
        </>
      )}

      {/* Background Color */}
      <div className="pt-2 border-t border-border/50">
        <label className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide opacity-70 block">
          Background
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={bgColor === "transparent" ? "#ffffff" : bgColor}
            onChange={(e) => handleBgColorChange(e.target.value)}
            className="w-12 h-10 rounded border border-border cursor-pointer"
          />
          <Input
            type="text"
            value={bgColor}
            onChange={(e) => handleBgColorChange(e.target.value)}
            className="flex-1 bg-input border-border text-foreground"
          />
        </div>
      </div>

      {/* Advanced Properties */}
      <div className="space-y-3 pt-2 border-t border-border/50">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide opacity-70">Advanced</p>
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase block mb-2">Opacity</label>
          <div className="flex gap-2 items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => handleOpacityChange(e.target.value)}
              className="flex-1"
            />
            <span className="text-xs font-medium text-foreground w-8">{Math.round(Number(opacity) * 100)}%</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase">Padding</label>
          <Input
            type="number"
            value={padding}
            onChange={(e) => handlePaddingChange(e.target.value)}
            className="mt-1.5 bg-input border-border text-foreground"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase">Border Radius</label>
          <Input
            type="number"
            value={borderRadius}
            onChange={(e) => handleBorderRadiusChange(e.target.value)}
            className="mt-1.5 bg-input border-border text-foreground"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-border/50">
        <Button
          onClick={handleDuplicate}
          variant="outline"
          className="flex-1 bg-input hover:bg-secondary/20 border-border text-foreground transition-all"
        >
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </Button>
        <Button onClick={handleDelete} variant="destructive" className="flex-1">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  )
}
