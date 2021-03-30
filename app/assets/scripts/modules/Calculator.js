import { CountUp } from "countup.js";
import AutoNumeric from "autonumeric";

class Calculator {
  constructor() {
    this.MonthlyCreditCard = null;
    this.MonthlyDebitCard = null;
    this.AverageAmountPerCharge = null;
    this.ProfitMargin = null;
    this.PercentagePayingWithCards = null;

    this.dollarInput = null;
    this.percentInput = null;

    this.MonthlySavings = document.querySelector(".results--monthly-savings");
    this.AnnualSavings = document.querySelector(".results--annual-savings");
    this.IncreasedProfitMargin = document.querySelector(
      ".results--increased-profit-margin"
    );

    this.formulae = {
      current_expense: null,
      recoupe_expense: null,
      current_card_monthly_profit: null,
      recoupe_card_monthly_profit: null,
      total_monthly_sales: null,
      total_current_monthly_profit_margin: null,
      total_recoupe_monthly_profit_margin: null,
      monthly_savings: null,
      annual_savings: null,
      increased_profit_margin_on_card_sales: null,
    };

    window.results = this.formulae;

    this.init();
    this.dollarInput = new AutoNumeric.multiple(".form--input-dollars", {
      currencySymbol: "$",
      unformatOnSubmit: true,
    });
    this.percentInput = new AutoNumeric.multiple(
      ".form--input-percent",
      "percentageUS2decPos",
      {
        suffixText: "%",
        unformatOnSubmit: true,
      }
    );

    this.form = document.getElementById("calculate-form");

    this.events();

    this.MonthlySavingsCounter = new CountUp(this.MonthlySavings, 0);
    this.AnnualSavingsCounter = new CountUp(this.AnnualSavings, 0);
    this.IncreasedProfitMarginCounter = new CountUp(
      this.IncreasedProfitMargin,
      0,
      {
        decimal: ".",
        decimalPlaces: 2,
      }
    );

    window.dollars = this.dollarInput;
    window.percent = this.percentInput;
  }

  init() {
    console.log("Calculator");
  }

  calcCurrentExpense() {
    var r =
      (parseFloat(this.MonthlyCreditCard) + parseFloat(this.MonthlyDebitCard)) *
      0.0275;
    return r;
  }

  calcRecoupeExpense() {
    var r =
      parseFloat(this.MonthlyDebitCard) * 0.01 +
      (parseFloat(this.MonthlyDebitCard) /
        parseFloat(this.AverageAmountPerCharge)) *
        0.25;
    return r;
  }

  calcCurrentCardMonthlyProfit() {
    var r =
      (parseFloat(this.MonthlyCreditCard) + parseFloat(this.MonthlyDebitCard)) *
      0.15;
    return r;
  }

  calcRecoupeCardMonthlyProfit() {
    var r =
      parseFloat(this.formulae.current_card_monthly_profit) +
      parseFloat(this.formulae.monthly_savings);
    return r;
  }

  calcTotalMonthlySales() {
    var r =
      (parseFloat(this.MonthlyCreditCard) + parseFloat(this.MonthlyDebitCard)) /
      (parseFloat(this.PercentagePayingWithCards) / 100);
    return r;
  }

  calcTotalCurrentMonthlyProfitMargin() {
    var r =
      parseFloat(this.formulae.total_monthly_sales) *
      (parseFloat(this.ProfitMargin) / 100);
    return r;
  }

  calcTotalRecoupeMonthlyProfitMargin() {
    var r =
      parseFloat(this.formulae.total_current_monthly_profit_margin) +
      parseFloat(this.formulae.monthly_savings);
    return r;
  }

  calcMonthlySavings() {
    var r =
      parseFloat(this.formulae.current_expense) -
      parseFloat(this.formulae.recoupe_expense);
    return r;
  }

  calcAnnualSavings() {
    var r = parseFloat(this.formulae.monthly_savings) * 12;
    return r;
  }

  calcIncreasedProfitMarginOnCardSales() {
    var r =
      (parseFloat(this.formulae.total_recoupe_monthly_profit_margin) /
        parseFloat(this.formulae.total_current_monthly_profit_margin) -
        1) *
      100;
    console.log(r);
    return r;
  }

  calculate() {
    event.preventDefault();
    console.log("Calculate");

    this.MonthlyCreditCard = document.getElementsByName(
      "MonthlyCreditCard"
    )[0].value;
    this.MonthlyDebitCard = document.getElementsByName(
      "MonthlyDebitCard"
    )[0].value;
    this.AverageAmountPerCharge = document.getElementsByName(
      "AverageAmountPerCharge"
    )[0].value;
    this.ProfitMargin = document.getElementsByName("ProfitMargin")[0].value;
    this.PercentagePayingWithCards = document.getElementsByName(
      "PercentagePayingWithCards"
    )[0].value;

    this.formulae.current_expense = this.calcCurrentExpense();
    this.formulae.recoupe_expense = this.calcRecoupeExpense();
    this.formulae.current_card_monthly_profit = this.calcCurrentCardMonthlyProfit();

    this.formulae.monthly_savings = this.calcMonthlySavings();

    this.formulae.recoupe_card_monthly_profit = this.calcRecoupeCardMonthlyProfit();
    this.formulae.total_monthly_sales = this.calcTotalMonthlySales();
    this.formulae.total_current_monthly_profit_margin = this.calcTotalCurrentMonthlyProfitMargin();
    this.formulae.total_recoupe_monthly_profit_margin = this.calcTotalRecoupeMonthlyProfitMargin();

    this.formulae.annual_savings = this.calcAnnualSavings();
    this.formulae.increased_profit_margin_on_card_sales = this.calcIncreasedProfitMarginOnCardSales();

    this.MonthlySavingsCounter.update(this.formulae.monthly_savings);
    this.AnnualSavingsCounter.update(this.formulae.annual_savings);
    this.IncreasedProfitMarginCounter.update(
      this.formulae.increased_profit_margin_on_card_sales
    );

    this.dollarInput[0].reformat();
    this.dollarInput[1].reformat();
    this.dollarInput[2].reformat();
    this.percentInput[0].reformat();
    this.percentInput[1].reformat();
  }

  events() {
    this.form.addEventListener("submit", this.calculate.bind(this));
  }
}

export default Calculator;
