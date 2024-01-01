import styles from "./FluidContainer.module.css";
import { PropsWithChildren } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

interface FluidContainerProps {
	headerContent?: JSX.Element | JSX.Element[];
	headerClassName?: React.HTMLAttributes<HTMLDivElement>["className"];
	footerContent?: JSX.Element | JSX.Element[];
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
}
export default function FluidContainer(
	props: PropsWithChildren<FluidContainerProps>
) {
	let className = styles.fluidContainer;
	if (props.className) className += ` ${props.className}`;
	let headerClassName = styles.header;
	if (props.headerClassName) headerClassName += ` ${props.headerClassName}`;
	return (
		<article className={className}>
			{props.headerContent && (
				<Header className={headerClassName}>{props.headerContent}</Header>
			)}
			{props.children}
			{props.footerContent && (
				<Footer className={styles.footer}>{props.footerContent}</Footer>
			)}
		</article>
	);
}
