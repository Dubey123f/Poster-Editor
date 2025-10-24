"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Code } from "lucide-react"

interface ImportPanelProps {
  onImport: (content: string) => void
}

export function ImportPanel({ onImport }: ImportPanelProps) {
  const [pastedHTML, setPastedHTML] = useState("")
  const [showPasteArea, setShowPasteArea] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      onImport(content)
      setPastedHTML("")
      setShowPasteArea(false)
    }
    reader.readAsText(file)
  }

  const handlePaste = () => {
    if (pastedHTML.trim()) {
      onImport(pastedHTML)
      setPastedHTML("")
      setShowPasteArea(false)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <input type="file" accept=".html,.htm" onChange={handleFileUpload} className="hidden" id="html-file-input" />
        <Button
          asChild
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold shadow-md transition-all"
        >
          <label htmlFor="html-file-input" className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Upload HTML File
          </label>
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium">Or</span>
        </div>
      </div>

      {!showPasteArea ? (
        <Button
          onClick={() => setShowPasteArea(true)}
          variant="outline"
          className="w-full bg-input hover:bg-secondary/20 border-border text-foreground transition-all"
        >
          <Code className="w-4 h-4 mr-2" />
          Paste HTML Code
        </Button>
      ) : (
        <div className="space-y-3 animate-in fade-in duration-200">
          <Textarea
            placeholder="Paste your HTML code here..."
            value={pastedHTML}
            onChange={(e) => setPastedHTML(e.target.value)}
            className="min-h-32 bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
          />
          <div className="flex gap-2">
            <Button
              onClick={handlePaste}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold transition-all"
              disabled={!pastedHTML.trim()}
            >
              Import
            </Button>
            <Button
              onClick={() => {
                setShowPasteArea(false)
                setPastedHTML("")
              }}
              variant="outline"
              className="flex-1 bg-input hover:bg-secondary/20 border-border text-foreground transition-all"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
