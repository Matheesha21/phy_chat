import { useCallback, useEffect, useRef, useState } from 'react'

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined
  return window.SpeechRecognition || window.webkitSpeechRecognition
}

interface UseSpeechToTextOptions {
  onResult: (transcript: string) => void
  onError?: (message: string) => void
}

export function useSpeechToText({ onResult, onError }: UseSpeechToTextOptions) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isSupported = !!getSpeechRecognitionConstructor()

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognitionImpl = getSpeechRecognitionConstructor()
    if (!SpeechRecognitionImpl) {
      onError?.('Voice input is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognitionImpl()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim()
      if (transcript) onResult(transcript)
    }

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        onError?.(
          event.error === 'not-allowed'
            ? 'Microphone access was denied.'
            : 'Voice input failed. Please try again.'
        )
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [onResult, onError])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return { isListening, isSupported, toggleListening }
}
