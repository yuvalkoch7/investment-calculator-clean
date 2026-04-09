import { useState } from "react";

export default function App() {
  const [loan, setLoan] = useState(200000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const WEBHOOK_URL = "https://hook.eu1.make.com/u8vaclr33g6j7uyyvcg17khqhtdlb6fc";

  const formatNumber = (num) =>
    num.toLocaleString("he-IL");

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
    setTotalPayment(m * n);
  };

  const sendLead = async () => {
    if (!name || !phone) {
      alert("נא למלא שם וטלפון");
      return;
    }

    try {
      const res = await fetch(WEBHOOK_URL, {
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

      if (res.ok) {
        setSent(true);
        alert("הפרטים נשלחו בהצלחה 🎉");
      } else {
        alert("שגיאה בשליחה ❌");
      }
    } catch (err) {
      alert("שגיאה בשליחה ❌");
    }
  };

  const share = () => {
    const text = `תראה כמה יוצא לך החזר חודשי:\n${formatCurrency(
      monthlyPayment
    )}`;

    if (navigator.share) {
      navigator.share({
        title: "מחשבון הלוואה",
        text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("הקישור הועתק!");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>מחשבון הלוואה</h1>

      <div style={styles.card}>
        <label>סכום הלוואה</label>
        <input
          value={formatNumber(loan)}
          onChange={(e) =>
            setLoan(Number(e.target.value.replace(/,/g, "")))
          }
        />

        <label>ריבית (%)</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />

        <label>שנים</label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
        />

        <button style={styles.button} onClick={calculate}>
          החל
        </button>

        {monthlyPayment > 0 && (
          <>
            <h2>{formatCurrency(monthlyPayment)}</h2>
            <p>החזר חודשי</p>

            <button style={styles.share} onClick={share}>
              שתף
            </button>
          </>
        )}
      </div>

      <div style={styles.card}>
        <h3>רוצה הצעה טובה יותר?</h3>

        <input
          placeholder="שם"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="טלפון"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button style={styles.leadBtn} onClick={sendLead}>
          קבל הצעה משתלמת
        </button>

        {sent && <p>נחזור אליך בקרוב 😉</p>}
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
  title: {
    textAlign: "center",
  },
  card: {
    background: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    background: "#4CAF50",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
  },
  share: {
    background: "#2196F3",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
  },
  leadBtn: {
    background: "#ff9800",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
  },
};
