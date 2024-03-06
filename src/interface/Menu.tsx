import { PropsWithChildren, useState } from "react";
import { Key, Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { GameName, ModelInfo } from "../types";
import { formatGameName } from "../util";
import Button from "./Button";
import Icon from "./Icon";
import ManageModels from "./ManageModels";

interface MenuProps {
	gameName: GameName;
	setShowMenuScreen: (show: boolean) => void;
	selectedModel: ModelInfo | null;
	setSelectedModel: (model: ModelInfo | null) => void;
}

export default function Menu({
	gameName,
	setShowMenuScreen,
	selectedModel,
	setSelectedModel,
}: MenuProps) {
	const [selectedDataType, setSelectedDataType] = useState<Key>(`sdt-models`);

	return (
		<article
			className={`w-full flex-grow bg-indigo-950 flex flex-col align-middle`}
		>
			<header
				className={`text-center h-min pt-2 px-2 grid
                            grid-cols-[1fr_auto_1fr] grid-rows-1`}
			>
				<Button
					onClick={() => {
						setShowMenuScreen(false);
					}}
					color={`light`}
					className={`col-start-3 row-start-1 h-min w-min aspect-square ml-auto`}
					ariaLabel={`Close menu and return to main screen`}
				>
					<Icon
						name={`x-lg`}
						fontSize={`text-sm xs:text-base sm:text-lg md:text-xl`}
					/>
				</Button>
				<p
					className={`col-start-2 row-start-1 text-4xl font-light`}
					key={`subtitle`}
				>
					{formatGameName(gameName)}
				</p>
			</header>
			<section className={`mx-2 mb-2 flex-grow flex flex-col`}>
				<Tabs
					selectedKey={selectedDataType}
					onSelectionChange={setSelectedDataType}
					className={`h-full flex flex-col`}
				>
					<TabList
						aria-label={`Stored data`}
						className={`ml-2 flex justify-start gap-0.5`}
					>
						<CustomTab id={`sdt-models`}>Models</CustomTab>
						<CustomTab id={`sdt-history`}>History</CustomTab>
					</TabList>
					<TabPanel id={`sdt-models`} className={`flex-grow`}>
						<ManageModels
							gameName={gameName}
							selectedModel={selectedModel}
							setSelectedModel={setSelectedModel}
						/>
					</TabPanel>
					<TabPanel id={`sdt-history`}>History</TabPanel>
				</Tabs>
			</section>
		</article>
	);
}

interface CustomTabProps {
	id: string;
}
function CustomTab({ id, children }: PropsWithChildren<CustomTabProps>) {
	return (
		<Tab
			id={id}
			className={({ isSelected }) =>
				`text-lg px-2 py-0.5 rounded-t cursor-default ${
					isSelected
						? `text-white bg-neutral-900`
						: `bg-indigo-900 hover:bg-indigo-800`
				}`
			}
		>
			{children}
		</Tab>
	);
}
