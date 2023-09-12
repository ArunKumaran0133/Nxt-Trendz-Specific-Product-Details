import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props

  const {imageUrl, brand, price, rating, title} = eachProduct
  console.log(imageUrl)

  return (
    <li className="items-container-similar">
      <img src={imageUrl} alt="similar product" className="similar-image" />
      <p className="similar-image-title">{title}</p>
      <p className="similar-image-brand">{brand}</p>
      <div className="price-and-rating-container">
        <p className="similar-image-price">Rs {price}/-</p>
        <div className="rating-similar-details">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-image-product-detail"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
