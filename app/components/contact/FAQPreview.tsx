import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { faqs } from '@/app/lib/contact-data'
import Container from '../layout/Container'
import Card from '../ui/Card'
import Accordion from '../ui/Accordion'
import Button from '../ui/Button'

export default function FAQPreview() {
  const previewFAQs = faqs.slice(0, 4)

  const accordionItems = previewFAQs.map(faq => ({
    id: faq.id,
    title: faq.question,
    content: <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>,
  }))

  return (
    <section className="section-padding bg-[var(--soft-gray)]">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark-text)] mb-4">
            Common Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Before you write, see if your question is already answered
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="p-6 md:p-8">
            <Accordion items={accordionItems} />

            <div className="text-center mt-8 pt-6 border-t border-[var(--card-border)]">
              <Link href="/faq">
                <Button variant="outline">
                  View All FAQs
                  <FiArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  )
}