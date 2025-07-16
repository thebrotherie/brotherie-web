// src/lib/useAutocomplete.ts
'use client'
import { useEffect, useState } from 'react'

export function useAutocomplete(input: string) {
  const [preds, setPreds] =
    useState<google.maps.places.AutocompletePrediction[]>([])

  useEffect(() => {
    if (!input) return setPreds([])

    const g = (window as any).google
    if (!g?.maps?.places) return

    const Ctor =
      (g.maps.places as any).AutocompleteSuggestionService ??
      g.maps.places.AutocompleteService

    if (!Ctor) return

    const svc = new Ctor()
    svc.getPlacePredictions(
      { input, types: ['address'], language: 'en' },
      (p: google.maps.places.AutocompletePrediction[] | null) =>
        setPreds(p ?? [])
    )
  }, [input])

  /* expose clearer */
  const clear = () => setPreds([])

  return { preds, clear }
}
