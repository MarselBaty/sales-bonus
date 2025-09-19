/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
    // @TODO: Расчет выручки от операции
    const { discount, sale_price, quantity } = purchase;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    const { profit } = seller;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    // @TODO: Проверка входных данных

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
    const { calculateRevenue, calculateBonus } = options; // Сюда передадим функции для расчётов
}

/**
 * Группаировка массива по ключу
 * @param array - массив который группируем
 * @param keyFn - ключ по которому будет происходить группировка
 */
function groupBy(array, keyFn) {
    return array.reduce((acc, item) => {
        const key = keyFn(item);
        if (!acc[key]) acc[key] = []
        acc[key].push(item);
        return acc;
    }, {});
}

const recordsBySeller = groupBy(data.purchase_records, record => record.seller_id);
const recordsByCustomer = groupBy(data.purchase_records, record => record.customer_id);
const recordsByProduct = groupBy(data.purchase_records.flatMap(record => record.items), item => item.sku);

// console.log('###recordsBySeller###', recordsBySeller);
// console.log('###recordsByCustomer###', recordsByCustomer);
// console.log('###recordsByProduct###', recordsByProduct);

/**
 * Расчет среднего значенияe
 * @param values - числа, значения из которых будет складываться среднее значение
 * @returns {numbersг}
 */
function averageValue(values) {
    const sum = values.reduce((acc, values) => acc + values, 0);
    return sum / values.length || 0;
}

/**
* Простой расчёт прибыли
* @param item
* @param product
* @returns {number}
*/
function simpleProfit(item, product) {
     return item.sale_price * item.quantity * (1 - item.discount / 100) - product.purchase_price * item.quantity;
}

/**
* Накопительное вычисление прибыли, выручки и других метрик
* @param records
* @param calculateProfit
* @param products
* @returns｛*｝
*/
function baseMetrics(records, simpleProfit, products) {
// принимает начальное значение аккумулятора ( sellers: f}, customers: f}, products: f} } содержит статистику, сгруппированную по продавцам, покупателям и продуктам
    return records.reduce ((acc, record) => {
        const sellerId = record.seller_id;
        const customerId = record.customer_id;

        if (!acc.sellers[sellerId]) acc.sellers[sellerId] = { revenue: 0, profit: 0, items: [], customers: new Set() };
        if (!acc.customers[customerId]) acc.customers[customerId] = { revenue: 0, profit: 0, sellers: new Set() };
        // Для каждого товара в record.items, находит соответствующий продукт в массиве products и рассчитывает прибыль для товара
        record.items.forEach(item => {
            // Находит соответствующий продукт в массиве products
            const product = products.find(p => p.sku == item.sku);
            const profit = simpleProfit (item, product);
            // Обновление статистики продавца
            acc.sellers[sellerId].revenue += item.sale_price * item.quantity * (1 - item.discount / 100);
            acc.sellers[sellerId].profit += profit;
            acc.sellers[sellerId].items.push(item);
            acc.sellers[sellerId].customers.add(customerId);

            // Обновление статистики покупателя
            acc.customers[customerId].revenue += item.sale_price * item.quantity * (1 - item.discount / 100);
            acc.customers[customerId].profit += profit;
            acc.customers[customerId].sellers.add(sellerId);

            //Обновление статистики по продуктам
            if (!acc.products[item.sku]) acc.products[item.sku] = { quantity: 0, revenue: 0 };
            acc.products[item.sku].quantity += item.quantity;
            acc.products[item.sku].revenue += item.sale_price * item.quantity * (1 - item.discount / 100);
        });
    return acc;
    }, { sellers: {}, customers: {}, products: {} });
}

// console.log(baseMetrics(data.purchase_records, simpleProfit, data.products));

/**
 * Вычисление бонусов по специальным условиям
 * @param data
 * @param options
 * @param bonusFunctions
 * @returns {*}
 */
function calculateSpecialBonuses(data, options, bonusFunctions) {
    const { calculateProfit, accumulateMetrics } = options;
    //Группировка данных 
    const recordsBySeller = groupBy(data.purchase_records, records => record.sellerId);
    const recordsByCustomer = groupBy(data.purchase_records, record => record.customer_id);
    const recordsByProduct = groupBy(data.purchase_records.flatMap(record => record.items), item => item.sku);

    // Накопительная статистика
    const stats = accumulateMetrics(data.purchase_records, calculateProfit, data.products);

    // Вызов функций для расчета бонусов
    return bonusFunctions.map(func =>
        func({
            stats,
            recordsBySeller,
            recordsByCustomer,
            recordsByProduct,
            sellers: data.sellers,
            customers: data.customers,
            products: data.products,
            calculateProfit,

        })
    );
}

//Продавец привлекший лучшего покупателя
function bonusBestCustomer ({ stats }) {
    const bestCustomer = Object.entries(stats.customers).reduce((max, [id, data]) => data.revenue > (max?.revenue || 0) ? { id, ...data } : max, null);
    const sellerId = Array.from(bestCustomer.sellers).reduce((topSeller, sellerId) => {
        const revenue = stats.sellers[sellerId]?.revenue || 0;
        return revenue > (topSeller?.revenue || 0) ? { sellerId, revenue }: topSeller;
    }, null).sellerId;

    return {
        category: "Best Customer Seller",
        seller_id: sellerId,
        bonus: +(bestCustomer.revenue * 0.05).toFixed(2),
    };
}

// Продавец лучше всего удерживающий покупателя
function bonusCustomerRetention ({ stats }) {
    const bestRetention = Object.entries(stats.sellers).reduce((best, [sellerId, data]) => {
        const customerCounts = Array.from(dara.customers).map(customerId =>
            stats.customers[customerId]?.revenue || 0);    
        const maxCustomerRevenue = Math.max(...customerCounts);

        return maxCustomerRevenue > (best?.revenue || 0) ? { sellerId, revenue: maxCustomerRevenue } : best;
    }, null);

    return {
        category: "Best Customer Retention",
        seller_id: bestRetention.seller_id,
        bonus: 1000,
    };
}
