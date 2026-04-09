import { useState } from "react";

export default function App() {
  const [loan, setLoan] = useState(200000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);

  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const WEBHOOK_URL = "https://hook.eu1.make.com/u8vaclr33g6j7uyyvcg17khqhtdlb6fc";

  const formatCurrency = (num) =>
    num.toLocaleString("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    });

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = years * 12;

    const m =
      (loan * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    setMonthlyPayment(m);
  };

  // 🎯 קובעים לאיזה קונה לשלוח
  const getBuyerPhone = () => {
    if (loan < 300000) return "0500000000"; // קונה 1
    if (loan < 1000000) return "0520000000"; // קונה 2
    return "0540000000"; // קונה גדול 💰
  };

  const sendLead = async () => {
    if (!name || !phone) {
      alert("נא למלא שם וטלפון");
      return;
    }

    const buyerPhone = getBuyerPhone();

    const leadText = `🔥 ליד חדש!
שם: ${name}
טלפון: ${phone}
סכום: ${loan}
החזר: ${formatCurrency(monthlyPayment)}`;

    try {
      // שליחה ל-Make (שמירה + אוטומציות)
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
          monthlyPayment,
        }),
      });

      setSent(true);

      // 💰 שליחה ישירה לקונה (וואטסאפ)
      window.open(
        `https://wa.me/972${buyerPhone.replace(
          /^0/,
          ""
        )}?text=${encodeURIComponent(leadText)}`
      );

    } catch (err) {
      alert("שגיאה בשליחה ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h1>מחשבון הלוואה 💰</h1>

      <div style={styles.card}>
        <label>סכום הלוואה</label>
        <input
          value={loan.toLocaleString()}
          onChange={(e) =>
            setLoan(Number(e.target.value.replace(/,/g, "")))
          }
        />

        <label>ריבית (%)</label>
        <input
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />

        <label>שנים</label>
        <input
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
        />

        <button style={styles.button} onClick={calculate}>
          החל
        </button>

        {monthlyPayment > 0 && (
          <h2>{formatCurrency(monthlyPayment)}</h2>
        )}
      </div>

      <div style={styles.card}>
        <h3>קבל הצעה טובה יותר 🔥</h3>

        <input
          placeholder="שם"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="טלפון"
          onChange={(e) => setPhone(e.target.value)}
        />

        <button style={styles.leadBtn} onClick={sendLead}>
          קבל הצעה עכשיו
        </button>

        {sent && <p>נשלח! חוזרים אליך 🚀</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial",
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    background: "#4CAF50",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
  },
  leadBtn: {
    background: "#ff5722",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
  },
};
