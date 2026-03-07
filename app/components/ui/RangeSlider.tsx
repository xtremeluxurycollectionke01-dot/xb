'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/app/lib/utils'

interface RangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  className?: string
}

export default function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  className,
}: RangeSliderProps) {
  const [minValue, setMinValue] = useState(value[0])
  const [maxValue, setMaxValue] = useState(value[1])
  const minRangeRef = useRef<HTMLInputElement>(null)
  const maxRangeRef = useRef<HTMLInputElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMinValue(value[0])
    setMaxValue(value[1])
  }, [value])

  useEffect(() => {
    if (progressRef.current) {
      const percentMin = ((minValue - min) / (max - min)) * 100
      const percentMax = ((maxValue - min) / (max - min)) * 100
      progressRef.current.style.left = `${percentMin}%`
      progressRef.current.style.width = `${percentMax - percentMin}%`
    }
  }, [minValue, maxValue, min, max])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinVal = Math.min(Number(e.target.value), maxValue - step)
    setMinValue(newMinVal)
    onChange([newMinVal, maxValue])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxVal = Math.max(Number(e.target.value), minValue + step)
    setMaxValue(newMaxVal)
    onChange([minValue, newMaxVal])
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          ref={progressRef}
          className="absolute h-full bg-brand-500 rounded-full"
        />
      </div>

      <div className="relative">
        <input
          ref={minRangeRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="absolute top-0 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        />
        <input
          ref={maxRangeRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute top-0 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      <div className="flex justify-between mt-4">
        <span className="text-sm text-gray-600">
          KES {minValue.toLocaleString()}
        </span>
        <span className="text-sm text-gray-600">
          KES {maxValue.toLocaleString()}
        </span>
      </div>
    </div>
  )
}