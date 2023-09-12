import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusObj = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusObj.initial,
    productItemDetails: {},
    similarProducts: [],
    count: 1,
  }

  componentDidMount() {
    this.getItemDetails()
  }

  getItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusObj.inProgress})

    const token = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const formatData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
      }

      const formatSimilarData = data.similar_products.map(eachProduct => ({
        id: eachProduct.id,
        imageUrl: eachProduct.image_url,
        brand: eachProduct.brand,
        price: eachProduct.price,
        rating: eachProduct.rating,
        title: eachProduct.title,
      }))

      this.setState({
        apiStatus: apiStatusObj.success,
        productItemDetails: formatData,
        similarProducts: formatSimilarData,
      })
    } else {
      this.setState({apiStatus: apiStatusObj.failure})
    }
  }

  onDecreaseButton = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  onIncreaseButton = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  renderSuccessView = () => {
    const {productItemDetails, count, similarProducts} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productItemDetails

    return (
      <div>
        <div className="product-details-container">
          <div className="image-container">
            <img src={imageUrl} alt="product" className="product-image" />
          </div>
          <div className="description-container">
            <h1 className="heading-product-detail">{title}</h1>
            <p className="price-text-product-detail">Rs {price}/-</p>
            <div className="rating-count-and-rating-container">
              <div className="rating-product-details">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image-product-detail"
                />
              </div>
              <p className="rating-count-product-detail">
                {totalReviews} Reviews
              </p>
            </div>
            <p className="description-product-detail">{description}</p>
            <p className="available-brand-text">Available: {availability}</p>
            <p className="available-brand-text">Brand: {brand}</p>
            <hr />
            <div className="count-container">
              <button
                type="button"
                data-testid="minus"
                onClick={this.onDecreaseButton}
                className="plus-minus-button"
              >
                <BsDashSquare />
              </button>

              <p className="count">{count}</p>
              <button
                type="button"
                data-testid="plus"
                onClick={this.onIncreaseButton}
                className="plus-minus-button"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              Add To Cart
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-details-list-container">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              eachProduct={eachProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image-product-detail"
      />
      <h1 className="product-not-found-text">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-shopping-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#3b82f6" />
    </div>
  )

  renderAllViewWithCondition = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusObj.success:
        return this.renderSuccessView()
      case apiStatusObj.failure:
        return this.renderFailureView()
      case apiStatusObj.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderAllViewWithCondition()}
      </div>
    )
  }
}

export default ProductItemDetails
