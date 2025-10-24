"use client"

import { Button } from "@/components/ui/button"
import { Type, ImageIcon, Square } from "lucide-react"

interface ToolbarProps {
  onAddElement: (type: "text" | "image" | "div") => void
}

export function Toolbar({ onAddElement }: ToolbarProps) {
  return (
    <div className="space-y-2">
      <Button
        onClick={() => onAddElement("text")}
        className="w-full justify-start bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground font-medium shadow-sm transition-all"
      >
        <Type className="w-4 h-4 mr-3" />
        <span>Add Text Block</span>
      </Button>
      <Button
        onClick={() => onAddElement("image")}
        className="w-full justify-start bg-gradient-to-r from-secondary/80 to-secondary hover:from-secondary hover:to-secondary/90 text-secondary-foreground font-medium shadow-sm transition-all"
      >
        <ImageIcon className="w-4 h-4 mr-3" />
        <span>Add Image</span>
      </Button>
      <Button
        onClick={() => onAddElement("div")}
        className="w-full justify-start bg-gradient-to-r from-accent/80 to-accent hover:from-accent hover:to-accent/90 text-accent-foreground font-medium shadow-sm transition-all"
      >
        <Square className="w-4 h-4 mr-3" />
        <span>Add Box</span>
      </Button>
    </div>
  )
}
