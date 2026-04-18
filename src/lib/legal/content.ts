export type LegalSection = {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro: string;
  draftNotice: string;
  sections: LegalSection[];
};

const LAST_UPDATED = "2026-04-17";
const COMPANY_LEGAL_NAME = "PeptidLabs (търговско име)";

export const termsContent: Record<"bg" | "en", LegalDocument> = {
  bg: {
    title: "Общи условия за ползване",
    lastUpdated: LAST_UPDATED,
    intro: `Настоящите Общи условия уреждат отношенията между ${COMPANY_LEGAL_NAME} (наричан „Доставчик") и физическите или юридическите лица, които използват уебсайта peptidlabs.eu (наричани „Клиент"). С поставянето на поръчка Клиентът потвърждава, че е прочел, разбрал и приема тези условия изцяло.`,
    draftNotice:
      "Версия в сила от 17.04.2026 г. За въпроси — support@peptidlabs.eu. При промени ще уведомим потребителите чрез имейл и ще обновим номера на версията в долния край на страницата.",
    sections: [
      {
        id: "definitions",
        heading: "1. Дефиниции",
        list: [
          "Изследователски пептид — лиофилизиран биохимичен реагент, предназначен единствено за in vitro изследвания и лабораторна употреба.",
          "Сертификат за анализ (COA) — документ, издаден от независима лаборатория, удостоверяващ чистота ≥98% по HPLC.",
          "Платформа — уебсайтът peptidlabs.eu и всички свързани услуги.",
        ],
      },
      {
        id: "research-use",
        heading: "2. Предназначение на продуктите — изследователска употреба",
        paragraphs: [
          "Всички предлагани продукти са реагенти за научни изследвания. Не са лекарствени средства, хранителни добавки или козметични продукти и не са предназначени за употреба при хора или животни.",
          "Клиентът потвърждава, че продуктите ще се използват единствено в лицензирани научни, образователни или лабораторни условия от обучен персонал. Забранено е препродаването, администрирането или популяризирането на продуктите за цели извън научна изследователска дейност.",
        ],
      },
      {
        id: "eligibility",
        heading: "3. Изисквания към Клиента",
        list: [
          "Клиентът трябва да е навършил 18 години.",
          "Клиентът гарантира, че действа от свое име или от името на организация, която има правно основание да закупува изследователски реагенти.",
          "Доставчикът си запазва правото да откаже поръчка при съмнения относно целта на употреба или самоличността на купувача.",
        ],
      },
      {
        id: "orders-pricing",
        heading: "4. Поръчки и цени",
        paragraphs: [
          "Поръчките се приемат чрез онлайн магазина. Потвърждение за получаване на поръчката се изпраща по имейл, като договорът се счита за сключен едва след потвърждение за наличност и експедиция от страна на Доставчика.",
          "Всички цени са в евро (EUR) с включен ДДС, където е приложим. Цените могат да бъдат актуализирани без предизвестие. За вече потвърдените поръчки важи цената към момента на поръчването.",
        ],
      },
      {
        id: "payment",
        heading: "5. Начини на плащане",
        list: [
          "Плащане с банкова карта чрез Stripe — сигурно обработване през PCI DSS сертифициран доставчик.",
          "Наложен платеж (само за доставки в България) — плащане в брой на куриера при получаване.",
          "Доставчикът не съхранява данни от платежни карти. Всички трансакции се обработват от Stripe Payments Europe, Ltd.",
        ],
      },
      {
        id: "shipping",
        heading: "6. Доставка",
        paragraphs: [
          "Стандартен срок на обработка е 24 часа от потвърждаване на поръчката в работни дни. Доставка в България се извършва от Еконт или Спиди в рамките на 1–3 работни дни. Доставка в ЕС се извършва с регистриран куриер в рамките на 3–7 работни дни в зависимост от дестинацията.",
          "Рискът от загуба или повреда преминава върху Клиента след доставка. Клиентът е длъжен да провери пратката при получаване в присъствието на куриера.",
        ],
      },
      {
        id: "returns",
        heading: "7. Връщане и рекламации",
        paragraphs: [
          "Съгласно чл. 57 от Закона за защита на потребителите, правото на отказ не се прилага за доставка на запечатани реагенти, които са разпечатани след доставката и по хигиенни или биохимични причини не могат да бъдат върнати.",
          "Неразпечатани продукти могат да бъдат върнати в срок от 14 дни от получаването им, при условие че опаковката е непокътната, а студовата верига (2–8°C) е била поддържана. Разходите за обратна доставка се поемат от Клиента, освен в случаите на доказан производствен дефект.",
          "Рекламации за повреди при транспорт се подават в срок от 48 часа от получаването, придружени със снимки на опаковката и куриерски протокол.",
        ],
      },
      {
        id: "warranty",
        heading: "8. Гаранция за чистота",
        paragraphs: [
          "Доставчикът гарантира, че всеки продукт отговаря на спецификациите, посочени в придружаващия Сертификат за анализ (COA). Чистотата е не по-ниска от ≥98% по HPLC.",
          "В случай на несъответствие между продукта и COA, Клиентът има право на замяна или пълно възстановяване на сумата, при условие че пробата се предостави за независим анализ в срок от 7 дни от доставката.",
        ],
      },
      {
        id: "liability",
        heading: "9. Ограничаване на отговорността",
        paragraphs: [
          "Доставчикът не носи отговорност за щети, произтичащи от употреба, различна от научно-изследователска, включително, но не само, употреба при хора или животни.",
          "Максималната отговорност на Доставчика към Клиента, независимо от правното основание, е ограничена до стойността на конкретната поръчка.",
        ],
      },
      {
        id: "ip",
        heading: "10. Интелектуална собственост",
        paragraphs: [
          "Всички текстове, изображения, лога и дизайн на платформата са защитени от Закона за авторското право и сродните му права. Копирането, модифицирането или разпространението без изрично писмено съгласие е забранено.",
        ],
      },
      {
        id: "disputes",
        heading: "11. Разрешаване на спорове",
        paragraphs: [
          "Приложимото право е българското. Споровете се решават пред компетентния български съд по седалището на Доставчика. Потребителите могат да се обърнат и към Комисията за защита на потребителите (КЗП) или към платформата за онлайн решаване на спорове на Европейската комисия (https://ec.europa.eu/consumers/odr/).",
        ],
      },
      {
        id: "contact",
        heading: "12. Контакти",
        paragraphs: [
          "За въпроси, свързани с тези условия: support@peptidlabs.eu",
        ],
      },
    ],
  },
  en: {
    title: "Terms and Conditions",
    lastUpdated: LAST_UPDATED,
    intro: `These Terms and Conditions govern the relationship between ${COMPANY_LEGAL_NAME} (the "Supplier") and the natural or legal persons using the peptidlabs.eu website (the "Customer"). By placing an order, the Customer confirms that they have read, understood, and fully accept these terms.`,
    draftNotice:
      "Version effective 17 April 2026. Questions — support@peptidlabs.eu. We will notify users by email and update the version number in the footer when this document changes.",
    sections: [
      {
        id: "definitions",
        heading: "1. Definitions",
        list: [
          '"Research peptide" means a lyophilized biochemical reagent intended exclusively for in vitro research and laboratory use.',
          '"Certificate of Analysis (COA)" is a document issued by an independent laboratory certifying purity ≥98% by HPLC.',
          '"Platform" means the peptidlabs.eu website and all related services.',
        ],
      },
      {
        id: "research-use",
        heading: "2. Intended Use — Research Only",
        paragraphs: [
          "All products offered are research reagents. They are NOT medicines, dietary supplements or cosmetics and are NOT intended for use in humans or animals.",
          "The Customer declares that products will be used solely in licensed scientific, educational or laboratory settings by qualified personnel. Resale, administration or promotion of the products for non-research purposes is prohibited.",
        ],
      },
      {
        id: "eligibility",
        heading: "3. Customer Requirements",
        list: [
          "The Customer must be at least 18 years old.",
          "The Customer warrants that they act on their own behalf or on behalf of an organization with lawful basis to purchase research reagents.",
          "The Supplier reserves the right to refuse any order where the intended use or identity of the buyer is in doubt.",
        ],
      },
      {
        id: "orders-pricing",
        heading: "4. Orders and Pricing",
        paragraphs: [
          "Orders are accepted through the online store. An order receipt is sent by email; the contract is considered concluded only upon stock confirmation and shipment by the Supplier.",
          "All prices are in EUR with applicable VAT included. Prices may be updated without prior notice. For confirmed orders, the price at the time of order applies.",
        ],
      },
      {
        id: "payment",
        heading: "5. Payment Methods",
        list: [
          "Card payment via Stripe — secure processing through a PCI DSS certified provider.",
          "Cash on delivery (Bulgaria only) — cash payment upon receipt.",
          "The Supplier does not store payment card data. All transactions are processed by Stripe Payments Europe, Ltd.",
        ],
      },
      {
        id: "shipping",
        heading: "6. Shipping",
        paragraphs: [
          "Standard processing time is 24 hours from order confirmation on business days. Delivery within Bulgaria is carried out by Econt or Speedy within 1–3 business days. EU delivery is carried out by a registered courier within 3–7 business days depending on the destination.",
          "Risk of loss or damage passes to the Customer upon delivery. The Customer must inspect the shipment upon receipt in the presence of the courier.",
        ],
      },
      {
        id: "returns",
        heading: "7. Returns and Claims",
        paragraphs: [
          "Pursuant to EU Directive 2011/83/EU (transposed into Bulgarian Consumer Protection Act art. 57), the right of withdrawal does not apply to sealed reagents that have been unsealed after delivery and, for hygienic or biochemical reasons, cannot be returned.",
          "Unsealed products may be returned within 14 days of receipt provided the packaging is intact and the cold chain (2–8°C) has been maintained. Return shipping costs are borne by the Customer unless there is a proven manufacturing defect.",
          "Claims for transport damage must be submitted within 48 hours of receipt, accompanied by photos of the packaging and a courier report.",
        ],
      },
      {
        id: "warranty",
        heading: "8. Purity Warranty",
        paragraphs: [
          "The Supplier warrants that each product meets the specifications in the accompanying Certificate of Analysis (COA). Purity is not less than ≥98% by HPLC.",
          "In the event of non-conformity between product and COA, the Customer is entitled to replacement or full refund, provided a sample is submitted for independent analysis within 7 days of delivery.",
        ],
      },
      {
        id: "liability",
        heading: "9. Limitation of Liability",
        paragraphs: [
          "The Supplier is not liable for damages arising from use other than scientific research, including but not limited to use in humans or animals.",
          "The Supplier's maximum liability to the Customer, regardless of the legal basis, is limited to the value of the specific order.",
        ],
      },
      {
        id: "ip",
        heading: "10. Intellectual Property",
        paragraphs: [
          "All texts, images, logos and designs on the platform are protected by copyright law. Copying, modification or distribution without express written consent is prohibited.",
        ],
      },
      {
        id: "disputes",
        heading: "11. Dispute Resolution",
        paragraphs: [
          "Bulgarian law applies. Disputes are resolved before the competent Bulgarian court at the Supplier's registered seat. Consumers may also refer to the Commission for Consumer Protection or the European Commission Online Dispute Resolution platform at https://ec.europa.eu/consumers/odr/.",
        ],
      },
      {
        id: "contact",
        heading: "12. Contact",
        paragraphs: [
          "For questions related to these terms: support@peptidlabs.eu",
        ],
      },
    ],
  },
};

export const privacyContent: Record<"bg" | "en", LegalDocument> = {
  bg: {
    title: "Политика за поверителност",
    lastUpdated: LAST_UPDATED,
    intro: `PeptidLabs се отнася сериозно към защитата на Вашите лични данни. Тази политика описва какви данни събираме, защо ги събираме, как ги обработваме и какви са правата Ви съгласно Регламент (ЕС) 2016/679 (GDPR) и Закона за защита на личните данни.`,
    draftNotice:
      "Версия в сила от 17.04.2026 г. Длъжностно лице по защита на данните: privacy@peptidlabs.eu.",
    sections: [
      {
        id: "controller",
        heading: "1. Администратор на данни",
        paragraphs: [
          `Администратор по смисъла на GDPR е ${COMPANY_LEGAL_NAME}. За контакт по въпроси, свързани с личните данни: privacy@peptidlabs.eu.`,
        ],
      },
      {
        id: "data-collected",
        heading: "2. Какви данни събираме",
        list: [
          "Данни от поръчки — име, адрес за доставка, имейл, телефон.",
          "Данни за плащане — обработват се изцяло от Stripe; ние не съхраняваме номер на карта, CVV или данни за автентикация.",
          "Данни за доставка — предаваме минимално необходимите данни на куриера (Еконт, Спиди, DHL или друг превозвач).",
          "Технически данни — IP адрес, тип на браузъра, време на достъп, страници посетени, анонимизирани за аналитични цели.",
          "Бисквитки и местно съхранение — виж отделната Политика за бисквитки.",
        ],
      },
      {
        id: "purposes",
        heading: "3. Цели и правно основание",
        list: [
          "Изпълнение на договор — за обработка на поръчки, доставка и комуникация (чл. 6, ал. 1, буква б от GDPR).",
          "Законово задължение — за съхранение на счетоводни документи и фактури (чл. 6, ал. 1, буква в от GDPR).",
          "Легитимен интерес — за предотвратяване на измами и подобряване на услугата (чл. 6, ал. 1, буква е от GDPR).",
          "Съгласие — за маркетингови имейли и незадължителни бисквитки (чл. 6, ал. 1, буква а от GDPR).",
        ],
      },
      {
        id: "retention",
        heading: "4. Срокове за съхранение",
        list: [
          "Данни от поръчки и фактури — 10 години съгласно Закона за счетоводството.",
          "Данни за абонамент за бюлетин — до отписване от Клиента.",
          "Технически логове — до 90 дни.",
          "Бисквитки — според конфигурацията им (виж Политика за бисквитки).",
        ],
      },
      {
        id: "processors",
        heading: "5. Трети страни — обработващи",
        list: [
          "Supabase Inc. (САЩ, EU SCC) — хостинг на база данни.",
          "Stripe Payments Europe Ltd. (Ирландия) — обработка на плащания с карта.",
          "Resend Inc. (САЩ, EU SCC) — изпращане на транзакционни имейли.",
          "Еконт Експрес / Спиди / DHL — куриерски услуги.",
          "Vercel Inc. (САЩ, EU SCC) — хостинг на приложението.",
        ],
      },
      {
        id: "rights",
        heading: "6. Вашите права по GDPR",
        list: [
          "Право на достъп (чл. 15) — да получите потвърждение и копие на данните Ви.",
          "Право на коригиране (чл. 16) — да поискате корекция на неточни данни.",
          "Право на изтриване (чл. 17) — правото да бъдете забравен в определени случаи.",
          "Право на ограничаване на обработката (чл. 18).",
          "Право на преносимост (чл. 20) — да получите данните си в структуриран формат.",
          "Право на възражение (чл. 21) — включително срещу профилиране и маркетинг.",
          "Право на жалба до Комисията за защита на личните данни (КЗЛД) — www.cpdp.bg.",
        ],
        paragraphs: [
          "За упражняване на Вашите права, моля пишете на privacy@peptidlabs.eu. Отговаряме в срок от 30 дни.",
        ],
      },
      {
        id: "security",
        heading: "7. Сигурност",
        paragraphs: [
          "Прилагаме технически и организационни мерки, включително TLS шифроване при предаване, Row-Level Security на база данни, строги ролеви достъпи и редовни одити на сигурността.",
        ],
      },
      {
        id: "minors",
        heading: "8. Непълнолетни",
        paragraphs: [
          "Платформата не е предназначена за лица под 18 години. Не събираме съзнателно данни от непълнолетни.",
        ],
      },
      {
        id: "changes",
        heading: "9. Промени в политиката",
        paragraphs: [
          "Можем да актуализираме тази политика. Датата на последна актуализация е посочена в началото. Значителни промени се съобщават по имейл на регистрирани клиенти.",
        ],
      },
      {
        id: "contact",
        heading: "10. Контакт",
        paragraphs: [
          "Длъжностно лице по защита на данните (DPO): privacy@peptidlabs.eu",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: LAST_UPDATED,
    intro: `PeptidLabs takes the protection of your personal data seriously. This policy describes what data we collect, why we collect it, how we process it, and what your rights are under Regulation (EU) 2016/679 (GDPR) and the Bulgarian Personal Data Protection Act.`,
    draftNotice:
      "Version effective 17 April 2026. Data Protection Officer: privacy@peptidlabs.eu.",
    sections: [
      {
        id: "controller",
        heading: "1. Data Controller",
        paragraphs: [
          `The controller within the meaning of the GDPR is ${COMPANY_LEGAL_NAME}. For questions related to personal data: privacy@peptidlabs.eu.`,
        ],
      },
      {
        id: "data-collected",
        heading: "2. Data We Collect",
        list: [
          "Order data — name, delivery address, email, phone.",
          "Payment data — processed entirely by Stripe; we do not store card numbers, CVVs or authentication data.",
          "Shipping data — we transmit the minimum necessary data to the courier (Econt, Speedy, DHL or another carrier).",
          "Technical data — IP address, browser type, access time, pages visited, anonymized for analytics purposes.",
          "Cookies and local storage — see the separate Cookie Policy.",
        ],
      },
      {
        id: "purposes",
        heading: "3. Purposes and Legal Basis",
        list: [
          "Contract performance — for order processing, delivery and communication (Art. 6(1)(b) GDPR).",
          "Legal obligation — for retention of accounting records and invoices (Art. 6(1)(c) GDPR).",
          "Legitimate interest — for fraud prevention and service improvement (Art. 6(1)(f) GDPR).",
          "Consent — for marketing emails and non-essential cookies (Art. 6(1)(a) GDPR).",
        ],
      },
      {
        id: "retention",
        heading: "4. Retention Periods",
        list: [
          "Order data and invoices — 10 years under the Bulgarian Accounting Act.",
          "Newsletter subscription data — until the Customer unsubscribes.",
          "Technical logs — up to 90 days.",
          "Cookies — per their configuration (see Cookie Policy).",
        ],
      },
      {
        id: "processors",
        heading: "5. Third Party Processors",
        list: [
          "Supabase Inc. (US, EU SCC) — database hosting.",
          "Stripe Payments Europe Ltd. (Ireland) — card payment processing.",
          "Resend Inc. (US, EU SCC) — transactional email delivery.",
          "Econt Express / Speedy / DHL — courier services.",
          "Vercel Inc. (US, EU SCC) — application hosting.",
        ],
      },
      {
        id: "rights",
        heading: "6. Your GDPR Rights",
        list: [
          "Right of access (Art. 15) — to obtain confirmation and a copy of your data.",
          "Right to rectification (Art. 16) — to request correction of inaccurate data.",
          '"Right to erasure" (Art. 17) — the "right to be forgotten" in certain cases.',
          "Right to restriction of processing (Art. 18).",
          "Right to data portability (Art. 20) — to receive your data in a structured format.",
          "Right to object (Art. 21) — including to profiling and marketing.",
          "Right to lodge a complaint with the Bulgarian Personal Data Protection Commission — www.cpdp.bg.",
        ],
        paragraphs: [
          "To exercise your rights, please write to privacy@peptidlabs.eu. We respond within 30 days.",
        ],
      },
      {
        id: "security",
        heading: "7. Security",
        paragraphs: [
          "We apply technical and organizational measures, including TLS encryption in transit, database Row-Level Security, strict role-based access and regular security audits.",
        ],
      },
      {
        id: "minors",
        heading: "8. Minors",
        paragraphs: [
          "The platform is not intended for persons under 18. We do not knowingly collect data from minors.",
        ],
      },
      {
        id: "changes",
        heading: "9. Changes to this Policy",
        paragraphs: [
          "We may update this policy. The date of the last update is indicated at the top. Significant changes are communicated by email to registered customers.",
        ],
      },
      {
        id: "contact",
        heading: "10. Contact",
        paragraphs: [
          "Data Protection Officer (DPO): privacy@peptidlabs.eu",
        ],
      },
    ],
  },
};

export const cookieContent: Record<"bg" | "en", LegalDocument> = {
  bg: {
    title: "Политика за бисквитки",
    lastUpdated: LAST_UPDATED,
    intro:
      "Тази политика описва какви бисквитки и подобни технологии използваме в peptidlabs.eu и как можете да ги контролирате.",
    draftNotice:
      "Версия в сила от 17.04.2026 г. При добавяне или промяна на tracking инструменти този документ ще бъде обновен и ще бъдете поискани за ново съгласие.",
    sections: [
      {
        id: "what-are-cookies",
        heading: "1. Какво представляват бисквитките",
        paragraphs: [
          "Бисквитките са малки текстови файлове, които се запазват на Вашето устройство при посещение на уебсайт. Те позволяват на сайта да запомни Вашите действия и предпочитания за определен период.",
        ],
      },
      {
        id: "types",
        heading: "2. Видове бисквитки, които използваме",
        list: [
          "Строго необходими — за функциониране на количката, автентикация и сигурност. Без тях сайтът не може да работи.",
          "Функционални — запазват предпочитания за език и валута.",
          "Аналитични (по избор) — анонимизирана статистика за използването на сайта. Зареждат се само след Вашето съгласие.",
          "Маркетингови (по избор) — за персонализирани предложения. Зареждат се само след Вашето съгласие.",
        ],
      },
      {
        id: "list",
        heading: "3. Конкретни бисквитки",
        list: [
          "NEXT_LOCALE — запазва избора на език (12 месеца, строго необходима).",
          "cart-storage — съдържа количката Ви (до изтриване от Вас, функционална).",
          "admin-token — за достъп до административния панел (сесия, строго необходима).",
          "peptidelab_consent — запазва Вашия избор за съгласие (12 месеца, строго необходима).",
        ],
      },
      {
        id: "third-party",
        heading: "4. Бисквитки от трети страни",
        paragraphs: [
          "В момента не използваме Google Analytics, Meta Pixel или други външни трекери. При добавяне на такива инструменти ще актуализираме този документ и ще поискаме изрично съгласие.",
        ],
      },
      {
        id: "manage",
        heading: "5. Как да управлявате бисквитките",
        paragraphs: [
          "Можете да управлявате и изтривате бисквитките през настройките на браузъра си. Блокирането на строго необходимите бисквитки може да попречи на функционалността на сайта, включително количката и плащането.",
          "Инструкции за популярните браузъри: Chrome, Firefox, Safari, Edge — потърсете cookie settings в менюто Настройки за поверителност.",
        ],
      },
      {
        id: "contact",
        heading: "6. Контакт",
        paragraphs: ["Въпроси за бисквитките: privacy@peptidlabs.eu"],
      },
    ],
  },
  en: {
    title: "Cookie Policy",
    lastUpdated: LAST_UPDATED,
    intro:
      "This policy describes what cookies and similar technologies we use on peptidlabs.eu and how you can control them.",
    draftNotice:
      "Version effective 17 April 2026. If tracking tools are added or changed, this document will be updated and we will ask for renewed consent.",
    sections: [
      {
        id: "what-are-cookies",
        heading: "1. What Are Cookies",
        paragraphs: [
          'Cookies are small text files stored on your device when you visit a website. They allow the site to "remember" your actions and preferences for a certain period.',
        ],
      },
      {
        id: "types",
        heading: "2. Types of Cookies We Use",
        list: [
          "Strictly necessary — for cart functionality, authentication and security. Without them the site cannot operate.",
          "Functional — store language and currency preferences.",
          "Analytics (optional) — anonymized site usage statistics. Loaded only after your consent.",
          "Marketing (optional) — for personalized offers. Loaded only after your consent.",
        ],
      },
      {
        id: "list",
        heading: "3. Specific Cookies",
        list: [
          "NEXT_LOCALE — stores the language choice (12 months, strictly necessary).",
          "cart-storage — holds your cart (until you delete it, functional).",
          "admin-token — for admin panel access (session, strictly necessary).",
          "peptidelab_consent — stores your consent choice (12 months, strictly necessary).",
        ],
      },
      {
        id: "third-party",
        heading: "4. Third Party Cookies",
        paragraphs: [
          "We do not currently use Google Analytics, Meta Pixel or other external trackers. If we add such tools, we will update this document and request explicit consent.",
        ],
      },
      {
        id: "manage",
        heading: "5. How to Manage Cookies",
        paragraphs: [
          "You can manage and delete cookies through your browser settings. Blocking strictly necessary cookies may prevent the site from functioning, including the cart and checkout.",
          'Instructions for popular browsers: Chrome, Firefox, Safari, Edge — look for "cookie settings" in the "Privacy settings" menu.',
        ],
      },
      {
        id: "contact",
        heading: "6. Contact",
        paragraphs: ["Cookie questions: privacy@peptidlabs.eu"],
      },
    ],
  },
};
