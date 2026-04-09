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
  const [lang, setLang] = useState("he");

  const [loan, setLoan] = useState(200000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [interestPaid, setInterestPaid] = useState(0);
  const [data, setData] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  const t = {
    he: {
      title: "מחשבון הלוואה חכם",
      loan: "סכום הלוואה",
      rate: "ריבית %",
      years: "שנים",
      apply: "החל",
      monthly: "תשלום חודשי",
      total: "סה״כ תשלום",
      interest: "ריבית כוללת",
      share: "שתף",
      lead: "רוצה הצעה טובה יותר?",
      send: "שלח"
    },
    en: {
      title: "Smart Loan Calculator",
      loan: "Loan Amount",
      rate: "Interest %",
      years: "Years",
      apply: "Apply",
      monthly: "Monthly Payment",
      total: "Total Payment",
      interest: "Total Interest",
      share: "Share",
      lead: "Get better loan offer",
      send: "Send"
    }
  };

  const txt = t[lang];

  const formatCurrency = (value) =>
    new Intl.NumberFormat(
      lang === "he" ? "he-IL" : "en-US",
      {
        style: "currency",
        currency: lang === "he" ? "ILS" : "USD",
        maximumFractionDigits: 0
      }
    ).format(value);

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = years * 12;

    const m =
      loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

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

  const share = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({ url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  const saveLead = () => {
    if (!name || !phone) return alert("מלא פרטים");

    const leads = JSON.parse(localStorage.getItem("leads") || "[]");

    leads.push({ name, phone });

    localStorage.setItem("leads", JSON.stringify(leads));
    setSaved(true);
  };

  return (
    <div style={{ ...styles.page, direction: lang === "he" ? "rtl" : "ltr" }}>
      
      <div style={styles.top}>
        <button onClick={() => setLang("he")}>עברית</button>
        <button onClick={() => setLang("en")}>EN</button>
      </div>

      <h1 style={styles.title}>{txt.title}</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          
          <Input label={txt.loan} value={loan} setValue={setLoan} />
          <Input label={txt.rate} value={rate} setValue={setRate} />
          <Input label={txt.years} value={years} setValue={setYears} />

          <button style={styles.apply} onClick={calculate}>
            {txt.apply}
          </button>

          {monthlyPayment > 0 && (
            <div style={styles.results}>
              <p>{txt.monthly}: {formatCurrency(monthlyPayment)}</p>
              <p>{txt.total}: {formatCurrency(totalPayment)}</p>
              <p>{txt.interest}: {formatCurrency(interestPaid)}</p>
            </div>
          )}

          <button style={styles.share} onClick={share}>
            {txt.share}
          </button>

          {monthlyPayment > 0 && (
            <div style={styles.lead}>
              <h3>{txt.lead}</h3>

              {!saved ? (
                <>
                  <input placeholder="שם" onChange={(e) => setName(e.target.value)} />
                  <input placeholder="טלפון" onChange={(e) => setPhone(e.target.value)} />
                  <button onClick={saveLead}>{txt.send}</button>
                </>
              ) : (
                <p>✅ נשלח!</p>
              )}
            </div>
          )}

        </div>

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
        style={{ width: "100%", padding: 8 }}
      />
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(135deg,#020617,#0f172a)",
    minHeight: "100vh",
    color: "white",
    padding: 20
  },
  title: { textAlign: "center" },
  top: { display: "flex", justifyContent: "flex-end", gap: 10 },
  grid: { display: "flex", gap: 20, flexWrap: "wrap" },
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
  results: { marginTop: 10 },
  lead: {
    marginTop: 15,
    background: "#0f172a",
    padding: 10,
    borderRadius: 10
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
