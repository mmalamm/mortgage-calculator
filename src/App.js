import React, { useState } from "react";
import "./App.css";
import * as utils from "./utils.js";

function App() {
  const [principal, setPrincipal] = useState("300000");
  const [interest, setInterest] = useState("3.5");
  const [loanLength, setLoanLength] = useState("30");
  const [info, setInfo] = useState(null);
  const handlePrincipalChange = (e) => setPrincipal(e.target.value);
  const handleInterestChange = (e) => setInterest(e.target.value);
  const handleLoanLengthChange = (e) => setLoanLength(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const pmtInfo = utils.createPayments(principal, interest, loanLength);
    console.log(pmtInfo.biweekly);
    setInfo(pmtInfo);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="App">
        <p>principal</p>
        <input
          type="text"
          value={principal}
          onChange={handlePrincipalChange}
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
          <div>your monthly payment is {info.payment}</div>
          <div>
            your total payment is {info.totalAmountPaid}, meaning you paid{" "}
            {info.totalInterestPaid} in interest, or {info.interestPerYear} per year on average
          </div>
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
              {info.payments.map((i) => {
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
