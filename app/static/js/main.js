// 主JavaScript文件
document.addEventListener('DOMContentLoaded', function() {
    console.log('东南大学校园二手交易平台已加载');
    
    // 添加到购物车功能
    const addToCartButtons = document.querySelectorAll('#add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('商品已添加到购物车');
        });
    });
    
    // 结算功能
    const checkoutButton = document.getElementById('checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            alert('正在跳转到结算页面');
        });
    }
});