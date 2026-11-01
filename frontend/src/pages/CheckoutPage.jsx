
import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";

import "./checkout.css";

const money = (amount) => `$${Number(amount).toFixed(2)}`;

export default function CheckoutPage() {
  const {
    cartItems,
    subtotal,
    total,
    coupon,
    isCouponApplied,
  } = useCartStore();

  const { user } = useUserStore();

  const [status, setStatus] = useState("ready");

  const navigate = useNavigate();
  const submitting = useRef(false);
  const demoReference = useRef(`DEMO-${crypto.randomUUID()}`);

  const quantity = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  // Handle demo checkout
  const simulatePayment = async (event) => {
    event.preventDefault();

    if (submitting.current || cartItems.length === 0) return;

    submitting.current = true;
    setStatus("processing");

    try {
      await axios.post("/payments/demo-checkout", {
        products: cartItems.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
        })),
        couponCode: isCouponApplied ? coupon?.code : null,
        demoReference: demoReference.current,
      });

      setStatus("success");
    } catch (error) {
      console.error("Demo checkout failed:", error);

      setStatus("ready");
      submitting.current = false;

      navigate("/purchase-failed", {
        state: {
          error:
            error.response?.data?.message ||
            "Your demo checkout could not be completed.",
        },
      });
    }
  };

  // Successful checkout
  if (status === "success") {
    return <Navigate to="/purchase-success" />;
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <main className="demo-checkout checkout-result">
        <div className="result-card">
          <span className="demo-badge">DEMO MODE</span>

          <h1>Your cart is empty</h1>

          <p>Add some products to try the demo checkout.</p>

          <Link className="checkout-pay" to="/">
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="demo-checkout">
      <div className="checkout-layout">
        {/* Order summary */}
        <section
          className="checkout-summary"
          aria-label="Order summary"
        >
          <div className="checkout-topbar">
            <Link to="/cart" className="checkout-back">
              <ArrowLeft size={16} />
              Back
            </Link>

            <Link to="/cart" className="checkout-back">
              Cancel Checkout
            </Link>

            <span className="demo-badge">DEMO MODE</span>
          </div>

          <p className="checkout-eyebrow">Your order</p>

          <h1 className="checkout-amount">
            {money(total)}
          </h1>

          <p className="checkout-muted">
            {quantity} {quantity === 1 ? "item" : "items"} in your cart
          </p>

          {/* Products */}
          <div className="checkout-products">
            {cartItems.map((item) => (
              <article
                className="checkout-product"
                key={item._id}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                )}

                <div className="checkout-product-info">
                  <h2>{item.name}</h2>

                  <p className="checkout-muted">
                    Qty {item.quantity} · {money(item.price)} each
                  </p>
                </div>

                <strong>
                  {money(item.price * item.quantity)}
                </strong>
              </article>
            ))}
          </div>

          {/* Order totals */}
          <dl className="checkout-totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{money(subtotal)}</dd>
            </div>

            {subtotal > total && (
              <div>
                <dt>Discount</dt>
                <dd>−{money(subtotal - total)}</dd>
              </div>
            )}

            <div className="checkout-total">
              <dt>Total</dt>
              <dd>{money(total)}</dd>
            </div>
          </dl>
        </section>

        {/* Demo payment form */}
        <section
          className="checkout-form-panel"
          aria-label="Demo payment"
        >
          <form onSubmit={simulatePayment}>
            {/* Demo notice */}
            <div className="demo-notice">
              <LockKeyhole
                size={18}
                aria-hidden="true"
              />

              <div>
                <strong>This is a demo checkout.</strong>
                <br />
                No real payments. Use the preset test card below.
              </div>
            </div>

            <div className="checkout-divider">
              <span>Demo card payment</span>
            </div>

            <fieldset disabled={status === "processing"}>
              {/* Email */}
              <label className="checkout-field">
                Email

                <input
                  type="email"
                  name="email"
                  defaultValue={user?.email || "demo@example.com"}
                  required
                  autoComplete="email"
                />
              </label>

              {/* Demo card information */}
              <div className="checkout-field">
                <span id="test-card-label">
                  Card information
                </span>

                <div
                  className="demo-card-details"
                  aria-labelledby="test-card-label"
                >
                  <div className="demo-card-number">
                    <span>4242 4242 4242 4242</span>

                    <span className="card-brand">
                      <CreditCard
                        size={18}
                        aria-hidden="true"
                      />
                      TEST
                    </span>
                  </div>

                  <div className="demo-card-bottom">
                    <span>12 / 30</span>

                    <span>
                      123
                      <LockKeyhole
                        size={14}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>

                <small>
                  Preset demo details — no real card information needed.
                </small>
              </div>

              {/* Cardholder name */}
              <label className="checkout-field">
                Cardholder name

                <input
                  type="text"
                  name="name"
                  defaultValue={user?.name || "Demo Customer"}
                  required
                  maxLength={100}
                  autoComplete="name"
                />
              </label>

              {/* Country */}
              <label className="checkout-field">
                Country or region

                <select name="country" defaultValue="Namibia">
                  <option>Namibia</option>
                  <option>South Africa</option>
                  <option>Botswana</option>
                  <option>Zambia</option>
                  <option>Zimbabwe</option>
                  <option>Other</option>
                </select>
              </label>

              {/* Payment notice */}
              <div className="checkout-demo-detail">
                <Check
                  size={18}
                  aria-hidden="true"
                />

                <span>
                  Payment is simulated locally. No payment details
                  are submitted or saved.
                </span>
              </div>

              {/* Submit payment */}
              <button
                type="submit"
                className="checkout-pay"
                disabled={status === "processing"}
              >
                {status === "processing" ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="checkout-spinner"
                    />
                    Simulating payment…
                  </>
                ) : (
                  `Pay ${money(total)} · Demo`
                )}
              </button>
            </fieldset>

            {/* Checkout footer */}
            <p
              className="checkout-footer"
              role="status"
              aria-live="polite"
            >
              {status === "processing"
                ? "Processing your demo payment. Please wait."
                : "Demo checkout · No money will be charged"}
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
