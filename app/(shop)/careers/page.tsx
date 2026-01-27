import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  TrendingUp,
  Heart,
  Globe,
  Mail,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Careers | SuberCraftex",
  description:
    "Join the SuberCraftex team. Explore career opportunities and grow with us.",
};

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join Our{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Team
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build your career with SuberCraftex. We're always looking for
            talented individuals who share our passion for excellence.
          </p>
        </div>

        {/* Why Join Us */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Growth</h3>
              <p className="text-xs text-muted-foreground">
                Career advancement opportunities
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Team</h3>
              <p className="text-xs text-muted-foreground">
                Collaborative work environment
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Culture</h3>
              <p className="text-xs text-muted-foreground">
                Inclusive and supportive
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <GraduationCap className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Learning</h3>
              <p className="text-xs text-muted-foreground">
                Continuous development
              </p>
            </CardContent>
          </Card>
        </div>

        {/* About Working Here */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Why SuberCraftex?</h2>
            <p className="text-muted-foreground mb-4">
              SuberCraftex, operated by{" "}
              <strong>Camsol Technologies Ltd</strong>, is at the forefront of
              e-commerce and custom tailoring services. We're building something
              special—a platform that combines quality products with exceptional
              service.
            </p>
            <p className="text-muted-foreground mb-4">
              Our team is passionate about creating seamless shopping
              experiences and delivering premium tailoring services. We believe
              in empowering our employees, fostering creativity, and celebrating
              success together.
            </p>
            <p className="text-muted-foreground">
              Whether you're interested in technology, fashion, customer
              service, or operations, there's a place for you at SuberCraftex.
            </p>
          </CardContent>
        </Card>

        {/* What We Offer */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Competitive Compensation
                </h3>
                <p className="text-muted-foreground">
                  We offer competitive salaries that reflect your skills and
                  experience, along with performance-based bonuses.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Professional Growth
                </h3>
                <p className="text-muted-foreground">
                  Training programs, mentorship opportunities, and clear paths
                  for career advancement within the company.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Inclusive Environment
                </h3>
                <p className="text-muted-foreground">
                  A diverse and welcoming workplace where everyone's
                  contributions are valued and respected.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Work-Life Balance
                </h3>
                <p className="text-muted-foreground">
                  Flexible arrangements where possible, and a culture that
                  respects your time outside of work.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Departments */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Our Departments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Technology & Engineering</h3>
                  <p className="text-sm text-muted-foreground">
                    Building and maintaining our digital platforms
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Customer Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    Supporting and delighting our customers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Tailoring & Production</h3>
                  <p className="text-sm text-muted-foreground">
                    Creating custom garments and alterations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Operations & Logistics</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensuring smooth order fulfillment and delivery
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Marketing & Sales</h3>
                  <p className="text-sm text-muted-foreground">
                    Growing our brand and customer base
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Finance & Administration</h3>
                  <p className="text-sm text-muted-foreground">
                    Managing business operations and finances
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Openings */}
        <Card className="mb-12">
          <CardContent className="p-8 text-center">
            <Briefcase className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Current Openings</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              We're always interested in meeting talented people. While we may
              not have specific positions listed at the moment, we welcome
              applications from individuals who are passionate about what we do.
            </p>
            <p className="text-muted-foreground">
              Check back regularly for new opportunities, or send us your resume
              to be considered for future roles.
            </p>
          </CardContent>
        </Card>

        {/* How to Apply */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">How to Apply</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Interested in joining our team? We'd love to hear from you! Send
              us your application including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Your updated CV/Resume</li>
              <li>A brief cover letter telling us about yourself</li>
              <li>The position or department you're interested in</li>
              <li>Your portfolio (if applicable)</li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:careers@subercraftex.com"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                careers@subercraftex.com
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>
                  SuberCraftex is operated by{" "}
                  <a
                    href="https://camsoltechnology.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Camsol Technologies Ltd
                  </a>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
