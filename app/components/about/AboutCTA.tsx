import Link from 'next/link'
import { FiShoppingBag, FiFileText, FiMail } from 'react-icons/fi'
import Container from '../layout/Container'
import Button from '../ui/Button'

export default function AboutCTA() {
  return (
    <section className="section-padding bg-gradient-to-r from-[var(--brand-800)] to-[var(--brand-600)] text-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-white/90 mb-12">
            Whether you need supplies today or planning a large project, we're here to help.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Immediate Needs */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Need Supplies Now?</h3>
              <p className="text-white/80 mb-4">
                Browse our catalog for immediate purchase
              </p>
              <Link href="/products">
                <Button variant="secondary" className="w-full">
                  Browse Products →
                </Button>
              </Link>
            </div>

            {/* Large Project */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Planning a Large Project?</h3>
              <p className="text-white/80 mb-4">
                Get a customized quote for bulk orders
              </p>
              <Link href="/contact">
                <Button variant="secondary" className="w-full">
                  Request Quote →
                </Button>
              </Link>
            </div>
          </div>

          {/* Alternative Contact */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-white/90 mb-4">Or contact us directly</p>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <FiMail className="w-5 h-5 mr-2" />
                Send a Message
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}