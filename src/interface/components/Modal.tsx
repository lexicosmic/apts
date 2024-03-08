import { HTMLAttributes, PropsWithChildren } from "react";
import ButtonGroup, { ButtonGroupOption } from "./ButtonGroup";

interface ModalBaseProps {
	id: HTMLAttributes<HTMLDivElement>["id"];
	close: () => void;
}
function ModalBase({ id, close, children }: PropsWithChildren<ModalBaseProps>) {
	return (
		<div
			id={id}
			tabIndex={-1}
			className={`overflow-y-hidden overflow-x-hidden fixed top-0 right-0 left-0 z-50
                        w-full md:inset-0 h-full max-h-full py-2 px-2
						bg-neutral-950 bg-opacity-25
                        flex justify-center items-center`}
			onClick={(event) => {
				if (event.target === event.currentTarget && close) close();
			}}
		>
			{children}
		</div>
	);
}

interface ModalProps extends ModalBaseProps {
	footer?: JSX.Element;
}
export default function Modal({
	id,
	close,
	footer,
	children,
}: PropsWithChildren<ModalProps>) {
	return (
		<ModalBase id={id} close={close}>
			<article
				className={`overflow-y-auto w-full max-h-full xs:w-auto xs:min-w-88 p-4 rounded text-black bg-white shadow-md shadow-neutral-900`}
			>
				{children}
				{footer ? (
					footer
				) : (
					<footer>
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
					</footer>
				)}
			</article>
		</ModalBase>
	);
}

interface ModalWithHeaderProps extends ModalProps {
	title: string;
	subtitle?: string;
}
export function ModalWithHeader({
	id,
	close,
	footer,
	title,
	subtitle,
	children,
}: PropsWithChildren<ModalWithHeaderProps>) {
	return (
		<Modal id={id} close={close} footer={footer}>
			<header className={`text-center mb-2`}>
				<h1 className={`text-2xl`} key={`title`}>
					{title}
				</h1>
				{subtitle && (
					<p className={`text-xl font-light`} key={`subtitle`}>
						{subtitle}
					</p>
				)}
			</header>
			{children}
		</Modal>
	);
}

interface ConfirmExclusionModalProps extends ModalProps {
	entityName: string;
	confirm: () => void;
}
export function ConfirmExclusionModal({
	id,
	close,
	entityName,
	confirm,
}: ConfirmExclusionModalProps) {
	const actions: ButtonGroupOption[] = [
		{
			content: <p>Yes, I'm sure</p>,
			color: `red`,
			fontSize: `text-base`,
			handleClick: confirm,
		},
		{
			content: <p>No, cancel</p>,
			color: `light`,
			fontSize: `text-base`,
			handleClick: close,
		},
	];
	return (
		<ModalWithHeader
			id={id}
			title={`Do you want to delete ${entityName}?`}
			subtitle={`That action cannot be undone.`}
			close={close}
			footer={
				<footer>
					<ButtonGroup options={actions} />
				</footer>
			}
		/>
	);
}
