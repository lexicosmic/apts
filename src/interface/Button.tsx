import { HTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps {
	handleClick: () => void;
	color?: ButtonColor;
	disabled?: boolean;
	className?: HTMLAttributes<HTMLButtonElement>["className"];
}

export default function Button({
	handleClick,
	color = `indigo`,
	disabled = false,
	className = ``,
	children,
}: PropsWithChildren<ButtonProps>) {
	let onClick = handleClick;
	if (disabled) {
		onClick = () => {};
	}

	return (
		<button
			disabled={disabled}
			className={`
			rounded p-1 font-bold
			focus:outline-none focus:ring-2 focus:ring-opacity-50
			disabled:bg-neutral-500 disabled:cursor-default
			${getColorClasses(color)}
			${className}
			`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

type ButtonColor = `indigo` | `light`;

function getColorClasses(color: ButtonColor) {
	switch (color) {
		case `indigo`:
			return `text-white bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus:ring-indigo-600`;
		case `light`:
			return `text-black bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 focus:ring-neutral-300`;
	}
}
