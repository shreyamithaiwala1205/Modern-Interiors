import { useState } from "react";
import toast from "react-hot-toast";

export default function DeliveryChecker() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState(null);

  const check = async () => {
    if (!/^\d{6}$/.test(pincode)) return toast.error("Enter a valid 6-digit PIN code");
    try {
      const response = await fetch(`/api/delivery/check/${pincode}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delivery check failed");
      setResult(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="delivery-checker">
      <h3>Delivery Options</h3>
      <div>
        <input maxLength="6" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter PIN code" />
        <button onClick={check}>Check</button>
      </div>
      {result?.available && (
        <p>✓ Delivery available to {result.city}, {result.state}. Approx. {result.deliveryDays} days.
          Delivery charge: ₹{result.deliveryCharge}.</p>
      )}
      {result && !result.available && <p>{result.message}</p>}
    </section>
  );
}
