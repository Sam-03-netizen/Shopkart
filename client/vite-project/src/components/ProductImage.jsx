import { useState } from 'react'

const fallbackImage = '/product-placeholder.svg'

function ProductImage({ src, alt, className = '' }) {
  const [failedUrl, setFailedUrl] = useState('')
  const imageUrl = typeof src === 'string' && /^https:\/\//i.test(src) ? src : ''
  const useFallback = !imageUrl || imageUrl === failedUrl

  return (
    <img
      className={className}
      src={useFallback ? fallbackImage : imageUrl}
      alt={alt}
      onError={() => imageUrl && setFailedUrl(imageUrl)}
    />
  )
}

export default ProductImage
