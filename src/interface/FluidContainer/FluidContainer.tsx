import styles from "./FluidContainer.module.css";
import { PropsWithChildren } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

interface FluidContainerProps {
	headerContent?: JSX.Element | JSX.Element[];
	footerContent?: JSX.Element | JSX.Element[];
}
export default function FluidContainer(
	props: PropsWithChildren<FluidContainerProps>
) {
	return (
		<article className={styles.fluidContainer}>
			{props.headerContent && (
				<Header className={styles.header}>{props.headerContent}</Header>
			)}
			{props.children}
			{props.footerContent && (
				<Footer className={styles.footer}>{props.footerContent}</Footer>
			)}
		</article>
	);
}
