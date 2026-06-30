import styles from "./GsceRegistrationForm.module.css";

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
};

export function RegistrationFormField({
  label,
  required,
  error,
  hint,
  children,
  className,
}: Props) {
  return (
    <label className={`${styles.field} ${className ?? ""} ${error ? styles.fieldError : ""}`}>
      <span>
        {label}
        {required ? <span className={styles.requiredMark}> *</span> : null}
      </span>
      {children}
      {hint && !error ? <small className={styles.hint}>{hint}</small> : null}
      {error ? <small className={styles.fieldErrorText}>{error}</small> : null}
    </label>
  );
}

export function RegistrationFormFieldFull({
  label,
  required,
  error,
  hint,
  children,
}: Props) {
  return (
    <label className={`${styles.fieldFull} ${error ? styles.fieldError : ""}`}>
      <span>
        {label}
        {required ? <span className={styles.requiredMark}> *</span> : null}
      </span>
      {children}
      {hint && !error ? <small className={styles.hint}>{hint}</small> : null}
      {error ? <small className={styles.fieldErrorText}>{error}</small> : null}
    </label>
  );
}
