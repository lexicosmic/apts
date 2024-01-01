import styles from "./Card.module.css";
import { PropsWithChildren } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

interface CardProps {
	headerTitle: string;
	headerSubtitle?: string;
	footerText?: string;
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
}
export default function Card(props: PropsWithChildren<CardProps>) {
	let className = styles.card;
	if (props.className) className += ` ${props.className}`;
	return (
		<article className={className}>
			<Header className={styles.header}>
				<h1 className="header-text-2">{props.headerTitle}</h1>
				{props.headerSubtitle && (
					<p className="display-text-3">{props.headerSubtitle}</p>
				)}
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
