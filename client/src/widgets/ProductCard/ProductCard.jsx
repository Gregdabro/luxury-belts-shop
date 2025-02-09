import PropTypes from 'prop-types';
import styles from './ProductCard.module.css';

export const ProductCard = ({ product }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{product.name}</h3>
      <p className={styles.price}>${product.price}</p>
      <p className={styles.description}>{product.description}</p>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired
};