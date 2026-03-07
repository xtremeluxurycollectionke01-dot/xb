import { FiMail, FiPhone } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'

const teams = [
  {
    role: 'Sales Team',
    description: 'Helping you find the right products',
    email: 'sales@labpro.co.ke',
    phone: '+254 700 123 456',
    icon: '💼',
    color: 'from-blue-500 to-blue-600',
  },
  {
    role: 'Operations Manager',
    description: 'Ensuring your orders arrive perfect',
    email: 'ops@labpro.co.ke',
    phone: '+254 700 123 457',
    icon: '📦',
    color: 'from-green-500 to-green-600',
  },
  {
    role: 'Support Team',
    description: 'Here when you need assistance',
    email: 'help@labpro.co.ke',
    phone: '+254 700 123 458',
    icon: '🤝',
    color: 'from-purple-500 to-purple-600',
  },
]

const leadership = [
  {
    name: 'John Mwangi',
    title: 'Founder & CEO',
    bio: '20+ years in laboratory supplies and equipment distribution',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  },
  {
    name: 'Sarah Kimani',
    title: 'Operations Director',
    bio: 'Supply chain expert ensuring seamless delivery across East Africa',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  },
  {
    name: 'Dr. James Omondi',
    title: 'Technical Director',
    bio: 'PhD in Chemistry, overseeing product quality and specifications',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400',
  },
]

export default function TeamSection() {
  return (
    <section className="section-padding" id="team">
      <Container>
        <SectionHeading
          title="Meet the Experts"
          subtitle="The people behind your reliable supply chain"
        />

        {/* Functional Teams */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {teams.map((team) => (
            <Card key={team.role} className="p-6 text-center group hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--brand-100)] to-[var(--brand-200)] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {team.icon}
              </div>
              
              <h3 className="text-xl font-bold text-[var(--dark-text)] mb-2">
                {team.role}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {team.description}
              </p>

              <div className="space-y-2">
                <Link 
                  href={`mailto:${team.email}`}
                  className="flex items-center justify-center gap-2 text-sm text-[var(--brand-600)] hover:text-[var(--brand-700)] transition-colors"
                >
                  <FiMail className="w-4 h-4" />
                  {team.email}
                </Link>
                <Link 
                  href={`tel:${team.phone}`}
                  className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-[var(--brand-600)] transition-colors"
                >
                  <FiPhone className="w-4 h-4" />
                  {team.phone}
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Leadership Team */}
        <div>
          <h3 className="text-2xl font-bold text-[var(--dark-text)] text-center mb-8">
            Leadership Team
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader) => (
              <div key={leader.name} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[var(--brand-200)]">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-[var(--dark-text)] mb-1">
                  {leader.name}
                </h4>
                <p className="text-[var(--brand-600)] font-medium mb-2">
                  {leader.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                  {leader.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}