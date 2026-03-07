import type { Metadata } from 'next'
import AboutCTA from '../components/about/AboutCTA'
import AboutHero from '../components/about/AboutHero'
import Advantages from '../components/about/Advantages'
import Facilities from '../components/about/Facilities'
import JourneyTimeline from '../components/about/JourneyTimeline'
import MissionValues from '../components/about/MissionValues'
import TeamSection from '../components/about/TeamSection'
import TrustSignals from '../components/about/TrustSignals'


export const metadata: Metadata = {
  title: 'About Us | LabPro Scientific Supplies',
  description: 'Learn about our journey, mission, and commitment to providing quality laboratory and office supplies since 2010.',
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <JourneyTimeline />
      <MissionValues />
      <Advantages />
      <TeamSection />
      <TrustSignals />
      <Facilities />
      <AboutCTA />
    </>
  )
}