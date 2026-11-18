// shortcut: tipos declarados à mão; trocar pelos tipos gerados (@mf-types) quando os contratos crescerem.
declare module 'catalog/ProductList' {
  const ProductList: () => JSX.Element;
  export default ProductList;
}
declare module 'cart/CartWidget' {
  const CartWidget: () => JSX.Element;
  export default CartWidget;
}

