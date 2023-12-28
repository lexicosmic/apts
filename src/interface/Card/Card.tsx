import styles from "./Card.module.css";
import { PropsWithChildren } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

interface CardProps {
	headerText: string;
	footerText?: string;
}
export default function Card(props: PropsWithChildren<CardProps>) {
	return (
		<article className={styles.card}>
			<Header className={styles.header}>
				<h1 className="header-text-1">{props.headerText}</h1>
			</Header>
			{props.children}
			{props.footerText && (
				<Footer className={styles.footer}>
					<p>{props.footerText}</p>
				</Footer>
			)}
		</article>
	);
}
