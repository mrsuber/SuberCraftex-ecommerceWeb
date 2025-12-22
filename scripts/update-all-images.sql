-- Update all products with 4 images each

UPDATE products SET images = ARRAY[
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
  'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800',
  'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800'
] WHERE sku = 'WH-001';

UPDATE products SET images = ARRAY[
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
  'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800',
  'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800'
] WHERE sku = 'SW-002';

UPDATE products SET images = ARRAY[
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
  'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
  'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800'
] WHERE sku = 'SG-003';

UPDATE products SET images = ARRAY[
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
  'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
  'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800'
] WHERE sku = 'LB-004';

UPDATE products SET images = ARRAY[
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
  'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800',
  'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800'
] WHERE sku = 'ML-005';

UPDATE products SET images = ARRAY[
  'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
  'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=800',
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'
] WHERE sku = 'CM-006';

UPDATE products SET images = ARRAY[
  'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
  'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
  'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=800'
] WHERE sku = 'YM-007';

UPDATE products SET images = ARRAY[
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800',
  'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800'
] WHERE sku = 'RS-008';
