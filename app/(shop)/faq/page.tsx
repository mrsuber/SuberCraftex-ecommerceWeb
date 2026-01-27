import { Card, CardContent } from "@/components/ui/card";
import {
  HelpCircle,
  ShoppingCart,
  Truck,
  CreditCard,
  RotateCcw,
  Scissors,
  User,
  Mail,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "FAQ | SuberCraftex",
  description:
    "Frequently asked questions about SuberCraftex products, services, shipping, and more",
};

const faqCategories = [
  {
    icon: ShoppingCart,
    title: "Orders & Products",
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse our catalog, add items to your cart, and proceed to checkout. You'll need to create an account or log in, provide shipping details, and complete payment to place your order.",
      },
      {
        q: "Can I modify or cancel my order?",
        a: "You can modify or cancel your order within 1 hour of placing it by contacting our customer support. Once an order is being processed or shipped, changes cannot be made.",
      },
      {
        q: "How can I track my order?",
        a: "Log into your account and visit your order history to view real-time tracking information. You'll also receive tracking updates via email and push notifications through our app.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept major credit/debit cards (Visa, Mastercard, American Express), mobile money, and other local payment options. All payments are processed securely.",
      },
    ],
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 5-7 business days, while express delivery takes 2-3 business days. Custom-made items may take longer depending on the complexity of the order.",
      },
      {
        q: "Do you deliver to my area?",
        a: "We deliver to most locations within our service areas. Enter your address at checkout to confirm delivery availability and see shipping costs.",
      },
      {
        q: "What if I'm not home during delivery?",
        a: "Our delivery team will contact you before arrival. If you're unavailable, they may leave the package with a neighbor, at a secure location, or schedule a redelivery.",
      },
      {
        q: "Can I change my delivery address after ordering?",
        a: "Address changes can be made before your order ships by contacting customer support. Once shipped, the delivery address cannot be changed.",
      },
    ],
  },
  {
    icon: RotateCcw,
    title: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 14 days of delivery for unused items in original packaging with tags attached. Some items like custom-made products are non-returnable.",
      },
      {
        q: "How do I return an item?",
        a: "Log into your account, go to order history, select the item, and click 'Request Return.' Follow the instructions provided to complete your return.",
      },
      {
        q: "How long do refunds take?",
        a: "Refunds are processed within 5-7 business days after we receive and inspect your return. The refund will be credited to your original payment method.",
      },
      {
        q: "Can I exchange an item?",
        a: "Yes! Exchanges follow the same process as returns. Request an exchange through your account, and we'll help you get the right size or color.",
      },
    ],
  },
  {
    icon: Scissors,
    title: "Tailoring Services",
    questions: [
      {
        q: "What tailoring services do you offer?",
        a: "We offer onsite tailoring (at your location), custom production (made-to-order items), and collect & repair services (pickup, repair, and delivery).",
      },
      {
        q: "How do I book a tailoring service?",
        a: "Browse our services section, select the service you need, choose your preferences (materials, styles), and book a convenient time. You can track progress through your account.",
      },
      {
        q: "Can I cancel a tailoring booking?",
        a: "Bookings can be cancelled before production begins. Once work has started, cancellations may incur a fee. Custom items in production cannot be refunded.",
      },
      {
        q: "How do fittings work?",
        a: "For custom orders, we schedule fitting appointments to ensure perfect fit. Fittings can be done at our location or through our onsite service, depending on your booking.",
      },
      {
        q: "What if I'm not satisfied with the tailoring work?",
        a: "We stand behind our work. If there are issues with workmanship, we'll make corrections at no extra cost. Contact us within 7 days of receiving your item.",
      },
    ],
  },
  {
    icon: User,
    title: "Account & Security",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' or 'Register' on our website or app. Enter your email, create a password, and verify your email address to complete registration.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "Click 'Forgot Password' on the login page, enter your email, and we'll send you a link to reset your password.",
      },
      {
        q: "Is my personal information secure?",
        a: "Yes. We use industry-standard encryption to protect your data. We never sell your personal information. Read our Privacy Policy for more details.",
      },
      {
        q: "How do I update my account information?",
        a: "Log into your account, go to Profile or Account Settings, and update your personal information, addresses, or preferences.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Pricing",
    questions: [
      {
        q: "Is it safe to pay online?",
        a: "Absolutely. All payments are processed through secure, encrypted connections. We partner with trusted payment providers and never store your full card details.",
      },
      {
        q: "Do you offer payment plans?",
        a: "For certain high-value items and services, we may offer deposit and payment plans. Details are provided during checkout when available.",
      },
      {
        q: "Why was my payment declined?",
        a: "Payments may be declined due to insufficient funds, incorrect card details, or bank security measures. Try a different payment method or contact your bank.",
      },
      {
        q: "Do prices include tax?",
        a: "Displayed prices may or may not include applicable taxes depending on your location. Final pricing including all taxes is shown at checkout.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our products, services,
            shipping, and more.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {faqCategories.map((category) => (
            <a
              key={category.title}
              href={`#${category.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-center"
            >
              <category.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-xs font-medium">{category.title}</span>
            </a>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqCategories.map((category) => (
            <section
              key={category.title}
              id={category.title.toLowerCase().replace(/\s+/g, "-")}
            >
              <div className="flex items-center gap-3 mb-6">
                <category.icon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>
              <div className="space-y-4">
                {category.questions.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2 flex items-start gap-2">
                        <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        {item.q}
                      </h3>
                      <p className="text-muted-foreground ml-7">{item.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Still Have Questions */}
        <Card className="mt-16">
          <CardContent className="p-8 text-center">
            <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Can't find what you're looking for? Our customer support team is
              ready to help you with any questions or concerns.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
