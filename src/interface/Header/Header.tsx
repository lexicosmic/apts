import styles from "./Header.module.css";
import { PropsWithChildren } from "react";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Header(props: PropsWithChildren<HeaderProps>) {
	let className = styles.header;
	if (props.className) className += ` ${props.className}`;
	return <header className={className}>{props.children}</header>;
}
