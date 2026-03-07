import Link from 'next/link'
import { socialLinks } from '@/app/lib/contact-data'
import Container from '../layout/Container'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function SocialMedia() {
  return (
    <section className="section-padding">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark-text)] mb-4">
            Connect With Us
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Follow us for new product alerts and exclusive offers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {socialLinks.map((social) => (
            <Link
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="p-6 text-center hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {social.icon}
                </div>
                <h3 className="font-medium text-[var(--dark-text)] text-sm mb-1">
                  {social.platform}
                </h3>
                {social.followers !== 'N/A' && (
                  <p className="text-xs text-gray-500">{social.followers} followers</p>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {/* WhatsApp Business CTA */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📱</div>
              <div>
                <h3 className="text-xl font-bold mb-1">WhatsApp Business</h3>
                <p className="text-white/90">Browse our catalog and get quick responses</p>
              </div>
            </div>
            <Link href="https://wa.me/254700123456" target="_blank">
              <Button variant="secondary" size="lg">
                Start Chat
              </Button>
            </Link>
          </div>
        </Card>
      </Container>
    </section>
  )
}