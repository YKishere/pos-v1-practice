let myFunction = require('../main/datbase')
let loadAllItem = myFunction.loadAllItems();
let loadPromotion = myFunction.loadPromotions();

module.exports = function printInventory(inputs){
//输出商品详细信息（条目、名称、价格、数量（同时将数量复制一份作为额外属性））
let countItems = (loadAllItem, inputs) => {
    let allItems = [];
    let trueCount = 'trueCount';
    for (let i in inputs) {
        let splittedInputs = inputs[i].split('-');
        let barcode = splittedInputs[0];
        let count = parseFloat(splittedInputs[1] || 1);
        let sameItems = allItems.find(sameItems => sameItems.item.barcode === barcode);

        if (sameItems) {
            sameItems.count += count;
            sameItems.trueCount = sameItems.count;
        } else {
            let item = loadAllItem.find(item => item.barcode === barcode);
            allItems.push({ item: item, count: count, trueCount: count });
        }
    }
    return allItems;
};
let allItem = countItems(loadAllItem, inputs)

//获取优惠商品的名称、价格、数量
let promotion = [];
for (let i in loadPromotion[0].barcodes) {
    for (let j in allItem) {
        if (loadPromotion[0].barcodes[i] === allItem[j].item.barcode) {
            allItem[j].count = allItem[j].count - 1;
            promotion.push(
                {
                    name: allItem[j].item.name,
                    price: allItem[j].item.price,
                    unit: allItem[j].item.unit,
                    count: 1
                }
            )
        }
    }
}

//输出商品明细
let items = (allItem) => {
    let total = 0;
    let itemsList = '';
    for (let i in allItem) {
        if (i < allItem.length - 1) {
            itemsList += '名称：' + allItem[i].item.name + '，数量：' + allItem[i].trueCount +
                allItem[i].item.unit + '，单价：' + allItem[i].item.price.toFixed(2) + '(元)，小计：' +
                (allItem[i].count * allItem[i].item.price).toFixed(2) + '(元)\n'
        } else {
            itemsList += '名称：' + allItem[i].item.name + '，数量：' + allItem[i].trueCount +
                allItem[i].item.unit + '，单价：' + allItem[i].item.price.toFixed(2) + '(元)，小计：' +
                (allItem[i].count * allItem[i].item.price).toFixed(2) + '(元)'
        }
        total += allItem[i].count * allItem[i].item.price;
    }
    return { itemsList, total }
}
let itemsList = items(allItem).itemsList;
let total = items(allItem).total;

//输出节省商品明细
let promotions = (promotion) => {
    let promotionList = '';
    let save = 0;
    for (let i in promotion) {
        if (i < promotion.length - 1) {
            promotionList += '名称：' + promotion[i].name + '，数量：' +
                promotion[i].count + promotion[i].unit + '\n'
        } else {
            promotionList += '名称：' + promotion[i].name + '，数量：' +
                promotion[i].count + promotion[i].unit
        }
        save += promotion[i].count * promotion[i].price
    }
    return { promotionList, save }
}
let save = promotions(promotion).save;
let promotionList = promotions(promotion).promotionList;

//输出结果
    let list = `***<没钱赚商店>购物清单***
${itemsList}
----------------------
挥泪赠送商品：
${promotionList}
----------------------
总计：${total.toFixed(2)}(元)
节省：${save.toFixed(2)}(元)
**********************`
console.log(list)
}
