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
			className={`w-full flex-grow bg-indigo-950 flex flex-col align-middle gap-2`}
		>
			<header
				className={`text-center h-min grid
                            grid-cols-[1fr_auto_1fr] grid-rows-[auto_auto]`}
			>
				<Button
					onClick={() => {
						setShowMenuScreen(false);
					}}
					color={`light`}
					className={`col-start-3 row-start-1 row-span-2 h-min w-min aspect-square ml-auto mt-2 mr-2`}
					ariaLabel={`Close menu and return to main screen`}
				>
					<Icon
						name={`x-lg`}
						fontSize={`text-sm xs:text-base sm:text-lg md:text-xl`}
					/>
				</Button>
				<h1 className={`col-start-2 row-start-1 text-3xl`} key={`title`}>
					Manage {selectedDataType === `sdt-models` ? `Models` : `History`}
				</h1>
				<p
					className={`col-start-2 row-start-2 text-2xl font-light`}
					key={`subtitle`}
				>
					{formatGameName(gameName)}
				</p>
			</header>
			<section className={`mx-2 flex flex-col`}>
				<Tabs
					selectedKey={selectedDataType}
					onSelectionChange={setSelectedDataType}
				>
					<TabList
						aria-label={`Stored data`}
						className={`flex gap-2 justify-center`}
					>
						<CustomTab id={`sdt-models`}>Models</CustomTab>
						<CustomTab id={`sdt-history`}>History</CustomTab>
					</TabList>
					<TabPanel id={`sdt-models`}>
						<ManageModels
							gameName={gameName}
							selectedModel={selectedModel}
							setSelectedModel={setSelectedModel}
							handleReturn={() => setShowMenuScreen(false)}
						/>
					</TabPanel>
					<TabPanel id={`sdt-history`}>History</TabPanel>
				</Tabs>
				{/* <div
					className={`basis-px min-h-full overflow-scroll flex flex-col gap-2`}
				></div> */}
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
				`text-lg px-4 py-2 rounded-md ${
					isSelected
						? `text-black bg-amber-500`
						: `bg-indigo-900 hover:bg-indigo-800`
				}`
			}
		>
			{children}
		</Tab>
	);
}
