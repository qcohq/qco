export const products = [
  {
    id: "1",
    name: "Твидовый жакет с золотыми пуговицами",
    brand: "CHANEL",
    basePrice: 520000,
    salePrice: 450000,
    onSale: true,
    description:
      "Классический твидовый жакет от Chanel из коллекции Осень-Зима 2024. Выполнен из эксклюзивного твида букле с добавлением шелка и кашемира. Фирменные золотые пуговицы с логотипом CC, контрастная отделка и классический крой делают этот жакет воплощением французской элегантности.",
    details: [
      "Состав: 70% шерсть, 20% шелк, 10% кашемир",
      "Подкладка: 100% шелк",
      "Фурнитура: позолоченные пуговицы",
      "Крой: приталенный",
      "Длина: до бедра",
      "Страна производства: Франция",
      "Артикул: P76849 V47791 94305",
      "Коллекция: Осень-Зима 2024",
    ],
    sizes: [
      { name: "34", value: "34", inStock: true },
      { name: "36", value: "36", inStock: true },
      { name: "38", value: "38", inStock: true },
      { name: "40", value: "40", inStock: true },
      { name: "42", value: "42", inStock: true },
    ],
    colors: [
      { name: "Черный с белым", value: "black-white", hex: "#000000" },
      { name: "Розовый букле", value: "pink-boucle", hex: "#FFB6C1" },
      { name: "Синий твид", value: "blue-tweed", hex: "#191970" },
    ],
    images: [
      "/placeholder.svg?height=600&width=500&text=Chanel+Жакет+1",
      "/placeholder.svg?height=600&width=500&text=Chanel+Жакет+2",
      "/placeholder.svg?height=600&width=500&text=Chanel+Жакет+3",
      "/placeholder.svg?height=600&width=500&text=Chanel+Детали",
    ],
    category: "Женская одежда",
    subcategory: "Жакеты",
    inStock: true,
    rating: 4.9,
    isNew: true,
    slug: "tvidovyj-zhaket-s-zolotymi-pugovicami",
  },
  {
    id: "2",
    name: "Сумка Birkin 35 из кожи Togo",
    brand: "HERMÈS",
    basePrice: 2850000,
    description:
      "Легендарная сумка Birkin 35 от Hermès из премиальной кожи Togo. Каждая сумка изготавливается вручную мастерами в ателье Hermès во Франции. Эта модель отличается мягкой фактурой кожи, устойчивой к царапинам, и классическими пропорциями, делающими её идеальной для повседневного использования.",
    details: [
      "Материал: кожа Togo (телячья кожа)",
      "Размеры: 35 x 25 x 18 см",
      "Фурнитура: палладированная",
      "Подкладка: кожа шевр",
      "Застежка: поворотный замок",
      "Ручки: двойные",
      "Страна производства: Франция",
      "Серийный номер: включен",
      "Сертификат подлинности: прилагается",
    ],
    sizes: [{ name: "35 см", value: "35", inStock: true }],
    colors: [
      { name: "Черный (Noir)", value: "noir", hex: "#000000" },
      { name: "Золотистый (Gold)", value: "gold", hex: "#D4AF37" },
      { name: "Этуп (Etoupe)", value: "etoupe", hex: "#8B7355" },
      { name: "Красный (Rouge H)", value: "rouge-h", hex: "#8B0000" },
    ],
    images: [
      "/placeholder.svg?height=600&width=500&text=Hermès+Birkin+1",
      "/placeholder.svg?height=600&width=500&text=Hermès+Birkin+2",
      "/placeholder.svg?height=600&width=500&text=Hermès+Birkin+3",
      "/placeholder.svg?height=600&width=500&text=Hermès+Детали",
    ],
    category: "Женские аксессуары",
    subcategory: "Сумки",
    inStock: true,
    rating: 5.0,
    isNew: false,
    slug: "sumka-birkin-35-iz-kozhi-togo",
  },
  {
    id: "3",
    name: "Шелковый платок Flora с принтом",
    brand: "GUCCI",
    basePrice: 52000,
    salePrice: 45000,
    onSale: true,
    description:
      "Роскошный шелковый платок из коллекции Flora от Gucci. Культовый принт Flora, впервые созданный в 1966 году для принцессы Монако Грейс Келли, представлен в новой интерпретации. Изготовлен из чистого шелка твилл высочайшего качества в Италии.",
    details: [
      "Материал: 100% шелк твилл",
      "Размеры: 90 x 90 см",
      "Принт: Flora",
      "Обработка краев: ручная подшивка",
      "Плотность: 16 мм",
      "Уход: только химчистка",
      "Страна производства: Италия",
      "Коллекция: Flora",
      "Дизайнер: Vittorio Accornero",
    ],
    sizes: [{ name: "90x90 см", value: "90x90", inStock: true }],
    colors: [
      {
        name: "Мультиколор на белом",
        value: "multicolor-white",
        hex: "#FFFFFF",
      },
      {
        name: "Мультиколор на черном",
        value: "multicolor-black",
        hex: "#000000",
      },
      { name: "Розовый Flora", value: "pink-flora", hex: "#FFB6C1" },
    ],
    images: [
      "/placeholder.svg?height=600&width=500&text=Gucci+Платок+1",
      "/placeholder.svg?height=600&width=500&text=Gucci+Платок+2",
      "/placeholder.svg?height=600&width=500&text=Gucci+Платок+3",
      "/placeholder.svg?height=600&width=500&text=Gucci+Детали",
    ],
    category: "Женские аксессуары",
    subcategory: "Платки и шарфы",
    inStock: true,
    rating: 4.8,
    isNew: false,
    slug: "shelkovyj-platok-flora-s-printom",
  },
  {
    id: "4",
    name: "Туфли So Kate 120 из лакированной кожи",
    brand: "CHRISTIAN LOUBOUTIN",
    basePrice: 89000,
    description:
      "Культовые туфли So Kate от Christian Louboutin на шпильке 120 мм. Модель отличается острым мыском и элегантным силуэтом, который визуально удлиняет ногу. Изготовлены из итальянской лакированной кожи высочайшего качества с фирменной красной подошвой.",
    details: [
      "Материал верха: лакированная кожа",
      "Подкладка: кожа наппа",
      "Подошва: кожа с красным лаком",
      "Высота каблука: 120 мм",
      "Мысок: заостренный",
      "Посадка: узкая",
      "Страна производства: Италия",
      "Фирменная упаковка: включена",
      "Пыльник: прилагается",
    ],
    sizes: [
      { name: "35", value: "35", inStock: true },
      { name: "35.5", value: "35.5", inStock: true },
      { name: "36", value: "36", inStock: true },
      { name: "36.5", value: "36.5", inStock: true },
      { name: "37", value: "37", inStock: true },
      { name: "37.5", value: "37.5", inStock: true },
      { name: "38", value: "38", inStock: true },
      { name: "38.5", value: "38.5", inStock: true },
      { name: "39", value: "39", inStock: true },
      { name: "39.5", value: "39.5", inStock: true },
      { name: "40", value: "40", inStock: true },
      { name: "40.5", value: "40.5", inStock: true },
      { name: "41", value: "41", inStock: true },
    ],
    colors: [
      { name: "Черный лак", value: "black-patent", hex: "#000000" },
      { name: "Красный лак", value: "red-patent", hex: "#8B0000" },
      { name: "Бежевый лак", value: "beige-patent", hex: "#F5F5DC" },
      { name: "Белый лак", value: "white-patent", hex: "#FFFFFF" },
    ],
    images: [
      "/placeholder.svg?height=600&width=500&text=Louboutin+So+Kate+1",
      "/placeholder.svg?height=600&width=500&text=Louboutin+So+Kate+2",
      "/placeholder.svg?height=600&width=500&text=Louboutin+So+Kate+3",
      "/placeholder.svg?height=600&width=500&text=Louboutin+Детали",
    ],
    category: "Женская обувь",
    subcategory: "Туфли",
    inStock: true,
    rating: 4.7,
    isNew: true,
    slug: "tufli-so-kate-120-iz-lakirovannoj-kozhi",
  },
  {
    id: "5",
    name: "Пальто Icon из кашемира и шерсти",
    brand: "MAX MARA",
    basePrice: 340000,
    salePrice: 285000,
    onSale: true,
    description:
      "Легендарное пальто Icon от Max Mara - воплощение итальянской элегантности и мастерства. Изготовлено из эксклюзивной смеси кашемира и шерсти, это пальто отличается безупречным кроем и роскошной мягкостью. Классический силуэт подходит для любого случая.",
    details: [
      "Состав: 90% шерсть, 10% кашемир",
      "Подкладка: 100% вискоза",
      "Застежка: пуговицы",
      "Длина: макси (до щиколотки)",
      "Силуэт: прямой с поясом",
      "Воротник: отложной",
      "Карманы: два боковых",
      "Страна производства: Италия",
      "Коллекция: Icon",
    ],
    sizes: [
      { name: "XS", value: "XS", inStock: true },
      { name: "S", value: "S", inStock: true },
      { name: "M", value: "M", inStock: true },
      { name: "L", value: "L", inStock: true },
      { name: "XL", value: "XL", inStock: true },
    ],
    colors: [
      { name: "Кэмел", value: "camel", hex: "#C19A6B" },
      { name: "Черный", value: "black", hex: "#000000" },
      { name: "Серый меланж", value: "grey-melange", hex: "#808080" },
      { name: "Темно-синий", value: "navy", hex: "#000080" },
    ],
    images: [
      "/placeholder.svg?height=600&width=500&text=Max+Mara+Пальто+1",
      "/placeholder.svg?height=600&width=500&text=Max+Mara+Пальто+2",
      "/placeholder.svg?height=600&width=500&text=Max+Mara+Пальто+3",
      "/placeholder.svg?height=600&width=500&text=Max+Mara+Детали",
    ],
    category: "Женская одежда",
    subcategory: "Пальто",
    inStock: true,
    rating: 4.9,
    isNew: false,
    slug: "palto-icon-iz-kashemira-i-shersti",
  },
  {
    id: "6",
    name: "Серьги T Wire с бриллиантами",
    brand: "TIFFANY & CO.",
    basePrice: 125000,
    description:
      "Элегантные серьги T Wire от Tiffany & Co из коллекции Tiffany T. Выполнены из розового золота 18 карат с бриллиантами высочайшего качества. Современный дизайн сочетает в себе минимализм и роскошь, создавая универсальное украшение для любого образа.",
    details: [
      "Материал: розовое золото 18К",
      "Камни: бриллианты (общий вес 0.15 карат)",
      "Чистота бриллиантов: VS1-VS2",
      "Цвет бриллиантов: G-H",
      "Размер: 18 мм в диаметре",
      "Застежка: английская",
      "Вес: 4.2 г (пара)",
      "Страна производства: США",
      "Сертификат: прилагается",
      "Фирменная упаковка: включена",
    ],
    sizes: [{ name: "Один размер", value: "one-size", inStock: true }],
    colors: [{ name: "Розовое золото", value: "rose-gold", hex: "#E8B4B8" }],
    images: [
      "/placeholder.svg?height=600&width=500&text=Tiffany+Серьги+1",
      "/placeholder.svg?height=600&width=500&text=Tiffany+Серьги+2",
      "/placeholder.svg?height=600&width=500&text=Tiffany+Серьги+3",
      "/placeholder.svg?height=600&width=500&text=Tiffany+Детали",
    ],
    category: "Украшения",
    subcategory: "Серьги",
    inStock: true,
    rating: 4.8,
    isNew: false,
    slug: "sergi-t-wire-s-brilliantami",
  },
];

export const getProduct = (id: string) => {
  return products.find((product) => product.id === id) || null;
};

export const getProductsByCategory = (category: string) => {
  return products.filter((product) => product.category === category);
};

export const getFeaturedProducts = () => {
  return products.slice(0, 4);
};

export const getNewProducts = () => {
  return products.filter((product) => product.isNew);
};

export const getSaleProducts = () => {
  return products.filter((product) => product.onSale);
};
