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
			className={`overflow-y-hidden overflow-x-hidden fixed top-0 right-0 left-0 z-50
                        w-full md:inset-0 h-full max-h-full py-2 px-2
						bg-neutral-950 bg-opacity-25
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
			<div
				className={`overflow-y-scroll w-full max-h-full xs:w-auto xs:min-w-88 p-4 rounded bg-white shadow-md shadow-neutral-900`}
			>
				{children}
				{close && (
					<ButtonGroup
						orientation={`horizontal`}
						options={[
							{
								content: <p>Close</p>,
								color: `light`,
								handleClick: close,
							},
						]}
					/>
				)}
			</div>
		</ModalBase>
	);
}

interface ConfirmExclusionModalProps extends ModalProps {
	entityName: string;
	confirm: () => void;
	cancel: () => void;
}

export function ConfirmExclusionModal({
	id,
	entityName,
	confirm,
	cancel,
}: ConfirmExclusionModalProps) {
	const actions: ButtonGroupOption[] = [
		{
			content: <p>Yes, I'm sure</p>,
			color: `red`,
			handleClick: confirm,
		},
		{
			content: <p>No, cancel</p>,
			color: `light`,
			handleClick: cancel,
		},
	];
	return (
		<Modal id={id}>
			<header className={`text-center mb-2`}>
				<h1 className={`text-3xl`} key={`title`}>
					Do you want to delete {entityName}?
				</h1>
				<p className={`text-2xl font-light`} key={`subtitle`}>
					That action cannot be undone.
				</p>
			</header>
			<ButtonGroup options={actions} />
		</Modal>
	);
}
