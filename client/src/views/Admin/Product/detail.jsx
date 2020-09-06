import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as productActions from './actions';

function ProductDetail(props) {
  const { product, actions } = props;
  const { id } = useParams();

  useEffect(() => {
    actions.getProduct(id);
  }, [id])

  return (
    <div>
      Sản phẩm: 
      {
        product && product.id ?
          <div>
            {product.id} {product.title}
          </div>
          : null
      }
    </div>
  )
}

const mapStateToProps = state => ({
  products: state.products.get('products'),
  product: state.products.get('product'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(productActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);