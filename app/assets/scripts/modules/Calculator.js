import { CountUp } from "countup.js";
import AutoNumeric from "autonumeric";

import firebase from "firebase";
import "firebase/firestore";

const axios = require("axios");

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
      minimumValue: 1,
      decimalPlaces: 2,
      allowDecimalPadding: false,
    });
    this.percentInput = new AutoNumeric.multiple(
      ".form--input-percent",
      "percentageUS2decPos",
      {
        suffixText: "%",
        unformatOnSubmit: true,
        decimalPlaces: 2,
        allowDecimalPadding: false,
      }
    );

    this.percentInputNoNegative = new AutoNumeric.multiple(
      ".form--input-percent-no-negative",
      "percentageUS2decPos",
      {
        suffixText: "%",
        unformatOnSubmit: true,
        minimumValue: 0,
        decimalPlaces: 2,
        allowDecimalPadding: false,
      }
    );

    this.form = document.getElementById("calculate-form");
    this.contactForm = document.getElementById("contact-form");
    this.nonNegativeInputs = document.querySelector(".no-negative");

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

    this.server = axios.create({
      baseUrl: "http://localhost:3000",
    });
    this.sessionData = {};
    window.sessionData = this.sessionData;
    this.resultsContainer = document.getElementById("results-anchor");
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
    return Math.abs(r);
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
    this.percentInputNoNegative[0].reformat();

    this.addInputsToSession();
    this.logSession();
    this.resultsContainer.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  addInputsToSession() {
    let inputs = {
      monthly_credit_card_charges: this.MonthlyCreditCard,
      monthly_debit_card_charges: this.MonthlyDebitCard,
      average_amount_per_charge: this.AverageAmountPerCharge,
      profit_margin: this.ProfitMargin,
      percent_customers_paying_with_cards: this.PercentagePayingWithCards,
    };

    this.sessionData.inputs = inputs;
  }

  logSession() {
    this.sessionData.calculations = this.formulae;

    this.server({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      data: this.sessionData,
      url: "http://+recoupe.0phiuchus.io/save",
      responseType: "json",
    });
  }

  submitForm() {
    event.preventDefault();

    let contactInfo = {
      first_name: document.getElementById("first-name").value,
      last_name: document.getElementById("last-name").value,
      company: document.getElementById("company").value,
      email: document.getElementById("email").value,
    };

    this.sessionData.user = contactInfo;

    this.server({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      data: this.sessionData,
      url: "http://recoupe.0phiuchus.io/save",
      responseType: "json",
    }).then(function (response) {
      console.log(response);
      document.querySelector(".alert-success").classList.add("alert-show");
      document.querySelector(".alert-success").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  events() {
    this.form.addEventListener("submit", this.calculate.bind(this));
    this.contactForm.addEventListener("submit", this.submitForm.bind(this));
  }
}

export default Calculator;
