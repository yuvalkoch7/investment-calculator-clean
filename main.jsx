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
  const [lang, setLang] = useState("en");
  const [mode, setMode] = useState("normal");

  const [amount, setAmount] = useState(10000);
  const [monthly, setMonthly] = useState(1000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(7);
  const [target, setTarget] = useState(1000000);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [profit, setProfit] = useState(0);
  const [invested, setInvested] = useState(0);
  const [neededMonthly, setNeededMonthly] = useState(0);

  const t = {
    en: {
      title: "Investment App",
      initial: "Initial",
      monthly: "Monthly",
      years: "Years",
      rate: "Return %",
      target: "Target",
      apply: "Apply",
      share: "Share",
      invested: "Invested",
      profit: "Profit",
      needed: "Needed Monthly"
    },
    he: {
      title: "אפליקציית השקעות",
      initial: "סכום התחלתי",
      monthly: "הפקדה חודשית",
      years: "שנים",
      rate: "ריבית %",
      target: "יעד",
      apply: "החל",
      share: "שתף",
      invested: "השקעה",
      profit: "רווח",
      needed: "נדרש חודשי"
    }
  };

  const txt = t[lang];

  const calculate = () => {
    let tempTotal = amount;
    let tempInvested = amount;
    let tempData = [];

    for (let i = 1; i <= years * 12; i++) {
      tempTotal += monthly;
      tempTotal *= 1 + rate / 100 / 12;
      tempInvested += monthly;

      if (i % 12 === 0) {
        tempData.push({ year: i / 12, value: Math.round(tempTotal) });
      }
    }

    setData(tempData);
    setTotal(tempTotal);
    setInvested(tempInvested);
    setProfit(tempTotal - tempInvested);

    // יעד
    if (mode === "target") {
      let guess = 100;
      while (guess < 100000) {
        let temp = amount;
        for (let i = 1; i <= years * 12; i++) {
          temp += guess;
          temp *= 1 + rate / 100 / 12;
        }
        if (temp >= target) {
          setNeededMonthly(guess);
          break;
        }
        guess += 50;
      }
    }
  };

  // שיתוף
  const share = () => {
    const url = `${window.location.origin}?amount=${amount}&monthly=${monthly}&years=${years}&rate=${rate}&target=${target}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <div style={{ ...styles.page, direction: lang === "he" ? "rtl" : "ltr" }}>
      
      <div style={styles.topBar}>
        <button onClick={() => setLang("en")}>EN</button>
        <button onClick={() => setLang("he")}>עברית</button>
      </div>

      <h1 style={styles.title}>💰 {txt.title}</h1>

      <div style={styles.switch}>
        <button onClick={() => setMode("normal")}>Calculator</button>
        <button onClick={() => setMode("target")}>Target</button>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>

          {mode === "target" && (
            <Input label={txt.target} value={target} setValue={setTarget} />
          )}

          <Input label={txt.initial} value={amount} setValue={setAmount} />
          <Input label={txt.monthly} value={monthly} setValue={setMonthly} />
          <Input label={txt.years} value={years} setValue={setYears} />
          <Input label={txt.rate} value={rate} setValue={setRate} />

          <button onClick={calculate} style={styles.apply}>
            {txt.apply}
          </button>

          {mode === "normal" ? (
            <div style={styles.results}>
              <p>{txt.invested}: ${Math.round(invested)}</p>
              <p>{txt.profit}: ${Math.round(profit)}</p>
              <h2>${Math.round(total)}</h2>
            </div>
          ) : (
            <div style={styles.results}>
              <h2>{txt.needed}: ${neededMonthly}</h2>
            </div>
          )}

          <button onClick={share} style={styles.share}>
            {txt.share}
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
    <div style={{ marginBottom: 10 }}>
      <label>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(+e.target.value)}
        style={{ width: "100%", padding: 8, marginTop: 5 }}
      />
    </div>
  );
}

const styles = {
  page: {
    background: "#020617",
    minHeight: "100vh",
    color: "white",
    padding: 20
  },
  title: { textAlign: "center" },
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10
  },
  grid: { display: "flex", gap: 20, flexWrap: "wrap" },
  card: { background: "#1e293b", padding: 20, borderRadius: 15, width: 320 },
  chart: { flex: 1, minWidth: 300, background: "#1e293b", padding: 20, borderRadius: 15 },
  results: { marginTop: 10 },
  apply: {
    marginTop: 10,
    padding: 10,
    width: "100%",
    background: "#3b82f6",
    border: "none",
    borderRadius: 10,
    color: "white"
  },
  share: {
    marginTop: 10,
    padding: 10,
    width: "100%",
    background: "#22c55e",
    border: "none",
    borderRadius: 10
  },
  switch: { textAlign: "center", margin: 10 }
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
