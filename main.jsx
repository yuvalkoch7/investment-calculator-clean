import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function App() {
  const [loan, setLoan] = useState(200000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [interestPaid, setInterestPaid] = useState(0);
  const [data, setData] = useState([]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0
    }).format(value);

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = years * 12;

    const m = loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = m * n;

    setMonthlyPayment(m);
    setTotalPayment(total);
    setInterestPaid(total - loan);

    let balance = loan;
    let temp = [];

    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = m - interest;
      balance -= principal;

      if (i % 12 === 0) {
        temp.push({
          year: i / 12,
          value: Math.round(balance)
        });
      }
    }

    setData(temp);
  };

  return (
    <div style={styles.page}>

      <h1 style={styles.title}>💰 האמת על ההלוואה שלך</h1>

      <div style={styles.card}>

        <SliderInput
          label="סכום הלוואה"
          value={loan}
          setValue={setLoan}
          min={50000}
          max={3000000}
          step={1000}
        />

        <SliderInput
          label="ריבית %"
          value={rate}
          setValue={setRate}
          min={1}
          max={12}
          step={0.1}
        />

        <SliderInput
          label="שנים"
          value={years}
          setValue={setYears}
          min={1}
          max={30}
        />

        <button style={styles.apply} onClick={calculate}>
          חשב עכשיו
        </button>

        {monthlyPayment > 0 && (
          <div style={styles.resultMain}>
            <h2>{formatCurrency(monthlyPayment)}</h2>
            <p>תשלום חודשי</p>
          </div>
        )}

      </div>

      {monthlyPayment > 0 && (
        <div style={styles.details}>
          <div>סה״כ: {formatCurrency(totalPayment)}</div>
          <div>ריבית: {formatCurrency(interestPaid)}</div>
        </div>
      )}

      <div style={styles.chart}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="year" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line dataKey="value" stroke="#22c55e" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

/* 🔥 קומפוננטה משודרגת */
function SliderInput({ label, value, setValue, min, max, step = 1 }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label>{label}</label>

      <input
        type="text"
        value={value.toLocaleString()}
        onChange={(e) => {
          const raw = e.target.value.replace(/,/g, "");
          if (!isNaN(raw)) setValue(Number(raw));
        }}
        style={styles.input}
      />

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(+e.target.value)}
        style={{ width: "100%" }}
      />
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(135deg,#020617,#0f172a)",
    minHeight: "100vh",
    color: "white",
    padding: 20,
    fontFamily: "Arial"
  },
  title: {
    textAlign: "center",
    fontSize: 32,
    marginBottom: 20
  },
  card: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 20,
    maxWidth: 500,
    margin: "auto",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "none",
    marginBottom: 10
  },
  apply: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(90deg,#3b82f6,#06b6d4)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },
  resultMain: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 26,
    color: "#22c55e"
  },
  details: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: 20
  },
  chart: {
    marginTop: 30,
    background: "#1e293b",
    padding: 20,
    borderRadius: 20
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
