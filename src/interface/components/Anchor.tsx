import { HTMLAttributes, PropsWithChildren } from "react";

interface AnchorProps {
	onClick: HTMLAttributes<HTMLAnchorElement>["onClick"];
	color?: AnchorColor;
	disabled?: boolean;
	className?: HTMLAttributes<HTMLAnchorElement>["className"];
}

export default function Anchor({
	onClick,
	color = `indigo`,
	disabled = false,
	className = ``,
	children,
}: PropsWithChildren<AnchorProps>) {
	if (disabled) onClick = () => {};
	return (
		<a
			onClick={onClick}
			className={`
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opacity-50
                ${disabled ? `cursor-default` : `cursor-pointer`}
				${getColorClasses(color, disabled)}
                ${className}
            `}
		>
			{children}
		</a>
	);
}

type AnchorColor = `indigo` | `light`;

function getColorClasses(color: AnchorColor, disabled: boolean) {
	switch (color) {
		case `indigo`:
			if (disabled) return `text-indigo-300`;
			else
				return `text-indigo-500 hover:text-indigo-600 active:text-indigo-700 focus-visible:ring-indigo-600`;
		case `light`:
			if (disabled) return `text-neutral-300`;
			else
				return `text-neutral-200 hover:text-neutral-400 active:text-neutral-500 focus-visible:ring-neutral-300`;
	}
}
