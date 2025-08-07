import Image from "next/image";
import { companyInfo } from "@/data/company-info";

export default function StorySection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block border border-gray-300 px-4 py-2 text-sm tracking-wider text-muted-foreground">
              НАША ИСТОРИЯ
            </div>

            <h2 className="font-playfair text-3xl md:text-4xl font-bold">
              Традиции роскоши с {companyInfo.founded} года
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {companyInfo.fullName} — это символ роскоши и изысканности,
                который уже более {companyInfo.stats.yearsInBusiness} лет
                является эталоном высокой моды в России. Наш универмаг
                предлагает лучшую подборку товаров и индивидуальный подход к
                каждому клиенту.
              </p>

              <p>
                Коллекции более {companyInfo.stats.brands} ведущих мировых
                брендов одежды, обуви, сумок и аксессуаров, изысканных украшений
                и часов, а также парфюмерии и косметики.
              </p>

              <p>
                Мы обслуживаем клиентов в {companyInfo.stats.stores} бутиках и
                доставляем товары в {companyInfo.stats.countries} стран мира,
                предоставляя безупречный сервис и гарантируя подлинность каждого
                изделия.
              </p>
            </div>

            <div className="pt-4">
              <div className="inline-block border border-gray-300 px-4 py-2 text-sm tracking-wider text-muted-foreground">
                ОБСЛУЖИВАЕМ {companyInfo.stats.happyCustomers} КЛИЕНТОВ
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/placeholder.svg?height=600&width=500&text=LUXE+Универмаг"
              alt="LUXE универмаг"
              width={500}
              height={600}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
