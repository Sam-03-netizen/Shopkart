export const PRODUCT_CATEGORIES = [
    'Accessories',
    'Beauty',
    'Clothing',
    'Footwear',
    'Home & Living',
    'Lifestyle',
]

export const normalizeProductCategory = (value) => {
    if (typeof value !== 'string') return null
    const normalized = value.trim().toLocaleLowerCase()
    return PRODUCT_CATEGORIES.find((category) => category.toLocaleLowerCase() === normalized) ?? null
}
