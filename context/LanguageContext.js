"use client"

import { createContext, useContext } from "react"
import { usePathname } from "next/navigation"

const LanguageContext = createContext("en")

export function LanguageProvider({ locale, children }) {
  return <LanguageContext.Provider value={locale}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const locale = useContext(LanguageContext)
  const pathname = usePathname()
  const isAr = locale === "ar"

  const t = key => translations[locale]?.[key] ?? translations.en[key] ?? key

  // Prefix path with /ar when Arabic
  const p = path => (isAr ? `/ar${path}` : path)

  // Toggle URL: strip or add /ar prefix (admin pages have no Arabic version)
  const toggleHref = pathname.startsWith("/admin")
    ? pathname
    : isAr
      ? pathname.replace(/^\/ar/, "") || "/"
      : `/ar${pathname}`

  return { locale, isAr, t, p, toggleHref }
}

const translations = {
  en: {
    // About page
    aboutTitle: "About",
    aboutIntro:
      "Hebat is your trusted source for premium products and accessories across the Middle East. We take pride in offering quality, variety, and style — all designed to meet the modern customer's needs with excellence and care.",
    ourMission: "Our Mission",
    missionText:
      "We believe every product you buy should bring you confidence and satisfaction. That's why Hebat carefully curates each item — ensuring quality, durability, and innovation meet our customers' expectations.",
    ourValues: "Our Values",
    qualityFirst: "Quality First:",
    qualityFirstText: "We only offer products that meet our high standards.",
    customerFocus: "Customer Focus:",
    customerFocusText: "Every product and service is built around your needs.",
    innovation: "Innovation:",
    innovationText: "We embrace modern solutions and forward-thinking design.",
    ourPromise: "Our Promise",
    promiseText:
      "Hebat is more than just a brand — it's a commitment to excellence. Our team works tirelessly to ensure that your shopping experience is seamless, secure, and satisfying.",
    exploreProducts: "Explore Our Products",
    aboutCta: "Have questions or want to partner with us?",
    // Contact page
    contactIntro:
      "Have questions or need assistance? We'd love to hear from you! Whether you're a customer, supplier, or partner — our team is always ready to help.",
    getInTouch: "Get in Touch",
    supportText:
      "Our support team is available to help with product questions, order assistance, or partnership inquiries.",
    phone: "Phone",
    office: "Office",
    location: "Tubli, Bahrain",
    followUs: "Follow Us",
    sendUsMessage: "Send Us a Message",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    messagePlaceholder: "Message",
    sendBtn: "Send Message",
    sending: "Sending...",
    home: "Home",
    products: "Products",
    about: "About Us",
    contact: "Contact Us",
    all: "All",
    viewAll: "View All",
    search: "Search by name, model, or barcode...",
    description: "Description",
    features: "Features",
    specifications: "Specifications",
    manual: "Manual",
    viewManual: "View Manual",
    noManual: "No manual available",
    readMore: "Read more",
    readLess: "Read less",
    shareVia: "Share Via",
    highlights: "Product Highlights",
    newsletter: "Subscribe to our Newsletter",
    subscribe: "Subscribe",
    yourEmail: "Your email",
    allProducts: "All Products",
    loadingProducts: "Loading products...",
    loadingProduct: "Loading product...",
    noProducts: "No products found in this category.",
    noResults: "No products found matching",
    showing: "Showing",
    visitShop: "Visit Morslon",
    barcode: "Barcode",
    model: "Model",
    adminControls: "Admin Controls",
    newProduct: "New Product",
    manageCategories: "Manage Categories",
    manageBanners: "Manage Banners",
    contactMessages: "Contact Messages",
    newsletter_admin: "Newsletter",
    logout: "Logout",
  },
  ar: {
    // About page
    aboutTitle: "من نحن",
    aboutIntro:
      "هيبات هي مصدرك الموثوق للمنتجات والإكسسوارات المميزة في جميع أنحاء الشرق الأوسط. نفخر بتقديم الجودة والتنوع والأسلوب — كل ذلك مصمم لتلبية احتياجات العميل العصري بتميز واهتمام.",
    ourMission: "مهمتنا",
    missionText:
      "نؤمن بأن كل منتج تشتريه يجب أن يمنحك الثقة والرضا. لهذا تختار هيبات كل منتج بعناية — لضمان أن الجودة والمتانة والابتكار تلبي توقعات عملائنا.",
    ourValues: "قيمنا",
    qualityFirst: "الجودة أولاً:",
    qualityFirstText: "نقدم فقط المنتجات التي تلبي معاييرنا العالية.",
    customerFocus: "التركيز على العميل:",
    customerFocusText: "كل منتج وخدمة مصممة حول احتياجاتك.",
    innovation: "الابتكار:",
    innovationText: "نتبنى الحلول الحديثة والتصميم المستقبلي.",
    ourPromise: "وعدنا",
    promiseText:
      "هيبات أكثر من مجرد علامة تجارية — إنها التزام بالتميز. يعمل فريقنا بلا توقف لضمان أن تجربة تسوقك سلسة وآمنة ومُرضية.",
    exploreProducts: "استعرض منتجاتنا",
    aboutCta: "هل لديك أسئلة أو تريد الشراكة معنا؟",
    // Contact page
    contactIntro:
      "هل لديك أسئلة أو تحتاج مساعدة؟ يسعدنا سماعك! سواء كنت عميلاً أو موردًا أو شريكًا — فريقنا دائماً مستعد للمساعدة.",
    getInTouch: "تواصل معنا",
    supportText:
      "فريق الدعم لدينا متاح للمساعدة في أسئلة المنتجات أو مساعدة الطلبات أو استفسارات الشراكة.",
    phone: "الهاتف",
    office: "المكتب",
    location: "البحرين, توبلي",
    followUs: "تابعنا",
    sendUsMessage: "أرسل لنا رسالة",
    namePlaceholder: "الاسم",
    emailPlaceholder: "البريد الإلكتروني",
    messagePlaceholder: "الرسالة",
    sendBtn: "إرسال الرسالة",
    sending: "جاري الإرسال...",
    home: "الرئيسية",
    products: "المنتجات",
    about: "من نحن",
    contact: "تواصل معنا",
    all: "الكل",
    viewAll: "عرض الكل",
    search: "ابحث بالاسم، الموديل، أو الباركود...",
    description: "الوصف",
    features: "المميزات",
    specifications: "المواصفات",
    manual: "الدليل",
    viewManual: "عرض الدليل",
    noManual: "لا يوجد دليل",
    readMore: "اقرأ أكثر",
    readLess: "اقرأ أقل",
    shareVia: "شارك عبر",
    highlights: "أبرز المميزات",
    newsletter: "اشترك في نشرتنا البريدية",
    subscribe: "اشتراك",
    yourEmail: "بريدك الإلكتروني",
    allProducts: "جميع المنتجات",
    loadingProducts: "جاري تحميل المنتجات...",
    loadingProduct: "جاري التحميل...",
    noProducts: "لا توجد منتجات في هذا التصنيف.",
    noResults: "لا توجد منتجات تطابق",
    showing: "عرض",
    visitShop: "مورسلون",
    barcode: "الباركود",
    model: "الموديل",
    adminControls: "تحكم المشرف",
    newProduct: "منتج جديد",
    manageCategories: "إدارة التصنيفات",
    manageBanners: "إدارة البانرات",
    contactMessages: "رسائل التواصل",
    newsletter_admin: "النشرة البريدية",
    logout: "تسجيل الخروج",
  },
}
