import { SettingTypes } from '@/lib/settings'

/**
 * The investor agreement. Written to be read by people, not lawyers: every rule that moves
 * money is stated with a worked example in FCFA, and the risks are listed on their own.
 * The numbers come from the settings in force when a version is published, and are frozen
 * into that version.
 */

export interface AgreementRules {
  investorProfitPercent: number
  profitHoldDays: number
  exitNoticeDays: number
  machineLockMonths: number
  buyoutOfferDays: number
  buyoutMaxInstalments: number
  payoutFeePercent: number
}

export function rulesFrom(s: Pick<SettingTypes, 'investors.investorProfitPercent' | 'investors.profitHoldDays' | 'investors.exitNoticeDays' | 'investors.machineLockMonths' | 'investors.buyoutOfferDays' | 'investors.buyoutMaxInstalments' | 'payouts.feePercent'>): AgreementRules {
  return {
    investorProfitPercent: s['investors.investorProfitPercent'],
    profitHoldDays: s['investors.profitHoldDays'],
    exitNoticeDays: s['investors.exitNoticeDays'],
    machineLockMonths: s['investors.machineLockMonths'],
    buyoutOfferDays: s['investors.buyoutOfferDays'],
    buyoutMaxInstalments: s['investors.buyoutMaxInstalments'],
    payoutFeePercent: s['payouts.feePercent'],
  }
}

export const RISK_KEYS = ['capital', 'no_return', 'not_bank', 'time_to_exit', 'company_decides'] as const

export function risksText(lang: 'en' | 'fr'): Record<(typeof RISK_KEYS)[number], string> {
  return lang === 'fr'
    ? {
        capital: "Mon capital peut perdre de la valeur : une machine s'use, un produit peut se vendre à perte.",
        no_return: "Aucun bénéfice n'est garanti. Je peux ne rien gagner pendant des mois.",
        not_bank: "Ce n'est pas un dépôt bancaire ni un prêt. Mon argent n'est pas assuré.",
        time_to_exit: 'Sortir prend du temps : préavis, recherche d’un acheteur, paiements échelonnés possibles.',
        company_decides: 'SuberCraftex décide où mon capital est investi et peut le réinvestir.',
      }
    : {
        capital: 'My capital can lose value: a machine wears out, a product can sell at a loss.',
        no_return: 'No profit is guaranteed. I may earn nothing for months.',
        not_bank: 'This is not a bank deposit or a loan. My money is not insured.',
        time_to_exit: 'Leaving takes time: notice, finding a buyer, and possibly payment in instalments.',
        company_decides: 'SuberCraftex decides where my capital is invested and may reinvest it.',
      }
}

export function agreementV2(r: AgreementRules) {
  const p = r.investorProfitPercent
  const c = 100 - p
  const en = `# SuberCraftex Investor Agreement

Please read every part. Each rule that moves money has an example in FCFA. If anything is unclear, ask us before you invest.

## 1. What you are doing
1.1 You give SuberCraftex capital: money (by Mobile Money) or goods (products you bring). SuberCraftex uses it to run its business: stock, machines and other work it expects to be profitable.
1.2 You are not a shareholder of SuberCraftex. You own a claim on the specific products and machine shares your capital is in, and a share of their profit and loss, as described here.
1.3 SuberCraftex decides where your capital goes. Capital that comes back to you (when products sell) is "free capital": you can withdraw it, or SuberCraftex can put it to work again.

## 2. Your money is always traceable
2.1 Every franc is recorded in SuberCraftex's ledger. Your dashboard shows, at any time: free capital, capital in products, capital in machines, machine reserves, profit pending and profit available, and every movement with its reason.
2.2 Entries are never edited or deleted. A mistake is corrected by a new entry that you can see.
2.3 You can download a statement of your account at any time.

## 3. Products
3.1 Each product you fund or bring is a "lot". All lots of the same product, and SuberCraftex's own units of it, form one pool. Every sale is shared across the pool in proportion to what each holder still has, so your stock sells at the same pace as everyone else's.
3.2 For your part of a sale: profit = what the customer paid for it − its cost. You receive your capital back, and ${p}% of the profit. SuberCraftex keeps ${c}%, which pays for running the shop (staff, rent, selling).
   Example: your bag cost 15 000 FCFA and sells for 25 000 FCFA. Profit 10 000. You receive 15 000 capital + ${(10000 * p) / 100} profit.
3.3 Losses are shared the same way. If a product sells below its cost, you carry ${p}% of the loss and SuberCraftex ${c}%.
   Example: cost 15 000, sold for 14 000, loss 1 000. You receive ${15000 - (1000 * p) / 100} (your capital minus your ${p}% of the loss).
3.4 Selling below cost needs a SuberCraftex manager's approval, and the reason is shown on your statement.
3.5 Delivery charges are not product profit. Prices include any taxes; taxes are never counted as profit.
3.6 Profit from a sale is "pending" for ${r.profitHoldDays} days after delivery (the time a customer can return it), then becomes available to withdraw.
3.7 If a customer returns an item after you were paid, the sale is undone: the item becomes yours again in stock, and the capital and profit you received for it are taken back (from free capital, then profit). If that takes your profit below zero, it is recovered from your next earnings.
3.8 Goods you bring are valued by SuberCraftex at their expected wholesale cost. Nothing counts until you accept the value in your dashboard.
3.9 If your goods are lost, stolen or damaged while SuberCraftex holds them, SuberCraftex repays your capital for them in full (except natural disasters and similar events beyond anyone's control).

## 4. Machines
4.1 Machines are owned in shares ("units"). SuberCraftex owns the part it paid for, like any co-owner.
4.2 Every month, each machine's account is closed:
   profit = income from its jobs − job costs (materials, operator time, maintenance, taxes) − its share of electricity (its power × hours used, shared by the real units on the bill) − its floor rent (by area) − depreciation.
4.3 Depreciation spreads the machine's price over its useful life, the same amount every month. It is not lost: it moves from the machine's value into a replacement reserve owned by the co-owners, so that a new machine can be bought when this one wears out.
   Example: a 2 000 000 FCFA machine, 5-year life, 200 000 left at the end: 30 000 FCFA a month go to the reserve.
4.4 The profit left is split ${c}% to SuberCraftex and ${p}% to the owners, by units.
4.5 A month that makes a loss shares nothing; the loss is carried forward and recovered from later profits before anything is shared. If a machine is retired or sold with a loss still carried, owners carry ${p}% of it.

## 5. Leaving
5.1 You can withdraw free capital and available profit at any time (section 6).
5.2 To leave a product lot, give ${r.exitNoticeDays} days' notice. SuberCraftex then either buys your remaining units at their cost, sells them normally (section 3), or lets you collect them.
5.3 To leave a machine, give ${r.exitNoticeDays} days' notice; you must have held the share at least ${r.machineLockMonths} months. Your share is valued at its book value: your capital in the machine + your reserve − your part of any loss still carried. Either side may ask for an independent valuation; whoever asks pays for it and its result is final.
5.4 The other co-owners may buy your share first, within ${r.buyoutOfferDays} days. If none does, SuberCraftex may buy it within ${r.buyoutOfferDays} days, paying at once or in up to ${r.buyoutMaxInstalments} monthly instalments; anything still owed is shown in your account. If nobody buys it, the machine may be sold and the money shared by units among all owners.

## 6. Payouts and fees
6.1 Payouts go to your Mobile Money number by PayWithCAMSOL. PayWithCAMSOL charges ${r.payoutFeePercent}% on top of what you receive. Example: to receive 10 000 FCFA, ${10000 + (10000 * r.payoutFeePercent) / 100} FCFA leave your account.
6.2 SuberCraftex itself charges no fee. Its only income from your capital is its share of profit (sections 3 and 4).
6.3 Payouts are checked by SuberCraftex before they are sent. The money is reserved the moment you ask, so it cannot be spent twice.

## 7. Identity and changes
7.1 Your identity must be verified before you can invest. Your documents are stored privately and seen only by you and authorised SuberCraftex staff.
7.2 SuberCraftex may publish a new version of this agreement. You will be asked to accept it before any new money is invested. Capital already invested stays under the version that applied when it was invested.
7.3 If you disagree with any entry, use the "dispute" button on it. SuberCraftex answers within 14 days.
`

  const fr = `# Contrat Investisseur SuberCraftex

Lisez chaque partie. Chaque règle qui fait bouger de l'argent est accompagnée d'un exemple en FCFA. Si quelque chose n'est pas clair, demandez-nous avant d'investir.

## 1. Ce que vous faites
1.1 Vous confiez du capital à SuberCraftex : de l'argent (par Mobile Money) ou des marchandises (des produits que vous apportez). SuberCraftex l'utilise pour son activité : stock, machines et autres travaux qu'elle estime rentables.
1.2 Vous n'êtes pas actionnaire de SuberCraftex. Vous détenez un droit sur les produits et parts de machines où se trouve votre capital, et une part de leurs bénéfices et pertes, comme décrit ici.
1.3 SuberCraftex décide où va votre capital. Le capital qui vous revient (quand des produits se vendent) est du « capital libre » : vous pouvez le retirer, ou SuberCraftex peut le réinvestir.

## 2. Votre argent est toujours traçable
2.1 Chaque franc est enregistré dans le grand livre de SuberCraftex. Votre tableau de bord montre à tout moment : capital libre, capital en produits, capital en machines, réserves des machines, bénéfice en attente et bénéfice disponible, et chaque mouvement avec sa raison.
2.2 Les écritures ne sont jamais modifiées ni supprimées. Une erreur est corrigée par une nouvelle écriture visible par vous.
2.3 Vous pouvez télécharger un relevé de votre compte à tout moment.

## 3. Produits
3.1 Chaque produit que vous financez ou apportez forme un « lot ». Tous les lots d'un même produit, et les unités propres de SuberCraftex, forment un seul ensemble. Chaque vente est partagée entre tous, en proportion de ce que chacun détient encore : votre stock se vend au même rythme que celui des autres.
3.2 Pour votre part d'une vente : bénéfice = prix payé par le client − coût. Vous récupérez votre capital et ${p} % du bénéfice. SuberCraftex garde ${c} %, qui paie le fonctionnement de la boutique (personnel, loyer, vente).
   Exemple : votre sac a coûté 15 000 FCFA et se vend 25 000 FCFA. Bénéfice 10 000. Vous recevez 15 000 de capital + ${(10000 * p) / 100} de bénéfice.
3.3 Les pertes sont partagées de la même façon. Si un produit se vend sous son coût, vous portez ${p} % de la perte et SuberCraftex ${c} %.
   Exemple : coût 15 000, vendu 14 000, perte 1 000. Vous recevez ${15000 - (1000 * p) / 100} (votre capital moins vos ${p} % de la perte).
3.4 Vendre sous le coût exige l'accord d'un responsable de SuberCraftex, et la raison apparaît sur votre relevé.
3.5 Les frais de livraison ne sont pas du bénéfice produit. Les prix incluent les taxes ; les taxes ne sont jamais comptées comme bénéfice.
3.6 Le bénéfice d'une vente reste « en attente » ${r.profitHoldDays} jours après la livraison (le délai de retour), puis devient disponible au retrait.
3.7 Si un client retourne un article après votre paiement, la vente est annulée : l'article redevient le vôtre en stock, et le capital et le bénéfice reçus sont repris (sur le capital libre, puis le bénéfice). Si votre bénéfice passe sous zéro, il est récupéré sur vos prochains gains.
3.8 Les marchandises apportées sont évaluées par SuberCraftex à leur coût de gros attendu. Rien ne compte tant que vous n'avez pas accepté la valeur dans votre tableau de bord.
3.9 Si vos marchandises sont perdues, volées ou abîmées pendant que SuberCraftex les détient, SuberCraftex vous rembourse leur capital en entier (sauf catastrophes naturelles et événements hors de contrôle de chacun).

## 4. Machines
4.1 Les machines sont détenues en parts (« unités »). SuberCraftex possède la part qu'elle a payée, comme tout copropriétaire.
4.2 Chaque mois, le compte de chaque machine est clôturé :
   bénéfice = recettes de ses travaux − coûts des travaux (matières, temps de l'opérateur, entretien, taxes) − sa part d'électricité (sa puissance × heures d'utilisation, partagée selon les vrais kWh de la facture) − son loyer au sol (selon la surface) − l'amortissement.
4.3 L'amortissement répartit le prix de la machine sur sa durée de vie, le même montant chaque mois. Il n'est pas perdu : il passe de la valeur de la machine à une réserve de remplacement appartenant aux copropriétaires, pour acheter une nouvelle machine quand celle-ci sera usée.
   Exemple : une machine de 2 000 000 FCFA, durée 5 ans, 200 000 restant à la fin : 30 000 FCFA par mois vont à la réserve.
4.4 Le bénéfice restant est partagé ${c} % à SuberCraftex et ${p} % aux propriétaires, selon leurs unités.
4.5 Un mois en perte ne partage rien ; la perte est reportée et récupérée sur les bénéfices suivants avant tout partage. Si une machine est retirée ou vendue avec une perte encore reportée, les propriétaires en portent ${p} %.

## 5. Sortir
5.1 Vous pouvez retirer votre capital libre et votre bénéfice disponible à tout moment (section 6).
5.2 Pour sortir d'un lot de produits, donnez un préavis de ${r.exitNoticeDays} jours. SuberCraftex rachète alors vos unités restantes à leur coût, les vend normalement (section 3), ou vous laisse les récupérer.
5.3 Pour sortir d'une machine, donnez un préavis de ${r.exitNoticeDays} jours ; vous devez détenir la part depuis au moins ${r.machineLockMonths} mois. Votre part est évaluée à sa valeur comptable : votre capital dans la machine + votre réserve − votre part d'une perte encore reportée. Chaque partie peut demander une évaluation indépendante ; celui qui la demande la paie et son résultat est définitif.
5.4 Les autres copropriétaires peuvent acheter votre part en premier, sous ${r.buyoutOfferDays} jours. Sinon, SuberCraftex peut l'acheter sous ${r.buyoutOfferDays} jours, en une fois ou en ${r.buyoutMaxInstalments} mensualités au plus ; ce qui reste dû apparaît dans votre compte. Si personne ne l'achète, la machine peut être vendue et l'argent partagé entre tous les propriétaires selon leurs unités.

## 6. Paiements et frais
6.1 Les paiements vont sur votre numéro Mobile Money via PayWithCAMSOL. PayWithCAMSOL prélève ${r.payoutFeePercent} % en plus de ce que vous recevez. Exemple : pour recevoir 10 000 FCFA, ${10000 + (10000 * r.payoutFeePercent) / 100} FCFA quittent votre compte.
6.2 SuberCraftex elle-même ne prélève aucun frais. Son seul revenu sur votre capital est sa part du bénéfice (sections 3 et 4).
6.3 Les paiements sont vérifiés par SuberCraftex avant l'envoi. L'argent est réservé dès votre demande : il ne peut pas être dépensé deux fois.

## 7. Identité et modifications
7.1 Votre identité doit être vérifiée avant d'investir. Vos documents sont conservés en privé et vus seulement par vous et le personnel autorisé de SuberCraftex.
7.2 SuberCraftex peut publier une nouvelle version de ce contrat. Vous devrez l'accepter avant tout nouvel investissement. Le capital déjà investi reste soumis à la version en vigueur au moment de son investissement.
7.3 Si vous contestez une écriture, utilisez le bouton « contester » sur celle-ci. SuberCraftex répond sous 14 jours.
`
  return { title: 'SuberCraftex Investor Agreement', bodyEn: en, bodyFr: fr }
}

/** The agreement investors accepted before versions existed, kept word for word in substance. */
export const AGREEMENT_V1 = {
  title: 'Investor Agreement (before October 2026)',
  bodyEn: `# Investor Agreement (as accepted before October 2026)

1. Investment structure: investments are made by depositing cash; SuberCraftex allocates funds to products, raw materials or equipment; investors are not shareholders; allocation is at SuberCraftex's discretion.
2. Profit distribution: product sales split net profit 50-50; equipment net profit 50% to the company and 50% shared among the equipment's investors in proportion; capital returns to the cash wallet when products sell; profit accumulates in a profit wallet.
3. Expenses deducted before the split: materials, labour, maintenance, taxes, shipping, other operating expenses.
4. Investment types: product investments (capital back plus 50% of profit on sale) and equipment investments (profit share proportional to investment).
5. Withdrawal rights: cash, profit, product claims and equipment exits, processed in a reasonable time; for equipment exits the company or other investors may buy the share.
6. Equipment exit refunds are based on current equipment value; profits up to the exit date are credited.
7. SuberCraftex may diversify allocations; full transparency in the dashboard.
8. Risks: products may not sell or sell at lower margins; maintenance reduces profit; no guaranteed return.
9. Transparency: dashboard of all investments, profit calculations and transactions.
10. Verification: accurate information, legal capacity, an investment not a loan, one account per person.
11. Suspension and termination for violations; terms may change with 30 days' notice.
`,
  bodyFr: `# Contrat Investisseur (accepté avant octobre 2026)

Résumé du contrat accepté avant la mise en place des versions : dépôts en espèces alloués par SuberCraftex à des produits, matières ou équipements ; bénéfice net des produits partagé 50-50 ; bénéfice net des équipements à 50 % pour la société et 50 % partagés entre les investisseurs de l'équipement au prorata ; dépenses déduites avant partage ; droits de retrait (espèces, bénéfices, produits, sortie d'équipement) ; sortie d'équipement à la valeur actuelle ; aucun rendement garanti ; transparence du tableau de bord ; modification des conditions avec 30 jours de préavis.
`,
  risksEn: 'Products may not sell or may sell at lower margins; equipment needs maintenance; no guaranteed return.',
  risksFr: 'Les produits peuvent ne pas se vendre ou se vendre à marge réduite ; les équipements demandent de l’entretien ; aucun rendement garanti.',
}
