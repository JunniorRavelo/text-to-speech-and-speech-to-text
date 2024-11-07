'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function VoiceInterface() {
  const [text, setText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Configuración del reconocimiento de voz (voz a texto)
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'es-ES'

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')
          setText(transcript)
        }

        recognitionRef.current.onerror = (error) => {
          console.error("Error en el reconocimiento de voz:", error)
          setIsListening(false)
        }
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleRecord = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.onend = () => console.log("Texto a voz terminado")

      // Cancelar cualquier síntesis en curso antes de comenzar una nueva
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    } else {
      console.error("La síntesis de voz no es compatible con este navegador.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6 space-y-4">
          <Textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="El texto aparecerá aquí..."
            className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-xl resize-none"
          />
          <div className="flex justify-between items-center">
            <Button 
              onClick={handleRecord}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm`}
            >
              {isListening ? 'Detener' : 'Grabar'}
            </Button>
            <Button
              onClick={handleSpeak}
              className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full text-sm`}
            >
              Reproducir
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
