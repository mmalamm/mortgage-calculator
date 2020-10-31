import React, { useState } from "react";
import "./App.css";
import * as utils from "./utils.js";

function App() {
  const [housePrice, setHousePrice] = useState("300000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  // const [principal, setPrincipal] = useState(
  //   housePrice - (housePrice * downPaymentPercent) / 100
  // );
  const [interest, setInterest] = useState("3.5");
  const [loanLength, setLoanLength] = useState("30");
  const [info, setInfo] = useState(null);
  const handleHousePriceChange = (e) => setHousePrice(e.target.value);
  const handleDownPaymentPercentChange = (e) =>
    setDownPaymentPercent(e.target.value);
  // const handlePrincipalChange = (e) => setPrincipal(e.target.value);
  const handleInterestChange = (e) => setInterest(e.target.value);
  const handleLoanLengthChange = (e) => setLoanLength(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const downPaymentTotal = (housePrice * downPaymentPercent) / 100;
    const principal = housePrice - downPaymentTotal;
    const pmtInfo = utils.createPayments(principal, interest, loanLength);
    console.log(pmtInfo);
    setInfo({ ...pmtInfo, downPaymentTotal, principal });
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="App">
        <p>House Price</p>
        <input
          type="text"
          value={housePrice}
          onChange={handleHousePriceChange}
        ></input>
        <p>Downpayment Percentage</p>
        <input
          type="text"
          value={downPaymentPercent}
          onChange={handleDownPaymentPercentChange}
        ></input>
        <p>interest rate</p>
        <input
          type="text"
          value={interest}
          onChange={handleInterestChange}
        ></input>
        <p>loan length</p>
        <input
          type="text"
          value={loanLength}
          onChange={handleLoanLengthChange}
        ></input>
        <br></br>
        <button type="submit">submit</button>
      </form>
      {info && (
        <div>
          <div>
            for a house price of {housePrice} assuming you put{" "}
            {downPaymentPercent}% down, your downpayment would be{" "}
            {info.downPaymentTotal} and your total loan amount would be{" "}
            {info.principal}
          </div>
          <div>your monthly payment is {info.regular.paymentAmount}</div>
          <div>
            your total payment is {info.regular.totalAmountPaid} on a principal
            loan amount of {info.principal}, meaning you paid{" "}
            {info.regular.totalInterestPaid} in interest, or{" "}
            {info.regular.interestPerYear} per year on average. The house ended
            up costing you{" "}
            {+info.regular.totalAmountPaid + +info.downPaymentTotal}
          </div>
          <div>
            if you made payments biweekly instead, you would pay{" "}
            {info.biweekly.paymentAmount} per month, but your loan would expire{" "}
            {info.regular.loanLengthInYears - info.biweekly.loanLengthInYears}{" "}
            years sooner, so your total paid would be{" "}
            {info.biweekly.totalAmountPaid} saving you{" "}
            {utils.round(
              info.regular.totalInterestPaid - info.biweekly.totalInterestPaid
            )}{" "}
            in interest, so you end up paying on average about{" "}
            {info.biweekly.interestPerYear} per year in interest for{" "}
            {info.biweekly.loanLengthInYears} years, totaling{" "}
            {info.biweekly.totalInterestPaid} paid in interest. The house ended
            up costing you{" "}
            {+info.biweekly.totalAmountPaid + +info.downPaymentTotal}
          </div>
          <h4>regular payments</h4>
          <table>
            <thead>
              <tr>
                <th>month</th>
                <th>payment</th>
                <th>paid to interest</th>
                <th>paid to principal</th>
                <th>principal remaining</th>
              </tr>
            </thead>
            <tbody>
              {info.regular.payments.map((i) => {
                return (
                  <tr key={i.month}>
                    <td>{i.month}</td>
                    <td>{i.payment}</td>
                    <td>{i.paidToInterest}</td>
                    <td>{i.paidToPrincipal}</td>
                    <td>{i.principalRemainingAfterPayment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h4>Biweekly payments</h4>
          <table>
            <thead>
              <tr>
                <th>month</th>
                <th>payment</th>
                <th>paid to interest</th>
                <th>paid to principal</th>
                <th>principal remaining</th>
              </tr>
            </thead>
            <tbody>
              {info.biweekly.payments.map((i) => {
                return (
                  <tr key={i.month}>
                    <td>{i.month}</td>
                    <td>{i.payment}</td>
                    <td>{i.paidToInterest}</td>
                    <td>{i.paidToPrincipal}</td>
                    <td>{i.principalRemainingAfterPayment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default App;
