export const hello = () => "hello";

// https://www.calculatorsoup.com/calculators/financial/mortgage-calculator.php

export const createPayments = (loanAmount, interestRate, loanLengthYears) => {
  // Payment = P x (r / n) x (1 + r / n)^n(t)] / (1 + r / n)^n(t) - 1
  const loanTermInMonths = loanLengthYears * 12;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numerator =
    loanAmount *
    monthlyInterestRate *
    (1 + monthlyInterestRate) ** loanTermInMonths;
  const denominator = (1 + monthlyInterestRate) ** loanTermInMonths - 1;
  const monthlyPayment = round(numerator / denominator);
  const totalAmountPaid = round(monthlyPayment * loanTermInMonths);
  const totalInterestPaid = round(totalAmountPaid - loanAmount);
  const interestPerYear = round(totalInterestPaid / loanLengthYears);
  return {
    monthlyPayment,
    totalAmountPaid,
    totalInterestPaid,
    interestPerYear,
    payments: makeArray(
      monthlyPayment,
      monthlyInterestRate,
      loanTermInMonths,
      loanAmount
    ),
    biweekly: makeBiWeekly(
      monthlyPayment,
      monthlyInterestRate,
      loanAmount
    ),
  };
};

const makeArray = (
  monthlyPayment,
  monthlyInterestRate,
  loanTermInMonths,
  loanAmount
) => {
  const output = Array.from({ length: loanTermInMonths }).map((_, idx) => {
    const month = idx;
    const paidToPrincipal = monthlyPayment - loanAmount * monthlyInterestRate;
    const paidToInterest = monthlyPayment - paidToPrincipal;
    loanAmount -= paidToPrincipal;

    return {
      month,
      payment: monthlyPayment,
      paidToInterest,
      paidToPrincipal,
      principalRemainingAfterPayment: loanAmount,
    };
  });
  return output.map((o) => {
    return Object.entries(o).reduce((acc, el) => {
      const [key, val] = el;
      acc[key] = round(val);
      return acc;
    }, {});
  });
};

const makeBiWeekly = (
  monthlyPayment,
  monthlyInterestRate,
  loanAmount
) => {
  const payments = [];
  for (let i = 0; loanAmount > 0; i += 0.5) {
    const isRegularPayment = i % 1 === 0;
    const paidToPrincipal = isRegularPayment
      ? monthlyPayment - loanAmount * monthlyInterestRate
      : monthlyPayment;
    const paidToInterest = isRegularPayment
      ? monthlyPayment - paidToPrincipal
      : 0;
    loanAmount -= paidToPrincipal;
    const payment = {
      month: i,
      payment: monthlyPayment,
      paidToInterest,
      paidToPrincipal,
      principalRemainingAfterPayment: loanAmount,
    };
    payments.push(payment)
  }
  return payments;
};

function round(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
