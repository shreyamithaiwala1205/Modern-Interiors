// Keeps a Furniture product's visibility in sync with its stock.
// Mutates the given (unsaved) product doc; caller is responsible for save().
const applyStockVisibility = (product) => {

    if (
        product.stock <= 0 &&
        product.isVisible !== false
    ) {

        product.isVisible = false;
        product.autoHiddenDueToStock = true;

    } else if (
        product.stock > 0 &&
        product.autoHiddenDueToStock
    ) {

        product.isVisible = true;
        product.autoHiddenDueToStock = false;

    }

};

module.exports = { applyStockVisibility };
