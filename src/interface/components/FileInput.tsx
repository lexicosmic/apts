import { forwardRef } from "react";

interface FileInputProps {
	id: string;
	name: string;
	accept?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	className?: HTMLInputElement["className"];
}

const FileInput = forwardRef(function FileInput(
	{ id, name, accept, onChange, className }: FileInputProps,
	inputRef: React.Ref<HTMLInputElement>
) {
	return (
		<input
			ref={inputRef}
			id={id}
			name={name}
			type={`file`}
			accept={accept}
			onChange={onChange}
			className={`
                break-keep
                border border-indigo-500 rounded
                file:p-1 file:font-bold file:border-0
				file:focus:outline-none file:focus:ring-2 file:focus:ring-opacity-50
				file:disabled:bg-neutral-500 file:disabled:cursor-default
                file:text-white file:bg-indigo-500 file:hover:bg-indigo-600 file:active:bg-indigo-700 file:focus:ring-indigo-600
                ${className}
            `}
		/>
	);
});
export default FileInput;

// <div className={`flex ${className}`}>
// 	<Button color={`indigo`} className={`rounded-r-none`} onClick={() => {}}>
// 		<p className={`text-center mx-1`}>Browse</p>
// 		<input
// 			id={id}
// 			name={name}
// 			type={`file`}
// 			accept={accept}
// 			onChange={onChange}
// 			className={`hidden`}
// 		/>
// 	</Button>
// 	<p
// 		className={`flex-grow px-2 flex items-center rounded-r border border-l-0 border-indigo-500`}
// 	>
// 		{filePath ?? `No file selected.`}
// 	</p>
// </div>;
