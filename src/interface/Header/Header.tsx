import styles from "./Header.module.css";
import { PropsWithChildren } from "react";

interface HeaderProps {
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
	orientation?: "horizontal" | "vertical";
}

export default function Header(props: PropsWithChildren<HeaderProps>) {
	let className = styles.header;
	if (props.orientation === "horizontal") className += ` ${styles.horizontal}`;
	else className += ` ${styles.vertical}`;
	if (props.className) className += ` ${props.className}`;
	return (
		<header {...props} className={className}>
			{props.children}
		</header>
	);
}
