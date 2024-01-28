import { HTMLAttributes } from "react";
import Button, { ButtonProps } from "./Button";

export interface ButtonGroupOption {
	content: JSX.Element;
	color?: ButtonProps["color"];
	handleClick: () => void;
}

interface ButtonGroupProps {
	options: ButtonGroupOption[];
	orientation?: "horizontal" | "vertical";
	className?: HTMLAttributes<HTMLDivElement>["className"];
}
export default function ButtonGroup({
	options,
	orientation = `vertical`,
	className,
}: ButtonGroupProps) {
	const buttons = options.map((option, index) => (
		<Button
			color={option.color}
			onClick={option.handleClick}
			key={`button_${index}`}
			className={`text-lg flex-grow 
			${index + 1 < options.length ? `rounded-r-none` : ``} 
			${index > 0 ? `rounded-l-none` : ``}
			`}
		>
			{option.content}
		</Button>
	));
	return (
		<section
			className={`w-full flex gap-y-1 gap-x-0 justify-center 
						${orientation === `horizontal` ? `flex-row justify-stretch` : `flex-col`} 
						${className}`}
		>
			{buttons}
		</section>
	);
}
