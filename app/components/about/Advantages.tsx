import { FiPackage, FiTag, FiShield, FiCreditCard } from 'react-icons/fi'
import Container from '../layout/Container'
import Card from '../ui/Card'
import { cn } from '@/app/lib/utils'

const advantages = [
  {
    icon: FiPackage,
    title: 'Stocked & Ready',
    description: '50,000+ SKUs in our Nairobi warehouse. 95% of orders ship same-day.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FiTag,
    title: 'Transparent Pricing',
    description: 'Retail prices shown online. Bulk pricing for B2B with instant quotations.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: FiShield,
    title: 'Scientific Expertise',
    description: 'Specialized knowledge in lab equipment & chemicals. MSDS sheets always available.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FiCreditCard,
    title: 'Flexible Payments',
    description: 'M-Pesa, bank transfer, or 30-day credit for approved business accounts.',
    color: 'from-orange-500 to-red-500',
  },
]

export default function Advantages() {
  return (
    <section className="section-padding bg-soft-gray">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark-text)] mb-4">
            The LabPro Advantage
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            What sets us apart in serving Kenya's workplaces
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon
            return (
              <Card 
                key={advantage.title} 
                className="group relative overflow-hidden p-8"
                hoverable
              >
                {/* Gradient Background */}
                <div className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500',
                  `bg-gradient-to-br ${advantage.color}`
                )} />

                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[var(--brand-100)] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-[var(--brand-600)]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold text-[var(--dark-text)] mb-2 group-hover:text-[var(--brand-600)] transition-colors">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {advantage.description}
                    </p>

                    {/* Stats or additional info */}
                    {index === 0 && (
                      <div className="mt-4 flex items-center gap-4 text-sm">
                        <span className="text-[var(--brand-600)] font-medium">95% ship rate</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-[var(--brand-600)] font-medium">50K+ SKUs</span>
                      </div>
                    )}
                    {index === 3 && (
                      <div className="mt-4 flex items-center gap-4 text-sm">
                        <span className="text-[var(--brand-600)] font-medium">M-Pesa</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-[var(--brand-600)] font-medium">Visa/Mastercard</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-[var(--brand-600)] font-medium">Credit Terms</span>
                      </div>
                    )}
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