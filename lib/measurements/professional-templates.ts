// Comprehensive professional tailoring measurement templates
// Based on international tailoring standards and African tailoring practices

export interface MeasurementField {
  key: string
  label: string
  unit: string
  position: string
  description?: string
  required?: boolean
}

export interface MeasurementTemplate {
  title: string
  fields: MeasurementField[]
  instructions?: string
}

// MALE MEASUREMENT TEMPLATES
export const MALE_MEASUREMENTS = {
  // ========================================
  // SHIRTS & TOPS
  // ========================================
  dress_shirt_long: {
    title: 'Dress Shirt - Long Sleeve (Male)',
    instructions: 'For formal/business long-sleeve shirts',
    fields: [
      { key: 'neck', label: 'Neck Circumference', unit: 'cm', position: 'neck', description: 'Around the base of neck', required: true },
      { key: 'chest', label: 'Chest/Bust', unit: 'cm', position: 'chest', description: 'Fullest part around chest', required: true },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', description: 'Natural waistline', required: true },
      { key: 'hips', label: 'Hips', unit: 'cm', position: 'hips', description: 'Fullest part of hips' },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', description: 'Across shoulders from point to point', required: true },
      { key: 'shoulder_slope', label: 'Shoulder Slope', unit: 'cm', position: 'shoulders', description: 'Shoulder drop measurement' },
      { key: 'across_back', label: 'Across Back', unit: 'cm', position: 'back', description: 'Across shoulder blades' },
      { key: 'sleeve_length', label: 'Sleeve Length', unit: 'cm', position: 'arms', description: 'Shoulder to wrist with arm bent', required: true },
      { key: 'sleeve_outseam', label: 'Sleeve Outseam', unit: 'cm', position: 'arms', description: 'Shoulder point to wrist' },
      { key: 'bicep', label: 'Bicep/Upper Arm', unit: 'cm', position: 'arms', description: 'Around fullest part of bicep', required: true },
      { key: 'elbow', label: 'Elbow', unit: 'cm', position: 'arms', description: 'Around elbow with arm bent' },
      { key: 'forearm', label: 'Forearm', unit: 'cm', position: 'arms', description: 'Widest part of forearm' },
      { key: 'wrist', label: 'Wrist', unit: 'cm', position: 'arms', description: 'Around wrist bone', required: true },
      { key: 'shirt_length', label: 'Shirt Length', unit: 'cm', position: 'torso', description: 'Nape of neck to hem', required: true },
      { key: 'yoke', label: 'Yoke Width', unit: 'cm', position: 'back', description: 'Across back yoke' },
      { key: 'armhole', label: 'Armhole', unit: 'cm', position: 'arms', description: 'Around armhole opening' },
      { key: 'cuff', label: 'Cuff', unit: 'cm', position: 'arms', description: 'Wrist for cuff' },
    ],
  },

  casual_shirt_short: {
    title: 'Casual Shirt - Short Sleeve (Male)',
    instructions: 'For casual short-sleeve shirts and polo shirts',
    fields: [
      { key: 'neck', label: 'Neck Circumference', unit: 'cm', position: 'neck', required: true },
      { key: 'chest', label: 'Chest', unit: 'cm', position: 'chest', required: true },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', required: true },
      { key: 'hips', label: 'Hips', unit: 'cm', position: 'hips' },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', required: true },
      { key: 'across_back', label: 'Across Back', unit: 'cm', position: 'back' },
      { key: 'sleeve_length_short', label: 'Short Sleeve Length', unit: 'cm', position: 'arms', description: 'Shoulder to sleeve hem', required: true },
      { key: 'bicep', label: 'Bicep', unit: 'cm', position: 'arms', required: true },
      { key: 'armhole', label: 'Armhole', unit: 'cm', position: 'arms' },
      { key: 'shirt_length', label: 'Shirt Length', unit: 'cm', position: 'torso', required: true },
    ],
  },

  // ========================================
  // TROUSERS & PANTS
  // ========================================
  formal_trousers: {
    title: 'Formal Trousers (Male)',
    instructions: 'For dress pants and formal trousers',
    fields: [
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', description: 'Natural waist or where trousers sit', required: true },
      { key: 'hips', label: 'Hips/Seat', unit: 'cm', position: 'hips', description: 'Fullest part of hips', required: true },
      { key: 'rise_front', label: 'Front Rise', unit: 'cm', position: 'crotch', description: 'Waist to crotch seam (front)', required: true },
      { key: 'rise_back', label: 'Back Rise', unit: 'cm', position: 'crotch', description: 'Waist to crotch seam (back)', required: true },
      { key: 'crotch', label: 'Crotch Depth', unit: 'cm', position: 'crotch', description: 'Total crotch measurement' },
      { key: 'inseam', label: 'Inseam', unit: 'cm', position: 'legs', description: 'Inside leg from crotch to ankle', required: true },
      { key: 'outseam', label: 'Outseam', unit: 'cm', position: 'legs', description: 'Outside leg from waist to ankle', required: true },
      { key: 'thigh', label: 'Thigh', unit: 'cm', position: 'legs', description: 'Around fullest part of thigh', required: true },
      { key: 'knee', label: 'Knee', unit: 'cm', position: 'legs', description: 'Around knee', required: true },
      { key: 'calf', label: 'Calf', unit: 'cm', position: 'legs', description: 'Around fullest part of calf' },
      { key: 'ankle', label: 'Ankle/Bottom Opening', unit: 'cm', position: 'legs', description: 'Leg opening at ankle', required: true },
      { key: 'trouser_length', label: 'Trouser Length', unit: 'cm', position: 'legs', description: 'Waist to floor' },
    ],
  },

  casual_pants: {
    title: 'Casual Pants/Jeans (Male)',
    instructions: 'For casual pants, chinos, and jeans',
    fields: [
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', required: true },
      { key: 'hips', label: 'Hips', unit: 'cm', position: 'hips', required: true },
      { key: 'rise_front', label: 'Front Rise', unit: 'cm', position: 'crotch', required: true },
      { key: 'rise_back', label: 'Back Rise', unit: 'cm', position: 'crotch' },
      { key: 'inseam', label: 'Inseam', unit: 'cm', position: 'legs', required: true },
      { key: 'outseam', label: 'Outseam', unit: 'cm', position: 'legs', required: true },
      { key: 'thigh', label: 'Thigh', unit: 'cm', position: 'legs', required: true },
      { key: 'knee', label: 'Knee', unit: 'cm', position: 'legs', required: true },
      { key: 'leg_opening', label: 'Leg Opening', unit: 'cm', position: 'legs', description: 'Bottom hem opening', required: true },
    ],
  },

  // ========================================
  // SUITS & JACKETS
  // ========================================
  suit_jacket: {
    title: 'Suit Jacket/Blazer (Male)',
    instructions: 'For two-piece suits, blazers, and sports jackets',
    fields: [
      { key: 'neck', label: 'Neck', unit: 'cm', position: 'neck', required: true },
      { key: 'chest', label: 'Chest', unit: 'cm', position: 'chest', description: 'Fullest part, armpit level', required: true },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', required: true },
      { key: 'stomach', label: 'Stomach', unit: 'cm', position: 'torso', description: 'Fullest part of stomach' },
      { key: 'hips', label: 'Hips/Seat', unit: 'cm', position: 'hips', required: true },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', required: true },
      { key: 'shoulder_slope', label: 'Shoulder Slope', unit: 'cm', position: 'shoulders' },
      { key: 'across_back', label: 'Across Back', unit: 'cm', position: 'back', required: true },
      { key: 'back_width', label: 'Back Width', unit: 'cm', position: 'back' },
      { key: 'jacket_length', label: 'Jacket Length', unit: 'cm', position: 'torso', description: 'Nape of neck to hem', required: true },
      { key: 'front_length', label: 'Front Length', unit: 'cm', position: 'torso', description: 'Shoulder seam to hem' },
      { key: 'back_length', label: 'Back Length', unit: 'cm', position: 'back', description: 'Nape to hem' },
      { key: 'sleeve_length', label: 'Sleeve Length', unit: 'cm', position: 'arms', description: 'Shoulder to wrist', required: true },
      { key: 'sleeve_outseam', label: 'Sleeve Outseam', unit: 'cm', position: 'arms' },
      { key: 'bicep', label: 'Bicep', unit: 'cm', position: 'arms', required: true },
      { key: 'elbow', label: 'Elbow', unit: 'cm', position: 'arms' },
      { key: 'wrist', label: 'Wrist', unit: 'cm', position: 'arms', required: true },
      { key: 'armhole', label: 'Armhole', unit: 'cm', position: 'arms', description: 'Around armhole opening', required: true },
      { key: 'armhole_depth', label: 'Armhole Depth', unit: 'cm', position: 'arms' },
      { key: 'lapel_width', label: 'Lapel Width', unit: 'cm', position: 'chest', description: 'Preferred lapel width' },
    ],
  },

  waistcoat: {
    title: 'Waistcoat/Vest (Male)',
    instructions: 'For three-piece suits and vests',
    fields: [
      { key: 'chest', label: 'Chest', unit: 'cm', position: 'chest', required: true },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', required: true },
      { key: 'stomach', label: 'Stomach', unit: 'cm', position: 'torso' },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', required: true },
      { key: 'across_back', label: 'Across Back', unit: 'cm', position: 'back', required: true },
      { key: 'vest_length', label: 'Vest Length', unit: 'cm', position: 'torso', required: true },
      { key: 'armhole', label: 'Armhole', unit: 'cm', position: 'arms', required: true },
    ],
  },

  // ========================================
  // TRADITIONAL/CULTURAL GARMENTS
  // ========================================
  kaftan_agbada: {
    title: 'Kaftan/Agbada (Male Traditional)',
    instructions: 'For traditional African flowing garments',
    fields: [
      { key: 'neck', label: 'Neck', unit: 'cm', position: 'neck', required: true },
      { key: 'chest', label: 'Chest', unit: 'cm', position: 'chest', required: true },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist' },
      { key: 'hips', label: 'Hips', unit: 'cm', position: 'hips' },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', required: true },
      { key: 'sleeve_length', label: 'Sleeve Length', unit: 'cm', position: 'arms', required: true },
      { key: 'sleeve_width', label: 'Sleeve Width', unit: 'cm', position: 'arms', description: 'Width of sleeve opening' },
      { key: 'garment_length', label: 'Full Length', unit: 'cm', position: 'torso', description: 'Shoulder to floor/desired length', required: true },
      { key: 'slit_height', label: 'Side Slit Height', unit: 'cm', position: 'torso', description: 'Height of side slits' },
      { key: 'armhole', label: 'Armhole', unit: 'cm', position: 'arms' },
    ],
  },
}

// FEMALE MEASUREMENT TEMPLATES
export const FEMALE_MEASUREMENTS = {
  // ========================================
  // TOPS & BLOUSES
  // ========================================
  blouse_long: {
    title: 'Blouse - Long Sleeve (Female)',
    instructions: 'For formal and casual long-sleeve blouses',
    fields: [
      { key: 'neck', label: 'Neck Circumference', unit: 'cm', position: 'neck', required: true },
      { key: 'bust', label: 'Bust (Full)', unit: 'cm', position: 'chest', description: 'Fullest part of bust', required: true },
      { key: 'under_bust', label: 'Under Bust', unit: 'cm', position: 'chest', description: 'Just under bust', required: true },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', description: 'Natural waistline', required: true },
      { key: 'high_hip', label: 'High Hip', unit: 'cm', position: 'hips', description: 'Upper hip measurement' },
      { key: 'hips', label: 'Full Hips', unit: 'cm', position: 'hips', description: 'Fullest part of hips', required: true },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', description: 'Point to point', required: true },
      { key: 'shoulder_to_bust', label: 'Shoulder to Bust', unit: 'cm', position: 'chest', description: 'Shoulder point to bust point', required: true },
      { key: 'shoulder_to_waist', label: 'Shoulder to Waist', unit: 'cm', position: 'torso', required: true },
      { key: 'bust_point_distance', label: 'Bust Point Distance', unit: 'cm', position: 'chest', description: 'Between bust points' },
      { key: 'across_front', label: 'Across Front', unit: 'cm', position: 'chest', description: 'Across chest at armhole' },
      { key: 'across_back', label: 'Across Back', unit: 'cm', position: 'back', description: 'Across shoulder blades', required: true },
      { key: 'back_width', label: 'Back Width', unit: 'cm', position: 'back' },
      { key: 'sleeve_length', label: 'Sleeve Length', unit: 'cm', position: 'arms', description: 'Shoulder to wrist', required: true },
      { key: 'bicep', label: 'Upper Arm', unit: 'cm', position: 'arms', description: 'Around fullest part', required: true },
      { key: 'elbow', label: 'Elbow', unit: 'cm', position: 'arms' },
      { key: 'forearm', label: 'Forearm', unit: 'cm', position: 'arms' },
      { key: 'wrist', label: 'Wrist', unit: 'cm', position: 'arms', required: true },
      { key: 'armhole', label: 'Armhole', unit: 'cm', position: 'arms', required: true },
      { key: 'blouse_length', label: 'Blouse Length', unit: 'cm', position: 'torso', description: 'Nape to hem', required: true },
      { key: 'front_neck_depth', label: 'Front Neck Depth', unit: 'cm', position: 'neck', description: 'Neck opening depth' },
      { key: 'back_neck_depth', label: 'Back Neck Depth', unit: 'cm', position: 'neck', description: 'Back neckline depth' },
    ],
  },

  blouse_short: {
    title: 'Blouse - Short Sleeve (Female)',
    instructions: 'For short-sleeve blouses and casual tops',
    fields: [
      { key: 'neck', label: 'Neck', unit: 'cm', position: 'neck', required: true },
      { key: 'bust', label: 'Bust', unit: 'cm', position: 'chest', required: true },
      { key: 'under_bust', label: 'Under Bust', unit: 'cm', position: 'chest', required: true },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', required: true },
      { key: 'hips', label: 'Hips', unit: 'cm', position: 'hips', required: true },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', required: true },
      { key: 'shoulder_to_bust', label: 'Shoulder to Bust', unit: 'cm', position: 'chest', required: true },
      { key: 'across_back', label: 'Across Back', unit: 'cm', position: 'back', required: true },
      { key: 'sleeve_length_short', label: 'Short Sleeve Length', unit: 'cm', position: 'arms', required: true },
      { key: 'bicep', label: 'Upper Arm', unit: 'cm', position: 'arms', required: true },
      { key: 'armhole', label: 'Armhole', unit: 'cm', position: 'arms', required: true },
      { key: 'blouse_length', label: 'Blouse Length', unit: 'cm', position: 'torso', required: true },
    ],
  },

  // ========================================
  // DRESSES
  // ========================================
  dress_fitted: {
    title: 'Fitted Dress (Female)',
    instructions: 'For bodycon, sheath, and fitted dresses',
    fields: [
      { key: 'neck', label: 'Neck', unit: 'cm', position: 'neck', required: true },
      { key: 'bust', label: 'Bust', unit: 'cm', position: 'chest', required: true },
      { key: 'under_bust', label: 'Under Bust', unit: 'cm', position: 'chest', required: true },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', required: true },
      { key: 'high_hip', label: 'High Hip', unit: 'cm', position: 'hips', required: true },
      { key: 'hips', label: 'Full Hips', unit: 'cm', position: 'hips', required: true },
      { key: 'thigh', label: 'Thigh', unit: 'cm', position: 'legs', description: 'For fitted bottom' },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', required: true },
      { key: 'shoulder_to_bust', label: 'Shoulder to Bust', unit: 'cm', position: 'chest', required: true },
      { key: 'shoulder_to_waist', label: 'Shoulder to Waist', unit: 'cm', position: 'torso', required: true },
      { key: 'waist_to_hip', label: 'Waist to Hip', unit: 'cm', position: 'hips', required: true },
      { key: 'bust_point_distance', label: 'Bust Point Distance', unit: 'cm', position: 'chest' },
      { key: 'across_back', label: 'Across Back', unit: 'cm', position: 'back', required: true },
      { key: 'sleeve_length', label: 'Sleeve Length', unit: 'cm', position: 'arms', description: 'If applicable' },
      { key: 'armhole', label: 'Armhole', unit: 'cm', position: 'arms', required: true },
      { key: 'dress_length', label: 'Dress Length', unit: 'cm', position: 'torso', description: 'Shoulder to hem', required: true },
      { key: 'hollow_to_hem', label: 'Hollow to Hem', unit: 'cm', position: 'torso', description: 'Collarbone hollow to floor' },
      { key: 'nape_to_waist', label: 'Nape to Waist', unit: 'cm', position: 'torso', description: 'Back neck to waist' },
    ],
  },

  dress_flowing: {
    title: 'Flowing/A-Line Dress (Female)',
    instructions: 'For A-line, empire, and flowing dresses',
    fields: [
      { key: 'neck', label: 'Neck', unit: 'cm', position: 'neck', required: true },
      { key: 'bust', label: 'Bust', unit: 'cm', position: 'chest', required: true },
      { key: 'under_bust', label: 'Under Bust', unit: 'cm', position: 'chest', required: true },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', required: true },
      { key: 'hips', label: 'Hips', unit: 'cm', position: 'hips', required: true },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', required: true },
      { key: 'shoulder_to_bust', label: 'Shoulder to Bust', unit: 'cm', position: 'chest', required: true },
      { key: 'shoulder_to_waist', label: 'Shoulder to Waist', unit: 'cm', position: 'torso', required: true },
      { key: 'across_back', label: 'Across Back', unit: 'cm', position: 'back', required: true },
      { key: 'armhole', label: 'Armhole', unit: 'cm', position: 'arms', required: true },
      { key: 'dress_length', label: 'Dress Length', unit: 'cm', position: 'torso', required: true },
      { key: 'hem_width', label: 'Hem Width', unit: 'cm', position: 'torso', description: 'Desired bottom width' },
    ],
  },

  // ========================================
  // SKIRTS & PANTS
  // ========================================
  skirt_fitted: {
    title: 'Fitted Skirt (Female)',
    instructions: 'For pencil skirts and fitted styles',
    fields: [
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', required: true },
      { key: 'high_hip', label: 'High Hip', unit: 'cm', position: 'hips', required: true },
      { key: 'hips', label: 'Full Hips', unit: 'cm', position: 'hips', required: true },
      { key: 'thigh', label: 'Thigh', unit: 'cm', position: 'legs', description: 'If very fitted' },
      { key: 'skirt_length', label: 'Skirt Length', unit: 'cm', position: 'legs', description: 'Waist to hem', required: true },
      { key: 'waist_to_hip', label: 'Waist to Hip', unit: 'cm', position: 'hips', description: 'Vertical drop to hip line' },
      { key: 'slit_height', label: 'Slit Height', unit: 'cm', position: 'legs', description: 'If slit desired' },
      { key: 'hem_width', label: 'Hem Width', unit: 'cm', position: 'legs', description: 'Bottom opening' },
    ],
  },

  trousers_fitted: {
    title: 'Fitted Trousers (Female)',
    instructions: 'For dress pants and fitted trousers',
    fields: [
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', required: true },
      { key: 'high_hip', label: 'High Hip', unit: 'cm', position: 'hips', required: true },
      { key: 'hips', label: 'Full Hips', unit: 'cm', position: 'hips', required: true },
      { key: 'rise_front', label: 'Front Rise', unit: 'cm', position: 'crotch', required: true },
      { key: 'rise_back', label: 'Back Rise', unit: 'cm', position: 'crotch', required: true },
      { key: 'crotch', label: 'Crotch Depth', unit: 'cm', position: 'crotch' },
      { key: 'inseam', label: 'Inseam', unit: 'cm', position: 'legs', required: true },
      { key: 'outseam', label: 'Outseam', unit: 'cm', position: 'legs', required: true },
      { key: 'thigh', label: 'Thigh', unit: 'cm', position: 'legs', required: true },
      { key: 'knee', label: 'Knee', unit: 'cm', position: 'legs', required: true },
      { key: 'calf', label: 'Calf', unit: 'cm', position: 'legs', description: 'If tapered' },
      { key: 'ankle', label: 'Ankle/Bottom Opening', unit: 'cm', position: 'legs', required: true },
    ],
  },

  // ========================================
  // TRADITIONAL/CULTURAL
  // ========================================
  wrapper_dress: {
    title: 'Wrapper/Boubou (Female Traditional)',
    instructions: 'For traditional African wrapper styles and flowing gowns',
    fields: [
      { key: 'bust', label: 'Bust', unit: 'cm', position: 'chest', required: true },
      { key: 'under_bust', label: 'Under Bust', unit: 'cm', position: 'chest' },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', required: true },
      { key: 'hips', label: 'Hips', unit: 'cm', position: 'hips', required: true },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', required: true },
      { key: 'sleeve_length', label: 'Sleeve Length', unit: 'cm', position: 'arms', description: 'If sleeves desired' },
      { key: 'sleeve_width', label: 'Sleeve Width', unit: 'cm', position: 'arms', description: 'Width of flowing sleeve' },
      { key: 'garment_length', label: 'Full Length', unit: 'cm', position: 'torso', description: 'Shoulder to floor/ankle', required: true },
      { key: 'wrapper_width', label: 'Wrapper Width', unit: 'cm', position: 'hips', description: 'Total width around' },
    ],
  },
}

// Export combined templates
// CHILD MEASUREMENT TEMPLATES
// Simplified templates for children with age-appropriate measurements
export const CHILD_MEASUREMENTS = {
  shirt: {
    title: 'Shirt/Top (Child)',
    instructions: 'For children\'s shirts and tops',
    fields: [
      { key: 'chest', label: 'Chest', unit: 'cm', position: 'chest', description: 'Around chest', required: true },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', description: 'Around waist', required: true },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', description: 'Across shoulders', required: true },
      { key: 'sleeve_length', label: 'Sleeve Length', unit: 'cm', position: 'arms', description: 'Shoulder to wrist', required: true },
      { key: 'shirt_length', label: 'Shirt Length', unit: 'cm', position: 'torso', description: 'Neck to hem', required: true },
      { key: 'neck', label: 'Neck', unit: 'cm', position: 'neck', description: 'Around neck base' },
    ],
  },
  trousers: {
    title: 'Trousers/Pants (Child)',
    instructions: 'For children\'s trousers and pants',
    fields: [
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', description: 'Around waist', required: true },
      { key: 'hips', label: 'Hips', unit: 'cm', position: 'hips', description: 'Around hips', required: true },
      { key: 'inseam', label: 'Inseam', unit: 'cm', position: 'legs', description: 'Inside leg length', required: true },
      { key: 'outseam', label: 'Outseam', unit: 'cm', position: 'legs', description: 'Waist to ankle', required: true },
      { key: 'thigh', label: 'Thigh', unit: 'cm', position: 'legs', description: 'Around thigh' },
      { key: 'knee', label: 'Knee', unit: 'cm', position: 'legs', description: 'Around knee' },
      { key: 'ankle', label: 'Ankle', unit: 'cm', position: 'legs', description: 'Around ankle' },
    ],
  },
  dress: {
    title: 'Dress (Child)',
    instructions: 'For children\'s dresses',
    fields: [
      { key: 'chest', label: 'Chest', unit: 'cm', position: 'chest', description: 'Around chest', required: true },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', description: 'Around waist', required: true },
      { key: 'hips', label: 'Hips', unit: 'cm', position: 'hips', description: 'Around hips' },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', description: 'Across shoulders', required: true },
      { key: 'dress_length', label: 'Dress Length', unit: 'cm', position: 'torso', description: 'Shoulder to hem', required: true },
      { key: 'sleeve_length', label: 'Sleeve Length', unit: 'cm', position: 'arms', description: 'Shoulder to wrist (if applicable)' },
    ],
  },
  school_uniform: {
    title: 'School Uniform (Child)',
    instructions: 'For children\'s school uniforms',
    fields: [
      { key: 'chest', label: 'Chest', unit: 'cm', position: 'chest', description: 'Around chest', required: true },
      { key: 'waist', label: 'Waist', unit: 'cm', position: 'waist', description: 'Around waist', required: true },
      { key: 'hips', label: 'Hips', unit: 'cm', position: 'hips', description: 'Around hips' },
      { key: 'shoulder_width', label: 'Shoulder Width', unit: 'cm', position: 'shoulders', description: 'Across shoulders', required: true },
      { key: 'shirt_length', label: 'Shirt Length', unit: 'cm', position: 'torso', description: 'Neck to hem', required: true },
      { key: 'sleeve_length', label: 'Sleeve Length', unit: 'cm', position: 'arms', description: 'Shoulder to wrist', required: true },
      { key: 'trouser_length', label: 'Trouser Length', unit: 'cm', position: 'legs', description: 'Waist to ankle', required: true },
      { key: 'inseam', label: 'Inseam', unit: 'cm', position: 'legs', description: 'Inside leg length', required: true },
    ],
  },
}

export const MEASUREMENT_TEMPLATES = {
  male: MALE_MEASUREMENTS,
  female: FEMALE_MEASUREMENTS,
  child: CHILD_MEASUREMENTS,
}

// Get all garment types for a gender
export function getGarmentTypes(gender: 'male' | 'female' | 'child'): string[] {
  return Object.keys(MEASUREMENT_TEMPLATES[gender])
}

// Get template by gender and garment type
export function getTemplate(gender: 'male' | 'female' | 'child', garmentType: string): MeasurementTemplate | null {
  const templates = MEASUREMENT_TEMPLATES[gender]
  return (templates as any)[garmentType] || null
}

// Get display name for garment type
export function getGarmentTypeDisplayName(garmentType: string): string {
  const names: Record<string, string> = {
    dress_shirt_long: 'Dress Shirt (Long Sleeve)',
    casual_shirt_short: 'Casual Shirt (Short Sleeve)',
    formal_trousers: 'Formal Trousers',
    casual_pants: 'Casual Pants/Jeans',
    suit_jacket: 'Suit Jacket/Blazer',
    waistcoat: 'Waistcoat/Vest',
    kaftan_agbada: 'Kaftan/Agbada',
    blouse_long: 'Blouse (Long Sleeve)',
    blouse_short: 'Blouse (Short Sleeve)',
    dress_fitted: 'Fitted Dress',
    dress_flowing: 'Flowing/A-Line Dress',
    skirt_fitted: 'Fitted Skirt',
    trousers_fitted: 'Fitted Trousers',
    wrapper_dress: 'Wrapper/Boubou',
    shirt: 'Shirt/Top',
    trousers: 'Trousers/Pants',
    dress: 'Dress',
    school_uniform: 'School Uniform',
  }
  return names[garmentType] || garmentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}
