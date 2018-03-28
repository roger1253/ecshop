//时间转换
function formatTime(stamp) {
    var date = new Date(stamp*1000)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    // var hour = date.getHours()
    // var minute = date.getMinutes()
    // var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('.');
    //+ ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function indexOf(arr,el) {
    for (var i = 0, n = arr.length; i < n; i++) {
        if (arr[i].id === el.id) {
            return i;
        }
    }
    return -1;
}

//购物车选择时计算总价
function total(arr){
    var amount = 0;
    var price = 0;
    arr.map(function(item,index){
        amount += item.amount;
        price += item.amount*item.price;
    })
    return{totalAmount: amount,totalPrice: price};
}

module.exports = {
    formatTime: formatTime,
    indexOf: indexOf,
    total: total
}
