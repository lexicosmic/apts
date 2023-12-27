import styles from "./Card.module.css";
import { PropsWithChildren } from "react";
import Header from "../Header/Header";

interface CardProps {
	headerText: string;
	footerText?: string;
}
export default function Card(props: PropsWithChildren<CardProps>) {
	return (
		<article className={styles.card}>
			<Header className={styles.header}>
				<h1>{props.headerText}</h1>
			</Header>
			{props.children}
			{props.footerText && (
				<footer className={styles.footer}>
					<p>{props.footerText}</p>
				</footer>
			)}
		</article>
	);
}
