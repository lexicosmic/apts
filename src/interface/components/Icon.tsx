import { FontSize } from "../types";

interface IconProps {
	name: string;
	fontSize?: FontSize;
	ariaLabel?: React.AriaAttributes["aria-label"];
}

export default function Icon({
	name,
	fontSize = `text-2xl`,
	ariaLabel,
}: IconProps) {
	return (
		<i
			{...(ariaLabel && {
				"aria-label": ariaLabel,
			})}
			aria-hidden={ariaLabel ? `false` : `true`}
			className={`bi bi-${name} ${fontSize} flex leading-none justify-center items-center aspect-square `}
		/>
	);
}
