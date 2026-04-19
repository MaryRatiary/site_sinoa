import React from 'react';
import { Link } from 'react-router-dom';
import './ProductGrid.css';

const ProductGrid = ({ products, category }) => {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/shop/${category}/${product.id}`}
          className="product-card"
        >
          <div className="product-image-container">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <img
              src={product.hover_image}
              alt={product.name}
              className="product-image-hover"
            />
            {product.original_price && (
              <div className="badge-sale">SOLDE</div>
            )}
          </div>

          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>

            <div className="product-price">
              <span className="price">
                {product.price?.toFixed(2).replace('.', ',')}€
              </span>
              {product.original_price && (
                <span className="original-price">
                  {product.original_price?.toFixed(2).replace('.', ',')}€
                </span>
              )}
            </div>

            {product.isEstimated && (
              <p className="estimated-price">À partir de ce prix</p>
            )}

            <button className="btn-view-detail">
              Voir les détails
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
