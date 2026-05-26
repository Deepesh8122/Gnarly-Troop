"use client";

import styles from "@/app/NewsletterSignup.module.css";

export default function SectionNewsletterSignup() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.inner}>
        {/* LEFT CONTENT */}
        <div className={styles.left}>
          <h2>
            SIGN UP FOR <em>THE OPTIMIST</em>
            <br />
            NEWSLETTER
          </h2>
          <p>
            Subscribe to The Optimist to get weekly updates on the latest in
            global health, gender equality, education, and more.
          </p>
        </div>

        {/* RIGHT FORM */}
        <form
          className={styles.form}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className={styles.inputWrap}>
            <input
              type="email"
              placeholder="Email address"
              required
            />
            <button type="submit">Subscribe</button>
          </div>

          <small className={styles.disclaimer}>
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="#">Privacy Policy</a> and{" "}
            <a href="#">Terms of Service</a> apply. By submitting your email
            you agree to our <a href="#">Privacy & Cookies Notice</a>.
          </small>
        </form>
      </div>
    </section>
  );
}
