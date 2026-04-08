import React, { useState, useEffect } from "react";
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
  const [mode, setMode] = useState("normal");

  const [amount, setAmount] = useState(10000);
  const [monthly, setMonthly] = useState(1000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(7);
  const [target, setTarget] = useState(1000000);

  // 📥 טעינה מהלינק
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("amount")) {
      setAmount(+params.get("amount"));
      setMonthly(+params.get("monthly"));
      setYears(+params.get("years"));
      setRate(+params.get("rate"));
      setTarget(+params.get("target"));
    }
  }, []);

  // 📤 שיתוף
  const share = () => {
    const url = `${window.location.origin}?amount=${amount}&monthly=${monthly}&years=${years}&rate=${rate}&target=${target}`;
    navigator.clipboard.writeText(url);
    alert("Link copied! 🔗");
  };

  // 📊 חישוב רגיל
  let total = amount;
  let invested = amount;
  let data = [];

  for (let i = 1; i <= years * 12; i++) {
    total += monthly;
    total *= 1 + rate / 100 / 12;
    invested += monthly;

    if (i % 12 === 0) {
      data.push({ year: i / 12, value: Math.round(total) });
    }
  }

  const profit = total - invested;

  // 🎯 חישוב יעד
  let neededMonthly = 0;
  if (mode === "target") {
    let guess = 100;
    while (guess < 100000) {
      let temp = amount;
      for (let i = 1; i <= years * 12; i++) {
        temp += guess;
        temp *= 1 + rate / 100 / 12;
      }
      if (temp >= target) {
        neededMonthly = guess;
        break;
      }
      guess += 50;
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>💰 Smart Investment App</h1>

      <div style={styles.switch}>
        <button onClick={() => setMode("normal")} style={styles.btn}>Calculator</button>
        <button onClick={() => setMode("target")} style={styles.btn}>Target</button>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>

          {mode === "target" && (
            <Input label="Target Amount" value={target} setValue={setTarget} />
          )}

          <Input label="Initial" value={amount} setValue={setAmount} />
          <Input label="Monthly" value={monthly} setValue={setMonthly} />
          <Input label="Years" value={years} setValue={setYears} />
          <Input label="Return %" value={rate} setValue={setRate} />

          {mode === "normal" ? (
            <div style={styles.results}>
              <p>💼 Invested: ${invested.toLocaleString()}</p>
              <p>🚀 Profit: ${Math.round(profit).toLocaleString()}</p>
              <h2 style={styles.total}>${Math.round(total).toLocaleString()}</h2>
            </div>
          ) : (
            <div style={styles.results}>
              <h2>🎯 Needed Monthly:</h2>
              <h1 style={styles.total}>${neededMonthly}</h1>
            </div>
          )}

          <button onClick={share} style={styles.share}>
            📤 Share
          </button>

        </div>

        <div style={styles.chart}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="year" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, setValue }) {
  return (
    <div style={styles.inputBox}>
      <label>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(+e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(135deg,#020617,#0f172a)",
    minHeight: "100vh",
    color: "white",
    fontFamily: "Arial",
    padding: 20
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  grid: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap"
  },
  card: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 15,
    width: 320
  },
  chart: {
    flex: 1,
    minWidth: 300,
    background: "#1e293b",
    padding: 20,
    borderRadius: 15
  },
  inputBox: {
    marginBottom: 12
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "none",
    marginTop: 5
  },
  results: {
    marginTop: 15
  },
  total: {
    color: "#22c55e"
  },
  share: {
    marginTop: 15,
    padding: 10,
    width: "100%",
    borderRadius: 10,
    background: "#22c55e",
    border: "none",
    color: "black",
    cursor: "pointer"
  },
  switch: {
    textAlign: "center",
    marginBottom: 20
  },
  btn: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    border: "none",
    cursor: "pointer"
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
