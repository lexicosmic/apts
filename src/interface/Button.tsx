import { HTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps {
	onClick: HTMLAttributes<HTMLButtonElement>["onClick"];
	color?: ButtonColor;
	disabled?: boolean;
	className?: HTMLAttributes<HTMLButtonElement>["className"];
}

export default function Button({
	onClick,
	color = `indigo`,
	disabled = false,
	className = ``,
	children,
}: PropsWithChildren<ButtonProps>) {
	if (disabled) onClick = () => {};
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

type ButtonColor = `indigo` | `light` | `red` | `amber` | `green`;

function getColorClasses(color: ButtonColor) {
	switch (color) {
		case `indigo`:
			return `text-white bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus:ring-indigo-600`;
		case `light`:
			return `text-black bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 focus:ring-neutral-300`;
		case `red`:
			return `text-white bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-600`;
		case `amber`:
			return `text-black bg-amber-400 hover:bg-amber-500 active:bg-amber-600 focus:ring-amber-500`;
		case `green`:
			return `text-white bg-green-500 hover:bg-green-600 active:bg-green-700 focus:ring-green-600`;
	}
}
