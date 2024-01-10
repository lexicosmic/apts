import { HTMLAttributes, useEffect, useRef } from "react";

interface TerminalProps {
	text: string;
	className?: HTMLAttributes<HTMLTextAreaElement>["className"];
}
export default function Terminal({ text, className = `` }: TerminalProps) {
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
			className={`text-black font-mono flex-grow border-2 border-indigo-500 bg-white focus:outline-none ${className}`}
			value={text}
			style={{
				resize: "none",
			}}
		/>
	);
}
