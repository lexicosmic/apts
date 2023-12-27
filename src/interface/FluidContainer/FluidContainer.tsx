import styles from "./FluidContainer.module.css";
import { PropsWithChildren } from "react";

interface FluidContainerProps {
	headerContent?: JSX.Element;
	footerContent?: JSX.Element;
}
export default function FluidContainer(
	props: PropsWithChildren<FluidContainerProps>
) {
	return (
		<article className={styles.fluidContainer}>
			{props.headerContent && (
				<header className={styles.header}>{props.headerContent}</header>
			)}
			{props.children}
			{props.footerContent && (
				<footer className={styles.footer}>{props.footerContent}</footer>
			)}
		</article>
	);
}
