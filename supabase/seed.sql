-- Sample Hekal catalog — replace with real products/photos once you have them.
-- Run after schema.sql.

insert into products (slug, name_en, name_ar, description_en, description_ar, price_egp, compare_at_price_egp, fabric_en, fabric_ar, image_url)
values
  ('classic-oxford', 'Classic Oxford Shirt', 'قميص أكسفورد كلاسيك',
   'A Hekal staple since 1970 — heavyweight Oxford cotton, button-down collar, made to outlast trends.',
   'قطعة أساسية من هيكل منذ 1970 — قطن أكسفورد ثقيل، ياقة بأزرار، مصنوع ليدوم.',
   650, 780, 'Oxford Cotton', 'قطن أكسفورد',
   null),
  ('poplin-slim', 'Slim Fit Poplin Shirt', 'قميص بوبلين سليم فيت',
   'Lightweight poplin with a tailored cut, for a cleaner silhouette under a jacket or on its own.',
   'قماش بوبلين خفيف بقصة ضيقة، لمظهر أنيق مع الجاكيت أو بمفرده.',
   580, null, 'Poplin', 'بوبلين',
   null),
  ('linen-summer', 'Linen Summer Shirt', 'قميص لينن صيفي',
   'Breathable linen blend for Cairo summers, relaxed fit, short sleeve option.',
   'خليط كتان يسمح بمرور الهواء لصيف القاهرة، قصة مريحة، متوفر بكم قصير.',
   620, null, 'Linen Blend', 'كتان مخلوط',
   null),
  ('flannel-check', 'Flannel Check Shirt', 'قميص فلانيل مقلم',
   'Brushed flannel in a classic check, built for cooler months.',
   'فلانيل مصقول بنقشة كاروهات كلاسيكية، مناسب للشهور الباردة.',
   700, null, 'Brushed Flannel', 'فلانيل مصقول',
   null);

-- Variants (sizes/colors + stock) for each product above
insert into product_variants (product_id, size, color_en, color_ar, stock)
select p.id, s.size, c.color_en, c.color_ar, 20
from products p
cross join (values ('S'),('M'),('L'),('XL'),('XXL')) as s(size)
cross join (values ('White','أبيض'),('Sky Blue','أزرق سماوي'),('Navy','كحلي')) as c(color_en, color_ar)
where p.slug in ('classic-oxford','poplin-slim','linen-summer','flannel-check');
