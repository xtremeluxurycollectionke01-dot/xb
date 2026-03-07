import { FiZap, FiCheckCircle, FiUsers, FiTrendingUp } from 'react-icons/fi'
import Container from '../layout/Container'
import Card from '../ui/Card'

const values = [
  {
    icon: FiZap,
    title: 'Speed',
    description: 'Same-day delivery in Nairobi, next-day across major cities',
    details: 'Orders placed before 2 PM ship same day',
  },
  {
    icon: FiCheckCircle,
    title: 'Quality',
    description: 'Certified products from trusted manufacturers',
    details: 'ISO standards, genuine brands only',
  },
  {
    icon: FiUsers,
    title: 'Partnership',
    description: 'Dedicated account managers for B2B clients',
    details: 'Personalized service for institutional buyers',
  },
  {
    icon: FiTrendingUp,
    title: 'Growth',
    description: 'Constant innovation in service and product range',
    details: 'Expanding to meet evolving client needs',
  },
]

export default function MissionValues() {
  return (
    <section className="section-padding">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark-text)] mb-6">
            Why We Exist
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            "To provide reliable, high-quality workplace essentials with unmatched 
            speed and transparency—empowering businesses to focus on what they do best."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card 
                key={value.title} 
                hoverable 
                className="group relative overflow-hidden p-6 text-center"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-50)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon */}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[var(--brand-100)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-[var(--brand-600)]" />
                  </div>

                  <h3 className="text-xl font-bold text-[var(--dark-text)] mb-3">
                    {value.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {value.description}
                  </p>

                  {/* Hover Detail */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[var(--brand-500)] text-white py-2 px-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-medium">{value.details}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </Container>
    </section>
  )
}