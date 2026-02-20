import styles from "./MenuOption.module.css";

interface Props {
  title: string;
  description: string;
  children: any;
  onClick: () => void;
}

export default function MenuOption({
  title,
  description,
  children,
  onClick,
}: Props) {
  return (
    <button className={styles["action-btn"]} onClick={onClick}>
      {children}
      <div className={styles["btn-content"]}>
        <span className={styles["btn-title"]}>{title}</span>
        <span className={styles["btn-description"]}>{description}</span>
      </div>
    </button>
  );
}
