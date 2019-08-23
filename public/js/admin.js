const deleteProduct = (btn) =>{
    const productId = btn.parentNode.querySelector('[name=productId]').value;
    const _csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    console.log('clicked Delete Button',productId,' Token value is::',_csrf);
}