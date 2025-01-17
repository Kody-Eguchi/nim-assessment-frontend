import React, { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./styles/OrderModal.module.css";

function OrderModal({ order, setOrderModal }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  const navigate = useNavigate();

  const validatePhoneNumber = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // eslint-disable-next-line max-len
    const formattedPhoneNumber = `(${cleanNumber.slice(
      0,
      3
    )}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6, 10)}`;

    return formattedPhoneNumber;
  };

  const validateFields = () => {
    const errors = [];

    if (!name.trim()) {
      errors.push("Name is required");
    }

    if (!phone.trim()) {
      errors.push("Phone number is required");
    } else {
      const validatedPhoneNumber = validatePhoneNumber(phone);
      setPhone(validatedPhoneNumber);
    }

    if (!address.trim()) {
      errors.push("Address is required");
    }

    setErrorMessages(errors);
    return errors.length === 0;
  };

  const placeOrder = async () => {
    if (validateFields()) {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          phone,
          address,
          items: order
        })
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/order-confirmation/${data.id}`);
      } else {
        setErrorMessages(["An error occurred while placing the order"]);
      }
    }
  };

  return (
    <>
      <div
        label="Close"
        className={styles.orderModal}
        onKeyPress={(e) => {
          if (e.key === "Escape") {
            setOrderModal(false);
          }
        }}
        onClick={() => setOrderModal(false)}
        role="menuitem"
        tabIndex={0}
      />
      <div className={styles.orderModalContent}>
        <h2>Place Order</h2>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              Name
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setName(e.target.value);
                }}
                type="text"
                id="name"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">
              Phone
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setPhone(e.target.value);
                }}
                type="phone"
                id="phone"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">
              Address
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setAddress(e.target.value);
                }}
                type="phone"
                id="address"
              />
            </label>
          </div>
        </form>

        {/* ERROR MESSAGE */}
        {errorMessages.length > 0 && (
          <div className={styles.errorMessages}>
            {errorMessages.map((message) => (
              <p key={message} className={styles.errorMessage}>
                {message}
              </p>
            ))}
          </div>
        )}

        <div className={styles.orderModalButtons}>
          <button
            className={styles.orderModalClose}
            onClick={() => setOrderModal(false)}
          >
            Close
          </button>
          <button
            onClick={() => {
              placeOrder();
            }}
            className={styles.orderModalPlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderModal;
