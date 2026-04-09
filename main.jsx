import React, { useState } from "react";

export default function App() {
  const [loan, setLoan] = useState(200000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);

  const [monthly, setMonthly] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const WEBHOOK_URL = "https://hook.eu1.make.com/u8vaclr33g6j7uyyvcg17khqhtdlb6fc";

  const formatCurrency = (num) =>
    new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    }).format(num);

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = years * 12;

    if (r === 0) {
      setMonthly(loan / n);
      return;
    }

    const m =
      (loan * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    setMonthly(m);
  };

  const sendLead = async () => {
    if (!name || !phone) {
      alert("נא למלא שם וטלפון");
      return;
    }

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          loan,
          rate,
          years,
          monthly,
        }),
      });

      setSent(true);
    } catch (err) {
      alert("שגיאה בשליחה");
    }
  };

  // 📤 שליחה ידנית ליועץ (אתה שולט!)
  const sendToAdvisor = () => {
    const text = `🔥 ליד חדש
שם: ${name}
טלפון: ${phone}
סכום: ${loan}
החזר: ${formatCurrency(monthly)}`;

    window.open(
      `https://wa.me/972XXXXXXXXX?text=${encodeURIComponent(text)}`
    );
  };

  return (
    <div style={styles.page}>
      <h1>💰 האמת על ההלוואה שלך</h1>

      <div style={styles.card}>
        <label>סכום הלוואה</label>
        <input
          value={loan.toLocaleString()}
          onChange={(e) =>
            setLoan(Number(e.target.value.replace(/,/g, "")))
          }
        />

        <label>ריבית %</label>
        <input
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />

        <label>שנים</label>
        <input
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
        />

        <button onClick={calculate} style={styles.button}>
          החל
        </button>

        {monthly > 0 && (
          <h2 style={{ marginTop: 20 }}>
           
