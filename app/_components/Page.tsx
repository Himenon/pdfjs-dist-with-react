import type React from "react";
import styles from "./Page.module.css";

export function Page(props: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className={styles.page} style={props.style}>
      {props.children}
    </div>
  );
}
