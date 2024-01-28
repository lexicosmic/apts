import { HTMLAttributes, PropsWithChildren } from "react";
import ButtonGroup, { ButtonGroupOption } from "./ButtonGroup";

interface ModalBaseProps {
	id: HTMLAttributes<HTMLDivElement>["id"];
}

function ModalBase({ id, children }: PropsWithChildren<ModalBaseProps>) {
	return (
		<div
			id={id}
			tabIndex={-1}
			className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50
                        w-full md:inset-0 h-full max-h-full bg-neutral-950 bg-opacity-25
                        flex justify-center items-center`}
		>
			{children}
		</div>
	);
}

interface ModalProps extends ModalBaseProps {
	close?: () => void;
}

export default function Modal({
	id,
	close,
	children,
}: PropsWithChildren<ModalProps>) {
	return (
		<ModalBase id={id}>
			<div className={`w-full xs:w-auto xs:min-w-88 bg-white rounded p-4 m-2`}>
				{children}
				{close && (
					<button
						className={`w-full mt-4 p-2 rounded bg-neutral-950 text-white`}
						onClick={close}
					>
						Close
					</button>
				)}
			</div>
		</ModalBase>
	);
}

interface ConfirmModalProps extends ModalProps {
	entityName: string;
	confirm: () => void;
	cancel: () => void;
}

export function ConfirmExclusionModal({
	id,
	entityName,
	confirm,
	cancel,
}: ConfirmModalProps) {
	const actions: ButtonGroupOption[] = [
		{
			name: `Yes, I'm sure`,
			color: `red`,
			handleClick: confirm,
		},
		{
			name: `No, cancel`,
			color: `light`,
			handleClick: cancel,
		},
	];
	return (
		<Modal id={id}>
			<article
				className={`w-full flex flex-col gap-2 bg-white rounded p-4 m-2`}
			>
				<header className={`text-center`}>
					<h1 className={`text-4xl`} key={`title`}>
						Do you want to delete {entityName}?
					</h1>
					<p className={`text-2xl font-light`} key={`subtitle`}>
						This action cannot be undone.
					</p>
				</header>
				<ButtonGroup options={actions} />
			</article>
		</Modal>
	);
}
