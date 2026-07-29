// Detailed content for each expertise page.
// Kept in TypeScript (not MDX) so it stays tightly typed and easy to edit.

import type { ExpertiseContent } from './expertise-content';

export const expertiseContent: ExpertiseContent[] = [
  {
    slug: 'plan-epargne-retraite',
    heroIntro:
      "The PER (Plan Épargne Retraite, France's personal retirement savings plan) was created by the 2019 PACTE law to simplify a patchwork of older schemes that had become unreadable (Madelin, PERP, article 83, PERCO...). For a taxpayer in the TMI (top marginal income tax bracket) at 30% or above, it is today the most powerful tax-efficient savings tool, provided you understand how it works.",
    pourQui: [
      'Taxpayers in the 30% TMI bracket or above',
      'Company directors and TNS (self-employed professionals) with high, variable income',
      'Athletes nearing the end of their career with very high income',
      'Preparing to buy a primary residence (early withdrawal is possible)',
    ],
    sections: [
      {
        title: 'The principle: from taxed income to deferred income',
        body: "Contributions to a PER are deductible from taxable income up to an annual cap (10% of professional income, within a set range). The tax is not erased: it is deferred to withdrawal, when you are (often) in a lower TMI bracket. The gap between your TMI during your working years and in retirement is the net gain.",
      },
      {
        title: 'The calculation you need to know how to do',
        body: "Contribution times today's TMI equals immediate tax savings. At withdrawal, the capital is taxed at your TMI at that time. The real net gain equals (current TMI minus future TMI) times the contribution, plus the compounded return.",
        list: [
          "Example: €10,000 contributed at a 41% TMI equals €4,100 in immediate tax savings",
          "Withdrawal at a 30% TMI 20 years later equals €3,000 in tax (before compounding)",
          "Net tax gain: €1,100, on top of which comes the compounded growth of the invested capital",
        ],
      },
      {
        title: 'Lump sum or annuity: choosing wisely',
        body: "Since the PACTE law, withdrawing as a lump sum is unrestricted (unlike the old PERP/Madelin plans). The choice between a lump sum, an annuity, or a mix depends on your tax situation at withdrawal, your life expectancy, and your liquidity needs. In most cases, the annuity is tax-penalising for moderate amounts.",
      },
      {
        title: 'Early withdrawal to buy a primary residence',
        body: "The PER allows an early withdrawal to buy a primary residence. This is an under-used lever: contribute, deduct, let it grow, then withdraw for the down payment, all while having reduced your tax bill during the accumulation phase.",
      },
      {
        title: 'Individual PER vs company PER',
        body: "The PERin (individual PER) is managed by the policyholder. The PERCOL/PERO (company PER) often comes with an employer top-up (abondement) that multiplies the savings effort. For a company director, combining both lets you stack the contribution caps.",
      },
    ],
    chiffresCles: [
      { label: 'Contribution cap', value: '10% of professional income' },
      { label: 'Worthwhile from TMI', value: '30%' },
      { label: 'Lump-sum withdrawal', value: 'Unrestricted since 2019' },
      { label: 'Early withdrawal exception', value: 'Primary residence' },
    ],
    piegesClassiques: [
      "Opening a PER at an 11% TMI, where the deduction yields almost nothing",
      "Leaving a PER on a defensive managed-allocation track from age 45, at the cost of performance",
      "Ignoring entry fees (some contracts take 2 to 5%)",
      "Overlooking the tax treatment on death before the plan is liquidated",
    ],
    faq: [
      {
        q: 'Can I open a PER even if I am an employee?',
        a: "Yes. The individual PER is open to everyone, regardless of employment status. If your employer offers a company PER, you can hold both at once.",
      },
      {
        q: 'How much should I contribute each year for it to be worthwhile?',
        a: "There is no technical minimum. Economically, it becomes worthwhile from a 30% TMI and a horizon of 10 years or more. Below that, other savings vehicles make more sense.",
      },
      {
        q: 'What happens to my PER if I die?',
        a: "Favourable tax treatment applies if death occurs before age 70 (a €152,500 allowance per beneficiary, taxed at 20 to 31.25%). After 70, the regime is less favourable. This should be planned for as part of your estate strategy.",
      },
    ],
  },
  {
    slug: 'assurance-vie',
    heroIntro:
      "Assurance-vie (life insurance-based savings, France's flagship investment wrapper) remains, well past age 40, the benchmark tax vehicle in France. Tax-deferred growth, annual allowances after 8 years, transfer outside the estate: the sheer range of its uses makes it the foundation of any wealth strategy.",
    pourQui: [
      'Anyone looking to grow capital over the medium to long term',
      'Those looking to optimise wealth transfer',
      'Investors seeking flexibility and diversification',
      'Savers who want to avoid the PER lock-in',
    ],
    sections: [
      {
        title: 'The triple strength of assurance-vie',
        body: "A multi-asset wrapper (guaranteed euro funds plus unit-linked funds), a tax rate that steps down with a pivot at 8 years, and a transfer that sits outside the taxable estate within legal limits. No other product combines all three advantages.",
      },
      {
        title: 'The 8-year rule',
        body: "After 8 years, withdrawals benefit from an annual allowance (€4,600 for a single person, €9,200 for a couple). Beyond that, a 7.5% PFL (flat withholding tax) applies, up to €150,000 of contributions net of withdrawals. This is the threshold that turns an assurance-vie policy into a genuine tax-efficient income machine.",
        list: [
          "0 to 8 years: standard taxation (30% PFU flat tax, or the progressive scale)",
          "After 8 years: annual allowance plus 7.5% PFL below €150,000 contributed",
          "Social charges (17.2%) are due in all cases",
        ],
      },
      {
        title: 'Structure: euro funds plus unit-linked funds',
        body: "The euro fund guarantees the capital, but its yield keeps declining. Unit-linked funds (UC) provide the performance engine but carry market risk. The balance between the two should be actively managed based on your time horizon, tax situation, and risk profile, not left to the contract's default allocation.",
      },
      {
        title: 'Wealth transfer: the most under-used lever',
        body: "Contributions made before age 70: a €152,500 allowance per beneficiary, then 20% tax (31.25% above €852,500). After 70: an overall allowance of €30,500, but capital gains are exempt. Properly structured, an assurance-vie policy can pass on €500k to €1M free of transfer duty.",
      },
      {
        title: 'Choosing the right contract',
        body: "Not all contracts are equal. Differences in entry fees (0 to 5%), unit-linked management fees (0.5% to 1.2%), the quality of the euro fund, and the investment universe can add up to several percentage points of return over 20 years.",
      },
    ],
    chiffresCles: [
      { label: 'Tax pivot', value: '8 years' },
      { label: 'Annual allowance', value: '€4,600 / €9,200' },
      { label: 'Transfer allowance', value: '€152,500 / beneficiary' },
      { label: 'Social charges', value: '17.2%' },
    ],
    piegesClassiques: [
      "Sticking with a mass-market bank contract with high fees",
      "Leaving 100% in the euro fund 'by default' for 15 years",
      "Naming 'my heirs' instead of precisely naming the beneficiaries",
      "Contributing after age 70 without checking the transfer-versus-return logic",
    ],
    faq: [
      {
        q: 'How many contracts should I open?',
        a: "One main contract is enough for most profiles. Several contracts can make sense to separate objectives (savings versus transfer) or to diversify across insurers above €200k.",
      },
      {
        q: 'Should I take out a policy before 70 at all costs?',
        a: "Yes, to maximise the transfer benefit, but not to the point of putting money into a poor contract. The quality of the vehicle always comes before the calendar.",
      },
    ],
  },
  {
    slug: 'scpi',
    heroIntro:
      "SCPI (Sociétés Civiles de Placement Immobilier, French real estate investment trusts) let you invest in a professionally managed property portfolio without handling the management yourself. Pooled risk, accessibility (entry tickets from a few thousand euros), historical returns of around 4 to 6%: a solid building block for a portfolio, provided you choose with a clear method.",
    pourQui: [
      "Savers seeking regular income",
      "Investors wanting to diversify beyond standard residential property",
      'Those who want to avoid the burden of managing tenants',
      'Bare-ownership (nue-propriété) or debt-financed strategies',
    ],
    sections: [
      {
        title: 'The three main families of SCPI',
        body: "Income SCPI (offices, retail, healthcare, logistics): income comes first. Tax-driven SCPI (Malraux, déficit foncier, Pinel): tax reduction comes first. Capital-gain SCPI: patience and compounding. The right method starts with knowing what you are looking for before you buy.",
      },
      {
        title: 'European SCPI: the quiet tax revolution',
        body: "SCPI invested outside France (Germany, the Netherlands, Spain...) often benefit from more favourable tax treatment: no social charges on the foreign-sourced share of income, and a tax credit or exemption depending on the relevant tax treaty. For a French resident at a high TMI, this is a net gain of 17.2% on the income concerned.",
      },
      {
        title: 'Buying outright, in bare ownership, or on credit',
        body: "Three different logics: outright for immediate income; in temporary bare ownership (30 to 40% off the price) to build a retirement top-up with no tax during the split-ownership period; on credit to activate leverage and deduct the interest.",
      },
      {
        title: 'Fees: the absolute point of caution',
        body: "Subscription fees (8 to 12%) are only recovered after several years of distributions. An SCPI held for less than 8 to 10 years is very rarely profitable. Liquidity is also imperfect: plan for a long time horizon.",
      },
      {
        title: 'Holding SCPI inside an assurance-vie policy',
        body: "Some SCPI are accessible through assurance-vie contracts: the tax treatment then becomes that of the policy (much better over time), but you usually give up some yield and the flexibility of buying on credit. This trade-off needs to be assessed case by case.",
      },
    ],
    chiffresCles: [
      { label: 'Average yield', value: '~4 to 6%' },
      { label: 'Entry ticket', value: '~€1,000' },
      { label: 'Entry fees', value: '8 to 12%' },
      { label: 'Minimum horizon', value: '8 to 10 years' },
    ],
    piegesClassiques: [
      "Buying on the headline gross yield alone",
      "Ignoring recent fundraising (too much cash on hand means dilution)",
      "Underestimating subscription fees over a short horizon",
      "Concentrating on a single SCPI or a single sector",
    ],
    faq: [
      {
        q: 'How are SCPI income payments taxed?',
        a: "Income is taxed as property income: your TMI plus 17.2% in social charges. This is what makes European SCPI and split-ownership strategies worth considering.",
      },
      {
        q: 'Can SCPI be bought on credit?',
        a: "Yes, and it is often worthwhile: loan interest is deductible from property income, which reduces the tax bill. Leverage can transform the net return.",
      },
    ],
  },
  {
    slug: 'defiscalisation',
    heroIntro:
      "Reducing tax is never an end in itself. The right instinct is to look first for an investment that makes economic sense, then identify the tax scheme that makes it more efficient. Doing it the other way round leads to buying economically poor products for a few thousand euros of tax savings.",
    pourQui: [
      'Taxpayers at a 30% TMI or above',
      'French tax residents outside special regimes',
      'Those with a clear investment horizon',
    ],
    sections: [
      {
        title: 'The golden rule: tax savings do not equal profitability',
        body: "An 18% tax reduction on an investment that returns minus 25% is not a good investment. The question to ask is never 'how much will I save?', but 'does the underlying asset stand on its own without the tax break?'.",
      },
      {
        title: 'The schemes that actually work',
        body: "In order of robustness for most high-TMI profiles:",
        list: [
          "PER: a universal, flexible deduction tool, with unrestricted withdrawal since 2019",
          "Déficit foncier (property-renovation loss offset): very powerful for owners of older properties needing renovation",
          "Girardin industriel: a one-off tax reduction, to be handled only with a solid counterparty",
          "FCPI/FIP (innovation and regional investment funds): 18 to 25% tax reduction, but disappointing historical performance on average",
          "Malraux / Monuments Historiques (heritage building schemes): for substantial estates, on exceptional properties",
        ],
      },
      {
        title: 'The overall cap on tax loopholes',
        body: "€10,000 a year for most schemes (€18,000 including Girardin / Sofica / overseas investment). This cap fills up quickly for high-earning households, which makes prioritisation a strategic exercise.",
      },
      {
        title: 'Schemes outside the cap: the ones worth knowing',
        body: "PER, the Malraux law, déficit foncier, and Monuments Historiques: these levers do not count towards the overall €10,000 cap. For a household that has already maxed out its cap, these are the real remaining levers.",
      },
    ],
    chiffresCles: [
      { label: 'Overall cap', value: '€10,000/year' },
      { label: 'Overseas territories cap', value: '€18,000/year' },
      { label: 'Outside the cap', value: 'PER, Malraux, déficit foncier' },
      { label: 'Worthwhile from TMI', value: '30%' },
    ],
    piegesClassiques: [
      "Rushing into a Pinel investment in December just to cut your tax bill",
      "Buying FCPI funds without checking the manager's track record and the fees",
      "Subscribing to Girardin schemes without checking the arranger's financial soundness",
      "Stacking schemes without a strategy and maxing out your caps on mediocre products",
    ],
    faq: [
      {
        q: 'Which scheme is the most profitable?',
        a: "There isn't a single answer: it depends on your TMI, your horizon, your existing assets, and your risk tolerance. The PER is the most universally relevant option above a 30% TMI.",
      },
      {
        q: 'Should I reduce my tax every year?',
        a: "No. In some years, nothing is worth doing. Forcing a mediocre tax scheme just to 'do something' is often the worst decision you can make.",
      },
    ],
  },
  {
    slug: 'transmission',
    heroIntro:
      "Planning the transfer of your estate is not about betting on your own death, it is about protecting your family from the administrative and tax chaos that follows a death. Planned well in advance, it can cut by a factor of 2 to 4 the transfer duties your loved ones will owe.",
    pourQui: [
      'Parents and grandparents wanting to help their descendants',
      'Couples wanting to protect the surviving spouse',
      'Business owners preparing to hand over their company',
      'Those with an estate above €500k',
    ],
    sections: [
      {
        title: 'Allowances: the first lever, and it is free',
        body: "Every 15 years, each parent can give each child €100,000 free of transfer duty. For a couple with two children, that is €400,000 that can be passed on tax-free, and the allowance renews. The 'clock' starts running from the first gift, which is why there is real value in not waiting.",
        list: [
          "Parent to child: €100,000",
          "Grandparent to grandchild: €31,865",
          "Between spouses: €80,724",
          "Family gift of a sum of money (donor under 80): an additional €31,865",
        ],
      },
      {
        title: 'Split ownership: giving away the bare ownership',
        body: "Giving away the bare ownership while keeping the usufruct (the right to use the asset and collect its income) means transferring an asset at a value discounted by age, while keeping the income and enjoyment of it. On death, the usufruct merges back into the bare ownership with no further duty due. Particularly powerful for real estate and company shares.",
      },
      {
        title: 'Assurance-vie: a counterweight to inheritance law',
        body: "Assurance-vie sits outside the estate. With a €152,500 allowance per beneficiary for contributions made before age 70, it is the most flexible tool for providing for people outside the usual family framework (a child from a first marriage, an unmarried partner, a godchild) or for balancing out an inheritance.",
      },
      {
        title: 'The Dutreil pact: the tool for business owners',
        body: "For a business transfer, the Dutreil pact offers a 75% exemption on the value transferred. Combined with a gift in bare ownership, it can allow a company valued at €2M to be passed on with duty paid on only around €500k (indicative figures, to be modelled precisely for your situation).",
      },
      {
        title: 'The donation-partage: securing fairness among heirs',
        body: "It fixes the value of the assets on the day of the gift, which prevents an heir who received an asset that later gains value from being left 'out of balance' relative to their siblings at the time of death. A major tool for family fairness.",
      },
    ],
    chiffresCles: [
      { label: 'Parent-to-child allowance', value: '€100,000 / 15 years' },
      { label: 'Assurance-vie allowance', value: '€152,500 / beneficiary' },
      { label: 'Dutreil exemption', value: '75%' },
      { label: 'Bare-ownership discount at 60', value: '-50%' },
    ],
    piegesClassiques: [
      "Waiting for 'later' to make the first gift, losing an entire 15-year cycle",
      "Forgetting to update beneficiary clauses after a major life change",
      "Confusing a gift with a family loan (risking tax requalification)",
      "Passing on assets without preparing heirs to manage the wealth they receive",
    ],
    faq: [
      {
        q: 'At what age should I start passing on my wealth?',
        a: "As soon as your wealth is built up and your own financial security is assured. The allowance renews every 15 years: starting at 55 allows for two full cycles. Starting at 70, you lose one.",
      },
      {
        q: 'Can I keep control after making a gift?',
        a: "Yes, through split ownership (keeping the usufruct) or a right-of-return clause. You transfer legal ownership without losing the use of the asset or its income.",
      },
    ],
  },
  {
    slug: 'immobilier-lmnp-demembrement',
    heroIntro:
      "Beyond the primary residence, real estate can play several very different roles in a portfolio: rental income, credit leverage, wealth transfer, tax reduction. Three structures deserve particular attention: LMNP, temporary bare ownership, and SCPI split ownership.",
    pourQui: [
      'Investors seeking lightly taxed income',
      'High-TMI profiles who want to avoid the standard property-income regime',
      'Retirement-planning strategies over 10 to 15 years',
      'Optimising an existing estate',
    ],
    sections: [
      {
        title: 'LMNP: near-complete tax relief on rental income',
        body: "The LMNP status (Loueur Meublé Non Professionnel, non-professional furnished-letting status) allows, under the actual-expenses regime, the property and furniture to be depreciated. In practice, depreciation wipes out taxable income for 15 to 25 years: the rent comes in almost tax-free. One of the rare schemes where the tax benefit applies without counting against the overall tax-loophole cap.",
      },
      {
        title: 'Temporary bare ownership',
        body: "Buying the bare ownership of a property for 15 to 20 years means paying 55 to 65% of its full price. During that period, the usufructuary (often an institutional landlord) collects the rent and covers maintenance. You receive nothing, declare nothing, and pay no IFI (wealth tax) on that portion. At the end of the period, you recover full ownership tax-free.",
        list: [
          "Discounted purchase price (~65% of full ownership value)",
          "No taxable income during the period",
          "No IFI (wealth tax) on the split-off portion",
          "Full ownership restored tax-free",
        ],
      },
      {
        title: 'SCPI split ownership',
        body: "The same logic applied to SCPI: buying the bare ownership of units for 5 to 10 years at 60 to 80% of their value. Ideal for building a supplementary income stream that will kick in right at retirement, with no tax during the split-ownership phase.",
      },
      {
        title: 'Unfurnished rental property: the classic option worth knowing',
        body: "Under the actual-expenses regime, renovation work generates a déficit foncier that can be offset against overall income (up to €10,700 a year), a powerful tool for a high-TMI investor doing renovation work. But unfurnished letting under the micro-foncier regime remains tax-heavy with no particular leverage.",
      },
    ],
    chiffresCles: [
      { label: 'LMNP: tax over 15-25 years', value: '~0%' },
      { label: 'Bare ownership: discount', value: '30 to 45%' },
      { label: 'Déficit foncier: overall cap', value: '€10,700/year' },
      { label: 'IFI on bare ownership', value: '0' },
    ],
    piegesClassiques: [
      "Confusing classic LMNP with LMNP in a serviced residence (the constraints are very different)",
      "Buying bare ownership without assessing the quality of the usufructuary landlord",
      "Counting on guaranteed rent that turns out to be illusory during vacancy periods",
      "Underestimating management fees on furnished residences",
    ],
    faq: [
      {
        q: 'LMNP or European SCPI, which should I choose?',
        a: "The two are complementary. LMNP means hands-on local control and very low tax, but concentration risk. European SCPI mean diversification and zero management, but less control. The choice depends on how much you want to be involved in managing it yourself.",
      },
    ],
  },
  {
    slug: 'pea-bourse',
    heroIntro:
      "For long-term equity investing, the PEA (Plan d'Épargne en Actions, France's tax-advantaged equity savings plan) remains the most efficient wrapper in French tax law. A €150,000 cap, capital gains exempt from income tax after 5 years (social charges still apply), and deep access to European markets: a tool every growth-oriented investor should master.",
    pourQui: [
      'Investors with a horizon of 5 years or more',
      'Those willing to accept volatility in exchange for performance',
      'Savers already holding assurance-vie who are looking for an equity complement',
      "Couples: PEA plus the spouse's PEA equals a €300,000 combined cap",
    ],
    sections: [
      {
        title: 'The simple rule: patience in exchange for tax relief',
        body: "Before 5 years, any withdrawal closes the plan and triggers the 30% PFU flat tax. After 5 years, gains are exempt from income tax, with only the 17.2% in social charges still due. The plan then becomes a flexible withdrawal tool with genuinely favourable, tapering taxation.",
      },
      {
        title: 'Standard PEA plus PEA-PME: a winning combination',
        body: "The caps can be combined: €150,000 on the PEA and €225,000 on the PEA-PME (within an overall limit of €225,000). The PEA-PME is an excellent complement for gaining exposure to small and mid-cap European stocks, with the same favourable tax treatment.",
      },
      {
        title: 'ETFs: the preferred vehicle for the long term',
        body: "PEA-eligible ETFs (using synthetic replication) let you gain exposure to global indices while staying within the French wrapper. MSCI World, S&P 500, Nasdaq: you can build a diversified portfolio at very low cost (0.20 to 0.35% a year).",
      },
      {
        title: 'Active or passive management: the real debate',
        body: "Over 10 years, fewer than 20% of actively managed funds beat their benchmark index after fees. For most wealth-building profiles, a core allocation in index ETFs, possibly complemented with a few targeted active positions, is the best compromise.",
      },
      {
        title: 'Rebalancing and dividends',
        body: "Rebalancing within the PEA is never taxable, which is a huge advantage for adjusting your allocation over time. Dividends received inside the plan are not taxed as long as they stay within it.",
      },
    ],
    chiffresCles: [
      { label: 'PEA cap', value: '€150,000' },
      { label: 'PEA-PME cap', value: '€225,000' },
      { label: 'Tax pivot', value: '5 years' },
      { label: 'After 5 years', value: '17.2% social charges only' },
    ],
    piegesClassiques: [
      "Closing the plan on a whim before 5 years and losing the entire benefit",
      "Leaving the PEA in cash for years while 'waiting for the right moment'",
      "Paying high brokerage fees through a retail bank",
      "Concentrating on 3-4 French stocks instead of diversifying",
    ],
    faq: [
      {
        q: 'PEA or assurance-vie for equity investing?',
        a: "Both have their place. PEA means unbeatable tax treatment after 5 years, but a universe limited to Europe (except via synthetic ETFs). Assurance-vie means flexibility, wealth transfer benefits, and direct access to global markets. Ideally, you combine the two.",
      },
    ],
  },
  {
    slug: 'epargne-salariale-dirigeant',
    heroIntro:
      "Company directors and TNS (self-employed professionals) have access to powerful retirement and employee-savings tools that are often poorly used. Properly structured, they allow you to pay yourself deferred, tax-efficient compensation, topped up by the company, entirely within the law.",
    pourQui: [
      'Directors treated as employees for social security purposes (SAS chairman, minority SARL manager)',
      'TNS, self-employed professionals (majority SARL manager, sole trader, liberal profession)',
      'Employees or directors within a company',
      'Employees with an employer top-up (abondement)',
    ],
    sections: [
      {
        title: 'PEE, PER-COL: the power of the employer top-up',
        body: "When the company tops up a PEE (employee savings plan), every euro contributed by the employee or director can be tripled (a cap of 300% of the contribution, within a limit of 8% of the PASS). This top-up escapes income tax and standard employer social contributions, making it one of the tools with the highest tax ROI.",
      },
      {
        title: 'Intéressement and participation (profit-sharing schemes)',
        body: "Mandatory schemes (participation) or optional ones (intéressement) turn company profit into deferred compensation for employees, with favourable tax treatment if placed into a PEE or PERCOL. For a director-shareholder, structuring these schemes intelligently can double the wealth-building effect.",
      },
      {
        title: 'The Madelin law (still relevant)',
        body: "Although the PER has absorbed part of what Madelin used to cover, existing older contracts remain worthwhile. For a self-employed professional, the deductibility of Madelin health, provident, and retirement contributions remains a concrete lever for tax-efficient compensation.",
      },
      {
        title: 'Article 83 / mandatory company PER: shared-cost retirement savings',
        body: "A mandatory contract for a given category of employees. Company contributions are deductible, not taxable for the employee, and not subject to social contributions within certain limits. For a well-advised director, this is a genuine multiplier over time.",
      },
      {
        title: 'Combining schemes without overlap',
        body: "An individual PER, a PERCOL, and a mandatory PER can all coexist, each with its own cap. A well-designed strategy can combine them to reach €30k to €50k a year of deductible or non-taxable contributions.",
      },
    ],
    chiffresCles: [
      { label: 'Maximum PEE top-up', value: '300% of the contribution' },
      { label: 'Top-up cap', value: '8% of the PASS' },
      { label: 'PASS 2025', value: '€47,100' },
      { label: 'Madelin deductibility', value: 'Up to ~€76k' },
    ],
    piegesClassiques: [
      "Not setting up a PEE in a small business because it 'seems complicated' (it is actually simple)",
      "Topping up too little and leaving tax ROI on the table",
      "Forgetting to enrol a collaborating spouse in the scheme",
      "Mixing short-term savings and retirement savings in a single wrapper",
    ],
    faq: [
      {
        q: 'Can a director with no employees have a PEE?',
        a: "Yes, provided the company has at least one employee (even part-time). A director treated as an employee, or a self-employed director, can benefit from it on the same basis.",
      },
    ],
  },
  {
    slug: 'private-equity-non-cote',
    heroIntro:
      "Private markets have historically delivered higher returns than listed markets, with lower correlation. But the dispersion of performance is enormous: the best funds return 2 to 3 times the capital invested, the worst destroy it. Selection and diversification are everything.",
    pourQui: [
      'Estates above €300k that can lock up a portion of capital for 8 to 10 years',
      'Those seeking decorrelation and performance',
      'High-TMI taxpayers looking for tax-advantaged vehicles (FCPI/FIP/FCPR)',
      'Investors willing to accept very limited liquidity',
    ],
    sections: [
      {
        title: 'Vehicle families',
        body: "FCPR and FPCI (standard private equity funds, open to eligible professional investors), FCPI/FIP (tax-advantaged funds with 18 to 25% tax reduction), evergreen funds (more liquid), and direct club deals. Each structure serves a different objective: tax relief, performance, or access.",
      },
      {
        title: 'Dispersion: the main risk',
        body: "Over 20 years, the gap between the top and bottom quartile of private equity (PE) exceeds 15 points of annual IRR. Putting a single ticket into 'one' private fund is speculative. The real method is to build a programme across several vintage years and several strategies.",
      },
      {
        title: 'FCPI/FIP: keeping the tax reduction in perspective',
        body: "An immediate 18% reduction looks appealing on paper. But the average net performance of FCPI funds has historically been disappointing, and the tax reduction often just offsets the underperformance. Reserve these for carefully selected managers, not for buying off a bank's catalogue.",
      },
      {
        title: 'Tax-transparent FCPR and FPCI',
        body: "After 5 years, capital gains on some FCPR/FPCI funds are exempt from income tax (social charges still apply), equivalent to PEA tax treatment. For a wealth-focused investor genuinely seeking performance, this is often far more efficient than an FCPI.",
      },
      {
        title: 'Accessing private markets through assurance-vie or a PER',
        body: "Since the 2023 'green industry' law, access to private markets through assurance-vie and PER contracts has become easier. This route is worth exploring: it combines the tax wrapper with the asset class, with liquidity managed by an intermediary.",
      },
    ],
    chiffresCles: [
      { label: 'FCPI/FIP reduction', value: '18% (25% LDF)' },
      { label: 'Minimum horizon', value: '8 to 10 years' },
      { label: 'Historical top-quartile PE IRR', value: '~12 to 18%' },
      { label: 'Recommended portfolio share', value: '5 to 15%' },
    ],
    piegesClassiques: [
      "Concentrating on a single fund, a single vintage, a single segment",
      "Underestimating the J-curve and panicking during the early years of negative valuation",
      "Treating the tax benefit as the main argument without looking at manager quality",
      "Overlooking fees (all-in private equity fees can reach 3 to 5% a year)",
    ],
    faq: [
      {
        q: 'What share of my wealth can go into private markets?',
        a: "For an established liquid portfolio, a range of 5 to 15% is reasonable. Below €300k to €500k in financial assets, exposure to this asset class is often premature.",
      },
    ],
  },
  {
    slug: 'credit-strategie-patrimoniale',
    heroIntro:
      "A well-structured loan is not a burden, it is an asset. Real estate leverage, lombard lending, interest-only loans (prêt in fine): used with method, credit lets you build wealth far beyond what savings alone would allow.",
    pourQui: [
      'Property investors seeking leverage',
      'Directors with strong borrowing capacity',
      'Financial assets above €300k (giving access to lombard lending)',
      'Those wanting to optimise property-income taxation',
    ],
    sections: [
      {
        title: 'Real estate leverage',
        body: "Financing 100 to 110% of a property's price with only a 10 to 30% down payment multiplies your ultimate wealth. Over 20 years, a property bought with a 20% down payment and self-financed by rent can translate into a mortgage-free asset worth 4 to 5 times the initial down payment, in nominal terms, before tax.",
      },
      {
        title: 'Lombard lending: powerful and often misunderstood',
        body: "A loan secured against a financial portfolio (assurance-vie, a securities account, a Luxembourg contract). You borrow 50 to 70% of the portfolio's value without liquidating it. Ideal for seizing an opportunity without triggering tax, or for investing in real estate without tapping into your savings. Caution: the portfolio needs to be able to absorb a margin call without drama.",
      },
      {
        title: 'Interest-only (in fine) loans: the right choice for highly leveraged rental property',
        body: "Only the interest is repaid during the term, with the capital repaid at maturity (often through a linked assurance-vie policy). Interest is higher than on a standard repayment loan, but it is deductible from property income, so the net outcome can be very favourable at a high TMI.",
      },
      {
        title: 'Fixed, variable, or mixed rates: reading beyond the APR',
        body: "The TAEG (APR) alone is not enough. The questions that really matter: term, adjustability, flexibility for early repayment (are prepayment penalties capped?), portability, and borrower's insurance. Over 20 years, thorough overall negotiation is often worth €30k to €60k.",
      },
      {
        title: 'Debt and borrowing capacity: going beyond the 35% threshold',
        body: "The HCSF's 35% debt-to-income rule is a theoretical ceiling. Wealth-building profiles can go beyond it through the 20% exemption granted to banks, or through dedicated structures (private banking, lombard lending, tailored estate-planning arrangements). Well-informed advice can sometimes unlock €200k to €500k of extra borrowing capacity.",
      },
    ],
    chiffresCles: [
      { label: 'Maximum debt ratio', value: '35% (+20% exemption)' },
      { label: 'Lombard: usual loan-to-value', value: '50 to 70%' },
      { label: 'In fine: deductible interest', value: '100%' },
      { label: "Borrower's insurance cost", value: '0.10 to 0.50%/year' },
    ],
    piegesClassiques: [
      "Borrowing to the maximum with no safety buffer for the unexpected",
      "Taking the bank's borrower's insurance without shopping around (a difference of €5k to €15k)",
      "Choosing an in fine loan with no clear strategy for building up the repayment capital",
      "Underestimating margin calls on a lombard loan in the event of a market correction",
    ],
    faq: [
      {
        q: 'Should I make an early repayment if I have cash available?',
        a: "Not always. As long as the loan rate is lower than the expected net return on investment, keeping the loan and investing the cash is more profitable. The calculation needs to account for the tax treatment on both sides.",
      },
    ],
  },
];
