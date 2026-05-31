"use client";

import { useEffect, useState } from "react";
import styles from "@/app/NewsletterSignup.module.css";
import {
  passwordManagerIgnoreAttrs,
  passwordManagerIgnoreFormAttrs,
} from "@/lib/admin/form-attrs";

function NewsletterFormPlaceholder() {
  return (
    <div className={styles.form} aria-hidden="true">
      <div className={styles.inputWrap}>
        <input type="email" placeholder="Email address" disabled tabIndex={-1} />
        <button type="button" disabled tabIndex={-1}>
          Subscribe
        </button>
      </div>
      <small className={styles.disclaimer}>
        This site is protected by reCAPTCHA and the Google{" "}
        <span>Privacy Policy</span> and <span>Terms of Service</span> apply. By submitting your
        email you agree to our <span>Privacy & Cookies Notice</span>.
      </small>
    </div>
  );
}

function NewsletterForm() {
  return (
    <form
      className={styles.form}
      onSubmit={(e) => e.preventDefault()}
      {...passwordManagerIgnoreFormAttrs}
    >
      <div className={styles.inputWrap} suppressHydrationWarning>
        <input
          type="email"
          name="newsletter-email"
          placeholder="Email address"
          required
          {...passwordManagerIgnoreAttrs}
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
  );
}

export default function SectionNewsletterSignup() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={styles.wrapper}>
      <div className={styles.inner}>
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

        {mounted ? <NewsletterForm /> : <NewsletterFormPlaceholder />}
      </div>
    </section>
  );
}
