"use client";

import {
  ArrowRight,
  Heart,
  Award,
  Instagram,
  MapPin,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "components/Footer";
import { useEffect } from "react";

export default function AboutPageContenet() {
  const router = useRouter();

  useEffect(() => {
    // Scroll to partners section if hash exists
    if (window.location.hash === "#partners") {
      setTimeout(() => {
        document.getElementById("partners")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, []);

  const partners = [
    {
      nameAr: "صالون هالة برجوس",
      nameEn: "Hala Beauty Center",
      description: "خبراء التجميل لإطلالة مثالية",
      icon: "💄",
      instagram: "https://www.instagram.com/halabeautycenter",
      location: "الصويفية",
    },
    {
      nameAr: "ازياء كليمانس للعرائس",
      nameEn: "Clemance Bridal",
      description: "أجمل بدلات العرائس",
      icon: "👗",
      instagram: "https://www.instagram.com/clemancebridal",
      location: "الصويفية",
    },
    {
      nameAr: "كليمانس للمناسبات",
      nameEn: "Clemance Events",
      description: "تصميم كوشات وتنسيق حفلات",
      icon: "🎊",
      instagram: "https://www.instagram.com/clemance.events",
      location: "الصويفية",
    },
  ];

  const stats = [
    { number: "500+", label: "عروس سعيدة" },
    { number: "1000+", label: "مسكة مميزة" },
    { number: "100%", label: "رضا العملاء" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-3 flex items-center">
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowRight className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 mr-3">من نحن</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pandora-pink to-pink-400 rounded-full mb-4 shadow-lg">
            <span className="text-3xl">🌸</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            متجر المسكات
          </h2>
          <p className="text-gray-600 mb-3">تصاميم مميزة لأجمل المناسبات</p>
          <div className="inline-flex items-center gap-2 text-sm text-pandora-pink">
            <Sparkles className="w-4 h-4" />
            <span>نصنع ذكريات لا تُنسى</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200"
            >
              <div className="text-2xl font-black text-pandora-pink mb-1">
                {stat.number}
              </div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-pandora-pink" />
            <h3 className="text-lg font-bold text-gray-900">قصتنا</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            بدأنا رحلتنا من حب عميق لفن تنسيق الورود وشغف بصناعة اللحظات
            السعيدة. كل مسكة نصنعها هي قطعة فنية فريدة، مصممة خصيصاً لتعكس جمال
            يومك الخاص.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            نؤمن بأن التفاصيل الصغيرة تصنع الفرق الكبير، ولهذا نختار كل وردة
            بعناية فائقة لنقدم لك الأفضل دائماً.
          </p>
        </div>

        {/* Why Us */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-pandora-pink" />
            <h3 className="text-lg font-bold text-gray-900">
              لماذا نحن مميزون؟
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pandora-pink/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lg">✨</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  تصاميم فريدة
                </h4>
                <p className="text-xs text-gray-600">
                  كل مسكة نصنعها هي قطعة فنية حصرية بتصميم خاص
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pandora-pink/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lg">🌸</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  ورود فاخرة
                </h4>
                <p className="text-xs text-gray-600">
                  نختار أجود أنواع الورود لضمان جودة عالية ومظهر رائع
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pandora-pink/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lg">💖</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  عناية شخصية
                </h4>
                <p className="text-xs text-gray-600">
                  نهتم بكل تفصيلة لنضمن رضاك التام عن منتجنا
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Partners */}
        <div id="partners" className="mb-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🤝 شركاء النجاح
            </h3>
            <p className="text-sm text-gray-600">
              بالتعاون مع أفضل الأسماء في عمان
            </p>
          </div>

          <div className="space-y-3">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-pandora-pink/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {partner.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {partner.nameAr}
                    </h4>
                    <p className="text-xs text-gray-500">{partner.nameEn}</p>
                  </div>
                  <a
                    href={partner.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-pandora-pink rounded-lg flex items-center justify-center hover:bg-pandora-pink/90 transition-colors active:scale-95"
                  >
                    <Instagram className="w-4 h-4 text-white" />
                  </a>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  {partner.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{partner.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Offer */}
        <div className="bg-pandora-pink/10 rounded-2xl p-6 border border-pandora-pink/20 mb-6">
          <div className="text-center">
            <div className="text-3xl mb-2">✨💍✨</div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              باقة كاملة ليوم عرسك!
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              احجزي كل شي من مكان واحد واحصلي على خصم خاص
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              <span className="bg-white px-3 py-1.5 rounded-full text-gray-700 border border-gray-200">
                🌸 المسكة
              </span>
              <span className="bg-white px-3 py-1.5 rounded-full text-gray-700 border border-gray-200">
                💄 المكياج
              </span>
              <span className="bg-white px-3 py-1.5 rounded-full text-gray-700 border border-gray-200">
                👗 البدلة
              </span>
              <span className="bg-white px-3 py-1.5 rounded-full text-gray-700 border border-gray-200">
                🎊 الكوشة
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            جاهزة لتبدئي رحلتك معنا؟
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            تواصلي معنا الآن واحصلي على استشارة مجانية
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="https://wa.me/962789577909"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب</span>
            </a>
            <a
              href="https://www.instagram.com/maskatblooms.jo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-pandora-pink text-white rounded-lg text-sm font-medium hover:bg-pandora-pink/90 transition-colors active:scale-95"
            >
              <Instagram className="w-4 h-4" />
              <span>إنستغرام</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
