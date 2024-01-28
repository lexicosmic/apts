import { HTMLAttributes, PropsWithChildren } from "react";

interface IconProps {
	name: string;
	fontSize?: "text-xl" | "text-2xl" | "text-3xl" | "text-4xl";
}

export default function Icon({ name, fontSize = "text-2xl" }: IconProps) {
	return (
		<i
			className={`bi bi-${name} ${fontSize} flex leading-none justify-center items-center aspect-square `}
		/>
	);
}
