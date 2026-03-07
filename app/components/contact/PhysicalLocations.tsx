'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiMapPin, FiClock,  FiWifi, FiNavigation } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { locations } from '@/app/lib/contact-data'
import Container from '../layout/Container'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Tabs from '../ui/Tabs'
import { FaParking } from 'react-icons/fa'

export default function PhysicalLocations() {
  const [activeLocation, setActiveLocation] = useState('nairobi')
  const currentLocation = locations.find(l => l.id === activeLocation) || locations[0]

  // This would be replaced with actual Google Maps embed
  const MapPlaceholder = ({ location }: { location: typeof currentLocation }) => (
    <div className="relative w-full h-full min-h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
      <Image
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.coordinates.lat},${location.coordinates.lng}&zoom=15&size=800x400&markers=color:green%7C${location.coordinates.lat},${location.coordinates.lng}&key=YOUR_API_KEY`}
        alt={`Map showing ${location.city} office`}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <p className="text-white bg-black/50 px-4 py-2 rounded-lg text-sm">
          Interactive map would be embedded here
        </p>
      </div>
    </div>
  )

  const locationTabs = locations.map(loc => ({
    id: loc.id,
    label: loc.city,
    content: null,
  }))

  return (
    <section className="section-padding bg-[var(--soft-gray)]">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark-text)] mb-4">
            Visit Our Offices
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Come see us in person at any of our locations
          </p>
        </div>

        {/* Location Tabs */}
        <div className="mb-6">
          <Tabs 
            tabs={locationTabs}
            defaultTab="nairobi"
            onChange={(tabId) => setActiveLocation(tabId)}
          />
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="lg:order-2">
            <div className="sticky top-24">
              <MapPlaceholder location={currentLocation} />
            </div>
          </div>

          {/* Location Info */}
          <div className="lg:order-1">
            <Card className="p-8">
              {/* Head Office Badge */}
              {currentLocation.isHeadOffice && (
                <div className="inline-flex items-center px-4 py-2 bg-[var(--brand-100)] text-[var(--brand-700)] rounded-full text-sm font-medium mb-6">
                  <FiMapPin className="w-4 h-4 mr-2" />
                  Head Office & Showroom
                </div>
              )}

              <h3 className="text-2xl font-bold text-[var(--dark-text)] mb-4">
                {currentLocation.city} Location
              </h3>

              {/* Address */}
              <div className="flex items-start gap-3 mb-6">
                <FiMapPin className="w-5 h-5 text-[var(--brand-500)] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentLocation.address}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentLocation.building}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Nairobi, Kenya
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3 mb-6">
                <FiClock className="w-5 h-5 text-[var(--brand-500)] mt-1 flex-shrink-0" />
                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday-Friday:</span>
                    <span className="font-medium text-[var(--dark-text)]">{currentLocation.hours}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="font-medium text-[var(--dark-text)]">{currentLocation.saturday}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">Sunday:</span>
                    <span className="font-medium text-[var(--dark-text)]">{currentLocation.sunday}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <FaParking className={cn(
                    'w-4 h-4',
                    currentLocation.parking ? 'text-green-500' : 'text-gray-400'
                  )} />
                  <span className="text-gray-600">{currentLocation.parking}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FiWifi className={cn(
                    'w-4 h-4',
                    'text-green-500'
                  )} />
                  <span className="text-gray-600">Free WiFi</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={cn(
                    'w-4 h-4 rounded-full',
                    currentLocation.accessible ? 'bg-green-500' : 'bg-gray-400'
                  )} />
                  <span className="text-gray-600">
                    {currentLocation.accessible ? 'Wheelchair Accessible' : 'Limited Access'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => window.open(`https://maps.google.com/?q=${currentLocation.coordinates.lat},${currentLocation.coordinates.lng}`, '_blank')}
                >
                  <FiNavigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
                <Button variant="outline" className="flex-1">
                  <FiMapPin className="w-4 h-4 mr-2" />
                  Save Address
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  )
}