import { db } from '../src/lib/db'

// VELORA — Luxury Men's Formalwear & Suits
const categories = [
  { name: 'بدلات', slug: 'suits', description: 'بدل مفصّلة بإتقان بخامات استثنائية وقصّات كلاسيكية وعصرية', image: '/images/cat-suits.jpg', icon: 'Sparkles', featured: true, order: 1 },
  { name: 'قمصان', slug: 'shirts', description: 'قمصان قطن مصري فاخرة بإتقان يدوي وياقة كلاسيكية', image: '/images/cat-shirts.jpg', icon: 'Shirt', featured: true, order: 2 },
  { name: 'معاطف', slug: 'overcoats', description: 'معاطف صوفية فاخرة تدفئك بأناقة في أبرد الأيام', image: '/images/cat-overcoats.jpg', icon: 'Coat', featured: true, order: 3 },
  { name: 'أحذية رسمية', slug: 'formal-shoes', description: 'أحذية جلدية مصنوعة بحرفة يدوية لإطلالة رسمية متكاملة', image: '/images/cat-formal-shoes.jpg', icon: 'Footprints', featured: true, order: 4 },
  { name: 'إكسسوارات', slug: 'accessories', description: 'كرفات وبابيون وأزرار كمّ ووشاح جيب تكمل إطلالتك الرسمية', image: '/images/cat-accessories-formal.jpg', icon: 'Watch', featured: true, order: 5 },
]

type ProductSeed = {
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  category: string
  images: string[]
  sizes: string[]
  colors: string[]
  sku: string
  badge?: string
  featured?: boolean
  material?: string
  care?: string
  stock: number
  rating?: number
  reviewCount?: number
}

const products: ProductSeed[] = [
  // ===== Suits =====
  {
    name: 'بدلة كلاسيك كملي',
    slug: 'classic-camel-suit',
    description: 'بدلة كلاسيكية بلون الجملي بقصّة مستقيمة أنيقة وياقة notch lapel. مصنوعة من صوف فاخر بملمس ناعم يمنحك حضوراً راقياً في المناسبات الرسمية والعملية. مفصّلة بإتقان لتنساب بسهولة على الجسم.',
    price: 6900, comparePrice: 7900, category: 'suits',
    images: ['/images/suit-classic-camel.jpg', '/images/editorial-formal-2.jpg'],
    sizes: ['46', '48', '50', '52', '54', '56'], colors: ['جملي', 'فحمي', 'كحلي'],
    sku: 'VL-S-001', badge: 'الأكثر مبيعاً', featured: true,
    material: '100% صوف إيطالي فاخر', care: 'تنظيف جاف فقط', stock: 18, rating: 4.9, reviewCount: 86,
  },
  {
    name: 'بدلة ثلاثية فحمية',
    slug: 'charcoal-three-piece-suit',
    description: 'بدلة ثلاثية قطع بلون الفحم بياقة peak lapel وجليكة صوفية أنيقة. القصّة الكلاسيكية المُحكمة تمنحك إطلالة سلطوية راقية. مثالية للمناسبات الرسمية الكبرى وحفلات الزفاف.',
    price: 8500, comparePrice: 9600, category: 'suits',
    images: ['/images/suit-three-piece-charcoal.jpg', '/images/editorial-formal-2.jpg'],
    sizes: ['46', '48', '50', '52', '54', '56'], colors: ['فحمي', 'كحلي', 'أسود'],
    sku: 'VL-S-002', badge: 'تخفيض', featured: true,
    material: 'صوف سوبر 120 إيطالي', care: 'تنظيف جاف فقط', stock: 12, rating: 5.0, reviewCount: 54,
  },
  {
    name: 'بدلة سموكن سوداء',
    slug: 'black-tuxedo',
    description: 'بدلة سموكن (تكسييدو) سوداء بياقة ساتان لامعة وأزرار مغطاة. للمناسبات التي تستوجب أناقة Black-Tie الكاملة. تفاصيل دقيقة وخامة فاخرة تجعلك نجماً في كل سهرة.',
    price: 9800, category: 'suits',
    images: ['/images/tuxedo-black.jpg', '/images/editorial-formal-1.jpg'],
    sizes: ['46', '48', '50', '52', '54'], colors: ['أسود'],
    sku: 'VL-S-003', badge: 'الأكثر مبيعاً', featured: true,
    material: 'صوف فاخر بليسر ساتان', care: 'تنظيف جاف فقط', stock: 9, rating: 4.9, reviewCount: 41,
  },
  {
    name: 'بدلة كحلي نيلي',
    slug: 'navy-suit',
    description: 'بدلة كحلي نيلي بقصّة عصرية أنيقة (slim fit) وياقة notch lapel. خامة صوفية فاخرة بملمس ناعم ولون خالد. الخيار المثالي للعمل والمقابلات الرسمية والمناسبات النهارية.',
    price: 6500, comparePrice: 7200, category: 'suits',
    images: ['/images/suit-navy.jpg', '/images/promo-formal.jpg'],
    sizes: ['46', '48', '50', '52', '54', '56'], colors: ['كحلي', 'كحلي داكن'],
    sku: 'VL-S-004', badge: 'جديد', featured: true,
    material: 'صوف سوبر 110', care: 'تنظيف جاف فقط', stock: 22, rating: 4.7, reviewCount: 67,
  },
  {
    name: 'بليزر صوف كحلي',
    slug: 'navy-wool-blazer',
    description: 'بليزر صوف كحلي بزر واحد وقصّة عصرية. قطعة متعددة الاستخدامات تناسب الإطلالات الرسمية وشبه الرسمية. يُ pairs بإتقان مع بنطال رمادي أو كاكي لإطلالة smart casual راقية.',
    price: 3900, category: 'suits',
    images: ['/images/blazer-wool.jpg'],
    sizes: ['46', '48', '50', '52', '54'], colors: ['كحلي', 'فحمي'],
    sku: 'VL-S-005',
    material: 'صوف مخلوط فاخر', care: 'تنظيف جاف فقط', stock: 26, rating: 4.6, reviewCount: 33,
  },

  // ===== Shirts =====
  {
    name: 'قميص قطن مصري أبيض',
    slug: 'white-egyptian-cotton-shirt',
    description: 'قميص من القطن المصري الفاخر بياقة كلاسيكية (spread collar) وقصّة مستقيمة مريحة. خامة ناعمة متينة تتنفّس بسهولة. أساسي في خزانة كل رجل أنيق، يناسب البدل والإطلالات الرسمية.',
    price: 1490, category: 'shirts',
    images: ['/images/cotton-shirt.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['أبيض', 'كريمي', 'أوف وايت'],
    sku: 'VL-SH-001', badge: 'الأكثر مبيعاً', featured: true,
    material: '100% قطن مصري فاخر', care: 'غسيل بارد، كي على حرارة متوسطة', stock: 48, rating: 4.8, reviewCount: 124,
  },
  {
    name: 'قميص أزرق فاتح',
    slug: 'light-blue-shirt',
    description: 'قميص قطني بلون أزرق فاتح هادئ بياقة كلاسيكية. يناسب البدل الكحلي والرمادي بامتياز. خامة قطن مصري ناعمة تمنحك مظهراً منعشاً طوال اليوم.',
    price: 1490, comparePrice: 1690, category: 'shirts',
    images: ['/images/shirt-blue.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['أزرق فاتح', 'أزرق سماوي'],
    sku: 'VL-SH-002', badge: 'تخفيض', featured: true,
    material: '100% قطن مصري', care: 'غسيل بارد، كي متوسط', stock: 40, rating: 4.7, reviewCount: 58,
  },
  {
    name: 'قميص كريمي كلاسيك',
    slug: 'cream-classic-shirt',
    description: 'قميص بلون كريمي دافئ بياقة كلاسيكية وقصّة أنيقة. بديل راقٍ للأبيض التقليدي يمنح إطلالتك دفئاً وأناقة. يناسب البدل الفحمية والكحلية والجملي.',
    price: 1590, category: 'shirts',
    images: ['/images/shirt-cream.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['كريمي', 'أوف وايت'],
    sku: 'VL-SH-003', badge: 'جديد',
    material: 'قطن مصري مخلوط', care: 'غسيل بارد، كي متوسط', stock: 32, rating: 4.6, reviewCount: 24,
  },

  // ===== Overcoats =====
  {
    name: 'معطف صوفي فحمي',
    slug: 'charcoal-wool-overcoat',
    description: 'معطف صوفي بلون الفحم بقصّة كلاسيكية طويلة وياقة عريضة. خامة صوف كشمير مخلوط فاخرة تمنحك دفئاً استثنائياً وأناقة لا تضاهى. قطعة استثمارية تدوم لسنوات.',
    price: 5900, comparePrice: 6800, category: 'overcoats',
    images: ['/images/overcoat-charcoal.jpg', '/images/editorial-formal-2.jpg'],
    sizes: ['46', '48', '50', '52', '54', '56'], colors: ['فحمي', 'كحلي', 'جملي'],
    sku: 'VL-O-001', badge: 'تخفيض', featured: true,
    material: 'صوف 80% + كشمير 20%', care: 'تنظيف جاف فقط', stock: 14, rating: 4.9, reviewCount: 47,
  },
  {
    name: 'معطف صوفي كاميل',
    slug: 'camel-wool-overcoat',
    description: 'معطف صوفي بلون الجملي الكلاسيكي الخالد بقصّة كلاسيكية أنيقة. اللون الجملي الدافئ يضيف لمسة راقية لإطلالتك الشتوية. مثالي فوق البدل أو الـ blazer.',
    price: 6200, category: 'overcoats',
    images: ['/images/cat-overcoats.jpg'],
    sizes: ['46', '48', '50', '52', '54', '56'], colors: ['جملي', 'بيج صحراوي'],
    sku: 'VL-O-002', badge: 'جديد', featured: true,
    material: 'صوف إيطالي فاخر', care: 'تنظيف جاف فقط', stock: 11, rating: 4.8, reviewCount: 29,
  },

  // ===== Formal Shoes =====
  {
    name: 'حذاء أكسفورد بني',
    slug: 'brown-oxford-shoes',
    description: 'حذاء أكسفورد كلاسيكي من الجلد الطبيعي البني بحرفة يدوية فاخرة. تفصيل cap-toe أنيق يضفي لمسة كلاسيكية. أساسي في خزانة الرجل الأنيقة يناسب البدل بكل ألوانها.',
    price: 2890, category: 'formal-shoes',
    images: ['/images/oxford-shoes.jpg'],
    sizes: ['40', '41', '42', '43', '44', '45'], colors: ['بني', 'بني داكن'],
    sku: 'VL-FS-001', badge: 'الأكثر مبيعاً', featured: true,
    material: 'جلد طبيعي 100%، نعل جلدي', care: 'تلميع دوري بالكريم المناسب', stock: 20, rating: 4.9, reviewCount: 73,
  },
  {
    name: 'حذاء ديربي أسود',
    slug: 'black-derby-shoes',
    description: 'حذاء ديربي كلاسيكي أسود من الجلد المصقول. تفصيل open-lacing أنيق يناسب البدل الرسمية والسموكن. خامة جلدية فاخرة وصناعة متينة تدوم سنوات مع العناية المناسبة.',
    price: 2790, comparePrice: 3190, category: 'formal-shoes',
    images: ['/images/shoes-derby-black.jpg'],
    sizes: ['40', '41', '42', '43', '44', '45'], colors: ['أسود'],
    sku: 'VL-FS-002', badge: 'تخفيض', featured: true,
    material: 'جلد طبيعي مصقول 100%', care: 'تلميع دوري بالكريم المناسب', stock: 17, rating: 4.7, reviewCount: 44,
  },
  {
    name: 'حذاء مونك جلد بني',
    slug: 'brown-monk-strap-shoes',
    description: 'حذاء مونك بحزامين من الجلد البني الطبيعي. تصميم عصري راقٍ يجمع بين الكلاسيك والحداثة. بديل أنيق للأكسفورد يضيف لمسة تميّز لإطلالتك الرسمية.',
    price: 3190, category: 'formal-shoes',
    images: ['/images/shoes-monk-brown.jpg'],
    sizes: ['40', '41', '42', '43', '44', '45'], colors: ['بني', 'كحلي'],
    sku: 'VL-FS-003', badge: 'جديد',
    material: 'جلد طبيعي 100%', care: 'تلميع دوري بالكريم المناسب', stock: 13, rating: 4.8, reviewCount: 26,
  },

  // ===== Accessories =====
  {
    name: 'كرفات حرير بورجوندي',
    slug: 'burgundy-silk-tie',
    description: 'كرفات من الحرير الطبيعي بلون بورجوندي ونقشة كلاسيكية راقية. خامة فاخرة بملمس ناعم وعقدة أنيقة. يضفي لمسة لون راقية على القميص الأبيض أو الأزرق.',
    price: 890, comparePrice: 1090, category: 'accessories',
    images: ['/images/tie-silk.jpg'],
    sizes: ['مقاس واحد'], colors: ['بورجوندي', 'كحلي', 'أخضر داكن'],
    sku: 'VL-A-001', badge: 'تخفيض', featured: true,
    material: '100% حرير طبيعي', care: 'تنظيف جاف فقط', stock: 45, rating: 4.7, reviewCount: 52,
  },
  {
    name: 'بابيون حرير أسود',
    slug: 'black-silk-bow-tie',
    description: 'بابيون (ربطة عنق فراشة) من الحرير الطبيعي الأسود. الخيار الكلاسيكي لإطلالة Black-Tie مع السموكن. يأتي جاهز العقدة أو قابل للتعديل حسب الرغبة.',
    price: 690, category: 'accessories',
    images: ['/images/bow-tie.jpg'],
    sizes: ['مقاس واحد'], colors: ['أسود', 'بورجوندي'],
    sku: 'VL-A-002', badge: 'جديد',
    material: '100% حرير طبيعي', care: 'تنظيف جاف فقط', stock: 38, rating: 4.6, reviewCount: 19,
  },
  {
    name: 'أزرار كمّ فضية',
    slug: 'silver-cufflinks',
    description: 'طقم أزرار كمّ من الفضة الأونيكس الأسود بتصميم كلاسيكي راقٍ. لمسة أخيرة تكمّل إطلالة القميص الرسمي. تأتي في علبة هدايا أنيقة.',
    price: 1290, comparePrice: 1490, category: 'accessories',
    images: ['/images/cufflinks.jpg'],
    sizes: ['مقاس واحد'], colors: ['فضي', 'ذهبي'],
    sku: 'VL-A-003', badge: 'تخفيض', featured: true,
    material: 'فضة استرليني وأونيكس', care: 'تنظيف بقطعة جافة', stock: 24, rating: 4.8, reviewCount: 31,
  },
  {
    name: 'وشاح جيب حرير',
    slug: 'silk-pocket-square',
    description: 'وشاح جيب من الحرير الطبيعي بنقشة كلاسيكية وألوان دافئة. لمسة أنيقة تكمل بدلة السموكن أو البليزر. يُطوى بطرق متعددة لإطلالات مختلفة.',
    price: 590, category: 'accessories',
    images: ['/images/pocket-square.jpg'],
    sizes: ['مقاس واحد'], colors: ['كريمي ذهبي', 'بورجوندي'],
    sku: 'VL-A-004',
    material: '100% حرير طبيعي', care: 'تنظيف جاف فقط', stock: 51, rating: 4.5, reviewCount: 22,
  },
  {
    name: 'حزام جلد أسود',
    slug: 'black-leather-belt',
    description: 'حزام من الجلد الطبيعي الأسود بسّامة فضية أنيقة. حرفة يدوية فاخرة تدوم طويلاً. يناسب البدل الرسمية والسموكن بامتياز.',
    price: 790, category: 'accessories',
    images: ['/images/leather-belt.jpg'],
    sizes: ['85', '90', '95', '100', '105'], colors: ['أسود', 'بني'],
    sku: 'VL-A-005',
    material: 'جلد طبيعي 100%', care: 'تنظيف بقطعة جافة', stock: 42, rating: 4.6, reviewCount: 35,
  },
  {
    name: 'ساعة يد جلدية',
    slug: 'leather-strap-watch',
    description: 'ساعة يد أنيقة بحركة كوارتز سويسرية وسوار جلدي فاخر. تصميم مينيمال راقٍ بمينال أبيض يناسب البدل الرسمية وكل المناسبات.',
    price: 3890, comparePrice: 4490, category: 'accessories',
    images: ['/images/luxury-watch.jpg'],
    sizes: ['مقاس واحد'], colors: ['بني', 'أسود'],
    sku: 'VL-A-006', badge: 'الأكثر مبيعاً', featured: true,
    material: 'ستيل مقاوم للصدأ، جلد طبيعي', care: 'مقاومة للماء 3 ATM', stock: 12, rating: 4.9, reviewCount: 67,
  },
]

const reviews = [
  { productSlug: 'classic-camel-suit', authorName: 'أحمد سمير', rating: 5, title: 'بدلة استثنائية', comment: 'الخامة فاخرة جداً والقصّة مظبوطة تماماً. لبستها في زفاف صديقي وكل الناس سألت عنها. تستاهل كل جنيه.', verified: true },
  { productSlug: 'classic-camel-suit', authorName: 'كريم وليد', rating: 5, title: 'أناقة لا توصف', comment: 'اللون الجملي تحفة والصوف ناعم جداً. الخياطة محكمة والتفاصيل دقيقة. فيلورا بصراحة فاقت توقعاتي.', verified: true },
  { productSlug: 'classic-camel-suit', authorName: 'محمد رضا', rating: 4, title: 'ممتازة', comment: 'البدلة جميلة جداً بس المقاس شوية ضيق عند الكتف، يفضل تطلب مقاس أكبر.', verified: false },
  { productSlug: 'charcoal-three-piece-suit', authorName: 'عمر حسن', rating: 5, title: 'تحفة ثلاثية', comment: 'الجليكة بتاعتها فخمة جداً واللون الفحمي عميق وراقي. لبستها في خطوبة وأنا حاسس إنني أمير.', verified: true },
  { productSlug: 'charcoal-three-piece-suit', authorName: 'يوسف عادل', rating: 5, title: 'استثمار يستحق', comment: 'الخامة صوف سوبر 120 واضح إنها فاخرة. القصّة كلاسيكية هتفضل موديل لسنين.', verified: true },
  { productSlug: 'black-tuxedo', authorName: 'مصطفى طارق', rating: 5, title: 'سموكن خرافي', comment: 'لبسته في حفلة Black-Tie وكان كل الحاضرين بيسألوا. الـ satin لامع فخم والقصّة مثالية.', verified: true },
  { productSlug: 'navy-suit', authorName: 'خالد إبراهيم', rating: 5, title: 'بدلة العمل المثالية', comment: 'اللون الكحلي عملي وأنيق، لبستها في مقابلة شغل ولقيت إعجاب كبير. القصّة slim مرتبة جداً.', verified: true },
  { productSlug: 'white-egyptian-cotton-shirt', authorName: 'منير سعيد', rating: 5, title: 'قميص ممتاز', comment: 'القطن المصري ناعم جداً والياقة ثابتة. بصراحة أفضل قميص لبسته. هطلب أكيد تاني.', verified: true },
  { productSlug: 'white-egyptian-cotton-shirt', authorName: 'حسام فؤاد', rating: 4, title: 'جودة عالية', comment: 'الخامة ممتازة والخياطة محكمة. بس حبيت لو الياقة أعرض شوية.', verified: false },
  { productSlug: 'charcoal-wool-overcoat', authorName: 'طارق محمود', rating: 5, title: 'معطف استثماري', comment: 'الصوف الكشمير دافي جداً والقصّة كلاسيكية. قطعة هتفضل معايا سنين. يستاهل السعر.', verified: true },
  { productSlug: 'brown-oxford-shoes', authorName: 'باسم نبيل', rating: 5, title: 'حذاء كلاسيك ممتاز', comment: 'الجلد فاخر والراحة ممتازة. الصناعة اليدوية واضحة. مناسب لكل المناسبات الرسمية.', verified: true },
  { productSlug: 'burgundy-silk-tie', authorName: 'وليد جمال', rating: 5, title: 'كرفات راقي', comment: 'الحرير ناعم والعقدة ثابتة. اللون البورجوندي بيضيف لمسة فخمة على القميص الأبيض.', verified: true },
  { productSlug: 'silver-cufflinks', authorName: 'أمين شريف', rating: 5, title: 'طقم أنيق', comment: 'التصميم كلاسيكي والعلبة حلوة هدية. بيكمّل القميص الفرنساوي بشكل ممتاز.', verified: true },
  { productSlug: 'leather-strap-watch', authorName: 'نور الدين', rating: 5, title: 'ساعة أنيقة', comment: 'تصميم بسيط وراقي، السوار الجلدي مريح. شغل سويسري حقيقي بثبات ممتاز.', verified: true },
]

async function main() {
  console.log('🌱 Seeding VELORA formal menswear...')

  await db.review.deleteMany()
  await db.cartItem.deleteMany()
  await db.wishlistItem.deleteMany()
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.newsletter.deleteMany()

  for (const c of categories) {
    await db.category.create({ data: c })
  }
  console.log(`✓ Created ${categories.length} categories`)

  let productCount = 0
  for (const p of products) {
    const cat = await db.category.findUnique({ where: { slug: p.category } })
    if (!cat) continue
    const { category, ...rest } = p
    await db.product.create({
      data: {
        ...rest,
        categoryId: cat.id,
        images: JSON.stringify(p.images),
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
      },
    })
    productCount++
  }
  console.log(`✓ Created ${productCount} products`)

  let reviewCount = 0
  for (const r of reviews) {
    const product = await db.product.findUnique({ where: { slug: r.productSlug } })
    if (!product) continue
    const { productSlug, ...rest } = r
    await db.review.create({
      data: { ...rest, productId: product.id },
    })
    reviewCount++
  }
  console.log(`✓ Created ${reviewCount} reviews`)

  // Recalculate ratings
  const allProducts = await db.product.findMany({ include: { reviews: true } })
  for (const p of allProducts) {
    if (p.reviews.length > 0) {
      const avg = p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
      await db.product.update({ where: { id: p.id }, data: { rating: Math.round(avg * 10) / 10, reviewCount: p.reviews.length } })
    }
  }
  console.log('✓ Recalculated ratings')
  console.log('🌱 Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
