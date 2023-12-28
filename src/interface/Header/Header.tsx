import styles from "./Header.module.css";
import { PropsWithChildren } from "react";

interface HeaderProps {
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

export default function Header(props: PropsWithChildren<HeaderProps>) {
	let className = styles.header;
	if (props.className) className += ` ${props.className}`;
	return (
		<header {...props} className={className}>
			{props.children}
		</header>
	);
}
