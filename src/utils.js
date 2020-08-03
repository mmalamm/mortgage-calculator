export const hello = () => "hello";

// https://www.calculatorsoup.com/calculators/financial/mortgage-calculator.php

export const createPayments = (loanAmount, interestRate, loanLengthYears) => {
  // Payment = P x (r / n) x (1 + r / n)^n(t)] / (1 + r / n)^n(t) - 1
  return {
    regular: createRegular(loanAmount, interestRate, loanLengthYears),
    biweekly: createBiWeekly(loanAmount, interestRate, loanLengthYears),
  };
};

const getMonthlyPayment = (loanAmount, interestRate, loanLengthYears) => {
  return round(
    (loanAmount *
      (interestRate / 100 / 12) *
      (1 + interestRate / 100 / 12) ** (loanLengthYears * 12)) /
      ((1 + interestRate / 100 / 12) ** (loanLengthYears * 12) - 1)
  );
};

const createRegular = (loanAmount, interestRate, loanLengthYears) => {
  const monthlyPayment = getMonthlyPayment(
    loanAmount,
    interestRate,
    loanLengthYears
  );
  const totalAmountPaid = round(monthlyPayment * loanLengthYears * 12);
  const totalInterestPaid = round(totalAmountPaid - loanAmount);
  const interestPerYear = round(totalInterestPaid / loanLengthYears);
  return {
    paymentAmount: monthlyPayment,
    totalAmountPaid,
    totalInterestPaid,
    interestPerYear,
    loanLengthInYears: loanLengthYears,
    payments: makeArray(
      monthlyPayment,
      interestRate / 100 / 12,
      loanLengthYears * 12,
      loanAmount
    ),
  };
};

const createBiWeekly = (loanAmount, interestRate, loanLengthYears) => {
  const monthlyPayment = getMonthlyPayment(
    loanAmount,
    interestRate,
    loanLengthYears
  );
  const payments = makeBiWeekly(
    monthlyPayment,
    interestRate / 100 / 12,
    loanAmount
  );
  const totalAmountPaid = payments.reduce((acc, p) => acc + p.payment, 0);
  const totalInterestPaid = payments.reduce(
    (acc, p) => acc + p.paidToInterest,
    0
  );
  const loanLengthInYears = payments.slice(-1)[0].month / 12;
  const interestPerYear = totalInterestPaid / loanLengthInYears;

  const rounded = Object.entries({
    paymentAmount: monthlyPayment * 2,
    totalAmountPaid,
    totalInterestPaid,
    interestPerYear,
    loanLengthInYears,
  }).reduce((acc, [key, val]) => ({...acc, [key]: round(val)}), {});
  return {
    ...rounded,
    payments
  }
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

const makeBiWeekly = (monthlyPayment, monthlyInterestRate, loanAmount) => {
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
    const payment = Object.entries({
      month: i,
      payment: monthlyPayment,
      paidToInterest,
      paidToPrincipal,
      principalRemainingAfterPayment: loanAmount,
    }).reduce((acc, [key, val]) => ({ ...acc, [key]: round(val) }), {});
    payments.push(payment);
  }
  return payments;
};

export function round(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
