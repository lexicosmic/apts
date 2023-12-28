import styles from "./Footer.module.css";
import { PropsWithChildren } from "react";

interface FooterProps {
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

export default function Footer(props: PropsWithChildren<FooterProps>) {
	let className = styles.footer;
	if (props.className) className += ` ${props.className}`;
	return (
		<footer {...props} className={className}>
			{props.children}
		</footer>
	);
}
