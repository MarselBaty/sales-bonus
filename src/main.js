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

console.log('###recordsBySeller###', recordsBySeller);
console.log('###recordsByCustomer###', recordsByCustomer);
console.log('###recordsByProduct###', recordsByProduct);

/**
 * @param values - числа, значения из которых будет складываться среднее значение
 * @returns {numbersг}
 */
function averageValue(values) {
    const sum = values.reduce((acc, values) => acc + values, 0);
    return sum / values.length || 0;
}