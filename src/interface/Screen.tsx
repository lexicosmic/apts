import { useEffect, useRef } from "react";

interface ScreenProps {
	text: string;
	square?: boolean;
}
export default function Screen({ text, square = false }: ScreenProps) {
	const ref = useRef<HTMLTextAreaElement>(null);

	// Scroll to bottom when text changes
	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	}, [text]);

	return (
		<textarea
			ref={ref}
			readOnly
			className={`text-black font-mono flex-grow border-2 border-indigo-500 bg-white`}
			value={text}
			style={{
				resize: "none",
			}}
		/>
	);
}
