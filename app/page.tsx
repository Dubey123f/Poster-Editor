"use client"

import { useState, useCallback } from "react"
import { Canvas } from "@/components/canvas"
import { Toolbar } from "@/components/toolbar"
import { PropertiesPanel } from "@/components/properties-panel"
import { ImportPanel } from "@/components/import-panel"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check, RotateCcw, RotateCw, Zap, Trash2, Menu, X } from "lucide-react"
import { useHistory } from "@/hooks/use-history"

export default function Home() {
  const [htmlContent, setHtmlContent] = useState<string>("")
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)
  const [exportCopied, setExportCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [propertiesOpen, setPropertiesOpen] = useState(false)
  const { push, undo, redo, canUndo, canRedo } = useHistory()

  const handleImport = (content: string) => {
    setHtmlContent(content)
    setSelectedElement(null)
    push(content)
  }

  const saveState = useCallback(() => {
    const canvas = document.querySelector("[data-canvas]") as HTMLElement
    if (canvas) {
      push(canvas.innerHTML)
    }
  }, [push])

  const handleAddElement = (type: "text" | "image" | "div") => {
    const canvas = document.querySelector("[data-canvas]") as HTMLElement
    if (!canvas) return

    let newElement: HTMLElement

    if (type === "text") {
      newElement = document.createElement("p")
      newElement.textContent = "New Text"
      newElement.style.fontSize = "16px"
      newElement.style.color = "#000000"
    } else if (type === "image") {
      newElement = document.createElement("img")
      newElement.setAttribute("src", "/abstract-geometric-sculpture.png")
      newElement.style.width = "100px"
      newElement.style.height = "100px"
    } else {
      newElement = document.createElement("div")
      newElement.style.width = "100px"
      newElement.style.height = "100px"
      newElement.style.backgroundColor = "#e5e7eb"
      newElement.style.border = "1px solid #d1d5db"
    }

    newElement.style.position = "absolute"
    newElement.style.left = "50px"
    newElement.style.top = "50px"

    canvas.appendChild(newElement)

    newElement.addEventListener("click", (e) => {
      e.stopPropagation()
      setSelectedElement(newElement)
    })

    setSelectedElement(newElement)
    saveState()
  }

  const handleUndo = () => {
    const previousState = undo()
    if (previousState) {
      const canvas = document.querySelector("[data-canvas]") as HTMLElement
      if (canvas) {
        canvas.innerHTML = previousState
        setSelectedElement(null)
      }
    }
  }

  const handleRedo = () => {
    const nextState = redo()
    if (nextState) {
      const canvas = document.querySelector("[data-canvas]") as HTMLElement
      if (canvas) {
        canvas.innerHTML = nextState
        setSelectedElement(null)
      }
    }
  }

  const handleExportFile = () => {
    if (!htmlContent) return

    const canvas = document.querySelector("[data-canvas]") as HTMLElement
    if (!canvas) return

    const exportedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Poster</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .poster-container {
      width: 720px;
      height: 720px;
      background-color: white;
      position: relative;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <div class="poster-container">
    ${canvas.innerHTML}
  </div>
</body>
</html>`

    const blob = new Blob([exportedHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "poster.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyHTML = () => {
    const canvas = document.querySelector("[data-canvas]") as HTMLElement
    if (!canvas) return

    const html = canvas.innerHTML
    navigator.clipboard.writeText(html).then(() => {
      setExportCopied(true)
      setTimeout(() => setExportCopied(false), 2000)
    })
  }

  const handleClearCanvas = () => {
    if (confirm("Are you sure you want to clear the canvas?")) {
      setHtmlContent("")
      setSelectedElement(null)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-base font-bold text-foreground">Poster Editor</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-foreground">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Left Sidebar - Responsive */}
      <div
        className={`fixed lg:static inset-0 z-40 lg:z-auto w-full sm:w-80 border-r border-border bg-card overflow-y-auto flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="hidden lg:block p-6 border-b border-border bg-gradient-to-r from-card to-card/80">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Poster Editor</h1>
              <p className="text-xs text-muted-foreground">Visual HTML Design Tool</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Import Section */}
          <div>
            <h2 className="text-xs font-bold text-foreground mb-3 uppercase tracking-widest opacity-70">Get Started</h2>
            <ImportPanel onImport={handleImport} />
          </div>

          {htmlContent && (
            <>
              {/* History Section */}
              <div className="pt-4 border-t border-border/50">
                <h2 className="text-xs font-bold text-foreground mb-3 uppercase tracking-widest opacity-70">History</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    variant="outline"
                    className="flex-1 bg-input hover:bg-secondary/20 border-border text-foreground transition-all"
                    title="Undo (Ctrl+Z)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    variant="outline"
                    className="flex-1 bg-input hover:bg-secondary/20 border-border text-foreground transition-all"
                    title="Redo (Ctrl+Y)"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Toolbar Section */}
              <div className="pt-4 border-t border-border/50">
                <h2 className="text-xs font-bold text-foreground mb-3 uppercase tracking-widest opacity-70">
                  Add Elements
                </h2>
                <Toolbar onAddElement={handleAddElement} />
              </div>

              {/* Export Section */}
              <div className="pt-4 border-t border-border/50">
                <h2 className="text-xs font-bold text-foreground mb-3 uppercase tracking-widest opacity-70">Export</h2>
                <div className="space-y-2">
                  <Button
                    onClick={handleExportFile}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold shadow-md transition-all text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download HTML
                  </Button>
                  <Button
                    onClick={handleCopyHTML}
                    variant="outline"
                    className="w-full bg-input hover:bg-secondary/20 border-border text-foreground transition-all text-sm"
                  >
                    {exportCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-accent" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy HTML
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleClearCanvas}
                    variant="outline"
                    className="w-full bg-input hover:bg-destructive/20 border-border text-foreground transition-all text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Canvas
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center bg-background p-3 sm:p-6 lg:p-8 overflow-auto">
        {htmlContent ? (
          <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
            <Canvas
              htmlContent={htmlContent}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
              onStateChange={saveState}
            />
            <div className="text-center max-w-xs sm:max-w-sm">
              <p className="text-xs sm:text-sm font-medium text-foreground mb-2">Canvas Controls</p>
              <p className="text-xs text-muted-foreground">
                Click to select • Drag to move • Resize from bottom-right corner
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center max-w-xs sm:max-w-sm px-4">
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <Zap className="w-8 sm:w-10 h-8 sm:h-10 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">Ready to Create</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              Import an HTML file or paste HTML code to start editing your poster visually
            </p>
            <div className="inline-block px-3 sm:px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-xs text-primary font-medium">Tip: Use the import panel on the left to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Properties (Mobile Tab) */}
      {selectedElement && (
        <>
          {/* Mobile Properties Button */}
          <div className="lg:hidden flex justify-center p-4 border-t border-border bg-card">
            <Button
              onClick={() => setPropertiesOpen(!propertiesOpen)}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold"
            >
              {propertiesOpen ? "Hide" : "Show"} Properties
            </Button>
          </div>

          {/* Properties Panel */}
          <div
            className={`fixed lg:static bottom-0 left-0 right-0 lg:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card overflow-y-auto transition-all duration-300 ${
              propertiesOpen ? "h-96 sm:h-[50vh]" : "hidden lg:block"
            } lg:h-auto`}
          >
            <div className="p-4 sm:p-6 border-b border-border sticky top-0 bg-card/95 backdrop-blur">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-widest opacity-70">
                Element Properties
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <PropertiesPanel element={selectedElement} onUpdate={saveState} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
