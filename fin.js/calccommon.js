
function USTaxBrackets() {
    let brackets = [{
        "rate": .10,
        "min": 0,
        "max": 9875.00
    }, {
        "rate": .12,
        "min": 9875.00,
        "max": 40125.00
    }, {
        "rate": .22,
        "min": 40125.00,
        "max": 85525.00
    }, {
        "rate": .24,
        "min": 85525.00,
        "max": 163300.00
    }, {
        "rate": .32,
        "min": 163300.00,
        "max": 207350.00
    }, {
        "rate": .35,
        "min": 207350.00,
        "max": 518400.00,
    }, {
        "rate": .37,
        "min": 518400.00,
        "max": Infinity
    },
    ];
    let cumulative = 0;
    brackets.forEach((item, index, array) => {
        item.posttax = (item.max - item.min) * (1 - item.rate);
        cumulative += item.posttax;
        item.cumulativeposttax = cumulative;
    });
    return brackets;
}
function CalculateTax(income, deduction) {
    let brackets = USTaxBrackets();
    let untaxedincome = income - deduction;
    let tax = 0.0;
    brackets.forEach(function (item, index, array) {
        if (untaxedincome < 0) { return; }
        tax += Math.min(untaxedincome, item.max - item.min) * item.rate;
        untaxedincome -= (item.max - item.min);
    });
    return tax;
}
function formatMoney(number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
}
function OnFocusIn(element) {
    document.getElementById(element.id).style.backgroundColor = "#EEEEEE";
}
function OnFocusOut(element) {
    document.getElementById(element.id).style.backgroundColor = "#F5F5F5";
    if (DefaultValueIfEmpty(element)) { Render(); }
}
function Render() {
    let income = document.getElementById("income").value;
    let deduction = document.getElementById("deduction").value;
    let tax = CalculateTax(income, deduction);
    let taxedincome = income - tax;
    document.getElementById("TaxAmount").value = formatMoney(tax);
    document.getElementById("PostTaxAmount").value = formatMoney(taxedincome);
}
function DefaultValueIfEmpty(element) {
    if (element.value == "" || isNaN(element.value) || element.value == null) {
        document.getElementById(element.id).value = element.defaultValue;
        return true;
    }
    return false;
}
function CalculatePreTax(income, deduction){
    let brackets = USTaxBrackets();
    let remainingtaxedincome = parseFloat(income)-deduction;
    let taxbill = 0;
    brackets.forEach((item, index, array) =>{
        if(remainingtaxedincome <= 0) return;
        let incomeinbracket = Math.min(item.posttax, remainingtaxedincome);
        remainingtaxedincome -= incomeinbracket;
        taxbill += (incomeinbracket)/(1-item.rate) - incomeinbracket;
    });
    let result = {};
    result.pretax = parseFloat(income) + taxbill;
    result.taxamount = taxbill;
    result.posttax = parseFloat(income);
    result.deduction = parseFloat(deduction);
    return result;
}