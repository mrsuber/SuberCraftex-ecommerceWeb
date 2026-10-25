"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldAlert } from "lucide-react";

interface Agreement {
  id: string;
  version: number;
  title: string;
  bodyEn: string;
  bodyFr: string;
  publishedAt: string;
  risks: { en: Record<string, string>; fr: Record<string, string> };
  riskKeys: string[];
  fullName: string;
  accepted: boolean;
}

/** Headings, numbered clauses and indented examples, from the agreement's plain text */
export function AgreementText({ text }: { text: string }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-gray-800">
      {text.split("\n").map((line, i) => {
        if (line.startsWith("# ")) return <h2 key={i} className="text-2xl font-bold pt-2">{line.slice(2)}</h2>;
        if (line.startsWith("## ")) return <h3 key={i} className="text-lg font-semibold pt-4">{line.slice(3)}</h3>;
        if (!line.trim()) return null;
        if (line.startsWith("   ")) return <p key={i} className="ml-6 rounded bg-muted/50 px-3 py-1 text-[13px]">{line.trim()}</p>;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

const T = {
  en: {
    risksTitle: "Before you agree, confirm you understand each risk",
    nameLabel: "Type your full name to sign",
    accept: "I accept this agreement",
    version: "Version",
    published: "published",
  },
  fr: {
    risksTitle: "Avant d'accepter, confirmez que vous comprenez chaque risque",
    nameLabel: "Tapez votre nom complet pour signer",
    accept: "J'accepte ce contrat",
    version: "Version",
    published: "publiée le",
  },
};

export function VersionedAgreement() {
  const router = useRouter();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [risks, setRisks] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/investors/agreement")
      .then((r) => r.json())
      .then(setAgreement);
  }, []);

  if (!agreement) return <p className="text-center text-muted-foreground">Loading the agreement…</p>;
  const t = T[lang];

  const accept = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/investors/agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId: agreement.id, typedName: name, risks, language: lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save");
      router.push("/investor/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{agreement.title}</CardTitle>
          <div className="flex gap-1">
            <Button size="sm" variant={lang === "en" ? "default" : "outline"} onClick={() => setLang("en")}>English</Button>
            <Button size="sm" variant={lang === "fr" ? "default" : "outline"} onClick={() => setLang("fr")}>Français</Button>
          </div>
        </div>
        <CardDescription>
          {t.version} {agreement.version}, {t.published} {new Date(agreement.publishedAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="max-h-[60vh] overflow-y-auto rounded-lg border p-4">
          <AgreementText text={lang === "en" ? agreement.bodyEn : agreement.bodyFr} />
        </div>

        {agreement.accepted ? (
          <p className="text-sm text-green-700">You have accepted this version.</p>
        ) : (
          <>
            <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 font-semibold text-amber-900">
                <ShieldAlert className="h-5 w-5" /> {t.risksTitle}
              </div>
              {agreement.riskKeys.map((key) => (
                <label key={key} className="flex items-start gap-3 text-sm cursor-pointer">
                  <Checkbox
                    checked={risks.includes(key)}
                    onCheckedChange={(v) => setRisks((r) => (v ? [...r, key] : r.filter((k) => k !== key)))}
                  />
                  <span>{agreement.risks[lang][key]}</span>
                </label>
              ))}
            </div>
            <div className="space-y-1">
              <Label htmlFor="sign-name">{t.nameLabel}: <span className="font-semibold">{agreement.fullName}</span></Label>
              <Input id="sign-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              className="w-full"
              size="lg"
              disabled={saving || risks.length !== agreement.riskKeys.length || !name.trim()}
              onClick={accept}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.accept}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
