
export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface StoreConfig {
  backgroundImage: string;
  contactNumber: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTitleColor: string;
  heroSubtitleColor: string;
  heroTitleSize: number;
  heroSubtitleSize: number;
  heroAlignment: 'right' | 'center' | 'left';
}

export const DEFAULT_CATEGORIES: string[] = [
  "بدل",
  "قمصان",
  "بناطيل",
  "إكسسوارات",
  "أحذية"
];

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  backgroundImage: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop",
  contactNumber: "+20 123 456 789",
  heroTitle: "تشكيلة جمال الفاخرة",
  heroSubtitle: "الأناقة ليست مجرد ملابس، بل هي أسلوب حياة. اكتشف مجموعتنا الجديدة للرجل الذي يبحث عن التميز.",
  heroTitleColor: "#ffffff",
  heroSubtitleColor: "#e2e8f0",
  heroTitleSize: 72,
  heroSubtitleSize: 18,
  heroAlignment: 'center'
};
