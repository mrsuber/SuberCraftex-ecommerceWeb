import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CertificateForm } from "@/components/dashboard/CertificateForm";
import { ArrowLeft, Award, Calendar, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Certificates | Dashboard",
  description: "Manage apprentice certificates",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CertificatesPage({ params }: PageProps) {
  const user = await requireAuth();
  const { id } = await params;

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const apprentice = await db.apprentice.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      apprenticeNumber: true,
    },
  });

  if (!apprentice) {
    notFound();
  }

  const certificates = await db.apprenticeCertificate.findMany({
    where: { apprenticeId: id },
    orderBy: { issuedDate: "desc" },
  });

  // Get issuer info for each certificate
  const certificatesWithIssuers = await Promise.all(
    certificates.map(async (cert) => {
      const issuedByUser = await db.user.findUnique({
        where: { id: cert.issuedBy },
        select: { id: true, fullName: true, email: true },
      });
      return { ...cert, issuedByUser };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/apprentices/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-muted-foreground">
            {apprentice.fullName} ({apprentice.apprenticeNumber})
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Issue New Certificate */}
        <Card>
          <CardHeader>
            <CardTitle>Issue New Certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <CertificateForm
              apprenticeId={id}
              apprenticeName={apprentice.fullName}
            />
          </CardContent>
        </Card>

        {/* Existing Certificates */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Issued Certificates</h2>
          {certificatesWithIssuers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No certificates issued yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {certificatesWithIssuers.map((cert) => (
                <Card key={cert.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                        <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{cert.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {cert.certificateNumber}
                            </p>
                          </div>
                        </div>

                        {cert.description && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {cert.description}
                          </p>
                        )}

                        {cert.skills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {cert.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Issued {new Date(cert.issuedDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>
                              By {cert.issuedByUser?.fullName || cert.issuedByUser?.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
